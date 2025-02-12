import ShoppingList from '../models/ShoppingList.js'
import RecipeProduct from '../models/RecipeProduct.js'
import Product from '../models/Product.js'
import Day from '../models/Day.js'
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

const getShoppingList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const language = req.query.language || 'pl'; 
  const { userId } = req.params;
  const { months } = req.query;
  const userIdSession = req.session.user.id_user;

  if (userId != userIdSession) {
    return res.status(403).json({ message: 'Nie masz uprawnień do tego zasobu' });
  }

  try {
    const whereClause = { user_id_user: userIdSession };
    if (months && months.length > 0) {
      whereClause.month = { [Op.in]: months };
    }

    const shoppingList = await ShoppingList.findAll({
      where: whereClause,
      include: [
        {
          model: RecipeProduct,
          as: 'recipeProduct',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [
                'id_product',
                language === 'pl' ? 'name_pl' : 'name_en',
                language === 'pl' ? 'unit_pl' : 'unit_en',
              ],
            },
          ],
        },
      ],
    });

    
    const productMap = shoppingList.reduce((acc, item) => {
      const productName = language === 'pl' ? item.recipeProduct.product.name_pl : item.recipeProduct.product.name_en;
      const unit = language === 'pl' ? item.recipeProduct.product.unit_pl : item.recipeProduct.product.unit_en;
      const key = `${productName}-${unit}`;

      if (!acc[key]) {
        acc[key] = {
          recipe_product_id: item.recipeProduct.id_recipe_product,
          product_name: productName,
          amount: 0,
          unit: unit,
        };
      }

      acc[key].amount += item.amount;
      return acc;
    }, {});

    const formattedList = Object.values(productMap);

    res.status(200).json(formattedList);
  } catch (error) {
    console.error('Błąd podczas pobierania listy zakupów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania listy zakupów.' });
  }
};

const updateShoppingList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const language = req.query.language || 'pl';
  const { userId } = req.params;
  const { number_of_day, month, meal_id_meal } = req.body;

  try {
    const day = await Day.findOne({
      where: {
        user_id_user: userId,
        number_of_day,
        month,
        meal_id_meal,
      },
      attributes: ['recipe_id_recipe'],
    });

    if (!day) {
      return res.status(404).json({ message: 'Dzień nie został znaleziony' });
    }

    const ingredients = await RecipeProduct.findAll({
      attributes: ['id_recipe_product', 'amount'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id_product',
            language === 'pl' ? 'name_pl' : 'name_en',
            language === 'pl' ? 'unit_pl' : 'unit_en',
          ],
        },
      ],
      where: { recipe_id_recipe: day.recipe_id_recipe },
    });

    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      const productName = language === 'pl' ? ingredient.product.name_pl : ingredient.product.name_en;

      if (!acc[productName]) {
        acc[productName] = {
          amount: 0,
          recipe_product_id: ingredient.id_recipe_product,
        };
      }
      acc[productName].amount += ingredient.amount;
      return acc;
    }, {});

    const productNames = Object.keys(groupedIngredients);

    const existingProducts = await ShoppingList.findAll({
      attributes: ['id_shopping_list', 'amount', 'month'],
      where: { user_id_user: userId, month },
      include: [
        {
          model: RecipeProduct,
          as: 'recipeProduct',
          required: true,
          attributes: ['product_id_product'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [language === 'pl' ? 'name_pl' : 'name_en'],
              where: { [language === 'pl' ? 'name_pl' : 'name_en']: { [Op.in]: productNames } },
            },
          ],
        },
      ],
    });

    const updatePromises = existingProducts.map((product) => {
      const productName = language === 'pl' ? product.recipeProduct.product.name_pl : product.recipeProduct.product.name_en;
      const additionalAmount = groupedIngredients[productName].amount;
      const newAmount = product.amount + additionalAmount;

      return product.update({ amount: newAmount });
    });

    const newProducts = productNames.filter(
      (name) => !existingProducts.some((product) =>
        language === 'pl'
          ? product.recipeProduct.product.name_pl === name
          : product.recipeProduct.product.name_en === name
      )
    );

    const insertPromises = newProducts.map((productName) => {
      const { amount, recipe_product_id } = groupedIngredients[productName];

      return ShoppingList.create({
        amount,
        recipe_product_id_recipe_product: recipe_product_id,
        user_id_user: userId,
        month,
      });
    });

    await Promise.all([...updatePromises, ...insertPromises]);

    res.status(200).json({ message: 'Lista zakupów zaktualizowana pomyślnie' });
  } catch (err) {
    console.error('Błąd serwera:', err.message);
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
};

  const deleteFromShoppingList = async (req, res) => {
    const language = req.query.language || 'pl';
    const { userId } = req.params;
    const { number_of_day, recipe_id_recipe } = req.body;
  
    try {
      const ingredients = await RecipeProduct.findAll({
        where: { recipe_id_recipe },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: [
              'id_product',
              language === 'pl' ? 'name_pl' : 'name_en',
              language === 'pl' ? 'unit_pl' : 'unit_en',
            ],
          },
        ],
      });
  
      const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        const productName = language === 'pl' ? ingredient.product.name_pl : ingredient.product.name_en;
        if (!acc[productName]) {
          acc[productName] = { amount: 0, recipe_product_id: ingredient.id_recipe_product };
        }
        acc[productName].amount += ingredient.amount;
        return acc;
      }, {});
  
      const productNames = Object.keys(groupedIngredients);
  
      const existingProducts = await ShoppingList.findAll({
        where: { user_id_user: userId },
        include: [
          {
            model: RecipeProduct,
            as: 'recipeProduct',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: [language === 'pl' ? 'name_pl' : 'name_en'],
              },
            ],
          },
        ],
      });
  
      const updatePromises = existingProducts.map(async (product) => {
        const productName = language === 'pl' ? product.recipeProduct.product.name_pl : product.recipeProduct.product.name_en;
        const ingredientAmount = groupedIngredients[productName]?.amount;
  
        if (ingredientAmount) {
          const newAmount = product.amount - ingredientAmount;
  
          if (newAmount <= 0) {
            await product.destroy();
          } else {
            product.amount = newAmount;
            await product.save();
          }
        }
      });
  
      await Promise.all(updatePromises);
  
      res.status(200).json({ message: 'Lista zakupów zaktualizowana pomyślnie.' });
    } catch (err) {
      console.error('Błąd podczas aktualizacji listy zakupów:', err.message);
      res.status(500).json({ message: 'Błąd podczas aktualizacji listy zakupów.', error: err.message });
    }
  };
  
  
  
export {getShoppingList, updateShoppingList, deleteFromShoppingList};