setTimeout(function() {
  model.lobbyId.subscribe(function(lobbyId) {
    sessionStorage['lobbyId'] = encode(lobbyId);

    console.log('reset grouped', lobbyId)
    var storage = ko.observable().extend({ session: 'missile_command_registered_'+lobbyId })

    if (storage()) {
      var ser = JSON.parse(storage())
      ser.forEach(function(data) {
        data.grouped = false
      })
      storage(JSON.stringify(ser))
    }
  })
}, 0)
