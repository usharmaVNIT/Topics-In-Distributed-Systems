// BT18CSE021
// Ujjwal Sharma
// usharma@students.vnit.ac.in

const express = require('express')

const axios = require('axios')

const cors = require('cors')

const app = express()


app.use(express.json())
app.use(cors())

const ID = 1;
const PriorityQueue = require('priority-queue-node')

const priorityQueue = new PriorityQueue()

var LogicalClock = 0

const internalTime = 5000
const criticalSectionTime = 10000

var criticalSection = false

const ports = [9002 , 9003]

const internalEvent = ()=>{
  LogicalClock+=1;
  console.log(`Internal Event Occured . Logical Clock = ${LogicalClock} `)
}



const checkCriticalSection = async ()=>{
  if(!priorityQueue.isEmpty()){
    var element = priorityQueue.peek()
    const clock  = Object.keys(element)[0]
    const pid = element[clock]
    
    if(pid == ID){
      console.log("Queue - " , priorityQueue._queue)
      console.log("Entering Critical Section")
      element = priorityQueue.dequeue()

      setTimeout(async ()=>{

        console.log('...')
        LogicalClock+=1
      


        console.log("Exiting Critical Section ... ")

      for(let i in ports){
        try{
          var address = `http://localhost:${ports[i]}/release`;
          await axios.get(address)

        }catch (error) {
          console.log("error")
        }
      }
      criticalSection = false

      } , 1000)
      
  
  }

  }

}



const getCriticalSection = async ()=>{
  if(!criticalSection){
    criticalSection = true
    const element = {}
    element[LogicalClock] = ID;
    priorityQueue.enqueue(element)

    for(let i in ports){
      try{
        var address = `http://localhost:${ports[i]}/criticalSection`
        await axios.post(address , {
          processID : ID,
          logicalClock : LogicalClock
        })

      }catch (error){
        console.log("Error in getting")
      }
    }
    checkCriticalSection();
  }


}



app.get('/release' , (req,res)=>{
  const element = priorityQueue.dequeue()
  console.log("Process Removed - " , element)
  checkCriticalSection()
  res.send("Done")
})


app.post('/criticalSection' , (req,res)=>{
  const { processID , logicalClock } = req.body
  const element = {}
  element[logicalClock] = processID
  priorityQueue.enqueue(element)
  console.log("Process Added - " , priorityQueue._queue)

  res.send('Reply');

})


const port = 9001


app.listen(port , ()=>{
  console.log(`Listining on ${port} ..`)

  for(let i = 1 ; i<= 10 ; i++){
    setTimeout(()=>{
      internalEvent()
    } ,i*internalTime )
  }

  for(let i = 1;i<=5;i++){
    setTimeout(()=>{
      getCriticalSection()
    } , i*criticalSectionTime)
  }
})



