const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 */

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
 username: { type: String, required: true },
 password: { type: String, required: true }
}));

// Swagger definition
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Book Management API',
        version: '1.0.0',
        description: 'A simple API for managing books',
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    apis: ['./index.js'],
  };

// Initializing swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publicationYear
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         publicationYear:
 *           type: integer
 *           description: The year the book was published
 */

// Define Book model
const Book = mongoose.model('Book', new mongoose.Schema({
 title: { type: String, required: true },
 author: { type: String, required: true },
 publicationYear: { type: Number, required: true }
}));

//user registration validation
const validateUserRegistration = [
 body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
 body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
* @swagger
* /api/register:
*   post:
*     summary: Register a new user
*     description: Register a new user with a username and password.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 description: The username of the new user.
*               password:
*                 type: string
*                 description: The password of the new user.
*     responses:
*       201:
*         description: User registered successfully
*       400:
*         description: Bad request, validation failed
*/

// usser registration
app.post('/api/register', validateUserRegistration, async (req, res) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
 }

 try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
 } catch (error) {
    res.status(500).json({ error: error.message });
 }
});

//user login validation
const validateUserLogin = [
 body('username').notEmpty().withMessage('Username is required'),
 body('password').notEmpty().withMessage('Password is required')
];

/**
* @swagger
* /api/login:
*   post:
*     summary: Login a user
*     description: Login a user with a username and password.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 description: The username of the user.
*                 example: "Kunal"
*               password:
*                 type: string
*                 description: The password of the user.
*                 example: "Elonmusk123#"
*     responses:
*       200:
*         description: User logged in successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: JWT token for authenticated requests.
*       401:
*         description: Unauthorized, invalid credentials
*       404:
*         description: User not found
*/

// user login
app.post('/api/login', validateUserLogin, async (req, res) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
 }

 try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
 } catch (error) {
    res.status(500).json({ error: error.message });
 }
});

//book creation validation
const validateBookCreation = [
 body('title').notEmpty().withMessage('Title is required'),
 body('author').notEmpty().withMessage('Author is required'),
 body('publicationYear').isInt().withMessage('Publication year must be a valid number')
];

const authenticateToken = (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };

/**
* @swagger
* /api/books:
*   post:
*     summary: Create a new book
*     description: Create a new book entry. Authenticated users only.
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: The title of the book
*               author:
*                 type: string
*                 description: The author of the book
*               publicationYear:
*                 type: integer
*                 description: The year the book was published
*               token:
*                 type: string
*                 description: JWT token for authenticated requests.
*     responses:
*       201:
*         description: Book created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Book'
*       401:
*         description: Unauthorized

*/

// Creating a new book
app.post('/api/books', authenticateToken, validateBookCreation, async (req, res) => {
    const { title, author, publicationYear, token } = req.body;
    const newBook = new Book({ title, author, publicationYear });
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
});

/**
* @swagger
* /api/books/{id}:
*   patch:
*     summary: Update a book
*     description: Update a book entry. Authenticated users only.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the book to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: The updated title of the book
*               author:
*                 type: string
*                 description: The updated author of the book
*               publicationYear:
*                 type: integer
*                 description: The updated publication year of the book
*               token:
*                 type: string
*                 description: JWT token for authenticated requests.
*     responses:
*       200:
*         description: Book updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Book'
*       401:
*         description: Unauthorized
*       404:
*         description: Book not found
*/

// Updating a book
app.patch('/api/books/:id', authenticateToken, validateBookCreation, async (req, res) => {
 const { id } = req.params;
 const { title, author, publicationYear, token} = req.body;
 const updateFields = {};
 if (title) updateFields.title = title;
 if (author) updateFields.author = author;
 if (publicationYear) updateFields.publicationYear = publicationYear;
 const updatedBook = await Book.findByIdAndUpdate(id, updateFields, { new: true });
 if (!updatedBook) {
    return res.status(404).json({ error: 'Book not found' });
 }
 res.json({ message: 'Book updated successfully', book: updatedBook });
});

/** 
* @swagger
* /api/books/{id}:
*   delete:
*     summary: Delete a book
*     description: Delete a book entry. Authenticated users only.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the book to d
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               token:
*                 type: string
*                 description: JWT token for authenticated requests.
*     responses:
*       200:
*         description: Book deleted successfully
*       401:
*         description: Unauthorized
*       404:
*         description: Book not found
*/

// Deleting a book
app.delete('/api/books/:id', authenticateToken, async (req, res) => {
 const { id } = req.params;
 const { token} = req.body;
 const deletedBook = await Book.findByIdAndDelete(id);
 if (!deletedBook) {
    return res.status(404).json({ error: 'Book not found' });
 }
 res.json({ message: 'Book deleted successfully', book: deletedBook });
});

/**
* @swagger
* /api/books/getAll:
*   post:
*     summary: Retrieve a list of all books
*     description: Retrieve a list of all books. Authenticated users only.
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               token:
*                 type: string
*                 description: JWT token for authenticated requests.
*     responses:
*       200:
*         description: A list of all books
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Book'
*       401:
*         description: Unauthorized
*/

// Get all books by this endpoint
app.post('/api/books/getAll', authenticateToken, async (req, res) => {
 const books = await Book.find();
 res.json(books);
});

/**
* @swagger
* /api/books/filter:
*   post:
*     summary: Filter books by author or publication year
*     description: Filter books by author or publication year. Authenticated users only.
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               author:
*                 type: string
*                 description: Filter books by author
*               publicationYear:
*                 type: string
*                 description: Filter books by publication year
*               token:
*                 type: string
*                 description: JWT token for authenticated requests.
*     responses:
*       200:
*         description: A list of filtered books
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Book'
*       401:
*         description: Unauthorized
*/

// Filter books by author or year
app.post('/api/books/filter', authenticateToken, async (req, res) => {
    const { author, publicationYear } = req.body;
    let query = {};
  
    // Check if author is provided and write a regex query
    if (author) {
      query.author = { $regex: new RegExp(author, 'i') };
    }
  
    if (publicationYear) {
      // Convert publicationYear to a string and add it to the query
      query.publicationYear = String(publicationYear);
    }
  
    // Execute the query
    const books = await Book.find(query);
    res.json(books);
  });
  

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
