/********************************************************************************* 
* ITE5315 – Project 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Hitesh & Bhavdeep Student ID: N01610330 (Hitesh) & Bhavdeep ( N01546218 ) Date: 10 Dec 
*********************************************************************************/

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [{
        date: Date,
        grade: String,
        score: Number
    }],
    name: String,
    restaurant_id: String
});

let Restaurant;

module.exports = {
    initialize: function(connectionString) {
        return new Promise((resolve, reject) => {
            mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');
                console.log('Database connection successful');
                resolve();
            })
            .catch(err => {
                console.error('Database connection error:', err);
                reject(err);
            });
        });
    },

    addNewRestaurant: function(data) {
        const restaurant = new Restaurant(data);
        return restaurant.save();
    },

    getAllRestaurants: function(page, perPage, borough) {
        let query = {};
        if (borough) {
            query.borough = borough;
        }
        return Restaurant.find(query)
            .sort({ restaurant_id: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
    },

    getRestaurantById: function(id) {
        return Restaurant.findById(id).exec();
    },

    updateRestaurantById: function(data, id) {
        return Restaurant.findByIdAndUpdate(id, data, { 
            new: true,
            runValidators: true 
        }).exec();
    },

    deleteRestaurantById: function(id) {
        return Restaurant.findByIdAndDelete(id).exec();
    }
};