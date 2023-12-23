import { Character, Abilities } from "./Character.js";

class Werewolf extends Character {
  constructor(owner)
  {
    super(owner, 'Werewolf', 120, [Abilities.SilverBullet, Abilities.SpectralShift, Abilities.Haunt], [Abilities.Terrorize, Abilities.SolidDefense]);
  }
  
  attack(target) 
  {
    this.super_attack([this.terrorize.bind(this, target), this.strong_jaw.bind(this, target)], target);
  }
}

export default Werewolf