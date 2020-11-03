let game;

// global object where to store game options
let gameOptions = {
  // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
  firstPlatformPosition: 2 / 10,

  // game gravity, which only affects the hero
  gameGravity: 1200,

  // hero speed, in pixels per second
  heroSpeed: 300,

  // platform speed, in pixels per second
  platformSpeed: 190,

  // platform length range, in pixels
  platformLengthRange: [50, 150],

  // platform horizontal distance range from the center of the stage, in pixels
  platformHorizontalDistanceRange: [0, 250],

  // platform vertical distance range, in pixels
  platformVerticalDistanceRange: [150, 300],
};

window.onload = function () {
  // game configuration object
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x444444,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 750,
      height: 1334,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene: [gameIntro, playGame],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    this.load.image("platform", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fground_grass.png?v=1603601137907");
    this.load.image("background", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028");
    // Tāne
    this.load.spritesheet(
      "taneJump", 
      // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Jump-Sprite.png?v=1603601138273", 
      'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FJump-Strips.png?v=1604391530898',
      {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("taneRun", 
                          // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Run-Sprite.png?v=1603601139246", 
                          'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FRun-Strips.png?v=1604391531042',
                          {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("taneIdle", 
                          // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Idle-Sprite.png?v=1603601137744", 
                          'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FIdle-Strips.png?v=1604391874940',
    {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    // creation of the physics group which will contain all platforms
    this.platformGroup = this.physics.add.group();

    // create starting platform
    let platform = this.platformGroup.create(
      game.config.width / 2,
      game.config.height * gameOptions.firstPlatformPosition,
      "platform"
    );
    platform.setScale(0.5);

    // platform won't physically react to collisions
    platform.setImmovable(true);

    // we are going to create 10 more platforms which we'll reuse to save resources
    for (let i = 0; i < 10; i++) {
      // platform creation, as a member of platformGroup physics group
      let platform = this.platformGroup.create(0, 0, "platform");
      platform.setScale(0.5);

      // platform won't physically react to collisions
      platform.setImmovable(true);

      // position the platform
      this.positionPlatform(platform);
    }

    // add the hero
    this.hero = this.physics.add.sprite(game.config.width / 2, 0, "taneJump");
    this.hero.body
      .setSize(this.hero.width - 80, this.hero.height - 55)
      .setOffset(40, 30);

    // set hero gravity
    this.hero.body.gravity.y = gameOptions.gameGravity;

    // input listener to move the hero
    this.input.on("pointerdown", this.moveHero, this);

    // input listener to stop the hero
    this.input.on("pointerup", this.stopHero, this);

    // we are waiting for player first move
    this.firstMove = true;

    // ========= TANE ANIMATIONS ===========
    this.anims.create({
      key: "taneRun",
      frames: this.anims.generateFrameNumbers("taneRun", {
        frames: [16, 17, 18, 19, 20, 21, 22, 23],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "taneIdle",
      frames: this.anims.generateFrameNumbers("taneIdle", {
        frames: [0, 1, 2],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "taneJump",
      frames: this.anims.generateFrameNumbers("taneJump", { frames: [3] }),
      frameRate: 10,
      // repeat: -1
    });
  }

  // method to return a random value between index 0 and 1 of a giver array
  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  // method to move the hero
  moveHero(e) {
    // set hero velocity according to input horizontal coordinate
    this.hero.setVelocityX(
      gameOptions.heroSpeed * (e.x > game.config.width / 2 ? 1 : -1)
    );

    // is it the first move?
    if (this.firstMove) {
      // it's no longer the first move
      this.firstMove = false;

      // move platform group
      this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
    }
  }

  // method to stop the hero
  stopHero() {
    // ... just stop the hero :)
    this.hero.setVelocityX(0);
  }

  // method to get the lowest platform, returns the position of the lowest platform, in pixels
  getLowestPlatform() {
    let lowestPlatform = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      lowestPlatform = Math.max(lowestPlatform, platform.y);
    });
    return lowestPlatform;
  }

  // method to position a platform
  positionPlatform(platform) {
    // vertical position
    platform.y =
      this.getLowestPlatform() +
      this.randomValue(gameOptions.platformVerticalDistanceRange);

    // horizontal position
    platform.x =
      game.config.width / 2 +
      this.randomValue(gameOptions.platformHorizontalDistanceRange) *
        Phaser.Math.RND.sign();

    // platform width
    platform.displayWidth = this.randomValue(gameOptions.platformLengthRange);
  }

  // method to be executed at each frame
  update() {
    // handle collision between ball and platforms
    this.physics.world.collide(this.platformGroup, this.hero);

    // loop through all platforms
    this.platformGroup.getChildren().forEach(function (platform) {
      // if a platform leaves the stage to the upper side...
      if (platform.getBounds().bottom < 0) {
        // ... recycle the platform
        this.positionPlatform(platform);
      }
    }, this);

    if (this.hero.body.velocity.x === 0 && this.hero.body.velocity.y <= 20) {
      this.hero.play("taneIdle", true);
    } else if (this.hero.body.velocity.y > 0) {
      this.hero.play("taneJump");
    } else if (this.hero.body.velocity.x < 0) {
      this.hero.play("taneRun", true);
      this.hero.setFlipX(false);
    } else if (this.hero.body.velocity.x > 0) {
      this.hero.setFlipX(true);
      this.hero.play("taneRun", true);
    }

    // if the hero falls down or leaves the stage from the top...
    if (this.hero.y > game.config.height || this.hero.y < 0) {
      // restart the scene
      this.scene.start("GameIntro");
    }
  }
}

class gameIntro extends Phaser.Scene {
  constructor() {
    super("GameIntro");
  }
  preload() {
    this.load.image("platform", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fground_grass.png?v=1603601137907");
    this.load.image("background", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028");
    this.load.image("touchSides", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Ftouch-sides.png?v=1603601138715");

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    // creation of the physics group which will contain all platforms
    this.platformGroup = this.physics.add.group();

    // create starting platform
    let platform = this.platformGroup.create(
      game.config.width / 2,
      game.config.height * gameOptions.firstPlatformPosition,
      "platform"
    );
    platform.setScale(0.5);

    // platform won't physically react to collisions
    platform.setImmovable(true);

    // we are going to create 10 more platforms which we'll reuse to save resources
    for (let i = 0; i < 10; i++) {
      // platform creation, as a member of platformGroup physics group
      let platform = this.platformGroup.create(0, 0, "platform");
      platform.setScale(0.5);

      // platform won't physically react to collisions
      platform.setImmovable(true);

      // position the platform
      this.positionPlatform(platform);
    }

    // dialog ONE
    this.dialog1 = this.rexUI.add
      .dialog({
        x: 400,
        y: game.config.height/2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.createLabel(
          this,
          "Help Tāne descend the heavens \nbefore Whiro catches him!!",
          50,
          50
        ),
        actions: [this.createLabel(this, "NEXT", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          center: "center",
          actions: "right", // 'center'|'left'|'right'
        },

        click: {
          mode: "release",
        },
      })
      .setDraggable("background") // Draggable-background
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    // dialog TWO
    this.dialog2 = this.rexUI.add
      .dialog({
        x: 400,
        y: game.config.height/2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content:this.add.image(0, 0, "touchSides"),
        actions: [this.createLabel(this, "BEGIN", 10, 10)],
        space: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 20,
          content: 20,
          toolbarItem: 5,
          choice: 15,
          action: 15,
        },
        align: {
          content: "center",
          actions: "right", // 'center'|'left'|'right'
        },

        click: {
          mode: "release",
        },
      })
      .setDraggable("background") // Draggable-background
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .setVisible(false)

    var tween = this.tweens.add({
      targets: [this.dialog1, this.dialog2],
      scaleX: 1,
      scaleY: 1,
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false,
    });

    this.dialog1.on(
      "button.click",
      function (button) {
        if (button.text === "NEXT") {
          this.dialog1.setVisible(false)
          this.dialog2.setVisible(true).popUp(1000)
        }
      },
      this
    );

    this.dialog2.on(
      "button.click",
      function (button) {
        if (button.text === "BEGIN") {
          console.log("starting game")
        this.scene.start("PlayGame")
        }
      },
      this
    );


  }

  createLabel(scene, text, spaceTop, spaceBottom) {
    return scene.rexUI.add.label({
      width: 40, // Minimum width of round-rectangle
      height: 40, // Minimum height of round-rectangle

      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xffffff),

      text: scene.add.text(0, 0, text, {
        fontSize: "24px",
        color: "#533d8e",
        stroke: "#533d8e",
        strokeThickness: 2,
      }),

      space: {
        left: 10,
        right: 10,
        top: spaceTop,
        bottom: spaceBottom,
      },
    });
  }

  // method to get the lowest platform, returns the position of the lowest platform, in pixels
  getLowestPlatform() {
    let lowestPlatform = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      lowestPlatform = Math.max(lowestPlatform, platform.y);
    });
    return lowestPlatform;
  }

  // method to position a platform
  positionPlatform(platform) {
    // vertical position
    platform.y =
      this.getLowestPlatform() +
      this.randomValue(gameOptions.platformVerticalDistanceRange);

    // horizontal position
    platform.x =
      game.config.width / 2 +
      this.randomValue(gameOptions.platformHorizontalDistanceRange) *
        Phaser.Math.RND.sign();

    // platform width
    platform.displayWidth = this.randomValue(gameOptions.platformLengthRange);
  }

  // method to return a random value between index 0 and 1 of a giver array
  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  // method to be executed at each frame
  update() {}
}
