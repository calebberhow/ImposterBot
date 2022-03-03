const { Character } = require('./_character.js');
class Archer extends Character {
  constructor(owner){
    super(owner,'Archer', 90, ['Spellcast', 'Solid Defense'], ['Perfect Aim', 'Sneak Attack']);
  }
}
module.exports = Archer