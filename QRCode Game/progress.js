export default class Progress {
    constructor() {
      this.mapId = "Office";
      this.startingMainX = 0;
      this.startingMainY = 0;
      this.startingMainDirection = "up";
      this.saveFileKey = "Save1";
    }
  
    save() {
      window.localStorage.setItem(this.saveFileKey, JSON.stringify({
        mapId: this.mapId,
        startingMainX: this.startingMainX,
        startingMainY: this.startingMainY,
        startingMainDirection: this.startingMainDirection,
      }))
    }
  
    getSaveFile() {
  
      if (!window.localStorage) {
        return null;
      }
  
      const file = window.localStorage.getItem(this.saveFileKey);
      return file ? JSON.parse(file) : null
    }
    
    load() {
      const file = this.getSaveFile();
      if (file) {
        this.mapId = file.mapId;
        this.startingMainX = file.startingMainX;
        this.startingMainY = file.startingMainY;
        this.startingMainDirection = file.startingMainDirection;
      }
    }
  
  }