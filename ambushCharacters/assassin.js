const { Character } = require('./_character.js');
class Assassin extends Character {
  constructor(owner){
    super(owner, 'Assassin', 90, ['Sneak Attack', 'Spectral Shift'], ['Silver Bullet', 'Execute']);
  }
}
module.exports = Assassin

