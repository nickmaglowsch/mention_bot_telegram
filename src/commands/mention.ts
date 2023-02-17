import { Commands, CommandsNames } from "../interfaces/commands";
import Group from "../models/group";


export class Mention implements Commands {
    name = CommandsNames.MENTION;
    args: any;

    constructor(args: any) {
        this.args = args;
    }

    async exec(): Promise<void> {
        const text = this.args.text;
        const bot = this.args.bot;
        const msg = this.args.msg;

        console.log(text)

        const userName = text.split(this.name)[1]?.trim();
        if (!userName) {
            bot.sendMessage(msg.chat.id, `por favor mande um nome para o grupo`, {
                reply_to_message_id: msg.message_id,
            });
        }
        try {
            await Group.create({
                groupId: msg.chat.id,
                name: this.name,
                users: [],
            });
            bot.sendMessage(msg.chat.id, `created!`, {
                reply_to_message_id: msg.message_id,
            });
        } catch (error) {
            bot.sendMessage(msg.chat.id, `${error}`, {
                reply_to_message_id: msg.message_id,
            });
        }

    }
}