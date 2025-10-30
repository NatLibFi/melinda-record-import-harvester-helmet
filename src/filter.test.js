import fs from 'fs';
import path from 'path';
import assert from 'node:assert';
import {describe, it} from 'node:test';
import * as testContext from './filter.js';


const FIXTURES_PATH = path.join(import.meta.dirname, '../test-fixtures/filter');

describe('filter', () => {
  fs.readdirSync(FIXTURES_PATH).forEach(file => {
    it(file, () => {
      const fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_PATH, file), 'utf8'));
      assert.deepStrictEqual(testContext.default(fixture.record, fixture.earliestCatalogingTime), fixture.result);
    });
  });
});
