import { Remove } from "./remove";
import Group from "../models/group";
import { commandHandles, CommandsNames } from "../interfaces/commands";
import { ICommand } from "../interfaces/commandArgs";


describe("Remove command", () => {
    const chatId = 123;
    const name = "test group";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should registry command handle", function () {
        Remove.registryCommand();

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get(CommandsNames.REMOVE) as (args: unknown) => ICommand;

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
            command: CommandsNames.REMOVE
        });
    });

    it("should return \"Usuário não encontrado!\" when no user is found", async () => {
        Group.findOne = jest.fn().mockResolvedValue({ chatId, name });
        const command = new Remove({
            name,
            chatId,
            commandSpecialArgs: {
                customUsers: [],
                defaultUsers: []
            },
            whoSent: "sender"
        });
        const result = await command.exec();

        expect(result).toEqual("Usuário não encontrado!");
    });

    it("should return \"Grupo não encontrado!\" when no group is found", async () => {
        Group.findOne = jest.fn().mockResolvedValue(null);
        const command = new Remove({
            name,
            chatId,
            commandSpecialArgs: {
                defaultUsers: [ { id: 1, first_name: "John" } ],
                customUsers: []
            },
            whoSent: "sender"
        });
        const result = await command.exec();

        expect(result).toEqual("Grupo não encontrado!");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
    });

    it("should remove user from group", async () => {
        const users = [
            { id: 1, first_name: "John" },
            { id: 2, first_name: "Jane" },
            { id: 3, first_name: "Bob" }
        ];
        const group = { name, groupId: chatId, users, save: jest.fn() };
        const removeUsers = [ users[0], users[2] ];
        const newUsers = [ users[1] ];

        Group.findOne = jest.fn().mockResolvedValue(group);
        Group.prototype.save = jest.fn();
        const command = new Remove({
            name,
            chatId,
            commandSpecialArgs: {
                defaultUsers: removeUsers,
                customUsers: []
            },
            whoSent: "sender"
        });
        const result = await command.exec();

        expect(result).toEqual("Removido!");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
        expect(group.save).toHaveBeenCalled();
        expect(group.users).toEqual(newUsers);
    });

    it("should return error message on error", async () => {
        Group.findOne = jest.fn().mockRejectedValue("Error");
        const command = new Remove({
            name,
            chatId,
            commandSpecialArgs: {
                defaultUsers: [ { id: 1, first_name: "John" } ],
                customUsers: []
            },
            whoSent: "sender"
        });
        const result = await command.exec();

        expect(result).toEqual("Error");
        expect(Group.findOne).toHaveBeenCalledWith({ groupId: chatId, name });
    });
});
