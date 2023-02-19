import { CommandArgs } from "../interfaces/commandArgs";
import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import _ from "lodash";

import pino from "pino";

const logger = pino();

export class Remove implements Commands {
    name = CommandsNames.REMOVE;
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

            if (allUsers.length === 0) {
                return "Usuário não encontrado!";
            }

            if (!group) {
                return "Grupo não encontrado!";
            }

            const newUsers = group.users.filter((user) => !allUsers.find(u => _.isEqual(u, user)));

            group.users = [ ...newUsers ];
            logger.info("merge");
            logger.info(group.users);

            await group.save();

            return "Removido!";
        } catch (error) {
            return `${error}`;
        }
    }

}
