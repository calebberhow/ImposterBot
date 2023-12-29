import { Character, Abilities } from "./Character.js";

class Assassin extends Character
{
  constructor(owner: string)
  {
    super(owner, 'Assassin', 90, [Abilities.SneakAttack, Abilities.SpectralShift], [Abilities.SilverBullet, Abilities.Execute]);
  }
}

export default Assassin

