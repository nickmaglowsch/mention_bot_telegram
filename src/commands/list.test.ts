import { List } from "./list";
import {
    commandHandles,
    registeredCommands
} from "../interfaces/commands";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import Group, { IGroup } from "../models/group";

describe("List", () => {
    let list: List;
    const args = {
        name: "name",
        chatId: 123,
        whoSent: 123
    } as CommandArgs;

    beforeEach(() => {
        list = new List(args);

    });

    it("should return object from build with set params", function () {
        const built = List.build(args);
        expect(built).toBeTruthy();
    });

    it("should registry command handle", function () {
        List.registryCommand("LIST");

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get("LIST") as (args: unknown) => ICommand;

        expect(fun(args)).toStrictEqual({
            args: {
                chatId: 1,
                name: "",
                whoSent: ""
            },
            command: "LIST"
        });
        expect(registeredCommands.get("LIST")).toBeTruthy();
    });

    it("should return a string will all groups and how many users an in each one", async () => {
        const find = jest.spyOn(Group, "find").mockResolvedValue([ {
            groupId: 1,
            name: "group_name",
            users: [ {
                id: 1,
                first_name: "first_name"
            } ]
        } ] as IGroup[]);

        const listText = await list.exec();

        expect(listText).toEqual("<code>@group_name</code> - 1 pessoas\n" +
            "\n");
        expect(find).toBeCalledWith({ groupId: args.chatId });
    });

    it("should log error and return empty string if error happens", async () => {
        jest.spyOn(Group, "find").mockRejectedValue("error");

        const listText = await list.exec();

        expect(listText).toEqual("");
    });
});
