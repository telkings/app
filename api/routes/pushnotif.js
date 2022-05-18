const express = require("express");
const router = express.Router();
const webpush = require("../config/push.js");
const { checkAuth } = require("../middlewares/authentication.js");

import Notifpush from "../models/pushnotif.js";

const pushInterval = 10;
setInterval(function () {

}, pushInterval * 1000);

function sendNotification(subscription, payload) {
    webpush.sendNotification(subscription, payload)
        .then(function () {
            //console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
            //console.log("Notificacion Push Enviada a =>" + JSON.stringify(subscription))
            console.log("Notificacion Push Se envio al Cliente")
        }).catch(async function () {
            console.log('ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
            await Notifpush.deleteOne({ subscription: JSON.stringify(subscription) });
        });
}


/////////////////////////////////////////7

let pushSubscripton;

router.post("/subscription", checkAuth, async (req, res) => {
    const userId = req.userData._id;
    pushSubscripton = req.body;

    const client = await Notifpush.findOne({ userId: userId });

    if (client == null) {

        const userId = req.userData._id;
        const email = req.userData.email;
        const subscription = JSON.stringify(pushSubscripton);

        const newpushnotif = {
            userId: userId,
            email: email,
            subscription: subscription
        };

        console.log("Agregando nuevo cliente...");

        await Notifpush.create(newpushnotif);

        console.log("Nuevo cliente agregado para notificaciones push");
        console.log('Subscription registered ' + pushSubscripton.endpoint);
    }
    else {
        console.log("Actualizando suscripción del cliente...");
        await Notifpush.updateOne({ userId: userId }, { subscription: JSON.stringify(pushSubscripton) });
        console.log("Suscripción actualizada");
        console.log('Subscription registered ' + pushSubscripton.endpoint);
    }

    // Server's Response
    res.status(201).json();
});

router.post("/unsubscription", checkAuth, async (req, res) => {
    const userId = req.userData._id;
    pushSubscripton = req.body;

    await Notifpush.deleteOne({ userId: userId });

    console.log('Subscription unregistered ' + pushSubscripton.endpoint);

    // Server's Response
    res.status(201).json();
});

router.get("/key", checkAuth, async (req, res) => {

    res.json(process.env.PUBLIC_VAPID_KEY);
});

router.post("/new-message", checkAuth, async (req, res) => {

    const title = req.body.title;
    const message = req.body.message;
    const subscription = JSON.parse(req.body.subscription);

    const payload = JSON.stringify({
        title: title,
        message: message
    });

    if (req.body.subscription == "0") {

        const clients = await Notifpush.find();
        let suscriptionclient;

        for (let i = 0; i < clients.length; i++) {
            suscriptionclient = JSON.parse(clients[i].subscription);
            sendNotification(suscriptionclient, payload);
        }

    }
    else {
        sendNotification(subscription, payload);
    }


    res.status(201).json();

});

module.exports = router;