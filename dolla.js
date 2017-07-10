var Botkit = require('botkit');

var controller = Botkit.slackbot({send_via_rtm: true});

var bot = controller.spawn({token : process.env.SLACK_BOT_TOKEN});

function unixNow()
{
    return Date.now() / 1000|0;
}

controller.hears([/Hagamos un ([^ ?]*)\s*\??/],['mention','direct_mention','ambient'], function(bot, message) {
    let event_name = message.match[1];  
    bot.startConversation(message, function(err, convo){

        convo.setVar('event_name', event_name);
        
        convo.addMessage('¡La raja!', 'yes_thread');
        convo.addMessage(
            {
                mrkdwn: true,
                text: `**{{vars.event_name}} <!date^${unixNow()}^{date_long}|hoy>**`
            }, 'yes_thread');

        convo.addMessage({action:'completed', text:'[{{vars.event_name}}] Bu. Será para la otra'}, 'no_thread');


        convo.addQuestion('¿Se armó? ({{vars.event_name}})',
            [
                {
                    pattern: "(si|sí|dale|ok|sip|obvio)",
                    callback: function(response, convo){
                        console.log("New event confirmed by user");
                        convo.gotoThread('yes_thread');
                    }
                },
                {
                    pattern: bot.utterances.no,
                    callback: function(response, convo){
                        console.log("New event cancelled by user");
                        convo.gotoThread('no_thread');
                    }
                },
                {
                    default:true,
                    callback: function(Response, convo){
                        convo.say("Perdón, no entendí la respuesta.");
                        convo.repeat();
                        convo.next(); 
                    }
                }
            ], {}, 'default');
    });
});

controller.hears([/(\S+)\s+y\s+(\S+) son (pareja|grupo|uno)/], ['direct_mention'], function(bot, message){
    let user1 = message.match[1], user2 = message.match[2];
    console.log(`New group for ${user1} y ${user2}`);
    bot.reply(message, {text: `Ok, de ahora en adelante ${user1} y ${user2} cuentan como grupo`, link_names:true});
});


bot.startRTM(function(err, bot, payload){
    if(err) {
        throw new Error('Could not connect to Slack');
    }
});
