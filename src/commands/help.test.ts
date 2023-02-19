import { Help } from "./Help";
import { CommandsNames, commandsText, commandsTextDescription } from "../interfaces/commands";
import { adminDescription } from "../utils";

describe("Help", () => {
    let help: Help;

    beforeEach(() => {
        help = new Help();
    });

    it("should generate a help text with command names, descriptions, and admin description", async () => {
        const expectedHelpText = (Object.keys(commandsText) as CommandsNames[])
            .reduce((acc, cmd) => {
                acc += `<code>${commandsText[cmd]}</code> - ${commandsTextDescription[cmd]}${adminDescription(cmd)}\n\n`;
                return acc;
            }, "");

        const helpText = await help.exec();

        expect(helpText).toEqual(expectedHelpText);
    });
});
