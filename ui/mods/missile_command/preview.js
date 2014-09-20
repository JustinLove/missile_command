define([], function() {
  return {
    showTarget: function(target) {
      if (!target)
        return;

      api.Panel.message(api.Panel.parentId, 'unit_alert.show_preview', target);
    },
    showUnit: function(id) {
      api.Panel.message(api.Panel.parentId, 'missile_command_polite_show_unit', id);
    },
    hide: function() {
      api.Panel.message(api.Panel.parentId, 'unit_alert.hide_preview');
    }
  }
})
