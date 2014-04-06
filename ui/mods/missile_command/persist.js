define(['missile_command/missile_view_model'], function(missileViewModel) {
  var enableStorage = function(lobbyId, registry) {
    var storage = ko.observable().extend({ session: 'missile_command_registered_'+lobbyId })

    if (storage()) {
      var ids = JSON.parse(storage())
      ids.forEach(function(id) {
        registry.push(missileViewModel.loaded(id))
      })
    }

    registry.subscribe(function(launchers) {
      var ids = []
      launchers.forEach(function(m) {
        ids.push(m.id)
      })

      storage(JSON.stringify(ids))
    })
  }

  return {
    enableStorage: enableStorage
  }
})
