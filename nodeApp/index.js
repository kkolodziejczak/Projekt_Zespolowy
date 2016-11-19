// jshint node: true
// jshint esversion: 6
// jshint asi: true

const SerialPort = require('serialport')

// trzeba ustalic jaka jest sciezka do portu
let pathToPort = '/dev/tty-usbserial1'

const port = new SerialPort(pathToPort, { autoOpen: false })

port.open((err) => {
  if (err)
    return console.log('Error opening port: ', err.message)

  // write errors will be emitted on the port since there is no callback to write
  port.write('main screen turn on')

})
