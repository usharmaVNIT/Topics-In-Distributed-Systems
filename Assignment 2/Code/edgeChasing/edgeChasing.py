# BT18CSE021
# Ujjwal Sharma
# usharma@students.vnit.ac.in

class Site :
    def __init__(self , NoOfProcesses , siteID) -> None:
        self.siteId = siteID
        self.processes = []
        for e in range(1,NoOfProcesses+1):
            name = 'p-'+str(siteID) + '-' + str(e)
            self.processes.append(name)
        

    def display(self) :
        print("Site ID : " , self.siteId)
        print('\tTotal Processes - ' , len(self.processes))
        for e in self.processes:
            print('\t\t' , e)
    


class PathInfo :
    def __init__(self) -> None:
        self.senderSite = None
        self.senderProcess = ''
        self.recieverSite = None
        self.recieverProcess = ''


class ProbeMessage : 
    def __init__(self) -> None:
        self.i = self.j = self.k = ''


def main():
    NoOfSites : int
    NoOfProcess : int
    NoOfEdges : int

    NoOfSites = int(input("Enter Total No. Of Sites : "))
    sites = []
    for siteID in range(1,NoOfSites+1):
        NoOfProcess = int(input("Enter Total No. Of Processes For site {} : ".format(siteID)))
        site = Site(NoOfProcess , siteID)
        sites.append(site)
    for site in sites:
        site.display()
    print("Enter the site ID and process ID for which deadlock detection shold be initiated : ")
    site = int(input('Site : '))
    processId = input("Process Id (as specified above) : ")
    NoOfEdges =  int(input("For detecting deadlock, Enter the no of requesting edges between Sites : "))
    pathInfo = []
    
    probeMessage = []
    deadlock = False
    for i in range(0 , NoOfEdges):
        print("Enter the processes of two different sites connected with requesting edge : ")
        process1 = input('Process 1 (eg. p-1-1): ')
        process2 = input('Process 2 (eg. p-2-1): ')
        path = PathInfo()
        path.senderProcess = process1
        path.recieverProcess = process2
        message = ProbeMessage()
        for j in range(0 , NoOfSites):
            for pid in sites[j].processes:
                if pid == process1:
                    path.senderSite = sites[j].siteId
                if pid == process2:
                    path.recieverSite = sites[j].siteId
        print("For this edge Probe message is: (",processId ,"," , process1 , "," , process2 , ")")
        message.i = processId
        message.j = process1
        message.k = process2
        pathInfo.append(path)
        probeMessage.append(message)
    
    print("Probes - ")
    for path in pathInfo:
        print('\t' , path.senderProcess , '(',path.senderSite , ')' , ' --> ' , path.recieverProcess,'(' ,  path.recieverSite , ')')
    found = True
    for i,message in enumerate(probeMessage):
        if message.i == message.k:
            print("\n ********** Deadlock Detected ********** ")
            deadlock = True
            cycle = []
            x = 0
            cycle.append(pathInfo[i].recieverSite)
            x+=1
            cycle.append(pathInfo[i].senderSite)
            prev = pathInfo[i].senderSite
            j = i-1
            while j>=0:
                while j>0 and pathInfo[j].recieverSite != prev:
                    j-=1
                cycle.append(pathInfo[j].senderSite)
                prev = pathInfo[j].senderSite
                j-=1
            newCycle = ['Site'+str(x) for x in cycle[::-1]]
            print("\nPath : " , end='\n\t')
            print(*newCycle , sep = ' --> ')
            print('\n\n')
            
            
            break
    if deadlock == False:
        print("\n\n ********** Deadlock Not Detected **********\n")






if __name__ == "__main__":
    main()
        