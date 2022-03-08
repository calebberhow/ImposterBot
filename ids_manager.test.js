const ids = require('./ids_manager.js')

test('Check for "cozy" as USAGE', () => {
    expect(ids.USAGE).toBe("cozy");
});
