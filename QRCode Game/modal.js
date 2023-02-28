import { utils } from "./utils.js";

export default class Modal{
  constructor(element) {
    this.element = element;
    this.display = element.dataset.display ?? 'block';
  }

  show(){
    this.element.style.display = this.display;
    utils.emitEvent("modalChange", {
      isOpen: true
    })
  }

  hide(){
    this.element.style.display = 'none';
    utils.emitEvent("modalChange", {
      isOpen: false
    })
  }
}