import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
  res.send('hello from up');
});

export { router as signupRouter };