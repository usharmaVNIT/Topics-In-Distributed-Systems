// BT18CSE021
// Ujjwal Sharma
// usharma@students.vnit.ac.in

const express = require('express')

const axios = require('axios')

const cors = require('cors')

const app = express()


app.use(express.json())
app.use(cors())

const port = 9002

var requestQueue = []

var LogicalClock = 10


var Requesting = false
var Count = 2

const ports = [9001 , 9003]


async function getCriticalSection() {
    if(!Requesting){
        Requesting = true
        console.log("Getting Permission")
        for(var i in ports){
            var url = `http://localhost:${ports[i]}/requestCriticalSection`
            try {
                await axios.post(url , {
                    processID : port,
                    logicalClock : LogicalClock
                })
                
            } catch (error) {
                console.log(error.message)
                
            }
           
        }

    }
}

async function executeCriticalSection() {
    if(Count == 0){
        console.log(`****  Process ${port} entering critical section ****`)
        setTimeout(async ()=>{
            console.log(`****  Process Process ${port} exiting critical section ****`)
            for(var i in requestQueue){
                var url = `http://localhost:${requestQueue[i]}/permission`
                try {
                    await axios.get(url)   
                } catch (error) {
                    console.log(error.message)
                }
            }
            Count = 2
            LogicalClock+=1
            Requesting = false
            requestQueue = []
        } , 5000)
    }
}

async function giveReply(processID) {
    var url = `http://localhost:${processID}/permission`
    try {
        await axios.get(url)   
    } catch (error) {
        console.log(error.message)
    }
    console.log("Gave Permission to :" , processID)
}



app.get('/permission' , (req,res)=>{
    Count-=1
    res.send('ok')
    console.log("permission Recieved")
    executeCriticalSection()
})


app.post('/requestCriticalSection' , (req,res)=>{
    const { processID , logicalClock } = req.body
    if(Requesting = false){
        giveReply(processID)
    }
    else if(logicalClock < LogicalClock){
        giveReply(processID)
    } else {
        requestQueue.push(processID)
    }
    res.send('ok')
})



app.listen(port , ()=>{
  console.log(`Listining on ${port} ..`)

  setInterval(()=>{
    getCriticalSection()
} , 3000)
})



