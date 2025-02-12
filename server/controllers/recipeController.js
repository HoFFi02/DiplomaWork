import Recipe from '../models/Recipe.js';
import Product from '../models/Product.js';
import RecipeProduct from '../models/RecipeProduct.js';
import axios from 'axios';

const getAllRecipes = async (req, res) => {
  const language = req.query.language || 'pl';

  try {
    const recipes = await Recipe.findAll({
      attributes: ['id_recipe', language === 'pl' ? 'name_pl' : 'name_en', language === 'pl' ? 'preparation_pl' : 'preparation_en'],
      include: [
        {
          model: RecipeProduct,
          attributes: ['amount'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [language === 'pl' ? 'name_pl' : 'name_en', language === 'pl' ? 'unit_pl' : 'unit_en'],
            },
          ],
        },
      ],
    });

    const formattedRecipes = recipes.map((recipe) => ({
      id_recipe: recipe.id_recipe,
      name: recipe[language === 'pl' ? 'name_pl' : 'name_en'],
      preparation: recipe[language === 'pl' ? 'preparation_pl' : 'preparation_en'],
      ingredients: recipe.RecipeProducts.map((rp) => ({
        name: rp.product[language === 'pl' ? 'name_pl' : 'name_en'],
        unit: rp.product[language === 'pl' ? 'unit_pl' : 'unit_en'],
        amount: rp.amount,
      })),
    }));
   
    res.status(200).json(formattedRecipes);
  } catch (error) {
    console.error('Błąd podczas pobierania przepisów:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przepisów', error: error.message });
  }
};

const getRecipe = async (req, res) => {
  const language = req.query.language || 'pl';
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findOne({
      where: { id_recipe: recipeId },
      attributes: ['id_recipe', language === 'pl' ? 'name_pl' : 'name_en', language === 'pl' ? 'preparation_pl' : 'preparation_en'],
      include: [
        {
          model: RecipeProduct,
          attributes: ['amount'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [language === 'pl' ? 'name_pl' : 'name_en', language === 'pl' ? 'unit_pl' : 'unit_en'],
            },
          ],
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Nie znaleziono przepisu' });
    }

    const formattedRecipe = {
      id_recipe: recipe.id_recipe,
      name: recipe[language === 'pl' ? 'name_pl' : 'name_en'],
      preparation: recipe[language === 'pl' ? 'preparation_pl' : 'preparation_en'],
      ingredients: recipe.RecipeProducts.map((rp) => ({
        name: rp.product[language === 'pl' ? 'name_pl' : 'name_en'],
        unit: rp.product[language === 'pl' ? 'unit_pl' : 'unit_en'],
        amount: rp.amount,
      })),
    };

    res.status(200).json(formattedRecipe);
  } catch (error) {
    console.error('Błąd podczas pobierania przepisu:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania przepisu', error: error.message });
  }
};

const translateText = async (text, targetLanguage) => {

  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        auth_key: '3a07e08e-b84e-4cf8-8fc6-5a57eaa24875:fx', 
        text: text,
        target_lang: targetLanguage,
      },
    });
    return response.data.translations[0].text;
  } catch (error) {
    console.error('Błąd podczas tłumaczenia:', error.message);
    return text; 
  }
};

const createRecipe = async (req, res) => {
  const { name, preparation, ingredients } = req.body; 
  const language = req.query.language || 'pl'; 
console.log('ccccccc'+ language);
  try {
    let namePl = name;
    let preparationPl = preparation;
    let nameEn = name;
    let preparationEn = preparation;

    if (language === 'pl') {
      
      nameEn = await translateText(name, 'EN');
      preparationEn = await translateText(preparation, 'EN');
    } else if (language === 'en') {
    
      namePl = await translateText(name, 'PL');
      preparationPl = await translateText(preparation, 'PL');
    }

  
    const newRecipe = await Recipe.create({
      name_pl: namePl,
      name_en: nameEn,
      preparation_pl: preparationPl,
      preparation_en: preparationEn,
    });

    const recipeProductData = ingredients.map((ingredient) => ({
      recipe_id_recipe: newRecipe.id_recipe,
      product_id_product: ingredient.productId,
      amount: ingredient.amount,
    }));

    await RecipeProduct.bulkCreate(recipeProductData);

    res.status(201).json({ message: 'Przepis stworzony pomyślnie', id: newRecipe.id_recipe });
  } catch (error) {
    console.error('Błąd podczas tworzenia przepisu:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia przepisu', error: error.message });
  }
};

export { getAllRecipes, getRecipe,createRecipe};


