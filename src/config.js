import {parseBoolean} from '@natlibfi/melinda-commons';
import {readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';

// Default is 30 minutes
export const pollInterval = readEnvironmentVariable('POLL_INTERVAL', {defaultValue: 1800000, format: v => Number(v)});
export const recordsFetchLimit = readEnvironmentVariable('RECORDS_FETCH_LIMIT', {defaultValue: 1000, format: v => Number(v)});

export const earliestCatalogTime = readEnvironmentVariable('EARLIEST_CATALOG_TIME', {defaultValue: '2018-09-01'});
export const changeTimestampFile = readEnvironmentVariable('CHANGE_TIMESTAMP_FILE', {defaultValue: '.poll-change-timestamp.json'});
export const pollChangeTimestamp = readEnvironmentVariable('POLL_CHANGE_TIMESTAMP', {defaultValue: false, format: v => parseBoolean(v)});

export const profileId = readEnvironmentVariable('PROFILE_ID', {defaultValue: 'USER'});
export const blobContentType = readEnvironmentVariable('BLOB_CONTENT_TYPE', {defaultValue: 'application/json'});

export const helmetApiOptions = {
  helmetApiUrl: readEnvironmentVariable('HELMET_API_URL'),
  helmetApiKey: readEnvironmentVariable('HELMET_API_KEY'),
  helmetApiSecret: readEnvironmentVariable('HELMET_API_SECRET')
};

export const recordImportApiOptions = {
  recordImportApiUrl: readEnvironmentVariable('RECORD_IMPORT_API_URL', {defaultValue: 'cli'}),
  recordImportApiUsername: readEnvironmentVariable('RECORD_IMPORT_API_USERNAME_HARVESTER', {defaultValue: 'cli'}),
  recordImportApiPassword: readEnvironmentVariable('RECORD_IMPORT_API_PASSWORD_HARVESTER', {defaultValue: 'cli', hideDefault: true}),
  userAgent: readEnvironmentVariable('API_CLIENT_USER_AGENT', {defaultValue: '_RECORD-IMPORT-HARVESTER-HELMET'})
};
