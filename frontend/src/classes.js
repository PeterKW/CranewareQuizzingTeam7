class Player
{
  const name;
  const id;
  const score = 0;
  const streak = 0;

  // Should send lobbyCode to server
  function connectToLobby(lobbyCode)
  {

  }

  // Sends the answer selected to the server
  function sendAnswerChoice(option)
  {

  }
}

class ClientEventHandler()
{
  isLoggingOn = false;
  connectedChannels = [];

  constructor(logging)
  {
    setLogging(logging);
  }
  constructor()
  {
    this.isLoggingOn = false;
  }

  // Allows logs to be turned on or off
  function setLogging(onOff)
  {
    // Logs all network communication information to console
    this.isLoggingOn = onOff;
    Pusher.logToConsole = onOff;
  }

  // Channels are streams over which events can be sent.
  function connectToChannel(channel)
  {
    connectedChannels.push(pusher.subscribe(channel));
  }

  // Will listen for a particular event on a single channel
  function listenForEvent(channelNo, event, callback)
  {
    connectedCHannels[channelNo].bind(event, callback);
  }

  function findChannelNo(channelName)
  {

  }
}

let evntHand = new ClientEventHandler(true);
evntHand.connectToChannel('private-channel');
evntHand.listenForEvent(0,'test', function(){console.log(evntHand);console.log('Old handler:');console.log(this.eventhandler);});
