import TelegramBot from "node-telegram-bot-api";
import {
    isUserAllowedToUseCommand,
    isCommand,
    isAdminCommand,
    adminDescription,
    getDefaultUsersFromAction, getCustomUsersFromAction
} from "./utils";
import { registeredCommands } from "./interfaces/commands";

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
            registeredCommands.clear();
            registeredCommands.set("ADD", {
                adminOnly: true,
                commandText: "mb add ",
                commandDescription: "",
                commandName: "ADD"
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
            registeredCommands.clear();
            registeredCommands.set("ADD", {
                adminOnly: true,
                commandText: "mb add ",
                commandDescription: "",
                commandName: "ADD"
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
            registeredCommands.clear();
            registeredCommands.set("ADD", {
                adminOnly: false,
                commandText: "mb add ",
                commandDescription: "",
                commandName: "ADD"
            });
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

    describe("isAdminCommand", () => {
        beforeEach(() => {
            registeredCommands.clear();
            registeredCommands.set("DELETE", {
                commandName: "DELETE",
                commandText: "text",
                adminOnly: true,
                commandDescription: "desc"
            });
            registeredCommands.set("MENTION", {
                commandName: "MENTION",
                commandText: "text",
                adminOnly: false,
                commandDescription: "desc"
            });
        });

        it("should return true if a admin command is passed", function () {
            expect(isAdminCommand("DELETE")).toBeTruthy();
        });

        it("should return false if a not admin command is passed", function () {
            expect(isAdminCommand("MENTION")).toBeFalsy();
        });
    });

    describe("adminDescription", () => {
        beforeEach(() => {
            registeredCommands.clear();
            registeredCommands.set("DELETE", {
                commandName: "DELETE",
                commandText: "text",
                adminOnly: true,
                commandDescription: "desc"
            });
            registeredCommands.set("MENTION", {
                commandName: "MENTION",
                commandText: "text",
                adminOnly: false,
                commandDescription: "desc"
            });
        });
        it("should return \" - comando para admin\" if a admin command is passed", function () {
            expect(adminDescription("DELETE")).toBe(" - comando para admin");
        });

        it("should return empty string if a not admin command is passed", function () {
            expect(adminDescription("MENTION")).toBe("");
        });
    });

    describe("getCustomUsersFromAction", () => {
        it("should return an array with users containing custom usernames", () => {
            const action = "Hello @user1 @user2";
            const users = getCustomUsersFromAction(action);

            expect(users).toEqual([
                { id: -1, first_name: "@user1" },
                { id: -1, first_name: "@user2" },
            ]);
        });

        it("should return an empty array when there are no custom usernames in the action", () => {
            const action = "Hello world!";
            const users = getCustomUsersFromAction(action);

            expect(users).toEqual([]);
        });
    });

    describe("getDefaultUsersFromAction", () => {
        it("should return an array with users from the message entities", () => {
            const entities = [
                { type: "mention", offset: 6, length: 6, user: { id: 123, first_name: "John" } },
                { type: "mention", offset: 13, length: 7, user: { id: 456, first_name: "Alice" } },
            ] as TelegramBot.MessageEntity[];
            const users = getDefaultUsersFromAction(entities);

            expect(users).toEqual([
                { id: 123, first_name: "John" },
                { id: 456, first_name: "Alice" },
            ]);
        });

        it("should return an empty array when there are no users in the message entities", () => {
            const entities = [] as TelegramBot.MessageEntity[];
            const users = getDefaultUsersFromAction(entities);

            expect(users).toEqual([]);
        });
    });
});
