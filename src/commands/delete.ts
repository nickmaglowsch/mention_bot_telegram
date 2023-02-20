import { commandHandles, Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

export class Delete extends Commands {
    name = CommandsNames.DELETE;
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

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commandHandles.set(CommandsNames.DELETE, (args: any) => {
            return {
                command: CommandsNames.DELETE,
                args: {
                    name: args.name.toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });
    }
}
