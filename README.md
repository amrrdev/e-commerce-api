# E-Commerce API

## Overview

The E-Commerce API is a robust and scalable backend solution designed for managing an online store. Built with Node.js, Express, and MongoDB, this API provides a comprehensive suite of features required to operate a modern e-commerce platform. It handles user authentication, product management, order processing, and review systems, making it a powerful tool for both developers and businesses looking to build or integrate an online shopping system.

## Key Features

### User Authentication and Authorization

- Registration and Login: Users can create accounts and log in using secure JWT tokens. Passwords are hashed using bcrypt to ensure security.
  access control.
- Logout: Users can log out, invalidating their JWT tokens to prevent unauthorized access.

- Role-Based Access Control: Admins and regular users have different access levels, with admins having permissions to manage products and orders.

### Product Management

- CRUD Operations: Admins can create, update, and delete products.

- Public Product Access: Users can browse products and view individual product details. This is achieved through GET requests to relevant endpoints.

### Review System

- User Reviews: Users can submit, update, and delete reviews for products they have purchased. Each review is linked to both the user and the product.

- Review Management: Admins have oversight over reviews, with the ability to manage and moderate content as needed.

### Order Processing

- Order Creation: Users can place orders, specifying products and quantities. Orders are processed and stored in the database.

- Order History: Users can view their past orders, while admins have access to all order details, enabling them to manage and update order statuses.

### Security Features

- Rate Limiting: Protects the API from abuse by limiting the number of requests a user can make in a given time period.
- Helmet: Adds security headers to prevent common vulnerabilities.
- XSS Protection: Sanitizes user input to prevent cross-site scripting attacks.

## Endpoints

### Auth

- GET /api/v1/logout
- POST /api/v1/login
- POST /api/v1/register

### User

- GET /api/v1/users
- POST /api/v1/users
- GET /api/v1/users/:id
- GET /api/v1/me
- PATCH /api/v1/users/:id
- PATCH /api/v1/users/:id/password

### Order

- POST /api/v1/orders
- GET /api/v1/orders
- PATCH /api/v1/orders/:id
- GET /api/v1/my-orders
- GET /api/v1/orders/:id

### Product

- GET /api/v1/products
- GET /api/v1/products/:productId
- POST /api/v1/products
- POST /api/v1/products/:productId/image
- PATCH /api/v1/products/:productId
- DELETE /api/v1/products/:productId
- GET /api/v1/products/:productId/reviews

### Review

- GET /api/v1/reviews
- GET /api/v1/reviews/:reviewId
- POST /api/v1/reviews
- PATCH /api/v1/reviews/:reviewId
- DELETE /api/v1/reviews/:reviewId
- GET /api/v1/new-requests

### Packages and Libraries

- Express
- Mongoose
- JWT
- Bcrypt
- Morgan
- Validator
- Helmet
- Express-rate-limiter
- XSS-clean
- Express-mongo-sanitize

## Project Setup

To get started with the project, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
```

### Install Dependencies

```node
npm install
```

### Setup Environment Variables

Create a .env file in the root directory and add the following environment variables:w

```node
MONGO_URL=<Your MongoDB Connection String>
JWT_SECRET=jwtSecret
JWT_LIFETIME=1d
```

### Start the Server

```node
npm start
```

By default, the server will run on port 5000.

### Project Structure

```node
├── controllers
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── userController.js
├── middlewares
│   ├── authentication.js
│   ├── globalErrorHandler.js
│   └── notFoundHandler.js
├── mockData
├── model
│   ├── aggregation.js
│   ├── OrderModel.js
│   └── ProductModel.js
│   └── ReviewModel.js
│   └── UserModel.js
├── routers
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
├── utils
│   ├── appError.js
│   ├── catchAsync.js
│   └── jwtUtils.js
└── app.js
└── server.jss
```

### Getting Started

To test the API locally, you can use Postman or any other API testing tool. The API provides endpoints for user authentication, product management, reviews, and orders.

### Contributing

Feel free to submit issues or pull requests if you find any bugs or have ideas for improvements.

### License

This project is licensed under the MIT License.
