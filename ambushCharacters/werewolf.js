const { Character } = require('./_character.js');
class Werewolf extends Character {
  constructor(owner){
    super(owner, 'Werewolf', 120, ['Silver Bullet',"Spectral Shift","Haunt"], ['Terrorize', 'Solid Defense']);
  }
  attack(target) {
    this.super_attack([this.terrorize.bind(this, target), this.strong_jaw.bind(this, target)], target);
  }
}
module.exports = Werewolf