const UserProfile = require('../model/userProfile');
const Location = require('../model/location');
const { cloudinary } = require('../config/cloudinary');

exports.createProfile = async (req, res) => {
  try {
    // Extract all fields from the form data
    const {
      fullName,
      username,
      dateOfBirth,
      gender,
      customGender,
      currentPassword,
      newPassword,
      profession,
      companyName,
      companySize,
      industry,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter
    } = req.body;

    // Get the Cloudinary path if a file was uploaded
    const profilePhoto = req.file ? req.file.path : '';

    // Create user profile object with all fields
    const user = new UserProfile({
      fullName,
      username,
      dateOfBirth,
      gender,
      customGender,
      currentPassword,
      newPassword,
      profession,
      companyName,
      companySize,
      industry,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter: newsletter === 'true', // Convert string to boolean
      profilePhoto
    });

    // Save the user profile to the database
    const savedProfile = await user.save();
    
    // Return success response with the created profile
    res.status(201).json({ 
      message: 'Profile created successfully',
      profile: {
        id: savedProfile._id,
        username: savedProfile.username,
        profilePhoto: savedProfile.profilePhoto
      }
    });
  } catch (err) {
    console.error('Error creating profile:', err);
    
    // Handle unique constraint violations (e.g., duplicate username)
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate information detected',
        field: Object.keys(err.keyPattern)[0]
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      
      return res.status(400).json({
        error: 'Validation failed',
        validationErrors
      });
    }
    
    // Generic error response
    res.status(500).json({ error: err.message });
  }
};

// Check if username is available
exports.checkUsername = async (req, res) => {
  try {
    const username = req.query.username;
    
    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' });
    }
    
    const user = await UserProfile.findOne({ username });
    res.json({ available: !user });
  } catch (err) {
    console.error('Error checking username:', err);
    res.status(500).json({ error: 'Failed to check username availability' });
  }
};

// Get countries, states, and cities from the Location model
exports.getCountries = async (req, res) => {
  try {
    const locations = await Location.find({}, 'country');
    res.json(locations.map(loc => loc.country));
  } catch (err) {
    console.error('Error fetching countries:', err);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

exports.getStates = async (req, res) => {
  try {
    const { country } = req.params;
    
    if (!country) {
      return res.status(400).json({ error: 'Country parameter is required' });
    }
    
    const location = await Location.findOne({ country });
    
    if (!location) {
      return res.json([]);
    }
    
    res.json(location.states.map(state => state.name));
  } catch (err) {
    console.error('Error fetching states:', err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
};

exports.getCities = async (req, res) => {
  try {
    const { state } = req.params;
    
    if (!state) {
      return res.status(400).json({ error: 'State parameter is required' });
    }
    
    const location = await Location.findOne({ 'states.name': state });
    
    if (!location) {
      return res.json([]);
    }
    
    const stateData = location.states.find(s => s.name === state);
    res.json(stateData ? stateData.cities : []);
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};