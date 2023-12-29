const { Character } = require('./_character.js');
class Pain extends Character
{
  constructor(owner)
  {
    super(owner, 'Pain', 10000, ['Solid Defense'], ['Suffering']);
  }
}
module.exports = Pain

