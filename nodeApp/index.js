'use strict'

/*
  Ładowanie modułów
  Jeśli występuje tu błąd należy sprawdzić czy istnieje folder: node_modules, jak go nie ma należy wykonać `npm install` w konsoli
  */
const PORT = 80
const SerialPort = require('serialport')
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const ByteLength = SerialPort.parsers.readline



// start
const START = '128'

const DRIVEMODE = '128 131'

const FULLMODE = '128 132'

// zagraj utwor przed tym trzeba przelaczyc irobota w full mode
const SONG = '140 0 4 62 12 66 12 69 12 74 36'
const PLAYSONG = '141 0'

// STOP
// const STOP = '137 0 0 0 0'
const STOP = '152 5 137 0 0 0 0 153'

// GO
const GO = '137 1 44 128 0'

// przeciwnie wskazowki zegara powoli
// const rotateLeft = '137 1 1 0 1'
const rotateLeft = '152 13 137 0 100 0 1 157 0 5 137 0 0 0 0 153'

// wskazowki zegara powoli
// const rotateRight = '137 -1 1 0 1'
const rotateRight = '152 13 137 0 100 255 255 157 255 251 137 0 0 0 0 153'


// kwadrat 40x40
const SQUARE = '152 68 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 90 137 0 0 0 0 153'
// prostokata 20x80
const RECTANGLE = '152 68 137 1 44 128 0 156 0 200 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 320 137 1 44 0 1 157 0 90 137 1 44 128 0 156 0 200 137 1 44 0 1 157 0 90 137 1 44 128 0 156 1 320 137 1 44 0 1 157 0 90 137 0 0 0 0 153'

const TRIANGLE = '152 61 137 1 44 0 1 157 0 60 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 120 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 120 137 1 44 128 0 156 1 144 137 1 44 0 1 157 0 120 137 0 0 0 0 153'
const CIRCLE = '152 13 137 1 44 0 200 156 4 232 137 0 0 0 0 153'

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

        sendCommand([SONG, PLAYSONG, DRIVEMODE], () => {
            console.log('Przygotowano')
        })

    })
})


port.on('data', (data) => {
    process.stdout.write(data.toString())
})

// Ustawinie assetsów
app.use('/assets', express.static('assets'))

/*
  Routing aplikacji
 */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

/**
 * Włącznie nasłuchiwania na porcie 80
 */
server.listen(PORT)
// .on('request', (req, res) => {
//     console.log(`${new Date().toISOString().replace(/T|Z/g, ' ')}: ${res.req.method} : ${res.req.url} `)
// })

/**
 * Ustawienie socket io
 */
io.on('connection', (socket) => {

    socket.emit('wellcome', { hello: 'world' })


    socket.on('sendCmd', (cmd) => {
        if (!cmd) return socket.emit('sent', { msg: 'blank cmd' })
        let cmds = cmd.split('__')

        try {
            sendCommand(cmds, () => {
                socket.emit('sent', { msg: 'cmd sent' })
            })
        } catch (err) {
            socket.emit('sent', { msg: err })
        }

    })
    socket.on('send', (cmd) => {
        let line

        if (cmd == 'stop')
            line = STOP
        else if (cmd == 'go')
            line = GO
        else if (cmd == 'prepare')
            line = DRIVEMODE
        else if (cmd == 'square')
            line = SQUARE
        else if (cmd == 'rectangle')
            line = RECTANGLE
        else if (cmd == 'circle')
            line = CIRCLE
        else if (cmd == 'triangle')
            line = TRIANGLE
        else if (cmd == 'rotateLeft')
            line = rotateLeft
        else if (cmd == 'rotateRight')
            line = rotateRight
        // #newCmd
        // przyklad dodania nowej komendy
        // `newCmd` musi byc zdefiniowana u góry
        // oraz `cmd` odpowiadać nowej komendzie z pliku main-app.html
        // else if(cmd == 'newCmd')
        //   line = newCmd

        try {
            sendCommand(line, () => {
                socket.emit('sent', { msg: 'cmd sent' })
            })
        } catch (err) {
            socket.emit('sent', { msg: err })
        }
    })

})

/**
 * Funkcja do zamiany stringu na komendy oraz przesyłania ich do portu szeregowego
 * @param  {[type]}   line string do przesłania z komendą
 * @param  {Function} done callback
 * @return {undefined}
 */
function sendCommand(line, done) {

    if (typeof line === 'string')
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

    if (done)
        done()

}
