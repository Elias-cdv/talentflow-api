const mongodb = require("../config/db");
const { ObjectId } = require("mongodb");

// GET - Obtener todos los departamentos
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("departments").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving departments", error: error.message });
  }
};

// GET - Obtener uno solo por ID
const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Must use a valid department ID." });
    }
    const departmentId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("departments")
      .find({ _id: departmentId });
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        return res.status(404).json({ message: "Department not found." });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving department", error: error.message });
  }
};

// POST - Crear departamento (Estructura: name, code, managerId, budget)
const createDepartment = async (req, res) => {
  try {
    const department = {
      name: req.body.name, // e.g., "Information Technology"
      code: req.body.code, // e.g., "DEPT-IT"
      managerId: req.body.managerId ? new ObjectId(req.body.managerId) : null,
      budget: Number(req.body.budget),
    };

    // Validación básica inicial de campos obligatorios
    if (!department.name || !department.code) {
      return res
        .status(400)
        .json({ message: "Name and Code are required fields." });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection("departments")
      .insertOne(department);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json({
          message: "Some error occurred while creating the department.",
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating department", error: error.message });
  }
};

// PUT - Actualizar departamento existente
const updateDepartment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Must use a valid department ID." });
    }
    const departmentId = new ObjectId(req.params.id);
    const department = {
      name: req.body.name,
      code: req.body.code,
      managerId: req.body.managerId ? new ObjectId(req.body.managerId) : null,
      budget: Number(req.body.budget),
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("departments")
      .replaceOne({ _id: departmentId }, department);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: "Department not found or no changes made." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating department", error: error.message });
  }
};

// DELETE - Eliminar departamento
const deleteDepartment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Must use a valid department ID." });
    }
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("departments")
      .deleteOne({ _id: departmentId });
    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Department not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting department", error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
