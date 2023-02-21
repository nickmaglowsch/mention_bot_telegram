import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

import pino from "pino";
import { getCustomUsersFromAction, getDefaultUsersFromAction } from "../utils";

const logger = pino();


export class Add extends Commands {
    static commandName: CommandsNames = "ADD";
    args: CommandArgs;

    constructor(args: CommandArgs) {
        super();
        this.args = args;
    }

    async exec(): Promise<string> {

        const { name, chatId } = this.args;
        const { defaultUsers, customUsers } = this.args.commandSpecialArgs;

        try {
            const group = await Group.findOne({ groupId: chatId, name });

            const allUsers = [ ...defaultUsers, ...customUsers ];

            if (!group || !allUsers) {
                return "group_not_found_or_users_not_found";
            }

            const mergedArray = group.users.concat(allUsers).map((item) => {
                const matchingItem = group.users.find((x) => x.id === item.id);
                if (matchingItem) {
                    return { ...matchingItem, ...item };
                }
                return item;
            });

            group.users = [ ...mergedArray ];
            logger.info("merge");
            logger.info(group.users);

            await group.save();

            return "added";
        } catch (error) {
            return `${error}`;
        }
    }

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, (args) => {
            const customUsers = getCustomUsersFromAction(args.action);
            const defaultUsers = getDefaultUsersFromAction(args.entities);

            return {
                command: commandName,
                args: {
                    name: args.name.toLowerCase(),
                    commandSpecialArgs: {
                        defaultUsers,
                        customUsers
                    },
                    chatId: args.chatId,
                    whoSent: args.whoSent
                }
            } as ICommand;
        });

        registeredCommands.set(commandName, {
            commandName: commandName,
            commandDescription: "&lt;nome do grupo&gt; &lt;@ das pessoas&gt; - adiciona pessoas num grupo",
            adminOnly: true,
            commandText: "mb add "
        });

    }

    static build(args: CommandArgs): Commands {
        return new Add(args);
    }
}
