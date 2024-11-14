const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const listenPort = 3000;
const dataFilePath = './data/industrial.json';
const orderFilePath = './data/order.json';
let data = [];
let orders = [];

app.use(express.json());
//grant program access to root files
app.use(express.static(path.join(__dirname)));

// home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Load and save functions for industrial.json
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

// Load and save functions for order.json
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
        fs.writeFile(orderFilePath, JSON.stringify(orders, null, 2), (err) => { //saves orders with indentation 2
            if (err) {
                console.error('Error saving orders:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// loads .json files on start
loadData();
loadOrders();

// Item-related endpoints
app.get('/items', (req, res) => {
    res.json(data);
});

app.get('/item/:articleNumber', (req, res) => {
    const { articleNumber } = req.params;
    const item = data.find(item => item.articleNumber === articleNumber);
    if (item) {
        res.json(item);
    } else {
        res.send("Item not found");
    }
});

app.post('/item', async (req, res) => {
    const { name, articleNumber, price, description } = req.body;

    if (data.some(item => item.articleNumber === articleNumber)) {
        return res.send('Item with this article number already exists');
    }

    const newItem = { name, articleNumber, price, description };
    data.push(newItem);

    try {
        await saveData();
        console.log(`Created item ${articleNumber}`);
        res.json(newItem);
    } catch (error) {
        res.send('Error saving data');
    }
});

app.put('/item/:articleNumber', async (req, res) => {
    const { articleNumber } = req.params;
    const { name, price, description } = req.body;
    const item = data.find(item => item.articleNumber === articleNumber);

    if (!item) {
        return res.send('Item not found');
    }

    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;

    try {
        await saveData();
        console.log(`Updated item ${articleNumber}`);
        res.json(item);
    } catch (error) {
        res.send('Error updating data');
    }
});

app.delete('/item/:articleNumber', async (req, res) => {
    const { articleNumber } = req.params;
    const index = data.findIndex(item => item.articleNumber === articleNumber);

    if (index === -1) {
        return res.send('Item not found');
    }

    data.splice(index, 1);

    try {
        await saveData();
        console.log(`Deleted item ${articleNumber}`);
        res.send();
    } catch (error) {
        res.send('Error deleting data');
    }
});

// Order-related endpoints
app.post('/order', async (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.send('Order must contain items');
    }

    const orderItems = [];
    for (const { articleNumber, quantity } of items) {
        const item = data.find(item => item.articleNumber === articleNumber);
        if (!item) return res.send(`Item with article number ${articleNumber} not found`);
        if (!quantity || quantity <= 0) return res.send('Quantity must be greater than zero');
        orderItems.push({ articleNumber, quantity });
    }

    // saving to order.json
    const newOrder = { id: orders.length + 1, items: orderItems };
    orders.push(newOrder);
    try {
        await saveOrders();
        console.log(`Created order ${newOrder.id}`);
        res.json(newOrder);
    } catch (error) {
        res.send('Error saving order');
    }
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.get('/order/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id, 10));
    if (order) res.json(order);
    else res.send("Order not found");
});

// Start
app.listen(listenPort, () => {
    console.log(`Server running on http://localhost:${listenPort}`);
});
