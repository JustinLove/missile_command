# Missile Command

Provides limited assistance for managing nuke launchers.

## Features

Missile Command window implements Floating Framework, and can be repositioned.  It toggles in a similar manner to player/system windows.  (These features may have unwanted interactions.)

When you select one (and only one) nuke launcher, it will be registered into the interface.

- Hover over a launcher to show it in the alert PIP.
- Check the box if it's ready to fire.  Sorry, the code can't tell you; use the hover to quickly check and update all you launchers.
- Attack icon selects that launcher to fire.
- "external site" button jumps to the launcher in the main view.
- Close "x" button adds a "Remove" button to confirm removing a problem launcher from the list.  Click the.  Click the "x" again to cancel the remove action without confirming.

The "Attack" button will select the one launcher and set attack mode.

After firing a nuke, it will be marked as unready, and the next launcher will be selected.  Ready launchers are selected first, and then unready launchers, just in case they were ready and you handn't looked.

A launcher without an attack icon was discovered by a create alert. There isn't an API to create a group from an alert, so you need to use the jump button find it and click on it.

### Limitations

Pretty much everything related to nuke launcher status is invisible to the UI, so a lot is manual.

The mod has limited state state saving.  Launchers will be remembered over refresh and changing scenes, such as settings.  All launchers will be forgotten when the game exits for any reason.

## Development

The project is set up to use combine files using [RequireJS](http://requirejs.org/) and [amdclean](https://github.com/gfranko/amdclean), with build automation through [Grunt](http://gruntjs.com/), which combines the JS, inlines HTML, copies files, and edits `modinfo.json` to fix up paths and names.

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

The repository expects to be in a mod folder named `missile_command_dev`.  The default grunt task builds to `missile_command_test`.  The 'production' build is through:

    grunt --target=missile_command

The main mod file is `modinfo.dev.json` because PAMM rewrites `modinfo.json` when updating it.  `grunt copy:dev` is a convience task to update the live file from the formatted one.

During development, RequireJS is loading files on demand, but the browser cache often doesn't keep up with recent changes.  With the debugger attached, use the "disable cache" setting (see gear icon in bottom right).
