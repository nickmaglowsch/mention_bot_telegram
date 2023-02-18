import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";

export class Delete implements Commands {
    name = CommandsNames.DELETE;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name } = this.args;
        try {
            await Group.deleteOne({
                groupId: chatId,
                name: name,
            });
            return `Grupo ${name} deletado!`;
        } catch (error) {
            return `${error}`;
        }
    }
}
