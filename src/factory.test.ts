import { commandHandles, CommandsNames } from "./interfaces/commands";
import { baseFactory } from "./mocks/factory.mock";
import { CommandArgs } from "./interfaces/commandArgs";

describe("TelegramFactory", () => {
    it("should build a Create command", () => {
        commandHandles.set(CommandsNames.CREATE, () => {
            return {
                command: CommandsNames.CREATE,
                args: {
                    name: "mygroup",
                    chatId: 123456
                } as CommandArgs
            };
        });
        const factory = baseFactory("mb create group MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.CREATE);
        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build an Add command with default and custom users", () => {
        commandHandles.set(CommandsNames.ADD, () => {
            return {
                command: CommandsNames.ADD,
                args: {
                    name: "mygroup",
                    chatId: 123456,
                    commandSpecialArgs: {
                        customUsers: [
                            { first_name: "@custom1", id: -1 },
                            { first_name: "@custom2", id: -1 }
                        ],
                        defaultUsers: [
                            { first_name: "default1", id: 1 },
                            { first_name: "default2", id: 2 }
                        ]
                    }
                } as CommandArgs
            };
        });
        const factory = baseFactory(
            "mb add MyGroup @custom1 @custom2",
            []
        );
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.ADD);
        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
        expect(command.args.commandSpecialArgs.defaultUsers).toHaveLength(2);
        expect(command.args.commandSpecialArgs.customUsers).toHaveLength(2);
    });

    it("should build a Mention command", () => {
        commandHandles.set(CommandsNames.MENTION, () => {
            return {
                command: CommandsNames.MENTION,
                args: {
                    name: "mygroup",
                    chatId: 123456,
                } as CommandArgs
            };
        });
        const factory = baseFactory("@MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.MENTION);
        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build a Delete command", () => {
        commandHandles.set(CommandsNames.DELETE, () => {
            return {
                command: CommandsNames.DELETE,
                args: {
                    name: "mygroup",
                    chatId: 123456,
                } as CommandArgs
            };
        });
        const factory = baseFactory("mb delete group MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.DELETE);
        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build a Leave command", () => {
        commandHandles.set(CommandsNames.LEAVE, () => {
            return {
                command: CommandsNames.LEAVE,
                args: {
                    name: "mygroup",
                    chatId: 123456,
                } as CommandArgs
            };
        });
        const factory = baseFactory("mb leave MyGroup");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.LEAVE);
        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should build an Remove command with default and custom users", () => {
        commandHandles.set(CommandsNames.REMOVE, () => {
            return {
                command: CommandsNames.REMOVE,
                args: {
                    name: "mygroup",
                    chatId: 123456,
                    commandSpecialArgs: {
                        customUsers: [
                            { first_name: "@custom1", id: -1 },
                            { first_name: "@custom2", id: -1 }
                        ],
                        defaultUsers: [
                            { first_name: "default1", id: 1 },
                            { first_name: "default2", id: 2 }
                        ]
                    }
                } as CommandArgs
            };
        });
        const factory = baseFactory(
            "mb remove MyGroup @custom1 @custom2",
            []
        );
        const cmd = factory.build();

        expect(cmd.name).toEqual(CommandsNames.REMOVE);
        expect(cmd.args.name).toEqual("mygroup");
        expect(cmd.args.chatId).toEqual(123456);
        expect(cmd.args.commandSpecialArgs.defaultUsers).toHaveLength(2);
        expect(cmd.args.commandSpecialArgs.customUsers).toHaveLength(2);
    });

    it("should build a Help command", () => {
        commandHandles.set(CommandsNames.HELP, () => {
            return {
                command: CommandsNames.HELP,
                args: {} as CommandArgs
            };
        });
        const factory = baseFactory("mb help");
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.HELP);
    });

    it("should throw an error for an invalid command", () => {
        const factory = baseFactory("mb invalid command");

        expect(() => {
            factory.build();
        }).toThrowError("INVALID COMMAND");
    });
});
