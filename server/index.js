const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://myuser:mypassword@todo.ngqmi59.mongodb.net/?retryWrites=true&w=majority&appName=todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ✅ Mongoose Schema
const taskSchema = new mongoose.Schema({
    text: String,
});
const Task = mongoose.model("Task", taskSchema, "collection1");

// ✅ API Routes
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const task = new Task({ text: req.body.text });
    await task.save();
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

// ✅ Serve React Static Files
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
