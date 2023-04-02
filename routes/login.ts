import { Request, Response, Router } from 'express';
import { UserRecord } from '../records/userRecord';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/verifyToken';

export const login = Router();

login
  .get('/login', verifyToken, async (req: Request, res: Response) => {
    res.json({ message: 'User is logged' });
  })
  .post('/login', async (req, res, next) => {
    const { email, pwd } = req.body;
    const user = await UserRecord.getOne(email);
    if (!user) {
      next(res.status(404).json({ error: 'User not found' }));
    } else {
      const hashedPassword = user.pwd;
      const isValidPassword = await bcrypt.compare(pwd, hashedPassword);
      if (isValidPassword) {
        const { id, username } = user;
        const token = jwt.sign(
          { id, username },
          process.env.ACCESS_TOKEN as string,
          { expiresIn: '60m' }
        );
        res
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .status(200)
          .json({ id, username, token });
      } else {
        res.status(400).json({ error: 'Wrong password or username' });
      }
    }
  })
  .delete('/logout', async (req, res) => {
    res
      .clearCookie('access_token', { path: '/' })
      .status(204)
      .json({ message: 'Logout' });
  });
