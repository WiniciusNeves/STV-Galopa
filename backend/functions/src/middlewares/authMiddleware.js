const admin = require("../config/firebase");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token decodificado:", decodedToken); // Adicione isto
    req.user = {
      uid: decodedToken.uid,
      role: decodedToken.role || decodedToken.customClaims?.role || null,
    };
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ error: "Token inválido." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }
};

module.exports = { authenticate, isAdmin };
