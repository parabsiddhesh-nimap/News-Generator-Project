

module.exports = (sequelize, DataTypes) => {
    const customers = sequelize.define('customers', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email : {
            type: DataTypes.STRING, 
            unique: true,
            allowNull: false
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone : {
            type: DataTypes.STRING,
            unique: true,
        }
    },);
    return customers;
};
