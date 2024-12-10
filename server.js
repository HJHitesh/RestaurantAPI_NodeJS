/********************************************************************************* 
* ITE5315 – Project 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Hitesh & Bhavdeep Student ID: N01610330 (Hitesh) & Bhavdeep ( N01546218 ) Date: 10 Dec 
*********************************************************************************/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route for testing
app.get('/', (req, res) => {
    res.json({ message: "Restaurant API - ITE5315 Project" });
});

// POST /api/restaurants
app.post('/api/restaurants', async (req, res) => {
    try {
        const newRestaurant = await db.addNewRestaurant(req.body);
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/restaurants with pagination and borough filter
app.get('/api/restaurants', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 5;
        const borough = req.query.borough;
        
        const restaurants = await db.getAllRestaurants(page, perPage, borough);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/restaurants/:id
app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await db.getRestaurantById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/restaurants/:id', async (req, res) => {
    try {
        const result = await db.updateRestaurantById(req.body, req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ message: "Restaurant updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/restaurants/:id', async (req, res) => {
    try {
        const result = await db.deleteRestaurantById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}


db.initialize(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });