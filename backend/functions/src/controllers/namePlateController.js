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

const deletePlate = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("plates").doc(id).delete();
    res.status(200).json({ message: "Placa removida com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover placa." });
  }
};


// =============================================================
// ▼▼▼ FUNÇÃO DE CARGA INICIAL (BULK ADD) ADICIONADA AQUI ▼▼▼
// =============================================================
const addItemsToCollections = async (req, res) => {
  const nameOptions = [
    "WELLINGTON", "ENIO", "DAVID", "JEFFERSON", "GUILHERME", "ROSSATO",
    "RICARDO", "PATRIC", "GELSON", "PAZETTI", "CLAIRTON", "FILIPE",
    "ALISSON", "RODRIGUES", "VITOR", "JAISSON", "RODRIGO",
  ];

  const allPlateOptions = [
    "VTR ITI-2G11", "VTR IZH-0I60", "VTR IZH-0I61", "VTR ITI-2601",
    "VTR JBG-5E41", "VTR IQK-6729", "VTR IRX-5961", "VTR JCA-3B44",
    "VTR IXL-7951", "VTR IUS-4224", "VTR IZF-9H01", "VTR IPS-0702",
    "VTR ITV-9121", "VTR JAN-8H35", "VTR JBD-9A35", "VTR JCG-2J65",
    "VTR ILS-6968", "MOTO JAU-1B04", "MOTO TQP-3D33", "MOTO JDO-3D71",
    "MOTO TQP-3D30", "MOTO JBS-2G79", "MOTO JAS-7B47", "MOTO EQR-6306",
    "MOTO IYW-6385", "MOTO IYW-6403"
  ];

  try {
    const namesCollection = db.collection('names');
    const platesCollection = db.collection('plates');

    const namePromises = nameOptions.map((name) => namesCollection.add({ name }));
    const platePromises = allPlateOptions.map((plate) => platesCollection.add({ plate }));

    await Promise.all([...namePromises, ...platePromises]);

    res.status(200).json({ message: "Itens adicionados com sucesso às coleções 'names' e 'plates'!" });
  } catch (error) {
    console.error("Erro ao adicionar itens:", error);
    res.status(500).json({ error: "Falha ao adicionar itens ao banco de dados." });
  }
};


// --- EXPORTS ---
module.exports = {
  getNames, addName, updateName, deleteName,
  getPlates, addPlate, updatePlate, deletePlate,
  addItemsToCollections, // <-- IMPORTANTE: ADICIONADO AQUI
};
