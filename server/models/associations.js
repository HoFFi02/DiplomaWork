import Recipe from './Recipe.js';
import Product from './Product.js';
import RecipeProduct from './RecipeProduct.js';
import User from './User.js';
import Day from './Day.js';
import Meal from './Meal.js';

const defineAssociations = () => {
  // Definiowanie asocjacji
  Recipe.hasMany(RecipeProduct, { foreignKey: 'recipe_id_recipe' });
  RecipeProduct.belongsTo(Recipe, { foreignKey: 'recipe_id_recipe' });

  Product.hasMany(RecipeProduct, { foreignKey: 'product_id_product' });
  RecipeProduct.belongsTo(Product, { foreignKey: 'product_id_product', as: 'product' });

  User.hasMany(Day, { foreignKey: 'user_id_user' });
  Day.belongsTo(User, { foreignKey: 'user_id_user' });
  Day.belongsTo(Meal, { foreignKey: 'meal_id_meal' });
Day.belongsTo(Recipe, { foreignKey: 'recipe_id_recipe' });

};

export default defineAssociations;
