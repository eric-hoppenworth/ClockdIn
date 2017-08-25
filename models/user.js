module.exports = function(sequelize, Sequelize) {
	
	   var User = sequelize.define('User', {
	
			id: {
			   autoIncrement: true,
			   primaryKey: true,
			   type: Sequelize.INTEGER
			},

			firstname: {
			   type: Sequelize.STRING,
			   notEmpty: true
			},

			lastname: {
			   type: Sequelize.STRING,
			   notEmpty: true
			},

			username: {
			   type: Sequelize.TEXT
			},
			email: {
			   type: Sequelize.STRING,
			   validate: {
				   isEmail: true
			   }
			},
			password: {
			   type: Sequelize.STRING,
			   allowNull: false
			},
			EmployeeId:{
				type: Sequelize.INTEGER,
				allowNull: false
			},
			imageURL:{
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: "/assets/images/ClockdInAppIcon.png"
			}
	   });
	   User.associate = function(models) {
		    // We're saying that a Shift should belong to an Employee
		    User.hasOne(models.Employee, {
			  foreignKey: {
					allowNull: false
				}
			});
		};
	
	   return User;
	
   }