## 0.4.0

- Ready launchers are selected first, but then unready launchers are queued up.
- Bugfix: selecting attack wouldn't set attack command mode first time (no selection)

## 0.3.0

- bugfix: Showing jump icon on created events.
- Prefer location over jump to group so hover works with a selection.
- Additional checking for valid groups; attempts to clear grouped flag when the game clears it's internal group state.

## 0.2.0

- More conservative with hover pips to avoid loosing user selection.
- The mod should remember launcher state.  Launchers will be remembered over refresh and changing scenes, such as settings.
- Window is invisible until a nuke launcher is registered.
- Tracks created and destroyed events.  Added dependecy on Alerts Manager.
