import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";

import pino from "pino";
const logger = pino();


export class Add implements Commands {
    name = CommandsNames.ADD;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        this.args = args;
    }

    async exec(): Promise<string> {

        const { name, chatId } = this.args;
        const defaultUsers = this.args.defaultUsers ? this.args.defaultUsers : [];
        const customUsers = this.args.customUsers ? this.args.customUsers : [];

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
}
