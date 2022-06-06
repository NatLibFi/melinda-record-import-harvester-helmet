import {Harvester} from '@natlibfi/melinda-record-import-commons';
import createHarvestCallback from './harvest';

const {startHarvester} = Harvester;

import {
  RECORDS_FETCH_LIMIT, POLL_INTERVAL, EARLIEST_CATALOG_TIME,
  POLL_CHANGE_TIMESTAMP, CHANGE_TIMESTAMP_FILE,
  HELMET_API_URL, HELMET_API_KEY, HELMET_API_SECRET
} from './config';

startHarvester(({recordsCallback}) => createHarvestCallback({
  recordsCallback,
  apiURL: HELMET_API_URL,
  apiKey: HELMET_API_KEY,
  apiSecret: HELMET_API_SECRET,
  pollChangeTimestamp: POLL_CHANGE_TIMESTAMP,
  pollInterval: POLL_INTERVAL,
  changeTimestampFile: CHANGE_TIMESTAMP_FILE,
  recordsFetchLimit: RECORDS_FETCH_LIMIT,
  earliestCatalogTime: EARLIEST_CATALOG_TIME
}));
