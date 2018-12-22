let Game = new (function() {
  this.units = [];
  this.buildActionConstructor = false;
  let buildPreviewImage = false;
  let placedBuilding = false;

  let removeDeadUnits = false;

  let numUnits = 0;
  let maxNumUnits = MIN_NUM_UNITS;
  let absoluteMinNumUnits = MIN_NUM_UNITS;
  let absoluteMaxNumUnits = ABS_MIN_NUM_UNITS;

  let numSlime = STARTING_AMOUNT_SLIME;

  this.scheduleRemoveDeadUnits = function() {
    removeDeadUnits = true;
  };

  this.createTarget = function(settings) {
    return this.create(FakeTarget, TEAM_NONE, settings);
  };

  this.create = function(Constructor, team, settings) {
    let unit = new Constructor(team, settings);
    this.units.push(unit);

    return unit;
  };

  this.addUnit = function() {
    numUnits++;
  };
  this.subUnit = function() {
    numUnits--;
  };
  this.getNumUnits = function() {
    return numUnits;
  };

  this.addMaxNumUnits = function(amount) {
    maxNumUnits = Math.min(absoluteMaxNumUnits, amount + maxNumUnits);
  };
  this.subMaxNumUnits = function(amount) {
    maxNumUnits = Math.max(absoluteMinNumUnits, maxNumUnits - amount);
  };
  this.getMaxNumUnits = function() {
    return maxNumUnits;
  };

  this.addSlime = function(amount) {
    numSlime += amount;
  };
  this.subSlime = function(amount) {
    numSlime -= amount;
  };
  this.getNumSlime = function(amount) {
    return numSlime;
  };

  this.canCreateUnit = function() {
    return numUnits < maxNumUnits;
  };

  this.hasAmountOfSlimeAvailable = function(amount) {
    return amount <= numSlime;
  };

  this.buildButton = function(Constructor, previewImage) {
    buildPreviewImage = previewImage;
    this.buildActionConstructor = Constructor;
    placedBuilding = false;
  };

  this.cancelBuildButton = function(Constructor) {
    this.buildActionConstructor = false;
    placedBuilding = false;
    buildPreviewImage = false;
  };

  this.hasActiveBuildButton = function() {
    return this.buildActionConstructor !== false;
  };

  this.buildHouse = function() {
    this.buildButton(House, Images.housePreview);
  };

  this.buildMudPit = function() {
    this.buildButton(MudPit, Images.mudPitPreview);
  };

  this.buildBarracks = function() {
    this.buildButton(Barracks, Images.barracksPreview);
  };

  this.deleteSelection = function() {
    let selection = Selection.getSelection();

    if (selection.length === 0) {
      return;
    }

    // We can only delete player units or buildings, not enemies or slime
    if (!selection[0].isPlayer()) {
      return;
    }

    let length = selection.length;
    for (let i = 0; i < length; i++) {
      selection[i].remove();

      let c = selection[i].constructor;
      if (c === Chicken || c === Goblin || c === Pig) {
        Game.subUnit();
      }
    }

    Selection.clearSelection();
  };

  this.findIdleChicken = function() {
    let idleChickens = [];

    let length = this.units.length;

    for (let i = 0; i < length; i++) {
      let unit = this.units[i];

      if (unit.constructor !== Chicken) {
        continue;
      }

      if (unit.getState() !== 'default') {
        continue;
      }

      idleChickens.push(unit);
    }

    if (idleChickens.length === 0) {
      return;
    }

    // @todo instead of totally random, cycle through the idle chickens? do they have to register themselves perhaps? (a FIFO?)
    let randomIndex = randomInt(0, idleChickens.length - 1);
    Selection.setUnitSelection(idleChickens[randomIndex]);
  };

  function getUnitAtPosition(mousePosition, list) {
    let length = list.length;
    for (let i = 0; i < length; i++) {
      let target = list[i];
      if (target.isClickPositionHit && target.isClickPositionHit(mousePosition)) {
        return target;
      }
    }
  }

  this.findUnitAtPosition = function(position) {
    return getUnitAtPosition(position, this.units);
//    let target = getUnitAtPosition(position, this.units);
//    if (!target) {
//      target = getUnitAtPosition(position, this.buildings);
//    }
//    if (!target) {
//      target = getUnitAtPosition(position, this.enemies);
//    }
//    if (!target) {
//      target = getUnitAtPosition(position, this.enemyBuildings);
//    }
//
//    return target;
  };

  this.update = function(delta) {
    updateGroundDecals(delta);

    callbackList(this.units, 'update', [delta]);

    if (removeDeadUnits) {
      removeDeadUnits = false;
      removeRemovableUnitsFromList(this.units);
    }

    if (this.hasActiveBuildButton() && Input.isPressed(KEY.MOUSE_LEFT)) {
      let mousePos = Input.getMousePosition();
      let settings = {
        x: mousePos.x,
        y: mousePos.y
      };

      Grid.normalizeCoords(settings);
      let building = this.create(this.buildActionConstructor, TEAM_PLAYER, settings);
      callbackList(Selection.getSelection(), 'setTarget', [building]);
      placedBuilding = true;
    }
    else if (placedBuilding) {
      this.cancelBuildButton();
    }
  };

  function removeRemovableUnitsFromList(list) {
    for (let i = list.length - 1; 0 <= i; i--) {
      if (list[i].isReadyToRemove()) {
        list.splice(i, 1);
      }
    }
  }

  this.draw = function(interpolationPercentage) {
    drawGroundDecals();
    callbackList(this.units, 'draw', [interpolationPercentage]);

    if (this.hasActiveBuildButton() && buildPreviewImage) {
      let position = Input.getMousePosition();
      Grid.normalizeCoords(position);
      drawImage(gameContext, buildPreviewImage, position.x + TILE_HALF_SIZE, position.y + TILE_HALF_SIZE);
    }
  };

})();
