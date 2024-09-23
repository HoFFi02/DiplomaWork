import Recipe from '../models/Recipe.js';
import Product from '../models/Product.js';
import RecipeProduct from '../models/RecipeProduct.js';

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ['id_recipe', 'name', 'preparation'],
      include: [
        {
          model: RecipeProduct,
          attributes: ['amount'], // Jeśli chcesz uzyskać ilość produktu
          include: [
            {
              model: Product,
              as: 'product', // używamy aliasu określonego w relacji
              attributes: ['name', 'unit'],
            },
          ],
        },
      ],
    });

    if (!recipes.length) {
      return res.status(404).json({ message: 'Nie znaleziono żadnych przepisów' });
    }

    // Formatujemy wyniki
    const formattedRecipes = recipes.map((recipe) => ({
      id_recipe: recipe.id_recipe,
      name: recipe.name,
      preparation: recipe.preparation,
      ingredients: recipe.RecipeProducts.map((rp) => ({
        name: rp.product.name,
        unit: rp.product.unit,
        amount: rp.amount,
      })),
    }));

    res.status(200).json(formattedRecipes);
  } catch (error) {
    console.error('Błąd podczas pobierania przepisów:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przepisów', error: error.message });
  }
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

export { getAllRecipes, createRecipe};


