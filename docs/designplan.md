# Design plan for Distributed Systems Fall 20222

## Team

- Jari Sokka
- Jukka Koskelin
- Ville Muilu

## Project Topic

The aim of this project is to create a simple webshop, where the worker nodes updating warehouse inventory are distributed to different geograpic regions. Another theme is to explore a public cloud PaaS (Platform-as-a-Service) service offerring and reference architectures for building a modern, fault-tolerant high-availability system. The public cloud chosen for this project is Microsoft Azure.

## Project Technical Description

The webshop we are building has several architectural layers:

- Frontend, a single page app made with React.js and hosted in Azure Static WebApps.
- A messaging layer that frontend calls, which distributes frontend messages for the worker nodes. Azure Event Grid is used as messaging service.
- Backend layer that consists of the geographically distributed worker nodes hosted in Azure Serverless Functions.
- Data layer emulating a warehouse. Data will be stored in an nosql-database, possibly MongoDB. While the aim of the project is not to use a separate data storage for each of the nodes, using MongoDB API of Azure CosmosDB would make this possible. 
- Logging is handled by Application Insights, where are the functions will be connected.

## Nodes

Worker nodes are responsible for querying and updating data in warehouse database, and simulate a high-availability scenario where the nodes have been deployed to different geographic regions in Azure cloud. They subscribe to Event Grid Topics where messages from Frontend are pushed into, consume messages with HTTP trigger functions that execute a specific task.

As we are dealing with a high-availability scenario and services in different Azure regions are notoriously wobbly (not really, but we can simulate this by turning off functions), we also need to implement fault tolerance to the nodes. Event Grid does not care what happens to a message after it's consumed, so the worker nodes must each keep note what was the last message it consumed and wheter that execution was succesfully completed. If not, it needs to consume the message again. 

## Messages

**TODO: Messages need to be defined, these are just examples with no real thought put into them.**

The frontend implements three different API calls: GET all the items and their current quantities, GET the current quantity of a certain item, and UPDATE the quantity of a certain item.

Azure Event Grid [Event schema](https://learn.microsoft.com/en-us/azure/event-grid/event-schema#event-schema) describes the full event schema and an example of custom event we are using would be:

```
[{
  "id": "1807",
  "eventType": "recordInserted",
  "subject": "myapp/vehicles/motorcycles",
  "eventTime": "2017-08-10T21:03:07+00:00",
  "data": {
    "ean": "1234567",
    "name": "Suristin",
    "amount": "100"
  },
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/topics/{topic}"
}]
```

Where _data_ element describes the actual payload of the event message.

## Some Architectural choices

![Architecture sketch](./architecture.drawio.png)

### Frontend

Frontend is hosted in Static Web Apps, which actually offers hosting of two different services: the single page app and and backend functions (which are just Azure Functions). In this case, it is probably easier to create the bindings for Event Grid in the function code than it is in the SPA.

### Messaging

Azure offers two separate messaging services that could be used to distribute messages to worker nodes: *Event Grid* and *Service Bus*. Event Grid is the simpler of the two as it is meant only to distribute events that other services react to, and it does not really care who reacts or acts on the messages. Service Bus, on the other hand, would be used in a real high availability scenario. Service Bus handles a lot of the fault tolerance issues in distributed application, so the question for the project is wheter it actually does too much. With Event Grid, a lot of the fault tolerance logic is left for the rest of the implementation.

### Worker nodes

The main question for implementing the worker nodes is wheter they should be implemented as functions or full node.js apps hosted in Azure App Services. Functions come in two varieties; the serverless (and stateless) ones and durable functions that can store their state. 

### Data layer

Main questions with data layer are wheter it provides rich enough API for the functions to use out-of-the-box, or if we need to implement a simple api for storing and reading the data. Using a distributed data layer is an advanced topic that can be explored if time permits (then the obvious choice is to use Azure CosmosDB and distribute it to same geographic locations where worker nodes are, and play with the [consistency levels](https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels)).

## Required Functionalities

### Shared Distributed State

This should be implemented in the worker nodes and in it's simplest form it would be logging of the events received and executed by the worker, which could then be used for re-consuming an event that was not succesfully executed. The state needs to be stored somewhere, and the easiest option would be just to store the state in database.  If we use Service Bus, there really is no need to keep a log of the consumed messages, as the service itself can handle the timeouts and re-tries (we could of course opt not to use those features). 

One option would be to implement a pattern, where every consumed message is stored into an Azure Storage Account by the function reading the events/queue, and another function would consume the event/message and perform the actual action against the database. But this feels like too complicated approach for this kind of simple scenario.

### Naming and Node discovery

Azure Functions are assigned an unique url of (resource name).azurewebsites.net, and in case of functions directly messaging each other, we can store a list of the function urls and form a complete url of a function call by combining the address and path to a speficic function like https://myworkernode1.azurewebsites.net/api/helloworld. 

A more refined way of handling the intra-node messaging would be to just implement an Event Grid or Service Bus topic where the nodes are registed as message consumers, but not sure if this would be considered as a discovery of nodes.

Third option would be to create a public or private DNS zone and create DNS records with a friendly name; using a private DNS zone would require creating a virtual network and configuring the services to use it (with Event Grid having some limitations) and would likely be too time consuming approach for this project.

### Synchronization and consistency

Implementing this requirement is tied to how we want to handle the messaging layer - if we use Service Bus, both aspect a to some degree taken care by the messaging layer, that can be used to dictate that a message has to be consumed at least one, and only once. With Event Grid (or some kind of custom messaging solution) we would need to implement more of this logic to the worker nodes.

Consistency could be implemented by distributing the data layer as described in the [Data Layer](#data-layer) above. Using an eventual consistency mode of Cosmos DB would probably lead to implementing all kinds of interesting synchronization things into the worker nodes, as the database shards in different geograpchies might hold an entirely different opinion of what amount of which item is available at any given time (not a really realistic scenario, but whatever).

### Fault Tolerance

Same as above; with Service Bus, a lot of the fault tolerance issues are handled by the messaging service. 

### Consensus

Given our scenario, implementing some kind of joint decision -making -mechanism does not really make sense. We might be able to implement something if we decide that nodes handle the re-tries of failed events - they might decide between themselves if they agree that a certain event has not been processed and which node would then re-consume the said event.