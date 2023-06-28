
var fs = require('fs');
const vm = require('node:vm');

function include(path) {
    var code = fs.readFileSync(path, 'utf-8');
    vm.runInThisContext(code, path);
}
// file is included here:
//var js = fs.readFileSync('duelink.js')+'';
//eval(js);

include('duelink.js');

//serial port
const { SerialPort } = require('serialport')
const port = new SerialPort({ path: 'COM7', baudRate: 115200 })
console.log('port is open')

this.comPort = new SerialInterface(port);
this.comPort.Connect();

if (!this.duedemo)
            this.duedemo = new DUELinkController(this.comPort);


// this write has a call back to show any errors
/*
port.write('dwrite(108,1)\n', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
  console.log('message written')
})
*/

// add sleep function!
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// blink 10 times
async function demo() {
    for (let i = 0; i < 10; i++) {
        this.duedemo.Digital.Write(108, true);
        //port.write('dwrite(108,1)\n')
        console.log(`Waiting...`);
     
        await sleep(200);
        this.duedemo.Digital.Write(108, false);
        //port.write('dwrite(108,0)\n')
        console.log(`Waiting...`);
        await sleep(200);
     

    }
    
    console.log('Done');
}
demo();

console.log("The End!");