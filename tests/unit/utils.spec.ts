import { extractRootDirectory } from '../../src/common/utils';

describe('utils', () => {
  describe('extractRootDirectory', () => {
    const expectedResult = 'sources';
    const cases = [
      'sources',
      '/sources',
      'sources/',
      '/sources/',
      'sources/test',
      '/sources/test',
      '/sources/test/',
      'sources/test/',
      'sources/test/gpkg',
      '/sources/test/gpkg',
      'sources/test/gpkg/',
      '/sources/test/gpkg/',
    ];

    it.each(cases)(`given %p as argument, expected result: ${expectedResult}`, (path) => {
      const result = extractRootDirectory(path);
      expect(result).toBe(expectedResult);
    });
  });
});
