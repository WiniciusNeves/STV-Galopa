const admin = require("../config/firebase");

const db = admin.firestore();

exports.createChecklist = async (req, res) => {
  try {
    const { area, nome, placa, quilometragem, observacoes } = req.body;
    const files = req.files || [];

    const fotoUrls = [];

    for (const file of files) {
      const bucket = admin.storage().bucket();
      const fileName = `checklists/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      fotoUrls.push(url);
    }

    const checklistData = {
      area,
      nome,
      placa,
      quilometragem,
      observacoes,
      fotos: fotoUrls,
      createdAt: new Date(),
    };

    await admin.firestore().collection('checklists').add(checklistData);

    return res.status(201).json({
      message: "Checklist criado com sucesso!",
      data: checklistData,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar checklist.' });
  }
};

exports.getAllChecklists = async (req, res) => {
  try {
    const checklists = await db.collection("checklists").get();
    const data = checklists.docs.map((doc) => doc.data());
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
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

    res.status(200).json(checklist.data());
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter checklist." });
  }
};

exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { area, nome, placa, quilometragem, observacoes } = req.body;
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
      observacoes,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Checklist atualizado com sucesso!" });
  }
  catch (error) {
    console.error(error);
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
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar checklist." });
  }
};

