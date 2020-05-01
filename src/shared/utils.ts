import { createReminder, getLists } from 'node-reminders'
import { prompt, print } from 'gluegun'
import { readConfig, updateConfig, createConfig } from 'node-dotconfig'

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function remind(list: string, text: string, date?: Date) {
  return createReminder(list, {
    name: text,
    ...(date && { remindMeDate: date })
  })
}

export const CONFIG_FILE = '.rmind'
const DEFAULT_ALIAS = 'r'

export async function initConfig() {
  print.warning("It seems like you're new here. Let's get you set up.")
  await setDefaultList()
  print.info('You can change this anytime typing "rmind --config"')
}

export async function setDefaultList() {
  print.info('Where do you want me to save your future reminders by default?')
  const { name, id } = await chooseList()
  const spinner = print.spin('Saving config...')
  let config: any = {}
  try {
    config = await readConfig(CONFIG_FILE)
  } catch (e) {
    config = { lists: {} }
    await createConfig(CONFIG_FILE, config)
  }
  // clean alias
  Object.keys(config.lists).forEach(listID => {
    const list = config.lists[listID]
    const alias = list.alias
    list.alias = alias === DEFAULT_ALIAS ? '' : alias
  })

  const newConfig = {
    defaultList: id,
    lists: { ...config.lists, [id]: { name, alias: DEFAULT_ALIAS } }
  }

  await updateConfig(CONFIG_FILE, newConfig)
  spinner.stop()
  print.success(`🎉 That's it! I'll save all new reminders in list "${name}".`)
}

export async function chooseList() {
  const spinner = print.spin('Fetching lists...')
  const lists = await getLists()
  spinner.stop()
  const choices = lists.map(list => list.name)
  const result = await prompt.ask([
    {
      type: 'select',
      name: 'listName',
      message: 'Please select a list',
      choices
    }
  ])
  const list = lists.find(list => list.name === result.listName)
  return list
}

async function setListAlias() {
  const { name, id } = await chooseList()
  const { alias } = await prompt.ask([
    {
      type: 'input',
      name: 'alias',
      message: `Set an alias for list "${name}" (1 or 2 characters recommended)`
    }
  ])

  let config: any = {}

  try {
    config = await readConfig(CONFIG_FILE)
  } catch (e) {
    config = { lists: {} }
    await createConfig(CONFIG_FILE, config)
  }

  const lists = { ...config.lists, [id]: { name, alias } }

  await updateConfig(CONFIG_FILE, { lists })
  print.success(
    `🎉 All set! Use alias "${alias}" to save reminders in list "${name}". Ex: rmind -l ${alias} buy milk tomorrow`
  )
}

export async function launchConfig() {
  const configOptions = ['Change the default reminders list', 'Add a new list alias']

  const what = await prompt.ask([
    {
      type: 'select',
      name: 'action',
      message: 'What do you want to do?',
      choices: [...configOptions] // TODO: open an issue because slicing this is the only way around
    }
  ])

  switch (what.action) {
    case configOptions[0]:
      return setDefaultList()
    case configOptions[1]:
      return setListAlias()
  }
}
