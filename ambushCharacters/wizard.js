const { Character } = require('./_character.js');
class Wizard extends Character {
  constructor(owner){
    super(owner, 'Wizard', 80, ['Dark Magic', 'Vital Strike'], ['Spellcast', 'Curse']);
  }
  attack(target) {
    this.super_attack([this.spellcast.bind(this, target), this.curse.bind(this, target)], target);
  }
}
module.exports = Wizard