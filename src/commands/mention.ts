import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";
import { IUser } from "../models/user";

export class Mention extends Commands {
    static commandName: CommandsNames = "MENTION";
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

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, (args: RegistryCommandArgs) => {
            return {
                command: commandName,
                args: {
                    name: args.name,
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });

        registeredCommands.set(commandName, {
            commandName: commandName,
            commandDescription: "&lt;nome da grupo&gt; - marca todos do grupo mencionado",
            adminOnly: false,
            commandText: "@",
            actionStringTest: "includes"
        });
    }

    static build(args: CommandArgs): Commands {
        return new Mention(args);
    }
}
