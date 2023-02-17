export interface Commands {
    name: CommandsNames;
    args: any;
    exec: () => Promise<void>;
}

export enum CommandsNames {
    CREATE = 'create',
    ADD = 'add',
    MENTION = 'mention'
}

