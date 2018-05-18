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

import java.util.Map;

public class GameThread {

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
            String result = HttpClientUtil.sendHttpGet("https://www.369kj.com/txffc/kj/txffc.php");
            JSONObject json = JSON.parseObject(result);
            JSONArray jsonArray = json.getJSONArray("list");
            for(int k = 0; k < jsonArray.size(); k++){
                String qihao = (Long.valueOf(jsonArray.getJSONObject(0).getString("period")) + 1) + "";
                GameData.gameSeasonId.put(type, qihao);
                GameData.gameTime.put(type, System.currentTimeMillis() + 6000L);
                return;
            }
            return;
        }
        Map<String, String> map = Maps.newHashMap();
        map.put("nourl", "1");
        map.put("lotid", type.endsWith("11x5") ? type.replace("11x5", "115") : type);
        map.put("uid", "");
        String result = HttpClientUtil.sendHttpPost("http://917500.cn/Home/Article/timelimit.html", map);
        JSONObject jsonObject = JSONObject.parseObject(result);
        String qiHao = jsonObject.getString("issue");
        System.out.println(result);
        Long time = jsonObject.getLong("lefttime");
        GameData.gameSeasonId.put(type, qiHao);
        GameData.gameTime.put(type, System.currentTimeMillis() + (time * 1000));
    }
}
