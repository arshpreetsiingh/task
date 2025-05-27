const express = require('express');
const router = express.Router();
const {
  createProfile,
  checkUsername,
  getCountries,
  getStates,
  getCities
} = require('../controllers/profileController');
const { upload } = require('../config/cloudinary');

// Replace multer upload with cloudinary upload
router.post('/profile', upload.single('profilePhoto'), createProfile);
router.get('/check-username', checkUsername);
router.get('/countries', getCountries);
router.get('/states/:country', getStates);
router.get('/cities/:state', getCities);

module.exports = router;