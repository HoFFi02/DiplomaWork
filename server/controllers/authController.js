import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Day from '../models/Day.js';
import Meal from '../models/Meal.js';
import sequelize from '../config/db.js';  // Zakładam, że masz te modele

const assignDaysToUser = (userId, transaction) => {
  return new Promise((resolve, reject) => {
    const mealIds = {
      breakfast: 1, // Zakładam, że ID dla śniadania to 1
      lunch: 2,     // Zakładam, że ID dla lunchu to 2
      dinner: 3     // Zakładam, że ID dla obiadu to 3
    };
  console.log(userId);
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const dayEntries = [];

    days.forEach(dayNumber => {
      dayEntries.push(
        { number_of_day: dayNumber, meal_id_meal: mealIds.breakfast, user_id_user: userId },
        { number_of_day: dayNumber, meal_id_meal: mealIds.lunch, user_id_user: userId },
        { number_of_day: dayNumber, meal_id_meal: mealIds.dinner, user_id_user: userId }
      );
    });

    // Używamy `bulkCreate`, aby masowo dodać wszystkie dni użytkownika
    Day.bulkCreate(dayEntries, { transaction })
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log('Dane użytkownika:', req.body);

  const transaction = await sequelize.transaction();

  try {
    // Dodanie użytkownika do bazy danych
    const user = await User.create(
      { username, password: hashedPassword, email },
      { transaction }
    );
console.log(user);
    // Przypisanie dni do użytkownika
    await assignDaysToUser(user.id_user, transaction);

    // Zatwierdzenie transakcji
    await transaction.commit();
    res.status(201).send('Użytkownik zarejestrowany i dni przypisane');
  } catch (error) {
    console.error('Błąd podczas rejestracji użytkownika:', error); // Zapisz pełny błąd w logach
    await transaction.rollback();
    res.status(500).send('Błąd podczas rejestracji użytkownika');
  }
  
};






const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.username = user.username;
    req.session.id_user = user.id_user;
    req.session.email = user.email;

    req.session.save((err) => {
      if (err) {
        console.error('Błąd zapisu sesji:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.json({
        Login: true,
        user: {
          username: user.username,
          id_user: user.id_user,
          email: user.email
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd logowania');
  }
};
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Błąd podczas usuwania sesji:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.clearCookie('connect.sid'); // Opcjonalnie, do usuwania ciasteczka sesji
    res.status(200).send('Logged out');
  });
};
const getSession = (req, res) => {
  if (req.session.username) {
    res.json({
      user: {
        username: req.session.username,
        id_user: req.session.id_user,
        email: req.session.email
      }
    });
  } else {
    res.status(200).json({ user: null });
  }
};



// import bcrypt from 'bcrypt';
// import db from '../app.js';


// const assignDaysToUser = (userId) => {
//   return new Promise((resolve, reject) => {
//     // Example meal IDs for breakfast, lunch, and dinner
//     const mealIds = {
//       breakfast: 1, // Assuming meal ID for breakfast is 1
//       lunch: 2,     // Assuming meal ID for lunch is 2
//       dinner: 3     // Assuming meal ID for dinner is 3
//     };

//     // Create 30 days for the new user
//     const days = Array.from({ length: 30 }, (_, i) => i + 1);

//     const dayInsertPromises = days.map(dayNumber => {
//       return new Promise((resolveDay, rejectDay) => {
//         // Insert day for breakfast
//         db.query(
//           'INSERT INTO day (number_of_day, meal_id_meal, user_id_user) VALUES (?, ?, ?)',
//           [dayNumber, mealIds.breakfast, userId],
//           (err, dayResult) => {
//             if (err) return rejectDay(err);
 
//             // Insert day for lunch
//             db.query(
//               'INSERT INTO day (number_of_day, meal_id_meal, user_id_user) VALUES (?, ?, ?)',
//               [dayNumber, mealIds.lunch, userId],
//               (err, lunchResult) => {
//                 if (err) return rejectDay(err);

//                 // Insert day for dinner
//                 db.query(
//                   'INSERT INTO day (number_of_day, meal_id_meal, user_id_user) VALUES (?, ?, ?)',
//                   [dayNumber, mealIds.dinner, userId],
//                   (err, dinnerResult) => {
//                     if (err) return rejectDay(err);
//                     resolveDay(); // Successfully inserted breakfast, lunch, and dinner for the day
//                   }
//                 );
//               }
//             );
//           }
//         );
//       });
//     });

//     Promise.all(dayInsertPromises)
//       .then(resolve)
//       .catch(reject);
//   });
// };



// const registerUser = (req, res) => {
//   const { username, password, email } = req.body;
//   const hashedPassword = bcrypt.hashSync(password, 10);

//   db.beginTransaction((err) => {
//     if (err) {
//       return res.status(500).send('Błąd transakcji');
//     }

//     // Dodanie użytkownika do bazy danych
//     db.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, result) => {
//       if (err) {
//         return db.rollback(() => {
//           res.status(500).send('Błąd rejestracji użytkownika');
//         });
//       }

//       const userId = result.insertId;

//       // Przypisanie 30 dni do użytkownika
//       assignDaysToUser(userId)
//         .then(() => {
//           db.commit((err) => {
//             if (err) {
//               return db.rollback(() => {
//                 res.status(500).send('Błąd commitu');
//               });
//             }
//             res.status(201).send('Użytkownik zarejestrowany i dni przypisane');
//           });
//         })
//         .catch((err) => {
//           db.rollback(() => {
//             res.status(500).send('Błąd podczas przypisywania dni');
//           });
//         });
//     });
//   });
// };


// const loginUser = (req, res) => {
//   const { username, password } = req.body;
//   const query = 'SELECT * FROM user WHERE username = ?';
//   db.query(query, [username], (err, results) => {
//     if (err) return res.status(500).send(err);
//     if (results.length === 0) return res.status(401).send('Invalid username or password');

//     const user = results[0];
//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) return res.status(401).send('Invalid username or password');

//     req.session.username = user.username;
//     req.session.id_user = user.id_user;
//     req.session.email = user.email;


//     req.session.save((err) => {
//       if (err) {
//         console.error('Błąd zapisu sesji:', err);
//         return res.status(500).send('Internal Server Error');
//       }
//       res.json({
//         Login: true,
//         user: {
//           username: user.username,
//           id_user: user.id_user,
//           email: user.email
//         }
//       });
//     });
//   });
// };


// const logoutUser = (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Błąd podczas usuwania sesji:', err);
//       return res.status(500).send('Internal Server Error');
//     }
//     res.clearCookie('connect.sid'); // Opcjonalnie, do usuwania ciasteczka sesji
//     res.status(200).send('Logged out');
//   });
// };


// const getSession = (req, res) => {

//   if (req.session.username) {
//     res.json({
//       user: {
//         username: req.session.username,
//         id_user: req.session.id_user,
//         email: req.session.email
//       }
//     });
//   } else {
  
//     res.status(200).json({ user: null });
//   }
// };
export { registerUser, loginUser, logoutUser, getSession };
