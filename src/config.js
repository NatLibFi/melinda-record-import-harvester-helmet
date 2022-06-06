import {Utils} from '@natlibfi/melinda-commons';

const {readEnvironmentVariable} = Utils;

// Default is 30 minutes
export const POLL_INTERVAL = readEnvironmentVariable('POLL_INTERVAL', {defaultValue: 1800000, format: v => Number(v)});
export const RECORDS_FETCH_LIMIT = readEnvironmentVariable('RECORDS_FETCH_LIMIT', {defaultValue: 1000, format: v => Number(v)});

export const EARLIEST_CATALOG_TIME = readEnvironmentVariable('EARLIEST_CATALOG_TIME', {defaultValue: '2018-09-01'});
export const CHANGE_TIMESTAMP_FILE = readEnvironmentVariable('CHANGE_TIMESTAMP_FILE', {defaultValue: '.poll-change-timestamp.json'});
export const POLL_CHANGE_TIMESTAMP = readEnvironmentVariable('POLL_CHANGE_TIMESTAMP', {defaultValue: null});

export const HELMET_API_URL = readEnvironmentVariable('HELMET_API_URL');
export const HELMET_API_KEY = readEnvironmentVariable('HELMET_API_KEY');
export const HELMET_API_SECRET = readEnvironmentVariable('HELMET_API_SECRET');
