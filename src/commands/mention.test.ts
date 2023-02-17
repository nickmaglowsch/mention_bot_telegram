import { Mention } from './mention';
import Group from '../models/group';
import {CommandArgs} from "../interfaces/commandArgs";

describe('Mention', () => {
    it('should return a string with user mentions', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockResolvedValue({
            groupId: 123,
            name: 'test-group',
            users: [
                { id: 1, first_name: 'John' },
                { id: 2, first_name: 'Mary' },
                { id: -1, first_name: 'Jane' },
            ],
        });

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe(
            '<a href="tg://user?id=1">John</a> <a href="tg://user?id=2">Mary</a> Jane ',
        );
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: 'test-group' });
    });

    it('should return an error message when the group is not found', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockResolvedValue(null);

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe('group not exists or have no users');
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: 'test-group' });
    });

    it('should return an error message when the group has no users', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockResolvedValue({
            groupId: 123,
            name: 'test-group',
            users: [],
        });

        // Act
        const command = new Mention(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe('group not exists or have no users');
        expect(mockGroupFindOne).toHaveBeenCalledWith({ groupId: 123, name: 'test-group' });
    });
});
