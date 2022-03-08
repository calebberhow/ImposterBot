const lib = require('./lib.js')

test("randMessage()", () => {
    list = ['apple','banana','fruit','vegetable'];
    weights_1 = [0, 0, 1, 0];
    weights_2 = [0, 0, 0.5, 0.5];
    weights_3 = [1]
    for (let i = 0; i < 50; i++) {
        expect(list.includes(lib.randMessage(list))).toBe(true);
        expect(lib.randMessage(list, weights_1)).toBe('fruit');
        expect(['fruit','vegetable'].includes(lib.randMessage(list, weights_2))).toBe(true);
        expect(lib.randMessage(list, weights_3, true)).toBe(null)
    }
});

test('isModerator()', () => {
    member_moderator = {roles: {cache: [{name: "Moderator"}]}};
    member_not_moderator = {roles: {cache: [{name: "Member"}]}};
    expect(lib.isModerator(member_moderator)).toBe(true)
    expect(lib.isModerator(member_not_moderator)).toBe(false)
});

test('moderate()', () => {
    expect(lib.moderate({content: "foo"}, true)).toBe(false)
    expect(lib.moderate({content: "fag"}, true)).toBe(true)
    expect(lib.moderate({content: "fags"}, true)).toBe(true)
    expect(lib.moderate({content: "retardsthesa"}, true)).toBe(true)
    expect(lib.moderate({content: "kys"}, true)).toBe(true)
    expect(lib.moderate({content: "whores"}, true)).toBe(true)
    expect(lib.moderate({content: "fagsss"}, true)).toBe(true)
    expect(lib.moderate({content: "niggersa"}, true)).toBe(true)
    expect(lib.moderate({content: "tranny"}, true)).toBe(true)
    expect(lib.moderate({content: "killxd yourselfasdffh"}, true)).toBe(true)
});