

const express = require("express")
const route = express.Router()

const userController =  require("../controller/userController")
const Task = require("../model/taskModel")

route.post("/userlogin",userController.userLogin)
route.get("/mytask",userController.mytask)
route.put("/updatetaskstatus/:id", async (req, res) => {
    try {
      const { taskStatus } = req.body;
      const updated = await Task.findByIdAndUpdate(
        req.params.id,
        { taskStatus },
        { new: true }
      );
      res.json({ success: true, updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating status" });
    }
  });

module.exports = route