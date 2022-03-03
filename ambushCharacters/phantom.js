const { Character } = require('./_character.js');
class Phantom extends Character {
  constructor(owner){
    super(owner, 'Phantom', 90,['Terrorize', 'Curse'], ['Spectral Shift', 'Haunt']);
  }
}
module.exports = Phantom