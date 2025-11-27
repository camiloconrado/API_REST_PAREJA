import prisma from "../prismaClient.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: BigInt(req.user.id) }
    });

    const tasksString = tasks.map(t => ({
      ...t,
      id: t.id.toString(),
      userId: t.userId.toString()
    }));

    return res.json(tasksString);
  } catch (error) {
    console.error("Error fetching tasks =>", error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};


export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: BigInt(req.user.id)
      }
    });

    return res.status(201).json({
      ...newTask,
      id: newTask.id.toString(),
      userId: newTask.userId.toString()
    });

  } catch (error) {
    console.error("Error creating task =>", error);
    return res.status(500).json({ message: "Error creating task" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = BigInt(req.user.id);

    const task = await prisma.task.findUnique({
      where: { id: BigInt(id) }
    });

    if (!task || task.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: This task does not belong to you" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: BigInt(id) },
      data: req.body
    });

    return res.json({
      ...updatedTask,
      id: updatedTask.id.toString(),
      userId: updatedTask.userId.toString()
    });

  } catch (error) {
    console.error("Error updating task =>", error);
    return res.status(500).json({ message: "Error updating task" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = BigInt(req.user.id);

    const task = await prisma.task.findUnique({
      where: { id: BigInt(id) }
    });

    if (!task || task.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: This task does not belong to you" });
    }

    await prisma.task.delete({
      where: { id: BigInt(id) }
    });

    return res.json({ message: "Task deleted" });

  } catch (error) {
    console.error("Error deleting task =>", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};

