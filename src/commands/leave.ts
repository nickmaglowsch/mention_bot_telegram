import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";

export class Leave extends Commands {
    static commandName: CommandsNames = "LEAVE";

    args: CommandArgs;

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name, whoSent } = this.args;

        if (!whoSent) {
            return "Usuário não encontrado!";
        }

        try {
            const updatedInfo = await Group.updateOne(
                {
                    groupId: chatId,
                    name: name,
                    $or: [
                        { "users.first_name": `@${whoSent}` },
                        { "users.id": whoSent }
                    ]
                },
                {
                    $pull: {
                        users: {
                            $or: [
                                { first_name: `@${whoSent}` },
                                { id: whoSent }
                            ]
                        }
                    }
                },
                { new: true }
            );

            if (updatedInfo.modifiedCount > 0) {
                return `Você saiu do grupo ${name}!`;
            } else {
                return `Você não está no grupo ${name} 🤔`;
            }
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
            commandDescription: "&lt;nome do grupo&gt; - serve para você sair de um grupo",
            adminOnly: false,
            commandText: "mb leave "
        });
    }

    static build(args: CommandArgs): Commands {
        return new Leave(args);
    }
}
