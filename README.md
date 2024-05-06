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

![Alt text](https://github.com/vkunal8013/Book_API/blob/a5fb8acfded247dce8073a12f1d3c8846861d819/images/Screenshot%202024-05-07%20at%202.52.13%E2%80%AFAM.png)

![Alt text](https://github.com/vkunal8013/Book_API/blob/a5fb8acfded247dce8073a12f1d3c8846861d819/images/Screenshot%202024-05-07%20at%202.52.26%E2%80%AFAM.png)

<img width="1414" alt="Screenshot 2024-05-07 at 2 53 07 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/a2661e34-fd30-496e-b1d4-6b66213de02b">

### Authentication

- **Token Generation**: After a successful login, an authentication token will be generated. Copy this token (token will be in "your_token_here")
- **Update.env File**: Paste the token into the `JWT_SECRET` key in the `.env` file as shown: `JWT_SECRET=your_token_here`.

<img width="1420" alt="Screenshot 2024-05-07 at 2 54 13 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/b9d0a6ce-f215-4bcd-93c4-4ce0c09a175f">

<img width="918" alt="Screenshot 2024-05-07 at 2 53 50 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/06c16bc0-e607-4a6a-8358-0a8fbeca8a72">


## API Endpoints

- **Get All Books**: Use the `getAll` endpoint to retrieve a list of all books. Only a valid token is required in the request body. You can see Author name, Year and Book ID from here.
- **Filter Books**: Use the `filter` endpoint to filter books by author or publication year. A valid token is required.
- **Update, Delete and Create Books**: Use the `patch, delete and books` endpoints to update, delete and create books. A valid token is required.


<img width="1417" alt="Screenshot 2024-05-07 at 2 54 24 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/87566b79-6ec4-420d-b431-39e7c94f3a7d">

<img width="1440" alt="Screenshot 2024-05-07 at 2 54 51 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/c20c0c47-dbfd-4a5a-8989-5192d29d631d">

<img width="1437" alt="Screenshot 2024-05-07 at 2 55 00 AM" src="https://github.com/vkunal8013/Book_API/assets/121377679/b8316d6e-bf36-4d60-af63-fe8f14a5e401">


## Testing

- **Swagger UI**: Use the Swagger UI at `http://localhost:3001/api-docs` to test all endpoints. For endpoints requiring authentication, paste your token into the "token required" field in the request body.

## Contributing

Contributions to improve the API are welcome. Please feel free to submit a pull request.

