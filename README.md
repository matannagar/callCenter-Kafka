# Call Center :phone:

A system built from three subsystems that together enable monitoring of incoming calls to the call center  
in Near Real Time access and using a dashboard that displays key metrics,  
~~and also allows early call type classification to route the nature of the call recommended to the answering provider~~.  
(The last option will be added in the future)

## Technologies
![redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![mysql](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![mongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)
![docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![socket](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)

## What The System Does

* Stores clients details on local mySQL server  

| Name | ID | Birth Date | City | Gender | Subscriptions |
|------|----|------------|------|--------|---------------|  

* The system will receive call details and will store, process and present them
* The data that will be stored in the system at the end of each call:  

| Period | Start Call | City | Age | Gender | Total Calls | Product | Topic |
|--------|------------|------|-----|--------|-------------|---------|-------|  

* The system will present total number of current waiting calls
* Avarage waiting time in the last 10 minutes
* Present numbers of waiting calls and waiting times throughout the day
* End of the day stats : sum how many calls from each topic
* The calls will be stored in mongoDB
* The data will reset itself at the end of each day!

## Getting Started

### Dependencies

* NodeJS v14.17.5
* mySQL workbench
* Docker with Redis image

### Register to the following Cloud Services:

* https://www.cloudkarafka.com/
* https://cloud.mongodb.com/
* Another option is to configure the settings to run mongoDB locally

### Installing

* git clone this repository
* Inside each folder open cmd and run
```
npm i install 
```
* At each folder named 'Kafka':
  1. Replace the credentials variable 
  2. update the .env file

### Executing program

* Inside each folder run
```
node app.js
```

## Structure

### Sender

Responsible for loading customers data from local mySQL  
Generating random calls and publishing the call's information via Kafka.  

![sender](gifs/sender.gif)

### Redis

After receiving the call's information from Kafka,  
the data is then stored inside Redis (including expiration data)  

![redis](gifs/redis.gif)

### mongoDB

Every call is stored inside mongoDB for later studying.

![mongo](gifs/mongo.gif)

## Authors


