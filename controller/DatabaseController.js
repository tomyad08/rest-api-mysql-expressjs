import Database_Karyawan from "../models/DatabaseModel.js";
import path from "path";
import fs from "fs";

export const getKaryawan = async (req, res) => {
  try {
    const response = await Database_Karyawan.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getKaryawanById = async (req, res) => {
  try {
    const response = await Database_Karyawan.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveKaryawan = (req, res) => {
  if (req.files === null)
    return res.status(502).json({ message: "Tidak ada file yang di upload" });
  const nama = req.body.nama;
  const departemen = req.body.departemen;
  const deskripsi_performance = req.body.deskripsi_performance;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must less than 5MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ message: err.message });
    try {
      await Database_Karyawan.create({
        nama: nama,
        departemen: departemen,
        deskripsi_performance: deskripsi_performance,
        image: fileName,
        url: url,
      });
      res.json({ status: 200, results: "berhasil" });
    } catch (err) {
      console.log(err.message);
    }
  });
};

export const updateKaryawan = async (req, res) => {
  const database_karyawan = await Database_Karyawan.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!database_karyawan)
    return res.status(404).json({ message: "data tidak ditemukan" });

  let fileName = "";
  if (req.files === null) {
    fileName = database_karyawan.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must less then" });

    const filepath = `./public/images/${database_karyawan.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }
  const nama = req.body.nama;
  const departemen = req.body.departemen;
  const deskripsi_performance = req.body.deskripsi_performance;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Database_Karyawan.update(
      {
        nama: nama,
        departemen: departemen,
        deskripsi_performance: deskripsi_performance,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "Database berhasil diupdate" });
  } catch (err) {
    res.json({ message: err });
  }
};

export const deleteKaryawan = async (req, res) => {
  const database_karyawan = await Database_Karyawan.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!database_karyawan)
    return res.status(404).json({ message: "Tidak ada data" });

  try {
    const filepath = `./public/images/${database_karyawan.image}`;
    fs.unlinkSync(filepath);
    await Database_Karyawan.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.json({ message: err });
  }
};
