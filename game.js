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

  iter: 0
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
    scene: [gameIntro, playGame, GameOver, YouWin],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  init() {
    this.lives = 3;
    this.goldPoints = 0;
    this.silverPoints = 0;
    this.bronzePoints = 0;
  }
  preload() {
    this.load.image("platform", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fground_grass.png?v=1603601137907");
    this.load.image("background", "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fbg_layer1.png?v=1603601139028");
    this.load.image(
      "kowhaiwhai",
      "public/assets/kowhaiwhai.png"
    );
    this.load.atlasXML(
      "enemies",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fenemies.png?v=1603605920558",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fenemies.xml?v=1603606013060"
    );
    // Tāne
    this.load.spritesheet(
      "taneJump",
      // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Jump-Sprite.png?v=1603601138273", 
      'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FJump-Strips.png?v=1604391530898', {
        frameWidth: 128,
        frameHeight: 128,
      });
    this.load.spritesheet("taneRun",
      // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Run-Sprite.png?v=1603601139246", 
      'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FRun-Strips.png?v=1604391531042', {
        frameWidth: 128,
        frameHeight: 128,
      });
    this.load.spritesheet("taneIdle",
      // "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2F128-Idle-Sprite.png?v=1603601137744", 
      'https://cdn.glitch.com/5095b2d7-4d22-4866-a3b8-5f744eb40eb0%2FIdle-Strips.png?v=1604391874940', {
        frameWidth: 128,
        frameHeight: 128,
      });

    // this.load.audio("jump", "assets/sfx/phaseJump1.wav");
    this.load.audio(
      "jump",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-jump.ogg?v=1603606002409"
      "public/assets/jump.ogg"
    );
    this.load.audio(
      "die",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-die.ogg?v=1603606001864",
      "public/assets/die.ogg"
    );
    this.load.audio(
      "hurt",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-hurt.ogg?v=1603606002105"
      "public/assets/bad.ogg"
    );
    this.load.audio(
      "good",
      "public/assets/good.ogg"
    );
    this.load.audio(
      "music",
      "public/assets/music.mp3"
    );
    this.load.audio(
      "end-music",
      "public/assets/gameover-music.mp3"
    );
    this.load.audio(
      "cheer",
      "public/assets/cheer.wav"
    );

    // token types
    this.load.image(
      "bronze-token-type",
      "public/assets/tane-bronze-token.png"
    );
    this.load.image(
      "silver-token-type",
      "public/assets/tane-silver-token.png"
    );
    this.load.image(
      "gold-token-type",
      "public/assets/tane-gold-token.png"
    );


    this.load.image(
      "bronze-token-overlay",
      "public/assets/bronze-overlay.png"
    );
    this.load.image(
      "silver-token-overlay",
      "public/assets/silver-overlay.png"
    );
    this.load.image(
      "gold-token-overlay",
      "public/assets/gold-overlay.png"
    );


    this.load.image(
      "bronze-token-mask",
      "public/assets/bronze-mask.png"
    );
    this.load.image(
      "silver-token-mask",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fsilver-mask.png?v=1609560524913"
    );
    this.load.image(
      "gold-token-mask",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fgold-mask.png?v=1609560523932"
    );

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );

    // coins
    this.load.image("blue-coin-1", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_1.png");
    this.load.image("blue-coin-2", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_2.png");
    this.load.image("blue-coin-3", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_3.png");
    this.load.image("blue-coin-4", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_4.png");
    this.load.image("blue-coin-5", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_5.png");
    this.load.image("blue-coin-6", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_6.png");
    this.load.image("bronze-coin-1", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_1.png");
    this.load.image("bronze-coin-2", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_2.png");
    this.load.image("bronze-coin-3", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_3.png");
    this.load.image("bronze-coin-4", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_4.png");
    this.load.image("bronze-coin-5", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_5.png");
    this.load.image("bronze-coin-6", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_6.png");
    this.load.image("gold-coin-1", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_1.png");
    this.load.image("gold-coin-2", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_2.png");
    this.load.image("gold-coin-3", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_3.png");
    this.load.image("gold-coin-4", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_4.png");
    this.load.image("gold-coin-5", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_5.png");
    this.load.image("gold-coin-6", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_6.png");
    this.load.image("silver-coin-1", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_1.png");
    this.load.image("silver-coin-2", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_2.png");
    this.load.image("silver-coin-3", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_3.png");
    this.load.image("silver-coin-4", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_4.png");
    this.load.image("silver-coin-5", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_5.png");
    this.load.image("silver-coin-6", "https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_6.png");

    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );

    // rexUI plugin
    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  create() {
    // ========= BACKGROUNDS ===========
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.kowhaiwhaiBackground = this.add.tileSprite(game.config.width / 2, game.config.height / 2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    // ========= MUSIC ===========
    this.sound.stopAll()
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000
    }
    this.music = this.sound.add("music", musicConfig);
    this.music.play();

    // ========= LIVES TEXT UI ===========
    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {

        this.livesText = this.add
          .text(game.config.width / 2, 50, "Lives: " + this.lives, {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.livesText.setAlign("center");
        this.livesText.setOrigin();
        this.livesText.setScrollFactor(0)

        this.goldPointsText = this.add
          .text(game.config.width - 60, 250, this.goldPoints + "%", {
            fontFamily: "Freckle Face",
            fontSize: 40,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.goldPointsText.setAlign("center");
        this.goldPointsText.setOrigin();
        this.goldPointsText.setScrollFactor(0)
        this.goldPointsText.setDepth(200)

        this.silverPointsText = this.add
          .text(game.config.width - 60, 150, this.silverPoints + "%", {
            fontFamily: "Freckle Face",
            fontSize: 40,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.silverPointsText.setAlign("center");
        this.silverPointsText.setOrigin();
        this.silverPointsText.setScrollFactor(0)
        this.silverPointsText.setDepth(200)

        this.bronzePointsText = this.add
          .text(game.config.width - 60, 50, this.bronzePoints + "%", {
            fontFamily: "Freckle Face",
            fontSize: 40,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.bronzePointsText.setAlign("center");
        this.bronzePointsText.setOrigin();
        this.bronzePointsText.setScrollFactor(0)
        this.bronzePointsText.setDepth(200)



      }
    });

    // ========= ANIMATIONS ===========
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
      frames: this.anims.generateFrameNumbers("taneJump", {
        frames: [3]
      }),
      frameRate: 10,
      // repeat: -1
    });
    //coins anims
    this.anims.create({
      key: "blueCoin",
      frames: [{
          key: "blue-coin-1",
          frame: 0
        },
        {
          key: "blue-coin-2",
          frame: 0
        },
        {
          key: "blue-coin-3",
          frame: 0
        },
        {
          key: "blue-coin-4",
          frame: 0
        },
        {
          key: "blue-coin-5",
          frame: 0
        },
        {
          key: "blue-coin-6",
          frame: 0
        },
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "goldCoin",
      frames: [{
          key: "gold-coin-1",
          frame: 0
        },
        {
          key: "gold-coin-2",
          frame: 0
        },
        {
          key: "gold-coin-3",
          frame: 0
        },
        {
          key: "gold-coin-4",
          frame: 0
        },
        {
          key: "gold-coin-5",
          frame: 0
        },
        {
          key: "gold-coin-6",
          frame: 0
        },
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "silverCoin",
      frames: [{
          key: "silver-coin-1",
          frame: 0
        },
        {
          key: "silver-coin-2",
          frame: 0
        },
        {
          key: "silver-coin-3",
          frame: 0
        },
        {
          key: "silver-coin-4",
          frame: 0
        },
        {
          key: "silver-coin-5",
          frame: 0
        },
        {
          key: "silver-coin-6",
          frame: 0
        },
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "bronzeCoin",
      frames: [{
          key: "bronze-coin-1",
          frame: 0
        },
        {
          key: "bronze-coin-2",
          frame: 0
        },
        {
          key: "bronze-coin-3",
          frame: 0
        },
        {
          key: "bronze-coin-4",
          frame: 0
        },
        {
          key: "bronze-coin-5",
          frame: 0
        },
        {
          key: "bronze-coin-6",
          frame: 0
        },
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "bee",
      frames: [{
          key: "enemies",
          frame: "bee.png"
        },
        {
          key: "enemies",
          frame: "bee_fly.png"
        }
      ],
      frameRate: 8,
      repeat: -1
    });

    // ========= RESET FIRST MOVE ===========
    this.firstMove = true;
    this.leshgo = false

    // ========= GROUPS ===========
    // creation of the physics group which will contain all platforms
    this.platformGroup = this.physics.add.group();
    // create group for tokens
    this.tokenGroup = this.physics.add.group({
      maxSize: 100
    });
    // create group for enemies
    this.enemiesGroup = this.physics.add.group();

    // ========= PLATFORMS ===========
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

    // ========= PLAYER ===========
    // add the hero
    this.hero = this.physics.add.sprite(game.config.width / 2, 0, "taneJump");
    this.hero.body
      .setSize(this.hero.width - 100, this.hero.height - 55)
      .setOffset(52, 28);

    // set hero gravity
    this.hero.body.gravity.y = gameOptions.gameGravity;

    // ========= COLLIDERS ===========
    // this.physics.add.collider(this.platformGroup, this.tokenGroup);
    this.physics.add.collider(this.platformGroup, this.enemiesGroup);
    this.physics.add.overlap(
      this.hero,
      this.tokenGroup,
      this.handleCollectToken,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.hero,
      this.enemiesGroup,
      this.handleEnemyHit,
      undefined,
      this
    );

    // ========= CONTROLS ===========
    // input listener to move the hero
    this.input.on("pointerdown", this.moveHero, this);

    // input listener to stop the hero
    this.input.on("pointerup", this.stopHero, this);

    // we are waiting for player first move
    this.firstMove = true;

    // // ========= TOKEN METERS ===========
    // Bronze token type
    // the token container. A simple sprite
    let tokenBronze = this.add
      .sprite(game.config.width - 60, 50, "bronze-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    // the energy bar. Another simple sprite
    this.tokenBronzeBar = this.add
      .sprite(
        tokenBronze.x, tokenBronze.y + 75, "bronze-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)

    console.log("brown bar starting Y:", this.tokenBronzeBar.y)
    // a copy of the energy bar to be used as a mask. Another simple sprite but...
    //energybar width is 500px (at 0.2 scale energybar width is 100px)
    this.tokenBronzeMask = this.add
      .sprite(tokenBronze.x, tokenBronze.y, "bronze-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenBronzeMask.visible = true;
    // and we assign it as energyBar's mask.
    this.tokenBronzeBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenBronzeMask
    );

    // Silver token type
    let tokenSilver = this.add
      .sprite(game.config.width - 60, 150, "silver-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverBar = this.add
      .sprite(
        tokenSilver.x, tokenSilver.y + 75, "silver-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverMask = this.add
      .sprite(tokenSilver.x, tokenSilver.y, "silver-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverMask.visible = true;
    this.tokenSilverBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenSilverMask
    );

    // Gold token type
    let tokenGold = this.add
      .sprite(game.config.width - 60, 250, "gold-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldBar = this.add
      .sprite(
        tokenGold.x, tokenGold.y + 75, "gold-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldMask = this.add
      .sprite(tokenGold.x, tokenGold.y, "gold-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldMask.visible = true;
    this.tokenGoldBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenGoldMask
    );

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
      this.leshgo = true

      // move platform group
      this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
      this.tokenGroup.setVelocityY(-gameOptions.platformSpeed);
      // this.enemiesGroup.setVelocityY(-gameOptions.platformSpeed); 
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

    // console.log("new platform x:",platform.x,"y:",platform.y)

    this.addTokenAbove(platform)

    if (this.leshgo === true) {
      this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
      this.tokenGroup.setVelocityY(-gameOptions.platformSpeed);
      // this.enemiesGroup.setVelocityY(-gameOptions.platformSpeed);
    }
  }

  // add token above platform
  addTokenAbove(platform) {

    // set token y position
    const y = platform.y - platform.displayHeight;

    // get random number to determine which token to randomly place
    const random = Phaser.Math.Between(1, 6);

    let token;
    let bee;

    switch (random) {
      case 1:
        token = this.tokenGroup.create(platform.x, y, "gold-coin-1").play("goldCoin", true);
        console.log("new gold token added")
        break;
      case 2:
        token = this.tokenGroup.create(platform.x, y, "silver-coin-1").play("silverCoin", true);
        console.log("new silver token added")
        break;
      case 3:
        token = this.tokenGroup.create(platform.x, y, "bronze-coin-1").play("bronzeCoin", true); // bronzeToken.setActive(true);
        console.log("new bronze token added")
        break;
      default:
        bee = this.enemiesGroup.create(platform.x, y, "bee").play("bee", true)
        bee.body
          .setSize(bee.width, bee.height)
        // .setOffset(52, 28);
        console.log("enemy added")
        break;
    }
    // console.log("last token item:", tokenGroupArr[tokenGroupArr.length - 1])
    // this.tokenGroup.refresh()
    // this.token.setImmovable(true);
    if (token) {
      this.physics.world.enable(token)
      token.enableBody()
    }
    if (bee) {
      this.physics.world.enable(bee)
      bee.enableBody()
    }

  }

  handleCollectToken(player, token) {

    // remove touched token
    this.tokenGroup.killAndHide(token);
    this.physics.world.disableBody(token.body);

    // get token type
    const tokenGot = token.texture.key.split("-")[0]

    // how many increments (eg. one token = 10%)
    const pointIncrement = 10
    // calc increments of token meter bar
    // this.tokenBronzeBar.y - tokenBronzeBar.y end position / 10 (10 increments)
    const barIncrement = (125 - 50) / pointIncrement
    console.log("barIncrement: ", barIncrement)


    // take action depending on which token touched    
    this.sound.play("good");
    if (tokenGot == "gold") {
      // TODO: increase gold token type
      this.tokenGoldBar.y -= barIncrement
      this.goldPoints += pointIncrement
      this.goldPointsText.setText(this.goldPoints + "%")
      if (this.goldPoints == 100) {
        console.log("YOU WIN")
        this.scene.start("you-win");
      }
    } else if (tokenGot == "silver") {
      this.tokenSilverBar.y -= barIncrement
      this.silverPoints += pointIncrement
      this.silverPointsText.setText(this.silverPoints + "%")
      if (this.silverPoints == 100) {
        console.log("YOU WIN")
        this.scene.start("you-win");
      }
    } else if (tokenGot == "bronze") {
      this.tokenBronzeBar.y -= barIncrement
      this.bronzePoints += pointIncrement
      this.bronzePointsText.setText(this.bronzePoints + "%")
      if (this.bronzePoints == 100) {
        console.log("YOU WIN")
        this.scene.start("you-win");
      }
    }
  }

  handleEnemyHit(player, enemy) {
    this.enemiesGroup.killAndHide(enemy);
    this.physics.world.disableBody(enemy.body);

    if (this.lives <= 1) {
      this.scene.start("game-over");
    }
    this.lives--;
    this.sound.play("hurt");
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  // method to be executed at each frame
  update() {
    // handle collision between ball and platforms
    this.physics.world.collide(this.platformGroup, this.hero);

    this.tokenGroup.getChildren().forEach((token) => {
      // if a platform leaves the stage to the upper side...
      if (token.getBounds().bottom < 0) {
        // ... recycle the platform
        console.log("tokens length:", this.tokenGroup.getChildren().length)
        this.tokenGroup.remove(token)
        console.log("Token REMOVED")
        console.log("tokens length:", this.tokenGroup.getChildren().length)
      }
    });


    // loop through all platforms
    this.platformGroup.getChildren().forEach((platform) => {
      // if a platform leaves the stage to the upper side...
      if (platform.getBounds().bottom < 0) {
        // ... recycle the platform
        console.log("recyling")
        // console.log("old platform x:",platform.x,"y:",platform.y)
        this.positionPlatform(platform);
      }
    });



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
      this.scene.start("game-over");
    }

    if (this.firstMove == false) {
      // wait for first move before moving background
      this.kowhaiwhaiBackground.tilePositionY += 1;
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
    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/f605c78d-cefb-481c-bb78-d09a6bffa1e6%2Fkowhaiwhai.png?v=1609560527158"
    );

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }
  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.add.tileSprite(game.config.width / 2, game.config.height / 2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

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
        y: game.config.height / 2,
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
      .layout()
      // .drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    // dialog TWO
    this.dialog2 = this.rexUI.add
      .dialog({
        x: 400,
        y: game.config.height / 2,
        width: 500,
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x533d8e),
        content: this.add.image(0, 0, "touchSides"),
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

class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create() {
    this.sound.stopAll()
    this.sound.play("die");
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000
    }
    this.endMusic = this.sound.add("end-music", musicConfig);
    this.endMusic.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add.tileSprite(game.config.width / 2, game.config.height / 2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {

        this.gameOver = this.add
          .text(game.config.width / 2, game.config.height / 2 - 100, "Game Over", {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0)

        this.pressRestart = this.add
          .text(game.config.width / 2, game.config.height / 2, "Press Space to Restart", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.pressRestart.setAlign("center");
        this.pressRestart.setOrigin();
        this.pressRestart.setScrollFactor(0)

      }
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("PlayGame");
    });
  }
}

class YouWin extends Phaser.Scene {
  constructor() {
    super("you-win");
  }

  create() {
    this.cameras.main.setBackgroundColor("#533d8e");

    this.sound.stopAll()
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: false,
      delay: 3000
    }
    this.cheer = this.sound.add("cheer", musicConfig);
    this.cheer.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add.tileSprite(game.config.width / 2, game.config.height / 2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {

        this.gameOver = this.add
          .text(game.config.width / 2, game.config.height / 2 - 100, "You Win!", {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0)

        this.add.text(game.config.width / 2, game.config.height / 2, "Tino pai to mahi.", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0)
        this.add.text(game.config.width / 2, game.config.height / 2 + 100, "You collected all the actions\n to complete this moemoeā.", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0)

      }
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("PlayGame");
    });
  }
}