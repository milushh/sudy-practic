const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const dataFilePath = path.join(__dirname, 'data.json');
const keywords = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../client')));

app.get('/urls', (req, res) => {
    const keyword = req.query.keyword;
    if (keywords[keyword]) {
        res.json(keywords[keyword]);
    } else {
        res.status(404).json({ error: 'Keyword not found' });
    }
});

app.get('/download', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.json({ content: response.data.toString('base64') });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download content' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});