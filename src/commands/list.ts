import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import Group, { IGroup } from "../models/group";
import pino from "pino";

const logger = pino();

export class List extends Commands {
    args: CommandArgs;
    static commandName: CommandsNames = "LIST";

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId } = this.args;

        try {
            const groups = await Group.find({ groupId: chatId }) as IGroup[];

            return groups.reduce((acc, curr) => {
                acc += `<code>@${curr.name}</code> - ${curr.users.length} pessoas\n\n`;
                return acc;
            }, "");

        } catch (e) {
            logger.error(e);
            return "";
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
            commandDescription: " - lista todos os grupos no servidor",
            adminOnly: false,
            commandText: "mb list",
            actionStringTest: "startsWith"
        });
    }

    static build(args: CommandArgs): Commands {
        return new List(args);
    }
}