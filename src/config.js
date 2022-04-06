/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Helmet record harvester for the Melinda record batch import system
*
* Copyright (c) 2018-2022 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-record-import-harvester-helmet
*
* melinda-record-import-harvester-helmet program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-record-import-harvester-helmet is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/
import {readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';
import {parseBoolean} from '@natlibfi/melinda-commons';

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
