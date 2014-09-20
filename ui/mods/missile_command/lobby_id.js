define(function() {
  var lobbyId = ko.observable().extend({ session: 'lobbyId' });

  if (!lobbyId()) {
    // timing may not work if we go back to combined files
    engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
      data = JSON.parse(data);
      console.log(data)
      lobbyId(data.LobbyID)
    })
  }

  return lobbyId
})
