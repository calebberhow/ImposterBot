const lib = require('./lib.js');

test("randMessage()", () =>
{
  list_1 = [['apple', 0], ['banana', 0], 'fruit', ['vegetable', 0]];
  list_2 = [['apple', 0], ['banana', 0], 'fruit', 'vegetable'];
  weights_1 = [0, 0, 1, 0];
  weights_2 = [0, 0, 0.5, 0.5];
  for (let i = 0; i < 50; i++)
  {
    expect(lib.randMessage(list_1)).toBe('fruit');
    expect(['fruit', 'vegetable'].includes(lib.randMessage(list_2))).toBe(true);
  }
});

test('isModerator()', () =>
{
  member_moderator = { roles: { cache: [{ name: "Moderator" }] } };
  member_not_moderator = { roles: { cache: [{ name: "Member" }] } };
  expect(lib.isModerator(member_moderator)).toBe(true);
  expect(lib.isModerator(member_not_moderator)).toBe(false);
});

test('moderate()', () =>
{
  expect(lib.moderate({ content: "foo" }, true)).toBe(false);
  expect(lib.moderate({ content: "fag" }, true)).toBe(true);
  expect(lib.moderate({ content: "fags" }, true)).toBe(true);
  expect(lib.moderate({ content: "retardsthesa" }, true)).toBe(true);
  expect(lib.moderate({ content: "kys" }, true)).toBe(true);
  expect(lib.moderate({ content: "whores" }, true)).toBe(true);
  expect(lib.moderate({ content: "fagsss" }, true)).toBe(true);
  expect(lib.moderate({ content: "niggersa" }, true)).toBe(true);
  expect(lib.moderate({ content: "tranny" }, true)).toBe(true);
  expect(lib.moderate({ content: "killxd yourselfasdffh" }, true)).toBe(true);
});