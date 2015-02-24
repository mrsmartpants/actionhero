---
layout: docs
title: Documentation - Middleware
---

# Middleware

<img src="/img/connection_flow.png" />

## Action Middleware

actionhero provides hooks for you to execute custom code both before and after the execution of all actions.  You do this with `api.actions.addPreProcessor(function, priority)` and `api.actions.addPostProcessor(function, priority)`.

This is a great place to write authentication logic or custom loggers.  The `priority` in all the above is optional, and if not provided, the option `api.config.general.defaultProcessorPriority` will be used (defaults to 100).

preProcessors, like actions themselves, return the connection and a `toProcess` flag.  Setting `toProcess` to false will block the execution of an action.  You can operate on `connection.response` and `connection.error`, just like within an action to create messages to the client.

**preProcessors** are provided with `connection`, `actionTemplate`, and `next`.  They are expected to return (connection, toProcess)
**postProcessors** are provided with `connection`, `actionTemplate`, `toRender`, and `next`.  They are expected to return (connection, toRender)

Note: preProcessor will be executed before connections have their params filtered.  This means that you will have access to all the request's input at `connection.params`.  Extra caution should be used.

Some Examples:

{% highlight javascript %}

// a preProcessor to check if a userId is provided:

api.actions.addPreProcessor(function(connection, actionTemplate, next){
  if(connection.params.userId == null){
    connection.error = "All actions require a userId";
    next(connection, false);
  }else{
    next(connection, true);
  }
});

// a postProcessor to append the action's description to the response body

api.actions.addPostProcessor(function(connection, actionTemplate, toRender, next){
  connection.response._description = actionTemplate.description;
  next(connection, toRender);
});

{% endhighlight %}

Action middleware is often used in authentication.  Here are some examples:

* [simple authentication middleware](https://github.com/evantahler/actionhero-tutorial/blob/master/initializers/middleware.js)
* [mongoDB based authentication](https://gist.github.com/panjiesw/7768779)

## Connection Middleware

Like the action middleware above, you can also create middleware to react to the creation or destruction of all connections.  Unlike action middleware, connection middleware is non-blocking and connection logic will continue as normal regardless of what you do in this type of middleware. 

Use `api.connections.addCreateCallback(function, priority)` to be notified of all new connections, and conversly `api.connections.addDestroyCallback(function, priority)` to be notified when a client disconnects.  Keep in mind that some connections persist (webSocket, socket) and some only exist for the duration of a single request.  You will likely want to inspect `connection.type` in this middleware.  Again, if you do not provide a priority, the default from `api.config.general.defaultProcessorPriority` will be used.

Any modification made to the connection at this stage may happen either before or after an action, and may or may not persist to the connection depending on how the server is implemented.

{% highlight javascript %}

api.connections.addCreateCallback(function(connection){
  console.log(connection);
});

api.connections.addDestroyCallback(function(connection){
  console.log(connection);
});

{% endhighlight %}

## Chat Middleware

The last type of middleware is used to act when a connection joins, leaves, or communicates within a chat room. We have 3 types of middleware for each step: `sayCallbacks`, `joinCallbacks`, and `leaveCallbacks`.

{% highlight javascript %}
api.chatRoom.addJoinCallback(function(connection, room, callback){}, priority);
// callback is of the form `function(error)`

api.chatRoom.addLeaveCallback(function(connection, room, callback){}, priority);
// callback is of the form `function(error)`

api.chatRoom.addSayCallback(function(connection, room, messagePayload, callback){}, priority);
// callback is of the form `function(error, modifiedMessagePayload)`
{% endhighlight %}

{% highlight javascript %}
var chatMiddlewareToAnnounceNewMembers = function(connection, room, callback){
  api.chatRoom.broadcast({}, room, 'I have entered the room: ' + connection.id, function(e){
      callback();
  });
}

api.chatRoom.addJoinCallback(chatMiddlewareToAnnounceNewMembers, 100);

var chatMiddlewareToAnnounceGoneMembers = function(connection, room, callback){
  api.chatRoom.broadcast({}, room, 'I have left the room: ' + connection.id, function(e){
      callback();
  });
}

api.chatRoom.addLeaveCallback(chatMiddlewareToAnnounceGoneMembers, 100);

var middlewareToAddSimleyFacesToAllMessages = function(connection, room, messagePayload, callback){
  messagePayload.message = messagePayload.message + ' :)';
  callback(null, messagePayload);
}

api.chatRoom.addSayCallback(middlewareToAddSimleyFacesToAllMessages, 100);
{% endhighlight %}

Priority is optional in all cases, but can be used to order your middleware.  If an error is returned in any of these methods, it will be returend to the user, and the action/verb will not complete.

More detail and nuance on chat middleware can be found in the [chat section](/docs/core/chat.html)