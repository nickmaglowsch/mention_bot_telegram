import { Mention } from "./mention";
import Group from "../models/group";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import { commandHandles } from "../interfaces/commands";

describe("Mention", () => {

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
        const built = Mention.build(args);
        expect(built).toBeTruthy();
        expect(built.args).toStrictEqual(args);
    });

    it("should registry command handle", function () {
        Mention.registryCommand("MENTION");

        const args = {
            action: "@test",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get("MENTION") as (args: unknown) => ICommand;

        expect(fun(args)).toStrictEqual({
            args: {
                chatId: 1,
                name: "test",
                whoSent: ""
            },
            command: "MENTION"
        });
    });

    it("should return a string with user mentions", async () => {
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
        const mockGroupFindOne = jest
            .spyOn(Group, "findOne")
            .mockResolvedValue({
                groupId: 123,
                name: "test-group",
                users: [
                    { id: 1, first_name: "John" },
                    { id: 2, first_name: "Mary" },
                    { id: -1, first_name: "Jane" }
                ]
            });

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe(
            "<a href=\"tg://user?id=1\">John</a> <a href=\"tg://user?id=2\">Mary</a> Jane "
        );
        expect(mockGroupFindOne).toHaveBeenCalledWith({
            groupId: 123,
            name: "test-group"
        });
    });

    it("should return an error message when the group is not found", async () => {
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
        const mockGroupFindOne = jest
            .spyOn(Group, "findOne")
            .mockResolvedValue(null);

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("");
        expect(mockGroupFindOne).toHaveBeenCalledWith({
            groupId: 123,
            name: "test-group"
        });
    });

    it("should return an error message when the group has no users", async () => {
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
        const mockGroupFindOne = jest
            .spyOn(Group, "findOne")
            .mockResolvedValue({
                groupId: 123,
                name: "test-group",
                users: []
            });

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Grupo não possui membros ainda");
        expect(mockGroupFindOne).toHaveBeenCalledWith({
            groupId: 123,
            name: "test-group"
        });
    });
});
