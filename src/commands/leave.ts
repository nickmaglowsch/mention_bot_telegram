import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";
import { assertLabeledStatement } from "@babel/types";

export class Leave implements Commands {
    name = CommandsNames.LEAVE;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name, whoSent } = this.args;
        const orCondition = {
            $or: [
                { "users.first_name": `@${whoSent}` },
                { "users.id": whoSent }
            ]
        };

        if (!whoSent) {
            return "Usuário não encontrado!";
        }

        try {
            const updatedInfo = await Group.updateOne(
                {
                    groupId: chatId,
                    name: name,
                    ...orCondition
                },
                { $pull: { users: { ...orCondition } } },
                { new: true }
            );

            if (updatedInfo.modifiedCount > 0) {
                return `Você saiu do grupo *${name}*!`;
            } else {
                return `Você não está no grupo *${name}* 🤔`;
            }
        } catch (error) {
            return `${error}`;
        }
    }
}
