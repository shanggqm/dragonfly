/**
 * Cookie操作
 *
 * @ignore
 * @author heatroom
 * Thanks to:
 * https://github.com/aralejs/cookie
 * https://github.com/component/cookie
 */
define(function(require) {
    var encode = encodeURIComponent,
        decode = decodeURIComponent;

    /**
     * Cookie操作
     *
     * @class cookie
     * @extends util
     * @singleton
     */
    var cookie = {};

    /**
     * 获取 cookie值
     *
     * @param {String} name 名称
     * @param {Object} [options] 选项
     * @return {String} 值
     */
    cookie.get = function(name, options) {
        validateCookieName(name);
        if (isFunction(options)) {
            options = {
                converter: options
            };
        } else {
            options = options || {};
        }

        var cookies = parse(document.cookie, !options.raw);
        return (options.converter || same)(cookies[name]);
    };

    /**
     * 设置cookie值
     *
     * @param {String} name 名称
     * @param {*} value 值
     * @param {Object} [options] 选项
     * @return {String} cookie字符串
     */
    cookie.set = function(name, value, options) {
        validateCookieName(name);

        options = options || {};
        var expires = options.expires;
        var domain = options.domain;
        var path = options.path;

        if (!options.raw) {
            value = encode(String(value));
        }

        var str = name + '=' + value;

        //expires
        var date = expires;
        if (typeof date === 'number') {
            date = new Date();
            date.setDate(date.getDate() + expires);
        }
        if (date instanceof Date) {
            str += '; expires=' + date.toUTCString();
        }

        //domain
        if (isNonEmptyString(domain)) {
            str += '; domain=' + domain;
        }

        //path
        if (isNonEmptyString(path)) {
            str += '; path=' + path;
        }

        //secure
        if (options.secure) {
            str += '; secure';
        }

        document.cookie = str;
        return str;
    };

    /**
     * 移除指定的cookie
     *
     * @param {String} name 名称
     * @param {Object} [options] 选项
     * @return {String} cookie字符串
     */
    cookie.remove = function(name, options) {
        options = options || {};
        options.expires = new Date(0);
        return this.set(name, '', options);
    };

    /*
     * Helpers
     */

    function parse(str, shouldDecode) {
        var obj = {};
        if (isString(str) && str.length > 0) {
            var decodeValue = shouldDecode ? decode : same;
            var cookieParts = str.split(/;\s/g);
            var cookieName;
            var cookieValue;
            var cookieNameValue;

            for (var i = 0, len = cookieParts.length; i < len; i++) {
                //check for normally-formatted cookie (name-value)
                cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                if (cookieNameValue instanceof Array) {
                    try {
                        cookieName = decode(cookieNameValue[1]);
                        cookieValue = decodeValue(cookieParts[i]
                            .substring(cookieNameValue[1].length + 1));
                    } catch (e) {
                        //intentionally ignore the cookie
                        //the encoding is wrong.
                    }
                } else {
                    //Means the cookie does not have an '=', so treate it as a boolen flag.
                    cookieName = decode(cookieParts[i]);
                    cookieValue = '';
                }

                if (cookieName) {
                    obj[cookieName] = cookieValue;
                }
            }
        }
        return obj;
    }

    function isFunction(o) {
        return typeof o === 'function';
    }

    function isString(o) {
        return typeof o === 'string';
    }

    function isNonEmptyString(s) {
        return isString(s) && s !== '';
    }

    function validateCookieName(name) {
        if (!isNonEmptyString(name)) {
            throw new TypeError('Cookie name must be a non-empty string');
        }
    }

    function same(s) {
        return s;
    }

    return cookie;
});
