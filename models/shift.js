module.exports = function(sequelize,DataTypes){
	var Shift = sequelize.define("Shift",{
		start_time:{
			type: DataTypes.TIME,
			allowNull: false
		},
		end_time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		date:{
			type: DataTypes.DATE,
			allowNull: false
		},
		position:{
			type: DataTypes.STRING,
			defaultValue: "other"
		},
		EmployeeId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	});
	Shift.associate = function(models) {
	    // We're saying that a Shift should belong to an Employee
	    Shift.belongsTo(models.Employee, {
		  foreignKey: {
				allowNull: false
			}
		});
	};
	return Shift;
};