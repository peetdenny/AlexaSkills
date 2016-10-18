exports.handler = (event,context) => {

    buildSpeechletResponse = (outputText, shouldEndSession) => {

      return {
        outputSpeech: {
          type: "PlainText",
          text: outputText
        },
        shouldEndSession: shouldEndSession
      }

    }

    generateResponse = (speechletResponse, sessionAttributes) => {

      return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
      }
    }
	try{


		// new session
		if (event.session.new) {
			console.log("New session");
		}

		switch (event.request.type){
			// launch request
			case "LaunchRequest":
				context.succeed(
					generateResponse(
						buildSpeechletResponse('Welcome to Money Wizard, the advisor in your pocket',false),
					{}
					)
				);

				console.log('launch request');
				break;
			// intent request
			case "IntentRequest":
				console.log('Intent Request');
				context.succeed(
					generateResponse(
						buildSpeechletResponse('you have £30 left in your accounts',true),
					{}
					)
				);
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
    	context.fail(error);
    }

}
