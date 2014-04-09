define([], function() {
  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var exactSelection = function(payload, id) {
    if (!payload) {
      return false
    }

    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        // used to check id, but it was easy for rapid hover to miss one
        //return si[nuke_launcher][0] == id
        return true
      }
    }
    return false
  }

  var expectToSee
  var expectWatcher

  var expectationFailed = function() {
    if (!expectToSee) return

    expectToSee.grouped(false)
    expectToSee = null
    clearTimeout(expectWatcher)
    expectWatcher = null
  }

  var expectationMet = function() {
    expectToSee = null
    clearTimeout(expectWatcher)
    expectWatcher = null
  }

  var expect = function(launcher) {
    if (exactSelection(model.selection(), launcher.id)) {
      return
    }

    expectToSee = launcher
    expectWatcher = setTimeout(expectationFailed, 1000)
  }

  var check = function(payload) {
    if (!expectToSee) return

    if (exactSelection(payload, expectToSee.id)) {
      expectationMet()
    } else {
      expectationFailed()
    }
  }

  return {
    expect: expect,
    check: check
  }
})
