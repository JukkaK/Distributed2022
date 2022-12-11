# Synopsis for demo session

## Introduction

* Overview of the project
    * A simple web shop with distributed update operations.    
* Purpose of the project
    * To explore how to implement a distributed architecture with public cloud PaaS-services.
    * We chose Microsoft Azure as platform.
    * Services are partially implemented as infrasturcture-as-code. Frontend not yet implemented as IAC.
    * We chose to implement functionaly with react and nodejs/typescript, as majority of the group knew those.

## Architecture

* Architecure overview
    * Show diagram and go through layers.
* Frontend layer
    * React single-page-app hosted in static web apps. 
    * Backend function that that SPA calls, which sends a simple message to service bus. PUT-calls trigger backend function.
    * GET-api calls are send directly to data layer.
* Messaging layer
    * Messaging: Service bus with simple first-in, first-out queue. 
* Backend distributed layer 
    * Workers: A simple Azure Function with service bus trigger that incoming messages to queue trigger.
    * Workers: Same appliction is deployed to three separate instances, that are configured to call dbApis.
* Data distributed layer
    * Azure Cosmos DB with Mongo DB API deployed to three regions.
    * A simple dbApi implemented as Azure Function. 
    * DbApi is deployed to three separate instances, all are configured to favour the Cosmos DB instance in the same region.
* Logging
    * Frontend and functions are connected to Application Insights that displays near real-time logging.
    * (Some of the logs) are shipped to Log Analytics workspace.

## Lessons learned

* Paas Services
    * We started with different event-based architecture that used Azure Event Grid.
    * Implementing a working system would have required more time than we had (though might have fitted course better).
    * So we opted to Plan B and use Service Bus, which handles the message distribution out-of-the-box.
    * Using PaaS components eases implementing, as most critical layers as available as services. Understanding and configuring the services takes some time, though.
    * Cosmos DB offers interesting choices with consistency: however, even with the most inconsisted setting of _'eventual consistency'_ everything seemed to be pretty consistent. It would probably require quite a heavy load to get some inconsistencies.
* Fault tolerance
    * System is somewhat fault-tolerance.
    * Shutting down worker nodes is fine.
    * Shutting down dbapis is not, since every worker is paired with a dbapi as they are simply configured with dbapi function endpoints.
    * DbApis and Cosmos DB are quite fault-tolerant, as Cosmos DB has three replicas if one goes down, dbapis can use other replicas.
    * Service Bus and Front end are regionally fault tolerant, but if all 3 datacenters in West Europe go down, they go down.
    * Adding a load balancer between workers and db would help.
* Implementation    
    * Turns out that .Net is still a first class citizen in Azure: could have implemented a peek-and-destroy -type handling of the messages with that.
    * Found out that our main dbapi died when having to handle both read and write -operations, so we dedicated one dbapi just for reads by shutting down it's worker node.
    * Azure Static Web Apps sounds like a fine offering on paper, but it has a lot of limitations. One cannot bind the backend api to service bus, but messages have to be send via service bus sdk. 