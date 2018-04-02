package com.hehaoyisheng.bcgame.common;

import com.hehaoyisheng.bcgame.entity.BcLotteryOrder;
import com.hehaoyisheng.bcgame.entity.MoneyHistory;
import com.hehaoyisheng.bcgame.entity.User;
import com.hehaoyisheng.bcgame.manager.BcLotteryOrderManager;
import com.hehaoyisheng.bcgame.manager.MoneyHistoryManager;
import com.hehaoyisheng.bcgame.manager.UserManager;
import org.springframework.util.CollectionUtils;

import java.util.List;

public class PK10Lottery implements Runnable{

    private BcLotteryOrderManager bcLotteryOrderManager;

    private UserManager userManager;

    private MoneyHistoryManager moneyHistoryManager;

    private List<BcLotteryOrder> bcLotteryOrders;

    private String looteryContent;

    public List<BcLotteryOrder> getBcLotteryOrders() {
        return bcLotteryOrders;
    }

    public void setBcLotteryOrders(List<BcLotteryOrder> bcLotteryOrders) {
        this.bcLotteryOrders = bcLotteryOrders;
    }

    public String getLooteryContent() {
        return looteryContent;
    }

    public void setLooteryContent(String looteryContent) {
        this.looteryContent = looteryContent;
    }

    public PK10Lottery(BcLotteryOrderManager bcLotteryOrderManager, UserManager userManager, MoneyHistoryManager moneyHistoryManager,  List<BcLotteryOrder> bcLotteryOrders, String looteryContent) {
        this.bcLotteryOrderManager = bcLotteryOrderManager;
        this.bcLotteryOrders = bcLotteryOrders;
        this.moneyHistoryManager = moneyHistoryManager;
        this.looteryContent = looteryContent;
        this.userManager = userManager;
    }

    public void run() {{
        if(CollectionUtils.isEmpty(bcLotteryOrders)){
            return;
        }
        for(BcLotteryOrder bcLotteryOrder : bcLotteryOrders){
            try {
                bcLotteryOrder.setLotteryHaoMa(looteryContent);
                String playCode = bcLotteryOrder.getPlayCode();
                String betNumber = bcLotteryOrder.getHaoMa();
                int winCount = 0;
                
                bcLotteryOrder.setWinMoney(bcLotteryOrder.getOdds() * winCount * (bcLotteryOrder.getMinBonusOdds() / 2));
                bcLotteryOrder.setWinZhuShu(winCount);
                LotteryCommon.addMoneyAndHistory(winCount, bcLotteryOrderManager, bcLotteryOrder, userManager, moneyHistoryManager);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    }
}