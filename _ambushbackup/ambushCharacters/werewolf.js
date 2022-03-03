const { Character } = require('./_character.js');
class Werewolf extends Character {
  constructor(owner){
    super(owner, 'Werewolf', 100, ['Spell Cast', 'Silver Bullet'], ['Terrorize', 'Strong Jaw']);
  }
  attack(target) {
    this.super_attack([this.terrorize.bind(this, target), this.strong_jaw.bind(this, target)], target);
  }
}
module.exports = { Werewolf }