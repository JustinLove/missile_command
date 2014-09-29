# Missile Command

Provides limited assistance for managing nuke launchers.

## Features

The Missile Command window can be toggled from the option bar.  It will auto open when the first nuke is built, and hide when the game is over.

Nuke launchers will be registered when they are built.  If you have a crash or otherwise miss an event, selecting a launcher will notice it.  (The all button should find unregistered nukes)

- Hover over a launcher to show it in the alert PIP.
- Check the box if it's ready to fire.  Sorry, the code can't tell you; use the hover to quickly check and update all you launchers.
- "external site" button jumps to the launcher in the main view.
- Close "x" button adds a "Remove" button to confirm removing a problem launcher from the list.  Click the "x" again to cancel the remove action without confirming.

The "Attack" button will select one launcher and set attack mode. After firing a nuke, it will be marked as unready, and the next launcher will be selected.  Ready launchers are selected first, and then unready launchers, just in case they were ready and you handn't looked.

The "All" button will select all nuke launchers, presumeably for an area attack.

### Limitations

Pretty much everything related to nuke launcher status is invisible to the UI, so a lot is manual.

The mod has limited state saving.  Launchers will be remembered over refresh and changing scenes, such as settings.
