const express = require("express");
const mongoose = require("mongoose");
const Users = require("./models/user");
const Secret = require("./models/secret");
const Notice = require("./models/notice");
const Content = require("./models/content");
const Forum = require("./models/forum");
const Bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');

const cors = require("cors");
const { db } = require("./models/user");

require("dotenv").config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cors())

// Enabling CORS for localhost 3000: CHANGE THIS DURING DEPLOYMENT!!!!.
let corsOptions = {
  origin: ['http://localhost:3000'],
  
}

app.use(cors(corsOptions))


const port = 5000;

//Fix this  ---->   const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect("mongodb+srv://amanda:Imissyoudaddy1@cluster0.htglcoa.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once("open", () => console.log("mongodb is connected"));

app.get("/api/", (req,res)=>{
  res.send("Connected!")
})
//-------------------------------------------------Secret----------------------------------

//Add more secrets -- only posible through Postman or other related apps

app.post("/secret", async (req, res) => {
  try {
    const newSecret = new Secret({
      secret: req.body.secret
    });

    await Secret.create(newSecret);

    res.send("Secret added");
  } catch (err) {
    console.log(err);
  }

})

//Retrun secrets(there might be a beg causing you to need to always readd the secret)

app.get("/secret", (req, res) => {
  Secret.find((err, result) => {
    res.send(result);
  })
})

//---------------------------------------Users----------------------------------------
//Add more admins
app.post("/user", (req, res) => {
  // console.log(req.body);
  try {

    Users.find({ "email": req.body.email }, (err, result) => {
      const existingAccount = result;
      //console.log(existingAccount.length)
      if (existingAccount.length > 0) {
        res.status(500).send("Account already exists");
      } else {

        const newUser = new Users({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          role: req.body.role,
          email: req.body.email,
          password: Bcrypt.hashSync(req.body.password, 10),
          confirmPassword: Bcrypt.hashSync(req.body.confirmPassword, 10),
          date: req.body.date,
          avatar: "../resources/wormy1.png"

        })

        Users.create(newUser);

        res.status(200).send("User added")
      }
    })



  } catch (err) {
    console.log("Error: ", err);
  }
})


//Return all users
app.get("/user", (req, res) => {
  Users.find((err, result) => {
    res.send(result);
  })
})


app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  Users.find({ "email": email }, (err, result) => {
    res.send(result);
  })
})

//Find user by email used in login component
app.post("/user/:email", (req, res) => {
  const email = req.params.email;
  Users.find({ "email": email }, (err, result) => {
    if (result.length > 0) {
      try {
        if (Bcrypt.compareSync(req.body.password, result[0].password)) {
          res.status(200).send("Match made");
          //res.send(result);
        } else {
          console.log("password does not match password in database")
          res.status(500).send("Incorrect password");
        }
      } catch (err) {
        console.log("Error: ", err)
      }
    } else {
      //Throw an error if the email is not found in the database
      res.status(500).send("Account does not exist");
    }
  })
})

//Updating a user
app.put("/user/:email", (req, res) => {
  const email = req.params.email;
  const newvalue = { $set: { role: "Volunteer" } };
  Users.findOneAndUpdate({ "email": email }, newvalue, (err, result) => {
    if (err) {
      res.status(500).send("Error");
    };
    res.status(200).send("Updated");
    // console.log("Updated")
  })
})
//Delete a user
app.delete("/user/:email", (req, res) => {
  const email = req.params.email;
  Users.deleteOne({ "email": email }, function (err, result) {
    if (err) {
      res.status(500).send("Error");
    };
    //console.log("User deleted");
    res.status(200).send("User deleted")
  })

})

//------------------------------------Notices--------------------------
app.post("/notice", async (req, res) => {
  try {
    const newNotice = new Notice({
      subject: req.body.subject,
      message: req.body.message,
      date: req.body.date
    });

    await Notice.create(newNotice);

    res.send("Notice added");
  } catch (err) {
    console.log(err);
  }

})

//return all notices
app.get("/notice", (req, res) => {
  Notice.find((err, result) => {
    res.send(result);
  })
})

//Delete a notice
app.delete("/notice/:id", (req, res) => {
  const id = req.params.id;
  Notice.deleteOne({ "_id": id }, function (err, result) {
    if (err) {
      res.status(500).send("Error");
    };
    //console.log("User deleted");
    res.status(200).send("Notice deleted")
  })

})
//----------------------------------------Content-----------------------
//Add a titlle to the model and update by title!!!!!!!!!
app.put("/content/:title", (req, res) => {
  const contentTitle = req.params.title;
  const newvalue = { $set: { html: req.body.html, date: req.body.date } };
  Content.findOneAndUpdate({ "title": contentTitle }, newvalue, { upsert: true }, (err, result) => {
    if (err) {
      res.status(500).send("Error");
    };
    res.status(200).send("Content Updated");
  })
})

app.post("/content", async (req, res) => {
  try {
    const newContent = new Content({
      title: req.body.title,
      html: req.body.html,
      date: req.body.date
    });

    await Content.create(newContent);

    res.send("New Content Added");
  } catch (err) {
    console.log(err);
  }

})

app.get("/content", (req, res) => {
  Content.find((err, result) => {
    res.send(result);
  })
})
//-------------------------------------------------Email notifications--------------------------
//This works with yahoo!
app.post("/request_success", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'nwadukweamanda@yahoo.com',
      pass: 'lvyjnlumduwviafy'
    }
  });

  var mailOptions = {
    from: 'nwadukweamanda@yahoo.com',
    to: req.body.email,
    subject: 'Registration Request Success',
    text: 'The secret is: Amanda2'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Email sent")
})

app.post("/request_accepted", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'nwadukweamanda@yahoo.com',
      pass: 'lvyjnlumduwviafy'
    }
  });

  var mailOptions = {
    from: 'nwadukweamanda@yahoo.com',
    to: req.body.email,
    subject: 'Registration Request Accepted',
    text: 'Your registration request has been accepted'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Email sent")
})

app.post("/request_denied", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'nwadukweamanda@yahoo.com',
      pass: 'lvyjnlumduwviafy'
    }
  });

  var mailOptions = {
    from: 'nwadukweamanda@yahoo.com',
    to: req.body.email,
    subject: 'Registration Request Denied',
    text: 'Your registration request has been denied.'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Email sent")
})

app.post("/message", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'nwadukweamanda@yahoo.com',
      pass: 'lvyjnlumduwviafy'
    }
  });

  var mailOptions = {
    from: 'nwadukweamanda@yahoo.com',
    to: req.body.email,
    subject: 'Message Waiting',
    text: 'You have a new message on RAIZ'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Email sent")
})

//Sending messages within the intranet
app.put("/message", (req, res) => {
  const newvalue = { $push: { messages: req.body.messageObject } };
  
  Users.updateMany({$or: [{"email": req.body.messageObject.from}, {"email":req.body.messageObject.to}]}, newvalue, {
    "multi": true}, (err, result) => {
      console.log(result)
    if (err) {
      res.status(500).send("Error");
    };
    res.status(200).send("Message sent");
  })

})



app.put("/view_message", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.sendersEmail);

  Users.findOneAndUpdate({
        "email": req.body.email,
        "messages.from": req.body.sendersEmail,
      }, 
    {
      "$set": {
        "messages.$[message].read": true
      }
    },
    {
      "arrayFilters":[{"message.from": req.body.sendersEmail}],
      "multi": true,
      "upsert": false,
      "returnOriginal":false
    },
    (err, result) => {
      console.log(result);
      if(err){res.status(500).send("Error: " + err);};
      res.status(200).send("Updated to " + result);
    }
  )
 });

 app.put("/return",  (req, res) => {
   Users.distinct("messages.$.from", (err, result) => {
     console.log(result)
   })
 })

 //--------------------------------------Profile picture--------------------------
 app.put("/avatar", (req, res) => {
   const newvalue = { $set: { avatar: req.body.route }};
  Users.findOneAndUpdate({ "email": req.body.email }, newvalue, (err, result) => {
    if (err) {
      res.status(500).send("Error");
    };
    res.status(200).send("Avatar updated");
  })
 })
//--------------------------------------Updating Password--------------------------
app.put("/password", (req, res) => {
  const newvalue = { $set: { password: Bcrypt.hashSync(req.body.newPassword, 10), confirmPassword:Bcrypt.hashSync(req.body.newPassword, 10) }};
 Users.findOneAndUpdate({ "email": req.body.email }, newvalue, (err, result) => {
   if (err) {
     res.status(500).send("Error");
   };
   res.status(200).send("Password updated");
 })
})

 //--------------------------------------Forum messages--------------------------
 app.post("/forum", async (req, res) => {
  try {
    const newForumMessage = new Forum({
      sender:req.body.sender,
      sendersEmail: req.body.sendersEmail,
      recipientMessageId: req.body.recipientMessageId,
      date:req.body.date,
      message:req.body.message
    });

    await Forum.create(newForumMessage);

    res.send("Message added to forum");
  } catch (err) {
    console.log(err);
  }

})



app.get("/forum", (req, res) => {
  Forum.find((err, result) => {
    res.send(result);
  })
})

app.delete("/forum/:id", (req, res) => {
  const id = req.params.id;
  Forum.deleteOne({ "_id": id }, function (err, result) {
    if (err) {
      res.status(500).send("Error");
    };
    //console.log("User deleted");
    res.status(200).send("Message deleted from Forum")
  })

})


app.listen(port, () => console.log("server is running on port " + port));
