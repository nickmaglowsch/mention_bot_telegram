import TelegramBot from "node-telegram-bot-api";
import { TelegramFactory } from "../factory";

export const baseFactory = (
    command: string,
    entities: TelegramBot.MessageEntity[] | undefined = undefined,
    chatId: number = 123456,
    whoSent: string | number = "test-user"
) => new TelegramFactory(command, entities, chatId, whoSent);
