import express from "express";
import { connectDB } from "./database.js";
import blog from "../product_models.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserAuth from "./MiddleWear/userdataAuth.js";
import authRouter from "./UserRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true
}));
app.use(cookieParser());

// Add auth routes - change from /api/auth to /api to match frontend calls
app.use("/api", authRouter);

// Blog routes - move to /api/blogs to avoid conflicts
app.get("/api/blogs", UserAuth, async (req, res) => {
    try {
        // Use req.userId consistently (from middleware)
        const info = await blog.find({userId : req.userId}); 
        console.log(`Fetching blogs for user ID: ${req.userId}, found ${info.length} blogs`);
        res.status(200).json({success: true, data: info});
    } catch(error) {
        console.log("Error with message", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }   
});

app.post("/api/blogs", UserAuth, async (req, res) => {
    
    const Blog = req.body;

    if(!Blog.Title || !Blog.Info) {
        console.log("Validation failed");
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }
        

    try {
        // Use req.userId consistently (from middleware)
        Blog.userId = req.userId; // Associate blog with the authenticated user
        const newBlog = new blog(Blog);
        await newBlog.save();
        console.log(`Blog saved successfully for user ID: ${req.userId}`);
        res.status(201).json({success: true, data: newBlog});
    } catch(error) {
        console.error("Error saving blog:", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
});
app.put("/api/blogs/:id", UserAuth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Blog Id" });
  }

  try {
    // First, check if the blog belongs to the authenticated user
    const existingBlog = await blog.findOne({ _id: id, userId: req.userId });
    
    if (!existingBlog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found or you don't have permission to edit it" 
      });
    }

    const updatedBlog = await blog.findByIdAndUpdate(id, updateData, { new: true });
    console.log(`Blog updated successfully by user ID: ${req.userId}`);
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.delete("/api/blogs/:id", UserAuth, async(req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Blog Id" });
    }
    
    try {
        // Only delete blogs that belong to the authenticated user
        const deletedBlog = await blog.findOneAndDelete({ _id: id, userId: req.userId });
        
        if (!deletedBlog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found or you don't have permission to delete it" 
            });
        }
        
        console.log(`Blog deleted successfully by user ID: ${req.userId}`);
        res.status(200).json({success: true, message: "Blog deleted successfully"});
    } catch(error) {
        console.error("Error deleting blog:", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
});



const startServer = async () => {
    try {
        await connectDB();
        app.listen(3001, () => {
            console.log("Server Started at http://localhost:3001");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();