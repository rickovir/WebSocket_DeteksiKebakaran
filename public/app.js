var socket = io.connect('http://35.240.229.129');
// var socket = io.connect('http://localhost:3000');
    socket.on('chat', function(data){
      app.title = data.title;
    });
socket.on('userCount', function(data) { 
	app.connectCounter = data.userCount;
	console.log(data)
});
socket.on("chat", function(data){
	var suhu = parseInt(data.temp);
	var asap = parseInt(data.asap);
	data.status ="aman";
	if(suhu>45 && asap > 700 && api == "kebakaran")
		data.status="Bahaya";

	if(data.lokasi == "USR02")
	{
		app.sensorB=data;
	}else if(data.lokasi == "USR03"){
		app.sensorC=data;
	}else if(data.lokasi == "USR01"){
		app.sensorA=data;
	}
	// console.log(app.sensorB);
});
socket.on("log", function(data){
	console.log("log : ");
	console.log(data);
	app.logData.unshift(data);
	setTimeout(function(){
		$('.itemLog').removeClass('bg-primary');
	},300)
});

var app = new Vue({
	el:'#app',
	data:{
		connectCounter:0,
		map : null,
		dashboardPage:true,
		laporanPage : false,
		userPage:false,
		logPage:false,
		tittlePage:"",
		dataUser:[{
			id_user:'',
			nama_user:'',
			telepon:'',
			username:'',
			password:'',
			status:''
		}],
		sensorA:{},
		sensorB:{},
		sensorC:{},
		logData:[]
	},
	methods:{
		initMap:function(){
			// initialize map
			this.map = new GMaps({
			  div: '#map',
			  lat: -6.1490404,
			  lng: 106.8030892,
			  zoom: 14
			});
			var sensor = [{lat:"-6.1528788",lng:"106.8100892",title:"Rumah desi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah desi </h6><p>Jl. Poris Gaga</p>"}},
			{lat:"-6.1428788",lng:"106.8030892",title:"Rumah vivi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah vivi </h6><p>Jl. Pademangan nomor 12</p>"}},
			{lat:"-6.1628788",lng:"106.8070892",title:"Rumah indri",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah indri </h6><p>Jl. Kampung Gunung nomor 2</p>"}}]
			
			for(var i=0; i < sensor.length; i++)
			{
				this.map.addMarker(sensor[i]);
			}
		},
		timeStampTotime:function(t){
			t = new Date(t);
			return ""+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
		},
		fixTanggal:function(dt){
			var dateParts = dt.split("-");
			var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
			return ""+jsDate.getFullYear()+"-"+(jsDate.getMonth()+1)+"-"+jsDate.getDate();
		},
		getUser: function(){
			$.ajax({
				url: "/api/user", 
				context:this, 
				type: "GET",
				success: function(result){
					this.dataUser = result.data;
					console.log(result);
	    		}
	    	});
		},
		getLog: function(){
			$.ajax({
				url: "/api/log", 
				context:this, 
				type: "GET",
				success: function(result){
					this.logData = result.data;
					console.log(result);
	    		}
	    	});
		},
		// getActive: function(){
		// 	$.ajax({
		// 		url: "/api/last", 
		// 		context:this, 
		// 		type: "GET",
		// 		success: function(result){
		// 			this.logData = result.data;
		// 			console.log(result);
	 //    		}
	 //    	});
		// },
		toogleLog:function(){
			this.getLog();
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = true;
			this.userPage = false;
			this.tittlePage = "Halaman Log";
		},
		toogleLaporan:function(){
			this.dashboardPage = false;
			this.laporanPage = true;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Halaman Laporan";
		},
		toogleUser:function(){
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = true;
			this.tittlePage = "Halaman User";
		},
		toogleDashboard:function(){
			this.dashboardPage = true;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Dashboard";
		}
	},
	mounted: function(){
		this.getUser();

		this.initMap();
		this.toogleDashboard();
	}
});


function testMonitor(data){
	app.socket.emit('chat',data);
}