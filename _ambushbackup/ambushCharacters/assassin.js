const { Character } = require('./_character.js');
class Assassin extends Character {
  constructor(owner){
    super(owner, 'Assassin', 90, ['Haunt', 'Bullet Proof'], ['Silver Bullet', 'Sniper']);
  }
  attack(target) {
    this.super_attack([this.silver_bullet.bind(this, target), this.sniper.bind(this, target)], target);
  }
}
module.exports = { Assassin }