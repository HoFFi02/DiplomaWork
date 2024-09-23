import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Recipe = sequelize.define('Recipe', {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preparation: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'recipe',
  timestamps: false
});


export default Recipe;
