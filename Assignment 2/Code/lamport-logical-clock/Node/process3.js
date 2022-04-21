// BT18CSE021
// Ujjwal Sharma
// usharma@students.vnit.ac.in

const express = require('express');

const app = express();
var cors = require('cors')

const axios = require('axios');

app.use(express.json())
app.use(cors())

var LogicalClock = 0;

var internalEventDelay = 7000;

var sendEventDelay = 9000;



const max = (a , b)=>{
  if(a>b){
    return a;
  }
  return b;
}

const sendEvent = async (port , name) => {
  try{
    LogicalClock+=1;
    var address = `http://localhost:${port}/recieveEvent`
    await axios.post(address , {
      from : "Process 3",
      recievedClock : LogicalClock
    })
    console.log(`Event Sent to ${name} , Logical Clock = ${LogicalClock}`)

  } catch(error){
    LogicalClock-=1;
    console.log(`Sending failed to ${name} , Logical Clock = ${LogicalClock}`)
  }
}









var internalEvent = setInterval(()=>{
  LogicalClock+=1;
  console.log(`Internal Event Occured . Logical Clock = ${LogicalClock}`)
} , internalEventDelay)


var sendEventInterval = setInterval(()=>{
  var ports = [9001 , 9002];
  var names = ['Process 1' , 'Process 2'];

  if(Math.random() <= 0.5){
    sendEvent(ports[0] , names[0])
  }
  else{
    sendEvent(ports[1], names[1])

  }

} , sendEventDelay)




app.post('/recieveEvent' , (req,res)=>{
  const { from , recievedClock } = req.body;
  LogicalClock = max(LogicalClock , recievedClock) + 1;
  console.log(`Event Recieved from ${from} , Logical Clock = ${LogicalClock}`)
  res.send('done');
})

const port = 9003

app.listen(port , ()=>{
  console.log(`listining on ${port}`)
})
