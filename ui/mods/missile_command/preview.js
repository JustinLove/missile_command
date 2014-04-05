define([], function() {
  return {
    show: function(missile) {
      model.preview.$div.show();
      model.preview.update();

      // Delay fixes issues with intial frame camera setup vs focus problems
      _.delay(function() {
        var focused = api.Holodeck.focused;
        model.preview.focus();
        missile.select()
        if (focused) focused.focus();
      }, 30);
    },
    hide: function() {
      model.preview.$div.hide();
      model.preview.update();
    }
  }
})
