const HotKeys = new (function() {

  this.update = function(delta) {
    if (Input.isPressed(KEY.U)) {
      DEBUG = !DEBUG;
    }
  };

})();
