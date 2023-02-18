import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";
import { IUser } from "../models/user";


export class Mention implements Commands {
    name = CommandsNames.MENTION;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        this.args = args;
    }

    async exec(): Promise<string> {
        const { name, chatId } = this.args;
        const group = await Group.findOne({ groupId: chatId, name: name });

        if (!group || !group.users || group.users.length === 0) return "group not exists or have no users";

        return group.users.reduce((acc: string, user: IUser) => {
            if (user.id === -1) {
                acc += `${user.first_name} `;
            } else {
                acc += `<a href="tg://user?id=${user.id}">${user.first_name}</a> `;
            }
            return acc;
        }, "");
    }
}
