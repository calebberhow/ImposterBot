import { Character, Abilities } from "./Character.js";

class Wizard extends Character
{
  constructor(owner)
  {
    super(owner, 'Wizard', 80, [Abilities.DarkMagic, Abilities.VitalStrike], [Abilities.Spellcast, Abilities.Curse]);
  }

  attack(target) 
  {
    this.super_attack([this.spellcast.bind(this, target), this.curse.bind(this, target)], target);
  }
}

export default Wizard;