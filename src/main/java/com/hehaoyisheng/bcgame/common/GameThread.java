package com.hehaoyisheng.bcgame.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.hehaoyisheng.bcgame.utils.HttpClientUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

public class GameThread {
    private static DateFormat format1 = new SimpleDateFormat("yyyyMMdd");
    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public void initData(String type) {
        if(type.contains("k3")){
            String result = HttpClientUtil.sendHttpGet("http://caipiao.163.com/order/preBet_periodInfoTime.html?gameEn=oldkuai3");
            JSONObject jsonObject = JSONObject.parseObject(result);
            Long time = jsonObject.getLong("secondsLeft");
            String qiHao = jsonObject.getString("currentPeriod");
            GameData.gameSeasonId.put(type, qiHao);
            GameData.gameTime.put(type, System.currentTimeMillis() + time);
            return;
        }
        if(type.equals("txssc")){
            String result = HttpClientUtil.sendHttpGet("http://47.52.78.51:8080/bcgame/lotts/beiyong");
            Document document = Jsoup.parse(result);
            String s = document.getElementById("end_qishu").text();
            GameData.gameSeasonId.put(type, format1.format(new Date()) + s);
            GameData.gameTime.put(type, System.currentTimeMillis() + 6000L);
            return;
        }
        String qiHao = null;

        if(type.contains("pk10")){
            String result = HttpClientUtil.sendHttpGet("https://www.369kj.com/pks/getPksDoubleCount.do?date=&lotCode=10001");
            System.out.println(result);
            JSONObject jsonObject = JSON.parseObject(result);
            JSONObject data = jsonObject.getJSONObject("result").getJSONObject("data");
            qiHao = data.getLong("drawIssue") + "";
            String time = data.getString("drawTime");
            Date date = new Date();
            try {
                date = simpleDateFormat.parse(time);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            GameData.gameSeasonId.put(type, qiHao);
            GameData.gameTime.put(type, date.getTime());
        }
        if(type.equals("cqssc")){
            String result = HttpClientUtil.sendHttpGet("http://caipiao.163.com/order/preBet_periodInfoTime.html?gameEn=ssc&cache=" + System.currentTimeMillis());
            JSONObject jsonObject = JSON.parseObject(result);
            GameData.gameSeasonId.put(type, "20" + jsonObject.getString("currentPeriod"));
            GameData.gameTime.put(type, System.currentTimeMillis() + jsonObject.getLong("groupBuySecondsLeft"));
        }
        if(type.equals("gd11x5")){
            String result = HttpClientUtil.sendHttpGet("http://caipiao.163.com/order/preBet_periodInfoTime.html?gameEn=gdd11&cache=" + System.currentTimeMillis());
            JSONObject jsonObject = JSON.parseObject(result);
            GameData.gameSeasonId.put(type, "20" + jsonObject.getString("currentPeriod"));
            GameData.gameTime.put(type, System.currentTimeMillis() + jsonObject.getLong("groupBuySecondsLeft"));
        }
        /*
        Map<String, String> map = Maps.newHashMap();
        map.put("nourl", "1");
        map.put("lotid", type.endsWith("11x5") ? type.replace("11x5", "115") : type);
        map.put("uid", "");
        String result = HttpClientUtil.sendHttpPost("http://917500.cn/Home/Article/timelimit.html", map);
        JSONObject jsonObject = JSONObject.parseObject(result);
        String qiHao = jsonObject.getString("issue");
        System.out.println(result);
        Long time = jsonObject.getLong("lefttime");
        */

    }
}
