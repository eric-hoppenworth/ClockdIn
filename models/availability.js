module.exports = function (sequelize, DataTypes) {
	var Availability = sequelize.define("Availability", {
		monday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		monday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		tuesday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		tuesday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		wednesday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		wednesday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		thursday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		thursday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		friday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		friday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		saturday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		saturday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		sunday_start:{
			type: DataTypes.TIME,
			defaultValue: "06:00:00"
		},
		sunday_end:{
			type: DataTypes.TIME,
			defaultValue: "23:00:00"
		},

		EmployeeId: {
			type: DataTypes.INTEGER
		}
	});
	Availability.associate = function (models) {
		// We're saying that a Shift should belong to an Employee
		// A Shift can't be created without an Employee due to the foreign key constraint
		Availability.belongsTo(models.Employee, {
			foreignKey: {
				allowNull: false
			}
		});
	};

	return Availability;

};