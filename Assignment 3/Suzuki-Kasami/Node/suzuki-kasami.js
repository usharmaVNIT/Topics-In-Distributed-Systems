class Processer {
    constructor(id) {
        this.id = id
        this.token = null
        this.RN = []
        this.requesting = false
    }
}

class Token {
    constructor(number) {
        this.LN = []
        for(var i =0;i<number ; i++){
            this.LN.push(0)
        }
        this.queue = []
    }
}

function max(a,b){
    if(a>b){
        return a;
    }
    return b;
}

// Array.shift for 1st element

function getProcessors(number){
    const processors = []
    for(var i=0 ; i<number; i++){
        let processor = new Processer(i)
        for(var j=0;j<number;j++){
            processor.RN.push(0)
        }
        processors.push(processor)
    }
    return processors
}

const number = 10
const Processes = getProcessors(number)
const token = new Token(number)


function sendToken(id){
    if(token.queue.length > 0) {
        var newId = token.queue.shift()
        Processes[id].token = null
        Processes[newId].token = token
        executeCS(newId)
    }
}

function executeCS(id){ 
    if(Processes[id].token){
        console.log(`**** Process ${id} executing Critical Section ****`)
        console.log("Processor State = " , Processes[id])
        setTimeout(()=>{
            console.log(`**** Process ${id} exiting Critical Section ****`)
            token.LN[id] = Processes[id].RN[id]
            Processes[id].requesting = false
            for(var i in token.LN ){
                if( (Processes[id].RN[i] - token.LN[i] == 1) && (token.queue.indexOf(i) == -1) ) {
                    token.queue.push(i)
                }
            }
            console.log("Queue : " , token.queue)
            sendToken(id)
        } , 5000)
    }
}

function Broadcast(id , n) {
    for(var i=0;i<number ; i++){
        Processes[i].RN[id] = max(Processes[i].RN[id] , n)
    }
}
function requestToken(id){
    if(Processes[id].requesting == false) {
        Processes[id].RN[id]+=1
        Processes[id].requesting = true
        Broadcast(id , Processes[id].RN[id])
    }
}

function SuzukiKasami(){
    requestToken(0)
    Processes[0].token = token
    executeCS(0)
    setInterval(()=>{
        let index = Math.floor(Math.random() * number )
        requestToken(index)
    } , 2000)

}


SuzukiKasami()
