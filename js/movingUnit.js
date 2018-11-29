const MovingUnit = function(settings) {

  let footprints = false;
  if (settings.footprints) {
    //console.log("This unit leaves footprints!");
    footprints = settings.footprints;
  }

  const speed = settings.speed || 0;
  const rotationEase = settings.rotationEase || 0.6;
  const unitRanksSpacing = settings.unitRanksSpacing || settings.clickRadius * 2.25;
  const actionRange = settings.actionRangeSquared || settings.clickRadius * 0.9;
  const actionRangeSquared = actionRange * actionRange;

  let footprintPositions = false;
  const footprintMax = settings.footprintMax || 50;
  const footprintSpacing = settings.footprintSpacing || 8;
  const footprintSpacingSquared = footprintSpacing * footprintSpacing;

  let vx = settings.vx || 0;
  let vy = settings.vy || 0;
  let angle = 0;
  let unitsAlongSide = 0;
  let formationIndex = 0;

  let target;
  let nextStepPosition;
  let distanceTraveled = 0;

  this.getTarget = function() {
    return target;
  };

  this.setTarget = function(unit, _unitsAlongSide, _formationIndex) {
    if (!unit) {
      return;
    }

    if (unit.addFollower) {
      unit.addFollower(this);
    }

    if (target) {
      this.unsetTarget();
    }

    target = unit;
    unitsAlongSide = _unitsAlongSide;
    formationIndex = _formationIndex;
    distanceTraveled = 0;
  };

  this.unsetTarget = function() {
    if (target && target.removeFollower) {
      target.removeFollower(this);
    }
    target = undefined;
  };

  this.getTargetPosition = function() {
    // @todo figure out how to position the formation relative to the approach-angle
    let targetPosition = target.getPosition();

    if (target.getCollisionRange) {
      let range = target.getCollisionRange();
      let pos = this.getPosition();
      let ang = Math.atan2(targetPosition.y - pos.y, targetPosition.x - pos.x);

      targetPosition.x -= Math.cos(ang) * range;
      targetPosition.y -= Math.sin(ang) * range;
    }

    if (!formationIndex || !unitsAlongSide) {
      return targetPosition;
    }

    let rowNum = formationIndex % unitsAlongSide;
    let colNum = Math.floor(formationIndex / unitsAlongSide);
    targetPosition.x = targetPosition.x + colNum * unitRanksSpacing;
    targetPosition.y = targetPosition.y + rowNum * unitRanksSpacing;

    return targetPosition;
  };

  this.isWithinActionRange = function(unit) {
    return distanceBetweenPointsSquared(this.getPosition(), unit.getPosition()) <= actionRangeSquared;
  };

  this._update = function(delta) {
    let state = this.getState();
    if (!target && state === 'default') {
      // find closest enemy within detection range; set target else return
      return;
    }

    if (target && !this.isWithinActionRange(target)) {
      if (this.stepTowardsTarget()) {
        return;
      }
    }

    if (target && target.constructor === FakeTarget) {
      this.unsetTarget();
      this.setState('default');
      return;
    }

    if (target && target.isEnemy()) {
      // attack!
      this.setState('attack');
      return;
    }

    if (this.childUpdate && this.childUpdate(delta)) {
      // Child did something!
      return;
    }

    // idle, nothing to do!
    if (state !== 'default') {
      this.setState('default');
    }
  };

  this.stepTowardsTarget = function() {
    if (!target) {
      return false;
    }

    if (TILE_SIZE <= distanceTraveled) {
      distanceTraveled = 0;
    }
    if (distanceTraveled === 0) {
      let path = Grid.findPath(this.getPosition(), this.getTargetPosition());
      // no path to target
      if (!path || path[0] === undefined) {
        // no step to take
        return false;
      }

      nextStepPosition = {
        x: path[0][0] * TILE_SIZE + TILE_HALF_SIZE,
        y: path[0][1] * TILE_SIZE + TILE_HALF_SIZE,
      };
    }

    let newVs = rotateToTarget(vx, vy, speed, rotationEase, nextStepPosition, this.getPosition());

    newVs = updateVsForCollisions(newVs, speed, this.getPosition(), this.getCollisionRange());

    distanceTraveled += newVs.dist;

    angle = newVs.angle;
    if (0 < newVs.dist && speed < newVs.dist) {
      vx = newVs.vx;
      vy = newVs.vy;
      this.setState(getMoveStateByAngle());
    }
    else {
      // Prevent over-stepping the target
      // @todo what is close-enough? should the unit be prevented to endlessly try getting to the target position?
      this.x = nextStepPosition.x;
      this.y = nextStepPosition.y;
      vx = 0;
      vy = 0;
      distanceTraveled = 0;
    }

    this.x += vx;
    this.y += vy;

    if (footprints && (0 < vx || 0 < vy)) {
      this.updateFootprints();
    }

    // we took a step!
    return true;
  };

  function updateVsForCollisions(newVs, speed, currentPosition, collisionRange) {
    let collision = {
      type: false,
      position: false,
      distance: 1000 // Something bigger than the minimum collision distance
    };

    findCollisionWith(Game.units, collision, currentPosition, collisionRange);
    findCollisionWith(Game.enemies, collision, currentPosition, collisionRange);
    Grid.findCollisionWith(collision, currentPosition, collisionRange);

    if (collision.position) {
      // find angle between this and other
      let collisionAngle = angleBetween(currentPosition, collision.position);
      let angleDiff = angleDifference(newVs.angle, collisionAngle);

      let angleDiffAbs = Math.abs(angleDiff);

      if (0 === angleDiffAbs) {
        newVs.angle += ANGLE55;
      }
      else if (0 < angleDiffAbs && angleDiffAbs < ANGLE15) {
        newVs.angle += (-angleDiff / angleDiffAbs) * ANGLE55;
      }
      else if (ANGLE15 <= angleDiffAbs && angleDiffAbs < ANGLE145) {
        newVs.angle += (-angleDiff / angleDiffAbs) * ANGLE35;
      }
      else if (ANGLE145 <= angleDiffAbs && angleDiffAbs < ANGLE180) {
        newVs.angle += (-angleDiff / angleDiffAbs) * ANGLE15;
      }
    }

    newVs.vx = Math.cos(newVs.angle) * speed;
    newVs.vy = Math.sin(newVs.angle) * speed;

    return newVs;
  }

  function angleBetween(p1, p2) {
    let diffX = p2.x - p1.x;
    let diffY = p2.y - p1.y;

    return Math.atan2(diffY, diffX);
  }

  function angleDifference(a1, a2) {
    if (ANGLE180 <= a1) {
      a1 -= ANGLE360;
    }
    if (ANGLE180 <= a2) {
      a2 -= ANGLE360;
    }

    let diff = a2 - a1;
    if (diff < -ANGLE180) {
      diff += ANGLE360;
    }

    if (ANGLE180 < diff) {
      diff -= ANGLE360;
    }

    return diff;
  }

  function findCollisionWith(list, collision, currentPosition, collisionRange) {
    let l = list.length;
    for (let i = 0; i < l; i++) {
      let unit = list[i];
      let unitPosition = unit.getPosition();
      if (currentPosition.x === unitPosition.x && currentPosition.y === unitPosition.y) {
        continue;
      }

      let dist = distanceBetweenPoints(currentPosition, unitPosition);
      if (collision.distance < dist) {
        continue;
      }
      let unitRange = unit.getCollisionRange();

      if (dist < (collisionRange + unitRange) ) {
        collision.type = 'soft';
        collision.position = unitPosition;
        collision.distance = dist;
      }
    }

    return collision;
  }

  function getMoveStateByAngle() {
    if (angle < 0) {
      angle += ANGLE360;
    }
    if (ANGLE35 < angle && angle < ANGLE145) {
      return 'moveDown';
    }

    if (ANGLE145 <= angle && angle <= ANGLE235) {
      return 'moveLeft';
    }

    if (ANGLE235 < angle && angle < ANGLE305) {
      return 'moveUp';
    }

    return 'moveRight';
  }

  this.updateFootprints = function() {
    //console.log("updating footprints!");
    if (!footprintPositions) { // first frame init
      footprintPositions = [this.getPosition()];
    }

    let pos = this.getPosition();
    let dist = distanceBetweenPointsSquared(pos, footprintPositions[footprintPositions.length - 1]);

    if (footprintSpacingSquared <= dist) {
      //console.log("time for a new footprint because dist =" + dist);
      pos.angle = angle;
      footprintPositions.push(pos);
      if (footprintMax <= footprintPositions.length) {
        footprintPositions.shift();
      }
      addGroundDecal(pos,footprints); // emit a ground decal "particle"
    }
  };

  this._draw = function(interpolationPercentage) {

    if (DEBUG) {
      drawLines(gameContext, 'red', 1, [
        { x: this.x, y: this.y },
        { x: this.x + Math.cos(angle) * 20, y: this.y + Math.sin(angle) * 20 }
      ]);
    }
  };

  Unit.call(this, settings);
};

MovingUnit.prototype = Object.create(Unit.prototype);
MovingUnit.prototype.constructor = MovingUnit;
