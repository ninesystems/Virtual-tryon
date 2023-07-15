var TEA = (function() {

    /** privat emethods starts here **/
    var charsToLongs = function(chars){
        var temp = new Array(Math.ceil(chars.length/4));
        for (var i = 0; i<temp.length; i++) {
            temp[i] = chars[i*4] + (chars[i*4+1]<<8) + (chars[i*4+2]<<16) + (chars[i*4+3]<<24);
        }
        return temp;
    };
    var longsToChars=function(longs) {
        var codes = [];
        for (var i = 0; i<longs.length; i++) {
            codes.push(longs[i] & 0xFF, longs[i]>>>8 & 0xFF, longs[i]>>>16 & 0xFF, longs[i]>>>24 & 0xFF);
        }
        return codes;
    };

    var charsToHex = function(chars) {
        var result = "";
        var hexes = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
        for (var i = 0; i<chars.length; i++) {
            result += hexes[chars[i] >> 4] + hexes[chars[i] & 0xf];
        }
        return result;
    };
    var hexToChars =function(hex) {
        var codes = [];
        for (var i = (hex.substr(0, 2) == "0x") ? 2 : 0; i<hex.length; i+=2) {
            codes.push(parseInt(hex.substr(i, 2), 16));
        }
        return codes;
    };
    var charsToStr=function(chars) {
        var result = "";
        for (var i = 0; i<chars.length; i++) {
            result += String.fromCharCode(chars[i]);
        }
        return result;
    };
    var strToChars = function(str){
        var codes = [];
        for (var i = 0; i<str.length; i++) {
            codes.push(str.charCodeAt(i));
        }
        return codes;
    };

    return {
        /** Encryption method **/
        on: function(src, key){
            var v = charsToLongs(strToChars(src));
            var k = charsToLongs(strToChars(key));
            var n = v.length;
            var p;
            if (n == 0){
                return ""
            }
            if (n == 1){
                v[n++] = 0;
            }
            var z= v[n-1], y= v[0], delta = 0x9E3779B9;
            var mx, e, q= Math.floor(6+52/n), sum= 0;
            while (q-- > 0) {
                sum += delta;
                e = sum>>>2 & 3;
                for (p = 0; p<n-1; p++) {
                    y = v[p+1];
                    mx = (z>>>5^y<<2)+(y>>>3^z<<4)^(sum^y)+(k[p&3^e]^z);
                    z = v[p] += mx;
                }
                y = v[0];
                mx = (z>>>5^y<<2)+(y>>>3^z<<4)^(sum^y)+(k[p&3^e]^z);
                z = v[n-1] += mx;
            }
            return charsToHex(longsToChars(v));
        },
        /** decryption method **/
        off: function (src, key) {
            var v = charsToLongs(hexToChars(src));
            var k = charsToLongs(strToChars(key));
            var n = v.length;
            var p;
            if (n == 0) return "";
            var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
            var mx, e, q = Math.floor(6 + 52 / n);
            var sum = q * delta;
            while (sum != 0) {
                e = sum >>> 2 & 3;
                for (p = n - 1; p > 0; p--) {
                    z = v[p - 1];
                    mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                    y = v[p] -= mx;
                }
                z = v[n - 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                y = v[0] -= mx;
                sum -= delta;
            }
            return charsToStr(longsToChars(v));
        }
    };
})();
