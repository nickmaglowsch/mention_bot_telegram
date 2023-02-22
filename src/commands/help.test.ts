import { Help } from "./help";
import {
    commandHandles,
    registeredCommands
} from "../interfaces/commands";
import { ICommand } from "../interfaces/commandArgs";

describe("Help", () => {
    let help: Help;

    beforeEach(() => {
        help = new Help();
    });

    it("should return object from build with set params", function () {
        const built = Help.build();
        expect(built).toBeTruthy();
    });

    it("should registry command handle", function () {
        Help.registryCommand("HELP");

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get("HELP") as (args: unknown) => ICommand;

        expect(fun(args)).toStrictEqual({
            args: {},
            command: "HELP"
        });
        expect(registeredCommands.get("HELP")).toBeTruthy();
    });

    it("should generate a help text with command names, descriptions, and admin description", async () => {
        registeredCommands.clear();
        registeredCommands.set("HELP", {
            commandName: "HELP",
            commandText: "TEXT",
            adminOnly: false,
            commandDescription: "description",
            actionStringTest: "startsWith"
        });

        const helpText = await help.exec();

        expect(helpText).toEqual("<code>TEXT</code> description\n" +
            "\n" +
            "Para todos os comandos, basta remover os &lt;&gt; e colocar as informações pedidas em seu lugar!");
    });
});
