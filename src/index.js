
import * as fs from 'fs';
import vm from 'node:vm';

function include(path) {
    var code = fs.readFileSync(path, 'utf-8');
    vm.runInThisContext(code, path);
}

//add library here
include('duelink.js');

//serial port lib
import { SerialPort } from 'serialport'

//due port detection
async function DetectPort(){
    var selected = ''
    var listPorts = SerialPort.list()
    var items = await listPorts;
    console.log(items)
    items.forEach(item => {
            if(item.serialNumber && item.serialNumber.startsWith('DUE')){
                selected = item.path;                
            }
        });
    return selected;
}

//find any due device
var selectPort = await DetectPort();
if(selectPort==='')
{
    console.log('cannot detect due compatible device, program exited.');
    process.exit(1);
}else{
    console.log('Selected Port:' + selectPort)
}

//init serial port
var serialport = new SerialPort({ path: selectPort, baudRate: 115200 })
var isReady = false;
serialport.on('open', () => {
    isReady = true;
    console.log('serial is ready');
})

//wait for serial com is ready
while (!isReady) {
    await sleep(100)
}

var comPort = new SerialInterface(serialport);
comPort.Connect();

var trycount = 30;
//wait for the firmware version for 3 secs
while (!comPort.isReady) {
    await sleep(100);
    trycount--;
    if (trycount <= 0) throw Error("can't get the firmware version")
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
        console.log(`turn led on...`);
        await duedemo.System.Wait(200);
        //await sleep(200);
        duedemo.Digital.Write(108, false);
        //port.write('dwrite(108,0)\n')
        console.log(`turn led off...`);
        //await sleep(200);
        await duedemo.System.Wait(200);

    }

    console.log('Done');
}

await demo();

//serialport.write('LcdConfig(0, 0x3C)\n');
//await sleep(1)

await duedemo.Display.Configuration(0, 0x3C)
for (let i = 0; i < 10; i++) {

//serialport.write('lcdclear(0)\n');
//await sleep(1)

//serialport.write('LcdText("Hello-'+i+'",1,10,10)\n');
//await sleep(1)

//serialport.write('LcdShow()\n');
//await sleep(500)

await duedemo.Display.Clear(0)
await duedemo.Display.DrawText("hello-"+i,1,10,10)
await duedemo.Display.Show()
//await sleep(500)
await duedemo.System.Wait(500)
}

//close serial com
duedemo.Disconnect()

console.log("The End!");