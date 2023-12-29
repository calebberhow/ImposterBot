import { Character, Abilities } from "./Character.js";

class Dragon extends Character
{
  constructor(owner)
  {
    super(owner, 'Dragon', 100, [Abilities.PerfectAim, Abilities.Ice], [Abilities.Fireball, Abilities.FierceRoar]);
  }
  attack(target)
  {
    this.super_attack([this.fireball.bind(this, target), this.fierce_roar.bind(this, target)], target);
  }
}

export default Dragon;