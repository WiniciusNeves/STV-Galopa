const admin = require("../config/firebase");

// Criar usuário
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }
  try {
    const user = await admin.auth().createUser({ email, password });

    if (role) {
      await admin.auth().setCustomUserClaims(user.uid, { role });
    }

    const token = await admin.auth().createCustomToken(user.uid);

    res.status(201).json({
      message: "Usuário criado!",
      uid: user.uid,
      role: role || "user",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erro ao criar usuário." });
  }
};

// Listar usuários
exports.listUsers = async (req, res) => {
  try {
    const list = await admin.auth().listUsers();
    const users = list.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || "user"
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erro ao listar usuários." });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório." });
  }

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: "Usuário deletado!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erro ao deletar usuário." });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  const { uid, email, password } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório." });
  }

  try {
    await admin.auth().updateUser(uid, { email, password });
    res.status(200).json({ message: "Usuário atualizado!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erro ao atualizar usuário." });
  }
};

// Setar role
exports.setAdminRole = async (req, res) => {
  const { uid, role } = req.body;

  if (!uid || !role) {
    return res.status(400).json({ error: "UID e role são obrigatórios." });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.status(200).json({ message: `Role '${role}' atribuída com sucesso.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erro ao definir role." });
  }
};
