import TelegramBot from "node-telegram-bot-api";
import {adminCommands, commandsText} from "./interfaces/commands";

export async function isUserAllowedToUseCommand(userId: number | undefined,  bot: TelegramBot, chatId: number, text: string): Promise<boolean> {
    if (!userId) return false;

    if (!adminCommands.some((word) => text.includes(word))) return true;

    const chatMember = await bot.getChatMember(chatId, `${userId}`);

    return chatMember.status === 'creator' || chatMember.status === 'administrator';
}

export function isCommand(text: string) {
    const commands = Object.values(commandsText);
    return commands.some((cmd) => text.includes(cmd))
}