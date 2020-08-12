const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const uploadController = require('../controllers/upload');

let routes = app => {
	router.get('/', homeController.home);

	router.post('/multiple-upload', 
		uploadController.uploadImages,
		uploadController.resizeImages,
		uploadController.getResult 
	);

	return app.use('/', router);
};

module.exports = routes;


