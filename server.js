let express = require('express')
, bodyParser = require('body-parser');
//var expressLayouts = require('express-ejs-layouts');

let app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json())

let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  console.log('Un client est connecté !');
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

  //socket.emit('stream', {'title': "A new title via Socket.IO!"});

  app.post('/msg', function (req, res) {
    console.log('msg req :', req.body);
    // envoie a tout le monde
    //socket.broadcast.emit('stream', {'title': req.body.msg});
    io.emit('stream', {
      'title': req.body.title,
      'msg': req.body.msg
    });
    

    res.send('Hello World! msg :');
    
  });

});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});

app.get('/index', function (req, res) {
  var locals = {
    title: 'Page Title',
    description: 'Page Description'
  };
  res.render('index', locals);
});

app.get('/notif', function (req, res) {
  res.render('notif');
});

var server = app.listen(3000, function () {
  let host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  let port = server.address().port;
 
  console.log('listening at http://%s:%s', host, port);
});