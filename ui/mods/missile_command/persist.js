define(['missile_command/missile_view_model'], function(missileViewModel) {
  var serializeLauncher = function(launcher) {
    return {
      id: launcher.id,
      target: launcher.target()
    }
  }

  var deserializeLauncher = function(data) {
    var missile = missileViewModel.clone(data.id)
    missile.target(data.target)
    return missile
  }

  var enableStorage = function(lobbyId, registry) {
    var storage = ko.observable().extend({ local: 'missile_command' })

    if (storage()) {
      var ser = JSON.parse(storage())
      if (ser.lobbyId == lobbyId && ser.registry) {
        ser.registry.forEach(function(data) {
          registry.push(deserializeLauncher(data))
        })
      }
    }

    var storageObject = ko.computed(function() {
      return {
        lobbyId: lobbyId,
        registry: registry().map(serializeLauncher)
      }
    })

    storageObject.subscribe(function(ser) {
      //console.log(ser)
      storage(JSON.stringify(ser))
    })
  }

  return {
    enableStorage: enableStorage
  }
})
