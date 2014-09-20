define(function() {
  return function() {
    var $panel = $('<panel id="missile_command"></panel>').css({
      visibility: 'visible',
      position: 'absolute',
      top: 100,
      right: 50,
    }).attr({
      src: "coui://ui/mods/missile_command/missile_command.html",
      'no-keyboard': true,
      'yield-focus': true,
      fit: "dock-top-right",
    })
    $panel.appendTo('body')
    api.Panel.bindPanels()
  }
})
