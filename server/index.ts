import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// NOTE: This is a reference implementation of the backend.
// The live demo currently uses the client-side 'services/api.ts' to simulate this logic.

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// --- In-Memory DB for Reference ---
const users: any[] = [];
const transactions: any[] = [];
const categories: any[] = [];

// --- Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Routes ---

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), email, password: hashedPassword, name };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/transactions', authenticateToken, (req: any, res) => {
    const userTxs = transactions.filter(t => t.userId === req.user.id && !t.deleted);
    res.json(userTxs);
});

app.post('/api/transactions', authenticateToken, (req: any, res) => {
    const tx = { ...req.body, id: uuidv4(), userId: req.user.id, createdAt: new Date() };
    transactions.push(tx);
    res.status(201).json(tx);
});

app.delete('/api/transactions/:id', authenticateToken, (req: any, res) => {
    const tx = transactions.find(t => t.id === req.params.id && t.userId === req.user.id);
    if (tx) tx.deleted = true;
    res.sendStatus(200);
});

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
