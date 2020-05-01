tell app "Reminders"
  set mylist to list "Reminders"
  set duedatestr to "7/10/2014 3:00 PM"
  set dateVar to the current date
  set the month of dateVar to 6
  set the day of dateVar to 17
  set the year of dateVar to 2020
  set the hours of dateVar to 14
  set the minutes of dateVar to 20
  tell mylist
    set newremin to make new reminder
    set name of newremin to "review and do"
    set body of newremin to "foo bar baz"
    set remind me date of newremin to dateVar
  end tell
end tell
