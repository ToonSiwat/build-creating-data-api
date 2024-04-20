import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.post("/assignments", async (req, res) => {
    const newPost = {
        ...req.body,
        created_at : new Date(),
        updated_at : new Date(),
        published_at : new Date()
    };

    try {
        await connectionPool.query(
            `insert into assignments (user_id, title, content, category, length, status, created_at, updated_at, published_at)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                1,
                newPost.title,
                newPost.content,
                newPost.category,
                newPost.length,
                newPost.status,
                newPost.created_at,
                newPost.updated_at,
                newPost.published_at
            ]
        );
    } catch {
        return res.status(500).json({
            "message": "Server could not create assignment because database connection"
        });
    } if (!req.body.newPost) {
        res.status(400).json({
            "message": "Server could not create post because there are missing data from client"
        });
        return;
    };
    return res.status(201).json({
        "message": "Created assignment sucessfully"
    });
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
