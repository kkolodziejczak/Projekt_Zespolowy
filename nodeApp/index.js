/*
  Ładowanie modułów
  Jeśli występuje tu błąd należy sprawdzić czy istnieje folder: node_modules, jak go nie ma należy wykonać `npm install` w konsoli
  */
const SerialPort = require('serialport')
const express = require('express')
const app = express()

const ByteLength = SerialPort.parsers.readline



// start
const START = '128'

const DRIVEMODE = '128 131'

const FULLMODE = '128 132'

// zagraj utwor przed tym trzeba przelaczyc irobota w full mode
const SONG = '140 0 4 62 12 66 12 69 12 74 36'
const PLAYSONG = '141 0'

// STOP
const STOP = '137 0 0 0 0'

// GO
const GO = '137 1 44 128 0'

// przeciwnie wskazowki zegara powoli
const rotateLeft = '137 1 1 0 1'
// wskazowki zegara powoli
const rotateRight = '137 -1 1 0 1'

// kwadrat 40x40
const SQUARE = '152 69 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 0 0 0 0 153 153'
// prostokata 20x80
const RECTANGLE = '152 69 137 1 44 128 0 156 0 200 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 320 137 1 44 0 1 157 0 90 137 1 44 128 0 156 0 200 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 320 137 1 44 0 1 157 0 90 137 0 0 0 0 153 153'

// #newCmd
// przykład definicji nowej komendy jej uzycie jest ponizej
// const newCmd = '137 1 44 128 0'

// trzeba ustalic jaka jest sciezka do portu
let pathToPort = '/dev/ttyUSB0'

/**
 * Połącznie się do portu szeregowego
 */
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
})


port.on('data', (data)=>{
  process.stdout.write(data.toString())
})

// Ustawinie assetsów
app.use('/', express.static('assets'))

/*
  Routing aplikacji
 */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})


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
  else if(cmd == 'square')
    line = SQUARE
  else if(cmd == 'rectangle')
    line = RECTANGLE
  else if(cmd == 'rotateLeft')
    line = rotateLeft
  else if(cmd == 'rotateRight')
    line = rotateRight
  // #newCmd
  // przyklad dodania nowej komendy
  // `newCmd` musi byc zdefiniowana u góry
  // oraz `cmd` odpowiadać nowej komendzie z pliku main-app.html
  // else if(cmd == 'newCmd')
  //   line = newCmd

  sendCommand(line, () =>{
    return res.json({msg:'cmd sent'})
  })
})

/**
 * Włącznie nasłuchiwania na porcie 80
 */
app.listen(80, function () {
  console.log('Example app listening on port 80!')
})

/**
 * Funkcja do zamiany stringu na komendy oraz przesyłania ich do portu szeregowego
 * @param  {[type]}   line string do przesłania z komendą
 * @param  {Function} done callback
 * @return {undefined}
 */
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
