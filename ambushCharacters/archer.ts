import { Character, Abilities } from './Character.js';

class Archer extends Character {
  constructor(owner: string)
  {
    super(owner,'Archer', 90, [Abilities.Spellcast, Abilities.SolidDefense], [Abilities.PerfectAim, Abilities.SneakAttack]);
  }
}

export default Archer