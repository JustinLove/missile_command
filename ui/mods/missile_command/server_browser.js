model.currentSelectedGame.subscribe(function(v) {
  sessionStorage['lobbyId'] = encode(v.host_id);
});
