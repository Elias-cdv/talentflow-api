const mongodb = require("../config/db");
const { ObjectId } = require("mongodb");

// GET - Obtener todos los empleados
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("employees").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving employees", error: error.message });
  }
};

// GET - Obtener un empleado por ID
const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Must use a valid employee ID." });
    }
    const employeeId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("employees")
      .find({ _id: employeeId });
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        return res.status(404).json({ message: "Employee not found." });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving employee", error: error.message });
  }
};

// POST - Crear un empleado (Estructura de 11 campos de tu propuesta)
const createEmployee = async (req, res) => {
  try {
    const employee = {
      oauthId: req.body.oauthId || null,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      hireDate: req.body.hireDate ? new Date(req.body.hireDate) : new Date(),
      departmentId: req.body.departmentId
        ? new ObjectId(req.body.departmentId)
        : null,
      jobTitle: req.body.jobTitle,
      salary: Number(req.body.salary),
      status: req.body.status || "Active",
    };

    if (!employee.firstName || !employee.lastName || !employee.email) {
      return res
        .status(400)
        .json({ message: "First name, last name, and email are required." });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection("employees")
      .insertOne(employee);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the employee." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: error.message });
  }
};

// PUT - Actualizar un empleado
const updateEmployee = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Must use a valid employee ID." });
    }
    const employeeId = new ObjectId(req.params.id);
    const employee = {
      oauthId: req.body.oauthId || null,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      hireDate: req.body.hireDate ? new Date(req.body.hireDate) : new Date(),
      departmentId: req.body.departmentId
        ? new ObjectId(req.body.departmentId)
        : null,
      jobTitle: req.body.jobTitle,
      salary: Number(req.body.salary),
      status: req.body.status || "Active",
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("employees")
      .replaceOne({ _id: employeeId }, employee);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: "Employee not found or no changes made." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

// DELETE - Eliminación segura (Cambio de estado a "Terminated" según tu propuesta)
const deleteEmployee = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Must use a valid employee ID." });
    }
    const employeeId = new ObjectId(req.params.id);

    // En lugar de un borrado físico, actualizamos el estado a "Terminated" para cuidar la historia legal
    const response = await mongodb
      .getDb()
      .db()
      .collection("employees")
      .updateOne({ _id: employeeId }, { $set: { status: "Terminated" } });

    if (response.modifiedCount > 0) {
      res
        .status(200)
        .json({
          message: "Employee status successfully updated to Terminated.",
        });
    } else {
      res
        .status(404)
        .json({ message: "Employee not found or already terminated." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error terminating employee", error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
