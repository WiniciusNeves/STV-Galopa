const express = require("express");
const multer = require("multer");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");
const checklistController = require("../controllers/checklistController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticate, upload.array("fotos"), checklistController.createChecklist);
router.get("/", authenticate, isAdmin, checklistController.getAllChecklists);
router.get("/:id", authenticate, isAdmin, checklistController.getChecklistById);
router.put("/:id", authenticate, isAdmin, checklistController.updateChecklist);
router.delete("/:id", authenticate, isAdmin, checklistController.deleteChecklist);

module.exports = router;

