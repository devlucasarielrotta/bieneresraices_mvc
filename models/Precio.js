import { DataTypes } from "sequelize";
import db from "../config/db.js";


const Precio = db.define('precios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    nombre:{
        type: DataTypes.STRING(30),
        allowNull:false
    },
    
});


export default Precio;