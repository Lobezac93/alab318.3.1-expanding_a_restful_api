import {Router} from "express"
import { comments } from "../data/comments.js"

const commentsRouter = Router()

commentsRouter.get('/', (req, res) => {
    res.status(200).json(comments);  
  });
  
  commentsRouter.post('/', (req, res) => {
    const { userId, postId, body } = req.body;
    if (!userId || !postId || !body) {
      return res.status(400).json({ error: "userId, postId, and body are required" });
    }
    const newComment = {
      id: comments.length + 1, 
      userId,
      postId,
      body
    };
  
    comments.push(newComment);
    res.status(201).json(newComment);
  });

 // retrieve a comment by its Id
  commentsRouter.get('/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const comment = comments.find(c => c.id === commentId);
  
    if (!comment) return res.sendStatus(404);
    res.status(200).json(comment);
  });
  
  // update a comment 
  commentsRouter.patch('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { body } = req.body;
  
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return res.sendStatus(404);
  
    if (body) comment.body = body;  // Only update if body is provided
    res.status(200).json(comment);
  });
  
  //**DELETES a comment  */ 

  commentsRouter.delete('/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const commentIndex = comments.findIndex(c => c.id === commentId);
  
    if (commentIndex === -1) return res.sendStatus(404);
  
    comments.splice(commentIndex, 1);  // Remove comment
    res.sendStatus(204);
  });

  //**GET /comments/userid=<VALUE> */

  commentsRouter.get('/', (req, res) => {
    const userId = parseInt(req.query.userId, 10);
    if (!isNaN(userId)) {
      const userComments = comments.filter(c => c.userId === userId);
      return res.status(200).json(userComments);
    }
    res.status(200).json(comments);  // Return all comments if no query param
  });

  //**GET /comments?postId=<VALUE> */
  
  commentsRouter.get('/', (req, res) => {
    const postId = parseInt(req.query.postId, 10);
    if (!isNaN(postId)) {
      const postComments = comments.filter(c => c.postId === postId);
      return res.status(200).json(postComments);
    }
    res.status(200).json(comments);  // Return all comments if no query param
  });

  //**GET /users/comments */

  commentsRouter.get('/:id/comments', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  
    const userComments = comments.filter(c => c.userId === userId);
    res.status(200).json(userComments);
  });
  

  

  export default commentsRouter;