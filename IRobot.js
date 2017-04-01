'use strict'

// Radious :[HEX][DEC]
// straight = 8000, 32768
// turn in place clockwise FFFF, 65535
// counter-clockwise 0001, 1
const MAXLENGHT = 100
const STRAIGHT = 32768
const RIGHT = 65535
const LEFT = 1
const BATTERYLIFE = 25
const MAXBATTERY = 26

let bytes = 0

function wysokiNiskiByte(liczba) {
    let h = (liczba & 0xFF00) >> 8
    let l = liczba & 0x00FF
    return h + ' ' + l
}

function Drive(speedInMmPerSec, Rotation) {
    bytes += 5
    let line = ' ' + 137
    line += ' ' + wysokiNiskiByte(speedInMmPerSec)
    line += ' ' + wysokiNiskiByte(Rotation)
    return line
}

function WaitForDistanceMm(distance) {
    bytes += 3
    let line = ' ' + 156
    line += ' ' + wysokiNiskiByte(distance)
    return line
}

function WaitForDistanceCm(distance) {
    bytes += 3
    let line = ' ' + 156
    line += ' ' + wysokiNiskiByte(distance * 10)
    return line
}

function WaitForDistanceM(distance) {
    bytes += 3
    let line = ' ' + 156
    line += ' ' + wysokiNiskiByte(distance * 1000)
    return line
}

function WaitForAngle(angleInDegrees) {
    bytes += 3
    let line = ' ' + 157
    line += ' ' + wysokiNiskiByte(angleInDegrees)
    return line
}

function RepeatScript() {
    bytes += 1
    let line = ' ' + 153
    return line
}

function GetBatteryLifeLeft() {
    return 142 + ' ' + BATTERYLIFE
}

function GetBatteryCapacity() {
    return 142 + ' ' + MAXBATTERY
}

function GetBatteryPercentage() {
    //TODO wywołanie i funkcje powinny zwracać wartości od razu.
    let left = GetBatteryLifeLeft()
    let cap = GetBatteryCapacity()

    return left / cap * 100

}

function GetPacket(PacketID) {
    let line = '142 ' + PacketID
    return line
}

function StartDocking() {
    return '143'
}

const Skrypt = ['']

function generateScriptString() {
    let SLen = Skrypt.length
    let scriptLine = '153'
    scriptLine += ' ' + bytes
    for (let i = 0; i < SLen; i++) {
        scriptLine += Skrypt[i]
    }
    return scriptLine
}



Skrypt.push(Drive(300, STRAIGHT))
Skrypt.push(WaitForDistanceCm(10))
Skrypt.push(Drive(100, RIGHT))
Skrypt.push(WaitForAngle(90))
Skrypt.push(RepeatScript())




// Wysoki i niski bit
console.log(generateScriptString())