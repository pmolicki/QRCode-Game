class WorldMap {
  constructor(config) {
    this.world = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.mainImage = new Image();
    this.mainImage.src = config.mainSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }
  
  drawMainImage(ctx) {
    ctx.drawImage(
      this.mainImage,
      utils.withGrid(6.5),
      utils.withGrid(2),
      )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new WorldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const main = this.gameObjects["main"];
    const nextCoords = utils.nextPosition(main.x, main.y, main.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const main = this.gameObjects["main"];
    const match = this.cutsceneSpaces[ `${main.x},${main.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.WorldMaps = {
  Office: {
    id: "Office",
    mainSrc: "assets/maps/office.png",
    gameObjects: {
      main: new Entity({
        isPlayer: true,
        x: utils.withGrid(8),
        y: utils.withGrid(14),
      }),
      officenpc: new Entity({
        x: utils.withGrid(8),
        y: utils.withGrid(6),
        src: "assets/characters/officenpc.png",
      })
    },
  }
}