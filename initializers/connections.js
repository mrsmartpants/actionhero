var uuid = require("node-uuid");

var connections = function(api, next){

    api.connections = {}

    // {type: type, remotePort: remotePort, remoteIP: remoteIP, rawConnection: rawConnection}
    api.connection = function(data){
      this.setup(data)
      this.joinRoomOnConnect();
      api.connections[this.id] = this;
    }

    api.connection.prototype.setup = function(data){
      var self = this;
      self.id = self.generateID();
      self.connectedAt = new Date().getTime();
      ['type', 'remotePort', 'remoteIP', 'rawConnection'].forEach(function(req){
        if(data[req] == null){ throw new Error(req + ' is required to create a new connection object'); }
        self[req] = data[req];
      });

      var connectionDefaults = {
        error: null,
        params: {},
        response: {},
        pendingActions: 0,
        totalActions: 0,
        messageCount: 0,
        additionalListeningRooms: [],
        roomMatchKey: null,
        roomMatchValue: null,
        room: api.configData.general.defaultChatRoom,
      }

      for(var i in connectionDefaults){
        self[i] = connectionDefaults[i];
      }
    }

    api.connection.prototype.joinRoomOnConnect = function(){
      if(api.connections[this.id] == null){
        if(this.type != "web" || (this.type == "web" && api.configData.commonWeb.httpClientMessageTTL > 0 )){
          api.chatRoom.roomAddMember(this);
        }
      }
    }

    api.connection.prototype.generateID = function(){
      return uuid.v4();
    }

    api.connection.prototype.destroy = function(){
      var self = this;
      if(self.type == "web" && api.configData.commonWeb.httpClientMessageTTL == null ){
        delete api.connections[self.id]
        delete self;
      }else{
        api.chatRoom.roomRemoveMember(self, function(err, wasRemoved){
          delete api.connections[self.id];
          delete self;
        }); 
      }
    }

  next();
}

exports.connections = connections;