import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
//import Recipe from './Recipe.js';
//import Product from './Product.js';


const RecipeProduct = sequelize.define('RecipeProduct', {
  id_recipe_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipe_id_recipe: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id_product: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'recipe_product',
  timestamps: false
});
//RecipeProduct.belongsTo(Recipe, { foreignKey: 'recipe_id_recipe' });
//RecipeProduct.belongsTo(Product, { foreignKey: 'product_id_product',   as: 'product'  });
export default RecipeProduct;
