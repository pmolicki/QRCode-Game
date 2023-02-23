class WorldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)

  }

  getQuizResultMessage() {
    const dictionary = {
      0: 'Were you even trying? Considering your score, we have prepared, one, last surprise for you after the game.',
      1: 'You have still much to learn. Considering your score, we have prepared, one, last surprise for you after the game.',
      2: 'Pretty good but there is still room for improvement. You will be redirected to our career page in a moment.',
      3: 'Outstanding. I hope we will see you in near future. You will be redirected to our career page in a moment.'
    }
    return dictionary[window.score]
  }

  textMessage(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    if (this.event.faceMain) {
      const obj = this.map.gameObjects[this.event.faceMain];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["main"].direction);
    }
    
    
    const message = new TextMessage({
      text: this.event.shouldUpdate ? this.getQuizResultMessage : this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  modal(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    const completeHandler = (e) => {
      if(!e.isOpen) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve()
      }
    }

    document.addEventListener('modalChange', completeHandler)
  }

  changeMap(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.world.startMap( window.WorldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();

      sceneTransition.fadeOut();

    })
  }

  pause(resolve) {
    if(this.event.hook && typeof this.event.hook === 'function'){
      this.event.hook();
    }

    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.world.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.world.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}