import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import {
  deleteKaryawan,
  getKaryawan,
  getKaryawanById,
  saveKaryawan,
  updateKaryawan,
} from "./controller/DatabaseController.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

app.get("/", getKaryawan);
app.get("/:id", getKaryawanById);
app.post("/", saveKaryawan);
app.patch("/:id", updateKaryawan);
app.delete("/:id", deleteKaryawan);

app.listen(5000, () => console.log("server 5000 running"));
