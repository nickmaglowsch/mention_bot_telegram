import mongoose from "mongoose";
import { CommandArgs } from "../interfaces/commandArgs";
import Group from "../models/group";

const mockObjectId = new mongoose.Types.ObjectId();

export const baseQuery = (args: CommandArgs) => [
    {
        groupId: args.chatId,
        name: args.name,
        $or: [
            { "users.first_name": `@${args.whoSent}` },
            { "users.id": args.whoSent }
        ]
    },
    {
        $pull: {
            users: {
                $or: [
                    { "users.first_name": `@${args.whoSent}` },
                    { "users.id": args.whoSent }
                ]
            }
        }
    },
    { new: true }
];

export const mockLeaveSuccess = () =>
    jest.spyOn(Group, "updateOne").mockResolvedValue({
        acknowledged: true,
        modifiedCount: 1,
        matchedCount: 1,
        upsertedCount: 0,
        upsertedId: mockObjectId
    });

export const mockLeaveFail = () =>
    jest.spyOn(Group, "updateOne").mockResolvedValue({
        acknowledged: true,
        modifiedCount: 0,
        matchedCount: 0,
        upsertedCount: 0,
        upsertedId: mockObjectId
    });

export const mockDbError = () =>
    jest
        .spyOn(Group, "updateOne")
        .mockRejectedValue(new Error("Database query failed"));
