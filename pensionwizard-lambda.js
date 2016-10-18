var http = require("http");
exports.buildSpeechletResponse  = (outputText, shouldEndSession) => {
        console.log('building speechlet response with ',outputText)

      return {
        outputSpeech: {
          type: "PlainText",
          text: outputText
        },
        shouldEndSession: shouldEndSession
      }

    }

exports.generateResponse = (speechletResponse, sessionAttributes) => {

      return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
      }
    }

exports.respond = function(context, responsePhrase,sessionAttributes, endConversationFlag ){
  context.succeed(exports.generateResponse(
    exports.buildSpeechletResponse(responsePhrase,endConversationFlag),
          sessionAttributes
    )
  );
}

exports.calculateStatePensionAge = (dob, gender, callback) => {
	console.log('dob received as: '+dob);

	var postData = JSON.stringify({
		dob: dob,
		gender: gender

	});
	console.log(postData)

	var options = {
	  hostname: 'state-pension-date.wealthwizards.io',
	  port: 80,
	  path: '/calculate',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': Buffer.byteLength(postData)
	  }
	};
		var respBody=""
		var req = http.request(options, (res) => {
	  console.log(`STATUS: ${res.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    respBody +=(chunk);
	  });
	  res.on('end', () => {
	    callback(respBody)
	  });
	});

	req.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.write(postData);
	req.end();

}

exports.handler = (event,context) => {
  convoObject = {
    "DateOfBirth": null,
    "Gender": null
  }
  dobObj = event.request.intent.slots.DateOfBirth.value
  if (dobObj){
    convoObject.DateOfBirth=dobObj
  }

  console.log('Date of birth found :' +dobObj)
	try{

		// new session
		if (event.session.new) {
			console.log("New session");
		}

		switch (event.request.type){
			// launch request
			case "LaunchRequest":
				context.succeed(
					this.generateResponse(
						this.buildSpeechletResponse('Welcome to Pension Wizard, the advisor in your pocket',false),
					{}
					)
				);

				console.log('launch request');
				break;
			// intent request
			case "IntentRequest":
				console.log('Intent Request');
        if(!convoObject.DateOfBirth){
          exports.respond(
            context,
            "In order to calculate that, I need to ask a couple of quick questions. First of all, what's your date of birth?",
            {},
            false
          );
        }
				this.calculateStatePensionAge(convoObject.DateOfBirth, function(response){
						var now = new Date();
				    var retirementDate = new Date(JSON.parse(response).state_pension_date);
						var diff = retirementDate - now;
						var years = parseInt(diff/1000/3600/24/365)
						var months = 0;
						months -= now.getMonth();
						months += retirementDate.getMonth();
						months = months >=0 ? months : 0
				    console.log(years);
						console.log(months);
					exports.respond(context, `You have ${years} years and ${months} months left until you can draw your state pension`,{}, true);
				});


				break;
			// session ended request
			 case "SessionEndedRequest":
			 	console.log('Session ended request')
				break;

			default:
				context.fail('invalid request type : $event.request.type')
		}
	}

    catch(error){
    	context.fail(error );
    }
}
