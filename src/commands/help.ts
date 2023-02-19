import {
    Commands,
    CommandsNames,
    commandsText,
    commandsTextDescription
} from "../interfaces/commands";
import { CommandArgs } from "../interfaces/commandArgs";
import { adminDescription } from "../utils";

export class Help implements Commands {
    name = CommandsNames.HELP;
    args: CommandArgs = {} as CommandArgs;

    async exec(): Promise<string> {
        return (Object.keys(commandsText) as CommandsNames[])
            .reduce((acc, cmd) => {
                acc += `<code>${commandsText[cmd]}</code> - ${commandsTextDescription[cmd]}${adminDescription(cmd)}\n\n`;
                return acc;
            }, "");
    }

}