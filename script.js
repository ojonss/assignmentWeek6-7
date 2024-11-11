const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const listenPort = 3000;

// Middleware to parse JSON requests
app.use(express.json());

const dataFilePath = './data/industrial.json';
let data = [];

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (JavaScript, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to load data from the JSON file on startup
function loadData() {
    try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        data = JSON.parse(fileData) || [];
    } catch (error) {
        console.error('Error loading data file:', error);
        data = [];
    }
}

// Function to save data to the JSON file
function saveData() {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error saving data:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Load data on server start
loadData();

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET all items
app.get('/items', (req, res) => {
    res.json(data);
});

// GET a specific item by articleNumber
app.get('/item/:articleNumber', (req, res) => {
    const { articleNumber } = req.params;
    const item = data.find(item => item.articleNumber === articleNumber);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send("Item not found");
    }
});

// POST to create a new item
app.post('/item', async (req, res) => {
    const { name, articleNumber, price, description } = req.body;

    // Check if item with the same articleNumber exists
    if (data.some(item => item.articleNumber === articleNumber)) {
        return res.status(400).send('Item with this article number already exists');
    }

    const newItem = { name, articleNumber, price, description };
    data.push(newItem);

    try {
        await saveData();
        console.log(`Created item ${articleNumber}`);
        res.json(newItem);
    } catch (error) {
        res.status(500).send('Error saving data');
    }
});

// PUT to update an existing item
app.put('/item/:articleNumber', async (req, res) => {
    const { articleNumber } = req.params;
    const { name, price, description } = req.body;
    const item = data.find(item => item.articleNumber === articleNumber);

    if (!item) {
        return res.status(404).send('Item not found');
    }

    // Update item fields if provided
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;

    try {
        await saveData();
        console.log(`Updated item ${articleNumber}`);
        res.json(item);
    } catch (error) {
        res.status(500).send('Error updating data');
    }
});

// DELETE an item by article number
app.delete('/item/:articleNumber', async (req, res) => {
    const { articleNumber } = req.params;
    const index = data.findIndex(item => item.articleNumber === articleNumber);

    if (index === -1) {
        return res.status(404).send('Item not found');
    }

    data.splice(index, 1);

    try {
        await saveData();
        console.log(`Deleted item ${articleNumber}`);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting data');
    }
});

// Start the server
app.listen(listenPort, () => {
    console.log(`Server running on http://localhost:${listenPort}`);
});
