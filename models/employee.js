var bcrpyt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
	var Employee = sequelize.define("Employee", {
		name: {
			type: DataTypes.STRING
		},
		date_of_birth: {
			type: DataTypes.DATE
		},
		email: {
			type: DataTypes.STRING
		},
		password: {
			type: DataType.STRING
		}
	});
	Employee.associate = function (models) {
		// We're saying that a Shift should belong to an Employee
		// A Shift can't be created without an Employee due to the foreign key constraint
		Employee.hasMany(models.Shift, {
			onDelete: "cascade"
		});
	};
	//hash password db entries
	Employee.methods.generateHash = function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	//check if password is valid
	Employee.methods.validPassword = function (password) {
		return bcrypt.compareSync(password, this.local.password);

	};

	return Employee;

};