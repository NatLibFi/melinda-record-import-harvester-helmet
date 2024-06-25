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
  userAgent: readEnvironmentVariable('API_CLIENT_USER_AGENT', {defaultValue: '_RECORD-IMPORT-HARVESTER-HELMET'}),
  allowSelfSignedApiCert: readEnvironmentVariable('ALLOW_API_SELF_SIGNED', {defaultValue: false, format: parseBoolean})
};

export const keycloakOptions = {
  issuerBaseURL: readEnvironmentVariable('KEYCLOAK_ISSUER_BASE_URL', {defaultValue: 'KEYCLOAK_ISSUER_BASE_URL env is not set!'}),
  serviceClientID: readEnvironmentVariable('KEYCLOAK_SERVICE_CLIENT_ID', {defaultValue: 'KEYCLOAK_SERVICE_CLIENT_ID env is not set!'}),
  serviceClientSecret: readEnvironmentVariable('KEYCLOAK_SERVICE_CLIENT_SECRET', {defaultValue: 'KEYCLOAK_SERVICE_CLIENT_SECRET env is not set!'})
};
