module.exports = function (sequelize, DataTypes) {
	var Employee = sequelize.define("Employee", {
		name: {
			type: DataTypes.STRING
		},
		date_of_birth: {
			type: DataTypes.DATE
		},
		is_manager:{
			type: DataTypes.BOOLEAN
		}
	});
	Employee.associate = function (models) {
		// We're saying that a Shift should belong to an Employee
		// A Shift can't be created without an Employee due to the foreign key constraint
		Employee.hasMany(models.Shift, {
			onDelete: "cascade"
		});
		Employee.belongsTo(models.User, {

		});
		Employee.hasOne(models.Availability, {
			
		});
	};

	return Employee;

};