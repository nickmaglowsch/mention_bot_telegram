import { commandHandles, Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import { IUser } from "../models/user";

export class Mention extends Commands {
    name = CommandsNames.MENTION;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {
        const { name, chatId } = this.args;
        const group = await Group.findOne({ groupId: chatId, name: name });

        if (!group) return "";

        if (!group.users || group.users.length === 0)
            return "Grupo não possui membros ainda";

        return group.users.reduce((acc: string, user: IUser) => {
            if (user.id === -1) {
                acc += `${user.first_name} `;
            } else {
                acc += `<a href="tg://user?id=${user.id}">${user.first_name}</a> `;
            }
            return acc;
        }, "");
    }

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commandHandles.set(CommandsNames.MENTION, (args: any) => {
            return {
                command: CommandsNames.MENTION,
                args: {
                    name: args.action.split("@")[1].trim().toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });
    }
}
