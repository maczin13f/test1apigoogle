const mongoose = require("mongoose");

async function conectarMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority");
    console.log("🟢 MongoDB conectado com sucesso!");
  } catch (erro) {
    console.error("🔴 Erro ao conectar no MongoDB:", erro);
  }
}

module.exports = conectarMongoDB;
