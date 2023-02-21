import { Add } from "./add";
import Group from "../models/group";
import { CommandArgs, ICommand, RegistryCommandArgs } from "../interfaces/commandArgs";
import { commandHandles, registeredCommands } from "../interfaces/commands";

describe("Add", () => {

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
        const built = Add.build(args);
        expect(built).toBeTruthy();
        expect(built.args).toStrictEqual(args);
    });

    describe("command handle", () => {
        it("should registry command handle", function () {
            Add.registryCommand("ADD");

            const args = {
                action: "",
                name: "",
                chatId: 1,
                whoSent: "",
                entities: []
            };

            const fun = commandHandles.get("ADD") as ((args: RegistryCommandArgs) => ICommand) | (() => ICommand);

            expect(fun(args)).toStrictEqual({
                args: {
                    chatId: 1,
                    commandSpecialArgs: {
                        customUsers: [],
                        defaultUsers: []
                    },
                    name: "",
                    whoSent: ""
                },
                command: "ADD"
            });
            expect(registeredCommands.get("ADD")).toBeTruthy();
        });
    });


    it("should return \"group_not_found_or_users_not_found\" when the group or users are not found", async () => {
        // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
            commandSpecialArgs: {
                defaultUsers: [],
                customUsers: []
            },
            whoSent: "sender"
        };
        const mockGroupFindOne = jest.spyOn(Group, "findOne").mockResolvedValue(null);

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("group_not_found_or_users_not_found");
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: "test-group" });
    });

    it("should return \"added\" when users are added to the group", async () => {
        // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
            whoSent: "sender",
            commandSpecialArgs: {
                defaultUsers: [ { id: 1, first_name: "User 1" } ],
                customUsers: [ { id: 2, first_name: "User 2" } ]
            }
        };
        const mockGroupFindOne = jest.spyOn(Group, "findOne").mockResolvedValue({
            groupId: 123,
            name: "test-group",
            users: [ { id: 1, first_name: "User 1" } ],
            save: jest.fn()
        });

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("added");
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: "test-group" });
    });

    it("should throw an error when the database query fails", async () => {
        // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
            whoSent: "sender",
            commandSpecialArgs: {
                defaultUsers: [ { id: 1, first_name: "User 1" } ],
                customUsers: [ { id: 2, first_name: "User 2" } ]
            }
        };
        const mockGroupFindOne = jest.spyOn(Group, "findOne").mockRejectedValue(new Error("Database query failed"));

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Error: Database query failed");
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: "test-group" });
    });
});
