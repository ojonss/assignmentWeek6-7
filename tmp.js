const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const listenPort = 3000;
const dataFilePath = './data/industrial.json';
const orderFilePath = './data/order.json';
let data = [];
let orders = [];

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Load and save functions for items
function loadData() {
    try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        data = JSON.parse(fileData) || [];
    } catch (error) {
        console.error('Error loading data file:', error);
        data = [];
    }
}

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

// Load and save functions for orders
function loadOrders() {
    try {
        const fileData = fs.readFileSync(orderFilePath, 'utf8');
        orders = JSON.parse(fileData) || [];
    } catch (error) {
        console.error('Error loading order file:', error);
        orders = [];
    }
}

function saveOrders() {
    return new Promise((resolve, reject) => {
        fs.writeFile(orderFilePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                console.error('Error saving orders:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Load data and orders on server start
loadData();
loadOrders();

// Item-related endpoints (existing functionality here)

// Order-related endpoints
app.post('/order', async (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).send('Order must contain items');
    }

    const orderItems = [];
    for (const { articleNumber, quantity } of items) {
        const item = data.find(item => item.articleNumber === articleNumber);
        if (!item) return res.status(404).send(`Item with article number ${articleNumber} not found`);
        if (!quantity || quantity <= 0) return res.status(400).send('Quantity must be greater than zero');
        orderItems.push({ articleNumber, quantity });
    }

    const newOrder = { id: orders.length + 1, timestamp: new Date().toISOString(), items: orderItems };
    orders.push(newOrder);
    try {
        await saveOrders();
        console.log(`Created order ${newOrder.id}`);
        res.json(newOrder);
    } catch (error) {
        res.status(500).send('Error saving order');
    }
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.get('/order/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id, 10));
    if (order) res.json(order);
    else res.status(404).send("Order not found");
});

// Start the server
app.listen(listenPort, () => {
    console.log(`Server running on http://localhost:${listenPort}`);
});
