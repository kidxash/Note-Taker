import mongoose from "mongoose";

const  folderSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
export const Folder = mongoose.model("Folder", folderSchema);