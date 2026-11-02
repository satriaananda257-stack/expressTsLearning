import { Router } from "express";
import taskController from "../controllers/taskController";

const router = Router();

// GET /tasks        - ambil semua task (support ?status=&priority= filter)
router.get("/", taskController.getAllTasks);

// GET /tasks/:id    - ambil task by ID
router.get("/:id", taskController.getTaskById);

// POST /tasks       - buat task baru
router.post("/", taskController.createTask);

// PUT /tasks/:id    - update task by ID
router.put("/:id", taskController.updateTask);

// DELETE /tasks/:id - hapus task by ID
router.delete("/:id", taskController.deleteTask);

// PATCH /tasks/:id/status - ubah status saja
router.patch("/:id/status", taskController.updateStatus);

export default router;
