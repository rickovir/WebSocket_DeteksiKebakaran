/* db connection */
const db = require('./model.js');
var con = db.connection();
// start connection
con.connect();

/* server */
const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.json());

app.use(express.static('public'));

const port = process.env.PORT || 3000;

var server = app.listen(port, () => console.log(`listening on port ${port}..`));

var io = socket(server);

var userCount = 0;

io.on('connection', function(client){
	console.log('made socket connection ', client.id)
	userCount++;
	io.sockets.emit('userCount', { userCount: userCount });
	client.on('disconnect', function() {
		userCount--;
		io.sockets.emit('userCount', { userCount: userCount });
	});

	client.on('chat', function(data){
		io.sockets.emit('chat',data);
		var d = new Date();
		var waktuNow = ""+d.getHours()+":"+d.getMinutes()+"";
		var id = data.lokasi;
		var sql = `select alamat from tb_user where id_user='${id}' and lastupdate='${waktuNow}'`;
		con.query(sql,
			(error, results, fields)=>{
				if(error){
					io.sockets.emit('log',"error : "+error);
				}
					// console.log(sql);

				if(results.length == 0){
					sql = `select nama_user,alamat from tb_user where id_user='${id}'`;
					con.query(sql,
						(error, results, fields)=>{
							if(error){
								io.sockets.emit('log',"error : "+error);
							}
						// console.log(sql);

					data.waktu = ""+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
					data.tanggal = ""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
					data.lokasi = "Rumah "+results[0].nama_user+", "+results[0].alamat;
					data.status = "Aman";
					data.keterangan = "Aman";
					data.id_user = id;
					if(data.temp>45 && data.asap > 700 && data.api == "kebakaran"){
						data.status = "Bahaya";
						data.keterangan = "Peringatan Bahaya";
					}

					io.sockets.emit('log',data);
					sql = `
							insert into tb_log2
							(tanggal, waktu, temp, asap, api, status, lokasi, keterangan,id_user)
							values( 
							'${data.tanggal}',
							'${data.waktu}',
							'${data.temp}',
							'${data.asap}',
							'${data.api}',
							'${data.status}',
							'${data.lokasi}',
							'${data.keterangan}',
							'${data.id_user}'
							)`;
						con.query(sql,	
							(error, results, fields)=> {
								if(error)
									throw error;
								// console.log(sql);
								// changelast update
								sql = `
									update tb_user set lastupdate='${waktuNow}' where id_user='${id}'
									`;
								con.query(sql,	
									(error, results, fields)=> {
										if(error)
											throw error;

										// console.log(sql);
									});
							});
						});
				}
			});

	});
    
});


app.get('/api/user',(req,res)=>{
	con.query(`select * from tb_user`,
		(error, results, fields)=>{
			if(error){
				// throw error;
				res.send({
					"code":400,
					"failed":"error ocurred",
					"error" : error,
					"enter":"N"
				});
			}
			else
			{
				res.send({
					"code":200,
					"status": "OK",
					"data":results
				});
			}
		});
});

app.get('/api/log',(req,res)=>{
	con.query(`select * from tb_log2 order by tanggal desc limit 25`,
		(error, results, fields)=>{
			if(error){
				// throw error;
				res.send({
					"code":400,
					"failed":"error ocurred",
					"error" : error,
					"enter":"N"
				});
			}
			else
			{
				res.send({
					"code":200,
					"status": "OK",
					"data":results
				});
			}
		});
});
app.get('/api/last',(req,res)=>{
	con.query(`SELECT distinct(id_user) FROM tb_log2 WHERE waktu BETWEEN '${req.body.awal}' and '${req.body.akhir}'`,
		(error, results, fields)=>{
			if(error){
				// throw error;
				res.send({
					"code":400,
					"failed":"error ocurred",
					"error" : error,
					"enter":"N"
				});
			}
			else
			{
				res.send({
					"code":200,
					"status": "OK",
					"data":results
				});
			}
		});
});