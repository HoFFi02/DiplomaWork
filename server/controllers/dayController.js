import db from '../app.js';

// GET /api/days
const getAllDays = (req, res) => {
  const sql = 'SELECT d.id_day, d.number_of_day, MAX(CASE WHEN m.name = "Breakfast" THEN r.name END) AS breakfast_recipe_name, MAX(CASE WHEN m.name = "Lunch" THEN r.name END) AS lunch_recipe_name, MAX(CASE WHEN m.name = "Dinner" THEN r.name END) AS dinner_recipe_name FROM day d LEFT JOIN meal m ON d.meal_id_meal = m.id_meal LEFT JOIN recipe r ON d.recipe_id_recipe = r.id_recipe GROUP BY  d.number_of_day;';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania dni:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dni', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ message: 'Nie znaleziono żadnych dni' });
    }

    res.status(200).json(results);
  });
};

// POST /api/days
const createDay = (req, res) => {
  const { number_of_day, meal_id_meal, recipe_id_recipe } = req.body;
  const sql = 'INSERT INTO day (number_of_day, meal_id_meal, recipe_id_recipe) VALUES (?, ?, ?)';
  const values = [number_of_day, meal_id_meal, recipe_id_recipe];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas tworzenia dnia:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia dnia', error: err.message });
    }

    res.status(201).json({ message: 'Dzień stworzony pomyślnie', id: result.insertId });
  });
};

// GET /api/days/:id
const getDayById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM day WHERE id_day = ?';
  const values = [id];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania dnia:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dnia', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ message: 'Dzień nie znaleziony' });
    }

    res.status(200).json(results[0]);
  });
};

// PUT /api/days/:id
const updateDay = (req, res) => {
  const { id } = req.params;
  const { number_of_day, meal_id_meal, recipe_id_recipe, user_id } = req.body;

  if (!number_of_day || !meal_id_meal || !recipe_id_recipe || !user_id) {
    return res.status(400).json({ message: 'Wymagane pola są niekompletne' });
  }

  const sql = 'UPDATE day SET recipe_id_recipe = ? WHERE user_id_user = ? AND number_of_day = ? AND meal_id_meal = ?';
  const values = [recipe_id_recipe, user_id, number_of_day, meal_id_meal];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas aktualizowania dnia:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizowania dnia', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono dnia o podanym ID lub użytkownik nie ma uprawnień do aktualizacji tego dnia' });
    }

    const sqlSelect = 'SELECT d.id_day, d.number_of_day, MAX(CASE WHEN m.name = "Breakfast" THEN r.name END) AS breakfast_recipe_name, MAX(CASE WHEN m.name = "Lunch" THEN r.name END) AS lunch_recipe_name, MAX(CASE WHEN m.name = "Dinner" THEN r.name END) AS dinner_recipe_name FROM day d LEFT JOIN meal m ON d.meal_id_meal = m.id_meal LEFT JOIN recipe r ON d.recipe_id_recipe = r.id_recipe GROUP BY  d.number_of_day;';
    db.query(sqlSelect, [user_id, number_of_day, meal_id_meal], (err, rows) => {
      if (err) {
        console.error('Błąd podczas pobierania dnia:', err.message);
        return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dnia', error: err.message });
      }

      res.json({ message: 'Dzień zaktualizowany pomyślnie', updatedDay: rows[0] });
    });
  });
};




// DELETE /api/days/:id
const deleteDay = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM day WHERE id_day = ?';
  const values = [id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas usuwania dnia:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania dnia', error: err.message });
    }

    res.json({ message: 'Dzień usunięty pomyślnie', affectedRows: result.affectedRows });
  });
};
 const getDayTest=(req, res) => {
    const { dayId } = req.params;
    const sql = 'SELECT name FROM meal WHERE id_meal IN (SELECT meal_id_meal FROM day WHERE id_day = ?)';
    
    db.query(sql, [dayId], (err, results) => {
      if (err) {
        console.error('Błąd podczas pobierania nazw posiłków dla dnia:', err);
        return res.status(500).json({ message: 'Błąd podczas pobierania nazw posiłków' });
      }
      
      const mealNames = results.map((result) => result.name);
      res.json(mealNames);
    });
};

// GET /api/days
const getUserDays = (req, res) => {
  if (!req.session || !req.session.id_user) {
      console.log('Błąd: Brak sesji użytkownika');
      return res.status(401).json({ message: 'Brak sesji użytkownika. Zaloguj się ponownie.' });
  }

  const userId = req.session.id_user; // Pobieramy ID zalogowanego użytkownika
  console.log('Id użytkownika:', userId); 

  const sql = `
  SELECT 
      day.number_of_day, 
      MAX(CASE WHEN meal.name = 'Breakfast' THEN recipe.name ELSE NULL END) AS breakfast_recipe_name,
      MAX(CASE WHEN meal.name = 'Lunch' THEN recipe.name ELSE NULL END) AS lunch_recipe_name,
      MAX(CASE WHEN meal.name = 'Dinner' THEN recipe.name ELSE NULL END) AS dinner_recipe_name
  FROM 
      day
  INNER JOIN meal ON day.meal_id_meal = meal.id_meal
  LEFT JOIN recipe_product ON day.recipe_id_recipe = recipe_product.recipe_id_recipe
  LEFT JOIN recipe ON recipe_product.recipe_id_recipe = recipe.id_recipe
  WHERE 
      day.user_id_user = ?
  GROUP BY
      day.number_of_day
  ORDER BY
      day.number_of_day;
`;



  
  db.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Błąd podczas pobierania dni użytkownika:', err.message);
          return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania dni użytkownika', error: err.message });
      }
      console.log('Wyniki zapytania:', results); 
      res.status(200).json(results);
  });
};

  
export { getAllDays, createDay, getDayById, updateDay, deleteDay, getDayTest, getUserDays };
