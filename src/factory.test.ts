import { commandHandles, registeredCommands } from "./interfaces/commands";
import { baseFactory } from "./mocks/factory.mock";
import { CommandArgs, RegistryCommandArgs } from "./interfaces/commandArgs";

describe("TelegramFactory", () => {
    it("should build a command", () => {
        commandHandles.set("CREATE", (args: RegistryCommandArgs) => {
            return {
                command: "CREATE",
                args: {
                    name: args.name.toLowerCase(),
                    chatId: args.chatId,
                    whoSent: args.whoSent
                } as CommandArgs
            };
        });
        registeredCommands.set("CREATE", {
            commandName: "CREATE",
            commandDescription: "",
            adminOnly: true,
            commandText: "mb create group "
        });
        const factory = baseFactory("mb create group MyGroup");
        const command = factory.build();

        expect(command.args.name).toEqual("mygroup");
        expect(command.args.chatId).toEqual(123456);
    });

    it("should throw an error for an invalid command", () => {
        const factory = baseFactory("mb invalid command");

        expect(() => {
            factory.build();
        }).toThrowError("INVALID COMMAND");
    });
});
