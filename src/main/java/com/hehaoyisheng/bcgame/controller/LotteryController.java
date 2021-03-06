package com.hehaoyisheng.bcgame.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.hehaoyisheng.bcgame.common.*;
import com.hehaoyisheng.bcgame.entity.*;
import com.hehaoyisheng.bcgame.entity.transfar.OrderTransfar;
import com.hehaoyisheng.bcgame.entity.vo.*;
import com.hehaoyisheng.bcgame.manager.*;
import com.hehaoyisheng.bcgame.utils.CalculationUtils;
import com.hehaoyisheng.bcgame.utils.HttpClientUtil;
import com.mysql.jdbc.StringUtils;
import com.sun.org.apache.xpath.internal.operations.Or;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/lotts")
@SessionAttributes("user")
public class LotteryController {

    @Resource
    private UserManager userManager;

    @Resource
    private BcLotteryOrderManager bcLotteryOrderManager;

    @Resource
    private TraceManager traceManager;

    @Resource
    private MoneyHistoryManager moneyHistoryManager;

    @Resource
    private BcLotteryOddsManager bcLotteryOddsManager;

    @Resource
    private LotteryThread lotteryThread;
    /**
     * 投注
     * @param isTrace       是否追号
     * @param traceWinStop  追号赢了是否停止
     * @param bounsType     赔率类型
     * @param order         订单集合
     * @param amount        总价
     * @param count         总数量
     * @return              返回基类
     */
    @RequestMapping("/{gameType}/bet")
    @ResponseBody
    public Result doBet(@ModelAttribute("user") User user, @PathVariable String gameType, int isTrace, Integer traceWinStop, Integer bounsType, String bouns, Double bounsRange, OrderModel order, double amount, int count, int force, TraceModel traceOrders){
        if(order.getOrder().get(0).getPlayId().contains("single")){
            return Result.faild("暂时不允许单式投注！", 400);
        }
        for(Order o : order.getOrder()){
            if(o.getPlayId().contains("group")){
                return Result.faild("暂时不允许组选投注！", 400);
            }
        }
        User user1 = userManager.select(user, null, null, null, null, null, null).get(0);
        /*
        double bouns1 = 0;
        if(bouns.split("-").length > 1){
            bouns1 = Double.valueOf(bouns.split("-")[1].replace("%", ""));
        }
        if(gameType.contains("ssc") && user1.getFandian() - bouns1 > 14.0){
            return Result.faild("赔率过高，无法下注", 400);
        }
        if(gameType.contains("11x5") && user1.getFandian() - bouns1 > 13.5){
            return Result.faild("赔率过高，无法下注", 400);
        }
        if(gameType.contains("pk10") && user1.getFandian() - bouns1 > 13.5){
            return Result.faild("赔率过高，无法下注", 400);
        }
        */
        if(user1.getTouzhuFlag() != 0){
            return Result.faild("该账号已经禁止投注!", 400);
        }
        System.out.println(" userName is the " + user.getUsername());
        //初始化赔率
        if(CollectionUtils.isEmpty(GameData.oddsMap)){
            List<BcLotteryOdds> bcLotteryOddsList = bcLotteryOddsManager.select(null, null, null);
            for(BcLotteryOdds bcLotteryOdds : bcLotteryOddsList){
                GameData.oddsMap.put(bcLotteryOdds.getPlayType() + ":" + bcLotteryOdds.getBounsType(), bcLotteryOdds.getOdds());
            }
        }
        List<Order> orders = order.getOrder();
        List<TraceOrder> traces = traceOrders.getTraceOrders();
        //获取期号
        String sessionId = GameData.gameSeasonId.get(gameType);
        //生成追单号
        String traceId = gameType.substring(0, 1) + System.currentTimeMillis();

        if(isTrace == 1){
            //如果是追号
            for(TraceOrder traceOrder : traces){
                Order o = orders.get(0).clone(traceOrder.getSeasonId(), traceOrder.getPrice());
                orders.add(o);
            }
        }
        //计算总额
        double buyMoney = 0;
        for(Order o : orders){
            //计算注数是否超标
            if ((o.getPlayId().contains("dwd") || o.getPlayId().contains("rx") || o.getPlayId().contains("single")) && BetCountData.hashmap.get(o.getPlayId()) != null && o.getBetCount() > BetCountData.hashmap.get(o.getPlayId()) * 0.8) {
                return Result.faild("投注超标", 400);
            }
            buyMoney += o.getBetCount() * o.getPrice() * o.getUnit();
            if(o.getSeasonId() == null){
                o.setSeasonId(sessionId);
            }
        }
        //判断余额
        if(user1.getMoney() < buyMoney){
            System.out.println("余额不足" + user.getUsername() + user1.getMoney() + "   " + buyMoney);
            //余额不足
            return Result.faild("余额不足", 501);
        }
        //扣减余额
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setMoney(user1.getMoney() - buyMoney);
        userManager.update(updateUser);
        //判断高返点
        /*
        double fandian = user1.getFandian();
        if(gameType.contains("pk10")){
            fandian = fandian > 0.3 ? fandian - 0.3 : 0;
        }else if(gameType.contains("k3")){
            fandian = fandian > 0.2 ? fandian - 0.2 : 0;
        }else if(gameType.contains("3d") || gameType.contains("pl3")){
            fandian = fandian > 1.6 ? fandian - 1.6 : 0;
        }*/



        //追单
        if(isTrace == 1){
            Trace trace = new Trace();
            trace.setId(traceId);
            trace.setAccount(user.getUsername());
            trace.setStartSeason(sessionId);
            trace.setIsWinStop(traceWinStop);
            trace.setLotteryId(gameType);
            trace.setLotteryName(GameType.playName.get(orders.get(0).getPlayId()));
            trace.setTraceAmount(buyMoney);
            traceManager.insert(trace);
        }
        //生成订单号
        String orderId = gameType.substring(0, 1) + System.currentTimeMillis();
        List<LotteryOrder> resultList = Lists.newArrayList();
        //下单
        for(int i = 0; i < orders.size(); i++){
            if(isTrace == 1 && i == 0){
                continue;
            }
            Order o = orders.get(i);
            BcLotteryOrder bcLotteryOrder = new BcLotteryOrder();
            bcLotteryOrder.setAccount(user.getUsername());
            bcLotteryOrder.setParentList(user1.getParentList());
            bcLotteryOrder.setLotCode(gameType);
            bcLotteryOrder.setOrderId(orderId + i);
            bcLotteryOrder.setTraceId(traceId);
            bcLotteryOrder.setBuyZhuShu(o.getBetCount());
            bcLotteryOrder.setMultiple(o.getPrice());
            bcLotteryOrder.setMinBonusOdds(o.getUnit());
            bcLotteryOrder.setBuyMoney(o.getBetCount() * o.getPrice() * o.getUnit());
            bcLotteryOrder.setPlayCode(o.getPlayId());
            bcLotteryOrder.setPlayName(GameType.playName.get(o.getPlayId()));
            bcLotteryOrder.setQiHao(o.getSeasonId());
            bcLotteryOrder.setHaoMa(o.getContent());
            bcLotteryOrder.setLotName(GameType.gameType.get(gameType));
            bcLotteryOrder.setZhuiHao(isTrace + "");
            bcLotteryOrder.setStatus(0);
            //double fandian = bounsRange == null ? bounsType == null ? 0 : user1.getFandian() : bounsRange;
            double fandian = 0;
            try{
                fandian = o.getBouns().split("-").length > 1 ? Double.valueOf(o.getBouns().split("-")[1].replace("%", "")) : 0;
            }catch (Exception e){
                e.printStackTrace();
            }
            bcLotteryOrder.setBounsType(fandian > 0 ? 1 : 0);
            //bcLotteryOrder.setOdds(GameData.oddsMap.get(o.getPlayId() + ":" + 0));
            bcLotteryOrder.setOdds(Double.valueOf(o.getBouns().split("-")[0]));
            bcLotteryOrder.setGaofan(fandian);
            System.out.println("---------------------------------");
            System.out.println(bcLotteryOrder.getAccount());
            System.out.println("---------------------------------");
            bcLotteryOrderManager.insert(bcLotteryOrder);
            resultList.add(OrderTransfar.bcLotteryToLottery(bcLotteryOrder));
        }
        MoneyHistory moneyHistory = new MoneyHistory();
        moneyHistory.setAccount(user.getUsername());
        moneyHistory.setParentList(user1.getParentList());
        moneyHistory.setAmount(0 - buyMoney);
        moneyHistory.setBalance(user1.getMoney() - amount);
        moneyHistory.setChangeType(isTrace == 1 ? "追号扣款" : "投注扣款");
        moneyHistory.setSeasonId(sessionId);
        moneyHistory.setLotteryName(GameType.gameType.get(gameType));
        moneyHistory.setPlayName(GameType.playName.get(orders.get(0).getPlayId()));
        moneyHistoryManager.insert(moneyHistory);
        //TODO Unit
        return Result.success(resultList);
    }

    /**
     * 生成追号计划
     * @return
     */
    @RequestMapping("/{gameType}/listTraceSeasonId")
    @ResponseBody
    public Result listTraceSeasonId(@PathVariable String gameType, int count){
        List<Map<String, String>> resultList = Lists.newArrayList();
        Long qihao = Long.valueOf(GameData.gameSeasonId.get(gameType));
        for(int i = 0; i < count; i++){
            Map<String, String> map = Maps.newHashMap();
            map.put("seasonId", qihao.toString());
            String time = CalculationUtils.lotteryTime(qihao, gameType);
            map.put("openTime", time);
            resultList.add(map);
            qihao =  CalculationUtils.traceList(qihao, gameType);
        }
        return Result.success(resultList);
    }

    @RequestMapping("/{gameType}/cancelOrder")
    @ResponseBody
    public Result cancelOrder(@ModelAttribute("user") User user, @PathVariable String gameType, String ids){
        BcLotteryOrder bcLotteryOrder = new BcLotteryOrder();
        bcLotteryOrder.setAccount(user.getUsername());
        bcLotteryOrder.setOrderId(ids);
        List<BcLotteryOrder> list = bcLotteryOrderManager.select(bcLotteryOrder, null, null, null, null);
        if(CollectionUtils.isEmpty(list)){
            return null;
        }
        if(!org.apache.commons.lang.StringUtils.equals(list.get(0).getQiHao(), GameData.gameSeasonId.get(list.get(0).getLotCode()))){
            return Result.faild("不是当期!", 400);
        }
        list.get(0).setStatus(10);
        bcLotteryOrderManager.update(list.get(0));
        User u = new User();
        u.setUsername(user.getUsername());
        userManager.update(u, list.get(0).getBuyMoney());
        return Result.success("操作成功！");
    }

    @RequestMapping("/rengong")
    @ResponseBody
    public Result txsscKj(String qiHao, String content){
        lotteryThread.lottery("txssc", qiHao, content);
        return Result.success("");
    }

    @RequestMapping("/beiyong")
    @ResponseBody
    public String beiyong(){
        String ss = HttpClientUtil.sendHttpGet("http://www.e3sh.com/txffc/");
        return ss;
    }
}