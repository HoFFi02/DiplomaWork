import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Meal from './Meal.js';
import Recipe from './Recipe.js';

const Day = sequelize.define('Day', {
  id_day: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number_of_day: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  meal_id_meal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recipe_id_recipe: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'day',
  timestamps: false
});

Day.belongsTo(Meal, { foreignKey: 'meal_id_meal' });
Day.belongsTo(Recipe, { foreignKey: 'recipe_id_recipe' });

export default Day;
