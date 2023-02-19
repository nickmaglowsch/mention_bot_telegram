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
    MENTION: "&lt;nome da grupo&gt; - marca todos do grupo mencionado",
    ADD: "&lt;nome do grupo&gt; &lt;@ das pessoas&gt; - adiciona pessoas num grupo",
    CREATE: "&lt;nome do grupo&gt; - cria um novo grupo",
    DELETE: "&lt;nome do grupo&gt;  - deleta um grupo",
    LEAVE: "&lt;nome do grupo&gt; - serve para você sair de um grupo",
    REMOVE: "&lt;nome do grupo&gt; &lt;@ da pessoa&gt;  - remove alguém de um grupo",
    HELP: "mostra essa lista"
};
