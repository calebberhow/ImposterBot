const { Character } = require('./_character.js');
class Phantom extends Character {
  constructor(owner){
    super(owner, 'Phantom', 100,['Terrorize', 'Curse'], ['Bulletproof', 'Haunt']);
  }
  attack(target) {
    this.super_attack([this.bulletproof.bind(this, target), this.haunt.bind(this, target)], target);
  }
}
module.exports = { Phantom }