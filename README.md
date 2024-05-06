# Book Management API

This project is a simple yet powerful API for managing books. It allows users to register, log in, and perform various operations related to books, such as adding, filtering, and retrieving books. The API is built using Node.js, Express, and MongoDB, with authentication and authorization handled through JWT tokens.

## Getting Started

### Prerequisites

- Node.js installed on your machine. If not, please download and install Node.js.
- Basic knowledge of using the terminal or command prompt.

### Installation

1. **Create a Project Directory**: Create a new folder named `book-management-api`.
2. **Initialize Node.js Project**: Open the terminal, navigate to the `book-management-api` folder, and run `npm init -y` to create a `package.json` file.
3. **Create Required Files**: Inside the `book-management-api` folder, create two files: `index.js` and `.env`.
4. **Clone the Repository**: Copy and paste the contents of `index.js` and `.env` from the GitHub repository into your local files.
5. **Install Dependencies**: In the terminal, navigate to the `book-management-api` folder and run the following command to install all required modules:

npm install express mongoose bcrypt jsonwebtoken express-validator swagger-ui-express swagger-jsdoc dotenv

6. **Start the Server**: Run `npm run/start` in the terminal. Your localhost server will be up and running on port 3001.
7. **Access API Documentation**: Navigate to `http://localhost:3001/api-docs` to view the comprehensive API documentation using Swagger.

## Usage

### Registering and Logging In

- **Register a User**: Use the registration endpoint to create a new user. 
- **Log In**: Use the login endpoint with the username and password. The request body should include a username and password already created before. The response will include an authentication token.

### Authentication

- **Token Generation**: After a successful login, an authentication token will be generated. Copy this token (token will be in "your_token_here")
- **Update.env File**: Paste the token into the `JWT_SECRET` key in the `.env` file as shown: `JWT_SECRET=your_token_here`.

## API Endpoints

- **Get All Books**: Use the `getAll` endpoint to retrieve a list of all books. Only a valid token is required in the request body. You can see Author name, Year and Book ID from here.
- **Filter Books**: Use the `filter` endpoint to filter books by author or publication year. A valid token is required.
- **Update, Delete and Create Books**: Use the `patch, delete and books` endpoints to update, delete and create books. A valid token is required.

## Testing

- **Swagger UI**: Use the Swagger UI at `http://localhost:3001/api-docs` to test all endpoints. For endpoints requiring authentication, paste your token into the "token required" field in the request body.

## Contributing

Contributions to improve the API are welcome. Please feel free to submit a pull request.

