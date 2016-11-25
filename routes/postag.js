/**
 * 单词类型
 */
 
var POSTAG = {}; 

POSTAG.D_A  = 0x40000000; // 形容词 形语素
POSTAG.D_B  = 0x20000000; // 区别词 区别语素
POSTAG.D_C  = 0x10000000; // 连词 连语素
POSTAG.D_D  = 0x08000000; // 副词 副语素
POSTAG.D_E  = 0x04000000; // 叹词 叹语素
POSTAG.D_F  = 0x02000000; // 方位词 方位语素
POSTAG.D_I  = 0x01000000; // 成语
POSTAG.D_L  = 0x00800000; // 习语
POSTAG.A_M  = 0x00400000; // 数词 数语素
POSTAG.D_MQ = 0x00200000; // 数量词
POSTAG.D_N  = 0x00100000; // 名词 名语素
POSTAG.D_O  = 0x00080000; // 拟声词
POSTAG.D_P  = 0x00040000; // 介词
POSTAG.A_Q  = 0x00020000; // 量词 量语素
POSTAG.D_R  = 0x00010000; // 代词 代语素
POSTAG.D_S  = 0x00008000; // 处所词
POSTAG.D_T  = 0x00004000; // 时间词
POSTAG.D_U  = 0x00002000; // 助词 助语素
POSTAG.D_V  = 0x00001000; // 动词 动语素
POSTAG.D_W  = 0x00000800; // 标点符号
POSTAG.D_X  = 0x00000400; // 非语素字
POSTAG.D_Y  = 0x00000200; // 语气词 语气语素
POSTAG.D_Z  = 0x00000100; // 状态词
POSTAG.A_NR = 0x00000080; // 人名
POSTAG.A_NS = 0x00000040; // 地名
POSTAG.A_NT = 0x00000020; // 机构团体
POSTAG.A_NX = 0x00000010; // 外文字符
POSTAG.A_NZ = 0x00000008; // 其他专名
POSTAG.D_ZH = 0x00000004; // 前接成分
POSTAG.D_K  = 0x00000002; // 后接成分
POSTAG.UNK  = 0x00000000; // 未知词性
POSTAG.URL  = 0x00000001; // 网址、邮箱地址

var _POSTAG = {};
for (var i in POSTAG) _POSTAG[i] = POSTAG[i];
for (var i in POSTAG) POSTAG[i.toLowerCase()] = POSTAG[i];


/** 中文说明 */
POSTAG.chsName = function (p) {
  if (isNaN(p)) {
    return CHSNAME[p] || CHSNAME.UNK;
  } else {
    var ret = [];
    for (var i in _POSTAG) {
      if ((p & _POSTAG[i]) > 0) {
        ret.push(CHSNAME[i]);
      }
    }
    if (ret.length < 1) {
      return CHSNAME.UNK;
    } else {
      return ret.toString();
    }
  }
};

/** 词语类型权重 */
POSTAG.getWeight = function (p) {
  if (isNaN(p)) {
    return WEIGHT[p] || WEIGHT.UNK;
  } else {
    var ret = [];
    for (var i in _POSTAG) {
      if ((p & _POSTAG[i]) > 0) {
        ret.push(WEIGHT[i]);
      }
    }
    if (ret.length < 1) {
      return WEIGHT.UNK;
    } else {
      return ret.toString();
    }
  }
};

/** 词语的大致类型 */
POSTAG.getType = function (p) {
  if (isNaN(p)) {
    return TYPE[p] || TYPE.UNK;
  } else {
    var ret = [];
    for (var i in _POSTAG) {
      if ((p & _POSTAG[i]) > 0) {
        ret.push(TYPE[i]);
      }
    }
    if (ret.length < 1) {
      return TYPE.UNK;
    } else {
      return ret.toString();
    }
  }
};

var CHSNAME = POSTAG.CHSNAME = {};
POSTAG.CHSNAME.D_A  = '形容词 形语素';
POSTAG.CHSNAME.D_B  = '区别词 区别语素';
POSTAG.CHSNAME.D_C  = '连词 连语素';
POSTAG.CHSNAME.D_D  = '副词 副语素';
POSTAG.CHSNAME.D_E  = '叹词 叹语素';
POSTAG.CHSNAME.D_F  = '方位词 方位语素';
POSTAG.CHSNAME.D_I  = '成语';
POSTAG.CHSNAME.D_L  = '习语';
POSTAG.CHSNAME.A_M  = '数词 数语素';
POSTAG.CHSNAME.D_MQ = '数量词';
POSTAG.CHSNAME.D_N  = '名词 名语素';
POSTAG.CHSNAME.D_O  = '拟声词';
POSTAG.CHSNAME.D_P  = '介词';
POSTAG.CHSNAME.A_Q  = '量词 量语素';
POSTAG.CHSNAME.D_R  = '代词 代语素';
POSTAG.CHSNAME.D_S  = '处所词';
POSTAG.CHSNAME.D_T  = '时间词';
POSTAG.CHSNAME.D_U  = '助词 助语素';
POSTAG.CHSNAME.D_V  = '动词 动语素';
POSTAG.CHSNAME.D_W  = '标点符号';
POSTAG.CHSNAME.D_X  = '非语素字';
POSTAG.CHSNAME.D_Y  = '语气词 语气语素';
POSTAG.CHSNAME.D_Z  = '状态词';
POSTAG.CHSNAME.A_NR = '人名';
POSTAG.CHSNAME.A_NS = '地名';
POSTAG.CHSNAME.A_NT = '机构团体';
POSTAG.CHSNAME.A_NX = '外文字符';
POSTAG.CHSNAME.A_NZ = '其他专名';
POSTAG.CHSNAME.D_ZH = '前接成分';
POSTAG.CHSNAME.D_K  = '后接成分';
POSTAG.CHSNAME.UNK  = '未知';
POSTAG.CHSNAME.URL  = '网址 邮箱地址';

var TYPE = POSTAG.TYPE = {};
POSTAG.TYPE.D_A  = 'A';
POSTAG.TYPE.D_B  = 'A';
POSTAG.TYPE.D_C  = 'O';
POSTAG.TYPE.D_D  = 'AD';
POSTAG.TYPE.D_E  = 'O';
POSTAG.TYPE.D_F  = 'N';
POSTAG.TYPE.D_I  = 'N';
POSTAG.TYPE.D_L  = 'N';
POSTAG.TYPE.A_M  = 'N';
POSTAG.TYPE.D_MQ = 'N';
POSTAG.TYPE.D_N  = 'N';
POSTAG.TYPE.D_O  = 'O';
POSTAG.TYPE.D_P  = 'O';
POSTAG.TYPE.A_Q  = 'A';
POSTAG.TYPE.D_R  = 'N';
POSTAG.TYPE.D_S  = 'N';
POSTAG.TYPE.D_T  = 'N';
POSTAG.TYPE.D_U  = 'O';
POSTAG.TYPE.D_V  = 'V';
POSTAG.TYPE.D_W  = 'O';
POSTAG.TYPE.D_X  = 'N';
POSTAG.TYPE.D_Y  = 'O';
POSTAG.TYPE.D_Z  = 'A';
POSTAG.TYPE.A_NR = 'N';
POSTAG.TYPE.A_NS = 'N';
POSTAG.TYPE.A_NT = 'N';
POSTAG.TYPE.A_NX = 'N';
POSTAG.TYPE.A_NZ = 'N';
POSTAG.TYPE.D_ZH = 'O';
POSTAG.TYPE.D_K  = 'O';
POSTAG.TYPE.UNK  = 'U';
POSTAG.TYPE.URL  = 'N';

var WEIGHT = POSTAG.WEIGHT = {};
POSTAG.WEIGHT.D_A  = 0.15;
POSTAG.WEIGHT.D_B  = 0.15;
POSTAG.WEIGHT.D_C  = 0;
POSTAG.WEIGHT.D_D  = 0.15;
POSTAG.WEIGHT.D_E  = 0;
POSTAG.WEIGHT.D_F  = 0.3;
POSTAG.WEIGHT.D_I  = 0.3;
POSTAG.WEIGHT.D_L  = 0.3;
POSTAG.WEIGHT.A_M  = 0.3;
POSTAG.WEIGHT.D_MQ = 0.3;
POSTAG.WEIGHT.D_N  = 0.3;
POSTAG.WEIGHT.D_O  = 0.155;
POSTAG.WEIGHT.D_P  = 0;
POSTAG.WEIGHT.A_Q  = 0.15;
POSTAG.WEIGHT.D_R  = 0.3;
POSTAG.WEIGHT.D_S  = 0.3;
POSTAG.WEIGHT.D_T  = 0.3;
POSTAG.WEIGHT.D_U  = 0;
POSTAG.WEIGHT.D_V  = 0.3;
POSTAG.WEIGHT.D_W  = 0;
POSTAG.WEIGHT.D_X  = 0.3;
POSTAG.WEIGHT.D_Y  = 0;
POSTAG.WEIGHT.D_Z  = 0.15;
POSTAG.WEIGHT.A_NR = 0.3;
POSTAG.WEIGHT.A_NS = 0.3;
POSTAG.WEIGHT.A_NT = 0.3;
POSTAG.WEIGHT.A_NX = 0.3;
POSTAG.WEIGHT.A_NZ = 0.3;
POSTAG.WEIGHT.D_ZH = 0;
POSTAG.WEIGHT.D_K  = 0;
POSTAG.WEIGHT.UNK  = 0.1;
POSTAG.WEIGHT.URL  = 0.3;

for (var i in CHSNAME) {
  CHSNAME[i.toLowerCase()] = CHSNAME[i];
}

module.exports = POSTAG;
