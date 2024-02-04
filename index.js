const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const boletinesDir = path.join(__dirname, 'boletines');

// Configuración para servir archivos estáticos (tus boletines oficiales)
app.use('/boletines', express.static(boletinesDir));

// Ruta para obtener la lista de boletines
app.get('/boletines', (req, res) => {
    // Verifica si la solicitud acepta JSON
    if (req.accepts('json')) {
        // Si la solicitud acepta JSON, devuelve la lista de boletines como JSON
        fs.readdir(boletinesDir, (err, archivos) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al recuperar la lista de boletines' });
                return;
            }
            res.json({ boletines: archivos });
        });
    } else {
        // Si no acepta JSON, devuelve una página HTML (puedes personalizar según tus necesidades)
        res.send('<html><head><title>Boletines Oficiales</title></head><body><h1>Boletines Oficiales</h1><p>Esta es una página HTML de boletines oficiales.</p></body></html>');
    }
});

// Ruta para mostrar un boletín PDF específico
app.get('/boletines/:nombreBoletin', (req, res) => {
    const nombreBoletin = req.params.nombreBoletin;
    const rutaBoletin = path.join(boletinesDir, nombreBoletin);

    fs.access(rutaBoletin, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Boletín no encontrado');
            return;
        }

        // Construye la URL del visor de PDF.js
        const pdfViewerURL = `/pdfjs/web/viewer.html?file=${encodeURIComponent(`/boletines/${nombreBoletin}`)}`;

        // Crea el código HTML con la etiqueta <embed>
        const embedCode = `<embed src="${pdfViewerURL}" type="application/pdf" width="100%" height="600px" />`;

        // Envía el código HTML como respuesta
        res.send(embedCode);
    });
});

// Iniciar el servidor en el puerto 3000
const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
