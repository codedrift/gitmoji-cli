// @flow
import chalk from 'chalk'
import execa from 'execa'
import configurationVault from '../../../utils/configurationVault'
import isHookCreated from '../../../utils/isHookCreated'
import { Answers } from '../prompts'

const withClient = async (answers: Answers) => {
  try {
    const scope = answers.scope ? `(${answers.scope}): ` : ''
    const title = `'${answers.gitmoji} ${scope}${answers.title}'`
    const isSigned = configurationVault.getSignedCommit() ? ['-S'] : []

    if (await isHookCreated()) {
      return console.log(
        chalk.red(
          "\nError: Seems that you're trying to commit with the cli " +
            'but you have the hook created.\nIf you want to use the `gitmoji -c` ' +
            'command you have to remove the hook with the command `gitmoji -r`. \n' +
            'The hook must be used only when you want to commit with the instruction `git commit`\n'
        )
      )
    }

    const messageArgs = answers.message ? ['-m', `'${answers.message}'`] : []

    const args = ['commit', ...isSigned, '-m', title, ...messageArgs]

    const { stdout } = await execa('git', args, {
      stdio: 'inherit',
      shell: true
    })

    console.log(stdout)
  } catch (error) {
    // console.error(error)
    const { exitCode, command } = error
    console.log('')
    console.log(
      chalk.bold('Commit failed with code'),
      chalk.bold(chalk.red(exitCode))
    )
    console.log(chalk.bold('Command:'), chalk.cyan(command))
  }
}

export default withClient
