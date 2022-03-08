const lib = require('./lib.js')

test("randMessage()", () => {
    list = ['apple','banana','fruit','vegetable'];
    weights_1 = [0, 0, 1, 0];
    weights_2 = [0, 0, 0.5, 0.5];
    expect(list.includes(lib.randMessage(list))).toBe(true);
    expect(lib.randMessage(list, weights_1)).toBe('fruit');
    expect(['fruit','vegetable'].includes(lib.randMessage(list, weights_2))).toBe(true);
});
