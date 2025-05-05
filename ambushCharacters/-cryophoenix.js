const { Character } = require('./_character.js');
class Cryophoenix extends Character
{
  constructor(owner)
  {
    super(owner, 'Cryophoenix', 100, ['Fireball', 'Dark Magic'], ['Crystal Shard', 'Restore']);
  }
  attack(target)
  {
    this.super_attack([this.crystal_shard.bind(this, target), this.restore.bind(this, target)], target);
  }
}
module.exports = Cryophoenix;