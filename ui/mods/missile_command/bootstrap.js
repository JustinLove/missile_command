require.config({
  baseUrl: "coui://ui/mods",
  paths: {
    text: 'missile_command/text',
  }
})
// make the object keys exist for Panel.ready
var missile_command_stub = function() {}
_.defaults(handlers, {
  selection: missile_command_stub
})
require(['missile_command/main'])
