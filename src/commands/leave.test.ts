import { Leave } from "./leave";
import { CommandArgs } from "../interfaces/commandArgs";
import {
    baseQuery,
    mockLeaveSuccess,
    mockLeaveFail,
    mockDbError
} from "../mocks/leave.mock";

jest.setTimeout(1000000);

describe("Leave", () => {
    const args: CommandArgs = {
        name: "test-group",
        chatId: 123,
        whoSent: "test-user",
        defaultUsers: [{ id: -1, first_name: "@test-user" }]
    };

    it(`should return "Você saiu do grupo ${args.name}!"`, async () => {
        mockLeaveSuccess();
        const commandLeave = new Leave(args);
        const result = await commandLeave.exec();

        // Assert
        expect(result).toBe(`Você saiu do grupo ${args.name}!`);
        expect(mockLeaveSuccess()).toHaveBeenCalledWith(...baseQuery(args));
    });

    it("should throw an error when user is not in group", async () => {
        mockLeaveFail();
        const commandLeave = new Leave(args);
        const result = await commandLeave.exec();

        // Assert
        expect(result).toBe(`Você não está no grupo ${args.name} 🤔`);
        expect(mockLeaveFail()).toHaveBeenCalledWith(...baseQuery(args));
    });

    it("should throw an error when the database query fails", async () => {
        mockDbError();
        const command = new Leave(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Error: Database query failed");
        expect(mockLeaveFail()).toHaveBeenCalledWith(...baseQuery(args));
    });

    it("should throw an error when whoSent is not passed", async () => {
        // Arrange
        const args: CommandArgs = {
            name: "test-group",
            chatId: 123
        };

        // Act
        const command = new Leave(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe("Usuário não encontrado!");
    });
});
