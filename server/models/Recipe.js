import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recipe = sequelize.define('Recipe', {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name_pl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preparation_pl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preparation_en: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'recipe',
  timestamps: false
});

export default Recipe;
