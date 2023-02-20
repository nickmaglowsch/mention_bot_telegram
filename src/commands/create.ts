import { commandHandles, Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

export class Create extends Commands {
    name = CommandsNames.CREATE;
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

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commandHandles.set(CommandsNames.CREATE, (args: any) => {
            return {
                command: CommandsNames.CREATE,
                args: {
                    name: args.name.toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });
    }
}
