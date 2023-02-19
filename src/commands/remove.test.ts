import { Remove } from "./remove";
import Group from "../models/group";


describe("Remove command", () => {
    const chatId = 123;
    const name = "test group";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return \"Usuário não encontrado!\" when no user is found", async () => {
        Group.findOne = jest.fn().mockResolvedValue({ chatId, name });
        const command = new Remove({ name, chatId });
        const result = await command.exec();

        expect(result).toEqual("Usuário não encontrado!");
    });

    it("should return \"Grupo não encontrado!\" when no group is found", async () => {
        Group.findOne = jest.fn().mockResolvedValue(null);
        const command = new Remove({ name, chatId, defaultUsers: [ { id: 1, first_name: "John" } ] });
        const result = await command.exec();

        expect(result).toEqual("Grupo não encontrado!");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
    });

    it("should remove user from group", async () => {
        const users = [
            { id: 1, first_name: "John" },
            { id: 2, first_name: "Jane" },
            { id: 3, first_name: "Bob" },
        ];
        const group = { name, groupId: chatId, users, save: jest.fn() };
        const removeUsers = [ users[0], users[2] ];
        const newUsers = [ users[1] ];

        Group.findOne = jest.fn().mockResolvedValue(group);
        Group.prototype.save = jest.fn();
        const command = new Remove({ name, chatId, defaultUsers: removeUsers });
        const result = await command.exec();

        expect(result).toEqual("removido!");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
        expect(group.save).toHaveBeenCalled();
        expect(group.users).toEqual(newUsers);
    });

    it("should return error message on error", async () => {
        Group.findOne = jest.fn().mockRejectedValue("Error");
        const command = new Remove({ name, chatId, defaultUsers: [ { id: 1, first_name: "John" } ] });
        const result = await command.exec();

        expect(result).toEqual("Error");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
    });
});
