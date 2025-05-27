const UserProfile = require('../model/userProfile');
const Location = require('../model/location');

exports.createProfile = async (req, res) => {
  try {
    const {
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter
    } = req.body;

    const profilePhoto = req.file ? req.file.path : '';

    const user = new UserProfile({
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter,
      profilePhoto
    });

    await user.save();
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if username is available
exports.checkUsername = async (req, res) => {
  const user = await UserProfile.findOne({ username: req.params.username });
  if (user) return res.json({ available: false });
  res.json({ available: true });
};

// Get countries, states, and cities from the Location model
exports.getCountries = async (req, res) => {
  const locations = await Location.find({}, 'country');
  res.json(locations.map(loc => loc.country));
};

exports.getStates = async (req, res) => {
  const location = await Location.findOne({ country: req.params.country });
  res.json(location ? location.states.map(state => state.name) : []);
};

exports.getCities = async (req, res) => {
  const location = await Location.findOne({ 'states.name': req.params.state });
  const state = location?.states.find(s => s.name === req.params.state);
  res.json(state ? state.cities : []);
};
