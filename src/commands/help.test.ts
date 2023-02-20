import { Help } from "./help";
import { commandHandles, CommandsNames, commandsText, commandsTextDescription } from "../interfaces/commands";
import { adminDescription } from "../utils";
import { ICommand } from "../interfaces/commandArgs";

describe("Help", () => {
    let help: Help;

    beforeEach(() => {
        help = new Help();
    });

    it("should registry command handle", function () {
        Help.registryCommand();

        const args = {
            action: "",
            name: "",
            chatId: 1,
            whoSent: ""
        };

        const fun = commandHandles.get(CommandsNames.HELP) as (args: unknown) => ICommand;

        expect(fun(args)).toStrictEqual({
            args: {},
            command: CommandsNames.HELP
        });
    });

    it("should generate a help text with command names, descriptions, and admin description", async () => {
        const expectedHelpText = (Object.keys(commandsText) as CommandsNames[])
            .reduce((acc, cmd) => {
                acc += `<code>${commandsText[cmd]}</code> ${commandsTextDescription[cmd]}${adminDescription(cmd)}\n\n`;
                return acc;
            }, "") + "Para todos os comandos, basta remover os &lt;&gt; e colocar as informações pedidas em seu lugar!";

        const helpText = await help.exec();

        expect(helpText).toEqual(expectedHelpText);
    });
});
