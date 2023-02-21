import TelegramBot from "node-telegram-bot-api";
import { CommandsNames, registeredCommands } from "./interfaces/commands";
import { IUser } from "./models/user";

export async function isUserAllowedToUseCommand(userId: number | undefined, bot: TelegramBot, chatId: number, text: string): Promise<boolean> {
    if (!userId) return false;

    const adminCommands = Array.from(registeredCommands.values()).filter(v => v.adminOnly).map(v => v.commandText);
    if (!adminCommands.some((word) => text.includes(word))) return true;

    const chatMember = await bot.getChatMember(chatId, `${userId}`);

    return chatMember.status === "creator" || chatMember.status === "administrator";
}

export function isCommand(text: string) {
    const commands = Array.from(registeredCommands.values()).map(v => v.commandText);
    return commands.some((cmd) => text.includes(cmd));
}

export function adminDescription(cmd: CommandsNames) {
    if (isAdminCommand(cmd)) return " - comando para admin";

    return "";
}

export function isAdminCommand(cmd: CommandsNames) {
    return !!registeredCommands.get(cmd)?.adminOnly;
}

export function getCustomUsersFromAction(action: string): IUser[] {
    // special case for users with custom username (aka @username)
    const regex = /@(\S+)(?=\s)/g;
    // add space in the end just in case
    const mentions = `${action} `.match(regex) || [];

    return mentions.map((m) => {
        return { id: -1, first_name: m } as IUser;
    });
}

export function getDefaultUsersFromAction(entities: TelegramBot.MessageEntity[]): IUser[] {
    return (entities?.map((e) => {
        if (!e.user) return;
        const { id, first_name } = e.user;
        return { id, first_name } as IUser;
    })
        .filter((e) => !!e) as unknown as IUser[]) || [];
}
