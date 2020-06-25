import express from 'express';

const router = express.Router();

router.get('/api/users/current-user', (req, res) => {
  res.send('hello from current');
});

export { router as currentUserRouter };