const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authentication.js');

//models import
import Data from '../models/data.js';
import Template from '../models/template.js';
import Device from "../models/device.js";

// historial

router.get('/datadevices', checkAuth, async (req, res) => {

  try {

    const userId = req.userData._id;
    const data = await Data.find({ userId: userId });
    const datatemplate = await Template.find({ userId: userId });
    const datadevice = await Device.find({ userId: userId });

    if (data.length != '0') {

      for (var i = 0; i < data.length; i++) {

        let device = data[i].dId;

        for (let q = 0; q < datadevice.length; q++) {

          if (device == datadevice[q].dId) {
            data[i].dId = datadevice[q].name;
            data[i].userId = datadevice[q].templateName;
          };

        };

        let variable = data[i].variable;

        for (let j = 0; j < datatemplate.length; j++) {

          if (datatemplate[j].widgets.length == 1) {

            if (variable == datatemplate[j].widgets[0].variable) {
              variable = datatemplate[j].widgets[0].variableFullName;
              data[i].variable = variable;
            }

          }

          else {

            for (let n = 0; n < datatemplate[j].widgets.length; n++) {

              if (variable == datatemplate[j].widgets[n].variable) {
                variable = datatemplate[j].widgets[n].variableFullName;
                data[i].variable = variable;
              }

            };

          }

        };

      };
    };


    const response = {
      status: "success",
      data: data
    }

    return res.json(response)

  } catch (error) {

    console.log(error)

    const response = {
      status: "error",
      error: error
    }

    return res.json(response);

  }

});



router.get('/get-small-charts-data', checkAuth, async (req, res) => {

  try {

    const userId = req.userData._id;
    const chartTimeAgo = req.query.chartTimeAgo;
    const dId = req.query.dId;
    const variable = req.query.variable;

    const timeAgoMs = Date.now() - (chartTimeAgo * 60 * 1000);


    const data = await Data.find({ userId: userId, dId: dId, variable: variable, "time": { $gt: timeAgoMs } }).sort({ "time": 1 });


    const response = {
      status: "success",
      data: data
    }

    return res.json(response)

  } catch (error) {

    console.log(error)

    const response = {
      status: "error",
      error: error
    }

    return res.json(response);

  }

});

router.get("/tracking", checkAuth, async (req, res) => {
  try {

    const userId = req.userData._id;
    const did = req.query.dId;
    const positionsdata = await Data.find({ userId: userId, dId: did });
    const dataultimate = await Data.find({ userId: userId, dId: did }).sort({ $natural: -1 }).limit(1);

    const response = {
      status: "success",
      locations: positionsdata,
      ultimate: dataultimate
    };

    return res.json(response);


  } catch (error) {
    console.log(error);
  }
});

module.exports = router