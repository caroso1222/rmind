const { exec } = require("child_process");
const { format, formatDistance, formatRelative, subDays } = require('date-fns');

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

  applescript = ['tell app "Reminders"',
  'set mylist to list "Reminders"',
  'set duedatestr to "7/10/2014 3:00 PM"',
  'tell mylist',
  'set newremin to make new reminder',
  'set name of newremin to "review and do"',
  'set body of newremin to "foo bar baz"',
  'set remind me date of newremin to (date "7/10/2014 3:00 PM")',
  'tell newremin to addRecurrenceRule:()',
  'end tell',
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

// list()

const d = format(new Date(), "dd/mm/yyyy hh:mm b");
console.log(d);