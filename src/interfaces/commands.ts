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
    MENTION: "<nome da grupo> - marca todos do grupo mencionado",
    ADD: "<nome do grupo> <@ das pessoas> - adiciona pessoas num grupo",
    CREATE: "<nome do grupo> - cria um novo grupo",
    DELETE: "<nome do grupo>  - deleta um grupo",
    LEAVE: "<nome do grupo> - serve para você sair de um grupo",
    REMOVE: "<nome do grupo> <@ da pessoa>  - remove alguém de um grupo",
    HELP: "mostra essa lista"
};
