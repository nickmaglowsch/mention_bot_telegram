import { CommandsNames } from './interfaces/commands';
import {TelegramFactory} from "./factory";

describe('TelegramFactory', () => {
    it('should build a Create command', () => {
        const factory = new TelegramFactory('mb create group MyGroup', undefined, 123456);
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.CREATE);
        expect(command.args.name).toEqual('MyGroup');
        expect(command.args.chatId).toEqual(123456);
    });

    it('should build an Add command with default and custom users', () => {
        const entities = [
            {
                type: 'text_mention',
                offset: 0,
                length: 9,
                user: {
                    id: 1,
                    is_bot: false,
                    first_name: 'User',
                    username: 'user1',
                },
            },
            {
                type: 'text_mention',
                offset: 10,
                length: 9,
                user: {
                    id: 2,
                    is_bot: false,
                    first_name: 'User',
                    username: 'user2',
                },
            },
        ];
        const factory = new TelegramFactory('mb add MyGroup @custom1 @custom2', entities, 123456);
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.ADD);
        expect(command.args.name).toEqual('MyGroup');
        expect(command.args.chatId).toEqual(123456);
        expect(command.args.defaultUsers).toHaveLength(2);
        expect(command.args.customUsers).toHaveLength(2);
    });

    it('should build a Mention command', () => {
        const factory = new TelegramFactory('@MyGroup', undefined, 123456);
        const command = factory.build();

        expect(command.name).toEqual(CommandsNames.MENTION);
        expect(command.args.name).toEqual('MyGroup');
        expect(command.args.chatId).toEqual(123456);
    });

    it('should throw an error for an invalid command', () => {
        const factory = new TelegramFactory('mb invalid command', undefined, 123456);

        expect(() => {
            factory.build();
        }).toThrowError('INVALID COMMAND');
    });
});
