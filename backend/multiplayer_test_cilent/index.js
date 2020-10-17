
var pusher = new Pusher('072127b07acd646fc5ec', {
	cluster: 'eu',
	useTLS: true,
	authEndpoint: 'http://086eb694624b.ngrok.io/pusher/auth'
});

var channel = pusher.subscribe('private-lobby-manager');

b = document.getElementById('btn');

const create_form = document.getElementById('create-form');

create_form.addEventListener('submit', (e) => {
	console.log('create');
	const name = document.querySelector('input[name=name]').value;
	const host = document.querySelector('input[name=host]').value;
	
	channel.bind('lobby-created', function(data){
		console.log('Lobby created');
		console.log(data);
	});

	channel.trigger('client-new-lobby', {name: name, host:host});
	
});


const join_form = document.getElementById('join-form');

join_form.addEventListener('submit', (e) => {
	console.log('join');
	const code = document.querySelector('input[name=code]').value;
	const user_id = document.querySelector('input[name=user_id]').value;
	const name = document.querySelector('input[name=name]').value;
	const data = {code: code, name: name, user_id: user_id};

	var lobby_channel = pusher.subscribe('private-' + code);

	var id_channel = pusher.subscribe('private-' + user_id);
	id_channel.bind('approved', function(data){
		console.log('approved');
		console.log(data);
	});

	lobby_channel.trigger('client-join', {user_id: user_id, name: name});
});
