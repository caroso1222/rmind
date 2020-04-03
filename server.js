const notifier = require('node-notifier')
const cron = require('node-cron')
const crontab = require('crontab')
var chrono = require('chrono-node')

function notify(message, duration) {
  // notifier.notify({
  //   title: 'Reminder',
  //   message: message,
  //   sound: false,
  //   wait: true
  // });

  //
  console.log('set schedule')
  crontab.load((err, crontab) => {
    // const job = crontab.create('rmind post to reddit', '* * * * *')
    const job = crontab.create(
      `PATH=${process.env.PATH}:/Users/carlos/Desktop/hacks/rmind/bin rmind coolio! --force`,
      chrono.parseDate('in 1 minute'),
      '123456'
    )
    crontab.save((err, crontab) => {
      console.log(err, crontab)
    })
    console.log(job)
    if (job == null) {
      console.log('failed to create job')
    }
  })
  // cron.schedule('* * * * *', () => {
  //   notifier.notify({
  //     title: 'Reminder',
  //     message: message,
  //     sound: false,
  //     wait: true
  //   });
  // });
}

// notify('test notif', 1);

const id = 18150
// crontab.load((err, crontab) => {
//   // crontab.remove({comment:/123456/g});
//   crontab.remove({comment: new RegExp(id, 'ig')});
//   crontab.save((err, crontab) => {
//     console.log(err, crontab)
//   })
// });

const cparse = chrono.parseDate('20 minutes')
// const [_cparse] = chrono.parse('send email at 6:15pm');
// console.log(_cparse.ref)
// console.log(_cparse);
console.log(cparse)

// console.log(Math.ceil(Math.random()*10000000));

// console.log(process.env);
