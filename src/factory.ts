import TelegramBot from "node-telegram-bot-api";
import { IUser } from "./models/user";
import { Commands, CommandsNames, commandsText } from "./interfaces/commands";
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
    private args: CommandArgs = { name: "name", chatId: -1 };
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

    private getCustomUsersFromAction(): IUser[] {
        // special case for users with custom username (aka @username)
        const regex = /@(\S+)(?=\s)/g;
        // add space in the end just in case
        const mentions = `${this.action} `.match(regex) || [];

        return mentions.map((m) => {
            return { id: -1, first_name: m } as IUser;
        });
    }

    private getDefaultUsersFromAction(): IUser[] {
        return (
            (this.entities
                ?.map((e) => {
                    if (!e.user) return;
                    const { id, first_name } = e.user;
                    return { id, first_name } as IUser;
                })
                .filter((e) => !!e) as unknown as IUser[]) || []
        );
    }

    private handleAction() {
        if (this.action.startsWith(commandsText[CommandsNames.CREATE])) {
            this.command = CommandsNames.CREATE;
            this.args = {
                name: this.action.split(commandsText[CommandsNames.CREATE])[1]?.trim().toLowerCase(),
                chatId: this.chatId
            };
            return;
        }

        if (this.action.startsWith(commandsText[CommandsNames.ADD])) {
            this.command = CommandsNames.ADD;
            const customUsers = this.getCustomUsersFromAction();
            const defaultUsers = this.getDefaultUsersFromAction();

            this.args = {
                name: this.action
                    .split(commandsText[CommandsNames.ADD])[1]
                    ?.split(" ")[0]
                    .trim().toLowerCase(),
                defaultUsers,
                customUsers,
                chatId: this.chatId
            };
            return;
        }

        if (this.action.startsWith(commandsText[CommandsNames.REMOVE])) {
            this.command = CommandsNames.REMOVE;
            const customUsers = this.getCustomUsersFromAction();
            const defaultUsers = this.getDefaultUsersFromAction();

            this.args = {
                name: this.action
                    .split(commandsText[CommandsNames.REMOVE])[1]
                    ?.split(" ")[0]
                    .trim().toLowerCase(),
                defaultUsers,
                customUsers,
                chatId: this.chatId
            };
            return;
        }

        if (this.action.includes(commandsText[CommandsNames.MENTION])) {
            this.command = CommandsNames.MENTION;
            this.args = {
                name: this.action.split("@")[1].trim().toLowerCase(),
                chatId: this.chatId
            };
            return;
        }

        if (this.action.startsWith(commandsText[CommandsNames.DELETE])) {
            this.command = CommandsNames.DELETE;
            this.args = {
                name: this.action.split(commandsText[CommandsNames.DELETE])[1]?.trim().toLowerCase(),
                chatId: this.chatId
            };
            return;
        }

        if (this.action.startsWith(commandsText[CommandsNames.LEAVE])) {
            this.command = CommandsNames.LEAVE;
            this.args = {
                name: this.action.split(commandsText[CommandsNames.LEAVE])[1]?.trim().toLowerCase(),
                chatId: this.chatId,
                whoSent: this.whoSent
            };
            return;
        }

        if (this.action.startsWith(commandsText[CommandsNames.HELP])) {
            this.command = CommandsNames.HELP;
            return;
        }
    }
}
