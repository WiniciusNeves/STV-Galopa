// Arquivo do Backend (ex: /controllers/namePlateController.js)
const admin = require("../config/firebase");
const db = admin.firestore();

// --- NAMES ---

const getNames = async (req, res) => {
  try {
    const snapshot = await db.collection("names").get();
    const names = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar nomes." });
  }
};

const addName = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }
  try {
    const existing = await db.collection("names").where("name", "==", name).get();
    if (!existing.empty) {
      return res.status(400).json({ error: "Nome já existe." });
    }
    const docRef = await db.collection("names").add({
      name,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id, name });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar nome." });
  }
};

// CORRIGIDO: Usa o ID do documento para atualizar
const updateName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const docRef = db.collection("names").doc(id);
    await docRef.update({ name });
    res.status(200).json({ message: "Nome atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar nome." });
  }
};

// CORRIGIDO: Usa o ID do documento para deletar
const deleteName = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("names").doc(id).delete();
    res.status(200).json({ message: "Nome removido com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover nome." });
  }
};


// --- PLATES ---

const getPlates = async (req, res) => {
  try {
    const snapshot = await db.collection("plates").get();
    // Envia o objeto completo, incluindo o ID
    const plates = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(plates);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar placas." });
  }
};

const addPlate = async (req, res) => {
  const { plate } = req.body;
  if (!plate) {
    return res.status(400).json({ error: "Placa é obrigatória." });
  }
  try {
    const existing = await db.collection("plates").where("plate", "==", plate).get();
    if (!existing.empty) {
      return res.status(400).json({ error: "Placa já existe." });
    }
    const docRef = await db.collection("plates").add({
      plate,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id, plate });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar placa." });
  }
};

// NOVO: Função para atualizar a placa usando o ID
const updatePlate = async (req, res) => {
  const { id } = req.params;
  const { plate } = req.body;
  try {
    const docRef = db.collection("plates").doc(id);
    await docRef.update({ plate });
    res.status(200).json({ message: "Placa atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar placa." });
  }
};

// CORRIGIDO: Usa o ID do documento para deletar
const deletePlate = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("plates").doc(id).delete();
    res.status(200).json({ message: "Placa removida com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover placa." });
  }
};

module.exports = {
  getNames, addName, updateName, deleteName,
  getPlates, addPlate, updatePlate, deletePlate,
};
