import fs from 'fs';
import {URL} from 'url';
import moment from 'moment';
import fetch from 'node-fetch';
import HttpStatusCodes from 'http-status-codes';
import nodeUtils from 'util';
import {Utils} from '@natlibfi/melinda-commons';
import filterRecord from './filter';

const {createLogger} = Utils;

export default function ({recordsCallback, apiURL, apiKey, apiSecret, recordsFetchLimit, pollInterval, pollChangeTimestamp, changeTimestampFile, earliestCatalogTime = moment(), onlyOnce = false}) {
  const logger = createLogger();

  return process();

  async function process({authorizationToken, pollChangeTime} = {}) {
    const setTimeoutPromise = nodeUtils.promisify(setTimeout);

    pollChangeTime = pollChangeTime || getPollChangeTime(); // eslint-disable-line no-param-reassign
    authorizationToken = await validateAuthorizationToken(authorizationToken); // eslint-disable-line require-atomic-updates, no-param-reassign

    const timeBeforeFetching = moment();

    logger.log('info', `Fetching records updated between ${pollChangeTime.format()} - ${timeBeforeFetching.format()}`);
    await harvest({endTime: timeBeforeFetching});

    if (!onlyOnce) {
      logger.log('info', `Waiting ${pollInterval / 1000} seconds before polling again`);

      await setTimeoutPromise(pollInterval);
      writePollChangeTimestamp(timeBeforeFetching);

      return process({authorizationToken, pollChangeTime: timeBeforeFetching.add(1, 'seconds')});
    }

    function getPollChangeTime() {
      if (fs.existsSync(changeTimestampFile)) {
        const data = JSON.parse(fs.readFileSync(changeTimestampFile, 'utf8'));
        return moment(data.timestamp);
      }

      if (pollChangeTimestamp) {
        return moment(pollChangeTimestamp);
      }

      return moment();
    }

    function writePollChangeTimestamp(time) {
      fs.writeFileSync(changeTimestampFile, JSON.stringify({
        timestamp: time.format()
      }));
    }

    async function validateAuthorizationToken(token) {
      if (token) {
        const response = await fetch(`${apiURL}/info/token`);
        if (response.status === HttpStatusCodes.OK) {
          return token;
        }
      }

      return authenticate();

      async function authenticate() {
        const credentials = `${apiKey}:${apiSecret}`;
        const response = await fetch(`${apiURL}/token`, {
          method: 'POST', headers: {
            Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`
          }
        });

        const body = await response.json();
        return body.access_token;
      }
    }

    async function harvest({offset = 0, endTime} = {}) {
      const url = new URL(`${apiURL}/bibs`);

      url.searchParams.set('offset', offset);
      url.searchParams.set('limit', recordsFetchLimit);
      url.searchParams.set('deleted', false);
      url.searchParams.set('fields', 'id,materialType,varFields,catalogDate');
      url.searchParams.set('updatedDate', generateTimespan(endTime));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${authorizationToken}`,
          Accept: 'application/json'
        }
      });

      if (response.status === HttpStatusCodes.OK) {
        const result = await response.json();
        logger.log('debug', `Retrieved ${result.entries.length} records`);

        const filtered = result.entries.filter(r => filterRecord(r, earliestCatalogTime));
        logger.log('debug', `${filtered.length}/${result.entries.length} records passed the filter`);

        if (filtered.length > 0) { // eslint-disable-line functional/no-conditional-statement
          await recordsCallback(filtered);
        }

        if (result.entries.length === recordsFetchLimit) {
          return harvest({
            offset: offset + recordsFetchLimit,
            endTime
          });
        }
      } else if (response.status === HttpStatusCodes.NOT_FOUND) { // eslint-disable-line functional/no-conditional-statement
        logger.log('debug', 'No records found');
      } else {
        throw new Error(`Received HTTP ${response.status} ${response.statusText}`);
      }

      function generateTimespan(endTime) {
        return `[${pollChangeTime.format()},${endTime.format()}]`;
      }
    }
  }
}
