const number = 10
const m = 2
const initiatorValue = 1

class Processor {
    constructor(id) {
        this.id = id
        this.votes = []
        this.isCorrupt = false
        this.agreed = null
        this.isInitiator = false
        this.initiatorValue = null
    }
}

function sendMessage(parent , process , message) {
    console.log(`\tsent ${message} from ${parent.id} to ${process.id} `)
    process.votes[parent.id] = message

}

function getProcesses() {
    const processes = []
    for(let i=0;i<number;i++){
        let newProcess = new Processor(i)
        for(let j=0;j<number;j++){
            newProcess.votes.push(0)
        }
        processes.push(newProcess)
    }
    return processes
}

const Processes = getProcesses()


function calculateVote(){
    for(let i = 0;i<number;i++){
        let process = Processes[i]
        if(!process.isInitiator) {
            cnts = [0,0]
            for(let j in process.votes) {
                cnts[process.votes[j]] += 1
            }
            if(cnts[0]>cnts[1]) {
                process.agreed = 0
            } else {
                process.agreed = 1
            }
        }
    }

 }

function OM(M , process , message , set) {
    console.log(`OM(${M}) - process ${process.id}`)
    
    for(let i =0;i<number;i++){
        if((set.has(i)) || (i == process.id) ){
            continue
        }
        if(Processes[i].isCorrupt){
            let val = message
            if(Math.random() > 0.5) {
                val = 1-val
            }
            sendMessage(process , Processes[i] , val)
        } else {
            sendMessage(process , Processes[i] , message)
            
        }
    }
    if(M==0){
        calculateVote()
    }
    else {
        let newSet = new Set(set)
        newSet.add(process.id)
        for(let i =0;i<number;i++){
            if(set.has(i) || (i==process.id)){
                continue
            } else {
                OM(M-1 , Processes[i] , message , newSet)
            }
        }
    }
    
}

function PrintAgreedValue(){
    for(let i =0;i<number;i++) {
        let process = Processes[i]
        if(process.isInitiator) {
            console.log(`Process ${i} - Initiator , value = ${process.initiatorValue}` )
        } else {
            console.log(`Process ${i} agreed to : ${process.agreed} --> `, process.votes)
            if(process.isCorrupt) {
                console.log(`\t\t( process is corrupted )`);
            }
        }
    }
}

function setInitiator(process , value) {
    process.isInitiator = true
    process.initiatorValue  = value
    console.log(`****  Initiator : process ${process.id} , value : ${value}  ****`)
}

function setCorrupt(process) {
    process.isCorrupt = true
    console.log(`****  Corrupt : process ${process.id}  ****`)
}

function main(){
    if(number < (3*m + 1)){
        console.log("Cannot solve this problem")
        return
    }
    const index = Math.floor(Math.random() * (number-1))
    let initiatorProcess = Processes[index]
    setInitiator(initiatorProcess , initiatorValue)
    const corruptNode = new Set()
    for(let i =0 ; i< m ; i++) {
        let cindex = Math.floor(Math.random() * (number-1))
        while( (cindex == index) || (corruptNode.has(cindex)) ) {
            cindex = Math.floor(Math.random() * (number-1))
        }
        corruptNode.add(cindex)
        let corruptProcess = Processes[cindex]
        setCorrupt(corruptProcess)

    }
    OM(m , initiatorProcess ,  initiatorValue, new Set())
    PrintAgreedValue()

}


main()