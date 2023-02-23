(function () {
  
  const modal = new Modal(document.querySelector("#question-modal"));
  
  document.getElementById('question-form').addEventListener('submit', (e) => {
    e.preventDefault();
    modal.hide();
  })

  const world = new World({
    element: document.querySelector(".game-container"),
    modal: modal
  });
  world.init();

})();