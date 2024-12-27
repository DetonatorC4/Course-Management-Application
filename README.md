# Course Management Application

A Node.js application for managing courses with user and admin roles.

## Features

### Admin

- Sign up, Sign in
- Create, update, and view courses

### User

- Sign up, Sign in
- Purchase and view purchased courses

### Public

- View all available courses

## Tech Stack

- **Backend:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Validation:** Zod
- **Password Security:** bcrypt

## Setup

1. Clone the repository.
   ```bash
   git clone https://github.com/DetonatorC4/Course-Management-Application.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` with:
   ```env
   JWT_USER_PASSWORD=<your_secret>
   JWT_ADMIN_PASSWORD=<your_secret>
   MONGO_URI=<your_mongo_uri>
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## API Endpoints

### Admin

- `POST /api/v1/admin/signup`
- `POST /api/v1/admin/signin`
- `POST /api/v1/admin/course`
- `PUT /api/v1/admin/course`
- `GET /api/v1/admin/course/bulk`

### User

- `POST /api/v1/user/signup`
- `POST /api/v1/user/signin`
- `GET /api/v1/user/purchases`

### Public

- `POST /api/v1/course/purchase`
- `GET /api/v1/course/preview`

Feel free to contribute!
