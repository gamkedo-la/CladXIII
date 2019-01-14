const Chicken = function(team, settings) {

  settings = extend(settings, {
    sprite: Sprites.chicken,
    actionRange: 14,
    attackRange: 14,
    clickRadius: 16,
    unitRanksSpacing: 36,
    footprints: Images.footprints,
    collisionRange: 26,
    harvestSpeed: 5,
    harvestMax: 25,
    buildSpeed: 5,
    speed: 1.4,
    damage: 3,
    maxHealth: 10,
    selectionY: TILE_HALF_SIZE / 2,
    deadBodySprite: Images.deadChickenImg
  });

  let maxDistanceToFindBuildingOrSlimePatch = 90000;
  let harvested = 0;
  let lastHarvestedPosition;

  this.finishedBuilding = function() {
    this.unsetTarget();
    let newBuilding = this.findNearbyitemInList(
      Game.units,
      this.getPosition(),
      [
        House, Barracks, MudPit,
        HouseEnemy, BarracksEnemy, MudPitEnemy
      ],
      team,
      maxDistanceToFindBuildingOrSlimePatch,
      function(item) {
        return !item.isComplete();
      }
    );

    if (newBuilding) {
      this.setTarget(newBuilding);
    }
  };

  this.childUpdate = function(delta) {
    let target = this.getTarget();
    if (target) {
      if (this.canBuildBuilding(target)) {
        target.addBuildPercentage(settings.buildSpeed * delta);
        lastHarvestedPosition = undefined;

        return true;
      }

      if (target.constructor === SlimePatch || target.constructor === SlimePatchEnemy) {
        let returnSlime = false;
        harvested += target.collectSlime(settings.harvestSpeed * delta);

        if (target.isReadyToRemove() && harvested < settings.harvestMax) {
//          console.log('not enough');
          this.setTarget(this.findSlimePatch(this.getPosition()));
          if (!this.getTarget()) {
//            console.log('but not found a new patch');
            returnSlime = true;
          }
//          else {
//            console.log('but found a new patch');
//          }
        }

        if (returnSlime || settings.harvestMax <= harvested) {
//          console.log('return slime', returnSlime, 'or max <= carrying', settings.harvestMax, harvested);
          lastHarvestedPosition = this.getPosition();
          this.setTarget(this.findMudPit(this.getPosition()));
        }

        return true;
      }

      if ((target.constructor === MudPit || target.constructor === MudPitEnemy ) && lastHarvestedPosition) {
        Game.addSlime(Math.round(harvested), this.getTeam());

        harvested = 0;

        this.setTarget(this.findSlimePatch(lastHarvestedPosition));

        lastHarvestedPosition = undefined;

        return true;
      }
    }

    return false;
  };

  this.canBuildBuilding = function(target) {
    if (!target.isComplete || target.isComplete == undefined) {
      return false;
    }

    return !target.isComplete() && (target.constructor === House || target.constructor === MudPit || target.constructor === Barracks ||
                                    target.constructor === HouseEnemy || target.constructor === MudPitEnemy || target.constructor === BarracksEnemy);
  };

  this.findMudPit = function(position) {
    return this.findNearbyitemInList(Game.units, position, [MudPit, MudPitEnemy], team);
  };

  this.findSlimePatch = function(position) {
    return this.findNearbyitemInList(Game.units, position, [SlimePatch, SlimePatchEnemy], team, maxDistanceToFindBuildingOrSlimePatch);
  };

  this.findNearbyitemInList = function(list, position, types, team, maxDistanceSquared, extraCheckCallback) {

    if (this.constructor === ChickenEnemy){
      maxDistanceSquared = 9000000;
    }

    let item, distance;
    let l = list.length;

    for (let i = 0; i < l; i++) {
      let listItem = list[i];

      if (listItem.getTeam() !== team) {
        continue;
      }

      if (types.indexOf(listItem.constructor) === -1) {
        continue;
      }

      if (listItem.getTeam() !== team) {
        continue;
      }

      if (extraCheckCallback && !extraCheckCallback(listItem)) {
        continue;
      }

      if (item === undefined) {
        distance = distanceBetweenPointsSquared(position, listItem.getPosition());
        if (maxDistanceSquared && maxDistanceSquared < distance) {
          continue;
        }

        item = listItem;
        continue;
      }

      let distance2 = distanceBetweenPointsSquared(position, listItem.getPosition());

      if (maxDistanceSquared && maxDistanceSquared < distance && distance2 < distance) {
        item = listItem;
        distance = distance2;
      }
    }

    return item;
  };

  MovingUnit.call(this, team, settings);
};

Chicken.prototype = Object.create(MovingUnit.prototype);
Chicken.prototype.constructor = Chicken;

const ChickenEnemy = function(team, settings) {

  settings = extend(settings, {
    sprite: Sprites.chickenEnemy
  });

  Chicken.call(this, team, settings);
};

ChickenEnemy.prototype = Object.create(Chicken.prototype);
ChickenEnemy.prototype.constructor = ChickenEnemy;
