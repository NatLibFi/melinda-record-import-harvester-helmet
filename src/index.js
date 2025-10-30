import {handleInterrupt, createLogger} from '@natlibfi/melinda-backend-commons';
import {createApiClient as createRecordImportApiClient} from '@natlibfi/melinda-record-import-commons';
import * as config from './config.js';
import {startApp} from './harvest.js';

const logger = createLogger();
run();

async function run() {
  registerInterruptionHandlers();

  const riApiClient = await createRecordImportApiClient(config.recordImportApiOptions, config.keycloakOptions);

  await startApp(config, riApiClient);

  function registerInterruptionHandlers() {
    process
      .on('SIGTERM', handleSignal)
      .on('SIGINT', handleInterrupt)
      .on('uncaughtException', ({stack}) => {
        handleTermination({code: 1, message: stack});
      })
      .on('unhandledRejection', ({stack}) => {
        handleTermination({code: 1, message: stack});
      });

    function handleSignal(signal) {
      handleTermination({code: 1, message: `Received ${signal}`});
    }
  }

  function handleTermination({code = 0, message = false}) {
    logMessage(message);

    process.exit(code);

    function logMessage(message) {
      if (message) {
        return logger.error(message);
      }
    }
  }
}
