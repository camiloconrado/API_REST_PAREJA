import prisma from "../prismaClient.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();

    const serializedTasks = tasks.map(task => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId.toString()
    }));

    return res.json(serializedTasks);

  } catch (error) {
    console.error("Error fetching tasks =>", error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: BigInt(userId)  
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
    const data = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: BigInt(id) },
      data
    });

    // 🔥 Convertir BigInt a string antes de enviar
    const serializedTask = {
      ...updatedTask,
      id: updatedTask.id.toString(),
      userId: updatedTask.userId.toString()
    };

    return res.json(serializedTask);

  } catch (error) {
    console.error("Error updating task =>", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: BigInt(id) }
    });

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task =>", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};
