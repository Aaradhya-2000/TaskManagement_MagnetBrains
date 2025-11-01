

const express = require("express")
const route = express.Router()
const TaskModel = require("../model/taskModel")
const adminController =  require("../controller/adminController")

route.post("/login",adminController.AdminLogin1)
route.post("/usercreate",adminController.createUser)
route.post("/asigntask",adminController.asigntask)
route.get("/showuser",adminController.showuser)
route.get("/alltasks",adminController.allTask)
route.delete("/userDelete",adminController.userDelete)
route.post("/normalregister",adminController.normalregister)
route.post("/login2",adminController.login2)
// Update user route (PUT /admin/updateuser/:id)
route.put("/updateuser/:id",adminController.updateUser);
route.put("/edittask/:id", adminController.editTask);
route.delete("/deletetask/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await TaskModel.findByIdAndDelete(id);
      res.status(200).json({ msg: "Task deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Error deleting task", error: err.message });
    }
  });
  
  

module.exports = route