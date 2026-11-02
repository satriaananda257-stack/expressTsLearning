import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = 5000;

// middleware
app.use(express.json());

// routes
app.use("/tasks", taskRoutes);

// root
app.get("/", (req, res) => {
  res.json({
    message: "Task Management API",
    version: "1.0.0",
    endpoints: {
      "GET    /tasks":              "Ambil semua task",
      "GET    /tasks/:id":          "Ambil task by ID",
      "POST   /tasks":              "Buat task baru",
      "PUT    /tasks/:id":          "Update task by ID",
      "DELETE /tasks/:id":          "Hapus task by ID",
      "PATCH  /tasks/:id/status":   "Ubah status task",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
