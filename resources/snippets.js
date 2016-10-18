exports.handler = (event,context) => {
  // Lambda scaffold. Everything needs to be contained within this event handler
}


var respond = (context, responsePhrase,sessionAttributes, endConversationFlag ) => {
  context.succeed(
      {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: {
          outputSpeech: {
            type: "PlainText",
            text: responsePhrase
          },
          shouldEndSession: endConversationFlag
        }
      },sessionAttributes
  );
}



{
  "intents": [
    {
      "intent": "GetStatePensionDate",
      "slots": [
        {
          "name": "Gender",
          "type": "LIST_OF_GENDERS"
        },
        {
          "name": "DateOfBirth",
          "type": "AMAZON.DATE"
        }
      ]
    }
  ]
}
