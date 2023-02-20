import {
    commandHandles,
    Commands,
    CommandsNames,
    commandsText,
    commandsTextDescription
} from "../interfaces/commands";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import { adminDescription } from "../utils";

export class Help extends Commands {
    name = CommandsNames.HELP;
    args: CommandArgs = {} as CommandArgs;

    async exec(): Promise<string> {
        return (Object.keys(commandsText) as CommandsNames[])
            .reduce((acc, cmd) => {
                acc += `<code>${commandsText[cmd]}</code> ${commandsTextDescription[cmd]}${adminDescription(cmd)}\n\n`;
                return acc;
            }, "") + "Para todos os comandos, basta remover os &lt;&gt; e colocar as informações pedidas em seu lugar!";
    }

    static registryCommand(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        commandHandles.set(CommandsNames.HELP, (_) => {
            return {
                command: CommandsNames.HELP,
                args: {} as CommandArgs
            } as ICommand;
        });
    }
}