import { IUser } from "../models/user";
import { CommandsNames } from "./commands";
import TelegramBot from "node-telegram-bot-api";

export interface CommandArgs {
    name: string;
    chatId: number;
    whoSent: string | number;
    commandSpecialArgs: UserMutation
}

export interface UserMutation {
    defaultUsers: IUser[];
    customUsers: IUser[];
}

export interface ICommand {
    command: CommandsNames;
    args: CommandArgs;
}

export interface RegistryCommandArgs {
    action: string;
    name: string;
    chatId: number;
    whoSent: string | number;
    entities: TelegramBot.MessageEntity[];
}


