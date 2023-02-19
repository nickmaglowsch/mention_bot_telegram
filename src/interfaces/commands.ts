import { CommandArgs } from "./commandArgs";

export interface Commands {
    name: CommandsNames;
    args: CommandArgs;
    exec: () => Promise<string>;
}

export enum CommandsNames {
    CREATE = "CREATE",
    ADD = "ADD",
    MENTION = "MENTION",
    DELETE = "DELETE",
    LEAVE = "LEAVE",
    REMOVE = "REMOVE",
    HELP = "HELP",
}

export const commandsText = {
    MENTION: "@",
    ADD: "mb add ",
    CREATE: "mb create group ",
    DELETE: "mb delete group ",
    LEAVE: "mb leave ",
    REMOVE: "mb remove ",
    HELP: "mb help"
};

export const adminCommands = [
    commandsText.ADD,
    commandsText.CREATE,
    commandsText.DELETE,
    commandsText.REMOVE
];

export const commandsTextDescription = {
    MENTION: "marca todos do grupo mencionado",
    ADD: "adiciona pessoas no grupo passando pessoas como argumento",
    CREATE: "cria um novo grupo passando o nome como argumento",
    DELETE: "deleta grupo passando o nome como argumento",
    LEAVE: "sai do grupo passando o nome como argumento}",
    REMOVE: "remove pessoa do grupo passando o nome como argumento e a pessoa",
    HELP: "mostra essa lista"
};
