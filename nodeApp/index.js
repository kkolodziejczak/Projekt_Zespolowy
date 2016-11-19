// jshint node: true
// jshint esversion: 6
// jshint asi: true

const SerialPort = require('serialport')

// start
const START = '128'

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
const cmd16 = '137 0 0 0 0'

// wywołaj skrypt:
const STOP = '153'


// trzeba ustalic jaka jest sciezka do portu
let pathToPort = '/dev/tty-usbserial1'
const port = new SerialPort(pathToPort,
  {
    autoOpen: false,
    baudRate: 57600
  })

port.open((err) => {
  if (err)
    return console.log('Error opening port: ', err.message)

  // write errors will be emitted on the port since there is no callback to write
  port.write('main screen turn on')

})



