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

import {startApp} from './harvest';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import {sync as rmdir} from 'rimraf';
import * as config from './config';
import {createLogger} from '@natlibfi/melinda-backend-commons';

cli();

async function cli() {
  const logger = createLogger();
  const args = yargs(process.argv.slice(2))
    .scriptName('melinda-record-import-harvester-helmet')
    .epilog('Copyright (C) 2019-2022 University Of Helsinki (The National Library Of Finland)')
    .usage('$0 <outputDirectory> [options] and env variable info in README')
    .showHelpOnFail(true)
    .example([['$ node $0/dist/cli.js ']])
    .env('HARVEST_HELMET')
    .positional('outputDirectory', {type: 'string', describe: 'Directory to write files to'})
    .options({
      y: {type: 'boolean', default: false, alias: 'overwriteDirectory', describe: 'Recreate the output directory if it exists'},
      o: {type: 'boolean', default: false, alias: 'onlyOnce', describe: 'Fetch only once'}
    })
    .check((args) => {
      const [outputDirectory] = args._;
      if (outputDirectory === undefined) {
        throw new Error('No output directory argument given');
      }

      if (fs.existsSync(outputDirectory)) {
        if (args.overwriteDirectory) {
          rmdir(outputDirectory);
          return true;
        }

        throw new Error(`Directory ${outputDirectory} already exists!`);
      }

      return true;
    })
    .parseSync();

  logger.info(`Args ${JSON.stringify(args)}`);
  const [outputDirectory] = args._;
  logger.info(`Creating folder ${outputDirectory}`);
  fs.mkdirSync(outputDirectory);
  let count = 0; // eslint-disable-line functional/no-let

  try {
    await startApp({
      ...config,
      onlyOnce: args.onlyOnce,
      recordsCallback: records => {
        logger.debug(`Writing file ${count}`);
        const data = JSON.stringify(records, undefined, 2); // eslint-disable-line callback-return
        fs.writeFileSync(path.join(outputDirectory, String(count)), data);
        count += 1;
      }
    });
  } catch (error) {
    logger.error(error);
  }
}
