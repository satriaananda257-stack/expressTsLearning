import { Request, Response } from "express";
import { Task, TaskStatus } from "../types/task";

const VALID_STATUS: TaskStatus[] = ["pending", "completed"];
const VALID_PRIORITY = ["low", "medium", "high"];

let dataTasks: Task[] = [
  {
    id: 1,
    title: "Belajar TypeScript",
    description: "Pelajari dasar-dasar TypeScript dan type system-nya",
    status: "completed",
    priority: "high",
    deadline: "2026-11-05",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Buat REST API",
    description: "Buat Task Management API menggunakan Express.js",
    status: "pending",
    priority: "high",
    deadline: "2026-11-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Review Code",
    description: "Review dan refactor kode yang sudah dibuat",
    status: "pending",
    priority: "medium",
    deadline: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class TaskController {

  // GET /tasks
  getAllTasks = async (req: Request, res: Response) => {
    const { status, priority } = req.query;

    let result = [...dataTasks];

    // filter by status (optional query)
    if (status) {
      if (!VALID_STATUS.includes(status as TaskStatus)) {
        return res.status(400).json({
          status: false,
          message: `Status tidak valid. Gunakan: ${VALID_STATUS.join(", ")}`,
        });
      }
      result = result.filter((t) => t.status === status);
    }

    // filter by priority (optional query)
    if (priority) {
      if (!VALID_PRIORITY.includes(priority as string)) {
        return res.status(400).json({
          status: false,
          message: `Priority tidak valid. Gunakan: ${VALID_PRIORITY.join(", ")}`,
        });
      }
      result = result.filter((t) => t.priority === priority);
    }

    return res.status(200).json({
      status: true,
      message: "Get All Tasks Success",
      data: {
        total: result.length,
        tasks: result,
      },
    });
  };

  // GET /tasks/:id
  getTaskById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID tidak valid",
      });
    }

    const task = dataTasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: `Task dengan ID ${id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Get Task Success",
      data: { task },
    });
  };

  // POST /tasks
  createTask = async (req: Request, res: Response) => {
    const { title, description, status, priority, deadline } = req.body;

    // validasi wajib
    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "Title dan description wajib diisi",
      });
    }

    // validasi status
    const taskStatus: TaskStatus = status ?? "pending";
    if (!VALID_STATUS.includes(taskStatus)) {
      return res.status(400).json({
        status: false,
        message: `Status tidak valid. Gunakan: ${VALID_STATUS.join(", ")}`,
      });
    }

    // validasi priority
    const taskPriority = priority ?? "medium";
    if (!VALID_PRIORITY.includes(taskPriority)) {
      return res.status(400).json({
        status: false,
        message: `Priority tidak valid. Gunakan: ${VALID_PRIORITY.join(", ")}`,
      });
    }

    const newId =
      dataTasks.length > 0
        ? Math.max(...dataTasks.map((t) => t.id)) + 1
        : 1;

    const now = new Date().toISOString();

    const newTask: Task = {
      id: newId,
      title,
      description,
      status: taskStatus,
      priority: taskPriority,
      deadline: deadline ?? null,
      createdAt: now,
      updatedAt: now,
    };

    dataTasks.push(newTask);

    return res.status(201).json({
      status: true,
      message: "Create Task Success",
      data: { task: newTask },
    });
  };

  // PUT /tasks/:id
  updateTask = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID tidak valid",
      });
    }

    const task = dataTasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: `Task dengan ID ${id} tidak ditemukan`,
      });
    }

    const { title, description, status, priority, deadline } = req.body;

    // validasi status jika dikirim
    if (status !== undefined && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Status tidak valid. Gunakan: ${VALID_STATUS.join(", ")}`,
      });
    }

    // validasi priority jika dikirim
    if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
      return res.status(400).json({
        status: false,
        message: `Priority tidak valid. Gunakan: ${VALID_PRIORITY.join(", ")}`,
      });
    }

    // update hanya field yang dikirim
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (deadline !== undefined) task.deadline = deadline;
    task.updatedAt = new Date().toISOString();

    return res.status(200).json({
      status: true,
      message: "Update Task Success",
      data: { task },
    });
  };

  // DELETE /tasks/:id
  deleteTask = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID tidak valid",
      });
    }

    const index = dataTasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({
        status: false,
        message: `Task dengan ID ${id} tidak ditemukan`,
      });
    }

    const deletedTask = dataTasks.splice(index, 1)[0];

    return res.status(200).json({
      status: true,
      message: "Delete Task Success",
      data: { task: deletedTask },
    });
  };

  // PATCH /tasks/:id/status — shortcut ubah status saja
  updateStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID tidak valid",
      });
    }

    const task = dataTasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: `Task dengan ID ${id} tidak ditemukan`,
      });
    }

    const { status } = req.body;

    if (!status || !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Status tidak valid. Gunakan: ${VALID_STATUS.join(", ")}`,
      });
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    return res.status(200).json({
      status: true,
      message: `Status task berhasil diubah menjadi "${status}"`,
      data: { task },
    });
  };
}

export default new TaskController();
