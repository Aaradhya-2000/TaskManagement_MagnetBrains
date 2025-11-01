const AdminModel = require("../model/adminModel")
const bcrypt = require("bcrypt")
const taskModel = require("../model/taskModel")
const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken");
// import bcrypt from "bcryptjs";
// import AdminModel from "../models/AdminModel.js"; // adjust path as needed

const JWT_SECRET = process.env.JWT_SECRET || "yourStrongSecretKey";

const AdminLogin1 = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login attempt:", email, password);

    const admin = await AdminModel.findOne({ email });
    console.log("👤 Admin found:", admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // If you stored password in plain text (not hashed)
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      "yourSecretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "✅ Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const createUser = async (req, res) => {
  try {
    const { empid, password, name, email } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      empid,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const showuser = async(req,res)=>{
    const User = await userModel.find()
    res.send(User)
}
const userDelete = async(req,res)=>{
    const { id } = req.query
    const user = await userModel.findByIdAndDelete(id)
    res.send({msg:'deleted succefully'})
}
const asigntask = async (req, res) => {
  try {
    const { title, description, duration, taskStatus, priority, userId } = req.body;

    // Check if all required fields exist
    if (!title || !description || !duration || !userId) {
      return res.status(400).json({ msg: "All fields including userId are required" });
    }

    // Create task
    const task = new taskModel({
      title,
      description,
      duration,
      taskStatus,
      priority,
      userId, // 👈 include userId here
    });

    await task.save();

    res.status(201).json({ msg: "✅ Task created successfully", task });
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};


const normalregister = async (req, res) => {
    try {
      const { nemail, npassword, nname } = req.body;
  
      if (!nemail || !npassword || !nname) {
        return res.status(400).json({ msg: "All fields are required" });
      }
  
      const existingAdmin = await AdminModel2.findOne({ nemail });
      if (existingAdmin) {
        return res.status(400).json({ msg: "Email already registered" });
      }
  
      const nAdmin = await AdminModel2.create({ nname, nemail, npassword });
      res.status(201).json({ nAdmin, msg: "Successfully created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  
  const login2 = async(req,res)=>{
    const { nemail, npassword } = req.body
    const Admin  = await AdminModel2.findOne({nemail})
    console.log(Admin)
    if(!Admin){
 
     res.send({msg:'invalid id'})
    }
    if(Admin.npassword !=npassword){
     res.send({msg:'invalid password'})
    }
   res.send({Admin,msg:'login succefully'})

  }
  
  const allTask = async(req,res)=>{
    try {
      const tasks = await taskModel.find().populate("userId", "name email");
      res.status(200).json({ msg: "All tasks fetched", tasks });
    } catch (error) {
      res.status(500).json({ msg: "Error fetching tasks", error: error.message });
    }
  }
  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, empid } = req.body;
  
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { name, email, empid },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json({ msg: "User updated successfully", updatedUser });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      res.status(500).json({ msg: "Error updating user", error });
    }
  };
  const editTask = async (req, res) => {
    try {
      const updatedTask = await taskModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ msg: "Task updated successfully", updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };
module.exports = {
    AdminLogin1,
    createUser,
    showuser,
    userDelete,
    asigntask,
    normalregister,
    allTask,
    login2,
    updateUser,
    editTask
}