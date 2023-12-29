const { Character } = require('./_character.js');
class Swordsman extends Character
{
  constructor(owner)
  {
    super(owner, 'Swordsman', 100, ['Fierce Roar', 'Haunt'], ['Vital Strike', 'Solid Defense']);
  }
  attack(target)
  {
    this.super_attack([this.vital_strike.bind(this, target), this.solid_defense.bind(this, target)], target);
  }
}
module.exports = Swordsman;