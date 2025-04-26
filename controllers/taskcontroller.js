const { Task } = require("../models");
const { Op } = require("sequelize");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const task = await Task.create({ title, description, priority, due_date });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, priority, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const tasks = await Task.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      total: tasks.count,
      page: parseInt(page),
      tasks: tasks.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    task ? res.json(task) : res.status(404).json({ error: "Task not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, priority, due_date, status } = req.body;
    await task.update({ title, priority, due_date, status });

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
