let Sprites = new (function() {
  /**
   * this.spriteName = {
   *   image: Images.imageName,
   *   frames: {
   *     default: {
   *       frames: 2, // number of frames
   *       frameTime: .2, // time a single frame lasts in seconds
   *       // Optional property to specify different timings per frame
   *       frameSpecificTimings: {2, .75, 3: .75}, // frameIndex: specificTiming in seconds
   *       width: 50, // Dimensions of each frame
   *       height: 50,
   *       firstFrameX: 0, // Position of the first frame
   *       firstFrameY: 0,
   *     },
   *     dying: {...}
   *     attack: {...}
   *   }
   * }
   */
  const sprites = {
    chicken: {
      image: 'chicken',
      frames: {
        default: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        attack: {
          frames: 4,
          frameTime: .16,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 160
        },
        build: {
          frames: 12,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 224
        },
        harvest: {
          frames: 4,
          frameTime: .1,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 256
        },
        moveRight: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 32
        },
        moveLeft: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 64
        },
        moveUp: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 128
        },
        moveDown: {
          frames: 3,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 96
        }
      }
    },
    chickenEnemy: {
      image: 'chickenEnemy',
      frames: {
        default: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        attack: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        build: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        harvest: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        moveRight: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 4
        },
        moveLeft: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 36
        },
        moveUp: {
          frames: 2,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 100
        },
        moveDown: {
          frames: 3,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 68
        }
      }
    },
    goblin: {
      image: 'goblin',
      frames: {
        default: {
          frames: 4,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 160
        },
        attack: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 0
        },
        moveRight: {
          frames: 6,
          frameTime: .18,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 32
        },
        moveLeft: {
          frames: 6,
          frameTime: .18,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 64
        },
        moveUp: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 128
        },
        moveDown: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 96
        }
      }
    },
    goblinEnemy: {
      image: 'goblinEnemy',
      frames: {
        default: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 0
        },
        attack: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 0
        },
        moveRight: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 32
        },
        moveLeft: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 64
        },
        moveUp: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 128
        },
        moveDown: {
          frames: 6,
          frameTime: .2,
          width: 32,
          height: 32,
          firstFrameX: 0,
          firstFrameY: 96
        }
      }
    },
    pig: {
      image: 'pig',
      frames: {
        default: {
          frames: 4,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 180
        },
        attack: {
          frames: 6,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 0
        },
        moveRight: {
          frames: 6,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 36
        },
        moveLeft: {
          frames: 6,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 72
        },
        moveUp: {
          frames: 6,
          frameTime: .18,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 144
        },
        moveDown: {
          frames: 6,
          frameTime: .18,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 108
        }
      }
    },
    pigEnemy: {
      image: 'pigEnemy',
      frames: {
        default: {
          frames: 3,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 0
        },
        attack: {
          frames: 6,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 0
        },
        moveRight: {
          frames: 6,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 26
        },
        moveLeft: {
          frames: 1,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 72,
          firstFrameY: 0
        },
        moveUp: {
          frames: 1,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 144
        },
        moveDown: {
          frames: 1,
          frameTime: .2,
          width: 36,
          height: 36,
          firstFrameX: 0,
          firstFrameY: 108
        }
      }
    },
    house: {
      image: 'house',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    buildButtonHouse: {
      image: 'buildButtonHouse',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    mudPit: {
      image: 'mudPit',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    buildButtonMudPit: {
      image: 'buildButtonMudPit',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    barracks: {
      image: 'barracks',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    buildButtonBarracks: {
      image: 'buildButtonBarracks',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    buildButtonChicken: {
      image: 'buildButtonChicken',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    buildButtonGoblin: {
      image: 'buildButtonGoblin',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    buildButtonPig: {
      image: 'buildButtonPig',
      frames: {
        default: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 0
        },
        hover: {
          frames: 1,
          frameTime: .8,
          width: 50,
          height: 50,
          firstFrameX: 0,
          firstFrameY: 50
        }
      },
    },
    houseEnemy: {
      image: 'houseEnemy',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    mudPitEnemy: {
      image: 'mudPitEnemy',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    barracksEnemy: {
      image: 'barracksEnemy',
      frames: {
        default: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 320,
          firstFrameY: 0
        },
        step0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 0
        },
        step1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 0
        },
        step2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 0
        },
        step3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 0
        },
        step4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 0
        },
        damage0: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 256,
          firstFrameY: 64
        },
        damage1: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 192,
          firstFrameY: 64
        },
        damage2: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 128,
          firstFrameY: 64
        },
        damage3: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 64,
          firstFrameY: 64
        },
        damage4: {
          frames: 1,
          frameTime: .2,
          width: 64,
          height: 64,
          firstFrameX: 0,
          firstFrameY: 64
        }
      },
    },
    slime: {
      image: 'slime',
      frames: {
        default: {
          frames: 12,
          frameTime: .2,
          width: 93,
          height: 62,
          firstFrameX: 0,
          firstFrameY: 0
        }
      },
    },
    slimeEnemy: {
      image: 'slimeEnemy',
      frames: {
        default: {
          frames: 12,
          frameTime: .2,
          width: 93,
          height: 62,
          firstFrameX: 0,
          firstFrameY: 0
        }
      },
    },
    slimePatch: {
      image: 'slimePatch',
      frames: {
        default: {
          frames: 4,
          frameTime: .2,
          width: 32,
          height: 22,
          firstFrameX: 0,
          firstFrameY: 0
        }
      },
    },
    slimePatchEnemy: {
      image: 'slimePatchEnemy',
      frames: {
        default: {
          frames: 4,
          frameTime: .2,
          width: 32,
          height: 22,
          firstFrameX: 0,
          firstFrameY: 0
        }
      },
    }
  };

  this.initialize = function(callback) {
    for (let key in sprites) {
      if (!sprites.hasOwnProperty(key)) {
        continue;
      }

      sprites[key]['image'] = Images[sprites[key]['image']];
      sprites[key]['frames'] = processFrameTimings(sprites[key]['frames']);
      this[key] = sprites[key];
    }

    if (callback) {
      callback();
    }
  };

  function processFrameTimings(frames) {
    for (let key in frames) {
      if (!frames.hasOwnProperty(key)) {
        continue;
      }

      let frame = frames[key];
      let timings = [];

      for (let i = 0; i < frame.frames; i++) {
        timings[i] = frame.frameTime;
      }

      if (frame.frameSpecificTimings) {
        for (let index in frame.frameSpecificTimings) {
          if (!frame.frameSpecificTimings.hasOwnProperty(index)) {
            continue;
          }

          timings[index] = frame.frameSpecificTimings[index];
        }
      }

      frames[key]['frameTimings'] = timings;
    }

    return frames;
  }
})();
