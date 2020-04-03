tell app "Reminders"
  set notCompleted to reminders in list "Reminders" whose completed is false
  repeat with currentReminder in notCompleted
    log (get name of currentReminder)
  end repeat
end tell
