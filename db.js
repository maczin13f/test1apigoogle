const mongoose = require("mongoose");

async function conectarMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://felipeapi:felipe2503@testgoogleapi.o6wmra8.mongodb.net/?retryWrites=true&w=majority&appName=testgoogleapi");
    console.log("🟢 MongoDB conectado com sucesso!");
  } catch (erro) {
    console.error("🔴 Erro ao conectar no MongoDB:", erro);
  }
}

module.exports = conectarMongoDB;
