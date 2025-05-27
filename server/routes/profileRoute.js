const express = require('express');
const router = express.Router();
const {
  createProfile,
  checkUsername,
  getCountries,
  getStates,
  getCities
} = require('../controllers/profileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/profile', upload.single('profilePhoto'), createProfile);
router.get('/check-username/:username', checkUsername);
router.get('/countries', getCountries);
router.get('/states/:country', getStates);
router.get('/cities/:state', getCities);

module.exports = router;
