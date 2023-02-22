import { Delete } from "./delete";
import Group from "../models/group";
import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";
import { commandHandles, registeredCommands } from "../interfaces/commands";

describe("Delete", () => {
    const args: CommandArgs = {
        name: "test-group",
        chatId: 123,
        commandSpecialArgs: {
            customUsers: [],
            defaultUsers: []
        },
        whoSent: "sender"
    };

    it("should return object from build with set params", function () {
        const args = {
            name: "name",
            whoSent: "whoSent",
            chatId: 1,
            commandSpecialArgs: {
                defaultUsers: [],
                customUsers: []
            }
        };
        const built = Delete.build(args);
        expect(built).toBeTruthy();
        expect(built.args).toStrictEqual(args);
    });

    it("should registry command handle", function () {
        Delete.registryCommand("DELETE");

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: "",
            entities: []
        };

        const fun = commandHandles.get("DELETE") as ((args: RegistryCommandArgs) => ICommand) | (() => ICommand);

        expect(fun(args)).toStrictEqual({
            args: {
                chatId: 1,
                name: "",
                whoSent: ""
            },
            command: "DELETE"
        });

        expect(commandHandles.get("DELETE")).toBeTruthy();
        expect(registeredCommands.get("DELETE")).toBeTruthy();
    });

    it(`should return "Grupo ${args.name} deletado!" when the group is successfully created`, async () => {
        const mockGroupDelete = jest.spyOn(Group, "deleteOne").mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        // Act
        const command = new Delete(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe(`Grupo ${args.name} deletado!`);
        expect(mockGroupDelete).toHaveBeenCalledWith({
            name: "test-group",
            groupId: 123,
        });
    });

    it("should throw an error when the database query fails", async () => {
        const mockGroupDelete = jest.spyOn(Group, "deleteOne").mockRejectedValue(new Error("Database query failed") as unknown as never);

        // Act
        const command = new Delete(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Error: Database query failed");
        expect(mockGroupDelete).toHaveBeenCalledWith({
            name: "test-group",
            groupId: 123,
        });
    });
});
