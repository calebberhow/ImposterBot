const { Character } = require('./_character.js');
class Dragon extends Character {
  constructor(owner){
    super(owner,'Dragon', 100, ['Perfect Aim', 'Ice'], ['Fireball', 'Fierce Roar']);
  }
  attack(target) {
    this.super_attack([this.fireball.bind(this, target), this.fierce_roar.bind(this, target)], target);
  }
}
module.exports = Dragon