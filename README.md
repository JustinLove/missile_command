# Missile Command

Provides limited assistance for managing nuke launchers.

## Features

The Missile Command window can be toggled from the option bar.  It will auto open when the first nuke is built, and hide when the game is over.

Nuke launchers will be registered when they are built.  If you have a crash or otherwise miss an event, selecting a launcher will notice it.  (The all button should find unregistered nukes)

The mod has a limited ability to monitor missile state.  Unready is shown as a luancher icon, and ready as the missile.

- Hover over a launcher to show it in the alert PIP.
- Left-click to select a launcher.
- Left box select to select multiple launchers.
- "External site" button jumps to the launcher in the main view.
- "Copy to PIP" button jumps to the launcher in the the PIP.
- Close "x" button adds a "Remove" button to confirm removing a problem launcher from the list.  Click the "x" again to cancel the remove action without confirming.

The "Attack" button will select one launcher and set attack mode. After firing a nuke, it will be marked as unready, and the next launcher will be selected.  Ready launchers are selected first, and then unready launchers, just in case they were ready and you handn't looked.  Allow at least a second between clicks - going too fast may cause a click to register as "clear selection", which will interrupt the process.

The "All" button will select all nuke launchers, presumeably for an area attack.

### Limitations

Technically, all we can see is whether the launcher is building something or not; most of the time "not building" means "missile ready", but obviously stopping the factory will look the same.  Monitoring only works for launchers that are currently visible, so you may need to pass over the hover previews periodically.

The mod has limited state saving on PlayFab games.

### Additional Credits

- Options bar icon: [Fr33Lancer](https://forums.uberent.com/members/fr33lancer.1947523/)
