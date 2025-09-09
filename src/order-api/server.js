const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JSON database file
const DB_FILE = path.join(__dirname, 'orders.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [] }, null, 2));
}

// Helper function to read orders
const readOrders = () => {
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data).orders;
};

// Helper function to write orders
const writeOrders = (orders) => {
    fs.writeFileSync(DB_FILE, JSON.stringify({ orders }, null, 2));
};

// Discord Webhook Integration
const sendToDiscord = async (order) => {
    if (!process.env.DISCORD_WEBHOOK_URL) {
        console.log('No Discord webhook URL provided. Skipping notification.');
        return;
    }

    try {
        const embed = {
            title: 'New Order Created',
            color: 0x00ff00,
            fields: [
                { name: 'Order ID', value: order.orderId, inline: true },
                { name: 'Name', value: order.orderName, inline: true },
                { name: 'Category', value: order.orderCategory, inline: true },
                { name: 'Price', value: `$${order.orderPrice}`, inline: true },
                { name: 'Timestamp', value: new Date(order.createdAt).toLocaleString() }
            ],
            timestamp: new Date()
        };

        await axios.post(process.env.DISCORD_WEBHOOK_URL, {
            embeds: [embed]
        });
    } catch (error) {
        console.error('Error sending to Discord:', error.message);
    }
};

// API Endpoints

// Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { orderId, orderName, orderCategory, orderPrice } = req.body;

        // Validate input
        if (!orderId || !orderName || !orderCategory || !orderPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const orders = readOrders();

        // Check if order ID already exists
        if (orders.some(order => order.orderId === orderId)) {
            return res.status(400).json({ error: 'Order ID already exists' });
        }

        const newOrder = {
            orderId,
            orderName,
            orderCategory,
            orderPrice: parseFloat(orderPrice),
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        writeOrders(orders);

        // Send to Discord webhook
        await sendToDiscord(newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all orders
app.get('/api/orders', (req, res) => {
    try {
        const orders = readOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search for an order by ID
app.get('/api/orders/search', (req, res) => {
    try {
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const orders = readOrders();
        const order = orders.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
    try {
        const { id } = req.params;
        const orders = readOrders();
        const order = orders.find(o => o.orderId === id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});