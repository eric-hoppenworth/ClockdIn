module.exports = function(sequelize,DataTypes){
	var Shift = sequelize.define("Shift",{
		start_time:{
			type: DataTypes.TIME
		},
		end_time: {
			type: DataTypes.TIME
		},
		date:{
			type: DataTypes.DATE
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