(function() {
  model.toggleMissileCommand = function() {
    api.Panel.message(api.Panel.parentId, 'panel.invoke', ['toggleMissileCommand']);
  };
  model.missileCommandLoading = ko.observable(false)
  model.missileCommandImage = ko.computed(function() {
    if (model.missileCommandLoading()) {
      return 'coui://ui/main/shared/img/loading.gif'
    } else {
      return 'coui://ui/mods/missile_command/options_bar_icon.png'
    }
  })
  model.missileCommandStyle = ko.computed(function() {
    if (model.missileCommandLoading()) {
      return 'padding-left: 6px; padding-right: 6px;'
    } else {
      return ''
    }
  })
  $('.div_ingame_options_bar_cont').prepend(
  '<div class="btn_ingame_options div_toggle_missile_command">' + 
      '<a href="#" data-bind="click: toggleMissileCommand">' + 
          '<img height="16" data-bind="attr: { src: missileCommandImage, style: missileCommandStyle }" />' + 
      '</a>' +
  '</div>')

  handlers.missile_command_loading = model.missileCommandLoading
})()
