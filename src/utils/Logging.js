import chalk from 'chalk';

export class Logging{
    static log(args){
        console.log(args);
    }

    static info(args){
        console.log(chalk.blue(`[${new Date().toLocaleString()}][INFO]`, typeof args === 'string'? chalk.blueBright(args): args))
    }

    static warn(args){
        console.log(chalk.yellow(`[${new Date().toLocaleString()}][INFO]`, typeof args === 'string'? chalk.yellowright(args): args))
    }

    static error(args){
        console.log(chalk.red(`[${new Date().toLocaleString()}][INFO]`, typeof args === 'string'? chalk.redBright(args): args))
    }
}