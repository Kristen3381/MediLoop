# Healthcare Referral and Feedback System Backend

A production-ready backend for a healthcare referral system with role-based access control and feedback mechanisms.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a cloud URI)

### Installation
1. Navigate to the project directory:
   ```bash
   cd healthcare-referral-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare_referral
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the server:
   ```bash
   node server.js
   ```

---

## 🔐 API Documentation (Postman-ready Examples)

### Authentication

#### Register a new user
**POST** `/auth/register`
```json
{
  "name": "Dr. Smith",
  "email": "smith@hospital.com",
  "password": "password123",
  "role": "DOCTOR",
  "facilityName": "General Hospital"
}
```

#### Login
**POST** `/auth/login`
```json
{
  "email": "smith@hospital.com",
  "password": "password123"
}
```

---

### Referrals (Requires Bearer Token)

#### Create a Referral
**POST** `/referrals`
```json
{
  "patientName": "John Doe",
  "condition": "Acute Appendicitis",
  "urgency": "HIGH",
  "toFacility": "General Hospital"
}
```

#### Get All Referrals
**GET** `/referrals`

#### Make Decision (Accept/Reject)
**PATCH** `/referrals/:id/decision`
```json
{
  "status": "ACCEPTED"
}
```

#### Update Status
**PATCH** `/referrals/:id/status`
```json
{
  "status": "ARRIVED"
}
```

#### Add Feedback
**POST** `/referrals/:id/feedback`
```json
{
  "diagnosis": "Appendicitis confirmed",
  "treatment": "Surgery performed",
  "outcome": "Successful recovery"
}
```

#### Get Metrics
**GET** `/referrals/:id/metrics`
```json
{
  "timeToAccept": 15.5,
  "timeToTreatment": 45.2
}
```

## 🧱 Project Structure
- `controllers/`: Request handling logic
- `models/`: Mongoose schemas (User, Referral, Feedback)
- `routes/`: API endpoint definitions
- `middleware/`: Auth and Role-based access control
- `config/`: Configuration files
- `utils/`: Utility functions
