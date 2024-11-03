import express from 'express';
import { body, validationResult } from 'express-validator';
import { getUsers, createUser, updateUser, deleteUser } from '../service/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await getUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/', [
  body('name').isString(),
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const user = await createUser(req.body);
    res.json({
      message: "User created",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;