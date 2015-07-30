define(function() {
  var insertPanel = function(model) {
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
      'data-bind': 'visible: visible, style: {top: panelYpx, left: panelXpx}'
    })
    $panel.appendTo('body')
    ko.applyBindings(model, $panel[0])
    api.Panel.bindPanels()
  }

  var panelX = ko.observable(0)
  var panelY = ko.observable(100)

  var viewModel = {
    visible: ko.observable(false),
    panelX: panelX,
    panelY: panelY,
    panelXpx: ko.computed(function() {
      return panelX().toString() + 'px'
    }),
    panelYpx: ko.computed(function() {
      return panelY().toString() + 'px'
    }),
  }

  model.gameOverState.subscribe(function(state) {
    if (!state) return
    if (state.defeated || state.game_over) {
      viewModel.visible(false)
    }
  })

  var inserted = false
  var insert = function() {
    insertPanel(viewModel)
    api.panels.options_bar && api.panels.options_bar.message('missile_command_loading', true)
    inserted = true
  }
  viewModel.visible.subscribe(function(visible) {
    if (visible && !inserted) {
      insert()
    }

    if (!visible) {
      model.hideAlertPreview();
    }
  })

  viewModel.visible.subscribe(function(visible) {
    api.panels.options_bar && api.panels.options_bar.message('missile_command_visible', viewModel.visible());
  })

  model.toggleMissileCommand = function() {
    viewModel.visible(!viewModel.visible())
  }

  var lastX
  var lastY
  var animationDone = function() {}

  var startDragging = function(ev) {
    $(document).on('mouseup.missile_command_drag', stopDragging)
    $(document).on('mousemove.missile_command_drag', moveDragging)
    animationDone = api.panels.missile_command.beginAnimation()
  }

  var stopDragging = function() {
    $(document).off('mouseup.missile_command_drag', stopDragging)
    $(document).off('mousemove.missile_command_drag', moveDragging)
    animationDone()
    lastX = null
    lastY = null
  }

  var moveDragging = function(ev) {
    if (lastX == null) {
      lastX = ev.clientX
    }
    if (lastY == null) {
      lastY = ev.clientY
    }
    var dx = ev.clientX - lastX
    var dy = ev.clientY - lastY
    viewModel.panelX(viewModel.panelX() + dx)
    viewModel.panelY(viewModel.panelY() + dy)
    lastX = ev.clientX
    lastY = ev.clientY
  }

  handlers.missile_command_drag = startDragging

  return {
    insert: insert,
    viewModel: viewModel
  }
})
