define(['missile_command/missile_view_model'], function(missileViewModel) {
  var registry = ko.observableArray()

  return {
    registry: registry,
    register: function(id) {
      var launcher = _.find(registry(), function(m) {return m.id == id})
      if (!launcher) {
        registry.push(missileViewModel.newSelection(id))
      }
    },
    notice: function(ids) {
      ids.forEach(function(id) {
        if (!_.find(registry(), function(m) {return m.id == id})) {
          registry.push(missileViewModel.clone(id))
        }
      })
    },
    created: function(id, target) {
      // possible to click on building in progress, before it's created event
      var launcher = _.find(registry(), function(m) {return m.id == id})
      if (launcher) {
        launcher.target(target)
      } else {
        registry.push(missileViewModel.created(id, target))
      }
    },
    destroyed: function(id) {
      registry.remove(function(m) {return m.id == id})
    },
    update: function(id, ready, target) {
      var launcher = _.find(registry(), function(m) {return m.id == id})
      if (launcher) {
        launcher.ready(ready)
        launcher.target(target)
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
    ready: function() {
      return _.filter(registry(), function(m) {return m.ready()})
    },
    notReady: function() {
      return _.filter(registry(), function(m) {return !m.ready()})
    },
    attackQueue: function() {
      return this.ready().concat(this.notReady())
    },
    showSelected: function(ids) {
      ids = ids || []

      _.forEach(registry(), function(m) {
        m.selected(ids.indexOf(m.id) != -1)
      })
    },
    ids: function() {
      return registry().map(function(m) {return m.id})
    },
  }
})
