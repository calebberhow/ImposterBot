import { Character, Abilities } from "./Character.js";

class Phantom extends Character
{
  constructor(owner: string)
  {
    super(owner, 'Phantom', 90, [Abilities.Terrorize, Abilities.Curse], [Abilities.SpectralShift, Abilities.Haunt]);
  }
}

export default Phantom;