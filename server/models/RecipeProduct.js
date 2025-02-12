import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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

export default RecipeProduct;
