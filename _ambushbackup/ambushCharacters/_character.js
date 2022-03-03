/**
 * Maps all abilities with their respective accuracies.
 * NaN means that the ability never misses
 */
const Accuracies = { // Maps all abilities with their respective accuracies.
  'Perfect Aim': NaN, // Never miss
  'Sneak': 80,
  'Silver Bullet': 100,
  'Sniper': NaN, // Never miss
  'Bad Luck': 100,
  'Fireball': 80,
  'Fierce Roar': 95,
  'Dark Magic': 100,
  'Ice': 80,
  'Bulletproof': 100,
  'Haunt': 80,
  'Swords': 100,
  'Solid Defense': 80,
  'Terrorize': 100,
  'Strong Jaw': 80,
  'Spellcast': 80,
  'Curse': 95
};

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
    this.tempacc_debuff = 0;
    this.sustained_damage = 0;
    this.damage_turns = 0;
    this.black_cat_debuff = 0;
    this.isDead = false;
    this.accuracy = Accuracies[this.ability];
    this.defense = 1;
    if(this.ability === 'Solid Defense') {
      this.defense += 0.2;
    }
  }
  
  /**
   * * Abstracted attack method called by all classes attack methods
   * @param possible_abilities - List of bound functions [list of functions of the style: this.fireball.bind(this, target)]
   */
  super_attack(possible_ability_functions, target) {
    if(this.hitmiss()) {
      possible_ability_functions[this.possible_abilities.indexOf(this.ability)]();
    }
    else this.lastMove =`${this.owner}'s ${this.type} missed ${target.type} with ${this.ability}`;
  }

  /**
   * * Is called once per turn on all characters. 
   */
  update() {
    if (this.sustained_damage < 0) this.sustained_damage = 0;
    if (this.damage_turns < 0) this.sustained_damage = 0;
    if (this.sustained_damage !== 0 && this.damage_turns !== 0) {
      this.health -= this.sustained_damage;
      this.damage_turns -= 1;
    }
    else if (this.damage_turns === 0){
      this.sustained_damage = 0;
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
    if(isNaN(this.accuracy)){
      return true;
    }
    else if(Math.floor(Math.random()*100)+1 <= (this.accuracy - this.black_cat_debuff - this.tempacc_debuff)) return true;
    else return false;
  }

  /**
   * * constrains target's health between 0 and target.maxhealth
   * @param target - target who's health is being constrained
   */
  constrainhealth(target) {
    if(target.health <= 0){
        target.health = 0;
        target.isDead = true;
    } else if (target.health >= target.maxhealth){
      target.health = target.maxhealth;
    }
  }

  /**
   * * Does 50% damage
   */
  fireball(target) {
    let supereffective = false;
    let damage = (target.maxhealth / 2) / target.defense;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! The opponent's health is now ${target.health}`;
  }
  /**
   * * Does 25% damage, decreases accuracy by 30% until the target attacks again
   */
  fierce_roar(target) {
    let supereffective = false;
    let damage = Math.round((target.maxhealth / 4) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    let acc_debuff = 30;
    target.health -= damage;
    this.constrainhealth(target);
    target.tempacc_debuff = acc_debuff;
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}.${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! Their health now ${target.health}, ${(target.accuracy !== 'N/A') ? `The opponent lost ${acc_debuff} accuracy.`:''}`;
  }
  /**
   * * Does 50% damage
   */
  spellcast(target) {
    let supereffective = false;
    let damage = Math.round((target.maxhealth * 0.5) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 15% damage to target for 3 turns
   */
  curse(target) {
    let supereffective = false;
    let damage = target.maxhealth * 0.15;
    let turns = 3;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.sustained_damage = damage;
    target.damage_turns = turns;
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent will now take ${damage} damage every turn for ${turns} turns.`;
  }
  /**
   * * Does 30% damage. Never misses
   */
  perfect_aim(target){
    let supereffective = false;
    let damage = Math.round((target.maxhealth * 0.3) / target.defense * 10) / 10;
    if(target.ability === 'Bulletproof') {
      (target.maxhealth/10 < 10)? damage = 10 : damage = target.maxhealth/10;
    }
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Has a 50/50 chance of doing 30 or 50 damage before modifiers
   */
  sneak(target){
    let supereffective = false;
    let damage;
    if(Math.floor(Math.random()*2) === 0) damage = Math.round(50/target.defense * 10) / 10;
    else damage = Math.round(30/target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 40-50 damage before modifiers
   */
  swords(target){
    // Does 40-50 damage
    let supereffective = false;
    let damage = Math.round((Math.floor(Math.random() * 11) + 40) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! The opponent's health is now ${target.health}`;
  }
  /**
   * * Does 30% damage, having this ability makes your defense stat 1.2
   */
  solid_defense(target){
    let supereffective = false;
    let damage = Math.round((target.maxhealth * 0.3) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 30-50 damage, reduces opponent's accuracy by 5% permanently.
   */
  dark_magic(target){
    let supereffective = false;
    let damage = Math.round((Math.floor(Math.random() * 21) + 30) / target.defense * 10) / 10;
    let accdebuff = 5;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    if(target.accuracy !== 'N/A') target.accuracy -= accdebuff;
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! ${(target.accuracy !== 'N/A')?`The opponent's accuracy dropped by ${accdebuff}%.`:''}`;
  }
  /**
   * * Does 50% damage
   */
  ice(target){
    let supereffective = false;
    let damage = Math.round((target.maxhealth * 0.5) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 50% damage to target at the cost of 20 of this object's health
   */
  terrorize(target){
    let supereffective = false;
    let damage = Math.round((target.maxhealth * 0.5) / target.defense * 10) / 10;
    let recoil = 20;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.health -= recoil;
    this.constrainhealth(target);
    this.constrainhealth(this);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! It takes ${recoil} damage in recoil.`;
  }
  /**
   * * Does 40-50 damage
   */
  strong_jaw(target){
    let supereffective = false;
    let damage = Math.round((Math.floor(Math.random() * 11) + 40) / target.defense * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does either 25 or 50 damage
   */
  silver_bullet(target){
    let supereffective = false;
    let damage;
    if(Math.floor(Math.random()*2) === 0) {
      damage = Math.round(25 / target.defense * 10) / 10;
    }
    else {
      damage = Math.round(50 / target.defense * 10) / 10;
    }
    if(target.ability === 'Bulletproof') {
      (target.maxhealth/10 < 10)? damage = 10 : damage = target.maxhealth * 0.1;
    }
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 30-40 damage. Never misses
   */
  sniper(target){
    let supereffective = false;
    let damage = Math.round((Math.floor(Math.random() * 11) + 30) / target.defense * 10) / 10;
    if(target.ability === 'Bulletproof') {
      (target.maxhealth/10 < 10)? damage = 10 : damage = target.maxhealth * 0.1;
    }
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 30% damage to target. Makes incoming projectiles only do 10% damage to this object
   */
  bulletproof(target){
    let supereffective = false;
    let damage = Math.round(target.maxhealth * 0.3 * 10) / 10;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
  /**
   * * Does 90 damage to target and destroys itself
   */
  haunt(target){
    let supereffective = false;
    let damage = 90;
    let recoil = this.maxhealth;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.health -= recoil;
    this.constrainhealth(target);
    this.constrainhealth(this);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage! It dies in recoil.`;
  }
  /**
   * * Does 30-40 damage. All opponents have 5% acc lowered as long this character is alive.
   */
  bad_luck(target){
    let supereffective = false;
    let damage = (Math.floor(Math.random() * 11) + 30) / target.defense;
    if(target.weaknesses.includes(this.ability)) {
      damage *= 1.5;
      supereffective = true;
    }
    target.health -= damage;
    this.constrainhealth(target);
    this.lastMove = `${this.type} used ${this.ability} on opponent's ${target.type}. ${supereffective? 'It was super effective!': ''}\nThe opponent took ${damage} damage!`;
  }
}
module.exports = { Character }