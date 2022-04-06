# Helmet record harvester for the Melinda record batch import system   [![Build Status](https://travis-ci.org/NatLibFi/melinda-record-import-harvester-helmet.svg)](https://travis-ci.org/NatLibFi/melinda-record-import-harvester-helmet) [![Test Coverage](https://codeclimate.com/github/NatLibFi/melinda-record-import-harvester-helmet/badges/coverage.svg)](https://codeclimate.com/github/NatLibFi/melinda-record-import-harvester-helmet/coverage)

Helmet record harvester for the Melinda record batch import system . Polls Helmet's [Sierra ILS](https://sandbox.iii.com/iii/sierra-api/swagger/index.html) for changes in records.

## Enviromental variables
### Helmet connection envs
| name           | description | mandatory | Used in |
|----------------|-------------|-----------|---------|
| HELMET_API_URL |             | Yes       | Both    |
| HELMET_API_URL |             | Yes       | Both    |
| HELMET_API_URL |             | Yes       | Both    |

### Record-import connection envs
| Name                                 | Description | Mandatory | Used in    |
|--------------------------------------|-------------|-----------|------------|
| RECORD_IMPORT_API_URL                |             | No        | Automation |
| RECORD_IMPORT_API_USERNAME_HARVESTER |             | No        | Automation |
| RECORD_IMPORT_API_PASSWORD_HARVESTER |             | No        | Automation |
| API_CLIENT_USER_AGENT                |             | No        | Automation |

### Parametter envs envs
| name                | description           | default                     | Used in    |
|---------------------|-----------------------|-----------------------------|------------|
| profileId           |                       | 'USER'                      | Automation |
| blobContentType     |                       | 'application/json'          | Automation |
| pollChangeTimestamp |                       | null                        | Both       |
| changeTimestampFile |                       | .poll-change-timestamp.json | Both       |
| earliestCatalogTime |                       | 2018-09-01                  | Both       |
| pollInterval        | Default is 30 minutes | 1800000                     | Both       |
| recordsFetchLimit   |                       | 1000                        | Both       |
| onlyOnce            |                       | false                       | Cli        |

## License and copyright

Copyright (c) 2018-2022 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **GNU Affero General Public License Version 3** or any later version.
