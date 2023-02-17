import {CommandArgs} from "./commandArgs";

export interface Commands {
    name: CommandsNames;
    args: CommandArgs;
    exec: () => Promise<string>;
}

export enum CommandsNames {
    CREATE = 'create',
    ADD = 'add',
    MENTION = 'mention'
}

export const commandsText = {
    MENTION: '@',
    ADD: 'mb add ',
    CREATE: 'mb create group '
}

export const adminCommands = [
    commandsText.ADD,
    commandsText.CREATE,
]
