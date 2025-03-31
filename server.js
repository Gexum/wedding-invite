const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const responsesFile = path.join(__dirname, 'responses.json');

// Читаем существующие ответы
const getResponses = () => {
    if (!fs.existsSync(responsesFile)) return [];
    const data = fs.readFileSync(responsesFile);
    return JSON.parse(data);
};

// Сохраняем ответы
const saveResponses = (responses) => {
    fs.writeFileSync(responsesFile, JSON.stringify(responses, null, 2));
};

app.post('/submit', (req, res) => {
    const { name, guests, phone } = req.body;
    if (!name || !guests || !phone) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    const responses = getResponses();
    responses.push({ name, guests, phone, date: new Date().toISOString() });
    saveResponses(responses);
    
    res.json({ message: 'Спасибо за подтверждение!' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
