/**
 * Maps all abilities with their respective accuracies.
 * NaN means that the ability never misses
 */
const Accuracies = { // Maps all abilities with their respective accuracies.
  'Perfect Aim': NaN, // Never miss
  'Sniper': NaN, // Never miss
  'Silver Bullet': 100,
  'Bad Luck': 100,
  'Dark Magic': 100,
  'Vital Strike': 80,
  'Spectral Shift': 100,
  'Terrorize': 100,
  'Curse': 95,
  'Fierce Roar': 95,
  'Fireball': 80,
  'Sneak Attack': 80,
  'Ice': 80,
  'Haunt': 80,
  'Solid Defense': 100,
  'Strong Jaw': 80,
  'Spellcast': 80,
  'Suffering': 0,
  'Crystal Shard': 95,
  'Restore': 75,
  'Execute': 80,
};
/*
Recoils for each attack
*/
const Recoil = {
    "Terrorize": 10,
    "Haunt": 90,
}
/*
Damage for each attack
*/
function getDamage(attack, target){
    //Default Damage List
    let standard = {
        "Haunt":90,
        'Terrorize': (target.maxhealth * 0.2) + 5 / target.defense, //20%
        'Ice': target.maxhealth * 0.5 / target.defense, //50%
        "Fireball": target.maxhealth * 0.3 / target.defense, //30%
        'Spellcast': target.maxhealth * 0.3 / target.defense, //30%
        'Perfect Aim': target.maxhealth * 0.3 / target.defense, //30%
        "Fierce Roar": target.maxhealth * 0.15 / target.defense, //15%
        "Execute": (target.maxhealth/target.health+0.5) * 20 / target.defense,
        //"Strong Jaw": (Math.ceil(Math.random() * 20) + 30) / target.defense, //30-50 
        'Vital Strike': (Math.ceil(Math.random() * 10) + 40) / target.defense, //40-50 ~50%
        'Dark Magic': Math.round((Math.floor(Math.random() * 11) + 20) / target.defense * 10) / 10, //20-30 ~40%
        "Sniper": Math.round((Math.floor(Math.random() * 11) + 30) / target.defense * 10) / 10, //30-40 ~35%
        'Silver Bullet': Math.floor(Math.random() * 2) == 0 ? 40 : 20, //25/50 25-50%
        'Bad Luck': (Math.floor(Math.random() * 11) + 20) / target.defense, //20-30
        'Curse': target.maxhealth * 0.15,
        'Sneak Attack':  Math.floor(Math.random() * 2) == 0 ? 50/target.defense: 10/target.defense,
        'Suffering': target.maxhealth,
        "Spectral Shift": 20 * target.defense, //20 + defense
        'Solid Defense': 20 / target.defense, //20
        'Crystal Shard': 0,
        'Restore': 0,
    }
    //If an attack is listed here, it will do reduced damage to bulletproof units
    let bulletproof = {
        "Sniper": (target.maxhealth/10 < 10) ? 10 : target.maxhealth * 0.1,
        "Perfect Aim": (target.maxhealth/10 < 10) ? 10 : target.maxhealth / 10,
        "Silver Bullet": (target.maxhealth/10 < 10) ? 10 : target.maxhealth * 0.1,
    }
    if (standard[attack] == null) return 0;
    if (target.ability == "Spectral Shift" && bulletproof[attack] != null) return target.weaknesses.includes(attack) ? bulletproof[attack] * 1.5 : bulletproof[attack]; 
    return target.weaknesses.includes(attack) ? standard[attack] * 1.5 : standard[attack]
}

/**
 * * Base class that all characters extend
 */
class Character {
  /**
   * @param {string} owner - Username of the owner of the object
   * @param {string} type - Type of the object
   * @param {float} health - Maximum health of the object
   * @param {list} weaknesses - Abilities that the object is weak to
   * @param {list} possible_abilities - Abilities that the object could potentially have
   */
  constructor(owner, type, health, weaknesses, possible_abilities) {
    this.objects;
    this.owner = owner;
    this.type = type;
    this.health = health;
    this.maxhealth = health;
    this.weaknesses = weaknesses;
    this.possible_abilities = possible_abilities
    this.ability = possible_abilities[Math.floor(Math.random()*possible_abilities.length)];
    this.statuses = [];
    this.black_cat_debuff = 0;
    this.isDead = false;
    this.accuracy = Accuracies[this.ability];
    this.defense = 1;
    if(this.ability === 'Solid Defense') this.defense += 0.25;
  }
  
  /**
   * * Abstracted attack method called by all classes attack methods
   * @param possible_abilities - List of bound functions [list of functions of the style: this.fireball.bind(this, target)]
   */
    super_attack(target) {
        if(this.hitmiss()) {
            if (this.ability == "Curse") this.curse(target); //prevents damages now, deals damage later
            else {
                // Deal damage
                var damage = Math.round(getDamage(this.ability, target) * 100)/100 //Deletes Random Decimals
                target.health -= damage;
                this.constrainhealth(target)
                this.lastMove = `${this.type} used ${this.ability} on ${target.owner}'s ${target.type}. ${target.weaknesses.includes(this.ability)? 'It was super effective!': ''}\n${target.dead ? "The opponent died!": `The opponent took ${damage} damage!`}\n`;
                // Add status effects
                if (this.ability == "Fierce Roar" && target.accuracy !== 'N/A') {
                    target.statuses.push("Intimidated")
                    this.lastMove += "The opponent lost 30% accuracy until it attacks.\n"
                }
                else if (this.ability == "Dark Magic" && target.accuracy !== 'N/A') {
                    target.statuses.push("Distracted")
                    this.lastMove += "The opponent lost 5% accuracy permamently.\n"
                }
                else if (this.ability == "Bulletproof") this.defense += 0.05
                // Recoil
                if (Recoil[this.ability] != null){
                    this.health -= Recoil[this.ability];
                    this.constrainhealth(this);
                    this.lastMove += this.type + " " + (this.dead ? "dies" : "takes " + damage + " damage") + " in recoil" 
                }

            }
        } else {
            this.lastMove =`${this.owner}'s ${this.type} missed ${target.type} with ${this.ability}`
        }
    }

  swap() {
    if (this.ability == "Solid Defense") this.defense -= 0.25;
    this.ability = this.possible_abilities.indexOf(this.ability) == this.possible_abilities.length-1 ? this.possible_abilities[0] : this.possible_abilities[this.possible_abilities.indexOf(this.ability) + 1]; //If the ability is last index of array, choose first ability, otherwise choose next.
    if (this.ability == "Solid Defense") this.defense += 0.25;
    this.accuracy = Accuracies[this.ability];
  }

  /**
   * * Is called once per turn on all characters. 
   */
  update() {
    if (this.statuses.includes("Cursed")){ //Do Curse Damage
        this.statuses.splice(this.statuses.indexOf("Cursed"), 1)
        this.health -= (this.weaknesses.includes("Curse") ? this.maxhealth * 0.225 : this.maxhealth * 0.15) 
    } 
    this.constrainhealth(this);

    // objects property assigned to all characters in ambush.js just after initialization
    this.objects.forEach((obj) => {
      if (obj.owner !== this.owner && obj.type === 'Black Cat' && obj.ability === 'Bad Luck') {
        if (obj.isDead === false) {
          this.black_cat_debuff = 5;
        }
        else this.black_cat_debuff = 0;
      }
    });
  }
  /**
   * * Is called any time a move is done, determines if the move misses. Accounts for moves that never miss.
   */
    hitmiss() {
        if(isNaN(this.accuracy)) return true;
        let penalties = this.statuses.filter(v => v === "Distracted").length * 5;
        if (this.statuses.includes("Intimidated")){
            penalties += 30; //Fierce Roar
            this.statuses.splice(this.statuses.indexOf("Intimidated")); //Removes Intimidation
        }
        if(Math.ceil(Math.random()*100) <= (this.accuracy - this.black_cat_debuff - penalties)) return true;
        return false;
    }

  /**
   * * constrains target's health between 0 and target.maxhealth
   * @param target - target who's health is being constrained
   */
    constrainhealth(target) {
    target.health = Math.round(target.health * 100) / 100; //Deletes Trailing Decimals
    if(target.health <= 0){
        target.health = 0; 
        target.isDead = true;
    } 
        else if (target.health >= target.maxhealth) target.health = target.maxhealth;
    }

    results(target, damage) {
        return `${this.type} used ${this.ability} on opponent's ${target.type}. ${target.weaknesses.includes(this.ability)? 'It was super effective!': ''}\nThe opponent took ${damage} damage!\n`;
    }

    displayAccuracy(){
        let penalties = this.statuses.filter(v => v === "Distracted").length * 5;
        if (this.statuses.includes("Intimidated")) penalties += 30; //Fierce Roar
        return this.accuracy - this.black_cat_debuff - penalties
    }
    curse(target) {
        let supereffective = false;
        let turns = 3;
        let damage = target.maxhealth * 0.15;
        if(target.weaknesses.includes(this.ability)) {
            damage *= 1.5;
            supereffective = true;
        }
        for (var i=0;i<turns;i++) {
            target.statuses.push("Cursed");
        }
        this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent will now take ${damage} damage every turn for ${turns} turns.`;
    }
}

export default Character;