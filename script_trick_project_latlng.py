import sys
import math
inFile = open(sys.argv[1], "r")
outFile = open(sys.argv[2], "w")
for line in inFile:
  #we split by space and then by comma
  words = line.split(" ") 
  for index in range(len(words)):
    #scale dirty reprojectors
    #Eastmost : 485869.5728
    #X: 7.43863 - 6.15591 correspond à 200000 - 118000
    #Y: 3.74492 : 0.99000
    #X: 1.28272 : 0.82
    #Or
    WestmostMerc = -20026376.38
    SouthmostMerc = -20048966.10
    EastmostMerc = -WestmostMerc
    NorthmostMerc = -SouthmostMerc
    Westmost = 2420000
    Southmost  = 130000
    Eastmost = 2900000
    Northmost = 1350000
    scaleFactor = min((EastmostMerc - WestmostMerc)/(Eastmost - Westmost),
                      (NorthmostMerc-SouthmostMerc)/(Northmost-Southmost))
    #line added for number in other attributes than geometry
    if (index > 10):
      try:
        yCoord = float(words[index])
        yCoord = (yCoord - Southmost)*scaleFactor + SouthmostMerc
        words[index] = str(yCoord)
      except ValueError:
        potentialNumbers = words[index].split(',')
        for jindex in range(len(potentialNumbers)):
          potentialNumber = potentialNumbers[jindex]
          try:
            xCoord = float(potentialNumber)
            #convert into mercator
            xCoord = (xCoord - Westmost)* scaleFactor + WestmostMerc
            potentialNumbers[jindex] = str(xCoord)
          except ValueError:
            pass
        words[index] = ','.join(potentialNumbers)
  outFile.write(" ".join(words)+ '\n')
inFile.close()
outFile.close()
    
