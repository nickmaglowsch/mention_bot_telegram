import { commandHandles, Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";

import pino from "pino";
import { getCustomUsersFromAction, getDefaultUsersFromAction } from "../utils";

const logger = pino();


export class Add extends Commands {
    name = CommandsNames.ADD;
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

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        commandHandles.set(CommandsNames.ADD, (args: any) => {
            const customUsers = getCustomUsersFromAction(args.action);
            const defaultUsers = getDefaultUsersFromAction(args.entities);

            return {
                command: CommandsNames.ADD,
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
    }
}
