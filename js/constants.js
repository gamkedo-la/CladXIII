let DEBUG = false;
let AI_ENABLED = true;
const FRAME_RATE = 60;
const CANVAS_PADDING = 60;

const TEAM_NONE = 0;
const TEAM_PLAYER = 1;
const TEAM_ENEMY = 2;

const MIN_COLS_FREE = 3;
const MIN_ROWS_FREE = 3;
const MIN_COLS_FROM_EDGE = 5;
const MIN_ROWS_FROM_EDGE = 5;

const MAX_BUILD_DISTANCE = 340;
const MAX_BUILD_DISTANCE_SQUARED = MAX_BUILD_DISTANCE * MAX_BUILD_DISTANCE;

const FONT_COLOR = '#7f5333';
const SHADOW_COLOR = '#351b14';
const MENU_FONT = '24px compass';
const MENU_COLOR = '#cff09e';
const BUTTON_COUNT_FONT = '16px compass';
const UNITS_FONT = '18px compass';
const SLIME_FONT = '26px compass';

const DEC2RAD = (Math.PI / 180);

const ANGLE15 = 15 * DEC2RAD;
const ANGLE35 = 35 * DEC2RAD;
const ANGLE55 = 55 * DEC2RAD;
const ANGLE90 = 90 * DEC2RAD;
const ANGLE145 = 145 * DEC2RAD;
const ANGLE180 = 180 * DEC2RAD;
const ANGLE235 = 235 * DEC2RAD;
const ANGLE305 = 305 * DEC2RAD;
const ANGLE360 = Math.PI * 2;

const TILE_SIZE = 32;
const TILE_HALF_SIZE = TILE_SIZE / 2;
const TILE_COLLISION_SIZE = TILE_HALF_SIZE + 2;

const GRID_SCROLL_SPEED = 200;

const LASSO_COLOR = '#00beef';
const SELECTED_COLOR = '#00beef';
const MINIMAP_UNIT_COLOR = '#00efbe';
const MINIMAP_UNIT_COLOR_ENEMY = '#ff2554';
const HEALTH_BAR_COLOR = '#00beef';
const HEALTH_BAR_WIDTH = TILE_SIZE - 4;

const MIN_NUM_UNITS = 5;
const ABS_MIN_NUM_UNITS = 50;
const STARTING_AMOUNT_SLIME = 100;

let COSTS = [];
COSTS['House'] = 30;
COSTS['Barracks'] = 30;
COSTS['MudPit'] = 30;
COSTS['Chicken'] = 30;
COSTS['Pig'] = 30;
COSTS['Goblin'] = 30;
COSTS['HouseEnemy'] = 30;
COSTS['BarracksEnemy'] = 30;
COSTS['MudPitEnemy'] = 30;
COSTS['ChickenEnemy'] = 30;
COSTS['PigEnemy'] = 30;
COSTS['GoblinEnemy'] = 30;

const TILE = {
  TEAM_PLAYER: 1,
  TEAM_ENEMY: 2,

  PLAYER_CHICKEN: 10,
  PLAYER_PIG: 11,
  PLAYER_GOBLIN: 12,
  PLAYER_HOUSE: 13,
  PLAYER_BARRACKS: 14,
  PLAYER_MUD_PIT: 15,
  PLAYER_SLIME: 16,

  ENEMY_CHICKEN: 30,
  ENEMY_PIG: 31,
  ENEMY_GOBLIN: 32,
  ENEMY_HOUSE: 33,
  ENEMY_BARRACKS: 34,
  ENEMY_MUD_PIT: 35,
  ENEMY_SLIME: 36,


  GRASS: 50,
  TREES: 51,
  SNOW: 52,
  MOUNTAIN1: 53,
  MOUNTAIN2: 54,
  MOUNTAIN3: 55,
  TREE_STUMP: 56,
  TREES2: 57,
  TREES3: 58,
  TREES4: 59,
  TREES5: 60,
  TREES6: 61,

  SNOW_ROAD1: 62,
  SNOW_ROAD2: 63,
  SNOW_ROAD3: 64,
  SNOW_ROAD4: 65,
  SNOW_ROAD5: 66,
  SNOW_ROAD6: 67,
  SNOW_ROAD7: 68,
  SNOW_ROAD8: 69,
  SNOW_ROAD9: 70,
  SNOW_ROAD10: 71,
  SNOW_ROAD11: 72,
  SNOW_ROAD12: 73,
  SNOW_ROAD13: 74,
  SNOW_ROAD14: 75,
  SNOW_ROAD15: 76,
  SNOW_ROAD16: 77,
  SNOW_ROAD17: 78,
  SNOW_ROAD18: 79,
  SNOW_ROAD19: 80,
  SNOW_ROAD20: 81,

  MUD_ROAD1: 82,
  MUD_ROAD2: 83,
  MUD_ROAD3: 84,
  MUD_ROAD4: 85,
  MUD_ROAD5: 86,
  MUD_ROAD6: 87,
  MUD_ROAD7: 88,
  MUD_ROAD8: 89,
  MUD_ROAD9: 90,
  MUD_ROAD10: 91,
  MUD_ROAD11: 92,
  MUD_ROAD12: 93,
  MUD_ROAD13: 94,
  MUD_ROAD14: 95,
  MUD_ROAD15: 96,
  MUD_ROAD16: 97,
  MUD_ROAD17: 98,
  MUD_ROAD18: 99,
  MUD_ROAD19: 100,
  MUD_ROAD20: 101,

  ICE_TOP_LEFT: 102,
  ICE_TOP_CENTER: 103,
  ICE_TOP_RIGHT: 104,
  ICE_MIDDLE_LEFT: 105,
  ICE_MIDDLE_CENTER: 106,
  ICE_MIDDLE_RIGHT: 107,
  ICE_BOTTOM_LEFT: 108,
  ICE_BOTTOM_CENTER: 109,
  ICE_BOTTOM_RIGHT: 110,
};

const LEVEL_TILES = [
  { type: TILE.TEAM_PLAYER, x: 64, y: 0, editorOnly: true },
  { type: TILE.TEAM_ENEMY, x: 96, y: 0, editorOnly: true },
  { type: TILE.GRASS, x: 0, y: 0 },
  { type: TILE.TREES, x: 32, y: 0 },

  { type: TILE.SNOW, x: 0, y: 32 },
  { type: TILE.MOUNTAIN1, x: 32, y: 32 },
  { type: TILE.MOUNTAIN2, x: 64, y: 32 },
  { type: TILE.MOUNTAIN3, x: 96, y: 32 },
  { type: TILE.TREE_STUMP, x: 128, y: 32 },
  { type: TILE.TREES2, x: 160, y: 32 },
  { type: TILE.TREES3, x: 192, y: 32 },
  { type: TILE.TREES4, x: 224, y: 32 },
  { type: TILE.TREES5, x: 256, y: 32 },
  { type: TILE.TREES6, x: 288, y: 32 },

  { type: TILE.SNOW_ROAD1, x: 0, y: 64 },
  { type: TILE.SNOW_ROAD2, x: 32, y: 64 },
  { type: TILE.SNOW_ROAD3, x: 64, y: 64 },
  { type: TILE.SNOW_ROAD4, x: 96, y: 64 },
  { type: TILE.SNOW_ROAD5, x: 128, y: 64 },
  { type: TILE.SNOW_ROAD6, x: 160, y: 64 },
  { type: TILE.SNOW_ROAD7, x: 192, y: 64 },
  { type: TILE.SNOW_ROAD8, x: 224, y: 64 },
  { type: TILE.SNOW_ROAD9, x: 256, y: 64 },
  { type: TILE.SNOW_ROAD10, x: 288, y: 64 },
  { type: TILE.SNOW_ROAD11, x: 0, y: 96 },
  { type: TILE.SNOW_ROAD12, x: 32, y: 96 },
  { type: TILE.SNOW_ROAD13, x: 64, y: 96 },
  { type: TILE.SNOW_ROAD14, x: 96, y: 96 },
  { type: TILE.SNOW_ROAD15, x: 128, y: 96 },
  { type: TILE.SNOW_ROAD16, x: 160, y: 96 },
  { type: TILE.SNOW_ROAD17, x: 192, y: 96 },
  { type: TILE.SNOW_ROAD18, x: 224, y: 96 },
  { type: TILE.SNOW_ROAD19, x: 256, y: 96 },
  { type: TILE.SNOW_ROAD20, x: 288, y: 96 },

  { type: TILE.MUD_ROAD1, x: 0, y: 128 },
  { type: TILE.MUD_ROAD2, x: 32, y: 128 },
  { type: TILE.MUD_ROAD3, x: 64, y: 128 },
  { type: TILE.MUD_ROAD4, x: 96, y: 128 },
  { type: TILE.MUD_ROAD5, x: 128, y: 128 },
  { type: TILE.MUD_ROAD6, x: 160, y: 128 },
  { type: TILE.MUD_ROAD7, x: 192, y: 128 },
  { type: TILE.MUD_ROAD8, x: 224, y: 128 },
  { type: TILE.MUD_ROAD9, x: 256, y: 128 },
  { type: TILE.MUD_ROAD10, x: 288, y: 128 },
  { type: TILE.MUD_ROAD11, x: 0, y: 160 },
  { type: TILE.MUD_ROAD12, x: 32, y: 160 },
  { type: TILE.MUD_ROAD13, x: 64, y: 160 },
  { type: TILE.MUD_ROAD14, x: 96, y: 160 },
  { type: TILE.MUD_ROAD15, x: 128, y: 160 },
  { type: TILE.MUD_ROAD16, x: 160, y: 160 },
  { type: TILE.MUD_ROAD17, x: 192, y: 160 },
  { type: TILE.MUD_ROAD18, x: 224, y: 160 },
  { type: TILE.MUD_ROAD19, x: 256, y: 160 },
  { type: TILE.MUD_ROAD20, x: 288, y: 160 },

  { type: TILE.ICE_TOP_LEFT, x: 0, y: 192 },
  { type: TILE.ICE_TOP_CENTER, x: 32, y: 192 },
  { type: TILE.ICE_TOP_RIGHT, x: 64, y: 192 },
  { type: TILE.ICE_MIDDLE_LEFT, x: 0, y: 224 },
  { type: TILE.ICE_MIDDLE_CENTER, x: 32, y: 224 },
  { type: TILE.ICE_MIDDLE_RIGHT, x: 64, y: 224 },
  { type: TILE.ICE_BOTTOM_LEFT, x: 0, y: 256 },
  { type: TILE.ICE_BOTTOM_CENTER, x: 32, y: 256 },
  { type: TILE.ICE_BOTTOM_RIGHT, x: 64, y: 256 },
];

const WALKABLE_TILES = [
  0, // Index for the default tile
  TILE.TEAM_PLAYER,
  TILE.TEAM_ENEMY,
  TILE.GRASS,
  TILE.SNOW,
  TILE.SNOW_ROAD1,
  TILE.SNOW_ROAD2,
  TILE.SNOW_ROAD3,
  TILE.SNOW_ROAD4,
  TILE.SNOW_ROAD5,
  TILE.SNOW_ROAD6,
  TILE.SNOW_ROAD7,
  TILE.SNOW_ROAD8,
  TILE.SNOW_ROAD9,
  TILE.SNOW_ROAD10,
  TILE.SNOW_ROAD11,
  TILE.SNOW_ROAD12,
  TILE.SNOW_ROAD13,
  TILE.SNOW_ROAD14,
  TILE.SNOW_ROAD15,
  TILE.SNOW_ROAD16,
  TILE.SNOW_ROAD17,
  TILE.SNOW_ROAD18,
  TILE.SNOW_ROAD19,
  TILE.SNOW_ROAD20,

  TILE.MUD_ROAD1,
  TILE.MUD_ROAD2,
  TILE.MUD_ROAD3,
  TILE.MUD_ROAD4,
  TILE.MUD_ROAD5,
  TILE.MUD_ROAD6,
  TILE.MUD_ROAD7,
  TILE.MUD_ROAD8,
  TILE.MUD_ROAD9,
  TILE.MUD_ROAD10,
  TILE.MUD_ROAD11,
  TILE.MUD_ROAD12,
  TILE.MUD_ROAD13,
  TILE.MUD_ROAD14,
  TILE.MUD_ROAD15,
  TILE.MUD_ROAD16,
  TILE.MUD_ROAD17,
  TILE.MUD_ROAD18,
  TILE.MUD_ROAD19,
  TILE.MUD_ROAD20,

  TILE.ICE_TOP_LEFT,
  TILE.ICE_TOP_CENTER,
  TILE.ICE_TOP_RIGHT,
  TILE.ICE_MIDDLE_LEFT,
  TILE.ICE_MIDDLE_CENTER,
  TILE.ICE_MIDDLE_RIGHT,
  TILE.ICE_BOTTOM_LEFT,
  TILE.ICE_BOTTOM_CENTER,
  TILE.ICE_BOTTOM_RIGHT,

  // character tiles need to be walkable during level initializing
  TILE.PLAYER_CHICKEN,
  TILE.PLAYER_PIG,
  TILE.PLAYER_GOBLIN,
  TILE.ENEMY_CHICKEN,
  TILE.ENEMY_PIG,
  TILE.ENEMY_GOBLIN
];

const KEY = {
  MOUSE_LEFT: 'MOUSE_LEFT',
  MOUSE_MIDDLE: 'MOUSE_MIDDLE',
  MOUSE_RIGHT: 'MOUSE_RIGHT',

  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  DELETE: 46,
  PERIOD: 190,

  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,

  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
};
