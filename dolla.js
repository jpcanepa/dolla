var rtm_client = require('@slack/client').RtmClient;
var memory_data_store = require('@slack/client').MemoryDataStore;
var client_events = require('@slack/client').CLIENT_EVENTS;
var rtm_events = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new rtm_client(bot_token,
{
    logLevel: 'error',
    dataStore: new memory_data_store()
});

let my_id;
rtm.on(client_events.RTM.AUTHENTICATED, function(rtmStartData) {
    console.log(`Logged in as "${rtmStartData.self.name}" of team "${rtmStartData.team.name}", not yet connected to a channel`);
});



rtm.on(rtm_events.MESSAGE, function(message) {
    let user = rtm.dataStore.getUserById(message.user);
    console.log(`New message from ${user.name}`);

    if(message.text.indexOf('
});

rtm.start();
