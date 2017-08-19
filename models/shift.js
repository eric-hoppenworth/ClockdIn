module.exports = function(sequelize,DataTypes){
	var Shift = sequelize.define("Shift",{
		start_time:{
			type: DataTypes.DATE
		},
		end_time: {
			type: DataTypes.DATE
		},
		date:{
			type: DataTypes.DATE
		}
	});
	Shift.associate = function(models) {
	    // A Post can't be created without an Author due to the foreign key constraint
	    Shift.belongsTo(models.Employee, {
		  foreignKey: {
				allowNull: false
			}
		});
	};
	return Shift;
};