const EventDispatcher = require('../direct');

describe('When using direct', () => {
  it('should export EventDispatcher as is', () => {
    expect(EventDispatcher).toEqual(expect.any(Function));
  });
});
