const { Character } = require('./_character.js');
class Swordsman extends Character {
  constructor(owner){
    super(owner, 'Swordsman', 110, ['Fierce Roar', 'Sneak'], ['Swords', 'Solid Defense']);
  }
  attack(target) {
    this.super_attack([this.swords.bind(this, target), this.solid_defense.bind(this, target)], target);
  }
}
module.exports = { Swordsman }