module.exports = function(grunt) {
  var target = grunt.option('target') || 'missile_command_test'
  var title = 'Missile Command Test'
  if (target == 'missile_command') {
    title = 'Missile Command'
  }

  var modinfoProcessor = function(target, title) {
    return function(content, srcpath) {
      var info = JSON.parse(content)
      info.date = require('dateformat')(new Date(), 'yyyy/mm/dd')
      info.display_name = title || info.display_name
      if (target) {
        info.id = target
        info.identifier = "pa.wondible." + target
      }
      for (var scene in info.scenes) {
        if (info.scenes[scene][0].match('require.js')) {
          info.scenes[scene].shift()
        }
        info[scene] = info.scenes[scene]
      }
      console.log(info.id, info.version, info.date)
      return JSON.stringify(info, null, 2)
    }
  }

  // Project configuration.
  grunt.initConfig({
    target: target,
    requirejs: {
      target: {
        options: {
          baseUrl: 'ui/mods',
          mainConfigFile: 'ui/mods/missile_command/bootstrap.js',
          skipDirOptimize: true,
          optimize: 'none',
          stubModules: ['text'],

          //name: 'lib/ext/almond',
          name: 'missile_command/main',
          out: '../<%= target %>/ui/mods/missile_command/bootstrap.js',

          skipModuleInsertion: true,
          onBuildWrite: function( name, path, contents ) {
            return require('amdclean').clean({
              code: contents,
              globalObject: true,
              globalObjectName: 'missile_command',
            });
          },
        }
      }
    },
    copy: {
      simple: {
        files: [
          {
            src: [
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/mods/missile_command/*.css'],
            dest: '../<%= target %>/',
          },
        ],
      },
      modinfo: {
        files: [
          {
            src: 'modinfo.dev.json',
            dest: '../<%= target %>/modinfo.json',
          },
        ],
        options: {
          process: function(content, srcpath) {
            var info = JSON.parse(content)
            info.date = require('dateformat')(new Date(), 'yyyy/mm/dd')
            info.display_name = title
            info.id = target
            info.identifier = "pa.wondible." + target
            for (var scene in info.scenes) {
              if (info.scenes[scene][0].match('require.js')) {
                info.scenes[scene].shift()
              }
            }
            console.log(info.id, info.version, info.date)
            return JSON.stringify(info, null, 2)
          }
        }
      },
      dev: {
        files: [
          {
            src: 'modinfo.dev.json',
            dest: 'modinfo.json',
          },
        ],
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['requirejs', 'copy:simple', 'copy:modinfo']);

};
