const express = require('express');
const { PrismaClient } = require('../prisma/prisma/generated/prisma-client-js');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/hash');

const router = express.Router();
const prisma = new PrismaClient();

// Register route
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                role: 1, // Set role to 1 by default
            },
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(400).json({ error: 'User registration failed', details: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (user && await comparePassword(password, user.password)) {
            const token = generateToken(user);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
});

module.exports = router;