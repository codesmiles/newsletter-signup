// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(express.static(`public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
  // res.send('Hello World!');
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  //   console.log(firstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: `subscribed`,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
 
  const url = `https://us14.api.mailchimp.com/3.0/lists/db70272f05`;

  const options = {
    method: `POST`,
    auth: `smiles:e5f1bb4518593dde8a2bcb3cd820343a-us14`
  };

  const request = https.request(url, options, (response) => {
   
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
        // console.log(`Success`);
      // res.send("Successfully subscribed");
    } else {
        res.sendFile(__dirname + "failure.html");
        // console.log(`Error`);
      // res.send("Failed to subscribe");
    }
   
    response.on(`data`, (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  res.end();
});

app.post(`/failure`, (req, res) => {
  res.redirect(`/`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is listening at port 3000`);
});

// API KEY
// e5f1bb4518593dde8a2bcb3cd820343a-us14

// LIST ID/AUDIENCE ID
// db70272f05
