import { Router } from "express";
import { posts } from "../data/posts.js";


const postsRouter = Router();

/**
 * GET
 */
postsRouter.get("/", (req, res) => {
  res.json(posts);
});

/**
 * GET id
 */
postsRouter.get("/:id", (req, res, next) => {
  console.log(req.params);
  const post = posts.find((post) => post.id == req.params.id);

  if (post) {
    res.json(post);
  } else {
    next(); // calls the custom 404 middleware
  }
});

// POST*****

postsRouter.post("/:id", (req, res) => {
  const userId = parseInt(req.params.id)
  const {title, content} = req.body

  if (!title || !content) {
    return res.status(400).send({error: "Title and body are required"})
  }

  const newPost = {
    id: posts.length + 1,
    userId: userId,
    title : title,
    content : content

  }
  posts.push(newPost)
  res.status(200).json(newPost)
})


postsRouter.patch("/:id", (req, res) => {
  const postId = parseInt(req.params.id); // Parse the post ID from the URL
  const { title, body } = req.body;
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }
  const post = posts.find((post) => post.id === postId);

  // If the post doesn't exist, return a 404 error
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Update the post with the provided fields (if they exist)
  if (title) post.title = title;
  if (body) post.body = body;

  // Respond with the updated post
  res.json(post);
});

postsRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const findUserIndex = posts.findIndex((post) => post.userId === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404); // Return 404 if user not found
  }
  posts.splice(findUserIndex, 1); // Remove the post at the found index
  return res.sendStatus(204); 
});

//**GET /api/users */

postsRouter.get("/:id/post", (req, res) => {
  const userId = parseInt(req.params.id)
  if(!NaN(userId)) return res.status(400).json({error: "invalid user ID"})
  const userPost = posts.filter((post) => post.userId === userId)
  return res.status(200).json(userPost)
})

//**GET /api/:id/posts */

postsRouter.get("/post", (req,res) => {
  const userId = parseInt(req.params.id)
  if(isNaN(userId)) res.status(400).json({error: "invalid user id"})
  const userPost = posts.filter((post) => post.userId === userId)
  res.status(200).json(userPost)
})

//**GET /posts/comments */
postsRouter.get('/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) return res.status(400).json({ error: "Invalid post ID" });

  const postComments = comments.filter(c => c.postId === postId);
  res.status(200).json(postComments);
});


export default postsRouter;

