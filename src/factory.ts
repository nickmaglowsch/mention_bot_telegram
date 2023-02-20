import TelegramBot from "node-telegram-bot-api";
import { commandHandles, Commands, CommandsNames, commandsText } from "./interfaces/commands";
import { Create } from "./commands/create";
import { Add } from "./commands/add";
import { Mention } from "./commands/mention";
import { Delete } from "./commands/delete";
import { Leave } from "./commands/leave";
import { Remove } from "./commands/remove";
import { CommandArgs } from "./interfaces/commandArgs";
import { Help } from "./commands/help";

export class TelegramFactory {
    private command: CommandsNames | undefined;
    private args: CommandArgs = {
        name: "name",
        chatId: -1,
        whoSent: -1,
        commandSpecialArgs: { customUsers: [], defaultUsers: [] }
    };
    private readonly action: string;
    private readonly entities: TelegramBot.MessageEntity[] | undefined;
    private readonly chatId: number;
    private readonly whoSent: string | number;

    constructor(
        action: string,
        entities: TelegramBot.MessageEntity[] | undefined,
        chatId: number,
        whoSent: string | number
    ) {
        this.action = action;
        this.entities = entities;
        this.chatId = chatId;
        this.whoSent = whoSent;
        this.handleAction();
    }

    build(): Commands {
        switch (this.command) {
            case CommandsNames.CREATE:
                return new Create(this.args);
            case CommandsNames.ADD:
                return new Add(this.args);
            case CommandsNames.MENTION:
                return new Mention(this.args);
            case CommandsNames.DELETE:
                return new Delete(this.args);
            case CommandsNames.LEAVE:
                return new Leave(this.args);
            case CommandsNames.REMOVE:
                return new Remove(this.args);
            case CommandsNames.HELP:
                return new Help();
            default:
                throw new Error("INVALID COMMAND");
        }
    }


    private handleAction() {
        for (const [ key, value ] of commandHandles) {
            const commandText = commandsText[key];

            if (this.action.startsWith(commandText)) {
                const args = {
                    action: this.action,
                    name: this.action.split(commandText)[1]?.split(" ")[0]?.trim(),
                    chatId: this.chatId,
                    whoSent: this.whoSent
                };

                const result = value(args);

                this.command = result.command;
                this.args = result.args;

                return;
            }
        }
    }
}
