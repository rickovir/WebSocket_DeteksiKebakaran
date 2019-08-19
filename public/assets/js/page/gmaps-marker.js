// "use strict";

// initialize map
var map = new GMaps({
  div: '#map',
  lat: -6.1490404,
  lng: 106.8030892,
  zoom: 14
});
// Added a marker to the map

var sensor = [{
  lat: -6.1428788,
  lng: 106.8030892,
  title: 'Rumah Susanto',
  icon : '../assets/img/fire.png',
  infoWindow: {
    content: '<h6>Rumah Susanto</h6><p>Jl. Terate Nomor 3</p>'
  }
},{
  lat: -6.1490554,
  lng: 106.8070892,
  title: 'Multinity',
  icon : '../assets/img/sensor.png',
  infoWindow: {
    content: '<h6>Rumah Yuli</h6><p>Jl.Bahagia Kud engan mu</p>'
  }
},{
  lat: -6.1456404,
  lng: 106.8020892,
  title: 'Multinity',
  icon : '../assets/img/sensor.png',
  infoWindow: {
    content: '<h6>Rumah Yuli</h6><p>Jl.Bahagia Kud engan mu</p>'
  }
},{
  lat: -6.1415404,
  lng: 106.8080892,
  title: 'Multinity',
  icon : '../assets/img/sensor.png',
  infoWindow: {
    content: '<h6>Rumah Yuli</h6><p>Jl.Bahagia Kud engan mu</p>'
  }
},{
  lat: -6.1422404,
  lng: 106.8016892,
  title: 'Multinity',
  icon : '../assets/img/sensor.png',
  infoWindow: {
    content: '<h6>Rumah Yuli</h6><p>Jl.Bahagia Kud engan mu</p>'
  }
}];


for(var i=0; i < sensor.length; i++)
{
	map.addMarker(sensor[i]);
}