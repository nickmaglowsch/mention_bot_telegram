import TelegramBot from "node-telegram-bot-api";
import {
    commandHandles,
    CommandRegistry,
    Commands,
    CommandsNames,
    registeredCommands
} from "./interfaces/commands";
import { CommandArgs, RegistryCommandArgs } from "./interfaces/commandArgs";
import commands from "./commands";

export class TelegramFactory {
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
    private command: CommandsNames | undefined;

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
        const _command = commands.find(command => command.commandName === this.command);

        if (!_command) {
            throw new Error("INVALID COMMAND");
        }

        return _command.build(this.args);
    }


    private handleAction() {
        for (const [ key, value ] of commandHandles) {
            const { commandText, actionStringTest } = registeredCommands.get(key) as CommandRegistry;

            if (this.action[actionStringTest](commandText)) {
                const args: RegistryCommandArgs = {
                    action: this.action,
                    name: this.action.split(commandText)[1]?.split(" ")[0]?.trim().toLowerCase(),
                    chatId: this.chatId,
                    whoSent: this.whoSent,
                    entities: this.entities ? this.entities : []
                };

                const result = value(args);

                this.command = result.command;
                this.args = result.args;

                return;
            }
        }
    }
}
