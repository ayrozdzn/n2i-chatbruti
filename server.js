const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/ask', async (req, res) => {
    const referer = req.get('referer') || req.get('origin');
    const host = req.get('host');

    if (!referer || !referer.includes(host)) {
        return res.status(403).json({
            success: false,
            error: 'Accès interdit. Cette route est réservée aux requêtes internes.'
        });
    }

    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Aucun message fourni.'
        });
    }

    const apiUrl = 'https://n2i-backend-chatbot.tbreton.fr/llm/gemini';

    const headers = {
        'x-secret-key': SECRET_KEY,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à Gemini:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
