import mongoose from "mongoose";

const blogModel = mongoose.Schema({
    Title: { type: String, required: true },
    Info: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true }
}, {
    timestamps: true  // Optional: adds createdAt and updatedAt fields
});

const blog = mongoose.model("Blog", blogModel);


export default blog;









