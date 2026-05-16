import {describe, expect, test} from 'vite-plus/test';

describe('test runner', () => {
  test('smoke', () => {
    expect(1 + 1).toBe(2);
  });
});
