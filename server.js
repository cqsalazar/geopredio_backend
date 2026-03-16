const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de MongoDB
const url = process.env.MONGODB_URI;
const dbName = 'geopredio';
const collectionName = 'terrenos';

app.use(express.json());
app.use(express.static('../frontend')); // Archivos estáticos

// Endpoint para consultar por ID PREDIO
app.get('/api/consultar/:codigo', async (req, res) => {
    const client = new MongoClient(url);
    const codigoBusqueda = req.params.codigo;

    const codigoNumerico = parseInt(codigoBusqueda);

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const query = { "properties.IDPREDIO": codigoNumerico };
        console.log("Buscando con la query:", JSON.stringify(query));
        
        const resultado = await collection.findOne(query);

        if (resultado) {
            console.log("Registro encontrado para:", codigoBusqueda);
            res.json(resultado);
        } else {
            console.log("No se encontró ningún registro para el código:", codigoBusqueda);
            res.status(404).send({ mensaje: "ID PREDIO no encontrado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            mensaje: "Error en el servidor",
            error_detalle: error.message
         });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor GIS corriendo en http://localhost:${PORT}`);
});