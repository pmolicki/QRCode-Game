import DirectionInput from './directioninput.js';
import WorldMap from "./worldmap.js";
import KeyListener from "./keylistener.js";
import Progress from "./progress.js";
import TitleScreen from "./titlescreen.js";

export default class World {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.modal = config.modal;
  }
  
  startGameLoop() {
    const step = () => {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      this.map.drawMainImage(this.ctx);

      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx);
      })

      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();
        })
      }
    }
    step();
  }

  bindActionInput() {
    new KeyListener("Enter", () => {
      this.map.checkForActionCutscene()
    })
    new KeyListener("Escape", () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          {type: "pause"}
        ])
      }
    })
  }

  bindMainPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "main") {
        this.map.checkForFootstepCutscene()
      }
    })
  }

  startMap(mapConfig, mainInitialState = null) {
    this.map = new WorldMap(mapConfig);
    this.map.world = this;
    this.map.mountObjects();

    if (mainInitialState) {
      const {main} = this.map.gameObjects;
      this.map.removeWall(main.x, main.y);
      main.x = mainInitialState.x;
      main.y = mainInitialState.y;
      main.direction = mainInitialState.direction;
      this.map.addWall(main.x, main.y);
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingMainX = this.map.gameObjects.main.x;
    this.progress.startingMainY = this.map.gameObjects.main.y;
    this.progress.startingMainDirection = this.map.gameObjects.main.direction;

  }

  async init() {

    const container = document.querySelector(".game-container");

    this.progress = new Progress();

    this.titleScreen = new TitleScreen({
      progress: this.progress
    })
    await this.titleScreen.init(container)

    let initialMainState = null;
    const useSaveFile = this.progress.getSaveFile();
    if (useSaveFile) {
      this.progress.load();
      initialMainState = {
        x: this.progress.startingMainX,
        y: this.progress.startingMainY,
        direction: this.progress.startingMainDirection,
      }
    }

    this.startMap(window.WorldMaps[this.progress.mapId], initialMainState);


    this.bindActionInput();
    this.bindMainPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      {type: "stand", who: "main", direction: "up"},
      {type: "stand", who: "officenpc", direction: "down"},
      {type: "textMessage", text: "We are glad that you decided to check out our offer on ALM career page. You might be suprised to see something else but don't worry, this is intended."},
      {type: "textMessage", text: "Before we let you in, we decided to check a tiny bit of your programming knowledge. Don't be scared, it should be easy... or not :D"},
      {type: "textMessage", text: "Our digital HR employee will explain everything to you."},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "walk", who: "main", direction: "up", time: 300},
      {type: "textMessage", text: "Welcome. I am very happy to see you here. Now, I will go straight to the point and clarify what awaits for you in couple seconds."},
      {type: "textMessage", text: "Small quiz will pop out where you will have to answer three questions."},
      {type: "textMessage", text: "After answering all three, just click the button 'submit'. Good luck."},
      {type: "modal", hook: () => {
          this.modal.show();
        }
      },
      {type: "textMessage", text: "Update", shouldUpdate: true},  
      {type: "textMessage", text: "Thank you for playing our mini-game. We wish you a bright future as a programmer. Have a nice day!"},
      {type: "redirect"},
    ])
  }
}