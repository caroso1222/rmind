import { GluegunCommand } from 'gluegun'
let chrono = require('chrono-node')
import { readConfig } from 'node-dotconfig'
import { remind, capitalize, CONFIG_FILE, initConfig, launchConfig } from '../shared/utils'
import { format, formatRelative } from 'date-fns'

const command: GluegunCommand = {
  name: 'rmind',
  run: async toolbox => {
    const { print, parameters } = toolbox

    let { options } = parameters
    if (options.config) {
      return launchConfig()
    }

    let spinner = print.spin('Reading config...')
    let configuration

    try {
      configuration = await readConfig(CONFIG_FILE)
      spinner.stop()
    } catch (err) {
      spinner.stop()
      await initConfig()
      configuration = await readConfig(CONFIG_FILE)
    }

    try {
      let listID = configuration.defaultList
      const lists = configuration.lists
      let listName = configuration.lists[listID].name

      if (options.l) {
        for (const list in lists) {
          if (lists[list].alias === options.l) {
            listName = lists[list].name
            listID = list
          }
        }
      }

      spinner = print.spin(`Creating reminder in list "${listName}"...`)
      const [parsedDate] = chrono.parse(parameters.string)

      let reminderText = parameters.string
      let date: Date
      if (parsedDate) {
        reminderText = parameters.string.slice(0, parsedDate.index).trim()
        date = chrono.parseDate(parsedDate.text)
      }
      await remind(listID, capitalize(reminderText), date)
      spinner.stop()
      if (parsedDate) {
        const relativeDateFormat = formatRelative(date, new Date())
        const normalDateFormat = format(date, `EEEE MMM do 'at' hh':'mm aaa`)

        // Relative format is fine until it starts showing future dates as 01/01/2020.
        // We'll use the normal format when that happens.
        const useNormalFormat = /^\d{2}\/\d{2}\/\d{4}$/.test(relativeDateFormat)
        print.info(
          `${print.checkmark} I'll remind you to "${reminderText}" (${
            useNormalFormat ? normalDateFormat : capitalize(relativeDateFormat)
          })`
        )
      } else {
        print.info(`${print.checkmark} Reminder "${reminderText}" added to list "${listName}"`)
      }
    } catch (err) {
      spinner.stop()
      print.error(err)
    }
  }
}

module.exports = command
