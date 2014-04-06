define(['missile_command/missile_view_model'], function(missileViewModel) {
  var registry = ko.observableArray()

  return {
    registry: registry,
    register: function(id) {
      if (!_.find(registry(), function(m) {return m.id == id})) {
        api.select.captureGroup(id)
        registry.push(missileViewModel.clone(id))
      }
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
