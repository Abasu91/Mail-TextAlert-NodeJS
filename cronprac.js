var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 30 13 * * 0-7',
  onTick: function() {
    /*
     * Runs every day (Monday through Sunday)
     * at specified time
     * 
     */
    var moment = require('moment');
    console.log("Starting timer");
    function startTime(){
      var time = moment()._d.toString().substring(16, moment()._d.toString().indexOf('G'))
      console.log(time);
      setTimeout(startTime,1000)
    }

    //startTime();
    var nodemailer = require("nodemailer");

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
			//Enter your gmail id and pass
            user: "******@gmail.com",
            pass: "**********"
        }
    });
     //smtpTransport.options.secureConnection = false; 
    console.log(smtpTransport);

    // setup e-mail data with unicode symbols
    var email_config = {
        from: "******@ku.edu", // sender address
        to:"*******@gmail.com", // list of receivers
        subject: "Hello ", // Subject line
        text: "Hello", // plaintext body
        html: "<b>Hello world </b>" // html body
    }


    var timeFromStartOfHour = moment().startOf('min').fromNow();
    console.log(timeFromStartOfHour);
    email_config.html = "<b>The console started working </b> " + timeFromStartOfHour + "<br><b>You have an appointment with ISS for insurance, also talk to ISS about reduced course load form";

    //send mail with defined transport object
    smtpTransport.sendMail(email_config, function(error, response){
      console.log('Sending');
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

// Load the twilio module to send message
    var twilio = require('twilio');
     
    // Create a new REST API client to make authenticated requests against the
    // twilio back end
    var client = new twilio.RestClient('ACf5d1252696cdf6f45abd3e701691c05d',
    '6446be324496d4fa0c29e1f29cb4406b');
     
    // Pass in parameters to the REST API using an object literal notation. The
    // REST client will handle authentication and response serialzation for you.
    client.sms.messages.create({
        to:'someones number',
        from:'your number',
        body:'You have an appointment with ISS for insurance, also talk to ISS about reduced course load form'
    }, function(error, message) {
        // The HTTP request to Twilio will run asynchronously. This callback
        // function will be called when a response is received from Twilio
        // The "error" variable will contain error information, if any.
        // If the request was successful, this value will be "falsy"
        if (!error) {
            // The second argument to the callback will contain the information
            // sent back by Twilio for the request. In this case, it is the
            // information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
        }
    });

  },
  start: true,
  //timeZone: 'America/Kansas'
});
job.start();