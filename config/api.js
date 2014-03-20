exports.default = {
  general: function(api){
    return {
      apiVersion: '0.0.1',
      serverName: 'actionhero API',
      // id can be set here, or it will be generated dynamically.
      //  Be sure that every server you run has a unique ID (which will happen when generated dynamically)
      //  id: 'myActionHeroServer',
      // A unique token to your application that servers will use to authenticate to each other
      serverToken: 'change-me',
      // The welcome message seen by TCP and webSocket clients upon connection
      welcomeMessage: 'Hello! Welcome to the actionhero api',
      // The body message to accompany 404 (file not found) errors regarding flat files
      flatFileNotFoundMessage: 'Sorry, that file is not found :(',
      // The message to accompany 500 errors (internal server errors)
      serverErrorMessage: 'The server experienced an internal error',
      // defaultLimit & defaultOffset are useful for limiting the length of response lists.
      defaultLimit: 100,
      defaultOffset: 0,
      // the redis prefix for actionhero's cache objects
      cachePrefix: 'actionhero:cache:',
      // Watch for changes in actions and tasks, and reload/restart them on the fly
      developmentMode: true,
      // How many pending actions can a single connection be working on
      simultaneousActions: 5,
      // disables the whitelisting of client params
      disableParamScrubbing: false,
      // params you would like hidden from any logs
      filteredParams: [],
      // The default filetype to server when a user requests a directory
      directoryFileType : 'index.html',
      // configuration for your actionhero project structure
      paths: {
        'action':      [ __dirname + '/../actions'      ] ,
        'task':        [ __dirname + '/../tasks'        ] ,
        'public':      [ __dirname + '/../public'       ] ,
        'pid':         [ __dirname + '/../pids'         ] ,
        'log':         [ __dirname + '/../log'          ] ,
        'server':      [ __dirname + '/../servers'      ] ,
        'initializer': [ __dirname + '/../initializers' ] ,
        'package':     [ __dirname + '/../node_modules' ] 
      },
      // list of actionhero plugins you want to load
      plugins: [
        // this is a list of package names
        // packages still need to be included in `package.json` or the path defined in `api.config.general.paths.package`
        'ah-sample-plugin'
      ],
      // hash containing chat rooms you wish to be created at server boot
      startingChatRooms: {
        // format is {roomName: {authKey, authValue}}
        //'secureRoom': {authorized: true},
        'defaultRoom': {}
      }
    }
  }
}

exports.test = { 
  general: function(api){
    return {
      id: 'test-server',
      developmentMode: true,
      startingChatRooms: {
        'defaultRoom': {},
        'otherRoom': {},
        'secureRoom': {authorized: true}
      },
      developmentMode: true
    }
  }
}

exports.production = { 
  general: function(api){
    return {  
      developmentMode: false
    }
  }
}