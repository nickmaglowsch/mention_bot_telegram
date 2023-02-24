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
        const { chatId } = this.args;

        const groups = await Group.find(
            {
                groupId: chatId,
                name:
                    {
                        $in: this.createQuery()
                    }
            }
        );

        if (groups.length === 0) return "";

        if (groups.every(group => group.users.length === 0))
            return "Grupo não possui membros ainda";

        const userLists = groups.map(group => {
            return group.users.reduce((acc: string, user: IUser) => {
                if (user.id === -1) {
                    acc += `${user.first_name} `;
                } else {
                    acc += `<a href="tg://user?id=${user.id}">${user.first_name}</a> `;
                }
                return acc;
            }, "");
        });
        return userLists.join("");
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

    private createQuery(): string[] {
        const { name } = this.args;

        return name.split(" ")
            .map((nameStr) => nameStr);
    }
}
