const express = require("express");
const router = express.Router();
const axios = require("axios");
const { checkAuth } = require("../middlewares/authentication.js");
const colors = require("colors");

//models import
import Data from '../models/data.js';


//******************
//**** A P I *******
//****************** 

//CONSULTAR VALORES ENTRE FECHAS

router.get('/get-query-history', checkAuth, async (req, res) => {

  try {

    const userId = req.userData._id;
    const chartTimeFrom = req.query.chartTimeFrom;
    const chartTimeTo = req.query.chartTimeTo;
    const dId = req.query.dId;
    const variable = req.query.variable;

    const unixFrom = (new Date(chartTimeFrom).getTime()).toFixed(0);
    const unixTo = (new Date(chartTimeTo).getTime()).toFixed(0);
    console.log(unixFrom);

    const data = await Data.find({ userId: userId, dId: dId, variable: variable, "time": { $gte: unixFrom, $lte: unixTo } }).sort({ "time": 1 });


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

//**********************
//**** FUNCTIONS *******
//********************** 

//CREATE ALARM
async function createAlarmRule(newAlarm) {
  try {
    const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules";

    // topicExample = userid/did/temp  //msgExample = {value: 20}
    const topic =
      newAlarm.userId + "/" + newAlarm.dId + "/" + newAlarm.variable + "/sdata";

    const rawsql =
      'SELECT username, topic, payload FROM "' +
      topic +
      '" WHERE payload.value ' +
      newAlarm.condition +
      " " +
      newAlarm.value +
      " AND is_not_null(payload.value)";

    var newRule = {
      rawsql: rawsql,
      actions: [
        {
          name: "data_to_webserver",
          params: {
            $resource: global.alarmResource.id,
            payload_tmpl:
              '{"userId":"' +
              newAlarm.userId +
              '","payload":${payload},"topic":"${topic}"}'
          }
        }
      ],
      description: "ALARM-RULE",
      enabled: newAlarm.status
    };

    //save rule in emqx - grabamos la regla en emqx
    const res = await axios.post(url, newRule, auth);
    var emqxRuleId = res.data.data.id;



    if (res.data.data && res.status === 200) {
      //save rule in mongo -- grabamos regla en mongo
      const mongoRule = await AlarmRule.create({
        userId: newAlarm.userId,
        dId: newAlarm.dId,
        emqxRuleId: emqxRuleId,
        status: newAlarm.status,
        variable: newAlarm.variable,
        variableFullName: newAlarm.variableFullName,
        value: newAlarm.value,
        condition: newAlarm.condition,
        triggerTime: newAlarm.triggerTime,
        createTime: Date.now()
      });

      const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules/" + mongoRule.emqxRuleId;

      const payload_templ =
        '{"userId":"' +
        newAlarm.userId +
        '","dId":"' +
        newAlarm.dId +
        '","deviceName":"' +
        newAlarm.deviceName +
        '","payload":${payload},"topic":"${topic}","emqxRuleId":"' +
        mongoRule.emqxRuleId +
        '","value":' +
        newAlarm.value +
        ',"condition":"' +
        newAlarm.condition +
        '","variable":"' +
        newAlarm.variable +
        '","variableFullName":"' +
        newAlarm.variableFullName +
        '","triggerTime":' +
        newAlarm.triggerTime +
        "}";

      newRule.actions[0].params.payload_tmpl = payload_templ;

      const res = await axios.put(url, newRule, auth);

      console.log("New Alarm Rule Created...".green);

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

//UPDATE ALARM STATUS
async function updateAlarmRuleStatus(emqxRuleId, status) {
  try {
    const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules/" + emqxRuleId;

    const newRule = {
      enabled: status
    };

    const res = await axios.put(url, newRule, auth);

    if (res.data.data && res.status === 200) {
      await AlarmRule.updateOne({ emqxRuleId: emqxRuleId }, { status: status });

      console.log("Saver Rule Status Updated...".green);

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

//DELETE ONLY ONE RULE
async function deleteAlarmRule(emqxRuleId) {
  try {
    const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/rules/" + emqxRuleId;

    const emqxRule = await axios.delete(url, auth);

    const deleted = await AlarmRule.deleteOne({ emqxRuleId: emqxRuleId });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = router;
