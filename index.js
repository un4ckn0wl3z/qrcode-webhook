const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const qr = require('qr-image');

 const base_url = "https://56a7466d2703.ngrok.io"

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/qr.svg', (req, res) => {
    res.sendFile(__dirname + '/qr.svg');
  });

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});


app.get('/webhook', (req, res) => {

    let uid = req.query.uid;
    console.log("uid = ", uid)
   // io.on('connection', (socket) => {
        io.emit(uid, `Thanks for scanned`);
      //});
      res.sendStatus(200)
    
});
  

io.on('connection', (socket) => {

  socket.on('qr gen', uuEvent => {
    const qrname = "qr.svg"
    const qrEndpint = `${base_url}/webhook?uid=${uuEvent}`
    var qr_svg = qr.image(qrEndpint, { type: 'svg' });
    qr_svg.pipe(require('fs').createWriteStream(qrname));
    console.log(uuEvent)
    console.log(qrEndpint)
    io.emit(`qr display ${uuEvent}`, `${qrname}?=${new Date()}`);
  });


});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});