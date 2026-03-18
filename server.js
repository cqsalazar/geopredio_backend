const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
// const { MongoClient } = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI);

app.use(cors({
    origin: 'https://geoprediobc.netlify.app/', // o la URL de tu frontend
    methods: ['GET','POST']
}));

// Configuración de MongoDB
const url = process.env.MONGODB_URI;
const dbName = 'geopredio';
const collectionName = 'terrenos';

app.use(express.json());
app.use(express.static('../frontend')); // Archivos estáticos

// Endpoint para consultar por ID PREDIO
app.get('/api/consultar_idpredio/:codigo', async (req, res) => {
    try {
        const codigoBusqueda = req.params.codigo;
        const codigoNumerico = parseInt(codigoBusqueda);
        if (isNaN(codigoNumerico)) {
            return res.status(400).json({
 mensaje: "Código inválido"
 });
 }
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const query = {
            "properties.IDPREDIO": codigoNumerico
 };
        console.log("Buscando:", query);
        const resultado = await collection.findOne(query);
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


app.listen(PORT, () => {
    console.log(`Servidor GIS corriendo en http://localhost:${PORT}`);
});