import fs from 'fs';
import {URL} from 'url';
import moment from 'moment';
import fetch from 'node-fetch';
import httpStatus from 'http-status';
import {promisify} from 'util';
import filterRecord from './filter';
import {createLogger} from '@natlibfi/melinda-backend-commons';

export async function startApp(config, riApiClient = false) {
  const {
    profileId,
    blobContentType,
    helmetApiOptions,
    recordsFetchLimit,
    pollInterval,
    pollChangeTimestamp,
    changeTimestampFile,
    earliestCatalogTime = moment(),
    onlyOnce = false,
    recordsCallback = createBlob
  } = config;
  const logger = createLogger();

  try {
    await process();
  } catch (err) {
    logger.error(err instanceof Error ? err.stack : err);
    throw err;
  }

  async function process({authorizationToken, pollChangeTime} = {}) {
    const setTimeoutPromise = promisify(setTimeout);

    pollChangeTime = pollChangeTime || getPollChangeTime(); // eslint-disable-line no-param-reassign
    authorizationToken = await validateAuthorizationToken(authorizationToken); // eslint-disable-line require-atomic-updates, no-param-reassign

    const timeBeforeFetching = moment();

    logger.info(`Fetching records updated between ${pollChangeTime.format()} - ${timeBeforeFetching.format()}`);
    logger.info('This might take several minutes!');
    await harvest({endTime: timeBeforeFetching});

    if (!onlyOnce) {
      logger.info(`Waiting ${pollInterval / 1000} seconds before polling again`);

      await setTimeoutPromise(pollInterval);
      writePollChangeTimestamp(timeBeforeFetching);

      return process({authorizationToken, pollChangeTime: timeBeforeFetching.add(1, 'seconds')});
    }

    function getPollChangeTime() {
      if (fs.existsSync(changeTimestampFile)) { // eslint-disable-line functional/no-conditional-statement
        try {
          const txtData = fs.readFileSync(changeTimestampFile, 'utf8');

          if (txtData.length < 2) {
            return moment();
          }

          const data = JSON.parse(txtData);
          return moment(data.timestamp);
        } catch (error) {
          logger.error(`time stamp loading failed: ${error.message}`);
          return moment().startOf('day');
        }
      }

      if (pollChangeTimestamp) {
        return moment(pollChangeTimestamp);
      }

      return moment().startOf('day');
    }

    function writePollChangeTimestamp(time) {
      fs.writeFileSync(changeTimestampFile, JSON.stringify({
        timestamp: time.format()
      }));
    }

    async function validateAuthorizationToken(token) {
      if (token) {
        const response = await fetch(`${helmetApiOptions.helmetApiUrl}/info/token`);
        if (response.status === httpStatus.OK) {
          return token;
        }

        return authenticate();
      }

      return authenticate();

      async function authenticate() {
        const credentials = `${helmetApiOptions.helmetApiKey}:${helmetApiOptions.helmetApiSecret}`;
        const response = await fetch(`${helmetApiOptions.helmetApiUrl}/token`, {
          method: 'POST', headers: {
            Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`
          }
        });

        const body = await response.json();
        return body.access_token;
      }
    }

    async function harvest({offset = 0, endTime} = {}) {
      const url = new URL(`${helmetApiOptions.helmetApiUrl}/bibs`);

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

      if (response.status === httpStatus.OK) {
        const result = await response.json();
        logger.debug(`Retrieved ${result.entries.length} records`);

        const filtered = result.entries.filter(r => filterRecord(r, earliestCatalogTime));
        logger.debug(`${filtered.length}/${result.entries.length} records passed the filter`);

        if (filtered.length > 0) { // eslint-disable-line functional/no-conditional-statement
          await recordsCallback(filtered);
        }

        if (result.entries.length === recordsFetchLimit) {
          return harvest({
            offset: offset + recordsFetchLimit,
            endTime
          });
        }

        return logger.debug('No more records this time');
      }

      if (response.status === httpStatus.NOT_FOUND) { // eslint-disable-line functional/no-conditional-statement
        return logger.debug('No records found');
      }

      throw new Error(`Received HTTP ${response.status} ${response.statusText}`);

      function generateTimespan(endTime) {
        return `[${pollChangeTime.format()},${endTime.format()}]`;
      }
    }
  }

  async function createBlob(payload) {
    const id = await riApiClient.createBlob({
      blob: JSON.stringify(payload),
      type: blobContentType,
      profile: profileId
    });

    logger.info(`Created new blob ${id}`);
  }
}
