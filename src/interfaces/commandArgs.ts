import { IUser } from "../models/user";
import { CommandsNames } from "./commands";

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


