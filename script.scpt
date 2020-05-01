tell app "Reminders"
  set notCompleted to reminders in list "Reminders" whose completed is false
  repeat with currentReminder in notCompleted
    log (get name of currentReminder)
    log (get remind me date of currentReminder)
    log (get due date of currentReminder)
    log "------"
  end repeat
end tell
