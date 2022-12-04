# Team Azure Final report

## Team

- Jari Sokka
- Jukka Koskelin
- Ville Muilu

## Project goals

__TODO: Jari__

. The project’s goal(s) and core functionality. Identifying the applications / services that can build on
your project.

## Design Principles

__TODO: Jukka__

2. The design principles (architecture, process, communication) techniques.
- This is typically the main part of the report, because it documents the system design and
maps it with the source code

The aim of the project was to develop a skeleton of a webshop system with public cloud Platform-as-a-Service (PaaS) components. We chose Microsoft Azure as the platform as one of project members had previous experience on using it, though not actually implementing a distributed system. With this in mind, we set on exploring what PaaS services would fit the project, with clear understanding the the architecture we ended up with might not be one we designed at the start. We did, however, had quite a clear though of the architectural layers we were going to implement and the languages to be used.

In whole, the architecture pattern used can be best though as a modular monolith - a service made of multiple components that can be changed to use different services if needed, but not implementing a microservice pattern where, for example, each node would be represented by a self-sustained service with it's own data layer. Implementing a microservice would require more considerantion of the lifecycle of each invidual service, including things like fault tolerance, which we felt to be a too large undertaking.

### Frontend layer

The frontend layer representing a simple webshop was to be implemented as a single page app (SPA) with React framework that would fetch data for the webshop from the data layer, and initiate updates by send asynchronous messages to the middleware messaging layer. 

We chose Azure Static Web Apps (SWA) as the PaaS service to be used and had no reason to change it during the implementation phase, even if we did stumble into several limitations concerning the integration with messaging layer. SWA is actually made of two different services; hosting of the SPA application and hosting of a backend function, which is a limited version of an Azure Function Application. One of the limitations is that the backend function only supports http-binding for the function, and it is mainly meant to be used between the SPA and the backend function itself. Implementing a messaging integration, however, requires an outbound binding to the messaging layer, which the backend function does not support (which is not really documented well). We went around this limitation by implementing the messaging integration by using Azure nodejs npm-package for the messaging server, which is a bit of a messy way of implementing the integration, but works well enough for demonstration purposes. The more elegant way would have been not to deploy the backend function at all, but either to implement the integration directly to the SPA, or by deploying a separate Azure Function App to handle the messaging integration (which would have required a preminium offering of the SWA).

### Messaging layer

Selecting the PaaS service for the messaging layer was, from architectural viewpoint, one of the most demanding tasks of the project. Azure basically has two services that can both handle the messaging: _Azure Event Grid_ which is meant for doing integration with lightweight messages, and _Azure Service Bus_ which is meant for business-critical messages with possibility of larger payloads.

We ended up using _Service Bus_ as it implements a lot of the features required from the project. With Service Bus, we use a simple _queue_ where frontend application pushes messages, and to which our distributed worker nodes subscribe to. Our Service Bus queue uses a first in, first out (FIFO) paradigm, which means that it's pretty dumb; messages pushed to the queue retain their order of appearance, and they are served out in that same order. Subscribed services consume the messages with the fastest-wins -principle.

Service Bus supports even more fault tolerant messaging options, like peek-locking, meaning that a subscribed service first reads a message from the queue and reserves it so that competing services are not able to read it. After completing it's transaction, it then deletes the message from the queue, and if the transaction for some reason fails, queue releases the message back for others to consume after a configurable period of time. Unfortunately our chosen implementation language (javascript) did not support this feature yet.

### Distributed layer

We chose our transaction layer to be the distributed part of the system and ended up having an X amount of distributed worker nodes that consume messages from messaging layer and perform the update operations agains the data layer. We have a single worker implementation and deploy it to multiple Azure Function Apps that are geographically distributed. Worker application has an inbound Service Bus binding that is configured to listen to the Service Bus Queue. When messages appear in the queue, a function is triggered, the function reads the message and subsequently calls the data layer to perform an update transaction with the details gathered from the message payload. After completion the function stops, and is triggered again when the next message is picked up from the queue.

### Data layer

We chose Azure Cosmos DB as our data storage option, as it is a global distributed service. The initial architectural decision was to use it only in a single region, with the option to fan it out to the same regions our worker nodes are in, if time permits trying that out.

Our Cosmos DB acts as a document storage with MongoDB API as implementation option. MongoDB was chosen because one of our team members was familiar with it. On top of it, we implemented a simple database api that also runs in an Azure Function application. 

### Logging

We use Azure Application Insights as to log and debug our function apps. Every function app is connected to the same Application Insight -instance and provide logging that goes through the layers, which the exception of the message layer, where we use Service Bus metrics to observe the amount of messages passing through the queue.

## Functionalities

__TODO: Ville__

3. What functionalities does your system provide? For instance, naming and node discovery,
consistency and synchronization, fault tolerance and recovery, etc? For instance, fault tolerance
and consensus when a node goes down.

## Scalability and performance

__TODO: JUkka__

4. How do you show that your system can scale to support the increased number of nodes?

5. How do you quantify the performance of the system and what did you do (can do) to improve the
performance of the system (for instance reduce the latency or improve the throughput)?

## Key enablers and lessons learned

__TODO: Kaikki__

6. The key enablers and the lessons learned during the development of the project.


## Group member participation

7. Notes about the group member and their participation, work task division, etc. Here you also may
report, if you feel that the points collected to group should be split unevenly among group
members. Use percentages when descripting this balancing view point.
