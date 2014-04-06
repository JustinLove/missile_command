define(['missile_command/missile_view_model'], function(missileViewModel) {
  var registry = ko.observableArray()

  var enableStorage = function(lobbyId) {
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

  engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
    data = JSON.parse(data);
    enableStorage(data.LobbyID)
  })

  return {
    registry: registry,
    register: function(id) {
      var launcher = _.find(registry(), function(m) {return m.id == id})
      if (launcher) {
        launcher.captureGroup()
      } else {
        registry.push(missileViewModel.newSelection(id))
      }
    },
    created: function(id, target) {
      registry.push(missileViewModel.created(id, target))
    },
    destroyed: function(id) {
      registry.remove(function(m) {return m.id == id})
    },
    unready: function(ids) {
      if (!ids || ids.length < 1) return

      _.forEach(registry(), function(m) {
        if (ids.indexOf(m.id) != -1) {
          m.ready(false)
        }
      })
    },
    nextReady: function() {
      var m = _.find(registry(), function(m) {return m.ready()})
      if (m && m.ready()) m.select()
      return m
    },
    showSelected: function(ids) {
      ids = ids || []

      _.forEach(registry(), function(m) {
        m.selected(ids.indexOf(m.id) != -1)
      })
    },
  }
})
