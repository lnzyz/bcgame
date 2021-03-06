var lottery = {
//	split : /,|，|；|;/g,
    defaultIndex : 2,
    defaultPlayer:'n11x5_star3_front',
    //注数计算
    getC : function(lines, index, allSize, cache) {
        var line = lines[index];
        var size = line.length;
        var count = 0;
        for (var i = 0; i < size; i++) {
            var n = line[i];
            if (!(n in cache)) {
                if (index + 1 < allSize) {
                    cache[n] = true;
                    count += this.getC(lines, index + 1, allSize, cache);
                    delete (cache[n]);
                } else {
                    // 最后一行
                    count += 1;
                }
            }
        }
        return count;
    },

    run : function(playId, s) {
        s = $.trim(s);
        s = s.replace(/ +/g, "_");
        s = s.replace(/[\s+，；;]/g, ",");
        s = s.replace(/,+/g, ",");
        s = s.replace(/_+/g, "");
        var func = 'this.' + playId + '("' + s + '")';
        var rel = eval(func);
        rel.id = playId;
        return rel;
    },

    //注数计算
    getCount : function(lines) {
        return this.getC(lines, 0, lines.length, {});
    },

    // 任选复式
    _nx : function(s,selectNum) {
        var lines = this.toList(s);
        var rel = this.combin(lines.length, selectNum);
        return {
            content : s,
            count : rel
        };
    },

    // 任选单式
    _nx_single : function(s,selectNum) {
        var regs = [new RegExp("^(0[1-9]|1[0-1]){"+selectNum+"}$"),/^(\d{2})*?(\d{2})(\d{2})*\2/];
        var trus = [false,true];
        return this.all_single(s,regs,trus);
    },

    // 任选胆拖
    _nx_dt : function(s,selectNum) {
        var lines = this.toList(s);
        var rel = 0;
        var line = '';
        if (lines.length == 2) {
            var dan = lines[0];
            var tuo = lines[1];
            for ( var i in dan) {
                var d = dan[i];
                var s = tuo.length;
                for(var j in tuo) {
                    var n = tuo[j];
                    if(n == d) {
                        s = tuo.length - 1;
                        break;
                    }
                }
                var ns = this.combin( s,selectNum-1);
                if(ns == 0) {
                    return {
                        content:'',count:0
                    }
                }
                rel+=ns;
            }
            line = "胆" + dan.join(",") + ";" + tuo.join(",");
        }
        return {
            content : line,
            count : rel
        };
    },

    // 任选1复式
    n11x5_x1 : function(s) {
        return this._nx(s,1);
    },

    // 任选1单式
    n11x5_x1_single : function(s) {
        return this._nx_single(s,1);
    },

    // 11选5 定位胆
    n11x5_dwd : function(s) {
        var lines = this.toList(s);
        var rel = 0;
        for ( var n in lines) {
            rel += lines[n].length;
        }
        var txt = this.format(s, ",", "");
        return {
            content : txt,
            count : rel,
        };
    },

    // 11选5 前三不定位
    n11x5_front3_nx1 : function(s) {
        var lines = this.toList(s);
        return {
            content : s,
            count : lines.length
        };
    },

    // 任选2复式
    n11x5_x2 : function(s) {
        var rel = this._nx(s,2);
        return rel;
    },

    // 任选2单式
    n11x5_x2_single : function(s) {
        var rel = this._nx_single(s,2);
        return rel;
    },

    // 任选2胆拖
    n11x5_x2_dt : function(s) {
        var rel = this._nx_dt(s,2);
        return rel;
    },

    // 前二直选
    n11x5_star2_front : function(s) {
        var lines = this.toList(s);
        var rel = 0;
        if (lines.length == 2) {
            rel = this.getCount(lines);
        }
        var line = this.format(s,",","")+",-,-,-";
        return {
            content : line,
            count : rel
        };
    },
    // 后二直选
    n11x5_star2_last : function(s) {
        var rel = this.n11x5_star2_front(s);
        rel.content =",-,-,-,"+this.format(s,",","");
        return rel;
    },

    n11x5_star2_front_single : function(s) {
        var reg1 = /^(0[1-9]|1[0-1]){2}$/;
        var reg2 = /(\d{2})\1/;
        return this.all_single(s,[reg1,reg2],[false,true]);
    },

    n11x5_star2_group : function(s) {
        var lines = this.toList(s);
        var rel = this.combin(lines.length,2);
        var line = s;
        return {
            content : line,
            count : rel
        };
    },

    n11x5_star2_group_single : function(s) {
        var reg1 = /^(0[1-9]|1[0-1]){2}$/;
        var reg2 = /(\d{2})\1/;
        return this.all_single(s,[reg1,reg2],[false,true]);
    },

    n11x5_star2_group_dt : function(s) {
        return this._nx_dt(s,2);
    },


    // 任选3复式
    n11x5_x3 : function(s) {
        return this._nx(s,3);
    },

    // 任选3单式
    n11x5_x3_single : function(s) {
        return this._nx_single(s,3);
    },

    // 任选3胆拖
    n11x5_x3_dt : function(s) {
        return this._nx_dt(s,3);
    },

    // 前三直选
    n11x5_star3_front : function(s) {
        var lines = this.toList(s);
        var rel = 0;
        if (lines.length == 3) {
            rel = this.getCount(lines);
        }
        var line = this.format(s,",","")+",-,-";
        return {
            content : line,
            count : rel
        };
    },

    // 后三直选
    n11x5_star3_last : function(s) {
        var rel = this.n11x5_star3_front(s);
        rel.content = "-,-,"+this.format(s,",","");
        return rel;
    },

    n11x5_star3_front_single : function(s) {
        var reg1 = /^(0[1-9]|1[0-1]){3}$/;
        var reg2 = /^(\d{2})*?(\d{2})(\d{2})*\2/;
        return this.all_single(s,[reg1,reg2],[false,true]);
    },

    n11x5_star3_group : function(s) {
        var lines = this.toList(s);
        var rel = this.combin(lines.length,3);
        var line = s;
        return {
            content : line,
            count : rel
        };
    },

    n11x5_star3_group_single : function(s) {
        return this.n11x5_star3_front_single(s);
    },

    n11x5_star3_group_dt : function(s) {
        return this._nx_dt(s,3);
    },

    // 任选4复式
    n11x5_x4 : function(s) {
        return this._nx(s,4);
    },

    // 任选4单式
    n11x5_x4_single : function(s) {
        return this._nx_single(s,4);
    },

    // 任选4胆拖
    n11x5_x4_dt : function(s) {
        return this._nx_dt(s,4);
    },

    // 任选5复式
    n11x5_x5 : function(s) {
        return this._nx(s,5);
    },

    // 任选5单式
    n11x5_x5_single : function(s) {
        return this._nx_single(s,5);
    },

    // 任选5胆拖
    n11x5_x5_dt : function(s) {
        return this._nx_dt(s,5);
    },

    // 任选6复式
    n11x5_x6 : function(s) {
        return this._nx(s,6);
    },

    // 任选6单式
    n11x5_x6_single : function(s) {
        return this._nx_single(s,6);
    },

    // 任选6胆拖
    n11x5_x6_dt : function(s) {
        return this._nx_dt(s,6);
    },

    // 任选7复式
    n11x5_x7 : function(s) {
        return this._nx(s,7);
    },

    // 任选7单式
    n11x5_x7_single : function(s) {
        return this._nx_single(s,7);
    },

    // 任选7胆拖
    n11x5_x7_dt : function(s) {
        return this._nx_dt(s,7);
    },

    // 任选8复式
    n11x5_x8 : function(s) {
        return this._nx(s,8);
    },

    // 任选8单式
    n11x5_x8_single : function(s) {
        return this._nx_single(s,8);
    },

    // 任选8胆拖
    n11x5_x8_dt : function(s) {
        return this._nx_dt(s,8);
    },
};
lottery = jQuery.extend(BaseLottery, lottery);