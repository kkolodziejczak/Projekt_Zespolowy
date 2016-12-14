const SerialPort = require('serialport')
const ByteLength = SerialPort.parsers.readline

// const stdin = process.stdin
// stdin.setRawMode( true )

// stdin.resume()

// stdin.setEncoding( 'utf8' )


// const readline = require('readline')
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: false
// })


// start
const START = '128'

const DRIVEMODE = '128 131'

const FULLMODE = '128 132'

// zagraj utwor przed tym trzeba przelaczyc irobota w full mode
const SONG = '140 0 4 62 12 66 12 69 12 74 36'
const PLAYSONG = '141 0'

// Narysuj kwadrat o boku 40 cm:
const cmd1 = '152 61'
// jedz prosto 300 mm/s
const cmd2 = '137 1 44 128 0'
// czekaj na 40 cm
const cmd3 = '156 1 144'
// obróć się przeciwnie do zegara 300mm/s
const cmd4 = '137 1 44 0 1'
// czekaj na obrót 90 stopni przeciwnie do ruchu zegara
const cmd5 = '157 0 90'

// jedz prosto 40 cm 300 mm/s
const cmd6 = '137 1 44 128 0'
// czekaj na 40 cm
const cmd7 = '156 1 144'
// obróć się przeciwnie do zegara 300mm/s
const cmd8 = '137 1 44 0 1'
// czekaj na obrót 90 stopni przeciwnie do ruchu zegara
const cmd9 = '157 0 90'

// jedz prosto 40 cm 300 mm/s
const cmd10 = '137 1 44 128 0'
// czekaj na 40 cm
const cmd11 = '156 1 144'
// obróć się przeciwnie do zegara 300mm/s
const cmd12 = '137 1 44 0 1'
// czekaj na obrót 90 stopni przeciwnie do ruchu zegara
const cmd13 = '157 0 90'

// jedz prosto 40 cm 300 mm/s
const cmd14 = '137 1 44 128 0'
// czekaj na 40 cm
const cmd15 = '156 1 144'
// STOP
const STOP = '137 0 0 0 0'

// '152 17 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 153'
// const RUN = '152 9 137 1 44 0 1 157 0 90 153'
// const rotateLeft = '152 9 137 1 44 0 1 157 0 90 153'
// const rotateRight = '152 9 137 1 44 0 1 157 0 90 153'
// wywołaj skrypt:
// przeciwnie wskazowki zegara powoli
const rotateLeft = '137 1 1 0 1'
// wskazowki zegara powoli
const rotateRight = '137 -1 1 0 1'

const SCRIPT = '153'



// trzeba ustalic jaka jest sciezka do portu
let pathToPort = '/dev/ttyUSB0'
const port = new SerialPort(pathToPort,
  {
    autoOpen: false,
    baudRate: 57600,
    databits: 8,
    parity: 'none',
    parser: SerialPort.parsers.raw
  })

port.open((err) => {
  if (err)
    return console.log('Error opening port: ', err.message)

  console.log('Podlaczono')

  sendCommand(FULLMODE, () => {

    sendCommand([SONG,PLAYSONG, DRIVEMODE],() =>{
      console.log('Przygotowano')
    })

  })

  // write errors will be emitted on the port since there is no callback to write
  // setTimeout(() =>{
  //   console.log('start')
  //   port.write(START)
  // },5000)

})


port.on('data', (data)=>{
  process.stdout.write(data.toString())
})

// stdin.on( 'data', function( key ){
//   // ctrl-c ( end of text )
//   if ( key === '\u0003' ) {
//     process.exit()
//   }
//   // write the key to stdout all normal like
//   console.log(key)
//   let line
//   if(key == 's')
//     line = STOP
//   else if(key == 'w')
//     line = cmd2
//   else if(key == 'p')
//     line = PREPARE
//   else if(key == 'r')
//     line = SCRIPT
//   else if(key == 'q')
//     line = rotateLeft
//   else if(key == 'e')
//     line = rotateRight

//   if(!line)
//     return

//   let cmds = line.split(' ')
//   let count = cmds.length
//   let send = new Buffer(count)
//   for (var i = 0; i < cmds.length; i++) {
//     send[i] = parseInt(cmds[i])
//   }
//   port.write(send)

// })

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.use('/', express.static('assets'))

app.get('/sendCmd', function (req, res) {

  if(!req.query.cmd) return res.json({msg:'blank cmd'})
  let cmds = req.query.cmd.split('__')

  sendCommand(cmds, () =>{
    return res.json({msg:'cmd sent'})
  })

})
app.get('/send', function (req, res) {

  if(!req.query.cmd) return res.json({msg:'blank cmd'})

  let cmd = req.query.cmd
  let line
  if(cmd == 'stop')
    line = STOP
  else if(cmd == 'go')
    line = cmd2
  else if(cmd == 'prepare')
    line = DRIVEMODE
  else if(cmd == 'script')
    line = SCRIPT
  else if(cmd == 'rotateLeft')
    line = rotateLeft
  else if(cmd == 'rotateRight')
    line = rotateRight

  sendCommand(line, () =>{
    return res.json({msg:'cmd sent'})
  })
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})


function sendCommand(line,done){

  if(typeof line === 'string')
    line = [line]

  for (let i = 0; i < line.length; i++) {

    let cmds = line[i].split(' ')
    let count = cmds.length
    let send = new Buffer(count)

    for (let i = 0; i < cmds.length; i++) {
      send[i] = parseInt(cmds[i])
    }

    port.write(send)

  }

  if(done)
    done()

}

// zrob nadawnaie sygnalow na pidy rassbery
// napisz kuba skrypt ktory umozliwi Tobie/Wam uruchomienie/restart aplikajci nodowej
