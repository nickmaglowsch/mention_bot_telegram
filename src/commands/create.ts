import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";
import {CommandArgs} from "../interfaces/commandArgs";

export class Create implements Commands {
    name = CommandsNames.CREATE;
    args: CommandArgs;

    constructor(args: CommandArgs) {
        this.args = args;
    }

    async exec(): Promise<string> {
        const { chatId, name} = this.args
        try {
            await Group.create({
                groupId: chatId,
                name: name,
                users: [],
            });
            return 'created!'
        } catch (error) {
            return `${error}`;
        }
    }
}
