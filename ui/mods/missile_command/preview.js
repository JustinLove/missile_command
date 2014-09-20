define([], function() {
  return {
    show: function(missile) {
      return
      model.preview.$div.show();
      model.preview.update();

      // Delay fixes issues with intial frame camera setup vs focus problems
      _.delay(function() {
        var focused = api.Holodeck.focused;
        model.preview.focus();
        missile.jump()
        if (focused) focused.focus();
      }, 30);
    },
    hide: function() {
      return
      model.holodeck.focus()
      model.preview.$div.hide();
      model.preview.update();
    }
  }
})
