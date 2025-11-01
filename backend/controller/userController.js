
const taskModel = require("../model/taskModel")
const userModel = require("../model/userModel")
const bcrypt = require("bcrypt")

// import bcrypt from "bcryptjs";

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    res.status(200).json({ msg: "Login successful", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

    
 

const mytask = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Fetch all tasks assigned to this user
    const tasks = await taskModel.find({ userId: id });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ msg: "No tasks found", tasks: [] });
    }

    // ✅ Send tasks as a JSON response
    res.status(200).json({ msg: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};


module.exports = {
    userLogin,
    mytask
}