// var caloriesList = require('./calories');
var cList = {
  "apple" : 95,
	"orange" : 45,
	"banana" : 105,
	"mango" : 201,
	"watermelon" : 85,
	"peach" : 59
};

var totalCalories = 0;
var height = 66; //inches
var weight = 180; //pounds
var gender = true; //female, false for male
var age = 20; //years

exports.handler = (event, context) =>
{
  try {
    if (event.session.new) {
      //New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // > Launch Request
        console.log("LAUNCH REQUEST")
        context.succeed (
          generateResponse(
            buildSpeechletResponse("Welcome to Calorie Counter. My name is Cal and I'll be your personal health assistant. Ask me how many calories an apple has or what your daily caloric intake is so far. How may I help you?", false)
          )
        )
        break;

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to an Alexa Skill, this is running on a deployed lambda function", false),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "AddCalories":
            var foodSlot = event.request.intent.slots.consumedFood;
            var foodName;

            if (foodSlot && foodSlot.value) {
              foodName = foodSlot.value.toLowerCase();
            }

            numcalories = foodToCalories(foodName);
            totalCalories = totalCalories + numcalories;

            context.succeed(
                generateResponse(
                  buildSpeechletResponse(`You consumed ${numcalories} from ${foodName}. Your calorie count for the day is now ${totalCalories}`, false),
                  {}
                )
              )
              break;

          case "CountCalories":
            var foodSlot = event.request.intent.slots.Food;
            var foodName;

            if (foodSlot && foodSlot.value) {
              foodName = foodSlot.value.toLowerCase();
            }

            numcalories = foodToCalories(foodName);

            context.succeed(
                generateResponse(
                  buildSpeechletResponse(`There are ${numcalories} calories in ${foodName}. Your calorie count for the day is ${totalCalories}`, false),
                  {}
                )
              )

              break;

          case "GetVideoViewCountSinceDate":
            console.log(event.request.intent.slots.SinceDate.value)
            var endpoint = "" // ENDPOINT GOES HERE
            var body = ""
            break;

          default:
            throw "Invalid intent"
        }
          break;

      case "SessionEndRequest":
        // Session Ended Request
        console.log('SESSION ENDED REQUEST')
        break;

      default:
        context.fail('INVALID REQUEST TYPE ${event.request.type}')

      }
  } catch(error) {context.fail('Exception: ${error}')}

}

function foodToCalories(foodName) {
  var numcalories = cList[foodName];
  return numcalories;
}

// function addCalories(calories) {
//   totalCalories = totalCalories + calories;
// }


// Helpers
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
