const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const UserRoutes = require("./src/router/userRoutes");
const ChecklistRoutes = require("./src/router/checklistRoutes");
const NomePlateRoutes = require("./src/router/namePlateRouter");


const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/checklists", ChecklistRoutes);
app.use("/nameplates", NomePlateRoutes);

exports.api = functions.https.onRequest(app);

