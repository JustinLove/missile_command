define(['missile_command/missile_view_model'], function(missileViewModel) {
  var serializeLauncher = function(launcher) {
    return {
      id: launcher.id,
      grouped: launcher.grouped(),
      target: launcher.target
    }
  }

  var deserializeLauncher = function(data) {
    var missile = missileViewModel.clone(data.id)
    missile.grouped(data.grouped)
    missile.target = data.target
    return missile
  }

  var enableStorage = function(lobbyId, registry) {
    var storage = ko.observable().extend({ session: 'missile_command_registered_'+lobbyId })

    if (storage()) {
      var ser = JSON.parse(storage())
      ser.forEach(function(data) {
        registry.push(deserializeLauncher(data))
      })
    }

    registry.subscribe(function(launchers) {
      var ser = []
      launchers.forEach(function(m) {
        ser.push(serializeLauncher(m))
      })

      storage(JSON.stringify(ser))
    })
  }

  return {
    enableStorage: enableStorage
  }
})
