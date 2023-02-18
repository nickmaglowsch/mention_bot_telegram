import { CommandsNames } from "./interfaces/commands";
import TelegramBot from "node-telegram-bot-api";
import { baseFactory } from "./mocks/factory.mock";

describe("TelegramFactory", () => {
    it("should build a Create command", () => {
        const factory = baseFactory("mb create group MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.CREATE);
        expect(command.args.name).toEqual("MyGroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build an Add command with default and custom users", () => {
        const entities: TelegramBot.MessageEntity[] = [
            {
                type: "text_mention",
                offset: 0,
                length: 9,
                user: {
                    id: 1,
                    is_bot: false,
                    first_name: "User",
                    username: "user1"
                }
            },
            {
                type: "text_mention",
                offset: 10,
                length: 9,
                user: {
                    id: 2,
                    is_bot: false,
                    first_name: "User",
                    username: "user2"
                }
            }
        ];
        const factory = baseFactory(
            "mb add MyGroup @custom1 @custom2",
            entities
        );
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.ADD);
        expect(command.args.name).toEqual("MyGroup");
        expect(command.args.chatId).toEqual(123456);
        expect(command.args.defaultUsers).toHaveLength(2);
        expect(command.args.customUsers).toHaveLength(2);
    });

    it("should build a Mention command", () => {
        const factory = baseFactory("@MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.MENTION);
        expect(command.args.name).toEqual("MyGroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build a Delete command", () => {
        const factory = baseFactory("mb delete group MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.DELETE);
        expect(command.args.name).toEqual("MyGroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should throw an error for an invalid command", () => {
        const factory = baseFactory("mb invalid command");

        expect(() => {
            factory.build();
        }).toThrowError("INVALID COMMAND");
    });
});
