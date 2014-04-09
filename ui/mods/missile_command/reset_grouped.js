setTimeout(function() {
  engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
    console.log('reset grouped', data)
    data = JSON.parse(data);
    var storage = ko.observable().extend({ session: 'missile_command_registered_'+data.LobbyID })

    if (storage()) {
      var ser = JSON.parse(storage())
      ser.forEach(function(data) {
        data.grouped = false
      })
      storage(JSON.stringify(ser))
    }
  })
}, 0)
