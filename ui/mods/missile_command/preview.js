define([], function() {
  return {
    showTarget: function(target) {
      if (!target)
        return;

      api.Panel.message(api.Panel.parentId, 'preview.show', {
        target: target,
        placement: {
          holodeck: 'preview',
          panelName: 'missile_command',
          offset: [260,0],
          alignDeck: [0,0],
        }
      });
    },
    showUnit: function(id) {
      api.Panel.message(api.Panel.parentId, 'missile_command_polite_show_unit', id);
    },
    hide: function() {
      api.Panel.message(api.Panel.parentId, 'preview.hide');
    }
  }
})
