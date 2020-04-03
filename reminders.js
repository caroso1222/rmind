const { exec } = require("child_process");


function list() {
  let applescript = [
    'tell app "Reminders"',
    'set notCompleted to reminders in list "Reminders" whose completed is false',
    'repeat with currentReminder in notCompleted',
    'log (get name of currentReminder)',
    'end repeat',
    'end tell',
  ];

  applescript = [
    'tell app "Reminders"',
    'show list "Reminders"',
    'end tell',
  ];

  applescript = ['tell app "Reminders"',
  'set notCompleted to reminders in list "Reminders" whose completed is false',
  'repeat with currentReminder in notCompleted',
  'log (get name of currentReminder)',
  'end repeat',
  'end tell'];

  var scriptString = '';
  for (var i in applescript) {
    scriptString += "-e '" + applescript[i] + "' ";
  }

  console.log(scriptString);

  exec('osascript ' + scriptString, function(error, stdout, stderr) {
    console.log('-----');
    console.log(error)
    console.log(stdout)
    console.log(stderr)
  })
}

list()