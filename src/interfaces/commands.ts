import { CommandArgs, ICommand } from "./commandArgs";

export class Commands {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name: CommandsNames;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args: CommandArgs;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    exec(): Promise<string>;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    static registryCommand(): void
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const commandHandles = new Map<CommandsNames, (args: unknown) => ICommand>();
