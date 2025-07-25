import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import cors from 'cors';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const PORT = 3000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('🟢 MongoDB connected'))
  .catch(err => console.error('🔴 MongoDB error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/items', itemRoutes);




app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Invalid password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

app.get('/', (req, res) => res.redirect('/login'));

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send('User already exists');
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashed });
  await newUser.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local', {
  successRedirect: '/protected',
  failureRedirect: '/login',
}));

app.get('/protected', ensureAuth, (req, res) => {
  res.render('protected', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

app.get('/users', ensureAuth, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('users', { users });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));