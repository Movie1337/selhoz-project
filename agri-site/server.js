const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const DATA_FILE = path.join(__dirname, 'data', 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readDB(){
  if (!fs.existsSync(DATA_FILE)) return { users: [], ads: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeDB(db){
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Auth: register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const db = readDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email taken' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name: name || '', email, passwordHash: hash, role: role || 'other', createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Auth: login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Bad authorization header' });
  const token = parts[1];
  try{
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Ads CRUD
app.get('/api/ads', (req, res) => {
  const db = readDB();
  res.json(db.ads || []);
});

app.post('/api/ads', authMiddleware, (req, res) => {
  const db = readDB();
  const { title, type, crop, variety, volume, region, price, deliveryTime, specs } = req.body;
  const ad = {
    id: uuidv4(),
    ownerId: req.user.id,
    title: title || '',
    type: type || 'sell',
    crop: crop || '',
    variety: variety || '',
    volume: volume || '',
    region: region || '',
    price: price || null,
    deliveryTime: deliveryTime || '',
    specs: specs || '',
    createdAt: new Date().toISOString()
  };
  db.ads.push(ad);
  writeDB(db);
  res.json(ad);
});

app.put('/api/ads/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const ad = db.ads.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).json({ error: 'Not found' });
  if (ad.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  Object.assign(ad, req.body);
  writeDB(db);
  res.json(ad);
});

app.delete('/api/ads/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.ads.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const ad = db.ads[idx];
  if (ad.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  db.ads.splice(idx,1);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
