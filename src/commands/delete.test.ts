import { Delete } from "./delete";
import Group from "../models/group";
import { CommandArgs } from "../interfaces/commandArgs";

describe("Delete", () => {
    const args: CommandArgs = {
        name: "test-group",
        chatId: 123,
    };

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
