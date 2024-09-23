import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import RecipeProduct from './RecipeProduct.js';

const ShoppingList = sequelize.define('ShoppingList', {
  id_shopping_list: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipe_product_id_recipe_product: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'shopping_list',
  timestamps: false
});
ShoppingList.belongsTo(User, { foreignKey: 'user_id_user' });
ShoppingList.belongsTo(RecipeProduct, { foreignKey: 'recipe_product_id_recipe_product', as: 'recipeProduct', });
export default ShoppingList;
