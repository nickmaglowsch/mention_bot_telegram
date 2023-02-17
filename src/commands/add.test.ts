import {Add} from './add';
import Group from "../models/group";
import {CommandArgs} from "../interfaces/commandArgs";

describe('Add', () => {
    it('should return "group_not_found_or_users_not_found" when the group or users are not found', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
            defaultUsers: [],
            customUsers: [],
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockResolvedValue(null);

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe('group_not_found_or_users_not_found');
        expect(mockGroupFindOne).toHaveBeenCalledWith({groupId: 123, name: 'test-group'});
    });

    it('should return "added" when users are added to the group', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
            defaultUsers: [{id: 1, first_name: 'User 1'}],
            customUsers: [{id: 2, first_name: 'User 2'}],
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockResolvedValue({
            groupId: 123,
            name: 'test-group',
            users: [{id: 1, first_name: 'User 1'}],
            save: jest.fn(),
        });

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe('added');
        expect(mockGroupFindOne).toHaveBeenCalledWith({groupId: 123, name: 'test-group'});
    });

    it('should throw an error when the database query fails', async () => {
        // Arrange
        const args: CommandArgs = {
            name: 'test-group',
            chatId: 123,
            defaultUsers: [{id: 1, first_name: 'User 1'}],
            customUsers: [{id: 2, first_name: 'User 2'}],
        };
        const mockGroupFindOne = jest.spyOn(Group, 'findOne').mockRejectedValue(new Error('Database query failed'));

        // Act
        const command = new Add(args);
        const result = await command.exec();

        // Assert
        expect(result).toBe('Error: Database query failed');
        expect(mockGroupFindOne).toHaveBeenCalledWith({groupId: 123, name: 'test-group'});
    });
});
