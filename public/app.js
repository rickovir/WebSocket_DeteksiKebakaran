var socket = io.connect('http://35.240.229.129');
// var socket = io.connect('http://localhost:3000');
    // socket.on('chat', function(data){
    //   app.title = data.title;
    // });
socket.on('userCount', function(data) { 
	app.connectCounter = data.userCount;
	console.log(data)
});
socket.on("chat", function(data){
	var suhu = parseInt(data.temp);
	var asap = parseInt(data.asap);
	var api = parseInt(data.api);
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
	if(data.status == "Bahaya")
	{
		app.statusAman = {
			aman: false,
			title: "Bahaya",
			subtitle:"Terjadi Kebakaran"
		}
	}
	else{
		app.statusAman = {
			aman: true,
			title: "Aman",
			subtitle:"Tidak Ada Kebakaran"
		}
	}

/*	if(data.api == "kebakaran")
	{
		for(var i =0; i<app.userSensor.length; i++)
		{
			if(app.userSensor[i].id == data.lokasi)
			{
				app.userSensor.icon= "../assets/img/api.png";
			}
		}
	}
	else
	{

	}*/
	
});
socket.on("log", function(data){
	console.log("log : ");
	console.log(data);
	app.logData.unshift(data);
	setTimeout(function(){
		$('.itemLog').removeClass('bg-primary');
	},300)
});
function travel(){
	app.initMap();
	  $("#instructions").before("<div class='section-title'>Instructions</div>");
	  app.map.travelRoute({
	    origin: [-6.1490404, 106.8030892],
	    destination: [-6.1428788, 106.8030892],
	    travelMode: 'driving',
	    step: function(e) {
	      $('#instructions').append('<li class="media"><div class="media-icon"><i class="far fa-circle"></i></div><div class="media-body">'+e.instructions+'</div></li>');
	      $('#instructions li:eq(' + e.step_number + ')').delay(450 * e.step_number).fadeIn(200, function() {
	        app.map.setCenter(e.end_location.lat(), e.end_location.lng());
	        app.map.drawPolyline({
	          path: e.path,
	          strokeColor: '#131540',
	          strokeOpacity: 0.6,
	          strokeWeight: 6
	        });
	      });
	    }
	  });
}









var app = new Vue({
	el:'#app',
	data:{
		connectCounter:0,
		map : null,
		dashboardPage:true,
		laporanPage : false,
		userPage:false,
		logPage:false,
		travelPage:false,
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
		logData:[],
		userSensor :[],
		statusAman: {
			aman: true,
			title: "Aman",
			subtitle:"Tidak Ada Kebakaran"
		}
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
			// this.userSensor = [{lat:"-6.1528788",lng:"106.8100892",title:"Rumah desi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah desi </h6><p>Jl. Poris Gaga</p>"}},
			// {lat:"-6.1428788",lng:"106.8030892",title:"Rumah vivi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah vivi </h6><p>Jl. Pademangan nomor 12</p>"}},
			// {lat:"-6.1628788",lng:"106.8070892",title:"Rumah indri",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah indri </h6><p>Jl. Kampung Gunung nomor 2</p>"}}]
			
			for(var i=0; i < this.userSensor.length; i++)
			{
				this.map.addMarker(this.userSensor[i]);
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
					for(var i=0;i<this.dataUser.length; i++)
					{
						this.userSensor.push({
							id : this.dataUser[i].id_user,
							lat : this.dataUser[i].lat,
							lng : this.dataUser[i].lng,
							title: "Rumah "+this.dataUser[i].nama_user,
							icon: "../assets/img/sensor.png",
							infoWindow:{
								content:"<h6>Rumah "+this.dataUser[i].nama_user+" </h6><p>"+this.dataUser[i].nama_user+"</p>"
							}
						}) 
					}
					// console.log(this.userSensor);
					this.initMap();
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
		toogleTravel:function(){
			this.travelPage = true;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Travel";
		},
		toogleLog:function(){
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
		this.getLog();
	}
});


function testMonitor(data){
	app.socket.emit('chat',data);
}