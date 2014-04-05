define([
  'text!missile_command/missile_command.html'
], function(html) {
  "use strict";

  return {
    ready: function() {
      var container = $(html)
      container.appendTo('body')
      ko.applyBindings(model, container)
    }
  }
})
