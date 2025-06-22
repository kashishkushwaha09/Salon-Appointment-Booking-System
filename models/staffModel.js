const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Staff = sequelize.define('Staff', {
  id: {
    type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  },
  specializations: {
    type: DataTypes.TEXT,
    get() { return this.getDataValue('specializations')?.split(',') || []; },
    set(val) { this.setDataValue('specializations', val.join(',')); }
  }
});

module.exports = Staff;
