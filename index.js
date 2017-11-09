let express = require('express')
, bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });

  socket.on('pingServer', (message) => {
    //io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
    console.log('message ', message);
  });

/*   setInterval(function(){
    socket.emit('stream', {'title': "A new title via Socket.IO!"});
}, 1000); */

app.post('/msg', function (req, res) {
  socket.emit('stream', {'title': req.body.msg});
  res.send('Hello World! msg :');
  console.log('msg req :', req.body.msg);
});

});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});

var server = app.listen(3000, function () {
  let host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  let port = server.address().port;
 
  console.log('listening at http://%s:%s', host, port);
});