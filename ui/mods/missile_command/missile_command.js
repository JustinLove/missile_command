define([
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'text!missile_command/missile_command.html'
], function(registry, persist, preview, html) {
  "use strict";

  engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
    data = JSON.parse(data);
    persist.enableStorage(data.LobbyID, registry.registry)
  })

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'
  //var nuke_launcher = '/pa/units/land/energy_plant/energy_plant.json'

  var checkCommand = function(command, selected) {
    if (command == 'attack' && selected) {
      registry.unready(selected)
      registry.nextReady()
    }
  }

  model.selection.subscribe(function(payload) {
    if (!payload) {
      registry.showSelected([])
      return
    }

    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        registry.register(si[nuke_launcher][0])
      }
    }

    registry.showSelected(si[nuke_launcher])
  })

  var originalUnitCommand = api.Holodeck.prototype.unitCommand
  api.Holodeck.prototype.unitCommand = function(command, x, y, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalUnitCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  var originalTargetCommand = api.unit.targetCommand
  api.unit.targetCommand = function(command, target, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalTargetCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }


  var settings = alertsManager.makeEmptyFilterSettings();
  settings.selectedTypes[alertsManager.WATCH_TYPES.CREATED] = ['Nuke'];
  settings.selectedTypes[alertsManager.WATCH_TYPES.DESTROYED] = ['Nuke'];

  alertsManager.addFilteredListener(function(payload) {
    console.log(payload);
    payload.list.forEach(function(alert) {
      if (alert.watch_type == alertsManager.WATCH_TYPES.CREATED) {
        registry.created(alert.id, {location: alert.location, planet_id: alert.planet_id})
      } else if (alert.watch_type == alertsManager.WATCH_TYPES.DESTROYED) {
        registry.destroyed(alert.id)
      }
    })
  }, settings);
  //alertsManager.addListener(function(payload) {
    //console.log('all');
    //console.log(payload)
  //})

  var viewModel = {
    visible: ko.computed(function() {
      return registry.registry().length > 0
    }),
    registry: registry.registry,
    open: ko.observable(true),
    toggle: function() { this.open(!this.open()) },
    hidePreview: preview.hide,
    nextReady: registry.nextReady
  }

  return {
    ready: function() {
      createFloatingFrame('missile_command_frame', 210, 40, {'offset': 'leftCenter', 'left': 0});
      var $container = $('#missile_command_frame_content')
      $(html).appendTo($container)
      ko.applyBindings(viewModel, $container[0])
    },
    viewModel: viewModel
  }
})
