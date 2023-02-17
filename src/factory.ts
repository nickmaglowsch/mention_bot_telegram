import TelegramBot from "node-telegram-bot-api";
import { IUser } from "./models/user";

const commands = {
    MENTION: '@',
    ADD: 'mb add ',
    CREATE: 'mb create group '
}
class Factory {
    private command: CommandsNames;
    private args: any;
    private readonly action: string;
    private readonly entities: TelegramBot.MessageEntity[] | undefined;
    private readonly chatId: number;

    constructor(action: string, entities: any, chatId: number) {
        this.action = action;
        this.entities = entities;
        this.chatId = chatId;

        this.handleAction();
    }

    build(): Commands {
        switch (this.command) {
            case CREATE.ADD:
                return new Create(this.args)
            case CommandsNames.ADD:
                return new Add(this.args)
            case CommandsNames.MENTION:
                return new Mention(this.args)
            default:
                throw new Error("INVALID COMMAND");
                break;
        }
    }

    private getCustomUsersFromAction(): IUser[] {
        // special case for users with custom username (aka @username)
        const regex = /@(\S+)(?=\s)/g;
        // add space in the end just in case
        const mentions = `${this.action} `.match(regex) || [];

        return mentions.map(m => {
            return { id: -1, first_name: m } as IUser
        });
    }

    private handleAction() {
        if (this.action.startsWith(commands.CREATE)) {
            this.command = CommandsNames.CREATE;
            this.args = {
                name: this.action.split(commands.CREATE)[1]?.trim(),
                chatId: this.chatId
            };
            return;
        }

        if (this.action.startsWith(commands.ADD)) {
            this.command = CommandsNames.ADD;
            const customUsers = this.getCustomUsersFromAction();
            this.args = {
                name: this.action.split(commands.ADD)[1]?.split(" ")[0].trim(),
                entities: this.entities,
                customUsers,
                chatId: this.chatId
            }
            return;
        }

        if (this.action.includes(commands.MENTION)) {
            this.command = CommandsNames.MENTION;
            this.args = {
                name: this.action.split("@")[1].trim(),
                chatId: this.chatId
            }
            return;
        }
    }

}