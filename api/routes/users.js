const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { checkAuth } = require("../middlewares/authentication.js");
const axios = require("axios");

//models import
import User from "../models/user.js";
import EmqxAuthRule from "../models/emqx_auth.js";

import SaverRule from "../models/emqx_saver_rule.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import Device from "../models/device.js";
import Template from '../models/template.js';
import Notifpush from "../models/pushnotif.js";

//POST -> req.body
//GET -> req.query

//******************
//**** A P I *******
//******************

const auth = {
  auth: {
    username: "admin",
    password: process.env.EMQX_DEFAULT_APPLICATION_SECRET
  }
};

// get suscriptions

router.get("/suscriptions", checkAuth, async (req, res) => {
  try {

    const subscriptions = await Notifpush.find();

    const response = {
      status: "success",
      subscriptions: subscriptions
    };

    return res.json(response);


  } catch (error) {
    console.log(error);
  }
});

// delete clients

router.delete("/listclients", checkAuth, async (req, res) => {
  try {

    const clientId = req.query.id;

    //deleting saver rule.
    await deleteSaverRule(clientId);

    //deleting all posible alarm rules
    await deleteAllAlarmRules(clientId);

    //deleting all posible mqtt device credentials
    await deleteMqttDeviceCredentials(clientId);

    //deleting device
    const result = await Device.deleteMany({ userId: clientId });

    //deleting template
    const deleteTemplate = await Template.find({ userId: clientId });

    if (deleteTemplate != '') {
      await Template.deleteMany({ userId: clientId });
    }

    //deleting client
    await User.deleteOne({ _id: clientId });

    const response = {
      status: "success",
    };

    return res.json(response);
  } catch (error) {
    console.log("ERROR ELIMINANDO CLIENTE");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

router.put("/listclients", checkAuth, async (req, res) => {
  try {

    let client;
    const clientId = req.body.client.id;
    const clientstatus = req.body.client.status;
    const type = req.body.client.type;
    const action = req.body.client.action;

    if (action == 'status') {

      if (clientstatus == 'Habilitado') {
        client = await User.updateOne({ _id: clientId }, { status: false });
        client = "";
      }
      else {
        client = await User.updateOne({ _id: clientId }, { status: true });
        client = "";
      }

    };

    if (action == 'type') {

      if (type == 'Cliente basic') {
        client = await User.updateOne({ _id: clientId }, { type: '1' });
        client = 'Cliente pro';
      };

      if (type == 'Cliente pro') {
        client = await User.updateOne({ _id: clientId }, { type: '0' });
        client = 'Cliente basic';

        //deleting saver rule.
        await deleteSaverRule(clientId);

        //deleting all posible alarm rules
        await deleteAllAlarmRules(clientId);
      };

    };

    const response = {
      status: "success",
      client: client
    };

    return res.json(response);
  } catch (error) {
    console.log("ERROR AL ACTUALIZAR EL ESTADO DEL CLIENTE");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

// getclients

router.get("/listclients", checkAuth, async (req, res) => {
  try {

    var clients = await User.find();

    const clientId = req.userData._id;
    const client = await User.findOne({ _id: clientId });

    const response = {
      status: "success",
      client: clients,
      clientStatus: client.status,
      type: client.type
    };

    return res.json(response);


  } catch (error) {
    console.log(error);
  }
});

// update password

router.put("/updatepassword", checkAuth, async (req, res) => {
  try {

    if (req.body.ad == false) {

      const userId = req.userData._id;
      let user = req.body.user; // password --> user.password

      const password = user.password; // contraseña sin encriptar
      const new_password = user.new_password;

      user = await User.findOne({ _id: userId }); // consulta a la base de datos y si encuentra algo, trae la consulta entera. Es decir, el objeto completo relacionado al usuario

      if (!user) {
        const response = {
          status: "error",
          error: "Invalid Credentials"
        };
        return res.status(401).json(response);
      }

      if (bcrypt.compareSync(password, user.password)) {

        const encryptedPassword = bcrypt.hashSync(new_password, 10);

        user = await User.updateOne({ _id: userId }, { password: encryptedPassword });

        const response = {
          status: "success",
        };

        return res.json(response);
      } else {
        const response = {
          status: "error",
          error: "Invalid Credentials"
        };
        return res.status(401).json(response);
      }

    };

    if (req.body.ad == true) {

      const encryptedPassword = bcrypt.hashSync('123', 10);

      await User.updateOne({ _id: req.body.user }, { password: encryptedPassword });

      const response = {
        status: "success",
      };

      return res.json(response);
    }

  } catch (error) {
    console.log(error);
  }
});

//unlock account

router.put("/unlock", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    let user = req.body.user; // password --> user.password
    let lock = req.body.lock;

    const password = user.password; // contraseña sin encriptar

    user = await User.findOne({ _id: userId }); // consulta a la base de datos y si encuentra algo, trae la consulta entera. Es decir, el objeto completo relacionado al usuario

    if (!user) {
      const response = {
        status: "error",
        error: "Invalid Credentials"
      };
      return res.status(401).json(response);
    }

    //if email and email ok
    if (bcrypt.compareSync(password, user.password)) {

      user = await User.updateOne({ _id: userId }, { lock: lock });

      user = req.userData;
      user.lock = lock;

      const response = {
        status: "success",
        userData: user
      };

      return res.json(response);
    } else {
      const response = {
        status: "error",
        error: "Invalid Credentials"
      };
      return res.status(401).json(response);
    }

  } catch (error) {
    console.log(error);
  }
});

router.put("/lock", checkAuth, async (req, res) => {
  try {

    const userId = req.userData._id;
    let lock = req.body.lock;
    const token = req.headers.token;

    let user = await User.findOne({ _id: userId }); // consulta a la base de datos y si encuentra algo, trae la consulta entera. Es decir, el objeto completo relacionado al usuario

    if (!user) {
      const response = {
        status: "error",
        error: "Invalid Credentials"
      };
      return res.status(401).json(response);
    }

    user = await User.updateOne({ _id: userId }, { lock: lock });

    user = req.userData;
    user.lock = lock;

    const response = {
      status: "success",
      token: token,
      userData: user
    };

    return res.json(response);

  } catch (error) {
    console.log(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password; // --> contraseña sin encriptar

    var user = await User.findOne({ email: email }); // consulta a la base de datos

    //if no email
    if (!user) {
      const response = {
        status: "error",
        error: "Invalid Credentials"
      };
      return res.status(401).json(response);
    }


    // compareSync(contraseña del formulario sin encriptar , clave encriptada en la base de datos)

    if (bcrypt.compareSync(password, user.password)) {
      user.set("password", undefined, { strict: false }); // se utiliza para no guardar la contraseña dentro del token
      //user.set("email", undefined, { strict: false }); // se utiliza para no guardar el email dentro del token

      // Se crea un objeto "userData" con los datos del usuario 
      const token = jwt.sign({ userData: user }, "securePasswordHere", {
        expiresIn: 60 * 60 * 24 * 30
      });
      // se validaron las credenciales del usuario en la base de datos y se le da un token
      const response = {
        status: "success",
        token: token,
        userData: user // datos del usuario sin encriptar para utilizar en el front
      };

      return res.json(response);
    } else {
      const response = {
        status: "error",
        error: "Invalid Credentials"
      };
      return res.status(401).json(response);
    }
  } catch (error) {
    console.log(error);
  }
});

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const type = req.body.type;
    const status = req.body.status;
    const registered = req.body.registered;
    const lock = req.body.lock;

    const newUser = {
      name: name,
      email: email,
      password: encryptedPassword,
      type: type,
      status: status,
      registered: registered,
      lock: lock
    };

    var user = await User.create(newUser);


    const response = {
      status: "success"
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("ERROR - REGISTER ENDPOINT");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    console.log(response);

    return res.status(500).json(response);
  }
});

//GET MQTT WEB CREDENTIALS
router.post("/getmqttcredentials", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    const credentials = await getWebUserMqttCredentials(userId);

    const response = {
      status: "success",
      username: credentials.username,
      password: credentials.password
    };

    res.json(response);

    setTimeout(() => {
      getWebUserMqttCredentials(userId);
    }, 5000);

    return;
  } catch (error) {
    console.log(error);

    const response = {
      status: "error"
    };

    return res.status(500).json(response);
  }
});

//GET MQTT CREDENTIALS FOR RECONNECTION
router.post(
  "/getmqttcredentialsforreconnection",
  checkAuth,
  async (req, res) => {
    try {
      const userId = req.userData._id;
      const credentials = await getWebUserMqttCredentialsForReconnection(
        userId
      );

      const response = {
        status: "success",
        username: credentials.username,
        password: credentials.password
      };

      console.log(response);
      res.json(response);

      setTimeout(() => {
        getWebUserMqttCredentials(userId);
      }, 15000);
    } catch (error) {
      console.log(error);
    }
  }
);



//**********************
//**** FUNCTIONS *******
//**********************

//delete saver rule
async function deleteSaverRule(Id) {
  try {
    const mongoRule = await SaverRule.find({ userId: Id });

    if (mongoRule != '') {
      for (let i = 0; i < mongoRule.length; i++) {
        const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules/" + mongoRule[i].emqxRuleId;
        const emqxRule = await axios.delete(url, auth);
        const deleted = await SaverRule.deleteOne({ dId: mongoRule[i].dId });
      }
    }

    return true;

  } catch (error) {
    console.log("Error deleting saver rule");
    console.log(error);
    return false;
  }
}

//delete ALL alarm Rules...
async function deleteAllAlarmRules(Id) {
  try {

    const rules = await AlarmRule.find({ userId: Id });

    if (rules.length > 0) {

      for (let i = 0; i < rules.length; i++) {
        const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules/" + rules[i].emqxRuleId;
        const res = await axios.delete(url, auth);
      }

      await AlarmRule.deleteMany({ userId: Id });
    }

    return true;

  } catch (error) {
    console.log(error);
    return "error";
  }
}

//delete ALL emqx device  auth rules
async function deleteMqttDeviceCredentials(Id) {
  try {

    const emqxauthrules = await EmqxAuthRule.find({ userId: Id });

    if (emqxauthrules.length > 0) {
      await EmqxAuthRule.deleteMany({ userId: Id, type: "device" });
      await EmqxAuthRule.deleteMany({ userId: Id, type: "user" });
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

global.check_admin_user = async function checkAdminUser() {

  try {

    const admin_users = await User.find({ type: '2' });

    //if no email
    if (admin_users.length > 0) {
      return console.log("Usuario administrador ya ha sido creado");
    }
    else {

      const password = "123";
      const encryptedPassword = bcrypt.hashSync(password, 10);

      const newUser = {
        name: "administrador",
        email: "admin@gmail.com",
        password: encryptedPassword,
        type: "2",
        status: true,
        registered: Date.now(),
        lock: "0"
      };

      var user = await User.create(newUser);

      console.log("Usuario administrador creado");
    }

  } catch (error) {
    console.log("ERROR REGISTER USER ADMIN");
    console.log(error);
  }

}

// mqtt credential types: "user", "device", "superuser"
async function getWebUserMqttCredentials(userId) {
  try {
    var rule = await EmqxAuthRule.find({ type: "user", userId: userId });

    if (rule.length == 0) {
      const newRule = {
        userId: userId,
        username: makeid(10),
        password: makeid(10),
        publish: [userId + "/#"],
        subscribe: [userId + "/#"],
        type: "user",
        time: Date.now(),
        updatedTime: Date.now()
      };

      const result = await EmqxAuthRule.create(newRule);

      const toReturn = {
        username: result.username,
        password: result.password
      };

      return toReturn;
    }

    const newUserName = makeid(10);
    const newPassword = makeid(10);

    const result = await EmqxAuthRule.updateOne(
      { type: "user", userId: userId },
      {
        $set: {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now()
        }
      }
    );

    // update response example
    //{ n: 1, nModified: 1, ok: 1 }

    if (result.n == 1 && result.ok == 1) {
      return {
        username: newUserName,
        password: newPassword
      };
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getWebUserMqttCredentialsForReconnection(userId) {
  try {
    const rule = await EmqxAuthRule.find({ type: "user", userId: userId });

    if (rule.length == 1) {
      const toReturn = {
        username: rule[0].username,
        password: rule[0].password
      };
      return toReturn;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
