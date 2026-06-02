const router = require("express").Router();
const departmentsController = require("../controllers/departments");

router.get("/", departmentsController.getAll);
router.get("/:id", departmentsController.getSingle);
router.post("/", departmentsController.createDepartment);
router.put("/:id", departmentsController.updateDepartment);
router.delete("/:id", departmentsController.deleteDepartment);

module.exports = router;
