(function() {
  model.toggleMissileCommand = function() {
    api.Panel.message(api.Panel.parentId, 'panel.invoke', ['toggleMissileCommand']);
  };
  $('.div_ingame_options_bar_cont').prepend(
  '<div class="btn_ingame_options div_toggle_missile_command">' + 
      '<a href="#" data-bind="click: toggleMissileCommand">' + 
          '<img src="coui://ui/mods/missile_command/options_bar_icon.png" />' + 
      '</a>' +
  '</div>')
})()
