import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Meal = sequelize.define('Meal', {
  id_meal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'meal',
  timestamps: false
});

export default Meal;
