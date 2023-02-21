import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";

export class Delete extends Commands {
    static commandName: CommandsNames = "DELETE";

    args: CommandArgs;

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name } = this.args;
        try {
            await Group.deleteOne({
                groupId: chatId,
                name: name
            });
            return `Grupo ${name} deletado!`;
        } catch (error) {
            return `${error}`;
        }
    }

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, (args: RegistryCommandArgs) => {
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
            commandDescription: "&lt;nome do grupo&gt;  - deleta um grupo",
            adminOnly: true,
            commandText: "mb delete group "
        });
    }

    static build(args: CommandArgs): Commands {
        return new Delete(args);
    }
}
