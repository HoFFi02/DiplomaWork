import Recipe from './Recipe.js';
import Product from './Product.js';
import RecipeProduct from './RecipeProduct.js';

const defineAssociations = () => {
  // Definiowanie asocjacji
  Recipe.hasMany(RecipeProduct, { foreignKey: 'recipe_id_recipe' });
  RecipeProduct.belongsTo(Recipe, { foreignKey: 'recipe_id_recipe' });

  Product.hasMany(RecipeProduct, { foreignKey: 'product_id_product' });
  RecipeProduct.belongsTo(Product, { foreignKey: 'product_id_product', as: 'product' });
};

export default defineAssociations;
