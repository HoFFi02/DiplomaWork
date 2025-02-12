import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'day',
  timestamps: false
});


export default Day;
