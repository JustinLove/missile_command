(function() {
  model.toggleMissileCommand = function() {
    api.Panel.message(api.Panel.parentId, 'panel.invoke', ['toggleMissileCommand']);
  };
  model.missileCommandLoading = ko.observable(false)
  model.missileCommandImage = ko.computed(function() {
    if (model.missileCommandLoading()) {
      return 'coui://ui/mods/missile_command/wide_loading.gif'
    } else {
      return 'coui://ui/mods/missile_command/options_bar_icon.png'
    }
  })
  $('.div_ingame_options_bar_cont').prepend(
  '<div class="btn_ingame_options div_toggle_missile_command">' + 
      '<a href="#" data-bind="click: toggleMissileCommand">' + 
          '<img height="16" data-bind="attr: { src: missileCommandImage }" />' + 
      '</a>' +
  '</div>')

  handlers.missile_command_loading = model.missileCommandLoading
})()
