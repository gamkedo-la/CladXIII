const Editor = new (function() {

  let levelData;
  let levelGrid;
  let levelDataOriginal;
  let levelGridOriginal;

  const maxLeftDistance = 20;
  const maxRightDistance = gameCanvas.width - maxLeftDistance;
  const maxTopDistance = 20;
  const maxBottomDistance = gameCanvas.height - maxTopDistance;

  const minColsFromEdge = 5;
  const minRowsFromEdge = 5;

  let x = 0;
  let y = 0;
  let maxX = 0;
  let maxY = 0;

  const canvasHalfWidth = gameCanvas.width / 2;
  const canvasHalfHeight = gameCanvas.height / 2;

  const levelCanvas = document.createElement('canvas');
  const levelContext = levelCanvas.getContext('2d');

  let draggingButtonContainer = null;

  let currentTileType;
  let currentActiveButton;

  this.getPanPosition = function() {
    return {
      x: x,
      y: y
    };
  };

  this.getPanAsPercentage = function() {
    return {
      x: x / levelCanvas.width,
      y: y / levelCanvas.height
    };
  };

  this.setPanAsPercentage = function(xPerc, yPerc) {
    x = Math.round(xPerc * levelCanvas.width - canvasHalfWidth);
    y = Math.round(yPerc * levelCanvas.height - canvasHalfHeight);

    fixXY();
  };

  this.getBounds = function() {
    return {
      topLeft: {
        x: x,
        y: y
      },
      bottomRight: {
        x: x + gameCanvas.width,
        y: y + gameCanvas.height
      }
    };
  };

  this.getWorldDimensions = function() {
    return {
      width: levelCanvas.width,
      height: levelCanvas.height,
      cols: levelData.cols,
      rows: levelData.rows
    }
  };

  this.initialize = function(_levelData) {
    levelData = _levelData;
    levelGrid = levelData.grid.slice();

    levelDataOriginal = _levelData;
    levelGridOriginal = levelData.grid.slice();

    levelCanvas.width = levelData.cols * TILE_SIZE;
    levelCanvas.height = levelData.rows * TILE_SIZE;

    x = y = 0;
    maxX = levelCanvas.width - gameCanvas.width;
    maxY = levelCanvas.height - gameCanvas.height;

    drawGridTiles();

    createMenuButtons();
    createTileButtons();

    makeDraggable(document.getElementById('button-container'));
  };

  function drawGridTiles() {
    let tileIndex = 0;
    let tileX = 0, tileY = 0, tileType;
    let row, col;

    for (row = 0; row < levelData.rows; row++) {
      for (col = 0; col < levelData.cols; col++) {
        tileType = processGridCell(tileIndex);

        drawImage(levelContext, TileImages[tileType], tileX + TILE_HALF_SIZE, tileY + TILE_HALF_SIZE);

        tileX += TILE_SIZE;
        tileIndex++;
      }
      tileX = 0;
      tileY += TILE_SIZE;
    }
  }

  function createMenuButtons() {
    let buttons = document.getElementById('menu-buttons');
    buttons.innerHTML = '';
    appendSpacer(buttons);

    createButton(buttons, 'export', exportLevel);
    createButton(buttons, 'reset', resetLevel);

    appendSpacer(buttons);
  }

  function createTileButtons() {
    let buttons = document.getElementById('tile-buttons');
    buttons.innerHTML = '';
    appendSpacer(buttons);

    let isFirst = true;
    for (let i in EDITOR_TILES) {
      let btn = createButton(buttons, EDITOR_TILES[i], changeTileType);

      btn.dataset.type = EDITOR_TILES[i];

      if (isFirst) {
        isFirst = false;
        changeTileType({ target: btn });
      }
    }
    appendSpacer(buttons);
  }

  function appendSpacer(container) {
    let spacer = document.createElement('span');
    spacer.innerHTML = '&nbsp;';
    container.appendChild(spacer);
  }

  function createButton(container, imgName, callback) {
    let img = document.createElement('img');
    img.src = 'img/editor/button-' + imgName + '.png';

    let btn = document.createElement('button');

    btn.appendChild(img);
    btn.addEventListener('click', callback);

    container.appendChild(btn);

    return btn;
  }

  function changeTileType(event) {
    if (currentActiveButton) {
      currentActiveButton.className = '';
    }

    currentActiveButton = event.target;
    currentActiveButton.className = 'active';
    currentTileType = parseInt(currentActiveButton.dataset.type);
  }

  function exportLevel() {
    if (!validateLevel()) {
      alert('Level not exported: see validation errors in console');
      return;
    }

    // @todo export level code to console
    alert('export code in console');
    console.log('exported level code');
  }

  function resetLevel() {
    if (!confirm('Are you sure you want to reset the level?')) {
      return;
    }

    levelGrid = levelGridOriginal.slice();
    drawGridTiles();
  }

  function processGridCell(i) {
    let tileType = levelGrid[i];

    if (tileType && EDITOR_TILES[tileType]) {
      return tileType;
    }

    return levelGrid[i] = levelData.defaultTile;
  }

  function validateLevel() {
    let numPlayerStart = 0, numEnemyStart = 0;
    let playerStartPosition, enemyStartPosition;

    let length = levelGrid.length;
    for (let i = 0; i < length; i++) {
      if (levelGrid[i] === TILE.TEAM_PLAYER) {
        numPlayerStart++;
        playerStartPosition = Editor.indexToColRow(i);
      }
      else if (levelGrid[i] === TILE.TEAM_ENEMY) {
        numEnemyStart++;
        enemyStartPosition = Editor.indexToColRow(i);
      }
    }

    if (numPlayerStart !== 1 || numEnemyStart !== 1) {
      console.log('Make sure there are exactly 1 player and 1 enemy starting positions.');
      return false;
    }

    let playerColTooClose = (playerStartPosition.col < minColsFromEdge || levelData.cols - minColsFromEdge < playerStartPosition.col);
    let playerRowTooClose = (playerStartPosition.row < minRowsFromEdge || levelData.rows - minRowsFromEdge < playerStartPosition.row);
    if (playerColTooClose || playerRowTooClose) {
      console.log('Player starting position too close to the edge of the level');
      return false;
    }

    let enemyColTooClose = (enemyStartPosition.col < minColsFromEdge || levelData.cols - minColsFromEdge < enemyStartPosition.col);
    let enemyRowTooClose = (enemyStartPosition.row < minRowsFromEdge || levelData.rows - minRowsFromEdge < enemyStartPosition.row);
    if (enemyColTooClose || enemyRowTooClose) {
      console.log('Enemy starting position too close to the edge of the level');
      return false;
    }

    // @todo additional rules?

    return true;
  }

  this.indexToColRow = function(index) {
    let row = Math.floor(index / levelData.cols);
    let col = index - (row * levelData.cols);

    return {
      col: col,
      row: row
    };
  };

  this.tileToIndex = function(col, row) {
    return (col + levelData.cols * row);
  };

  this.coordsToIndex = function(x, y) {
    let col = Math.floor(x / TILE_SIZE);
    let row = Math.floor(y / TILE_SIZE);

    return (col + levelData.cols * row);
  };

  this.normalizeCoords = function(coords) {
    let col = Math.floor(coords.x / TILE_SIZE);
    let row = Math.floor(coords.y / TILE_SIZE);

    coords.x = col * TILE_SIZE + TILE_HALF_SIZE;
    coords.y = row * TILE_SIZE + TILE_HALF_SIZE;
  };

  this.update = function(delta) {
    let oldX = x;
    let oldY = y;
    let mousePosition = Input.getMousePosition();

    let step = GRID_SCROLL_SPEED * delta;

    if (mousePosition.sx < maxLeftDistance || Input.isDown(KEY.A) || Input.isDown(KEY.LEFT)) {
      x -= step;
      document.body.style.cursor = "url('img/arrowLeft.png'), auto";
    }
    else if (maxRightDistance < mousePosition.sx || Input.isDown(KEY.D) || Input.isDown(KEY.RIGHT)) {
      x += step;
      document.body.style.cursor = "url('img/arrowRight.png'), auto";
    }

    if (mousePosition.sy < maxTopDistance || Input.isDown(KEY.W) || Input.isDown(KEY.UP)) {
      y -= step;
      document.body.style.cursor = "url('img/arrowUp.png'), auto";
    }
    else if (maxBottomDistance < mousePosition.sy || Input.isDown(KEY.S) || Input.isDown(KEY.DOWN)) {
      y += step;
      document.body.style.cursor = "url('img/arrowDown.png'), auto";
    }

    if (oldX === x && oldY === y) {
      document.body.style.cursor = "url('img/chickenCursor.png'), auto";
    }

    fixXY();

    if (Input.isDown(KEY.MOUSE_LEFT)) {
      let index = this.coordsToIndex(mousePosition.x, mousePosition.y);
      if (levelGrid[index] !== currentTileType) {
        removeDoublePlayerEnemyStarts();

        levelGrid[index] = currentTileType;

        let col = Math.floor(mousePosition.x / TILE_SIZE);
        let row = Math.floor(mousePosition.y / TILE_SIZE);

        drawImage(levelContext, TileImages[currentTileType], col * TILE_SIZE + TILE_HALF_SIZE, row * TILE_SIZE + TILE_HALF_SIZE);
      }
    }
  };

  function removeDoublePlayerEnemyStarts() {
    if (currentTileType !== TILE.TEAM_PLAYER && currentTileType !== TILE.TEAM_ENEMY) {
      return;
    }

    let length = levelGrid.length;
    for (let i = 0; i < length; i++) {
      if (levelGrid[i] === currentTileType) {
        levelGrid[i] = levelData.defaultTile;

        let colRow = Editor.indexToColRow(i);
        drawImage(levelContext, TileImages[levelData.defaultTile], colRow.col * TILE_SIZE + TILE_HALF_SIZE, colRow.row * TILE_SIZE + TILE_HALF_SIZE);
      }
    }
  }

  function fixXY() {
    if (x < 0) {
      x = 0;
      document.body.style.cursor = "url('img/noArrowLeft.png'), auto";
    }
    else if (maxX < x) {
      x = maxX;
      document.body.style.cursor = "url('img/noArrowRight.png'), auto";
    }
    if (y < 0) {
      y = 0;
      document.body.style.cursor = "url('img/noArrowUp.png'), auto";
    }
    else if (maxY < y) {
      y = maxY;
      document.body.style.cursor = "url('img/noArrowDown.png'), auto";
    }
  }

  this.draw = function() {
    gameContext.drawImage(levelCanvas, x, y, gameCanvas.width, gameCanvas.height, x, y, gameCanvas.width, gameCanvas.height);

    let pos = Input.getMousePosition();
    let col = Math.floor(pos.x / TILE_SIZE);
    let row = Math.floor(pos.y / TILE_SIZE);
    drawStrokeRect(gameContext, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE, 'white', 2);
  };

  function makeDraggable(element) {
    element.addEventListener('mousedown', function(event) {
      draggingButtonContainer = {
        mouseX: event.clientX,
        mouseY: event.clientY,
        startX: parseInt(element.offsetLeft),
        startY: parseInt(element.offsetTop)
      };

      if (element.setCapture) {
        element.setCapture();
      }
    });

    element.addEventListener('losecapture', function() {
      draggingButtonContainer = null;
    });

    document.addEventListener('mouseup', function() {
      draggingButtonContainer = null;

      if (document.releaseCapture) {
        document.releaseCapture();
      }
    }, true);

    let dragTarget = element.setCapture ? element : document;

    dragTarget.addEventListener('mousemove', function(event) {
      if (!draggingButtonContainer) {
        return;
      }

      let top = draggingButtonContainer.startY + (event.clientY - draggingButtonContainer.mouseY);
      let left = draggingButtonContainer.startX + (event.clientX - draggingButtonContainer.mouseX);

      element.style.top = Math.min(document.body.clientHeight - 75, Math.max(20, top)) + 'px';
      element.style.left = Math.min(document.body.clientWidth, Math.max(20, left)) + 'px';
    }, true);
  }

})();
