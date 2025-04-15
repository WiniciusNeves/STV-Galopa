const express = require("express");
const { createUser, listUsers, deleteUser, updateUser, setAdminRole } = require("../controllers/userController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.get("/", authenticate, isAdmin, listUsers);
router.delete("/:uid", authenticate, isAdmin, deleteUser);
router.put("/", authenticate, isAdmin, updateUser);
router.post("/setRole", authenticate, isAdmin, setAdminRole);

module.exports = router;
