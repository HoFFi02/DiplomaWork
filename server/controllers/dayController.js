import db from '../app.js';
import Day from '../models/Day.js'
import Meal from '../models/Meal.js'
import Recipe from '../models/Recipe.js'
import sequelize from '../config/db.js'; 


// PUT /api/days/:id
const updateDay = async (req, res) => {
  const { id } = req.params;
  const { number_of_day, meal_id_meal, recipe_id_recipe, user_id } = req.body;

  if (!number_of_day || !meal_id_meal || !recipe_id_recipe || !user_id) {
    return res.status(400).json({ message: 'Wymagane pola są niekompletne' });
  }

  try {
    const [updatedRows] = await Day.update(
      { recipe_id_recipe },
      { where: { user_id_user: user_id, number_of_day, meal_id_meal } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono dnia o podanym ID lub użytkownik nie ma uprawnień do aktualizacji tego dnia' });
    }

    const updatedDay = await Day.findOne({
      where: { user_id_user: user_id, number_of_day },
      include: [
        { model: Meal, attributes: [] },
        { model: Recipe, attributes: [] }
      ],
      attributes: [
        'number_of_day',
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Breakfast" THEN recipe.name END')), 'breakfast_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Lunch" THEN recipe.name END')), 'lunch_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Dinner" THEN recipe.name END')), 'dinner_recipe_name']
      ],
      group: ['Day.number_of_day']
    });

    res.json({ message: 'Dzień zaktualizowany pomyślnie', updatedDay });
  } catch (err) {
    console.error('Błąd podczas aktualizowania dnia:', err.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizowania dnia', error: err.message });
  }
};


// DELETE /api/days/:id
const deleteDay = async (req, res) => {
  const { id } = req.params;
  const { number_of_day, meal_id_meal, user_id } = req.body;

  // Sprawdzenie, czy wszystkie wymagane pola są obecne
  if (!number_of_day || !meal_id_meal || !user_id) {
    return res.status(400).json({ message: 'Wymagane pola są niekompletne' });
  }

  try {
    // Aktualizacja pola recipe_id_recipe na NULL
    const updateResult = await Day.update(
      { recipe_id_recipe: null },
      {
        where: {
          user_id_user: user_id,
          number_of_day: number_of_day,
          meal_id_meal: meal_id_meal,
        },
      }
    );

    // Sprawdzenie, czy jakiekolwiek rekordy zostały zaktualizowane
    if (updateResult[0] === 0) {
      return res.status(404).json({
        message: 'Nie znaleziono dnia o podanym ID lub użytkownik nie ma uprawnień do aktualizacji tego dnia',
      });
    }

    // Pobranie zaktualizowanego dnia z odpowiednimi informacjami
    const updatedDay = await Day.findOne({
      where: {
        user_id_user: user_id,
        number_of_day: number_of_day,
      },
      include: [
        {
          model: Meal,
          attributes: ['name'],
        },
        {
          model: Recipe,
          attributes: ['name'],
        },
      ],
    });

    // Zmapowanie wyników, aby dopasować do struktury zwracanej wcześniej
    const formattedDay = {
      id_day: updatedDay.id_day,
      number_of_day: updatedDay.number_of_day,
      breakfast_recipe_name: updatedDay.Meal.name === 'Breakfast' ? updatedDay.Recipe?.name : null,
      lunch_recipe_name: updatedDay.Meal.name === 'Lunch' ? updatedDay.Recipe?.name : null,
      dinner_recipe_name: updatedDay.Meal.name === 'Dinner' ? updatedDay.Recipe?.name : null,
    };

    res.json({ message: 'Przepis usunięty pomyślnie', updatedDay: formattedDay });
  } catch (error) {
    console.error('Błąd podczas aktualizowania dnia:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizowania dnia', error: error.message });
  }
};

// const deleteDay = (req, res) => {
//   const { id } = req.params;
//   const { number_of_day, meal_id_meal, user_id } = req.body;
//   console.log(req.body); 
//   if (!number_of_day || !meal_id_meal || !user_id) {
//     return res.status(400).json({ message: 'Wymagane pola są niekompletne' });
//   }

//   const sql = `
//     UPDATE day 
//     SET recipe_id_recipe = NULL 
//     WHERE user_id_user = ? 
//       AND number_of_day = ? 
//       AND meal_id_meal = ?;
//   `;
//   const values = [user_id, number_of_day, meal_id_meal];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Błąd podczas aktualizowania dnia:', err.message);
//       return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizowania dnia', error: err.message });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Nie znaleziono dnia o podanym ID lub użytkownik nie ma uprawnień do aktualizacji tego dnia' });
//     }

//     const sqlSelect = `
//       SELECT 
//         d.id_day, 
//         d.number_of_day, 
//         MAX(CASE WHEN m.name = 'Breakfast' THEN r.name ELSE NULL END) AS breakfast_recipe_name,
//         MAX(CASE WHEN m.name = 'Lunch' THEN r.name ELSE NULL END) AS lunch_recipe_name,
//         MAX(CASE WHEN m.name = 'Dinner' THEN r.name ELSE NULL END) AS dinner_recipe_name 
//       FROM day d
//       LEFT JOIN meal m ON d.meal_id_meal = m.id_meal 
//       LEFT JOIN recipe r ON d.recipe_id_recipe = r.id_recipe 
//       WHERE d.user_id_user = ? AND d.number_of_day = ? 
//       GROUP BY d.number_of_day;
//     `;
//     db.query(sqlSelect, [user_id, number_of_day], (err, rows) => {
//       if (err) {
//         console.error('Błąd podczas pobierania dnia:', err.message);
//         return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dnia', error: err.message });
//       }

//       res.json({ message: 'Dzień zaktualizowany pomyślnie', updatedDay: rows[0] });
//     });
//   });
// };

// GET /api/days
const getUserDays = async (req, res) => {
  if (!req.session || !req.session.id_user) {
      
      return res.status(401).json({ message: 'Brak sesji użytkownika. Zaloguj się ponownie.' });
  }

  const userId = req.session.id_user; // Pobieramy ID zalogowanego użytkownika
  

  try{
    const days = await Day.findAll({
      where: { user_id_user: userId },
      include: [
        {model: Meal, attributes: []},
        {model: Recipe, attributes: []}
      ],
      attributes: [
        'number_of_day', 
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Breakfast" THEN recipe.name END')), 'breakfast_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Lunch" THEN recipe.name END')), 'lunch_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Dinner" THEN recipe.name END')), 'dinner_recipe_name'],
        ],
      group: ['Day.number_of_day'],
      order: [['number_of_day', 'ASC']]
      
    });
    res.status(200).json(days);
  }catch (err){
    console.error('Błąd podczas pobierania dni użytkownika: ', err.message);
    res.status(500).json({message: 'Wystąpił błąd podczas pobierania dni użytkownika', error: err.message});
  }
};

  
export {updateDay, deleteDay, getUserDays };


// // DELETE /api/days/:id
// const deleteDay = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const day = await Day.findByPk(id);

//     if (!day) {
//       return res.status(404).json({ message: 'Day not found' });
//     }

//     await day.destroy();
//     res.status(200).json({ message: 'Day deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting day:', err.message);
//     res.status(500).json({ message: 'Error deleting day', error: err.message });
//   }
// };