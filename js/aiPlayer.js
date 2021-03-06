const AIPlayer = new (function() {

  let elapsedSinceUpdate = 0;
  const updateInterval = 1;

  let allEnemyUnits = [];
  let allEnemyMovingUnits = [];
  let allEnemyPigUnits = [];
  let allEnemyGoblinUnits = [];
  let allEnemyChickenUnits = [];
  let allEnemyBuildingUnits = [];
  let allEnemyHouseUnits = [];
  let allEnemyMudPitUnits = [];
  let allEnemyBarracksUnits = [];
  let allEnemySlimeUnits = [];
  let allEnemySlimePatchUnits = [];

  let allPlayerUnits = [];
  let allPlayerMovingUnits = [];
  let allPlayerPigUnits = [];
  let allPlayerGoblinUnits = [];
  let allPlayerChickenUnits = [];
  let allPlayerBuildingUnits = [];
  let allPlayerHouseUnits = [];
  let allPlayerMudPitUnits = [];
  let allPlayerBarracksUnits = [];
  let allPlayerSlimePatchUnits = [];
  let allPlayerSlimeUnits = [];

  let buildingPlacedThisFrame = false;

  let enemyWave = [];
  let waveNumber = 1;
  let enemyWaveReady = false;
  let elapsedSinceLastWave = 0;
  let enemyWaveInterval = 120;

  let elapsedSinceGambol = 0;
  let gambolInterval = 2;

  let attackers = [];

  this.update = function (delta){

    elapsedSinceUpdate += delta;
    if (updateInterval <= elapsedSinceUpdate) {
      elapsedSinceUpdate = 0;
    }

    this.clearEnemyAndPlayerUnitArrays();
    this.findAllEnemyUnits();
    this.findAllPlayerUnits();

    if (this.moreChickensNeeded()){
        this.buildEnemyUnit(ChickenEnemy);
    }
    this.sendChickenToCompleteBuilding();
    this.allIdleChickensCollectSlime();
    this.pigsAndGoblinsGambol(delta);

    elapsedSinceLastWave += delta;
    this.prepareEnemyWave();
    this.attackWithEnemyWave();

    buildingPlacedThisFrame = false;

    //Attempt to Build Enemy House if needed
    if (Game.getNumUnits(TEAM_ENEMY) >= (Game.getMaxNumUnits(TEAM_ENEMY) - 2) && !buildingPlacedThisFrame){
      let enemyHouseBuildPending = false;
      for (i = 0; i < allEnemyHouseUnits.length; i++){
        if (!allEnemyHouseUnits[i].isComplete()){
          enemyHouseBuildPending = true;
          return;
        } else {
          enemyHouseBuildPending = false;
        }
      }
      if (!enemyHouseBuildPending){
        this.placeEnemyBuilding(HouseEnemy);
        buildingPlacedThisFrame = true;
      }
    }

    //Attempt to Build Enemy MudPit if needed
    if(this.allBuildingsComplete() && !buildingPlacedThisFrame){
      if (allEnemyMudPitUnits.length < 1){
        this.placeEnemyBuilding(MudPitEnemy);
        buildingPlacedThisFrame = true;
      }
    }

    //Attempt to Build Enemy Barracks if needed
    if(this.allBuildingsComplete() && !buildingPlacedThisFrame){
      if (allEnemyBarracksUnits.length < 1){
        this.placeEnemyBuilding(BarracksEnemy);
        buildingPlacedThisFrame = true;
      }
    }

    this.defendUnits();
  }; //end this.update()

  this.prepareEnemyWave = function(){

    for (let i = 0; i < enemyWave.length; i++){
      if (enemyWave[i].getHealth() <= 0){
        enemyWave.splice(i, 1);
      }
    }

    if (enemyWave.length <= 0){
      enemyWaveReady = false;
    }

    if(enemyWaveReady){
      return;
    }

    enemyWave = [];
    let numberOfPigs = 2 + (waveNumber - 1);
    let numberOfGoblins = 1 + (waveNumber -1);
    let numberOfChickens = Math.max((waveNumber - 2), 0)
    let enemyPigsReady = false;
    let enemyGoblinsReady = false;
    let enemyChickensReady = false;

    if (allEnemyPigUnits.length >= numberOfPigs){
      enemyPigsReady = true;
    } else {
      this.buildEnemyUnit(PigEnemy);
    }

    if (allEnemyGoblinUnits.length >= numberOfGoblins){
      enemyGoblinsReady = true;
    } else {
      this.buildEnemyUnit(GoblinEnemy);
    }

    if (allEnemyChickenUnits.length - (allEnemyMudPitUnits.length * 2) >= numberOfChickens){
      enemyChickensReady = true;
    } else {
      this.buildEnemyUnit(ChickenEnemy);
    }

    if (enemyPigsReady && enemyGoblinsReady && enemyChickensReady && (enemyWaveInterval <= elapsedSinceLastWave)){
      for (p = 0; p < numberOfPigs; p++){
        enemyWave.push(allEnemyPigUnits[p]);
      }
      for (g = 0; g < numberOfGoblins; g++){
        enemyWave.push(allEnemyGoblinUnits[g]);
      }
      for (c = 0; c < numberOfChickens; c++){
        enemyWave.push(allEnemyChickenUnits[c]);
      }
    }

    if ((enemyWave.length === numberOfPigs + numberOfGoblins + numberOfChickens) && (enemyWaveInterval <= elapsedSinceLastWave)){
      elapsedSinceLastWave = 0;
      enemyWaveReady = true;
      waveNumber++;
    }
  }

  this.attackWithEnemyWave = function(){
    let enemyUnitsLength = enemyWave.length;
    for (let i = 0; i < enemyUnitsLength; i++){

      let playerUnitsLength = allPlayerUnits.length;
      for (let j = 0; j < playerUnitsLength; j++){

        let enemyUnit = enemyWave[i];
        if(allPlayerUnits[j].canDamage() === true){
          enemyUnit.setTarget(allPlayerUnits[j]);
        }
      }
    }
  }

  this.getElapsedSinceLastWave = function (){
    return elapsedSinceLastWave;
  }

  this.moreChickensNeeded = function(){

    let barracks;
    let length = allEnemyBarracksUnits.length;

    for (let i = 0; i < length; i++){ // This currently just selects the last enemy barracks in the array.
      barracks = allEnemyBarracksUnits[i];
    }

    if(barracks === undefined){
      return;
    }

    let queue = barracks.getQueue();
    let chickensInQueue = 0;
    for (i = 0; i < queue.length; i++){
      if (queue[i].constructor === ChickenEnemy){
        chickensInQueue++;
      }
    }

    if ((allEnemyChickenUnits.length + chickensInQueue) < (2 * allEnemyMudPitUnits.length)){
      return true;
    } else {
      return false;
    }
  }

  this.sendChickenToCompleteBuilding = function(){

    let uncompletedBuilding;
    let length = allEnemyBuildingUnits.length;
    for (let i = 0; i < length; i++){
      if (!allEnemyBuildingUnits[i].isComplete()){
        uncompletedBuilding = allEnemyBuildingUnits[i];
      }
    }

    if (!this.allBuildingsComplete() && allEnemyChickenUnits[0]) {
      allEnemyChickenUnits[0].setTarget(uncompletedBuilding);
    }
  }

  this.allIdleChickensCollectSlime = function(){
    let length = allEnemyChickenUnits.length;
    for (let i = 0; i < length; i++){
      if (enemyWave.indexOf(allEnemyChickenUnits[i]) === -1 ){
        let currentTarget = allEnemyChickenUnits[i].getTarget();
        if (currentTarget === undefined ||(currentTarget.isBuilding() && currentTarget.constructor != MudPitEnemy && currentTarget.isComplete() && currentTarget.getTeam() === TEAM_ENEMY)){
          allEnemyChickenUnits[i].setTarget(allEnemyChickenUnits[i].findSlimePatch(allEnemyChickenUnits[i].getPosition(), allEnemySlimePatchUnits));
        }
      }
    }
  }

  this.pigsAndGoblinsGambol = function(delta){

    elapsedSinceGambol += delta;
    if (gambolInterval >= elapsedSinceGambol){
        return;
    }

    let length = allEnemyMovingUnits.length;

    for (let i = 0; i < length; i++){
      let unit = allEnemyMovingUnits[i];
      if (!unit.getTarget() && unit.constructor != ChickenEnemy) { //Chickens are ironically too busy to gambol in this game.

        let newPosition = {x: null, y: null};
        let currentPosition = unit.getPosition();
        let randomXchange = (Math.random(0, (2 * TILE_SIZE)) * 100);
        let randomYchange = (Math.random(0, (2 * TILE_SIZE)) * 100);
        let multiplierX = (Math.random(0,1) < 0.5 ? -1 : 1);
        let multiplierY = (Math.random(0,1) < 0.5 ? -1 : 1);

        newPosition.x = currentPosition.x + (randomXchange * multiplierX);
        newPosition.y = currentPosition.y + (randomYchange * multiplierY);

        //if (Grid.isWalkableCoords(newPosition)){
          unit.setTarget(Game.createTarget(newPosition))
        //}
      }
    }

    if (gambolInterval <= elapsedSinceGambol){
      elapsedSinceGambol = 0;
    }
  }

  this.placeEnemyBuilding = function(unitConstructor){

    if (allEnemyChickenUnits.length < 1){
      return;
    }

    let centralUnit;

    if (allEnemyBuildingUnits.length >= 1){
      centralUnit = allEnemyBuildingUnits[Math.floor(Math.random() * (allEnemyBuildingUnits.length - 0)) + 0];
    } else {
      centralUnit = allEnemySlimeUnits[0];
    }

    switch (unitConstructor){
      case HouseEnemy:
        Game.buildHouse(TEAM_ENEMY);
        break;
      case MudPitEnemy:
        Game.buildMudPit(TEAM_ENEMY);
        break;
      case BarracksEnemy:
        Game.buildBarracks(TEAM_ENEMY);
        break;
    }

    centralUnit.buildPlot(centralUnit, unitConstructor);
  }

  this.buildEnemyUnit = function(unitConstructor){
    let barracks;
    let length = allEnemyBarracksUnits.length;
    for (let i = 0; i < length; i++){ // This currently just selects the last enemy barracks in the array.
      barracks = allEnemyBarracksUnits[i];
    }

    if(barracks === undefined){
      return;
    }

    let queue = barracks.getQueue()
    if(queue.length > 0){
      return;
    }

    barracks.queueUnit(unitConstructor);
  }

  this.allBuildingsComplete = function(){
    let length = allEnemyBuildingUnits.length;

    if(length === 0){
        return true;
    }

    let allBuildingsComplete = true;
    for (let i = 0; i < length; i++){
      if (!allEnemyBuildingUnits[i].isComplete()){
        allBuildingsComplete = false;
      }
    }
    return allBuildingsComplete;
  }

  this.defendUnits = function(){ //WIP

    for (let i = 0; i < allPlayerMovingUnits.length; i++){
      for (let j = 0; j < allEnemyUnits.length; j++){
        if (allPlayerMovingUnits[i].getTarget() === allEnemyUnits[j]){
          if (attackers.indexOf(allPlayerMovingUnits[i]) === -1 ){
            attackers.push(allPlayerMovingUnits[i]);
            if (attackers[0].getHealth() <= 0){
              attackers.shift();
            }
          }
        }
      }
    }

    if (attackers.length > 0){
      for (let i = 0; i < allEnemyMovingUnits.length; i++){
        let nearbyAttacker = allEnemyMovingUnits[i].findNearbyitemInList(attackers, allEnemyMovingUnits[i].getPosition(), [Pig, Goblin, Chicken], TEAM_PLAYER, 90000)
        allEnemyMovingUnits[i].setTarget(nearbyAttacker);
      }
      attackers.shift();
    }
  }

  this.defendSlime = function(){
    let length = allPlayerMovingUnits.length;
    for (let i = 0; i < length; i++){
      if (allPlayerMovingUnits[i].getTarget() === allEnemySlimeUnits[0]){
        let enemyUnitsLength = allEnemyMovingUnits.length;
        for (let j = 0; j < enemyUnitsLength; j++){
          allEnemyMovingUnits[j].setTarget(allPlayerMovingUnits[i]);
        }
      }
    }
  }

  this.attackAllPlayerUnits = function(){

    let enemyUnitsLength = allEnemyMovingUnits.length;
    for (let i = 0; i < enemyUnitsLength; i++){

      let playerUnitsLength = allPlayerUnits.length;
      for (let j = 0; j < playerUnitsLength; j++){

        let enemyUnit = allEnemyMovingUnits[i];
        if((allPlayerUnits[j].canDamage() === true) && (enemyUnit.constructor != ChickenEnemy)){ /* && allPlayerUnits[j].constructor.name != "Slime"*/ //Bug: attacking slime causes game to slow/crash
          enemyUnit.setTarget(allPlayerUnits[j]);
        }
      }
    }
  }

  this.clearEnemyAndPlayerUnitArrays = function(){
    allEnemyUnits = [];
    allEnemyMovingUnits = [];
    allEnemyPigUnits = [];
    allEnemyGoblinUnits = [];
    allEnemyChickenUnits = [];
    allEnemyBuildingUnits = [];
    allEnemyHouseUnits = [];
    allEnemyMudPitUnits = [];
    allEnemyBarracksUnits = [];
    allEnemySlimePatchUnits = [];
    allEnemySlimeUnits = [];
    allPlayerUnits = [];
    allPlayerMovingUnits = [];
  }

  this.findAllEnemyUnits = function(){

    let length = Game.units.length;
    for (let i = 0; i < length; i++) {
      let unit = Game.units[i];
      if (unit.isPlayer(TEAM_ENEMY)){
        allEnemyUnits.push(unit);
      }
    }

    length = allEnemyUnits.length;
    for (let i = 0; i < length; i++) {
      let unit = allEnemyUnits[i];
      switch (unit.constructor.name){
        case "PigEnemy":
          allEnemyPigUnits.push(unit);
          allEnemyMovingUnits.push(unit);
          break;
        case "GoblinEnemy":
          allEnemyGoblinUnits.push(unit);
          allEnemyMovingUnits.push(unit);
          break;
        case "ChickenEnemy":
          allEnemyChickenUnits.push(unit);
          allEnemyMovingUnits.push(unit);
          break;
        case "BarracksEnemy":
          allEnemyBarracksUnits.push(unit);
          allEnemyBuildingUnits.push(unit);
          break;
        case "MudPitEnemy":
          allEnemyMudPitUnits.push(unit);
          allEnemyBuildingUnits.push(unit);
          break;
        case "HouseEnemy":
          allEnemyHouseUnits.push(unit);
          allEnemyBuildingUnits.push(unit);
          break;
        case "SlimePatchEnemy":
          allEnemySlimePatchUnits.push(unit);
          break;
        case "SlimeEnemy":
          allEnemySlimeUnits.push(unit);
          break;
      }
    }
  }

  this.findAllPlayerUnits = function(){

    let length = Game.units.length;
    for (let i = 0; i < length; i++) {
      let unit = Game.units[i];
      if (unit.isPlayer(TEAM_PLAYER)) {
        allPlayerUnits.push(unit);
      }
    }

    length = allPlayerUnits.length;
    for (let i = 0; i < length; i++) {
      let unit = allPlayerUnits[i];
      switch (unit.constructor.name){
        case "Pig":
        case "Goblin":
        case "Chicken":
          allPlayerMovingUnits.push(unit);
          break;
        case "Barracks":
        case "MudPit":
        case "House":
          allPlayerBuildingUnits.push(unit);
          break;
        case "SlimePatch":
          allPlayerSlimePatchUnits.push(unit);
          break;
        case "Slime":
          allPlayerSlimeUnits.push(unit);
          break;
      }
    }
  }
});
