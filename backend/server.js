import express from "express";
import { connectDB } from "./database.js";
import blog from "../product_models.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserAuth from "./MiddleWear/userdataAuth.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", UserAuth, async (req, res) => {
    try {
        const info = await blog.find({userId : req.user.id}); // Fetch blogs for the authenticated user
        res.status(200).json({success: true, data: info});
    } catch(error) {
        console.log("Error with message", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }   
});

app.post("/", async (req, res) => {
    console.log("POST request received");
    console.log("Request body:", req.body);
    
    const Blog = req.body;

    if(!Blog.Title || !Blog.Info) {
        console.log("Validation failed");
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }
        

    try {
      const newBlog = new blog(Blog);
        await newBlog.save();
        console.log("Blog saved successfully");
        res.status(200).json({success: true,  data:newBlog});
    } catch(error) {
        console.error("Error saving blog:", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
});
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const updatedBlog = await blog.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.delete("/:id", async(req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product Id" });
    }
    
    try {
        await blog.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Deleted"});  // Fix: sucess -> success
    } catch(error) {
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