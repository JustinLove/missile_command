define(function() {
  return function(model) {
    var $panel = $('<panel id="missile_command"></panel>').css({
      visibility: 'hidden',
      position: 'absolute',
      top: 100,
      bottom: 100,
      left: 0,
    }).attr({
      src: "coui://ui/mods/missile_command/missile_command.html",
      'no-keyboard': true,
      'yield-focus': true,
      fit: "dock-top-left",
      'data-bind': 'visible: visible'
    })
    $panel.appendTo('body')
    ko.applyBindings(model, $panel[0])
    api.Panel.bindPanels()
  }
})
