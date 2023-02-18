import { IUser } from "../models/user";

export interface CommandArgs {
    name: string;
    chatId: number;
    defaultUsers?: IUser[];
    customUsers?: IUser[];
    whoSent?: string | number;
}
