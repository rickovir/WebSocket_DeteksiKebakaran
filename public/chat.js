// make connection
var socket = io.connect('http://localhost:3000');

// Query DOM
var messageKatulampa = document.getElementById('messageKatulampa');
var messageManggarai = document.getElementById('messageManggarai');
var handle = document.getElementById('handle');
var btnkatulampa = document.getElementById('send-katulampa');
var btnmanggarai = document.getElementById('send-manggarai');
var output = document.getElementById('output');

// emit events


function levelKatulampa(val)
{
	if(val > 100)
	{
		$('#status-ketinggian-katulampa').removeClass('btn-success');
		$('#status-ketinggian-katulampa').addClass('btn-danger');
		$('#status-ketinggian-katulampa').text("Bahaya");
	}
	else
	{
		$('#status-ketinggian-katulampa').removeClass('btn-danger');
		$('#status-ketinggian-katulampa').addClass('btn-success');
		$('#status-ketinggian-katulampa').text("Aman");
	}
}
function levelManggarai(val)
{
	if(val > 100)
	{
		$('#status-ketinggian-manggarai').removeClass('btn-success');
		$('#status-ketinggian-manggarai').addClass('btn-danger');
		$('#status-ketinggian-manggarai').text("Bahaya");
	}
	else
	{
		$('#status-ketinggian-manggarai').removeClass('btn-danger');
		$('#status-ketinggian-manggarai').addClass('btn-success');
		$('#status-ketinggian-manggarai').text("Aman");
	}
}

// function testMonitor(data){
// 	socket.emit('monitor',{distance:data});
// }
function testMonitor(data){
	socket.emit('monitor',data);
}

btnkatulampa.addEventListener("click", function(){
	// socket.emit('chat',{
	// 	message: message.value,
	// 	handle:handle.value
	// });
	socket.emit('monitor',{
		distance: messageKatulampa.value,
		id: "1"
	});

});
btnmanggarai.addEventListener("click", function(){
	// socket.emit('chat',{
	// 	message: message.value,
	// 	handle:handle.value
	// });
	socket.emit('monitor',{
		distance: messageManggarai.value,
		id :'2'
	});

});


//listen for events
socket.on('chat', function(data){
	output.innerHTML += '<p><strong>'+data.handle+'</strong> : ' + data.message + '</p>';
});
// connecting
socket.on('connect', function(data) {
    socket.emit('show_paket_barang',null);
    // socket.emit('show_list_pengiriman');
});

socket.on('monitor', function(data){
	// output.innerHTML += '<p><strong>Tinggi</strong> : ' + data.distance + '</p>';
	console.log(data);
	if(data.id == "1"){
		levelKatulampa(data.distance);
		$('#ukuran-ketinggian-katulampa').html(data.distance + "<small class='text-muted'> cm</small>");
	}
	else{
		levelManggarai(data.distance);
		$('#ukuran-ketinggian-manggarai').html(data.distance + "<small class='text-muted'> cm</small>");
	}
});


socket.on('status', function(data){
		console.log(data);
	});