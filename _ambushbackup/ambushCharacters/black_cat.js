const { Character } = require('./_character.js');
class Black_Cat extends Character {
  constructor(owner){
    super(owner, 'Black Cat', 90, ['Strong Jaw', 'Haunt'], ['Bad Luck', 'Sneak']);
  }
  attack(target) {
    this.super_attack([this.bad_luck.bind(this, target), this.sneak.bind(this, target)], target);
  }
}
module.exports = { Black_Cat }