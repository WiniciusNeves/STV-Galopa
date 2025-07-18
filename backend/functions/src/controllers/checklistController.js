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
      nivelOleo,
      pneus,
      temEstepe,
      relacaoTransmissao,
      temBau,
      descricao,
      fotos = [],
      type,
      sector,
      vehicleCategory,
      temDocumento,
      temCartaoCombustivel,
      statusRecebimentoEntrega,
    } = req.body;

    if (!sector || !nome || !placa || !vehicleCategory || !statusRecebimentoEntrega) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes: Setor, Nome, Placa, Tipo de Veículo e Status de Recebimento/Entrega." });
    }

    if (sector === "PRONTO ATENDIMENTO" && !area) {
      return res.status(400).json({ error: "Para o setor 'Pronto Atendimento', a Área é obrigatória." });
    }

    const hasSpareTire = ["true", true, "sim"].includes(temEstepe);
    const hasTrunk = ["true", true, "sim"].includes(temBau);
    const hasDocumento = ["true", true, "sim"].includes(temDocumento);
    const hasFuelCard = ["true", true, "sim"].includes(temCartaoCombustivel);

    const processedFotos = fotos.map((foto) => {
      if (foto && typeof foto.url === 'string' && typeof foto.tipo === 'string') {
        return { url: foto.url, tipo: foto.tipo };
      }
      return null;
    }).filter((foto) => foto !== null);

    const checklistData = {
      sector,
      area: area || null,
      nome,
      placa,
      quilometragem,
      nivelCombustivel,
      nivelOleo,
      pneus,
      descricao,
      fotos: processedFotos,
      type: type ? type.toLowerCase() : null,
      vehicleCategory,
      temDocumento: hasDocumento,
      temCartaoCombustivel: hasFuelCard,
      statusRecebimentoEntrega,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (type && type.toLowerCase() === "carro") {
      checklistData.temEstepe = hasSpareTire;
    } else if (type && type.toLowerCase() === "moto") {
      checklistData.relacaoTransmissao = relacaoTransmissao;
      checklistData.temBau = hasTrunk;
    }

    const docRef = await db.collection("checklists").add(checklistData);

    return res.status(201).json({
      message: "Checklist criado com sucesso!",
      data: { id: docRef.id, ...checklistData },
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
    const updateData = req.body;

    const checklistRef = db.collection("checklists").doc(id);
    const checklist = await checklistRef.get();

    if (!checklist.exists) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "temEstepe")) {
      updateData.temEstepe = ["true", true, "sim"].includes(updateData.temEstepe);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "temBau")) {
      updateData.temBau = ["true", true, "sim"].includes(updateData.temBau);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "temDocumento")) {
      updateData.temDocumento = ["true", true, "sim"].includes(updateData.temDocumento);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "temCartaoCombustivel")) {
      updateData.temCartaoCombustivel = ["true", true, "sim"].includes(updateData.temCartaoCombustivel);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "fotos")) {
      const incomingFotos = updateData.fotos || [];
      const processedFotos = incomingFotos.map((foto) => {
        if (foto && typeof foto.url === 'string' && typeof foto.tipo === 'string') {
          return { url: foto.url, tipo: foto.tipo };
        }
        return null;
      }).filter((foto) => foto !== null);
      updateData.fotos = processedFotos;
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await checklistRef.update(updateData);

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

