import { commandHandles, Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

export class Leave extends Commands {
    name = CommandsNames.LEAVE;
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

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commandHandles.set(CommandsNames.LEAVE, (args: any) => {
            return {
                command: CommandsNames.LEAVE,
                args: {
                    name: args.name.toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });
    }
}
