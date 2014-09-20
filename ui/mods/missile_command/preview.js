define([], function() {
  return {
    show: function(missile) {
      var target = missile.targetZoom('surface')

      if (!target)
        return;

      api.Panel.message(api.Panel.parentId, 'unit_alert.show_preview', target);
    },
    hide: function() {
      api.Panel.message(api.Panel.parentId, 'unit_alert.hide_preview');
    }
  }
})
