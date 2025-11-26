import prisma from "../prismaClient.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = await prisma.task.create({
      data: { title, description }
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data
    });

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};
