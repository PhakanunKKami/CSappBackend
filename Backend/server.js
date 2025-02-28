const express = require('express');
const app = express();
const { PrismaClient } = require('./prisma/prisma/generated/prisma-client-js');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/auth');

const domainName = `http://202.44.40.179/Data_From_Chiab`;

const countImageFiles = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => 
            file.match(/\.(jpg|jpeg|png|gif)$/i)  // Check for image file extensions
        );
        return imageFiles.length;
    } catch (error) {
        console.error('Error reading folder:', error);
        return 0;  // Return 0 if an error occurs
    }
};

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Received a request to the root endpoint');
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.$queryRaw`
            SELECT 
            Title, 
            Message, 
            type, 
            DATE_FORMAT(PostDate, '%d/%m/%Y') as PostDate
            FROM post
        `;
        
        const cleanMessagePosts = posts.map(post => {
            
            const folderPath = path.join(__dirname, 'images', post.Title);
            const imageCount = countImageFiles(folderPath);
      
            return {
                ...post,
                Message: post.Message
                    ? post.Message
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .replace(/&nbsp;/g, " ")
                        .replace(/\r\n|\r|\n/g, " ")
                        .trim()
                    : post.Message,
                img_url: `${domainName}/Image/IMG_SHOW/${post.Title}`,
                image_count: imageCount
            };
        });

        res.json(cleanMessagePosts);

        // res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/user', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.user.username }, // Use username instead of id
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});

// const http = require('http');
// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080);