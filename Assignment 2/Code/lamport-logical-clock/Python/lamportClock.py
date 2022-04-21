from multiprocessing import Process, Pipe
from os import getpid
from datetime import datetime


def localTime(counter):
    return ' (Lamport Clock = {})'.format(counter)


def calculateRecievedTimestamp(recv_time_stamp, counter):
    return max(recv_time_stamp, counter) + 1


def event(pid, counter):
    counter += 1
    print('Event happened in {} !'.format(pid) + localTime(counter))
    return counter

def sendMessage(pipe, pid, counter):
    counter += 1
    pipe.send(("process Id = {}".format(pid), counter))
    print('Message sent from ' + str(pid) + localTime(counter))
    return counter

def recieveMessage(pipe, pid, counter):
    message, timestamp = pipe.recv()
    counter = calculateRecievedTimestamp(timestamp, counter)
    print('Message received at ' + str(pid)  + localTime(counter))
    return counter

def Process1(pipe12):
    pid = getpid()
    counter = 0
    counter = event(pid, counter)
    counter = sendMessage(pipe12, pid, counter)
    counter  = event(pid, counter)
    counter = recieveMessage(pipe12, pid, counter)
    counter  = event(pid, counter)

def Process2(pipe21, pipe23):
    pid = getpid()
    counter = 0
    counter = recieveMessage(pipe21, pid, counter)
    counter = sendMessage(pipe21, pid, counter)
    counter = sendMessage(pipe23, pid, counter)
    counter = recieveMessage(pipe23, pid, counter)


def Process3(pipe32):
    pid = getpid()
    counter = 0
    counter = recieveMessage(pipe32, pid, counter)
    counter = sendMessage(pipe32, pid, counter)


def main():
    oneandtwo, twoandone = Pipe()
    twoandthree, threeandtwo = Pipe()

    process1 = Process(target=Process1, args=(oneandtwo,))
    process2 = Process(target=Process2, args=(twoandone, twoandthree))
    process3 = Process(target=Process3, args=(threeandtwo,))

    process1.start()
    process2.start()
    process3.start()

    process1.join()
    process2.join()
    process3.join()




if __name__ == '__main__':
    main()
    
