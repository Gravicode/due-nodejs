
import * as fs from 'fs';
import vm from 'node:vm';

function include(path) {
    var code = fs.readFileSync(path, 'utf-8');
    vm.runInThisContext(code, path);
}
// file is included here:
//var js = fs.readFileSync('duelink.js')+'';
//eval(js);

include('duelink.js');

//serial port
import { SerialPort } from 'serialport'
const serialport = new SerialPort({ path: 'COM4', baudRate: 115200 })

var listPorts = SerialPort.list()
var isReady = false;

serialport.on('open', () => {
    isReady = true;
    console.log('serial is ready');
})

listPorts.then(function (result) {
    console.log(result) 
})

//wait for serial com ready
while (!isReady) {
    await sleep(100)
}

var comPort = new SerialInterface(serialport);
comPort.Connect();

//wait for the firmware version 
while (!comPort.isReady) {
    await sleep(100)
}
var duedemo = new DUELinkController(comPort);

// add sleep function!
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// blink 10 times
async function demo() {
    for (let i = 0; i < 10; i++) {
        duedemo.Digital.Write(108, true);
        //port.write('dwrite(108,1)\n')
        console.log(`Waiting...`);

        await sleep(200);
        duedemo.Digital.Write(108, false);
        //port.write('dwrite(108,0)\n')
        console.log(`Waiting...`);
        await sleep(200);
    }

    console.log('Done');
}
demo();

console.log("The End!");