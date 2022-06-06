import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import * as testContext from './filter';

const FIXTURES_PATH = path.join(__dirname, '../test-fixtures/filter');

describe('filter', () => {
  fs.readdirSync(FIXTURES_PATH).forEach(file => {
    it(file, () => {
      const fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_PATH, file), 'utf8'));
      expect(testContext.default(fixture.record, fixture.earliestCatalogingTime)).to.equal(fixture.result);
    });
  });
});
