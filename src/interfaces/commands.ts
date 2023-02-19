import { CommandArgs } from "./commandArgs";

export interface Commands {
    name: CommandsNames;
    args: CommandArgs;
    exec: () => Promise<string>;
}

export enum CommandsNames {
    CREATE = "create",
    ADD = "add",
    MENTION = "mention",
    DELETE = "delete",
    LEAVE = "leave",
    REMOVE = "remove"
}

export const commandsText = {
    MENTION: "@",
    ADD: "mb add ",
    CREATE: "mb create group ",
    DELETE: "mb delete group ",
    LEAVE: "mb leave ",
    REMOVE: "mb remove "
};

export const adminCommands = [
    commandsText.ADD,
    commandsText.CREATE,
    commandsText.DELETE,
    commandsText.REMOVE
];
