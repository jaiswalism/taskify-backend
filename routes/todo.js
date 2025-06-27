const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const router = Router();
const { z } = require('zod');

const { Todo } = require("../database/index");

// todo Routes
router.post("/", adminMiddleware, async (req, res) => {
  // Todo creation logic
  try {
    const validateBody = z.object({
      title : z.string().min(3).max(50),
      description : z.string().min(3).max(100),
      tag : z.enum(["Low", "Medium", "High"]),
      deadline : z.string(),
      section : z.enum(["todo", "inProgress", "underReview", "finished"]) 
    })

    const parsedBody = validateBody.safeParse(req.body);
    if(!parsedBody.success){
      res.status(400).json({
        error: parsedBody.error.issues[0].message
      })
      return
    }

    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;
    const deadline = req.body.deadline;
    const section = req.body.section;

    await Todo.create({
      userId: userId,
      title: title,
      description: description,
      tag: tag,
      deadline: deadline,
      section: section,
      done: false,
    });

    res.status(201).json({ message: "Todo added successfully!" });
  } catch (err) {
    res.status(503).json({ message: "Failed to add todo!" });
    console.log(err);
  }
});

router.put("/", adminMiddleware, async (req, res) => {
  // Update todo  logic
  try {
    const validateBody = z.object({
      title : z.string().min(3).max(50),
      description : z.string().min(3).max(100),
      newTitle : z.string().min(3).max(50),
      newDescription : z.string().min(3).max(100),
      newTag : z.enum(["Low", "Medium", "High"]),
      newDeadline : z.string(),
      newSection : z.enum(["todo", "inProgress", "underReview", "finished"]) 
    })

    const parsedBody = validateBody.safeParse(req.body);
    if(!parsedBody.success){
      res.status(400).json({
        error: parsedBody.error.issues[0].message
      })
      return
    }

    const userId = req.userId;

    const title = req.body.title;
    const description = req.body.description;
    
    const newTitle = req.body.newTitle;
    const newDescription = req.body.newDescription;
    const newTag = req.body.newTag;
    const newDeadline = req.body.newDeadline;
    const newSection = req.body.newSection;


    await Todo.updateOne(
      {
        userId,
        title,
        description,
      },
      {
        $set: {
          title: newTitle,
          description: newDescription,
          tag: newTag,
          deadline: newDeadline,
          section: newSection,
        },
      }
    );

    res.status(201).json({ message: "Todo updated successfully!" });
  } catch (err) {
    res.status(503).json({ message: "Failed to update todo!" });
    console.log(err)
  }
});

router.delete("/", adminMiddleware, async (req, res) => {
  // Delete todo logic
  try {
    const validateBody = z.object({
      title : z.string().min(3).max(50),
      description : z.string().min(3).max(100),
      tag : z.enum(["Low", "Medium", "High"]),
    })

    const parsedBody = validateBody.safeParse(req.body);
    if(!parsedBody.success){
      res.status(400).json({
        error: parsedBody.error.issues[0].message
      })
      return
    }

    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;

    await Todo.findOneAndDelete({
      userId: userId,
      title: title,
      description: description,
      tag: tag,
    });

    res.status(201).json({ message: "Todo deleted successfully!" });
  } catch (err) {
    res.status(503).json({ message: "Failed to delete todo!" });
    console.log(err);
  }
});

router.delete("/:id", adminMiddleware, async (req, res) => {
  // Delete todo by id logic
  try {
    const validateParams = z.object({
      id: z.string().length(24)
    })

    const parsedParams = validateParams.safeParse(req.params);
    if(!parsedParams.success){
      res.status(400).json({
        error: parsedParams.error.issues[0].message
      })
      return
    }

    const userId = req.userId;
    const todoId = req.params.id;

    const deleted = await Todo.findOneAndDelete({
      _id: todoId,
      userId: userId,
    });

    if (deleted) {
      res.status(201).json({ message: "Todo deleted successfully!" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(503).json({ message: "Failed to deleted todo!" });
    console.log(err);
  }
});

router.get("/", adminMiddleware, async (req, res) => {
  // Fetching all todo logic
  try {
    const userId = req.userId;

    const todoItems = await Todo.find({
      userId: userId,
    });

    res.status(200).send(todoItems);
  } catch (err) {
    res.status(503).json({ message: "Failed to get todos!" });
    // console.log(err)
  }
});

router.get("/:id", adminMiddleware, async (req, res) => {
  // Fetching todo by id logic
  try {
    const validateParams = z.object({
      id: z.string().length(24)
    })

    const parsedParams = validateParams.safeParse(req.params);
    if(!parsedParams.success){
      res.status(400).json({
        error: parsedParams.error.issues[0].message
      })
      return
    }

    const todoId = req.params.id;

    const todo = await Todo.findById(todoId);

    if (todo) {
      res.status(201).send(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (err) {
    res.status(503).json({ message: "Failed to get todos!" });
    console.log(err);
  }
});

module.exports = router;
