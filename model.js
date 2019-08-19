var mysql      = require('mysql');

module.exports = {
	connection:function(){
		return mysql.createConnection({
		  host     : '35.240.229.129',
		  user     : 'vivi',
		  password : 'vivi13',
		  database : 'db_damkar(1)'
		});
	}
};