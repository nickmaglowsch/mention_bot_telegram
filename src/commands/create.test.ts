import { Create } from "./create";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";

describe("Create", () => {
    it("should return \"created!\" when the group is successfully created", async () => {
    // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123,
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
