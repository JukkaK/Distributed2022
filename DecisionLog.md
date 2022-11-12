# Decision log

Why and how we chose to do something.

__09.11.2022 Second Exercise meeting__

We decided that the project goal is to implement a simple shopping basket with the following components:

- Single Page App as frontend
- Event Grid as middleware (this needs prototyping and can change)
- Serverless function apps as worker nodes
- A MongoDB as data storage (in essence this should be CosmosDB with Mongo API)
- An API as app service in front of CosmosDB if the Mongo API is not enough

__02.11.2022 First Exercise meeting__

We decided to do something that works in Azure (because why not?). On one hand, using public cloud PaaS adds some complexity to the solution, as not everyone is probably familiar with the services. On the other hand, the existing services and PaaS-components make it rather easy to do prototyping with, and there are plenty of code examples.

The initial idea was to do something as simple as possible, so we decided to explore doing something as simple as adding/deleting/moving files. The initial architecture (picture might follow) would be:

- A single page app as frontend.
- A message bus as messaging middleware.
- Serverless function apps as nodes.
- A storage account file share as data.
- An application insights log for observing and testing.

So the frontend calls either service bus or some kind of routing component, the functions are listeting to service bus which handles the message distribution, and the functions perform the tasks and manipulate files in file shares. We might and probably will need more components to handle the state (load balancer, stateful functions or some other kind of state handling, etc).