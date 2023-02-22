import {
    commandHandles, Commands,
    CommandsNames,
    registeredCommands
} from "../interfaces/commands";
import { CommandArgs, ICommand } from "../interfaces/commandArgs";
import { adminDescription } from "../utils";

export class Help extends Commands {
    static commandName: CommandsNames = "HELP";

    async exec(): Promise<string> {

        return Array.from(registeredCommands.values())
            .reduce((acc, cmd) => {
                const { commandDescription, commandText, commandName } = cmd;
                acc += `<code>${commandText}</code> ${commandDescription}${adminDescription(commandName)}\n\n`;
                return acc;
            }, "") + "Para todos os comandos, basta remover os &lt;&gt; e colocar as informações pedidas em seu lugar!";
    }

    static registryCommand(commandName: CommandsNames): void {
        commandHandles.set(commandName, () => {
            return {
                command: commandName,
                args: {} as CommandArgs
            } as ICommand;
        });

        registeredCommands.set(commandName, {
            commandName: commandName,
            commandDescription: "mostra essa lista",
            adminOnly: false,
            commandText: "mb help",
            actionStringTest: "startsWith"
        });
    }

    static build(): Commands {
        return new Help();
    }

    // no use of args in command
    args: CommandArgs = {} as CommandArgs;
}