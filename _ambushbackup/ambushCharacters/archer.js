const { Character } = require('./_character.js');
class Archer extends Character {
  constructor(owner){
    super(owner,'Archer', 90, ['Spellcast', 'Solid Defense'], ['Perfect Aim', 'Sneak']);
  }
  attack(target) {
    this.super_attack([this.perfect_aim.bind(this, target), this.sneak.bind(this, target)], target);
  }
}
module.exports = { Archer }