/**
 *  手机号码验证
 */
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^1[0-9]{10}$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

/**
 * 电话号码验证
 */
jQuery.validator.addMethod("isTel", function(value, element) {
    var tel = /^d{3,4}-?d{7,9}$/; //电话号码格式010-12345678
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的电话号码");

/**
 * 联系电话(手机/电话皆可)验证
 */
jQuery.validator.addMethod("isPhone", function(value,element) {
    var length = value.length;
    var mobile = /^1[0-9]{10}$/;
    var tel = /^d{3,4}-?d{7,9}$/;
    return this.optional(element) || (tel.test(value) || mobile.test(value));

}, "请正确填写您的联系电话");




/**
 * 字母验证
 */
jQuery.validator.addMethod("englishLetter", function(value, element) {
    return this.optional(element) || /^[A-Za-z]+$/.test(value);
}, "只能输入英文字母");

/**
 * 字母数字
 */
jQuery.validator.addMethod("alnum", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能输入英文字母和数字");

/**
 * 字母 数字 下划线
 */
jQuery.validator.addMethod("alnumCode", function(value, element) {
    return this.optional(element) || /^(?!_)(?!.*?_$)[a-zA-Z0-9-_]+$/.test(value);
}, "只能输入数字、字母、下划线,不能以下划线开头和结尾");


/**
 *  html 标签 认证
 */
jQuery.validator.addMethod("htmlLabel", function(value, element) {
    return this.optional(element) || /<(.*)>.*<///1>|<(.*) //>/.test(value);
}, "请不要输入非法字符");

/**
 *  汉字 字母 数字 下划线
 */
jQuery.validator.addMethod("alnumName", function(value, element) {
    return this.optional(element) || /^(?!_)(?!.*?_$)[a-zA-Z0-9-._#\u4e00-\u9fa5]+$/.test(value);
}, "只能输入汉字、数字、字母、下划线,不能以下划线开头和结尾");

/**
 *  非法字符 验证
 */
jQuery.validator.addMethod("illegitmacy", function(value, element) {
    return this.optional(element) || /^(?!_)(?!.*?_$)[a-zA-Z0-9-_.@#%$*()={}""?<>, \u4e00-\u9fa5]+$/.test(value);
}, "存在非法输入字符,请检查输入法是否正确");

/**
 *  帐号认证
 */
jQuery.validator.addMethod("accountingNumber ", function(value, element) {
    return this.optional(element) || /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(value);
}, "只能以字母开头，允许6-18字节，允许字母数字下划线");


/**
 * 邮政编码验证
 */
jQuery.validator.addMethod("zipcode", function(value, element) {
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");

/**
 * 汉字
 */
jQuery.validator.addMethod("chcharacter", function(value, element) {
    var tel = /^[u4e00-u9fa5]+$/;
    return this.optional(element) || (tel.test(value));
}, "请输入汉字");

/**
 * 身份证 号
 * @param num
 * @returns {boolean}
 */
function isIdCardNo(num) {
    var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
    var parityBit=new Array("1","0","X","9","8","7","6","5","4","3","2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for(i=0;i<intStrLen;i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < "0" || varArray[i] > "9") && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }

    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6,14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for(i=0;i<17;i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else{ //length is 15
    //check date
        var date6 = idNumber.substring(6,12);
        if (isDate6(date6) == false) {

            return false;
        }
    }
    return true;

}

/**
 * 日期
 * @param sDate
 * @returns {boolean}
 */
function isDate6(sDate) {
    if(!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

/**
 * 日期
 * @param sDate
 * @returns {boolean}
 */
function isDate8(sDate) {
    if(!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}

/**
 * 身份证号码验证
 */
jQuery.validator.addMethod("idCardNo", function(value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请正确输入身份证号码");