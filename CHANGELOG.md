## 3.0.5

- Fix typo

## 3.0.4

- Fix registration of first launcher built when window is closed
- Update preview pip api

## 3.0.3

- Small deoptimization to support non-promises from Cover the Line

## 3.0.2

- Launchers under construction should not be shown as ready
- Update mod icon to reflect current interface

## 3.0.1

- Fix icon paths circa titans

## 3.0.0

New APIs circa 84871

- Can sometimes automatically report missile ready.
- Can discover launcher location if it missed the creation event.
- Can notice unknown launchers on screen, once panel has been activated.
- Remove state saving, we are no longer dependent on create alterts for discovery and position

## 2.1.1

- Game changed required header links circa 82293

## 2.1.0

- Window is draggable
- Visual update with icons (launcher: unready, missile: ready)
- Right click to toggle ready
- Box select launchers

## 2.0.2

- Add option bar button hover effect

## 2.0.1

- Error in command hook blocked spectator ping

## 2.0.0

Version 2 essentially restores the original feature-set, rebuilt on top of panels and select.byIds

- If unpacked RequireJS is good enough for Galactic War, it's good enough for me.
- Remove Grunt
- Remove depreciated modinfo fields
- Convert to panel (supports mod loading in "missile_command")
- Replace group tracking with select.byIds
- Remove disconnect hook
- Data stored in localStorage since panel session is transient
- Disable Require.js timeout due to longer game load times when using render process limit.
- Replace header toggle with option bar icon (Thanks to Fr33Lancer for the icon)
- Loading indicator for panel
- Add button to select all launchers (for area attack)
- Set unready state for area attack
- Handle Galactic War spec_tag
- Add icon to show launcher in pip

## 1.0.0

- Clear groups on disconnect api (Reconnect Button mod compatibitilty)
- Add icon
- Release to PAMM

## 0.4.0

- Ready launchers are selected first, but then unready launchers are queued up.
- Abililty to remove problem launchers from the list.
- Layout changes; vestigial attack buttons removed.
- Hide during game-over/review.
- Bugfix: selecting attack wouldn't set attack command mode first time (no selection)
- Bugfix: losing keyboard commands after using hover-pips.
- Bugfix: tracks current game id differently, since UberNet doesn't always know which game you are in.

## 0.3.0

- bugfix: Showing jump icon on created events.
- Prefer location over jump to group so hover works with a selection.
- Additional checking for valid groups; attempts to clear grouped flag when the game clears it's internal group state.

## 0.2.0

- More conservative with hover pips to avoid loosing user selection.
- The mod should remember launcher state.  Launchers will be remembered over refresh and changing scenes, such as settings.
- Window is invisible until a nuke launcher is registered.
- Tracks created and destroyed events.  Added dependecy on Alerts Manager.
