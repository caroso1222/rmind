
import { GluegunCommand } from 'gluegun'
import * as notifier from 'node-notifier';
const crontab = require('crontab')
let chrono = require('chrono-node')

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * rmind do something at 7 pm
 * 
 * rmind do something --force --id 12356
 */

const command: GluegunCommand = {
  name: 'rmind',
  run: async toolbox => {
    const { print, parameters } = toolbox
    const { force } = parameters.options;
    const [parsedDate] = chrono.parse(parameters.string);
    const reminderText = parameters.string.slice(0, parsedDate.index).trim();
    if (!force) {
      crontab.load((_err, crontab) => {
        const id = Math.ceil(Math.random()*10000000);
        print.info(`I will remind you to ${reminderText} ${parsedDate.text}`);
        const job = crontab.create(`PATH=${process.env.PATH}:/Users/carlos/Desktop/hacks/rmind/bin rmind ${parameters.string} --force --id ${id}`, chrono.parseDate(parsedDate.text));
        crontab.save(err => err && print.error(err));
        if (job == null) {
          console.log('failed to create job')
        }
      })
    }
    if (force) {
      const { id } = parameters.options;
      notifier.notify({
        title: 'Remember',
        message: capitalize(reminderText),
        actions: ['20 minutes', '1 hour', '6 hours', 'Tonight at 7:00 PM', 'Tomorrow at 9:00 AM', 'Next week'],
        dropdownLabel: 'Postpone',
        timeout: 10
      },
      (_err, response, metadata) => {
        // console.log(response, metadata);
        const { activationValue } = metadata;
        crontab.load((_err, crontab) => {
          if (activationValue) {
            let newID = Math.ceil(Math.random()*10000000);
            const job = crontab.create(`PATH=${process.env.PATH}:/Users/carlos/Desktop/hacks/rmind/bin rmind ${parameters.string} --force --id ${newID}`, chrono.parseDate(activationValue));
            if (job == null) {
              console.log('failed to create job')
            }

          }
          crontab.remove({command: new RegExp(id, 'ig')});
          crontab.save(err => err && console.log(err))
        });
      });
    }
  },
}

module.exports = command
