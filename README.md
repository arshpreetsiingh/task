# Frequent Research Fieldwork Solutions Pvt. Ltd

![Frequent Research Logo](https://i.imgur.com/aILJiQ6.png)

# Multi-Step User Profile Update Form

## Project Overview

This project is my submission for the Junior Developer (MERN) role assessment. It implements a multi-step user profile update form with frontend and backend validation, dynamic fields, file upload functionality, and real-time validation.

## Features Implemented

### Multi-Step Form Process

- Step 1: Personal Information
- Step 2: Professional Details
- Step 3: Location Information
- Summary page before final submission

### Form Validations (No third-party libraries)

- Frontend validation using custom JavaScript
- Backend validation using Node.js/Express
- Real-time feedback to users

### Dynamic Field Behavior

- Conditional field for gender (shows textbox when "Other" is selected)
- Show/Hide "Company Details" based on "Profession" selection
- Country/State/City dropdowns with dynamic population
- Reset address fields when country changes

### File Upload

- Profile picture upload with size restrictions (≤2MB)
- File type validation (JPG/PNG only)
- Live image preview
- Using Cloudinary

### Password Management

- Current password verification
- New password strength requirements (8+ chars, 1 special char, 1 number)
- Password strength meter with real-time feedback

### API Integration

- Username availability check
- Country/State/City data fetching
- Form data submission to MongoDB

## Technologies Used

### Frontend

- React.js for UI components
- CSS for styling
- Custom form validation logic

### Backend

- Node.js with Express
- MongoDB for data storage
- Mongoose for database interactions
- Multer for file uploads

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/multi-step-profile-form.git

# Navigate to project directory
cd multi-step-profile-form

# Install dependencies for backend
npm install

# Navigate to client directory
cd client

# Install dependencies for frontend
npm install

# Return to root directory
cd ..

# Run development server (both frontend and backend)
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME='Your cloud name'  
CLOUDINARY_API_KEY='Your Api key'
CLOUDINARY_API_SECRET='Your_Secret'
```

## API Endpoints

| Method | Endpoint                            | Description                 |
| ------ | ----------------------------------- | --------------------------- |
| GET    | /api/countries                      | Get all countries           |
| GET    | /api/states/:countryId              | Get states for a country    |
| GET    | /api/cities/:stateId                | Get cities for a state      |
| GET    | /api/users/check-username/:username | Check username availability |
| POST   | /api/users/profile                  | Submit user profile data    |
| POST   | /api/upload                         | Upload profile picture      |

## Live Demo

[View Live Demo](https://taskmultilevel.netlify.app/)

## GitHub Repository

[View Source Code](https://github.com/arshpreetsiingh/task)

---

Developed as part of the technical assessment for the Junior Developer (MERN) position.
