import bcrypt from 'bcrypt';
import db from '../server.js';

const registerUser = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO uzytkownicy (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('User registered');
  });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM uzytkownicy WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Invalid username or password');

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).send('Invalid username or password');

    req.session.user = { id: user.id_uzytkownik, username: user.username };
    console.log('Sesja użytkownika ustawiona:', req.session.user);
    res.status(200).send('Logged in');
  });
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Logged out');
  });
};
const getSession = (req, res) => {
    if (req.session.user) {
      console.log('Sesja użytkownika:', req.session.user); // Debugowanie
      res.json({ user: req.session.user });
    } else {
      console.log('Sesja użytkownika: brak'); // Debugowanie
      res.json({ user: null });
    }
  };
export { registerUser, loginUser, logoutUser, getSession };
