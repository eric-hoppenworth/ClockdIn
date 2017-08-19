module.exports = function(sequelize,DataTypes){
	var Employee = sequelize.define("Employee",{
		name:{
			type: DataTypes.STRING
		},
		date_of_birth:{
			type: DataTypes.DATE
		},
		is_manager:{
			type: DataTypes.BOOLEAN
		}
	});
	Employee.associate = function(models) {
		// We are saying that an Employee has many shifts
	    Employee.hasMany(models.Shift, {
		  onDelete: "cascade"
		});
	};
	return Employee;
};