module.exports = function(sequelize,DataTypes){
	var Employee = sequelize.define("Employee",{
		name:{
			type: DataTypes.STRING
		},
		date_of_birth:{
			type: DataTypes.DATE
		}
	});
	Employee.associate = function(models) {
	    // We're saying that a Shift should belong to an Employee
	    // A Post can't be created without an Author due to the foreign key constraint
	    Employee.hasMany(models.Shift, {
		  onDelete: "cascade"
		});
	};
	return Employee;
};