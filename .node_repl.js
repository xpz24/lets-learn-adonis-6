import { basename } from 'node:path'
import repl from 'node:repl'
import { inspect } from 'node:util'
import chalk from 'chalk'

repl.start()

const options = {
  prompt: `\n${chalk.bold.blue(basename(import.meta.dirname))} on ${chalk.bold.magenta(' REPL')} via ${chalk.bold.green(' ' + process.version)} \n${chalk.bold.green('=>❯ ')}`,
  useColors: true,
  preview: true,
  replMode: repl.REPL_MODE_STRICT,
  ignoreUndefined: true,
  writer: (output) => {
    return inspect(output, {
      colors: true,
      sorted: true,
      compact: true,
    })
  },
}

const replServer = repl.start(options)

replServer.setupHistory('.node_repl_history', (err, repl) => {
  if (err) {
    console.error(err)
  }
})

console.log(chalk.bgGreenBright.black.bold('Custom Config Loaded'))
