import mongoose from "mongoose";
import { IUser } from "./user";

// Define the interface for the MongoDB document
export interface IGroup extends mongoose.Document {
  groupId: number;
  name: string;
  users: IUser[];
}

// Define the schema for the MongoDB collection
const groupSchema = new mongoose.Schema({
    groupId: { type: String, required: true },
    name: { type: String, required: true },
    users: [ { type: Object, required: true } ],
});

groupSchema.index({ groupId: 1, name: 1 }, { unique: true });

// Export the model
export default mongoose.model<IGroup>("Group", groupSchema);
