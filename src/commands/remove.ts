import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";
import { commandHandles, Commands, CommandsNames, registeredCommands } from "../interfaces/commands";
import Group from "../models/group";
import _ from "lodash";
import pino from "pino";
import { getCustomUsersFromAction, getDefaultUsersFromAction } from "../utils";

const logger = pino();

export class Remove extends Commands {
    static commandName: CommandsNames = "REMOVE";
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

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, (args: RegistryCommandArgs) => {
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
            commandDescription: "&lt;nome do grupo&gt; &lt;@ da pessoa&gt;  - remove alguém de um grupo",
            adminOnly: true,
            commandText: "mb remove "
        });
    }

    static build(args: CommandArgs): Commands {
        return new Remove(args);
    }

}
