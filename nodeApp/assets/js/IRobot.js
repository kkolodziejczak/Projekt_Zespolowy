window = window || {}
;(function () {
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

    function highLowByte(liczba) {
        // console.log('Test: '+ liczba)
        let h = (liczba & 0xFF00) >> 8
        let l = liczba & 0x00FF
        // console.log('Test hl: '+ h + l)

        return h + ' ' + l
    }

    function Drive(speedInMmPerSec, Rotation) {
        bytes += 5
        let line = ' ' + 137
        line += ' ' + highLowByte(speedInMmPerSec)
        line += ' ' + highLowByte(Rotation)
        return line
    }
    // 152 69
    // 137 1 44 128 0
    // 156 0 200
    // 137 1 44 0 1
    // 157 0 90
    // 137 1 44 128 0
    // 156 1 320
    // 137 1 44 0 1

    // 152 24
    // 137 1 44 128 0
    // 156 0 100
    // 137 1 44 0 1
    //  157 0 90
    //  137 1 44 128 0
    //  156 1 44
    function WaitForDistanceMm(distance) {
        bytes += 3
        let line = ' ' + 156
        line += ' ' + highLowByte(distance)
        return line
    }

    function WaitForDistanceCm(distance) {
        bytes += 3
        let line = ' ' + 156
        line += ' ' + highLowByte(distance * 10)
        return line
    }

    function WaitForDistanceM(distance) {
        bytes += 3
        let line = ' ' + 156
        line += ' ' + highLowByte(distance * 1000)
        return line
    }

    function WaitForAngle(angleInDegrees) {
        bytes += 3
        let line = ' ' + 157
        line += ' ' + highLowByte(angleInDegrees)
        return line
    }

    function RepeatScript() {
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

    function Stop() {
        Skrypt.push(Drive(0, 0))
    }

    function Repeat() {
        bytes += 1
        Skrypt.push(' ' + 153)
    }

    function Clear() {
        Skrypt = ['']
        bytes = 0
    }

    let Skrypt = ['']

    function GenerateScriptString() {
        let SLen = Skrypt.length
        let scriptLine = '152'
        scriptLine += ' ' + bytes
        for (let i = 0; i < SLen; i++) {
            scriptLine += Skrypt[i]
        }
        scriptLine += ' ' + 153
        return scriptLine
    }

    function DriveForward(speedInMmPerSec, distanceInCM) {
        Skrypt.push(Drive(speedInMmPerSec, STRAIGHT))
        Skrypt.push(WaitForDistanceMm(distanceInCM * 10))
    }

    function RotateRight(speedInMmPerSec, Angle) {
        Skrypt.push(Drive(speedInMmPerSec, RIGHT))
        Skrypt.push(WaitForAngle(-Angle))
    }

    function RotateLeft(speedInMmPerSec, Angle) {
        Skrypt.push(Drive(speedInMmPerSec, LEFT))
        Skrypt.push(WaitForAngle(Angle))
    }

    window.IRobot = {
        DriveForward: DriveForward,
        RotateLeft: RotateLeft,
        RotateRight: RotateRight,
        Stop: Stop,
        Repeat: Repeat,
        GenerateScriptString: GenerateScriptString,
        Clear: Clear
    }
    return
    //INTERFEJS
    // DriveForward(100,10)
    // RotateLeft(100,5)
    // DriveForward(500,10)
    // RotateRight(100,90)
    // Stop()
    // Repeat()

    // Wysoki i niski bi t
    // console.log(GenerateScriptString())
})(window)