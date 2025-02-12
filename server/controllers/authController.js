import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Day from '../models/Day.js';
import sequelize from '../config/db.js';  
import {assignDaysToUser, assignDaysToUserForNextMonth} from '../utils/assignDays.js';

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  

  const transaction = await sequelize.transaction();

  try {
    
    const user = await User.create(
      { username, password: hashedPassword, email },
      { transaction }
    );
console.log(user);
   
    await assignDaysToUser(user.id_user, transaction);

    
    await transaction.commit();
    res.status(201).send('Użytkownik zarejestrowany i dni przypisane');
  } catch (error) {
    console.error('Błąd podczas rejestracji użytkownika:', error); 
    await transaction.rollback();
    res.status(500).send('Błąd podczas rejestracji użytkownika');
  }
  
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
    }

    const currentDate = new Date();
    const nextMonth = currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2;
    const nextMonthYear = nextMonth === 1 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();

    const nextMonthDaysExist = await Day.findOne({
      where: {
        user_id_user: user.id_user,
        month: nextMonth,
        year: nextMonthYear,
      },
      transaction,
    });

    if (!nextMonthDaysExist) {
      console.log('Dodawanie dni dla następnego miesiąca...');
      await assignDaysToUserForNextMonth(user.id_user, transaction);
    }

    
    req.session.user = {
      username: user.username,
      id_user: user.id_user,
      email: user.email,
    };

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
          email: user.email,
        },
      });
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
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
    res.clearCookie('connect.sid'); 
    res.status(200).send('Logged out');
  });
};
const getSession = (req, res) => {
  if (req.session.user.username) {
    res.json({
      user: {
        username: req.session.user.username,
        id_user: req.session.user.id_user,
        email: req.session.user.email
      }
    });
  } else {
    res.status(200).json({ user: null });
  }
};

export { registerUser, loginUser, logoutUser, getSession };
