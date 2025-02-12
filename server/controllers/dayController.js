import Day from '../models/Day.js';
import Meal from '../models/Meal.js';
import Recipe from '../models/Recipe.js';
import sequelize from '../config/db.js';

const updateDay = async (req, res) => {
  const { id } = req.params;
  const { number_of_day, month, year, meal_id_meal, recipe_id_recipe, user_id, language } = req.body;

  const langName = language === 'pl' ? 'name_pl' : 'name_en';

  try {
    const [updatedRows] = await Day.update(
      { recipe_id_recipe },
      { where: { user_id_user: user_id, number_of_day, month, year, meal_id_meal } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono dnia do aktualizacji' });
    }

    const updatedDay = await Day.findOne({
      where: { user_id_user: user_id, number_of_day, month, year },
      include: [
        { model: Meal, attributes: [] },
        { model: Recipe, attributes: [langName] },
      ],
    });

    res.json({ message: 'Dzień zaktualizowany pomyślnie', updatedDay });
  } catch (err) {
    console.error('Błąd podczas aktualizacji dnia:', err.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji dnia', error: err.message });
  }
};
const deleteDay = async (req, res) => {
  const { id } = req.params;
  const { number_of_day, month, year, meal_id_meal, user_id, language } = req.body;

  const langName = language === 'pl' ? 'name_pl' : 'name_en';

  try {
    const updateResult = await Day.update(
      { recipe_id_recipe: null },
      { where: { user_id_user: user_id, number_of_day, month, year, meal_id_meal } }
    );

    if (updateResult[0] === 0) {
      return res.status(404).json({ message: 'Nie znaleziono dnia do usunięcia przepisu' });
    }

    const updatedDay = await Day.findOne({
      where: { user_id_user: user_id, number_of_day, month, year },
      include: [
        { model: Meal, attributes: [] },
        { model: Recipe, attributes: [langName] },
      ],
    });

    res.json({ message: 'Dzień zaktualizowany pomyślnie', updatedDay });
  } catch (error) {
    console.error('Błąd podczas usuwania przepisu dnia:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania przepisu dnia', error: error.message });
  }
};



const getUserDays = async (req, res) => {

    if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Brak sesji użytkownika. Zaloguj się ponownie.' });
  }

  const userId = req.session.user.id_user; 
  const { month, year } = req.query; 
  const language = req.query.language || 'pl'; 
  const langName = language === 'pl' ? 'name_pl' : 'name_en';
  console.log('aaaa'+ language);
  try {
    const days = await Day.findAll({
      where: {
        user_id_user: userId,
        month: month ? month : { [sequelize.Op.ne]: null }, 
        year: year ? year : { [sequelize.Op.ne]: null },   
      },
      include: [
        { model: Meal, attributes: [] },
        { model: Recipe, attributes: [langName] }
      ],
      attributes: [
        'number_of_day', 
        'month',
        'year',
        [sequelize.fn('MAX', sequelize.literal(`CASE WHEN meal.name = "Breakfast" THEN recipe.${langName} END`)), 'breakfast_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal(`CASE WHEN meal.name = "Lunch" THEN recipe.${langName} END`)), 'lunch_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal(`CASE WHEN meal.name = "Dinner" THEN recipe.${langName} END`)), 'dinner_recipe_name'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Breakfast" THEN recipe.id_recipe END')), 'breakfast_recipe_id'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Lunch" THEN recipe.id_recipe END')), 'lunch_recipe_id'],
        [sequelize.fn('MAX', sequelize.literal('CASE WHEN meal.name = "Dinner" THEN recipe.id_recipe END')), 'dinner_recipe_id'], 
      ],
      group: ['Day.number_of_day'],
      order: [['number_of_day', 'ASC']]
      
    }); 

    res.status(200).json(days);
  } catch (err) {
    console.error('Błąd podczas pobierania dni użytkownika:', err.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dni użytkownika', error: err.message });
  }
};



  
export {updateDay, deleteDay, getUserDays };
