import { Create } from "./create";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import { commandHandles, registeredCommands } from "../interfaces/commands";

describe("Create", () => {


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
        const built = Create.build(args);
        expect(built).toBeTruthy();
        expect(built.args).toStrictEqual(args);
    });
    
    it("should registry command handle", function () {
        Create.registryCommand("CREATE");

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get("CREATE") as (args: unknown) => ICommand;

        expect(fun(args)).toStrictEqual({
            args: {
                chatId: 1,
                name: "",
                whoSent: ""
            },
            command: "CREATE"
        });
        expect(registeredCommands.get("CREATE")).toBeTruthy();
    });

    it("should return \"created!\" when the group is successfully created", async () => {
    // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
            commandSpecialArgs: {
                customUsers: [],
                defaultUsers: []
            },
            whoSent: "sender"
        };
        const mockGroupCreate = jest.spyOn(Group, "create").mockImplementation(() => Promise.resolve());

        // Act
        const command = new Create(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("created!");
        expect(mockGroupCreate).toHaveBeenCalledWith({
            name: "test-group",
            groupId: 123,
            users: [],
        });
    });

    it("should throw an error when the database query fails", async () => {
    // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
            commandSpecialArgs: {
                customUsers: [],
                defaultUsers: []
            },
            whoSent: "sender"
        };
        const mockGroupCreate = jest.spyOn(Group, "create").mockRejectedValue(new Error("Database query failed") as unknown as never);

        // Act
        const command = new Create(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Error: Database query failed");
        expect(mockGroupCreate).toHaveBeenCalledWith({
            name: "test-group",
            groupId: 123,
            users: [],
        });
    });
});
