import TelegramBot from "node-telegram-bot-api";
import {isUserAllowedToUseCommand, isCommand} from "./utils";

describe("utils", () => {
    describe("isUserAllowedToUseCommand", () => {
        it("should return false if userId is not defined", async () => {
            const bot = new TelegramBot("token", { polling: false });
            const chatId = 12345;
            const text = "some text";
            const result = await isUserAllowedToUseCommand(undefined, bot, chatId, text);
            expect(result).toBe(false);
        });

        it("should return true if adminCommands are not included in the text", async () => {
            const bot = new TelegramBot("token", { polling: false });
            const chatId = 12345;
            const text = "some text";
            const result = await isUserAllowedToUseCommand(123, bot, chatId, text);
            expect(result).toBe(true);
        });

        it("should return true if the user is a creator or administrator", async () => {
            const bot = new TelegramBot("token", { polling: false });
            bot.getChatMember = jest.fn().mockResolvedValue({
                status: "administrator"
            });
            const chatId = 12345;
            const text = "mb add ";
            const result = await isUserAllowedToUseCommand(123, bot, chatId, text);
            expect(result).toBe(true);
            expect(bot.getChatMember).toHaveBeenCalledWith(chatId, "123");
        });

        it("should return false if the user is not a creator or administrator", async () => {
            const bot = new TelegramBot("token", { polling: false });
            bot.getChatMember = jest.fn().mockResolvedValue({
                status: "member"
            });
            const chatId = 12345;
            const text = "mb add ";
            const result = await isUserAllowedToUseCommand(123, bot, chatId, text);
            expect(result).toBe(false);
            expect(bot.getChatMember).toHaveBeenCalledWith(chatId, "123");
        });
    });

    describe("isCommand", () => {
        it("should return true if the text includes a command from commandsText", () => {
            const text = "mb add ";
            const result = isCommand(text);
            expect(result).toBe(true);
        });

        it("should return false if the text does not include any command from commandsText", () => {
            const text = "some text";
            const result = isCommand(text);
            expect(result).toBe(false);
        });
    });
});
