import db from '../app.js'; // import Sequelize instance
import ShoppingList from '../models/ShoppingList.js'
import RecipeProduct from '../models/RecipeProduct.js'
import Product from '../models/Product.js'
import Recipe from '../models/Recipe.js'
import Day from '../models/Day.js'
import sequelize from '../config/db.js';
import { Op } from 'sequelize';


const getShoppingList = async (req, res) => {
  const { userId } = req.params;

  try {
    const shoppingList = await ShoppingList.findAll({
      where: { user_id_user: userId },
      include: [
        {
          model: RecipeProduct,
          as: 'recipeProduct', // Ensure this matches the association alias in your models
          include: [
            {
              model: Product,
              as: 'product' // Ensure this matches the association alias in your models
            }
          ]
        }
      ]
    });

    const formattedList = shoppingList.map(item => ({
      recipe_product_id: item.recipeProduct.id_recipe_product,
      product_name: item.recipeProduct.product.name,
      amount: item.amount,
      unit: item.recipeProduct.product.unit
    }));

    console.log(formattedList);
    res.json(formattedList);
  } catch (error) {
    console.error('Błąd podczas pobierania listy zakupów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania listy zakupów.' });
  }
};


 const resetShoppingList = (req, res) => {
  
    const reset = `DELETE FROM shopping_list`;
    db.query(reset, (err, results) => {
      if(err){
        console.error('Błąd resetu:', err);
        return res.status(500).json({err: 'Błąd resetu'});
    }
    console.log('Reset udany');
  });
  };
 
  
  const updateShoppingList = async (req, res) => {
    const { userId } = req.params;
    const { number_of_day , meal_id_meal} = req.body;
  

    try {
      // Pobranie id przepisów z danego dnia
      const day = await Day.findOne({
        where: {
          user_id_user: userId,
          number_of_day: number_of_day,
          meal_id_meal: meal_id_meal,
        },
        attributes: ['recipe_id_recipe'],
      });
     

      if (!day) {
        return res.status(404).json({ message: 'Dzień nie został znaleziony' });
      }
  
      // Pobranie składników powiązanych z przepisem
      const ingredients = await RecipeProduct.findAll({
        attributes: ['id_recipe_product', 'amount'],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['name', 'unit'],
          },
        ],
        where: {
          recipe_id_recipe: day.recipe_id_recipe,
        },
      });
      

      if (!ingredients || ingredients.length === 0) {
        return res.status(404).json({ message: 'Nie znaleziono składników dla podanego dnia' });
      }
  
      // Grupowanie składników według nazwy produktu i sumowanie ilości
      const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        const productName = ingredient.product.name;
  
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
    

      // Sprawdzenie, które produkty już istnieją na liście zakupów
      const existingProducts = await ShoppingList.findAll({
        attributes: ['id_shopping_list', 'amount'],
        where: {
          user_id_user: userId,
        },
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
                attributes: ['name'],
                where: {
                  name: {
                    [Op.in]: productNames,
                  },
                },
              },
            ],
          },
        ],
      });
      

      // Aktualizacja ilości istniejących produktów
      const updatePromises = existingProducts.map((product) => {
        if (!product.recipeProduct || !product.recipeProduct.product) {
          console.warn(`Nieprawidłowy wpis w istniejących produktach dla id: ${product.id_shopping_list}`);
          return Promise.resolve(); // Pomijamy produkt, który nie ma poprawnej relacji
        }
        const productName = product.recipeProduct.product.name;
        const additionalAmount = groupedIngredients[productName].amount;
        const newAmount = product.amount + additionalAmount;
  
        return product.update({ amount: newAmount });
      });
      

      // Dodanie nowych produktów do listy zakupów
      const newProducts = productNames.filter(
        (name) => !existingProducts.some((product) => product.recipeProduct.product.name === name)
      );
     
      const insertPromises = newProducts.map((productName) => {
        const { amount, recipe_product_id } = groupedIngredients[productName];
  
        return ShoppingList.create({
          amount: amount,
          recipe_product_id_recipe_product: recipe_product_id,
          user_id_user: userId,
        });
      });
  
      // Wykonanie wszystkich operacji
      await Promise.all([...updatePromises, ...insertPromises]);
      


      res.status(200).json({ message: 'Lista zakupów zaktualizowana pomyślnie' });
    } catch (err) {
      console.error('Błąd serwera:', err.message);
      console.error('Błąd podczas wykonywania Promise:', err.message, err.stack);
      res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
  };
 

  const deleteFromShoppingList = async (req, res) => {
    const { userId } = req.params;
    const { number_of_day } = req.body;
  
    try {
      // Pobranie składników z RecipeProduct na podstawie recipe_id_recipe
      const ingredients = await RecipeProduct.findAll({
        include: [
          {
            model: Product, // Dołączanie produktów powiązanych z RecipeProduct
            as: 'product',  // Poprawiony alias
          },
          {
            model: Recipe,  // Dołączanie przepisów powiązanych z RecipeProduct
            where: { id_recipe: sequelize.col('RecipeProduct.recipe_id_recipe') }
          }
        ]
      });
  
      // Grupowanie składników według produktu
      const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        if (!acc[ingredient.product.name]) {
          acc[ingredient.product.name] = { amount: 0, recipe_product_id: ingredient.id_recipe_product };
        }
        acc[ingredient.product.name].amount += ingredient.amount;
        return acc;
      }, {});
  
      const productNames = Object.keys(groupedIngredients);
  
      // Sprawdzenie, które produkty już istnieją na liście zakupów
      const existingProducts = await ShoppingList.findAll({
        where: { user_id_user: userId },
        include: [
          {
            model: RecipeProduct,
            as: 'recipeProduct',
            include: [
              { 
                model: Product, 
                as: 'product', // Zmieniony alias
              }
            ],
            //where: { '$recipeProduct.product.name$': productNames }
          }
        ]
      });
  
      // Aktualizacja istniejących produktów
      const updatePromises = existingProducts.map(async (product) => {
        const ingredientAmount = groupedIngredients[product.recipeProduct.product.name]?.amount;
  
        if (ingredientAmount) {
          const newAmount = product.amount - ingredientAmount;
  
          // Jeśli nowa ilość <= 0, usuń produkt
          if (newAmount <= 0) {
            await product.destroy(); // Usunięcie produktu
          } else {
            // Zaktualizuj ilość produktu
            product.amount = newAmount;
            await product.save();
          }
        }
      });
  
      // Oczekiwanie na zakończenie wszystkich operacji
      await Promise.all(updatePromises);
  
      res.status(200).json({ message: 'Lista zakupów zaktualizowana pomyślnie.' });
    } catch (err) {
      console.error('Błąd podczas aktualizacji listy zakupów:', err);
      res.status(500).json({ message: 'Błąd podczas aktualizacji listy zakupów.', error: err.message });
    }
  };
  
  
export {getShoppingList, updateShoppingList, resetShoppingList, deleteFromShoppingList};