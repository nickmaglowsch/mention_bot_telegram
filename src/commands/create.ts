import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

export class Create extends Commands {
    static commandName: CommandsNames = "CREATE";

    args: CommandArgs;

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name } = this.args;
        try {
            await Group.create({
                groupId: chatId,
                name: name,
                users: []
            });
            return "created!";
        } catch (error) {
            return `${error}`;
        }
    }

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, (args) => {
            return {
                command: commandName,
                args: {
                    name: args.name.toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });

        registeredCommands.set(commandName, {
            commandName: commandName,
            commandDescription: "&lt;nome do grupo&gt; - cria um novo grupo",
            adminOnly: true,
            commandText: "mb create group ",
            actionStringTest: "startsWith"
        });
    }

    static build(args: CommandArgs): Commands {
        return new Create(args);
    }
}
