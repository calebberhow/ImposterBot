const { Character } = require('./_character.js');
class Frozen_Spirit extends Character
{
  constructor(owner)
  {
    super(owner, 'Frozen Spirit', 80, ['Curse', 'Fireball'], ['Dark Magic', 'Ice']);
  }
  attack(target)
  {
    this.super_attack([this.dark_magic.bind(this, target), this.ice.bind(this, target)], target);
  }
}
module.exports = Frozen_Spirit;