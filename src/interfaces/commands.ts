import { CommandArgs, ICommand, RegistryCommandArgs } from "./commandArgs";

export abstract class Commands {
    abstract args: CommandArgs;

    abstract exec(): Promise<string>;

    static commandName: CommandsNames = "EMPTY_COMMAND";

    static registryCommand(commandName: CommandsNames): void {
        throw new Error(`OVERRIDE THIS STATIC FUNCTION TO REGISTRY THE COMMAND ${commandName} AND CREATE ITS ARGS`);
    }

    static build(args: CommandArgs): Commands {
        throw new Error(`OVERRIDE THIS STATIC FUNCTION TO RETURN A NEW INSTANCE OF THE CLASS ${args.name}`);
    }
}

export interface CommandRegistry {
    commandName: CommandsNames;
    commandText: string;
    adminOnly: boolean;
    commandDescription: string;
    actionStringTest: "startsWith" | "includes";
}

export type CommandsNames = "CREATE" | "ADD" | "MENTION" | "DELETE" | "LEAVE"
    | "REMOVE" | "HELP" | "EMPTY_COMMAND" | "LIST"


export const registeredCommands = new Map<CommandsNames, CommandRegistry>();

export const commandHandles = new Map<CommandsNames, ((args: RegistryCommandArgs) => ICommand) | (() => ICommand)>();
