import db from '../app.js';

// GET /api/recipes
const getAllRecipes = (req, res) => {
  const sql = `
    SELECT r.id_recipe, r.name AS recipe_name, r.preparation, GROUP_CONCAT(p.name SEPARATOR ', ') AS ingredients
    FROM recipe r
    LEFT JOIN recipe_product rp ON r.id_recipe = rp.recipe_id_recipe
    LEFT JOIN product p ON rp.product_id_product = p.id_product
    GROUP BY r.id_recipe, r.name, r.preparation
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania przepisów:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przepisów', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ message: 'Nie znaleziono żadnych przepisów' });
    }

    res.status(200).json(results);
  });
};


// POST /api/recipes
const createRecipe = (req, res) => {
  const { name, preparation } = req.body;
  const sql = 'INSERT INTO recipe (name, preparation) VALUES (?, ?)';
  const values = [name, preparation];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas tworzenia przepisu:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia przepisu', error: err.message });
    }

    res.status(201).json({ message: 'Przepis stworzony pomyślnie', id: result.insertId });
  });
};

// GET /api/recipes/:id
const getRecipeById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM recipe WHERE id_recipe = ?';
  const values = [id];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania przepisu:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przepisu', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ message: 'Przepis nie znaleziony' });
    }

    res.status(200).json(results[0]);
  });
};

// PUT /api/recipes/:id
const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { name, preparation } = req.body;
  const sql = 'UPDATE recipe SET name = ?, preparation = ? WHERE id_recipe = ?';
  const values = [name, preparation, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas aktualizowania przepisu:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizowania przepisu', error: err.message });
    }

    res.json({ message: 'Przepis zaktualizowany pomyślnie', affectedRows: result.affectedRows });
  });
};

// DELETE /api/recipes/:id
const deleteRecipe = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM recipe WHERE id_recipe = ?';
  const values = [id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Błąd podczas usuwania przepisu:', err.message);
      return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania przepisu', error: err.message });
    }

    res.json({ message: 'Przepis usunięty pomyślnie', affectedRows: result.affectedRows });
  });
};
const getRecipeTest = (req, res) => {
    const { recipeId } = req.params;
    const sql = 'SELECT name FROM product WHERE id_product IN (SELECT product_id_product FROM recipe_product WHERE recipe_id_recipe = ?)';
    
    db.query(sql, [recipeId], (err, results) => {
      if (err) {
        console.error('Błąd podczas pobierania składników przepisu:', err);
        return res.status(500).json({ message: 'Błąd podczas pobierania składników przepisu' });
      }
      
      const ingredients = results.map((result) => result.name);
      res.json(ingredients);
    });
  };
export { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe , getRecipeTest};
