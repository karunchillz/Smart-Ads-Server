require('dotenv').config();
const request = require('request');

// Returns if one of the people inside the picture is smiling
function isSmile(base64) {
  return new Promise((resolve, reject) => {

    var buf = new Buffer(base64, 'base64');

    request({
      url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
      method: 'POST',
      json: false,
      body: buf,
      headers: {
        "Content-Type" : 'application/octet-stream',
        "Ocp-Apim-Subscription-Key" : process.env.MICROSOFT_EMOTION_KEY
      }

    }, (error, response, body) => {
      // console.log(JSON.stringify(JSON.parse(response.body), null, 2));

      if (JSON.parse(body).error) {
        reject('invalid base64!');
      } else {

        const faces = JSON.parse(response.body);
        let highestHappiness = faces.reduce((acc, cur) => {
          let currentHappiness = cur.scores.happiness;
          acc = Math.max(acc, currentHappiness);
          return acc;
        }, 0);

        let result = false;
        if (highestHappiness >= 0.7) {
          result = true;
        }

        resolve(result);  
      }

    });
  });
}

function getEmotion(base64) {
  return new Promise((resolve, reject) => {

    var buf = new Buffer(base64, 'base64');

    request({
      url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
      method: 'POST',
      json: false,
      body: buf,
      headers: {
        "Content-Type" : 'application/octet-stream',
        "Ocp-Apim-Subscription-Key" : process.env.MICROSOFT_EMOTION_KEY
      }

    }, (error, response, body) => {
      // console.log(JSON.stringify(JSON.parse(response.body), null, 2));

      if (JSON.parse(body).error) {
        reject('invalid base64!');
      } else {

        let accumulator = JSON.parse(response.body)
        .map((faces) => (faces.scores))
        .reduce((acc, cur) => {
          // console.log(acc);
          if(!acc.anger) return cur;
          else {
            acc.anger += cur.anger;
            acc.contempt += cur.contempt;
            acc.disgust += cur.disgust;
            acc.fear += cur.fear;
            acc.happiness += cur.happiness;
            acc.neutral += cur.neutral;
            acc.sadness += cur.sadness;
            acc.surprise += cur.surprise;
            return acc;
          }
        }, {});
        let result = Object.keys(accumulator)
        .map(function(key) {
          // console.log({emotion: key, value:accumulator[key]});
          return ({emotion: key, value:accumulator[key]});
        })
        .reduce(function(acc, cur) {
          if (!acc.value) return cur;
          else {
            if (cur.value > acc.value) {
              return cur;
            }
            return acc;
          }
        }, {});


        // console.log(highestHappiness);
        // let result = false;
        // if (highestHappiness >= 0.7) {
        //   result = true;
        // }
        // console.log(result);
        resolve(result);  
      }

    });
  });
}

exports.isSmile = isSmile
exports.getEmotion = getEmotion