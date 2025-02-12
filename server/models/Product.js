import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  id_product: {
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
  unit_pl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit_en: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'product',
  timestamps: false
});

export default Product;
