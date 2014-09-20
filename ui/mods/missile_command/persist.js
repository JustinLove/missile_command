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
    var storage = ko.observable().extend({ session: 'missile_command_registered_'+lobbyId })

    //console.log(storage())

    if (storage()) {
      var ser = JSON.parse(storage())
      ser.forEach(function(data) {
        registry.push(deserializeLauncher(data))
      })
    }

    var storageObject = ko.computed(function() {
      return registry().map(serializeLauncher)
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
