const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const enteredHealth = prompt("you can choose player health", "100");
let currentHealth = parseInt(enteredHealth);
let monsterHealth = currentHealth;
let playerHealth = currentHealth;
let hasBonuselife = true;

let LOG_EVENT_PLAYER_HEALTH = "PLAYER_HEALTH";
let LOG_EVENT_STRONG_PLAYER_HEALTH = "STRONG_PLAYER_HEALTH";
let LOG_EVENT_MONSTER_HEALTH = "MONSTER_HEALTH";
let LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
let LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleEntery = [];

function writeTolog(en, vl, plHealth, mnHealth) {
  let logEntry = {
    event: en,
    value: vl,
    finalMonsterHealth: mnHealth,
    finalPlayerHealth: plHealth,
  };
  if (en === LOG_EVENT_PLAYER_HEALTH) {
    logEntry.target = "MONSTER";
  } else if (en === LOG_EVENT_STRONG_PLAYER_HEALTH) {
    logEntry = {
      event: en,
      value: vl,
      target: "MONSTER",
      finalMonsterHealth: mnHealth,
      finalPlayerHealth: plHealth,
    };
  } else if (en === LOG_EVENT_MONSTER_HEALTH) {
    logEntry = {
      event: en,
      value: vl,
      target: "PLAYER",
      finalMonsterHealth: mnHealth,
      finalPlayerHealth: plHealth,
    };
  } else if (en === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: en,
      value: vl,
      finalMonsterHealth: mnHealth,
      finalPlayerHealth: plHealth,
    };
  }
  battleEntery.push(logEntry);
}

if (isNaN(currentHealth) || currentHealth <= 0) {
  currentHealth = 100;
}

function reset() {
  playerHealth = currentHealth;
  monsterHealth = currentHealth;
  resetGame(currentHealth);
}
function endUp() {
  let initialPlayerHealth = playerHealth;
  const plyerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  playerHealth -= plyerDamage;
  writeTolog(
    LOG_EVENT_MONSTER_HEALTH,
    plyerDamage,
    playerHealth,
    monsterHealth
  );
  if (playerHealth <= 0 && hasBonuselife) {
    hasBonuselife = false;
    removeBonusLife();
    playerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert(
      "You are now dead but there is one bounse life so you can reclaim it!"
    );
  }
  if (monsterHealth <= 0 && playerHealth > 0) {
    alert("You won");
    writeTolog(
        LOG_EVENT_GAME_OVER,
        'PLAYER_WIN',
        playerHealth,
        monsterHealth
      );
  } else if (playerHealth <= 0 && monsterHealth > 0) {
    alert("You lose");
    writeTolog(
        LOG_EVENT_GAME_OVER,
        'MONSTER WON',
        playerHealth,
        monsterHealth
      );
  } else if (playerHealth <= 0 && monsterHealth <= 0) {
    alert("You draw");
    writeTolog(
        LOG_EVENT_GAME_OVER,
        'YOU DRAW',
        playerHealth,
        monsterHealth
      );
  }
  if (playerHealth <= 0 || monsterHealth <= 0) {
    reset();
  }
}
function monsterAttack(mode) {
  const modeAttack = mode === 'ATTACK'? ATTACK_VALUE: STRONG_ATTACK_VALUE ;
  const logEvent = mode === 'ATTACK'? LOG_EVENT_PLAYER_HEAL: STRONG_ATTACK_VALUE ;
//   if (mode === "ATTACK") {
//     modeAttack = ATTACK_VALUE;
//       logEvent = LOG_EVENT_PLAYER_HEALTH;
//   } else if (mode === "STRONG_ATTACK") {
//     modeAttack = STRONG_ATTACK_VALUE;
//     logEvent = LOG_EVENT_STRONG_PLAYER_HEALTH
//   }
  const monsDamage = dealMonsterDamage(modeAttack);
  monsterHealth -= monsDamage;
  writeTolog(
    logEvent,
    monsDamage,
    playerHealth,
    monsterHealth
  );
  endUp();
}

function healHandler() {
  let healValue;
  if (playerHealth >= currentHealth - HEAL_VALUE) {
    alert("You can't heal");
    healValue = currentHealth - playerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  playerHealth += healValue;
  writeTolog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    playerHealth,
    monsterHealth
  );
  endUp();
}
function attackHandler() {
  monsterAttack("ATTACK");
}

function strongAttackHandler() {
  monsterAttack("STRONG_ATTACK");
}

function printHandler() {
  console.log(battleEntery);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printHandler);
