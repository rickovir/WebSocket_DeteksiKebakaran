var socket = io.connect('http://35.240.229.129');
// var socket = io.connect('http://localhost:3000');
    // socket.on('chat', function(data){
    //   app.title = data.title;
    // });
socket.on('userCount', function(data) { 
	app.connectCounter = data.userCount;
	app.connectCounter--;
	console.log(data);
});
socket.on("settings", function(data){
	console.log(data);
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

	initDataTempChart();
	
});
socket.on("log", function(data){
	console.log("log : ");
	console.log(data);
	app.logData.unshift(data);
	setTimeout(function(){
		$('.itemLog').removeClass('bg-primary');
	},300)

	initTempChart();
	initDataTempChart();
});
function travel(){
	app.initMapDirection();
	console.log(app.mapsDirection);
	  $("#instructions").before("<div class='section-title'>Instructions</div>");
	  app.map.travelRoute({
	    origin: [-6.1621916, 106.8088983],
	    destination: [app.mapsDirection.lat, app.mapsDirection.lng],
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

function initTempChart()
{
	app.tempChart.ctx = document.getElementById("tempChart").getContext('2d');
	app.tempChart.chart = new Chart(app.tempChart.ctx, {
	  type: 'line',
	  data: {
	    labels: [],
	    datasets: []
	  },
	  options: {
	    legend: {
	      display: true
	    },
	    scales: {
	      yAxes: [{
	        gridLines: {
	          drawBorder: false,
	          color: '#f2f2f2',
	        },
	        ticks: {
	          beginAtZero: true,
	          stepSize: 150
	        }
	      }],
	      xAxes: [{
	        ticks: {
	          display: true
	        },
	        gridLines: {
	          display: true
	        }
	      }]
	    },
	  }
	});
}
function initDataTempChart(){
	var dataSet1 = 
	{
		label: 'USR01',
		data: [],
		borderWidth: 2,
		// backgroundColor: '#6777ef',
		borderColor: '#6777ef',
		borderWidth: 2.5,
		pointBackgroundColor: '#ffffff',
		pointRadius: 4
	};	

	var dataSet2 = 
	{
		label: 'USR02',
		data: [],
		borderWidth: 2,
		// backgroundColor: '#34395e',
		borderColor: '#34395e',
		borderWidth: 2.5,
		pointBackgroundColor: '#ffffff',
		pointRadius: 4
	};	

	var dataSet3 = 
	{
		label: 'USR03',
		data: [],
		borderWidth: 2,
		// backgroundColor: '#34395e',
		borderColor: '#34395e',
		borderWidth: 2.5,
		pointBackgroundColor: '#ffffff',
		pointRadius: 4
	};	
	tempChartAddSensor(dataSet1);
	tempChartAddSensor(dataSet2);
	tempChartAddSensor(dataSet3);
}
function tempChartAddSensor(dataset){
	app.tempChart.chart.data.datasets.push(dataset);
	app.tempChart.chart.update();
}
function tempChartAddLabel(label){
	app.tempChart.chart.data.labels.push(label);
}
function tempChartAddData(data, who){
	app.tempChart.chart.data.datasets.filter(dataset => {
		if(dataset.label == who)
		{
			dataset.data.push(data);
		}
	});
	app.tempChart.chart.update();
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
		settingPage:false,
		tittlePage:"",
		dataUser:[{
			id_user:'',
			nama_user:'',
			telepon:'',
			username:'',
			password:'',
			status:''
		}],
		suhu : 45,
		asap : 700,
		sensorA:{},
		sensorB:{},
		sensorC:{},
		userDirection:{},
		logData:[],
		userSensor :[],
		mapsDirection : {},
		tempChart : {
			ctx :null,
			chart :null,
			labels : [],
			dataSet : []
		},
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
			  lat: -6.1621916,
			  lng: 106.8088983,
			  zoom: 13
			});
			// this.userSensor = [{lat:"-6.1528788",lng:"106.8100892",title:"Rumah desi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah desi </h6><p>Jl. Poris Gaga</p>"}},
			// {lat:"-6.1428788",lng:"106.8030892",title:"Rumah vivi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah vivi </h6><p>Jl. Pademangan nomor 12</p>"}},
			// {lat:"-6.1628788",lng:"106.8070892",title:"Rumah indri",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah indri </h6><p>Jl. Kampung Gunung nomor 2</p>"}}]
			
			for(var i=0; i < this.userSensor.length; i++)
			{
				this.map.addMarker(this.userSensor[i]);
			}
		},
		initMapDirection:function(){
			// initialize map
			this.map = new GMaps({
			  div: '#map',
			  lat: -6.1621916,
			  lng: 106.8088983,
			  zoom: 14
			});
			// this.userSensor = [{lat:"-6.1528788",lng:"106.8100892",title:"Rumah desi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah desi </h6><p>Jl. Poris Gaga</p>"}},
			// {lat:"-6.1428788",lng:"106.8030892",title:"Rumah vivi",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah vivi </h6><p>Jl. Pademangan nomor 12</p>"}},
			// {lat:"-6.1628788",lng:"106.8070892",title:"Rumah indri",icon:"../assets/img/sensor.png",infoWindow:{content:"<h6>Rumah indri </h6><p>Jl. Kampung Gunung nomor 2</p>"}}]
			this.map.addMarker({lat:"-6.1621916",lng:"106.8088983",title:"PEMADAM KEBAKARAN ",icon:"../assets/img/firefighter.png",infoWindow:{content:"<h6>Pemadam Kebakaran DKI Jakarta </h6><p>Jakarta Fire and Rescue Agency, Jalan Kyai Haji Zainul Arifin, RT.7/RW.10, Duri Pulo, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta</p>"}});
					
			this.map.addMarker(this.userDirection);
			
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
		setDirection: function(lat,lng){
			console.log(lat);
			console.log(lng);
			for(var i =0; i < this.userSensor.length;i++){
				if(this.userSensor[i].lat == lat && this.userSensor[i].lng)
				{
					this.userDirection = this.userSensor[i];
				}
			}
			this.mapsDirection = {
				lat : parseFloat(lat),
				lng : parseFloat(lng)
			};

			console.log(this.mapsDirection);
			this.toogleTravel();
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
					this.userSensor.push({lat:"-6.1621916",lng:"106.8088983",title:"PEMADAM KEBAKARAN ",icon:"../assets/img/firefighter.png",infoWindow:{content:"<h6>Pemadam Kebakaran DKI Jakarta </h6><p>Jakarta Fire and Rescue Agency, Jalan Kyai Haji Zainul Arifin, RT.7/RW.10, Duri Pulo, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta</p>"}});
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
		getSetting: function(){
			$.ajax({
				url: "/api/showsetting", 
				context:this, 
				type: "GET",
				success: function(result){
					this.suhu = result.data[0].suhu;
					this.asap = result.data[0].asap;
	    		}
	    	});
		},
		setUp: function(){
			// $.ajax({
			// 	url: "/api/setting/?suhu="+this.suhu+"&asap="+this.asap, 
			// 	context:this, 
			// 	type: "GET",
			// 	success: function(result){
			// 		// this.logData = result.data;
			// 		console.log(result);
	  //   		}
	  //   	});

	    	socket.emit('settings', {suhu:this.suhu, asap:this.asap})
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
			this.settingPage = false;
			this.travelPage = true;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Travel";
		},
		toogleLog:function(){
			this.settingPage = false;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = true;
			this.userPage = false;
			this.tittlePage = "Halaman Log";
			this.travelPage = false;
		},
		toogleLaporan:function(){
			this.settingPage = false;
			this.travelPage = false;
			this.dashboardPage = false;
			this.laporanPage = true;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Halaman Laporan";
		},
		toogleUser:function(){
			this.settingPage = false;
			this.travelPage = false;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = true;
			this.tittlePage = "Halaman User";
		},
		toogleSetting:function(){
			this.settingPage = true;
			this.travelPage = false;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = false;
			this.userPage = false;
			this.tittlePage = "Halaman Setting";
		},
		toogleDashboard:function(){
			this.initMap();
			this.settingPage = false;
			this.travelPage = false;
			this.dashboardPage = false;
			this.laporanPage = false;
			this.logPage = true;
			this.userPage = false;
			this.tittlePage = "Dashboard";
		}
	},
	mounted: function(){
		this.getSetting();
		this.getUser();
		this.initMap();
		this.toogleDashboard();		
		this.getLog();
	}
});


function testMonitor(data){
	app.socket.emit('chat',data);
}