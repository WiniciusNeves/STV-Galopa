const admin = require("../config/firebase");
const db = admin.firestore();

exports.createChecklist = async (req, res) => {
  try {
    const {
      area,
      nome,
      placa,
      quilometragem,
      nivelCombustivel,
      pneus,
      temEstepe,
      descricao,
      fotos = [] // URLs das imagens já enviadas para o Firebase Storage
    } = req.body;

    if (!area || !nome || !placa) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const checklistData = {
      area,
      nome,
      placa,
      quilometragem,
      nivelCombustivel,
      pneus,
      temEstepe: ["true", true, "sim"].includes(temEstepe),
      descricao,
      fotos,
      createdAt: new Date(),
    };

    await db.collection("checklists").add(checklistData);

    return res.status(201).json({
      message: "Checklist criado com sucesso!",
      data: checklistData,
    });
  } catch (error) {
    console.error("Erro ao criar checklist:", error);
    return res.status(500).json({ error: "Erro ao criar checklist." });
  }
};

exports.getAllChecklists = async (req, res) => {
  try {
    const checklists = await db.collection("checklists")
      .orderBy("createdAt", "desc")
      .get();

    const data = checklists.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao obter checklists:", error);
    res.status(500).json({ error: "Erro ao obter checklists." });
  }
};

exports.getChecklistById = async (req, res) => {
  try {
    const { id } = req.params;
    const checklistRef = db.collection("checklists").doc(id);
    const checklist = await checklistRef.get();

    if (!checklist.exists) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }

    res.status(200).json({ id: checklist.id, ...checklist.data() });
  } catch (error) {
    console.error("Erro ao obter checklist:", error);
    res.status(500).json({ error: "Erro ao obter checklist." });
  }
};

exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      area,
      nome,
      placa,
      quilometragem,
      nivelCombustivel,
      pneus,
      temEstepe,
      descricao,
      fotos = []
    } = req.body;

    const checklistRef = db.collection("checklists").doc(id);
    const checklist = await checklistRef.get();

    if (!checklist.exists) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }

    await checklistRef.update({
      area,
      nome,
      placa,
      quilometragem,
      nivelCombustivel,
      pneus,
      temEstepe: ["true", true, "sim"].includes(temEstepe),
      descricao,
      fotos,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Checklist atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar checklist:", error);
    res.status(500).json({ error: "Erro ao atualizar checklist." });
  }
};

exports.deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const checklistRef = db.collection("checklists").doc(id);
    const checklist = await checklistRef.get();

    if (!checklist.exists) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }

    await checklistRef.delete();
    res.status(200).json({ message: "Checklist deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar checklist:", error);
    res.status(500).json({ error: "Erro ao deletar checklist." });
  }
};
