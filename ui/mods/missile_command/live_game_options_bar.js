(function() {
  model.toggleMissileCommand = function() {
    api.Panel.message(api.Panel.parentId, 'panel.invoke', ['toggleMissileCommand']);
  };
  model.missileCommandImage = ko.observable('img/ingame_options_bar/pip_on.png')
  $('.div_ingame_options_bar_cont').prepend(
  '<div class="btn_ingame_options div_toggle_missile_command">' + 
      '<a href="#" data-bind="click: toggleMissileCommand">' + 
          '<img data-bind="attr: { src: missileCommandImage }" />' + 
      '</a>' +
  '</div>')
})()
