const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// =============================
// CONEXIÓN A MONGODB
// =============================

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("  Conectado a MongoDB"))
.catch(err => console.error("  Error MongoDB:", err));

// =============================
// SCHEMA MONGOOSE
// =============================

const terrenoSchema = new mongoose.Schema({}, {
    strict: false,
    collection: 'terrenos'
});

const Terreno = mongoose.model('Terreno', terrenoSchema);
// =============================
// MIDDLEWARE
// =============================

app.use(cors({
origin: 'https://geoprediobc.netlify.app',
methods: ['GET','POST']
}));

app.use(express.json());
app.use(express.static('../frontend'));



// =============================
// CONSULTAR POR IDPREDIO
// =============================

app.get('/api/consultar_idpredio/:codigo', async (req, res) => {

try {

const codigoBusqueda = req.params.codigo;
const codigoNumerico = parseInt(codigoBusqueda);

if (isNaN(codigoNumerico)) {
return res.status(400).json({
mensaje: "Código inválido"
});
}

console.log("Buscando IDPREDIO:", codigoNumerico);

const resultado = await Terreno.findOne({
"properties.IDPREDIO": codigoNumerico
});

console.log("Resultado: ", resultado);

if (!resultado) {

return res.status(404).json({
mensaje: "ID PREDIO no encontrado"
});

}

res.json(resultado);

} catch (error) {

console.error("Error:", error);

res.status(500).json({
mensaje: "Error en el servidor",
detalle: error.message
});

}

});

// =============================
// INICIAR SERVIDOR
// =============================

app.listen(PORT, () => {
console.log(`  Servidor GIS corriendo en http://localhost:${PORT}`);
});