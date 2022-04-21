const notReplyingProbibility = 0.9

class Process {
    constructor(id) {
        this.id = id
        this.isCoordinator = false
        this.coordinator = null
        this.message = null
        this.failed = false
    }
    sendMessage(process , message){
        return process.setMessage(message)
    }
    setMessage(message) {
        if(!this.failed) {
            this.message = message
            return true
        }
        return false
    }
    election(process) {
        if((process.id < this.id) && (Math.random() > notReplyingProbibility) && (!this.failed) ) {
            console.log(`\t\tprocess ${this.id} replied`)
            return true
        }
        return false
    }



}
const number = 10

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
 }

function getProcessors() {
    var processes = []
    for(var i =0;i<number;i++){
        var newProcess = new Process(i)
        processes.push(newProcess)
    }
    return shuffleArray(processes)
}

const Processes = getProcessors()


function sendToCoordinator(process , message){
    var coordinator = process.coordinator
    return process.sendMessage(coordinator , message)
}

function setCoordinator(process) {
    for(var i in Processes){
        Processes[i].isCoordinator = false
        Processes[i].coordinator = process
    }
    process.isCoordinator = true
    console.log("New Coordinator is " , process.id)
}

function election(process) {
    var i = 0
    while(i<Processes.length) {
        if(Processes[i].election(process)){
            break
        }
        i+=1
    }
    if(i < Processes.length) {
        setCoordinator(Processes[i])
    } else {
        setCoordinator(process)
    }
    

}



function Bully(process) {
    console.log(`Sending message from ${process.id} to ${process.coordinator.id}`)
    if(!process.sendMessage(process.coordinator , "test")) {
        election(process)
    }
    else {
        console.log("Message successfully sent ( Coordinator is working )")
    }    


}

function main() {
    console.log(Processes)
    setCoordinator(Processes[0])
    Processes[0].failed = true
    console.log("Initial Coordinator is " , Processes[0].id , " and it failed")
    var index = Math.floor(Math.random() * (number-1)) + 1
    var newProcess = Processes[index]
    Bully(newProcess)
    var index2 = Math.floor(Math.random() * (number-1)) + 1
    var newProcess2 = Processes[index2]
    Bully(newProcess2)

}


main()