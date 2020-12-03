'use strict';

function FakeByteArray() {
    this.position = 0;
    this.length = 0;
    this.data = [];
    this.lengths = [];
}

FakeByteArray.prototype.toBuffer = function () {

    var result = new ArrayBuffer(this.length);
    var dv = new DataView(result);

    var bytePos = 0;
    for (var i = 0; i < this.data.length; i++) {
        var d = this.data[i];
        var dataLength = this.lengths[i];

        //        console.log("bytepos " + bytePos + " dataLength: " + dataLength + " length: " + this.length);
        switch (dataLength) {
            case 1:
                dv.setUint8(bytePos, d);
                break;
            case 2:
                dv.setUint16(bytePos, d);
                break;
            case 4:
                dv.setUint32(bytePos, d);
                break;
        }
        bytePos += dataLength;
    }

    return result;
};

FakeByteArray.prototype.appendByteArray = function (arr) {
    for (var i = 0; i < arr.data.length; i++) {
        var d = arr.data[i];
        var dataLength = arr.lengths[i];
        switch (dataLength) {
            case 1:
                //                console.log("Appending byte " + d);
                this.writeByte(d);
                break;
            case 2:
                //                console.log("Appending short " + d);
                this.writeShort(d);
                break;
            case 4:
                //                console.log("Appending int " + d);
                this.writeInt(d);
                break;
        }
    }
};

FakeByteArray.prototype.writeByte = function (byt) {
    if (typeof (byt) === 'undefined') {
        console.log("bad byte...");
    }
    this.length += 1;
    this.data[this.position] = byt;
    this.lengths[this.position] = 1;
    this.position += 1;
};

FakeByteArray.prototype.writeInt = function (i) {
    if (typeof (i) === 'undefined') {
        console.log("bad int...");
    }
    this.length += 4;
    this.data[this.position] = i;
    this.lengths[this.position] = 4;
    this.position += 1;
};

FakeByteArray.prototype.writeShort = function (s) {
    if (typeof (s) === 'undefined') {
        console.log("bad short...");
    }
    this.length += 2;
    this.data[this.position] = s;
    this.lengths[this.position] = 2;
    this.position += 1;
};

// DONE
var MersenneTwister = function (a) {
    if (a == undefined) {
        a = new Date().getTime()
    }
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 2567483615;
    this.UPPER_MASK = 2147483648;
    this.LOWER_MASK = 2147483647;
    this.mt = new Array(this.N);
    this.mti = this.N + 1;
    this.init_genrand(a)
};
MersenneTwister.prototype.init_genrand = function (a) {
    this.mt[0] = a >>> 0;
    for (this.mti = 1; this.mti < this.N; this.mti++) {
        var a = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] = (((((a & 4294901760) >>> 16) * 1812433253) << 16) + (a & 65535) * 1812433253) + this.mti;
        this.mt[this.mti] >>>= 0
    }
};
MersenneTwister.prototype.genrand_int32 = function () {
    var c;
    var b = new Array(0, this.MATRIX_A);
    if (this.mti >= this.N) {
        var a;
        if (this.mti == this.N + 1) {
            this.init_genrand(5489)
        }
        for (a = 0; a < this.N - this.M; a++) {
            c = (this.mt[a] & this.UPPER_MASK) | (this.mt[a + 1] & this.LOWER_MASK);
            this.mt[a] = this.mt[a + this.M] ^ (c >>> 1) ^ b[c & 1]
        }
        for (; a < this.N - 1; a++) {
            c = (this.mt[a] & this.UPPER_MASK) | (this.mt[a + 1] & this.LOWER_MASK);
            this.mt[a] = this.mt[a + (this.M - this.N)] ^ (c >>> 1) ^ b[c & 1]
        }
        c = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ (c >>> 1) ^ b[c & 1];
        this.mti = 0
    }
    c = this.mt[this.mti++];
    c ^= (c >>> 11);
    c ^= (c << 7) & 2636928640;
    c ^= (c << 15) & 4022730752;
    c ^= (c >>> 18);
    return c >>> 0
};
MersenneTwister.prototype.genrand_int31 = function () {
    return (this.genrand_int32() >>> 1)
};
MersenneTwister.prototype.random = function () {
    return this.genrand_int32() * (1 / 4294967296)
};

function intervalIntersect(b, a) {
    return !(b[1] < a[0] || b[0] > a[1])
}

function mod(d, c) {
    var e = Math.round(d / c);
    d -= e * c;
    if (d < 0) {
        d += c
    }
    return d
}

function hash(b) {
    b = (b + 2127912214) + (b << 12);
    b = (b ^ 3345072700) ^ (b >> 19);
    b = (b + 374761393) + (b << 5);
    b = (b + 3550635116) ^ (b << 9);
    b = (b + 4251993797) + (b << 3);
    b = (b ^ 3042594569) ^ (b >> 16);
    return b
}

function hashCode(c) {
    var b = 0;
    if (c.length == 0) {
        return b
    }
    for (let i = 0; i < c.length; i++) {
        var a = c.charCodeAt(i);
        b = ((b << 5) - b) + a;
        b = b & b
    }
    return b
}

function getValueOrDefault(a, c, b) {
    return a && a[c] != undefined ? a[c] : b
}

function arrayEquals(b, a) {
    if (b && a && b.length == a.length) {
        for (var c = 0; c < b.length; c++) {
            if (b[c] != a[c]) {
                return false
            }
        }
        return true
    }
    return false
}

function arrayCopy(b) {
    if (b) {
        var a = [];
        for (var c = 0; c < b.length; c++) {
            a.push(b[c])
        }
        return a
    }
    return null
}

function arrayCopyWithCopy(b) {
    if (b) {
        var a = [];
        for (var c = 0; c < b.length; c++) {
            a.push(copyValueDeep(b[c]))
        }
        return a
    }
    return null
}

function array2dCopy(b) {
    if (b) {
        var a = [];
        for (var c = 0; c < b.length; c++) {
            a.push(arrayCopy(b[c]))
        }
        return a
    }
    return null
}

function addAll(b, a) {
    if (a && b) {
        for (var c = 0; c < a.length; c++) {
            b.push(a[c])
        }
    }
}

function positiveMod(e, d) {
    var c;
    if (e >= 0) {
        c = e % d
    } else {
        c = (d + e % d) % d
    }
    return c
}

function getObjectWithId(d, a) {
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if (c.id == d) {
            return c
        }
    }
    return null
}

function fixLikelihoods(e) {
    var a = [];
    if (e.length > 0) {
        var d = false;
        for (var c = 0; c < e.length; c++) {
            var b = e[c];
            b = Math.max(0, b);
            if (b > 0) {
                d = true
            }
            a[c] = b
        }
        if (!d) {
            a[0] = 1
        }
    }
    return a
}

function getProbabilityDistribution(f) {
    var b = [];
    var e = f.length;
    var d = 0;
    for (var c = 0; c < e; c++) {
        d += parseFloat(f[c])
    }
    b[0] = f[0];
    for (var c = 1; c < e; c++) {
        b[c] = (b[c - 1] + f[c])
    }
    if (d > 1e-9) {
        for (var c = 0; c < e; c++) {
            b[c] /= d
        }
    } else {
        var a = 1 / e;
        for (var c = 0; c < e; c++) {
            b[c] = (c + 1) * a
        }
    }
    return b
}

function sampleDataIndex(g, c) {
    var e = {};
    var d = [];
    for (var b = 0; b < g.length; b++) {
        if (typeof (g[b].active) != "undefined") {
            d[b] = g[b].active ? g[b].likelihood : 0
        } else {
            d[b] = g[b].likelihood
        }
    }
    var f = getProbabilityDistribution(d);
    var a = sampleIndexIntegerDistribution(c, f);
    return a
}

function sampleData(d, b) {
    var a = sampleDataIndex(d, b);
    var c = d[a];
    return c.data
}

function sampleNData(d, e, c) {
    var a = [];
    for (var b = 0; b < e; b++) {
        a.push(sampleData(d, c))
    }
    return a
}

function sampleNDataWithoutReplacement(e, c, a, b) {
    var j = [];
    if (!b) {
        e = arrayCopy(e)
    }
    c = Math.min(e.length, c);
    if (c == e.length) {
        for (var g = 0; g < e.length; g++) {
            j.push(e[g].data)
        }
    } else {
        for (var g = 0; g < c; g++) {
            var h = sampleDataIndex(e, a);
            var f = e[h];
            var d = f.data;
            j.push(d);
            e.splice(h, 1)
        }
    }
    return j
}

function sampleIndexIntegerDistribution(c, a) {
    var d = c.random();
    for (var b = 0; b < a.length; b++) {
        if (d < a[b]) {
            return b
        }
    }
    console.log("RandomUtils: Could not properly sample " + a);
    return 0
}

function arrayShuffle(a, d) {
    for (var e, c, b = a.length; b; e = parseInt(d.random() * b), c = a[--b], a[b] = a[e], a[e] = c) { }
}

function arrayContains(a, c) {
    for (var b = 0; b < a.length; b++) {
        if (a[b] == c) {
            return true
        }
    }
    return false
}

function arrayContainsExactly(a, c) {
    for (var b = 0; b < a.length; b++) {
        if (a[b] === c) {
            return true
        }
    }
    return false
}

function arrayContainsSameProperty(a, c, d) {
    for (var b = 0; b < a.length; b++) {
        if (a[b][c] == d) {
            return true
        }
    }
    return false
}

function arrayIndexOf(a, c) {
    for (var b = 0; b < a.length; b++) {
        if (a[b] == c) {
            return b
        }
    }
    return -1
}

function arrayDelete(a, c) {
    var b = arrayIndexOf(a, c);
    if (b >= 0) {
        a.splice(b, 1)
    }
}

function arrayDeleteAll(a, b) {
    for (var c = 0; c < b.length; c++) {
        arrayDelete(a, b[c])
    }
}

function getItemFromArrayWithStartEndItems(a, b, e, c, f, d) {
    var g = a;
    if (c >= 0 && b.length > 0) {
        g = b[c % b.length]
    }
    return getItemWithDefaultWithStartEndItems(g, e, c, f, d)
}

function getItemWithDefaultWithStartEndItems(b, e, c, f, d) {
    var a = b;
    if (c >= 0 && c < f.length) {
        a = f[c]
    }
    var g = e - c - 1;
    if (g >= 0 && g < d.length) {
        a = d[d.length - g - 1]
    }
    return a
}

function isArray(a) {
    return (Object.prototype.toString.call(a) === "[object Array]")
}

function lerp(c, b, a) {
    return b + c * (a - b)
}

function clamp(d, e, c) {
    return (d < e ? e : (d > c ? c : d))
}

function toPitchClassString(b) {
    var a = b % 12;
    switch (a) {
        case 0:
            return "C";
        case 1:
            return "C#";
        case 2:
            return "D";
        case 3:
            return "D#";
        case 4:
            return "E";
        case 5:
            return "F";
        case 6:
            return "F#";
        case 7:
            return "G";
        case 8:
            return "G#";
        case 9:
            return "A";
        case 10:
            return "A#";
        case 11:
            return "B"
    }
    return "?"
}

function copyValueDeep(g, f, d) {
    if (isArray(g)) {
        var a = [];
        for (var e = 0; e < g.length; e++) {
            a[e] = copyValueDeep(g[e], f, d)
        }
        return a
    } else {
        if (typeof (g) === "function") {
            return g
        } else {
            if (typeof (g) === "object") {
                return copyObjectDeep(g, d)
            } else {
                return g
            }
        }
    }
}

function copyObjectPropertiesDeep(e, d, a) {
    for (var c in d) {
        var b = d[c];
        if (!(typeof (b) === "function")) {
            if (a && a.propertyInfos) {
                a.propertyInfo = a.propertyInfos.getPropertyInfo(c)
            } else {
                if (a) {
                    a.propertyInfo = null
                }
            }
            e[c] = copyValueDeep(b, d, a)
        }
    }
}
var isValidFunctionName = function () {
    var b = /^[$A-Z_][0-9A-Z_$]*$/i;
    var a = {
        "abstract": true,
        "boolean": true,
        "with": true
    };
    return function (c) {
        return b.test(c) && !a[c]
    }
}();

function copyObjectDeep(obj, options) {
    if (typeof (obj) === "undefined" || obj == null) {
        return obj
    }
    var copy = null;
    if (!obj._constructorName) {
        copy = {}
    } else {
        if (isValidFunctionName(obj._constructorName)) {
            //copy = eval("new " + obj._constructorName + "()")
            copy = Object.create(obj);
        } else {
            copy = {}
        }
    }
    var createUniqueIds = getValueOrDefault(options, "createUniqueIds", false);
    if (createUniqueIds) {
        var propertyInfoProvider = getValueOrDefault(options, "propertyInfoProvider", null);
        if (propertyInfoProvider && obj._constructorName) {
            var propertyInfos = propertyInfoProvider.getGuiPropertyInfos(obj);
            options.propertyInfos = propertyInfos
        } else {
            options.propertyInfos = null
        }
    }
    copyObjectPropertiesDeep(copy, obj, options);
    return copy
}

function objectToJson(g, a, b) {
    if (!g._constructorName) {
        console.log("Missing _constructorName " + g.id + " in objectToJson()<br />")
    }
    if (!a) {
        a = []
    }
    if (!b) {
        b = new CustomMap(true)
    }
    var f = b.get(g);
    if (f) {
        console.log("Have visited " + JSON.stringify(g));
        return
    }
    b.put(g, true);
    a.push("{\n");
    var h = [];
    for (var e in g) {
        if (e.indexOf("__") < 0) {
            var d = g[e];
            if (d != null) {
                if (!(typeof (d) === "object") || d._constructorName || isArray(d)) {
                    if (!(typeof (d) === "function")) {
                        h.push(e)
                    }
                }
            }
        }
    }
    for (var c = 0; c < h.length; c++) {
        var e = h[c];
        var d = g[e];
        a.push('"' + e + '": ');
        valueToJson(d, a, b);
        if (c != h.length - 1) {
            a.push(", ")
        }
    }
    a.push("}");
    return a
}

function isFunction(a) {
    return typeof (a) === "function"
}

function valueToJson(d, a, b) {
    if (!a) {
        a = []
    }
    if (isArray(d)) {
        a.push("[");
        for (var c = 0; c < d.length; c++) {
            valueToJson(d[c], a, b);
            if (c != d.length - 1) {
                a.push(", ")
            }
        }
        a.push("]")
    } else {
        if (isFunction(d)) { } else {
            if (typeof (d) === "object") {
                objectToJson(d, a, b)
            } else {
                if (typeof (d) === "string") {
                    a.push('"' + d + '"')
                } else {
                    a.push(d)
                }
            }
        }
    }
    return a
}

function traverseValue(g, f, a) {
    if (g == null) {
        return
    }
    if (!a) {
        a = new CustomMap(true)
    }
    if (isArray(g)) {
        for (var c = 0; c < g.length; c++) {
            traverseValue(g[c], f, a)
        }
    } else {
        if (isFunction(g)) { } else {
            if (typeof (g) === "object") {
                var e = a.get(g);
                if (e) {
                    return
                }
                a.put(g, true);
                for (var d in g) {
                    if (d.indexOf("__") < 0) {
                        var b = g[d];
                        f(b, d, g);
                        if (b != null) {
                            traverseValue(b, f, a)
                        }
                    }
                }
            }
        }
    }
}

function getExpressionValue(expression, module, extraVars, verbose, object, propName) {
    var result = null;
    var exprIsString = typeof (expression) === "string";
    // expression does not contain a letter (i option is ignore case)
    // I suppose these could be symbols and numbers, but in a couple of test cases, the value was always 1
    if (exprIsString && !expression.match(/[a-z]/i)) { 
        // always seems to return 1
        //result = eval(expression);
        result = +expression;
        return result 
    }
    if (exprIsString && !expression.match(/[^a-z]/i)) {
        var variable = module.getVariable(expression);
        if (variable) {
            result = variable.getValue(module);
            return result
        }
    }
    var foundVars = {};
    var myArray = null;
    var replacedExpression = expression;
    var replaceSuccess = true;
    do {
        myArray = /([a-z][a-z0-9]*Var)/gi.exec(replacedExpression);
        if (myArray) {
            for (var i = 0; i < myArray.length; i++) {
                var varName = myArray[i];
                var variable = module.getVariable(varName);
                if (variable) {
                    foundVars[variable.id] = variable;
                    var varValue = variable.getValue(module);
                    var valueType = typeof (varValue);
                    if (valueType === "string" || valueType === "number" || isArray(varValue)) {
                        var re = new RegExp(myArray[i], "g");
                        replacedExpression = replacedExpression.replace(re, JSON.stringify(variable.getValue(module)))
                    } else {
                        replaceSuccess = false;
                        break
                    }
                } else {
                    replaceSuccess = false;
                    break
                }
            }
        }
    } while (myArray != null && replaceSuccess);
    if (replaceSuccess) {
        try {
            var result = eval(replacedExpression);
            return result
        } catch (exc) {
            console.log("Error when evaluating " + replacedExpression + " original: " + expression + " exc: " + exc)
        }
    }
    var prv = {};

    function prop(name, def) {
        prv[name] = def;
        return function (value) {
            if (typeof value === "undefined") {
                return Object.prototype.hasOwnProperty.call(prv, name) ? prv[name] : undefined
            }
            prv[name] = value;
            return this
        }
    }
    var pub = {};
    pub.module = prop("module", module);
    for (var varId in foundVars) {
        var v = foundVars[varId];
        pub[v.id] = prop(v.id, v.getValue(module))
    }
    if (extraVars) {
        for (var varName in extraVars) {
            pub[varName] = prop(varName, extraVars[varName])
        }
    }
    pub.getTheValue = function () {
        return prv[expression];
        // with / eval are dangerous. 'expression' is just a path to an property on the 'prv' object, so using prv[expression] works fine.
        //with (prv) {
        //    return eval(expression)
        //}
    };
    result = pub.getTheValue();
    return result
}

function getValueOrExpressionValue(b, d, a, e, c) {
    var j = b[d];
    try {
        if (b[d + "UseExpression"]) {
            var g = b[d + "Expression"];
            if (g) {
                if (c) {
                    console.log("Found expression " + g)
                }
                var h = getExpressionValue(g, a, e, c, b, d);
                if (h != null) {
                    j = h
                }
            }
        }
    } catch (f) {
        console.log("Expression eval error. useExpression: " + b[d + "UseExpression"] + " expression: " + b[d + "Expression"])
    }
    return j
}

function createFilledArray(d, c) {
    var a = [];
    for (var b = 0; b < d; b++) {
        a[b] = c
    }
    return a
}

function createFilledArrayWithCopyValue(d, c) {
    var a = [];
    for (var b = 0; b < d; b++) {
        a.push(copyValueDeep(c))
    }
    return a
}

function createFilledNumericIncArray(d, c, e) {
    var a = [];
    for (var b = 0; b < d; b++) {
        a.push(c);
        c += e
    }
    return a
}

function createFilledPatternArray(d, e) {
    var a = [];
    for (var c = 0; c < d; c++) {
        var b = e[c % e.length];
        a.push(b)
    }
    return a
}

function snapMidiTicks(d, a) {
    var e = d * a;
    var c = Math.floor(e);
    var b = e - c;
    return d - b / a
}

function stringEndsWith(b, a) {
    return b.length == a.length ? b == a : b.indexOf(a, b.length - a.length) !== -1
}

function getArrayValueOrDefault(a, c, e, d) {
    if (a && a.length > 0) {
        var b = a[c % a.length];
        if (!d || d(b)) {
            return b
        }
    }
    return e
}

function validateArrayValue(arrayValue, allowedTypes, defaultAllowedArrayTypes, correct) {
    if (!allowedTypes) {
        allowedTypes = defaultAllowedArrayTypes
    }
    if (!allowedTypes) {
        return false
    }
    var result = true;
    var type = typeof (arrayValue);
    if (isArray(arrayValue)) {
        result = allowedTypes.array
    } else {
        if (type === "object") {
            result = allowedTypes[arrayValue._constructorName];
            if (result) {
                //var safeValue = eval("new " + arrayValue._constructorName + "()");
                var safeValue = Object.create(arrayValue);
                result = validateValueWithSafeValue(arrayValue, safeValue, null, defaultAllowedArrayTypes, correct)
            }
        } else {
            result = allowedTypes[type]
        }
    }
    return result
}

function validateValueWithSafeValue(q, g, j, h, p) {
    if (!q) {
        return true
    }
    var f = typeof (q);
    var m = typeof (g);
    if (f != m) {
        return false
    }
    var l = true;
    if (isArray(q)) {
        if (!isArray(g)) {
            return false
        }
        var n = true;
        for (var k = 0; k < q.length; k++) {
            var e = q[k];
            var c = validateArrayValue(e, j, h, p);
            if (!c) {
                console.log("Type not valid in array " + e + " " + typeof (e) + " " + j);
                n = false;
                break
            }
        }
        if (!n) {
            if (p) {
                q.length = 0;
                return true
            } else {
                return false
            }
        }
    } else {
        if (f == "object") {
            for (var b in q) {
                var a = g[b];
                if (typeof (a) == "undefined") {
                    console.log("Property " + b + " in " + g._constructorName + " did not exist");
                    if (p) {
                        console.log("Removed it!");
                        delete q[b];
                        return true
                    }
                    return false
                } else {
                    var d = q[b];
                    var o = g[b + "_allowedTypes"];
                    var r = validateValueWithSafeValue(d, a, o, h, p);
                    if (!r) {
                        console.log("Property " + b + " in " + g._constructorName + " was not valid");
                        if (p) {
                            console.log("Used default value for it instead!");
                            q[b] = a;
                            return true
                        } else {
                            return false
                        }
                    }
                }
            }
        }
    }
    return l
}

var ChordType = {
    TRIAD: 0,
    SEVENTH: 1,
    SUS2: 2,
    SUS4: 3,
    SUS2_SEVENTH: 4,
    SUS4_SEVENTH: 5,
    NINTH: 6,
    CUSTOM: 7
};

var SimpleScaleType = {
    MAJOR: 1,
    NATURAL_MINOR: 2
};

var ScaleType = {
    CUSTOM: 0,
    MAJOR: 1,
    NATURAL_MINOR: 2,
    HARMONIC_MINOR: 3,
    MELODIC_MINOR: 4,
    PERSIAN: 5,
    DIMINISHED: 6,
    WHOLE_NOTE: 7,
    MAJOR_SCALE_STEPS: [0, 2, 4, 5, 7, 9, 11],
    NATURAL_MINOR_SCALE_STEPS: [0, 2, 3, 5, 7, 8, 10],
    HARMONIC_MINOR_SCALE_STEPS: [0, 2, 3, 5, 7, 8, 11],
    MELODIC_MINOR_SCALE_STEPS: [0, 2, 3, 5, 7, 9, 11],
    PERSIAN_SCALE_STEPS: [0, 1, 4, 5, 6, 8, 11],
    DIMINISHED_SCALE_STEPS: [0, 1, 3, 4, 6, 7, 9, 10],
    WHOLE_NOTE_SCALE_STEPS: [0, 2, 4, 6, 8, 10],
    getChromaticSteps: function (a) {
        switch (a) {
            case ScaleType.MAJOR:
                return ScaleType.MAJOR_SCALE_STEPS;
            case ScaleType.NATURAL_MINOR:
                return ScaleType.NATURAL_MINOR_SCALE_STEPS;
            case ScaleType.HARMONIC_MINOR:
                return ScaleType.HARMONIC_MINOR_SCALE_STEPS;
            case ScaleType.MELODIC_MINOR:
                return ScaleType.MELODIC_MINOR_SCALE_STEPS;
            case ScaleType.PERSIAN:
                return ScaleType.PERSIAN_SCALE_STEPS;
            case ScaleType.DIMINISHED:
                return ScaleType.DIMINISHED_SCALE_STEPS;
            case ScaleType.WHOLE_NOTE:
                return ScaleType.WHOLE_NOTE_SCALE_STEPS;
            default:
                return ScaleType.MAJOR_SCALE_STEPS
        }
    },
    toString: function (a) {
        switch (a) {
            case ScaleType.CUSTOM:
                return "Custom";
            case ScaleType.MAJOR:
                return "Major";
            case ScaleType.NATURAL_MINOR:
                return "Minor";
            case ScaleType.HARMONIC_MINOR:
                return "Harmonic minor";
            case ScaleType.MELODIC_MINOR:
                return "Melodic minor";
            case ScaleType.PERSIAN:
                return "Persian";
            case ScaleType.DIMINISHED:
                return "Diminished";
            case ScaleType.WHOLE_NOTE:
                return "Whole note"
        }
        return "Unknown scale type " + a
    }
};

var IndexType = {
    MIDI_NOTE: 0,
    SCALE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3
};

var SnapType = {
    NONE: 0,
    SCALE: 1,
    CHORD: 2
};

var FrequencyUnit = {
    HERTZ: 0,
    MIDI_NOTE: 1
};

var CyclesUnit = {
    CYCLES_PER_PERIOD: 0,
    CYCLES_PER_BEAT: 1,
    CYCLES_PER_MEASURE: 2,
    CYCLES_PER_HARMONY: 3,
    getFrequency: function (f, g, d, b, c) {
        var a = b - d;
        if (a > 0) {
            switch (f) {
                case CyclesUnit.CYCLES_PER_PERIOD:
                    return g;
                case CyclesUnit.CYCLES_PER_BEAT:
                    return g;
                case CyclesUnit.CYCLES_PER_MEASURE:
                    return g;
                case CyclesUnit.CYCLES_PER_HARMONY:
                    var e = c.getBeatLength();
                    return a / e
            }
        }
        return g
    }
};

var SnapMetrics = {
    FLOOR: 0,
    CEIL: 1,
    ROUND: 2,
    snap: function (b, a) {
        switch (a) {
            case SnapMetrics.CEIL:
                return Math.ceil(b);
            case SnapMetrics.FLOOR:
                return Math.floor(b);
            case SnapMetrics.ROUND:
                return Math.round(b)
        }
        return Math.round(b)
    }
};

var VerticalRelativeType = {
    MIDI_ZERO: 0,
    SCALE_BASE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3,
    VOICE_LINE: 4,
    NOTE: 5,
    sample: function (a) {
        return Math.min(4, Math.max(0, Math.floor(a.random() * 5)))
    }
};

var IndexBorderMode = {
    END: 0,
    RESTART: 1,
    MIRROR: 2,
    CLAMP: 3,
    getIndex: function (e, c, b) {
        if (b < c) {
            return b
        }
        switch (e) {
            case IndexBorderMode.END:
                return -1;
            case IndexBorderMode.CLAMP:
                return c - 1;
            case IndexBorderMode.RESTART:
                return b % c;
            case IndexBorderMode.MIRROR:
                var d = c * 2;
                var a = b % d;
                if (a < c) {
                    return a
                } else {
                    return d - a - 1
                }
        }
        return b
    }
};

var HorizontalRelativeType = {
    PREVIOUS_NOTE: 0,
    NEXT_NOTE: 1,
    PREVIOUS_VOICE_LINE_ELEMENT: 2,
    NEXT_VOICE_LINE_ELEMENT: 3
};

var OffsetType = {
    CHORD: 0,
    SCALE: 1,
    HALF_STEP: 2,
    OCTAVE: 3,
    CHORD_TRIAD_ONLY: 4,
    CHORD_SEVENTH_ONLY: 5
};

var LengthAndCountUnit = {
    LENGTH_PERCENT: 0,
    COUNT_PERCENT: 1,
    LENGTH: 2,
    COUNT: 3
};

var CountUnit = {
    PLAIN: 0,
    HARMONY_ELEMENT_MEASURES: 1,
    HARMONY_ELEMENT_BEATS: 2,
    HARMONY_MEASURES: 3,
    HARMONY_BEATS: 4,
    HARMONY_ELEMENT_COUNT: 5,
    PLAIN_PLUS_HARMONY_ELEMENT_MEASURES: 6,
    PLAIN_PLUS_HARMONY_ELEMENT_BEATS: 7,
    PLAIN_PLUS_HARMONY_MEASURES: 8,
    PLAIN_PLUS_HARMONY_BEATS: 9,
    PLAIN_PLUS_HARMONY_ELEMENT_COUNT: 10,
    PHRASE_ELEMENT_COUNT: 11,
    getCount: function (g, h, f, b) {
        switch (h) {
            case CountUnit.PLAIN:
                return g;
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return f.getCount() * g;
            case CountUnit.HARMONY_BEATS:
                var j = 0;
                for (var d = 0; d < f.getCount(); d++) {
                    var c = f.get(d);
                    j += positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null)
                }
                return j * g;
            case CountUnit.HARMONY_ELEMENT_BEATS:
                var k = f.getHarmonyIndexAt(b);
                var c = f.get(k);
                return g * positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                var k = f.getHarmonyIndexAt(b);
                var c = f.get(k);
                var j = positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
                return g * (j / c.tsNumerator);
            case CountUnit.HARMONY_MEASURES:
                var a = 0;
                for (var d = 0; d < f.getCount(); d++) {
                    var c = f.get(d);
                    var j = positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
                    a += (j / c.tsNumerator)
                }
                return a * g;
            case CountUnit.PHRASE_ELEMENT_COUNT:
                var e = f.getPhraseRangeAt(b);
                return g * (e[1] - e[0] + 1);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return f.getCount() + g;
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                var j = 0;
                for (var d = 0; d < f.getCount(); d++) {
                    var c = f.get(d);
                    j += positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null)
                }
                return j + g;
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                var k = f.getHarmonyIndexAt(b);
                var c = f.get(k);
                return g + positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                var k = f.getHarmonyIndexAt(b);
                var c = f.get(k);
                var j = positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
                return j / c.tsNumerator + g;
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                var a = 0;
                for (var d = 0; d < f.getCount(); d++) {
                    var c = f.get(d);
                    var j = positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator, null);
                    a += (j / c.tsNumerator)
                }
                return a + g
        }
        return g
    }
};

var PositionUnit = {
    MEASURES: 0,
    BEATS: 1,
    WHOLE_NOTES: 2,
    HALF_NOTES: 3,
    QUARTER_NOTES: 4,
    EIGHTH_NOTES: 5,
    SIXTEENTH_NOTES: 6,
    BEATS_PLUS_MEASURE: 7,
    BEAT_THIRDS: 8,
    BEAT_FOURTHS: 9,
    BEAT_FIFTHS: 10,
    BEAT_SIXTHS: 11,
    BEAT_SEVENTHS: 12,
    BEAT_EIGHTHS: 13,
    BEAT_NINTHS: 14,
    HARMONY_INDEX: 15,
    HARMONY: 16,
    BEATS_PLUS_HARMONY: 17,
    BEATS_PLUS_HARMONY_ELEMENT: 18,
    HARMONY_ELEMENTS: 19,
    PHRASE: 20
};

function positionUnitToBeats2(a, h, b, e) {
    var k = e.getHarmonyIndexAt(b);
    var g = e.get(k);
    var j = 0;
    for (var d = k; d >= 0; d--) {
        var c = e.get(d);
        if (c.startsPhrase) {
            j = d;
            break
        }
    }
    var f = e.getCount();
    for (var d = k; d < e.getCount(); d++) {
        var c = e.get(d);
        if (c.startsPhrase) {
            f = Math.max(d - 1, k);
            break
        }
    }
    return positionUnitToBeats(a, h, g.tsNumerator, g.tsDenominator, e, g, [j, f])
}

function positionUnitToBeats(c, n, a, d, j, m, k) {
    var p = 1;
    switch (d) {
        case 2:
            p = 0.5;
            break;
        case 4:
            p = 1;
            break;
        case 8:
            p = 2;
            break
    }
    switch (n) {
        case PositionUnit.BEATS:
            return c;
        case PositionUnit.BEAT_THIRDS:
            return c / 3;
        case PositionUnit.BEAT_FOURTHS:
            return c / 4;
        case PositionUnit.BEAT_FIFTHS:
            return c / 5;
        case PositionUnit.BEAT_SIXTHS:
            return c / 6;
        case PositionUnit.BEAT_SEVENTHS:
            return c / 7;
        case PositionUnit.BEAT_EIGHTHS:
            return c / 8;
        case PositionUnit.BEAT_NINTHS:
            return c / 9;
        case PositionUnit.QUARTER_NOTES:
            return p * c;
        case PositionUnit.EIGHTH_NOTES:
            return p * 0.5 * c;
        case PositionUnit.HALF_NOTES:
            return p * 2 * c;
        case PositionUnit.MEASURES:
            return a * c;
        case PositionUnit.SIXTEENTH_NOTES:
            return p * 0.25 * c;
        case PositionUnit.WHOLE_NOTES:
            return p * 4 * c;
        case PositionUnit.BEATS_PLUS_MEASURE:
            return a + c;
        case PositionUnit.HARMONY:
            if (j) {
                return c * j.getBeatLength()
            } else {
                return c * a
            }
        case PositionUnit.HARMONY_ELEMENTS:
            if (m) {
                return c * positionUnitToBeats(m.length, m.lengthUnit, a, d)
            } else {
                return c * a
            }
        case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
            if (m) {
                return c + positionUnitToBeats(m.length, m.lengthUnit, a, d)
            } else {
                return a + c
            }
        case PositionUnit.BEATS_PLUS_HARMONY:
            if (j) {
                return c + j.getBeatLength()
            } else {
                return a + c
            }
        case PositionUnit.HARMONY_INDEX:
            if (j) {
                var l = Math.floor(c);
                var b = c - l;
                var h = 0;
                var g = null;
                for (var f = 0; f < l; f++) {
                    var e = j.get(f);
                    if (e) {
                        h += positionUnitToBeats(e.length, e.lengthUnit, e.tsNumerator, e.tsDenominator, null);
                        g = e
                    }
                }
                var o = j.get(l);
                if (!o) {
                    o = g
                }
                if (o) {
                    h += positionUnitToBeats(o.length * b, o.lengthUnit, o.tsNumerator, o.tsDenominator, null)
                }
                return h
            } else {
                return positionUnitToBeats(c, PositionUnit.MEASURES, a, d, j)
            }
            break;
        case PositionUnit.PHRASE:
            if (j) {
                if (k) {
                    var q = 0;
                    for (var f = k[0]; f <= k[1]; f++) {
                        if (f >= 0 && f < j.getCount()) {
                            q += j.get(f).getBeatLength()
                        }
                    }
                    return c * q
                } else {
                    return c * j.getBeatLength()
                }
            } else {
                return c * a
            }
            break
    }
    return c
}
var PhraseHarmonyElementType = {
    COMPLETE: 0,
    COMPLETE_IMPERFECT: 1,
    INCOMPLETE: 2,
    DECEPTIVE: 3,
    ANTECEDENT_CONSEQUENT: 4,
    PROLONGED_TONIC: 5,
    PROLONGED_TONIC_INCOMPLETE: 6,
    PROLONGED_TONIC_COMPLETE: 7,
    PROLONGED_TONIC_COMPLETE_IMPERFECT: 8,
    COMPLETE_MODULATE: 9,
    CONSEQUENT: 10,
    COMPLETE_MODULATE_IMPERFECT: 11,
    INCOMPLETE_INITIAL: 12,
    PROLONGED_DOMINANT: 13,
    PROLONGED_DOMINANT_CADENCE: 14,
    COMPLETE_PLAGIAL: 15,
    CHROMATIC_TRANSITION_INCOMPLETE: 16,
    CHROMATIC_TRANSITION_COMPLETE: 17,
    CHROMATIC_TRANSITION_MODULATE: 18,
    CHROMATIC_TRANSITION_TONICIZE: 19,
    COMPLETE_TONICIZE: 20,
    COMPLETE_TONICIZE_IMPERFECT: 21,
    COMPLETE_LENGTHEN_FINAL_TONIC: 22,
    COMPLETE_LENGTHEN_DOMINANT: 23,
    INCOMPLETE_NO_DOMINANT: 24,
    CHROMATIC_OSCILLATION: 25
};

function BaseInterpolator(b, a) {
    this.n = b.length;
    this.mm = a;
    this.jsav = 0;
    this.cor = 0;
    this.dj = Math.min(1, Math.floor(Math.pow(this.n, 0.25)));
    this.xx = b
}
BaseInterpolator.prototype.interpolate = function (a) {
    var b = (this.cor != 0) ? this.hunt(a) : this.locate(a);
    return this.rawInterpolate(b, a)
};
BaseInterpolator.prototype.rawInterpolate = function (b, a) {
    return 0
};
BaseInterpolator.prototype.locate = function (a) {
    var e, b, d;
    if (this.n < 2 || this.mm < 2 || this.mm > this.n) {
        console.log("Locate size error");
        return 0
    }
    var c = (this.xx[this.n - 1] >= this.xx[0]);
    d = 0;
    e = this.n - 1;
    while (e - d > 1) {
        b = (e + d) >> 1;
        if (a >= this.xx[b] == c) {
            d = b
        } else {
            e = b
        }
    }
    this.cor = Math.abs(d - this.jsav) > this.dj ? 0 : 1;
    this.jsav = d;
    return Math.max(0, Math.min(this.n - this.mm, d - ((this.mm - 2) >> 1)))
};
BaseInterpolator.prototype.hunt = function (a) {
    var d = this.jsav;
    var b, e;
    var f = 1;
    if (this.n < 2 || this.mm < 2 || this.mm > this.n) {
        console.log(" Hunt size error");
        return 0
    }
    var c = (this.xx[this.n - 1] > this.xx[0]);
    if (d < 0 || d > this.n - 1) {
        d = 0;
        e = this.n - 1
    } else {
        if (a >= this.xx[d] == c) {
            for (; ;) {
                e = d + f;
                if (e >= this.n - 1) {
                    e = this.n - 1;
                    break
                } else {
                    if (a < this.xx[e] == c) {
                        break
                    } else {
                        d = e;
                        f += f
                    }
                }
            }
        } else {
            e = d;
            for (; ;) {
                d = d - f;
                if (d <= 0) {
                    d = 0;
                    break
                } else {
                    if (a >= this.xx[d] == c) {
                        break
                    } else {
                        e = d;
                        f += f
                    }
                }
            }
        }
    }
    while (e - d > 1) {
        b = (e + d) >> 1;
        if (a >= this.xx[b] == c) {
            d = b
        } else {
            e = b
        }
    }
    this.cor = Math.abs(d - this.jsav) > this.dj ? 0 : 1;
    this.jsav = d;
    return Math.max(0, Math.min(this.n - this.mm, d - ((this.mm - 2) >> 1)))
};

function DoubleBaseInterpolator(b, c, a) {
    BaseInterpolator.call(this, b, a);
    this.yy = c
}
DoubleBaseInterpolator.prototype = new BaseInterpolator([], 2);

function LinearInterpolator(b, a) {
    DoubleBaseInterpolator.call(this, b, a, 2)
}
LinearInterpolator.prototype = new DoubleBaseInterpolator([], [], 2);
LinearInterpolator.prototype.rawInterpolate = function (b, a) {
    if (this.xx[b] == this.xx[b + 1]) {
        return this.yy[b]
    } else {
        return this.yy[b] + ((a - this.xx[b]) / (this.xx[b + 1] - this.xx[b])) * (this.yy[b + 1] - this.yy[b])
    }
};
var QuadraticSplineInterpolation = {
    CR00: 0.5,
    CR01: -1,
    CR02: 0.5,
    CR10: -1,
    CR11: 1,
    CR12: 0,
    CR20: 0.5,
    CR21: 0.5,
    CR22: 0,
    interpolate: function (l, k) {
        var f = k.length;
        var a = f - 2;
        var b = 0;
        if (a < 1) {
            console.log(" quadratic spline has too few knots");
            return 0
        }
        l = clamp(l, 0, 0.9999) * a;
        var m = Math.floor(l);
        if (m >= f - 2) {
            m = f - 2
        }
        l -= m;
        b += m;
        var j = k[b];
        var h = k[b + 1];
        var g = k[b + 2];
        var c = this.CR00 * j + this.CR01 * h + this.CR02 * g;
        var d = this.CR10 * j + this.CR11 * h + this.CR12 * g;
        var e = this.CR20 * j + this.CR21 * h + this.CR22 * g;
        return (c * l + d) * l + e
    }
};
var SplineInterpolation = {
    CR00: -0.5,
    CR01: 1.5,
    CR02: -1.5,
    CR03: 0.5,
    CR10: 1,
    CR11: -2.5,
    CR12: 2,
    CR13: -0.5,
    CR20: -0.5,
    CR21: 0,
    CR22: 0.5,
    CR23: 0,
    CR30: 0,
    CR31: 1,
    CR32: 0,
    CR33: 0,
    interpolate: function (n, m) {
        var g = m.length;
        var b = g - 3;
        var c = 0;
        if (b < 1) {
            console.log(" Spline has too few knots");
            return 0
        }
        n = clamp(n, 0, 0.9999) * b;
        var o = Math.floor(n);
        if (o >= g - 3) {
            o = g - 3
        }
        n -= o;
        c += o;
        var l = m[c];
        var k = m[c + 1];
        var j = m[c + 2];
        var h = m[c + 3];
        var a = this.CR00 * l + this.CR01 * k + this.CR02 * j + this.CR03 * h;
        var d = this.CR10 * l + this.CR11 * k + this.CR12 * j + this.CR13 * h;
        var e = this.CR20 * l + this.CR21 * k + this.CR22 * j + this.CR23 * h;
        var f = this.CR30 * l + this.CR31 * k + this.CR32 * j + this.CR33 * h;
        return ((a * n + d) * n + e) * n + f
    }
};
// Map was renamed to CustomMap to avoid conflicting with ES6 Map
function CustomMap(a) {
    this.current = undefined;
    this.size = 0;
    this.isLinked = true;
    if (a === false) {
        this.disableLinking()
    }
}
CustomMap.from = function (d, a, c) {
    var b = new CustomMap(c);
    for (var e in d) {
        if (a || d.hasOwnProperty(e)) {
            b.put(e, d[e])
        }
    }
    return b
};
CustomMap.noop = function () {
    return this
};
CustomMap.illegal = function () {
    throw new Error("can't do this with unlinked maps")
};
CustomMap.prototype.disableLinking = function () {
    this.isLinked = false;
    this.link = Map.noop;
    this.unlink = Map.noop;
    this.disableLinking = Map.noop;
    this.next = Map.illegal;
    this.key = Map.illegal;
    this.value = Map.illegal;
    this.removeAll = Map.illegal;
    this.each = Map.illegal;
    this.flip = Map.illegal;
    this.drop = Map.illegal;
    this.listKeys = Map.illegal;
    this.listValues = Map.illegal;
    return this
};
CustomMap.prototype.hash = function (a) {
    // replaced ++arguments.callee.current with ++this.hash.current
    return a instanceof Object ? (a.__hash || (a.__hash = "object " + ++this.hash.current)) : (typeof a) + " " + String(a)
};
CustomMap.prototype.hash.current = 0;
CustomMap.prototype.link = function (a) {
    if (this.size === 0) {
        a.prev = a;
        a.next = a;
        this.current = a
    } else {
        a.prev = this.current.prev;
        a.prev.next = a;
        a.next = this.current;
        this.current.prev = a
    }
};
CustomMap.prototype.unlink = function (a) {
    if (this.size === 0) {
        this.current = undefined
    } else {
        a.prev.next = a.next;
        a.next.prev = a.prev;
        if (a === this.current) {
            this.current = a.next
        }
    }
};
CustomMap.prototype.get = function (a) {
    var b = this[this.hash(a)];
    return typeof b === "undefined" ? undefined : b.value
};
CustomMap.prototype.put = function (a, c) {
    var d = this.hash(a);
    if (this.hasOwnProperty(d)) {
        this[d].value = c
    } else {
        var b = {
            key: a,
            value: c
        };
        this[d] = b;
        this.link(b);
        ++this.size
    }
    return this
};
CustomMap.prototype.remove = function (a) {
    var b = this.hash(a);
    if (this.hasOwnProperty(b)) {
        --this.size;
        this.unlink(this[b]);
        delete this[b]
    }
    return this
};
CustomMap.prototype.removeAll = function () {
    while (this.size) {
        this.remove(this.key())
    }
    return this
};
CustomMap.prototype.contains = function (a) {
    return this.hasOwnProperty(this.hash(a))
};
CustomMap.prototype.isUndefined = function (a) {
    var b = this.hash(a);
    return this.hasOwnProperty(b) ? typeof this[b] === "undefined" : false
};
CustomMap.prototype.next = function () {
    this.current = this.current.next
};
CustomMap.prototype.key = function () {
    return this.current.key
};
CustomMap.prototype.value = function () {
    return this.current.value
};
CustomMap.prototype.each = function (c, a) {
    if (typeof a === "undefined") {
        a = this
    }
    for (var b = this.size; b--; this.next()) {
        var d = c.call(a, this.key(), this.value(), b > 0);
        if (typeof d === "number") {
            b += d
        }
    }
    return this
};
CustomMap.prototype.flip = function (e) {
    var d = new CustomMap(e);
    for (var a = this.size; a--; this.next()) {
        var c = this.value(),
            b = d.get(c);
        if (b) {
            b.push(this.key())
        } else {
            d.put(c, [this.key()])
        }
    }
    return d
};
CustomMap.prototype.drop = function (c, a) {
    if (typeof a === "undefined") {
        a = this
    }
    for (var b = this.size; b--;) {
        if (c.call(a, this.key(), this.value())) {
            this.remove(this.key());
            --b
        } else {
            this.next()
        }
    }
    return this
};
CustomMap.prototype.listValues = function () {
    var b = [];
    for (var a = this.size; a--; this.next()) {
        b.push(this.value())
    }
    return b
};
CustomMap.prototype.listKeys = function () {
    var b = [];
    for (var a = this.size; a--; this.next()) {
        b.push(this.key())
    }
    return b
};
CustomMap.reverseIndexTableFrom = function (g, f) {
    var e = new CustomMap(f);
    for (var b = 0, a = g.length; b < a; ++b) {
        var c = g[b],
            d = e.get(c);
        if (d) {
            d.push(b)
        } else {
            e.put(c, [b])
        }
    }
    return e
};
CustomMap.cross = function (h, g, e, b) {
    var f, a;
    if (h.isLinked) {
        f = h;
        a = g
    } else {
        if (g.isLinked) {
            f = g;
            a = h
        } else {
            Map.illegal()
        }
    }
    for (var d = f.size; d--; f.next()) {
        var c = f.key();
        if (a.contains(c)) {
            e.call(b, c, h.get(c), g.get(c))
        }
    }
    return b
};
CustomMap.uniqueArray = function (d) {
    var c = new Map;
    for (var b = 0, a = d.length; b < a; ++b) {
        c.put(d[b])
    }
    return c.listKeys()
};

function LatticeNoise(b, a) {
    a = a ? Math.min(12, Math.max(2, a)) : 9;
    this.TAB_SIZE = Math.round(Math.pow(2, a));
    this.TAB_MASK = this.TAB_SIZE - 1;
    this.valueTab = [];
    this.rnd = b ? b : Math.random;
    this.fillValueTab()
}
LatticeNoise.prototype.fillValueTab = function () {
    for (var a = 0; a < this.TAB_SIZE; a++) {
        this.valueTab[a] = 1 - 2 * this.rnd.random()
    }
};
LatticeNoise.prototype.whiteNoise1 = function (a) {
    var b = Math.floor(a);
    return this.latticeValue1(b)
};
LatticeNoise.prototype.lerpNoise1 = function (a) {
    var b = Math.floor(a);
    var c = a - b;
    return lerp(c, this.latticeValue1(b), this.latticeValue1(b + 1))
};
LatticeNoise.prototype.cubicNoise1 = function (b) {
    var c = Math.floor(b);
    var e = b - c;
    var a = [];
    for (var d = -1; d <= 2; d++) {
        a[d + 1] = this.latticeValue1(c + d)
    }
    return SplineInterpolation.interpolate(e, a)
};
LatticeNoise.prototype.quadraticNoise1 = function (a) {
    var c = Math.floor(a);
    var e = a - c;
    var b = [];
    for (var d = -1; d <= 1; d++) {
        b[d + 1] = this.latticeValue1(c + d)
    }
    return QuadraticSplineInterpolation.interpolate(e, b)
};
LatticeNoise.prototype.latticeValue1 = function (a) {
    return this.valueTab[this.index1(a)]
};
LatticeNoise.prototype.index1 = function (a) {
    return hash(a) & this.TAB_MASK
};
var ClassicalNoise = function (b) {
    if (b == undefined) {
        b = Math
    }
    this.grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1]
    ];
    this.p = [];
    for (var a = 0; a < 256; a++) {
        this.p[a] = Math.floor(b.random() * 256)
    }
    this.perm = [];
    for (var a = 0; a < 512; a++) {
        this.perm[a] = this.p[a & 255]
    }
};
ClassicalNoise.prototype.dot = function (b, a, d, c) {
    return b[0] * a + b[1] * d + b[2] * c
};
ClassicalNoise.prototype.mix = function (d, c, e) {
    return (1 - e) * d + e * c
};
function EditorFunctionOrVariable() {
    this.id = "";
    this._constructorName = "EditorFunctionOrVariable"
}
var EnumType = {
    POSITION_UNIT: 0,
    CHORD_TYPE: 1,
    SCALE_TYPE: 2,
    INDEX_TYPE: 3,
    SNAP_TYPE: 4,
    SNAP_METRICS: 5,
    VERTICAL_RELATIVE_TYPE: 6,
    INDEX_BORDER_MODE: 7,
    HORIZONTAL_RELATIVE_TYPE: 8,
    OFFSET_TYPE: 9,
    COUNT_UNIT: 10,
    PREDEFINED_CURVE_TYPE: 11
};


function SimpleEnumEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this.enumType = EnumType.POSITION_UNIT;
    this.positionUnitValue = PositionUnit.BEATS;
    this.chordTypeValue = ChordType.TRIAD;
    this.scaleTypeValue = ScaleType.MAJOR;
    this.indexTypeValue = IndexType.SCALE;
    this.snapTypeValue = SnapType.NONE;
    this.snapMetricsValue = SnapMetrics.ROUND;
    this.verticalRelativeTypeValue = VerticalRelativeType.CHORD_ROOT;
    this.horizontalRelativeTypeValue = HorizontalRelativeType.NEXT_NOTE;
    this.indexBorderModeValue = IndexBorderMode.RESTART;
    this.offsetTypeValue = OffsetType.SCALE;
    this.countUnitValue = CountUnit.PLAIN;
    this.predefinedCurveTypeValue = PredefinedCurveType.CONSTANT;
    this._constructorName = "SimpleEnumEditorVariable"
}
SimpleEnumEditorVariable.prototype = new EditorFunctionOrVariable();
SimpleEnumEditorVariable.prototype.getValue = function (a) {
    switch (this.enumType) {
        case EnumType.CHORD_TYPE:
            return this.chordTypeValue;
        case EnumType.COUNT_UNIT:
            return this.countUnitValue;
        case EnumType.HORIZONTAL_RELATIVE_TYPE:
            return this.horizontalRelativeTypeValue;
        case EnumType.INDEX_BORDER_MODE:
            return this.indexBorderModeValue;
        case EnumType.INDEX_TYPE:
            return this.indexTypeValue;
        case EnumType.OFFSET_TYPE:
            return this.offsetTypeValue;
        case EnumType.POSITION_UNIT:
            return this.positionUnitValue;
        case EnumType.PREDEFINED_CURVE_TYPE:
            return this.predefinedCurveTypeValue;
        case EnumType.SCALE_TYPE:
            return this.scaleTypeValue;
        case EnumType.SNAP_METRICS:
            return this.snapMetricsValue;
        case EnumType.SNAP_TYPE:
            return this.snapTypeValue;
        case EnumType.VERTICAL_RELATIVE_TYPE:
            return this.verticalRelativeTypeValue
    }
    return 0
};

function BooleanEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "BooleanEditorVariable"
}
BooleanEditorVariable.prototype = new EditorFunctionOrVariable();

function SimpleBooleanEditorVariable() {
    BooleanEditorVariable.call(this);
    this.value = false;
    this._constructorName = "SimpleBooleanEditorVariable"
}
SimpleBooleanEditorVariable.prototype = new BooleanEditorVariable();
SimpleBooleanEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function ObjectEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "ObjectEditorVariable"
}
ObjectEditorVariable.prototype = new EditorFunctionOrVariable();

function SimpleObjectEditorVariable() {
    ObjectEditorVariable.call(this);
    this.value = {};
    this._constructorName = "SimpleObjectEditorVariable"
}
SimpleObjectEditorVariable.prototype = new ObjectEditorVariable();
SimpleObjectEditorVariable.prototype.getValue = function (a) {
    return getValueOrExpressionValue(this, "value", a)
};

function StringEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "StringEditorVariable"
}
StringEditorVariable.prototype = new EditorFunctionOrVariable();

function SimpleStringEditorVariable() {
    StringEditorVariable.call(this);
    this.value = "";
    this._constructorName = "SimpleStringEditorVariable"
}
SimpleStringEditorVariable.prototype = new StringEditorVariable();
SimpleStringEditorVariable.prototype.getValue = function (a) {
    return this.value
};
var EditorIdReferenceType = {
    STRUCTURE: 0,
    SECTION: 1,
    HARMONY: 2,
    MOTIF: 3,
    PERCUSSION_MOTIF: 4,
    RYTHM: 5,
    CURVE: 6,
    RENDER_CHANNEL: 7,
    CONTROL_CHANNEL: 8,
    NAMED_NOTE: 9
};


function IdReferenceEditorVariable() {
    StringEditorVariable.call(this);
    this.referenceType = EditorIdReferenceType.HARMONY;
    this.structure = "";
    this.section = "";
    this.harmony = "";
    this.motif = "";
    this.percussionMotif = "";
    this.rythm = "";
    this.curve = "";
    this.renderChannel = "";
    this.controlChannel = "";
    this.namedNote = "";
    this._constructorName = "IdReferenceEditorVariable"
}
IdReferenceEditorVariable.prototype = new StringEditorVariable();
IdReferenceEditorVariable.prototype.getValue = function (a) {
    switch (this.referenceType) {
        case EditorIdReferenceType.CONTROL_CHANNEL:
            return this.controlChannel;
        case EditorIdReferenceType.CURVE:
            return this.curve;
        case EditorIdReferenceType.HARMONY:
            return this.harmony;
        case EditorIdReferenceType.MOTIF:
            return this.motif;
        case EditorIdReferenceType.NAMED_NOTE:
            return this.namedNote;
        case EditorIdReferenceType.PERCUSSION_MOTIF:
            return this.percussionMotif;
        case EditorIdReferenceType.RENDER_CHANNEL:
            return this.renderChannel;
        case EditorIdReferenceType.RYTHM:
            return this.rythm;
        case EditorIdReferenceType.SECTION:
            return this.section;
        case EditorIdReferenceType.STRUCTURE:
            return this.structure
    }
    return ""
};

function DoubleEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "DoubleEditorVariable"
}
DoubleEditorVariable.prototype = new EditorFunctionOrVariable();

function SimpleDoubleEditorVariable() {
    DoubleEditorVariable.call(this);
    this.value = 0;
    this._constructorName = "SimpleDoubleEditorVariable"
}
SimpleDoubleEditorVariable.prototype = new DoubleEditorVariable();
SimpleDoubleEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function IntegerEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerEditorVariable"
}
IntegerEditorVariable.prototype = new EditorFunctionOrVariable();

function SimpleIntegerEditorVariable() {
    IntegerEditorVariable.call(this);
    this.value = 0;
    this._constructorName = "SimpleIntegerEditorVariable"
}
SimpleIntegerEditorVariable.prototype = new IntegerEditorVariable();
SimpleIntegerEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function DoubleArrayEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "DoubleArrayEditorVariable"
}
DoubleArrayEditorVariable.prototype = new EditorFunctionOrVariable();
DoubleArrayEditorVariable.prototype.getValue = function (a) {
    return []
};

function SimpleDoubleArrayEditorVariable() {
    DoubleArrayEditorVariable.call(this);
    this.value = [];
    this._constructorName = "SimpleDoubleArrayEditorVariable"
}
SimpleDoubleArrayEditorVariable.prototype = new DoubleArrayEditorVariable();
SimpleDoubleArrayEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function IntegerArrayEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerArrayEditorVariable"
}
IntegerArrayEditorVariable.prototype = new EditorFunctionOrVariable();
IntegerArrayEditorVariable.prototype.getValue = function (a) {
    return []
};

function IntegerArray2DEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerArray2DEditorVariable"
}
IntegerArray2DEditorVariable.prototype = new EditorFunctionOrVariable();
IntegerArray2DEditorVariable.prototype.getValue = function (a) {
    return []
};

function SimpleIntegerArray2DEditorVariable() {
    IntegerArray2DEditorVariable.call(this);
    this.value = [];
    this._constructorName = "SimpleIntegerArray2DEditorVariable"
}
SimpleIntegerArray2DEditorVariable.prototype = new IntegerArray2DEditorVariable();
SimpleIntegerArray2DEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function SimpleRandomIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.seed = 12345;
    this.count = 10;
    this.domain = [0, 1];
    this.domainLikelihoods = [1];
    this._constructorName = "SimpleRandomIntegerArrayEditorVariable"
}
SimpleRandomIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();
SimpleRandomIntegerArrayEditorVariable.prototype.getValue = function (a, c) {
    var l = getValueOrDefault(c, "seed", this.seed);
    var k = getValueOrDefault(c, "count", this.count);
    var b = new MersenneTwister(l);
    var h = this.domainLikelihoods;
    if (h.length == 0) {
        h = [1]
    }
    var j = this.domain;
    if (j.length == 0) {
        j = [0]
    }
    var g = getProbabilityDistribution(createFilledPatternArray(k, h));
    var m = [];
    for (var e = 0; e < k; e++) {
        var f = sampleIndexIntegerDistribution(b, g);
        var d = j[f % j.length];
        m.push(d)
    }
    return m
};

function MarkovRandomIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.seed = 12345;
    this.count = 10;
    this.startStates = [0, 1];
    this.startStateLikelihoods = [1, 1];
    this.stateDomains = [
        [0],
        [1]
    ];
    this.stateDomainLikelihoods = [
        [1],
        [1]
    ];
    this.stateTransitionLikelihoods = [
        [1, 1],
        [1, 1]
    ];
    this._constructorName = "MarkovRandomIntegerArrayEditorVariable"
}
MarkovRandomIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();
MarkovRandomIntegerArrayEditorVariable.prototype.getValue = function (b, s) {
    var a = getValueOrDefault(s, "seed", this.seed);
    var m = getValueOrDefault(s, "count", this.count);
    var j = new MersenneTwister(a);
    var u = this.startStates;
    if (u.length == 0) {
        u = [0]
    }
    var g = this.startStateLikelihoods;
    if (g.length == 0) {
        g = [1]
    }
    var r = this.stateDomains;
    if (r.length == 0) {
        r = [
            [0]
        ]
    }
    for (var p = 0; p < r.length; p++) {
        var q = r[p];
        if (q.length == 0) {
            r[p] = [0]
        }
    }
    var f = [];
    for (var p = 0; p < this.stateDomainLikelihoods.length; p++) {
        var d = this.stateDomainLikelihoods[p];
        var n = getProbabilityDistribution(d);
        f[p] = n
    }
    var h = [];
    for (var p = 0; p < this.stateTransitionLikelihoods.length; p++) {
        var d = this.stateTransitionLikelihoods[p];
        var n = getProbabilityDistribution(d);
        h[p] = n
    }
    var o = getProbabilityDistribution(createFilledPatternArray(u.length, this.startStateLikelihoods));
    var v = sampleIndexIntegerDistribution(j, o);
    var k = [];
    for (var p = 0; p < m; p++) {
        var w = r[v % r.length];
        var l = f[v % f.length];
        var e = sampleIndexIntegerDistribution(j, l);
        var c = w[e % w.length];
        k.push(c);
        var t = h[v % h.length];
        v = sampleIndexIntegerDistribution(j, t)
    }
    return k
};

function SimpleIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.value = [];
    this._constructorName = "SimpleIntegerArrayEditorVariable"
}
SimpleIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();
SimpleIntegerArrayEditorVariable.prototype.getValue = function (a) {
    return this.value
};

function PatternIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.count = 0;
    this.elements = [];
    this.startElements = [];
    this.endElements = [];
    this._constructorName = "PatternIntegerArrayEditorVariable"
}
PatternIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();
PatternIntegerArrayEditorVariable.prototype.getValue = function (c) {
    var a = [];
    for (var b = 0; b < this.count; b++) {
        var d = getItemFromArrayWithStartEndItems(0, this.elements, this.count, b, this.startElements, this.endElements);
        a.push(d)
    }
    return a
};

function PatternDoubleArrayEditorVariable() {
    DoubleArrayEditorVariable.call(this);
    this.count = 0;
    this.elements = [];
    this.startElements = [];
    this.endElements = [];
    this._constructorName = "PatternDoubleArrayEditorVariable"
}
PatternDoubleArrayEditorVariable.prototype = new DoubleArrayEditorVariable();
PatternDoubleArrayEditorVariable.prototype.getValue = function (c) {
    var a = [];
    for (var b = 0; b < this.count; b++) {
        var d = getItemFromArrayWithStartEndItems(0, this.elements, this.count, b, this.startElements, this.endElements);
        a.push(d)
    }
    return a
};
var SoundFontType = {
    STANDARD_LIGHT: 0,
    STANDARD_HEAVY: 1,
    SNES_STYLE: 2,
    GXSCC_STYLE: 3
};

function DfsSearchNode(b, a, c) {
    this.state = b;
    this.previous = a;
    this.next = null;
    this.depth = c;
    this.totalCost = 0
}

function RandomDfsStateIterator(d, c, a, b) {
    this.elements = d;
    this.likelihoods = c;
    this.rnd = a;
    if (b) {
        this.stepCosts = b(this.likelihoods)
    } else {
        this.stepCosts = this.getStepCosts(c)
    }
}
RandomDfsStateIterator.prototype.getStepCosts = function (c) {
    var d = [];
    for (var b = 0; b < c.length; b++) {
        var a = c[b];
        d[b] = a > 0 ? -Math.log(a) : 99999999999
    }
    return d
};
RandomDfsStateIterator.prototype.hasNext = function () {
    return this.elements.length > 0
};
RandomDfsStateIterator.prototype.next = function () {
    var a = null;
    if (this.elements.length > 0) {
        var c = getProbabilityDistribution(this.likelihoods);
        var b = sampleIndexIntegerDistribution(this.rnd, c);
        a = this.elements[b];
        a.stepCost = this.stepCosts[b];
        this.elements.splice(b, 1);
        this.likelihoods.splice(b, 1);
        this.stepCosts.splice(b, 1)
    } else {
        if (this.elements.length == 1) {
            a = this.elements[0];
            a.stepCost = this.stepCosts[0];
            this.elements.length = 0
        } else {
            console.log("Can not get next from iterator. empty")
        }
    }
    if (a.stepCost < 0) {
        console.log(" stepcost less than 0...")
    }
    return a
};

function RandomDfsStateIterator2(d, c, b, a) {
    this.elements = d;
    this.likelihoods = c;
    this.rnd = a;
    this.stepCosts = b
}
RandomDfsStateIterator2.prototype.hasNext = function () {
    return this.elements.length > 0
};
RandomDfsStateIterator2.prototype.next = function () {
    if (this.elements.length > 0) {
        var c = getProbabilityDistribution(this.likelihoods);
        var b = sampleIndexIntegerDistribution(this.rnd, c);
        a = this.elements[b];
        a.stepCost = this.stepCosts[b];
        this.elements.splice(b, 1);
        this.likelihoods.splice(b, 1);
        this.stepCosts.splice(b, 1);
        return a
    } else {
        if (this.elements.length == 1) {
            var a = this.elements[0];
            a.stepCost = this.stepCosts[0];
            this.elements.length = 0;
            return a
        } else {
            console.log("Can not get next from iterator. empty");
            return null
        }
    }
};

function SimpleDfsStateIterator(a) {
    this.elements = a
}
SimpleDfsStateIterator.prototype.hasNext = function () {
    return this.elements.length > 0
};
SimpleDfsStateIterator.prototype.next = function () {
    if (this.elements.length > 0) {
        var a = this.shift();
        return a
    } else {
        console.log("Can not get next from iterator. empty");
        return null
    }
};

function DfsSolver(a) {
    this.maxMLSolutions = getValueOrDefault(a, "maxMLSolutions", 10);
    this.maxSearchSteps = getValueOrDefault(a, "maxSearchSteps", 1000);
    this.steps = 0;
    this.mlSolutions = 0;
    this._constructorName = "DfsSolver"
}
DfsSolver.prototype.extractStateResultData = function (a) {
    console.log("DfsSolver need to implement extractStateResultData()")
};
DfsSolver.prototype.getStartStateIterator = function () {
    console.log("DfsSolver need to implement getStartStateIterator()<br />")
};
DfsSolver.prototype.isGoalState = function (a) {
    console.log("DfsSolver need to implement isGoalState()<br />");
    return true
};
DfsSolver.prototype.isInvalidState = function (a) {
    console.log("DfsSolver need to implement isInvalidState()<br />");
    return false
};
DfsSolver.prototype.getSuccessorIterator = function (a) {
    console.log("DfsSolver need to implement getSuccessorIterator()<br />")
};
DfsSolver.prototype.isGoalNode = function (a) {
    console.log("DfsSolver need to implement isGoalNode()<br />")
};
DfsSolver.prototype.isMaxDepth = function (a) {
    return false
};
DfsSolver.prototype.searchRecursive = function (d) {
    if (this.isGoalNode(d)) {
        return d
    } else {
        if (this.isMaxDepth(d)) {
            return null
        }
    }
    if (this.isInvalidState(d.state)) {
        return null
    }
    var c = this.getSuccessorIterator(d);
    while (c.hasNext()) {
        this.steps++;
        if (this.steps > this.maxSearchSteps) {
            this.failReason = "Unable to find a solution within " + this.maxSearchSteps + " search steps";
            return null
        }
        var b = c.next();
        var a = new DfsSearchNode(b, d, d.depth + 1);
        if (this.searchRecursive(a)) {
            d.next = a;
            return d
        }
    }
    this.failReason = "Unable to find a solution";
    return null
};
DfsSolver.prototype.search = function () {
    this.prepareBeforeSearch();
    if (this.seed && this.setSeed) {
        this.setSeed(this.seed)
    }
    this.steps = 0;
    var d = this.getStartStateIterator();
    while (d.hasNext()) {
        var c = d.next();
        var e = new DfsSearchNode(c, null, 0);
        var b = this.searchRecursive(e);
        if (b) {
            var a = [];
            var f = b;
            do {
                a.push(this.extractStateResultData(f.state));
                f = f.next
            } while (f);
            return a
        }
    }
    return null
};
DfsSolver.prototype.searchMLRecursive = function (c) {
    if (this.isGoalNode(c)) {
        if (c.totalCost < 0.999999 * this.bestSolutionCost) {
            this.bestSolutionCost = Math.min(c.totalCost, this.bestSolutionCost);
            this.mlSolutions++;
            return c
        } else {
            return null
        }
    } else {
        if (this.isMaxDepth(c)) {
            return null
        }
    }
    if (this.isInvalidState(c.state)) {
        return null
    }
    var e = Number.MAX_VALUE;
    var h = null;
    var f = this.getSuccessorIterator(c);
    while (f.hasNext()) {
        this.steps++;
        if (this.steps > this.maxSearchSteps) {
            if (this.mlSolutions == 0) {
                this.failReason = "Unable to find a solution within " + this.maxSearchSteps + " search steps"
            }
            return h
        }
        var d = f.next();
        var b = d.stepCost;
        var a = b + c.totalCost;
        if (a < this.bestSolutionCost) {
            var g = new DfsSearchNode(d, c, c.depth + 1);
            g.totalCost = a;
            var j = this.searchMLRecursive(g);
            if (j) {
                c.next = g;
                h = j
            }
        } else { }
        if (this.mlSolutions >= this.maxMLSolutions) {
            break
        }
    }
    return h
};
DfsSolver.prototype.prepareBeforeSearch = function () { };
DfsSolver.prototype.searchDone = function () { };
DfsSolver.prototype.searchML = function () {
    this.prepareBeforeSearch();
    this.bestSolutionCost = Number.MAX_VALUE;
    if (this.seed && this.setSeed) {
        this.setSeed(this.seed)
    }
    var f = null;
    this.steps = 0;
    var d = this.getStartStateIterator();
    while (d.hasNext()) {
        var c = d.next();
        var e = new DfsSearchNode(c, null, 0);
        e.totalCost = c.stepCost;
        var a = this.searchMLRecursive(e);
        if (a) {
            f = this.extractSolutionFromMLGoalNode(a);
            var b = this.extractStatesFromMLGoalNode(a)
        }
        if (this.mlSolutions >= this.maxMLSolutions) {
            break
        }
    }
    this.searchDone();
    if (f != null) {
        return f
    }
    console.log("Failed to find a solution in DfsSolver " + this.failReason + "<br />");
    return null
};
DfsSolver.prototype.extractSolutionFromMLGoalNode = function (b) {
    var a = [];
    var c = b;
    while (c.previous) {
        c = c.previous
    }
    while (c) {
        a.push(this.extractStateResultData(c.state));
        c = c.next
    }
    return a
};
DfsSolver.prototype.extractStatesFromMLGoalNode = function (b) {
    var a = [];
    var c = b;
    while (c.previous) {
        c = c.previous
    }
    while (c) {
        a.push(c.state);
        c = c.next
    }
    return a
};
var ControlChannelDatatype = {
    DOUBLE: 0,
    INTEGER: 1,
    BOOLEAN: 2
};


function SlotData(c, a, b) {
    this.values = [];
    this.values.length = c;
    this.slots = c;
    this.defaultValue = a;
    this.dataType = b
}
SlotData.prototype.write = function (b, a) {
    if (this.slotInRange(b)) {
        this.values[b] = a
    }
};
SlotData.prototype.slotInRange = function (a) {
    return a >= 0 && a < this.slots
};
SlotData.prototype.slotDefined = function (a) {
    return !(typeof (this.values[a]) === "undefined")
};
SlotData.prototype.read = function (a) {
    if (this.slotDefined(a)) {
        return this.values[a]
    } else {
        return this.defaultValue
    }
};
var ControlChannelControlWriteMode = {
    NONE: 0,
    SET_CONTROL: 1
};

function ControlChannel() {
    this.id = "";
    this.active = true;
    this.slotsPerBeat = 16;
    this.mixWithDefault = false;
    this.controlWriteMode = ControlChannelControlWriteMode.NONE;
    this.dataType = ControlChannelDatatype.DOUBLE;
    this._constructorName = "ControlChannel"
}
ControlChannel.prototype.getControlEvents = function (g, k, b) {
    var l = [];
    var c = getValueOrExpressionValue(this, "active", b);
    if (this.controlWriteMode != ControlChannelControlWriteMode.NONE && c) {
        var a = 0;
        var f = 1 / this.slotsPerBeat;
        for (var e = 0; e < g.values.length; e++) {
            var j = g.values[e];
            if (typeof (j) === "undefined") {
                j = this.defaultValue
            }
            if (e == 0 || j != a) {
                var d = k + e * f;
                var h = new SetControlEvent(j, d, this);
                l.push(h)
            }
            a = j
        }
    }
    return l
};
ControlChannel.prototype.createSlotData = function (b) {
    var a = new SlotData(Math.round(b * this.slotsPerBeat), this.defaultValue, this.dataType);
    return a
};
ControlChannel.prototype.writeInt = function (c, b, a) {
    console.log("-- All control channels must implement writeInt()")
};
ControlChannel.prototype.writeDouble = function (c, a, b) {
    console.log("-- All control channels must implement writeDouble()")
};
ControlChannel.prototype.writeBoolean = function (c, a, b) {
    console.log("-- All control channels must implement writeBoolean()")
};
ControlChannel.prototype.readInt = function (b, a) {
    console.log("-- All control channels must implement readInt()")
};
ControlChannel.prototype.readDouble = function (b, a) {
    console.log("-- All control channels must implement readDouble()")
};
ControlChannel.prototype.readBoolean = function (b, a) {
    console.log("-- All control channels must implement readBoolean()")
};
var NumericControlChannelMixMode = {
    ADD: 0,
    MULT: 1,
    MIN: 2,
    MAX: 3,
    MEAN: 4,
    OVERWRITE_FIRST: 5,
    OVERWRITE_LAST: 6,
    mix: function (b, a, c) {
        switch (b) {
            case NumericControlChannelMixMode.ADD:
                return a + c;
            case NumericControlChannelMixMode.MAX:
                return Math.max(a, c);
            case NumericControlChannelMixMode.MEAN:
                return (a + c) / 2;
            case NumericControlChannelMixMode.MIN:
                return Math.min(a, c);
            case NumericControlChannelMixMode.MULT:
                return a * c;
            case NumericControlChannelMixMode.OVERWRITE_FIRST:
                return a;
            case NumericControlChannelMixMode.OVERWRITE_LAST:
                return c
        }
        return a + c
    }
};


function DoubleControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = 0;
    this.useRange = false;
    this.range = [-1, 1];
    this.mixMode = NumericControlChannelMixMode.ADD;
    this.trueWriteValue = 1;
    this.falseWriteValue = 0;
    this.readIntSnapMetrics = SnapMetrics.ROUND;
    this.dataType = ControlChannelDatatype.DOUBLE;
    this._constructorName = "DoubleControlChannel"
}
DoubleControlChannel.prototype = new ControlChannel();
DoubleControlChannel.prototype.writeDouble = function (f, d, e) {
    if (d.slotInRange(f)) {
        if (d.slotDefined(f) || this.mixWithDefault) {
            var a = d.read(f);
            var c = NumericControlChannelMixMode.mix(this.mixMode, a, e);
            var b = this.useRange ? clamp(c, this.range[0], this.range[1]) : c;
            d.write(f, b)
        } else {
            var b = this.useRange ? clamp(e, this.range[0], this.range[1]) : e;
            d.write(f, b)
        }
    }
};
DoubleControlChannel.prototype.readDouble = function (b, a) {
    if (a && a.slotDefined(b)) {
        return a.read(b)
    } else {
        return this.defaultValue
    }
};

function IntegerControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = 0;
    this.mixSnapMetrics = SnapMetrics.ROUND;
    this.useRange = false;
    this.range = [-1, 1];
    this.mixMode = NumericControlChannelMixMode.ADD;
    this.trueWriteValue = 1;
    this.falseWriteValue = 0;
    this.dataType = ControlChannelDatatype.INTEGER;
    this._constructorName = "IntegerControlChannel"
}
IntegerControlChannel.prototype = new ControlChannel();
IntegerControlChannel.prototype.writeInt = function (g, e, d) {
    if (e.slotInRange(g)) {
        if (e.slotDefined(g) || this.mixWithDefault) {
            var a = e.read(g);
            var b = NumericControlChannelMixMode.mix(this.mixMode, a, d);
            var f = SnapMetrics.snap(b, this.mixSnapMetrics);
            var c = this.useRange ? clamp(f, this.range[0], this.range[1]) : f;
            e.write(g, c)
        } else {
            var c = this.useRange ? clamp(d, this.range[0], this.range[1]) : d;
            e.write(g, c)
        }
    }
};
var BooleanControlChannelMixMode = {
    OR: 0,
    AND: 1,
    NOR: 2,
    NAND: 3,
    XOR: 4,
    OVERWRITE_FIRST: 5,
    OVERWRITE_LAST: 6,
    mix: function (b, a, c) {
        switch (b) {
            case BooleanControlChannelMixMode.OR:
                return a || c;
            case BooleanControlChannelMixMode.AND:
                return a && c;
            case BooleanControlChannelMixMode.NOR:
                return !(a || c);
            case BooleanControlChannelMixMode.NAND:
                return !(a && c);
            case BooleanControlChannelMixMode.XOR:
                return (a || c) && !(a && c);
            case BooleanControlChannelMixMode.OVERWRITE_FIRST:
                return a;
            case BooleanControlChannelMixMode.OVERWRITE_LAST:
                return c
        }
        return a || c
    }
};


function BooleanControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = false;
    this.doubleWriteThreshold = 0.5;
    this.intWriteThreshold = 1;
    this.mixMode = BooleanControlChannelMixMode.OR;
    this.trueReadIntValue = 1;
    this.falseReadIntValue = 0;
    this.trueReadDoubleValue = 1;
    this.falseReadDoubleValue = 0;
    this.dataType = ControlChannelDatatype.BOOLEAN;
    this._constructorName = "BooleanControlChannel"
}
BooleanControlChannel.prototype = new ControlChannel();
BooleanControlChannel.prototype.writeBoolean = function (e, c, d) {
    if (c.slotInRange(e)) {
        if (c.slotDefined(e) || this.mixWithDefault) {
            var a = c.read(e);
            var b = BooleanControlChannelMixMode.mix(this.mixMode, a, d);
            c.write(e, b)
        } else {
            c.write(e, d)
        }
    }
};

function RenderChannel() {
    this.id = "";
    this.percussion = false;
    this._constructorName = "RenderChannel"
}

function NamedNote() {
    this.id = "";
    this._constructorName = "NamedNote"
}
NamedNote.prototype.getNote = function () {
    return 60
};
NamedNote.prototype.setId = function (a) {
    this.id = a;
    return this
};

function SimpleNamedNote() {
    NamedNote.call(this);
    this.note = 60;
    this._constructorName = "SimpleNamedNote"
}
SimpleNamedNote.prototype = new NamedNote();
SimpleNamedNote.prototype.getNote = function () {
    return this.note
};
SimpleNamedNote.prototype.setNote = function (a) {
    this.note = a;
    return this
};

function MidiDrumNamedNote() {
    NamedNote.call(this);
    this.note = MidiDrum.BASS_DRUM_1;
    this._constructorName = "MidiDrumNamedNote"
}
MidiDrumNamedNote.prototype = new NamedNote();
MidiDrumNamedNote.prototype.getNote = function () {
    return this.note
};
MidiDrumNamedNote.prototype.setNote = function (a) {
    this.note = a;
    return this
};

function Curve() {
    this.id = "";
    this.evaluateExpressions = true;
    this._constructorName = "Curve"
}
Curve.prototype.setId = function (a) {
    this.id = a;
    return this
};
Curve.prototype.getValue = function (b, a) {
    return 0
};
var PredefinedCurveType = {
    LINEAR: 0,
    EXP: 1,
    QUADRATIC: 2,
    CONSTANT: 3,
    SINE: 4,
    COSINE: 5,
    TRIANGLE: 6,
    SAW: 7,
    SQUARE: 8,
    WHITE_NOISE: 9,
    CONSTANT_NOISE: 10,
    LINEAR_NOISE: 11,
    QUADRATIC_NOISE: 12,
    CUBIC_NOISE: 13,
    PERLIN_NOISE: 14
};


function PredefinedCurve() {
    Curve.call(this);
    this.amplitude = 1;
    this.frequency = 1;
    this.phase = 0;
    this.bias = 0;
    this.clampUpper = false;
    this.upperClamp = 1;
    this.clampLower = false;
    this.lowerClamp = -1;
    this.seed = 12345;
    this.oldSeed = this.seed;
    this.type = PredefinedCurveType.CONSTANT;
    this.oldType = this.type;
    this.data = null;
    this._constructorName = "PredefinedCurve"
}
PredefinedCurve.prototype = new Curve();
PredefinedCurve.prototype.setAmplitude = function (b) {
    this.amplitude = b;
    return this
};
PredefinedCurve.prototype.setBias = function (b) {
    this.bias = b;
    return this
};
PredefinedCurve.prototype.setFrequency = function (b) {
    this.frequency = b;
    return this
};
PredefinedCurve.prototype.setType = function (b) {
    this.type = b;
    return this
};
PredefinedCurve.prototype.setSeed = function (b) {
    this.seed = b;
    return this
};
PredefinedCurve.prototype.getValue = function (d, a) {
    var g = getValueOrExpressionValue(this, "type", d);
    var f = getValueOrExpressionValue(this, "amplitude", d);
    var b = getValueOrExpressionValue(this, "frequency", d);
    var c = getValueOrExpressionValue(this, "phase", d);
    var e = getValueOrExpressionValue(this, "seed", d);
    return this.getPredefinedValue(a, g, f, b, c, e)
};
PredefinedCurve.prototype.checkSeedOrTypeChange = function (a, b) {
    if (this.oldSeed != a || b != this.oldType) {
        this.oldSeed = a;
        this.oldType = b;
        return true
    }
    return false
};
PredefinedCurve.prototype.getPredefinedValue = function (b, g, f, h, d, c) {
    var a = 0;
    switch (g) {
        case PredefinedCurveType.CONSTANT:
            a = f;
            break;
        case PredefinedCurveType.SINE:
            a = f * Math.sin(Math.PI * 2 * h * (b - d));
            break;
        case PredefinedCurveType.COSINE:
            a = f * Math.cos(Math.PI * 2 * h * (b - d));
            break;
        case PredefinedCurveType.WHITE_NOISE:
            a = f * (2 * Math.random() - 1);
            break;
        case PredefinedCurveType.CONSTANT_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(c, g)) {
                this.data = new LatticeNoise(new MersenneTwister(c))
            }
            a = f * this.data.whiteNoise1((b - d) * h);
            break;
        case PredefinedCurveType.LINEAR_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(c, g)) {
                this.data = new LatticeNoise(new MersenneTwister(c))
            }
            a = f * this.data.lerpNoise1((b - d) * h);
            break;
        case PredefinedCurveType.QUADRATIC_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(c, g)) {
                this.data = new LatticeNoise(new MersenneTwister(c))
            }
            a = f * this.data.quadraticNoise1((b - d) * h);
            break;
        case PredefinedCurveType.CUBIC_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(c, g)) {
                this.data = new LatticeNoise(new MersenneTwister(c))
            }
            a = f * this.data.cubicNoise1((b - d) * h);
            break;
        case PredefinedCurveType.PERLIN_NOISE:
            break;
        case PredefinedCurveType.LINEAR:
            a = f * (b - d) * h;
            break;
        case PredefinedCurveType.QUADRATIC:
            a = f * (b - d) * (b - d) * h;
            break;
        case PredefinedCurveType.EXP:
            a = f * Math.exp((b - d) * h);
            break;
        case PredefinedCurveType.SAW:
            a = f * (2 * mod((b - d) * h, 1) - 1);
            break;
        case PredefinedCurveType.SQUARE:
            var e = mod((b - d) * h, 1);
            if (e < 0.5) {
                a = f
            } else {
                a = -f
            }
            break;
        case PredefinedCurveType.TRIANGLE:
            var e = mod((b - d) * h, 1);
            if (e < 0.5) {
                a = f * (4 * e - 1)
            } else {
                a = f * (3 - 4 * e)
            }
            break
    }
    a += this.bias;
    if (this.clampUpper) {
        a = Math.min(this.upperClamp, a)
    }
    if (this.clampLower) {
        a = Math.max(this.lowerClamp, a)
    }
    return a
};

function LinearInterpolationCurve() {
    Curve.call(this);
    this.xValues = [0, 1];
    this.yValues = [0, 1];
    this.oldXValues = [];
    this.oldYValues = [];
    this.interpolator = null;
    this._constructorName = "LinearInterpolationCurve"
}
LinearInterpolationCurve.prototype = new Curve();
LinearInterpolationCurve.prototype.getValue = function (e, a) {
    var b = this.interpolator == null;
    var f = this.xValues;
    var c = this.yValues;
    if (this.evaluateExpressions) {
        f = getValueOrExpressionValue(this, "xValues", e);
        c = getValueOrExpressionValue(this, "yValues", e)
    }
    if (f.length != this.oldXValues.length || c.length != this.oldYValues.length) {
        b = true
    } else {
        for (var d = 0; d < f.length; d++) {
            if (f[d] != this.oldXValues[d]) {
                b = true;
                break
            }
        }
    }
    if (b) {
        if (f.length < 2) {
            f = [0, 1]
        }
        if (c.length < 2) {
            c = [0, 1]
        }
        if (f.length != c.length) {
            c.length = f.length
        }
        this.interpolator = new LinearInterpolator(f, c);
        this.oldXValues = copyValueDeep(f);
        this.oldYValues = copyValueDeep(c)
    }
    return this.interpolator.interpolate(a)
};

function ExpressionCurve() {
    Curve.call(this);
    this.valueExpression = "0.0";
    this.inputVariableName = "x";
    this._constructorName = "ExpressionCurve"
}
ExpressionCurve.prototype = new Curve();
ExpressionCurve.prototype.getValue = function (c, b) {
    var d = {};
    d[this.inputVariableName] = b;
    var a = getExpressionValue(this.valueExpression, c, d);
    return a
};

function ComputationCurve() {
    Curve.call(this);
    this.computation = new DelayCurveComputation();
    this._constructorName = "ComputationCurve"
}
ComputationCurve.prototype = new Curve();
ComputationCurve.prototype.getValue = function (b, a) {
    return this.computation.getValue(b, a)
};

function CurveComputation() {
    this.id = "";
    this.evaluateExpressions = true;
    this._constructorName = "CurveComputation"
}
CurveComputation.prototype.getValue = function (b, a) {
    return 0
};
CurveComputation.prototype.getCurveOrConstantValue = function (c, b, d, a) {
    if (d) {
        return d.getValue(c, b)
    } else {
        return a
    }
};
CurveComputation.prototype.getCurveReference = function (b, c, a) {
    if (a) {
        if (!c || (c.id != a)) {
            return b.getCurve(a)
        } else {
            return c
        }
    } else {
        return null
    }
};

function DelayCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.delayConstant = 0;
    this.delayCurve = "";
    this.theInputCurve = null;
    this.theDelayCurve = null;
    this._constructorName = "DelayCurveComputation"
}
DelayCurveComputation.prototype = new CurveComputation();
DelayCurveComputation.prototype.getValue = function (c, a) {
    this.theInputCurve = this.getCurveReference(c, this.theInputCurve, this.inputCurve);
    this.theDelayCurve = this.getCurveReference(c, this.theDelayCurve, this.delayCurve);
    var b = this.getCurveOrConstantValue(c, a, this.theDelayCurve, this.delayConstant);
    return this.getCurveOrConstantValue(c, a + b, this.theInputCurve, 0)
};

function AbsCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.theInputCurve = null;
    this._constructorName = "AbsCurveComputation"
}
AbsCurveComputation.prototype = new CurveComputation();
AbsCurveComputation.prototype.getValue = function (b, a) {
    this.theInputCurve = this.getCurveReference(b, this.theInputCurve, this.inputCurve);
    return Math.abs(this.getCurveOrConstantValue(b, a, this.theInputCurve, 0))
};

function RemapCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.remapCurve = "";
    this.fromInterval = [0, 1];
    this.toInterval = [0, 1];
    this.clampResult = false;
    this.theInputCurve = null;
    this.remapCurve = null;
    this._constructorName = "RemapCurveComputation"
}
RemapCurveComputation.prototype = new CurveComputation();
RemapCurveComputation.prototype.getValue = function (e, c) {
    this.theInputCurve = this.getCurveReference(e, this.theInputCurve, this.inputCurve);
    this.theRemapCurve = this.getCurveReference(e, this.theRemapCurve, this.remapCurve);
    var b = this.getCurveOrConstantValue(e, c, this.theInputCurve, 0);
    var d = this.fromInterval[1] - this.fromInterval[0];
    var f = this.fromInterval[1] - this.fromInterval[0];
    var g = (b - this.fromInterval[0]) / d;
    var h = this.getCurveOrConstantValue(e, g, this.theRemapCurve, g);
    var a = this.toInterval[0] + f * h;
    if (this.clampResult) {
        return Math.clamp(a, this.toInterval[0], this.toInterval[1])
    } else {
        return a
    }
};

function ClampCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.upperCurve = "";
    this.lowerCurve = "";
    this.upperLimit = 1;
    this.lowerLimit = -1;
    this.theInputCurve = null;
    this.theUpperCurve = null;
    this.theLowerCurve = null;
    this._constructorName = "ClampCurveComputation"
}
ClampCurveComputation.prototype = new CurveComputation();
ClampCurveComputation.prototype.getValue = function (c, a) {
    this.theInputCurve = this.getCurveReference(c, this.theInputCurve, this.inputCurve);
    this.theUpperCurve = this.getCurveReference(c, this.theUpperCurve, this.upperCurve);
    this.theLowerCurve = this.getCurveReference(c, this.theLowerCurve, this.lowerCurve);
    var d = this.getCurveOrConstantValue(c, a, this.theUpperCurve, this.upperLimit);
    var b = this.getCurveOrConstantValue(c, a, this.theLowerCurve, this.lowerLimit);
    return clamp(this.getCurveOrConstantValue(c, a, this.theInputCurve, 0), b, d)
};

function MirrorCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.mirrorX = 0;
    this.theInputCurve = null;
    this._constructorName = "MirrorCurveComputation"
}
MirrorCurveComputation.prototype = new CurveComputation();
MirrorCurveComputation.prototype.getValue = function (b, a) {
    this.theInputCurve = this.getCurveReference(b, this.theInputCurve, this.inputCurve);
    if (a > this.mirrorX) {
        a = 2 * this.mirrorX - a
    }
    return this.getCurveOrConstantValue(b, a, this.theInputCurve, 0)
};
var Mix1DType = {
    FUBAR: 0
};

function MixCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve1 = "";
    this.inputCurve2 = "";
    this.mixConstant = 0.5;
    this.mixCurve = "";
    this.mixType = Mix1DType.FUBAR;
    this.theInputCurve1 = null;
    this.theInputCurve2 = null;
    this.theMixCurve = null;
    this._constructorName = "MixCurveComputation"
}
MixCurveComputation.prototype = new CurveComputation();
MixCurveComputation.prototype.getValue = function (d, a) {
    this.theInputCurve1 = this.getCurveReference(d, this.theInputCurve1, this.inputCurve1);
    this.theInputCurve2 = this.getCurveReference(d, this.theInputCurve2, this.inputCurve2);
    this.theMixCurve = this.getCurveReference(d, this.theMixCurve, this.mixCurve);
    var e = this.getCurveOrConstantValue(d, a, this.theMixCurve, this.mixConstant);
    var c = this.getCurveOrConstantValue(d, a, this.theInputCurve1, 0);
    var b = this.getCurveOrConstantValue(d, a, this.theInputCurve2, 0);
    return e * c + (1 - e) * b
};

function PeriodicCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.period = 1;
    this.theInputCurve = null;
    this._constructorName = "PeriodicCurveComputation"
}
PeriodicCurveComputation.prototype = new CurveComputation();
PeriodicCurveComputation.prototype.getValue = function (c, b) {
    this.theInputCurve = this.getCurveReference(c, this.theInputCurve, this.inputCurve);
    var d = this.period;
    if (this.evaluateExpressions) {
        d = getValueOrExpressionValue(this, "period", c)
    }
    var a = this.getCurveOrConstantValue(c, mod(b, d), this.theInputCurve, 0);
    return a
};

function SnapCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.snapMetrics = SnapMetrics.ROUND;
    this.preMultiplier = 1;
    this.postMultiplier = 1;
    this.theInputCurve = null;
    this._constructorName = "SnapCurveComputation"
}
SnapCurveComputation.prototype = new CurveComputation();
SnapCurveComputation.prototype.getValue = function (b, a) {
    this.theInputCurve = this.getCurveReference(b, this.theInputCurve, this.inputCurve);
    var c = this.getCurveOrConstantValue(b, a, this.theInputCurve, 0);
    return this.postMultiplier * SnapMetrics.snap(c * this.preMultiplier, this.snapMetrics)
};

function MultiInputCurveComputation() {
    CurveComputation.call(this);
    this.inputCurves = [];
    this.theInputCurves = [];
    this._constructorName = "MultiInputCurveComputation"
}
MultiInputCurveComputation.prototype = new CurveComputation();
MultiInputCurveComputation.prototype.updateReferences = function (c, f, a) {
    for (var b = 0; b < a.length; b++) {
        var e = f[b];
        var d = a[b];
        f[b] = this.getCurveReference(c, e, d)
    }
};
MultiInputCurveComputation.prototype.getValue = function (b, a) {
    this.updateReferences(b, this.theInputCurves, this.inputCurves);
    return this.getValueReferencesOk(b, a)
};
MultiInputCurveComputation.prototype.getValueReferencesOk = function (b, a) {
    return 0
};

function ExpressionCurveComputation() {
    MultiInputCurveComputation.call(this);
    this.inputCurvePrefix = "input";
    this.inputVariableName = "x";
    this.valueExpression = "x";
    this._constructorName = "ExpressionCurveComputation"
}
ExpressionCurveComputation.prototype = new MultiInputCurveComputation();
ExpressionCurveComputation.prototype.createCurveFunction = function (a, c) {
    var b = this;
    return function (d) {
        return b.getCurveOrConstantValue(a, d, c, 0)
    }
};
ExpressionCurveComputation.prototype.getValueReferencesOk = function (e, b) {
    var c = this.theInputCurves;
    var g = this;
    var f = {};
    for (var d = 0; d < c.length; d++) {
        var h = c[d];
        f[this.inputCurvePrefix + "" + (d + 1)] = this.createCurveFunction(e, h)
    }
    f[this.inputVariableName] = b;
    var a = getExpressionValue(this.valueExpression, e, f);
    return a
};

function OscillatorCurveComputation() {
    MultiInputCurveComputation.call(this);
    this.count = 1;
    this.curveIndices = [0];
    this.baseFrequency = 1;
    this.curveAmplitudes = [1];
    this.curveFrequencyMultipliers = [1];
    this.curvePhases = [0];
    this._constructorName = "OscillatorCurveComputation"
}
OscillatorCurveComputation.prototype = new MultiInputCurveComputation();
OscillatorCurveComputation.prototype.getValueReferencesOk = function (b, k) {
    var j = this.theInputCurves;
    var n = 0;
    for (var f = 0; f < this.count; f++) {
        var d = 0;
        if (this.curveIndices.length > 0) {
            d = this.curveIndices[f % this.curveIndices.length]
        }
        var a = this.baseFrequency;
        var e = 1;
        if (this.curveAmplitudes.length > 0) {
            e = this.curveAmplitudes[f % this.curveAmplitudes.length]
        }
        var g = 1;
        if (this.curveFrequencyMultipliers.length > 0) {
            g = this.curveFrequencyMultipliers[f % this.curveFrequencyMultipliers.length]
        }
        var m = 0;
        if (this.curvePhases.length > 0) {
            m = this.curvePhases[f % this.curvePhases.length]
        }
        var h = 0;
        if (j.length > 0) {
            var c = j[d % j.length];
            h = this.getCurveOrConstantValue(b, a * g * (k + m), c, 0)
        } else {
            h = Math.sin(a * g * Math.PI * 2 * (k + m))
        }
        var l = e * h;
        n += l
    }
    return n
};

function AddCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "AddCurveComputation"
}
AddCurveComputation.prototype = new MultiInputCurveComputation();
AddCurveComputation.prototype.getValueReferencesOk = function (e, b) {
    var c = this.theInputCurves;
    var a = 0;
    for (var d = 0; d < c.length; d++) {
        var f = c[d];
        a += this.getCurveOrConstantValue(e, b, f, 0)
    }
    return a
};

function MultiplyCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MultiplyCurveComputation"
}
MultiplyCurveComputation.prototype = new MultiInputCurveComputation();
MultiplyCurveComputation.prototype.getValueReferencesOk = function (e, b) {
    var c = this.theInputCurves;
    var a = 1;
    for (var d = 0; d < c.length; d++) {
        var f = c[d];
        a *= this.getCurveOrConstantValue(e, b, f, 1)
    }
    return a
};

function MinCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MinCurveComputation"
}
MinCurveComputation.prototype = new MultiInputCurveComputation();
MinCurveComputation.prototype.getValueReferencesOk = function (f, b) {
    var d = this.theInputCurves;
    var a = null;
    for (var e = 0; e < d.length; e++) {
        var g = d[e];
        var c = this.getCurveOrConstantValue(f, b, g, 1);
        if (a === null) {
            a = c
        } else {
            a = Math.min(c, a)
        }
    }
    return a === null ? 0 : a
};

function MaxCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MaxCurveComputation"
}
MaxCurveComputation.prototype = new MultiInputCurveComputation();
MaxCurveComputation.prototype.getValueReferencesOk = function (f, b) {
    var d = this.theInputCurves;
    var a = null;
    for (var e = 0; e < d.length; e++) {
        var g = d[e];
        var c = this.getCurveOrConstantValue(f, b, g, 1);
        if (a === null) {
            a = c
        } else {
            a = Math.max(c, a)
        }
    }
    return a === null ? 0 : a
};

function FiguratorState() {
    this.absoluteNote = 60;
    this.stepCost = 0
}

function Figurator(a) {
    DfsSolver.call(this, a);
    this.module = getValueOrDefault(a, "module", null);
    this.verbose = getValueOrDefault(a, "verbose", false);
    this.seed = getValueOrDefault(a, "seed", 352435);
    this.cluster = getValueOrDefault(a, "cluster", []);
    this.harmonyIndices = getValueOrDefault(a, "harmonyIndices", [0]);
    this.harmony = getValueOrDefault(a, "harmony", null);
    this.voiceLine = getValueOrDefault(a, "voiceLine", null);
    this.previousNotes = getValueOrDefault(a, "previousNotes", null);
    this.nextNotes = getValueOrDefault(a, "nextNotes", null);
    this.absoluteNotes = getValueOrDefault(a, "absoluteNotes", null);
    this.diminishedFifthLikelihood = getValueOrDefault(a, "diminishedFifthLikelihood", 0.001);
    this.augmentedFourthLikelihood = getValueOrDefault(a, "augmentedFourthLikelihood", 0.001);
    this.augmentedSecondLikelihood = getValueOrDefault(a, "augmentedSecondLikelihood", 0.01);
    this.minorSeventhLikelihood = getValueOrDefault(a, "minorSeventhLikelihood", 1);
    this.majorSeventhLikelihood = getValueOrDefault(a, "majorSeventhLikelihood", 1)
}
Figurator.prototype = new DfsSolver();
Figurator.prototype.setSeed = function (a) {
    this.seed = a;
    this.rnd = new MersenneTwister(this.seed)
};
Figurator.prototype.extractStateResultData = function (a) {
    return a.absoluteNote
};
Figurator.prototype.isGoalNode = function (a) {
    if (a.depth >= this.cluster.length - 1) {
        return this.isGoalState(a.state)
    }
    return false
};
Figurator.prototype.isGoalState = function (a) {
    return true
};
Figurator.prototype.isInvalidState = function (a) {
    return false
};
Figurator.prototype.getHorizontalOffsets = function (f, a, d) {
    var c = [];
    switch (f.horizontalDomainTypes[a]) {
        case AdaptiveHorizontalDomainType.ENUMERABLE:
            c = f.horizontalDomainOffsetElements[a];
            if (d) {
                for (var b = 0; b < c.length; b++) {
                    d[b] = f.horizontalDomainOffsetLikelihoods[a][b % f.horizontalDomainOffsetLikelihoods[a].length]
                }
            }
            break;
        case AdaptiveHorizontalDomainType.RANGE:
            for (var b = f.horizontalDomainOffsetRanges[a][0]; b <= f.horizontalDomainOffsetRanges[a][1]; b++) {
                c.push(b);
                if (d) {
                    d.push(1)
                }
            }
            break
    }
    return c
};
Figurator.prototype.getVerticalOffsets = function (k, f) {
    var c = [];
    switch (k.verticalDomainType) {
        case AdaptiveVerticalDomainType.ENUMERABLE:
            c = k.verticalDomainOffsetElements;
            for (var g = 0; g < c.length; g++) {
                var d = k.verticalDomainOffsetElementLikelihoods[g % k.verticalDomainOffsetElementLikelihoods.length];
                f.push(d)
            }
            break;
        case AdaptiveVerticalDomainType.RANGE:
            for (var g = k.verticalDomainOffsetRange[0]; g <= k.verticalDomainOffsetRange[1]; g++) {
                c.push(g);
                f.push(1)
            }
            break;
        case AdaptiveVerticalDomainType.CURVE:
            var m = k.clusterPositionFraction;
            var a = k.verticalDomainCurve;
            if (a) {
                var j = this.module.getCurve(a);
                var o = k.verticalDomainCurveOffsetRange;
                var n = k.verticalDomainCurveOffsetLikelihoodMultiplier;
                var h = j.getValue(this.module, m);
                h = SnapMetrics.snap(h, SnapMetrics.ROUND);
                for (var g = o[0]; g <= o[1]; g++) {
                    c.push(h + g);
                    var b = 1;
                    if (g != 0) {
                        b = Math.pow(n, Math.abs(g))
                    }
                    f.push(b)
                }
            } else {
                console.log("figurator could not find curve " + a + "<br />")
            }
            break
    }
    return c
};
Figurator.prototype.intersectDomainAndLikelihoods = function (g, f, e, c) {
    var a = {};
    var b = {};
    for (var h in g) {
        if (f[h]) {
            a[h] = true;
            b[h] = e[h] * c[h]
        }
    }
    return [a, b]
};
Figurator.prototype.adjustForMelodicIntervals = function (b, j, f) {
    var a = f.getScaleIndexAndChromaticOffsetForAbsoluteNote(j)[0];
    for (var e in b) {
        var k = 1;
        e = parseInt(e, 10);
        var c = f.getScaleIndexAndChromaticOffsetForAbsoluteNote(e)[0];
        var g = Math.abs(a - c);
        var h = Math.abs(j - e);
        if (h == 6) {
            if (g == 3) {
                k *= this.augmentedFourthLikelihood
            } else {
                if (g == 4) {
                    k *= this.diminishedFifthLikelihood
                } else {
                    console.log("Not a good sign absDiff == 6 and not an aug4 or dim5. diff: " + g + " <br />");
                    k *= this.diminishedFifthLikelihood
                }
            }
        }
        if (g == 1 && h == 3) {
            k *= this.augmentedSecondLikelihood
        }
        b[e] = k * b[e]
    }
};
Figurator.prototype.getDomain = function (at, an, C, ab, Y) {
    var R = this.harmonyIndices[at];
    var I = this.harmony.get(R);
    var V = this.voiceLine.get(R);
    var av = this.cluster[at];
    var ae = R;
    var aA = null;
    if (at < this.cluster.length - 1) {
        ae = this.harmonyIndices[at + 1];
        aA = this.cluster[at + 1]
    }
    var af = this.harmony.get(ae);
    var ak = this.voiceLine.get(ae);
    var ac = R;
    var Z = null;
    if (at > 0) {
        ac = this.harmonyIndices[at - 1];
        Z = this.cluster[at - 1]
    }
    var E = R;
    var e = null;
    if (at > 1) {
        E = this.harmonyIndices[at - 2];
        e = this.cluster[at - 2]
    }
    var m = this.harmony.get(ac);
    var aa = this.harmony.get(E);
    var au = R;
    if (R < this.harmony.getCount() - 1) {
        au += 1
    }
    var G = this.harmony.get(au);
    var aq = this.voiceLine.get(au);
    if (!G) {
        console.log("Unable to get harmony element with index " + au + " from harmony " + this.harmony.toRomanString() + "<br />")
    }
    var H = R;
    if (R > 0) {
        H -= 1
    }
    var ar = this.harmony.get(H);
    var x = this.voiceLine.get(H);
    var am = null;
    var P = {};
    var ai = null;
    var aj = {};
    var o = I.getVerticalRelativeAbsoluteNote(av.verticalRelativeType, V);
    if (av.constantVerticalOffset) {
        o = I.offset(o, av.constantVerticalOffsetType, av.constantVerticalOffset, I)
    }
    var u = [];
    var p = this.getVerticalOffsets(av, u);
    for (var L = 0; L < p.length; L++) {
        var h = p[L];
        var Q = I.offset(o, av.verticalDomainOffsetType, h, I);
        if (ai == null) {
            ai = {}
        }
        if (Q > 1 && Q <= 127) {
            ai[Q] = true;
            aj[Q] = u[L]
        }
    }
    if (ai != null) {
        am = ai;
        P = aj
    }
    var r = null;
    var az = {};
    if (Z) {
        for (var J = 0; J < Z.horizontalRelativeTypes.length; J++) {
            var t = Z.horizontalRelativeTypes[J];
            switch (t) {
                case HorizontalRelativeType.NEXT_NOTE:
                    if (r == null) {
                        r = {}
                    }
                    var B = [];
                    var p = this.getHorizontalOffsets(Z, J, B);
                    for (var L = 0; L < p.length; L++) {
                        var Q = m.offset(an, Z.horizontalDomainOffsetTypes[J], p[L], m);
                        if (Q > 1 && Q < 127) {
                            var l = I.snap(Q, SnapType.SCALE, I);
                            if (l > 1 && l < 127) {
                                r[l] = true;
                                var ap = az[l];
                                az[l] = ap ? ap * B[L] : B[L]
                            }
                        }
                    }
                    break
            }
        }
    }
    if (r != null) {
        if (am == null) {
            am = r;
            P = az
        } else {
            var W = this.intersectDomainAndLikelihoods(am, r, P, az);
            am = W[0];
            P = W[1]
        }
    }
    var A = null;
    var ad = {};
    for (var J = 0; J < av.horizontalRelativeTypes.length; J++) {
        var t = av.horizontalRelativeTypes[J];
        switch (t) {
            case HorizontalRelativeType.PREVIOUS_NOTE:
            case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                if (A == null) {
                    A = {}
                }
                var B = [];
                var p = this.getHorizontalOffsets(av, J, B);
                var w = an;
                if (w == null && av.horizontalRelativeTypes[J] == HorizontalRelativeType.PREVIOUS_NOTE) {
                    var O = this.previousNotes.get(av);
                    w = this.absoluteNotes.get(O)
                }
                if (w == null || av.horizontalRelativeTypes[J] == HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT) {
                    w = ar.getAbsoluteNoteConstantVoiceLineElement(x)
                }
                for (var L = 0; L < p.length; L++) {
                    var Q = I.offset(w, av.horizontalDomainOffsetTypes[J], p[L], I);
                    if (Q > 1 && Q < 127) {
                        A[Q] = true;
                        ad[Q] = B[L]
                    }
                }
                break
        }
    }
    if (A != null) {
        if (am == null) {
            am = A;
            P = ad
        } else {
            var W = this.intersectDomainAndLikelihoods(am, A, P, ad);
            am = W[0];
            P = W[1]
        }
    }
    var D = null;
    var M = {};
    for (var J = 0; J < av.horizontalRelativeTypes.length; J++) {
        var t = av.horizontalRelativeTypes[J];
        switch (t) {
            case HorizontalRelativeType.NEXT_NOTE:
            case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                var B = [];
                var p = this.getHorizontalOffsets(av, J, B);
                var w = C;
                if (av.horizontalRelativeTypes[J] == HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT) {
                    w = G.getAbsoluteNoteConstantVoiceLineElement(aq)
                }
                if (av.horizontalRelativeTypes[J] == HorizontalRelativeType.NEXT_NOTE) {
                    var z = this.nextNotes.get(av);
                    if (z) {
                        w = this.absoluteNotes.get(z)
                    }
                    if (!w && at == this.cluster.length - 1) {
                        w = G.getAbsoluteNoteConstantVoiceLineElement(aq)
                    }
                }
                if (w != null) {
                    if (D == null) {
                        D = {}
                    }
                    for (var L = 0; L < p.length; L++) {
                        var Q = I.offset(w, av.horizontalDomainOffsetTypes[J], p[L], I);
                        if (Q > 1 && Q < 127) {
                            D[Q] = true;
                            M[Q] = B[L]
                        }
                    }
                }
                break
        }
    }
    if (D != null) {
        if (am == null) {
            am = D;
            P = M
        } else {
            var W = this.intersectDomainAndLikelihoods(am, D, P, M);
            am = W[0];
            P = W[1]
        }
    }
    var s = I.sameScale(m);
    if (s) {
        this.adjustForMelodicIntervals(P, an, I)
    }
    if (at > 0) {
        var X = I.getChordRootPositionScaleIndices();
        var T = I.getPitchClassesFromScaleIndices(X);
        var K = ar.getChordRootPositionScaleIndices();
        var v = ar.getPitchClassesFromScaleIndices(K);
        var b = arrayContains(v, an % 12);
        var F = false;
        var q = I.isSeventh();
        if (q) {
            var ay = I.getAbsoluteNoteFromScaleIndex(X[3]) % 12;
            F = ay == (an % 12)
        }
        var ah = false;
        var ao = ar.isSeventh();
        if (ao) {
            var aB = ar.getAbsoluteNoteFromScaleIndex(K[3]) % 12;
            ah = aB == (an % 12)
        }
        var ag = true;
        var S = 0;
        var y = 0;
        if (at > 1) {
            var n = aa.getChordRootPositionScaleIndices();
            var k = aa.getPitchClassesFromScaleIndices(n);
            var U = Y.previous.state.absoluteNote;
            ag = arrayContains(k, U % 12);
            y = an - U;
            S = Math.abs(y)
        }
        for (var N in P) {
            var c = P[N];
            N = parseInt(N, 10);
            var al = N - an;
            var ax = Math.abs(al);
            if (ax > 2) {
                var f = N % 12;
                if (!arrayContains(T, N) || (ah && f == ay)) {
                    var a = 1 / (1 + ax * 4);
                    c = a * c
                }
                if (!b || ah) {
                    var a = 1 / (1 + ax);
                    c = a * c
                }
            }
            if (!b && !ag && !arrayContains(k, N)) {
                var g = 0.1;
                c = g * c
            }
            if (S > 5) {
                if ((al >= 0 && y > 0) || (al <= 0 && y < 0)) {
                    var aw = S - 5;
                    aw += ax;
                    var a = 1 / (1 + aw)
                }
            }
            P[N] = c
        }
    }
    for (var N in P) {
        ab[N] = P[N]
    }
    if (this.verbose) {
        console.log("In getDomain() for index " + at + " previousAbsNote: " + an + " nextAbsNote: " + C + "<br />");
        console.log("___ prev to current domain: " + JSON.stringify(r) + "<br />");
        console.log("___ prev to current likelihoods: " + JSON.stringify(az) + "<br />");
        console.log("___ current to prev domain: " + JSON.stringify(A) + "<br />");
        console.log("___ current to prev likelihoods: " + JSON.stringify(ad) + "<br />");
        console.log("___ current to next domain: " + JSON.stringify(D) + "<br />");
        console.log("___ current to next likelihoods: " + JSON.stringify(M) + "<br />");
        console.log("__ resulting domain: " + JSON.stringify(am) + "<br />");
        console.log("__ resulting likelihoods: " + JSON.stringify(ab) + "<br />")
    }
    return am
};
Figurator.prototype.getSuccessorDomain = function (b, e, d) {
    var c = e.state;
    var a = c.absoluteNote;
    return this.getDomain(b + 1, a, null, d, e)
};
Figurator.prototype.createStatesFromDomain = function (e, g, f, a) {
    for (var h in e) {
        var c = new FiguratorState();
        c.absoluteNote = parseInt(h, 10);
        f.push(c);
        var b = g[h];
        if (!b) {
            b = 1
        }
        a.push(b)
    }
};
Figurator.prototype.getSuccessorDomainStatesAndLikelihoods = function (b, c, f, a) {
    if (b >= this.cluster.length) {
        console.log("Index error in Figurator.prototype.getDomainStatesAndLikelihoods() " + b + " " + this.cluster.length + "<br />");
        return
    }
    var e = {};
    var d = this.getSuccessorDomain(b, c, e);
    this.createStatesFromDomain(d, e, f, a)
};
Figurator.prototype.getSuccessorDomainIteratorForElement = function (b, d) {
    var a = [];
    var c = [];
    this.getSuccessorDomainStatesAndLikelihoods(b, d, a, c);
    return new RandomDfsStateIterator(a, c, this.rnd)
};
Figurator.prototype.getStartStateIterator = function () {
    var d = {};
    var c = this.getDomain(0, null, null, d, null);
    var a = [];
    var b = [];
    this.createStatesFromDomain(c, d, a, b);
    return new RandomDfsStateIterator(a, b, this.rnd)
};
Figurator.prototype.getSuccessorIterator = function (a) {
    return this.getSuccessorDomainIteratorForElement(a.depth, a)
};
// TODO REMOVE
Figurator.prototype.prepareBeforeSearch = function () {

};
// TODO REMOVE
Figurator.prototype.searchDone = function () {

};

function RenderLine() {
    this.id = "renderLine";
    this.activated = true;
    this._constructorName = "RenderLine"
}
RenderLine.prototype.renderBatch = function (b) {
    var k = getValueOrExpressionValue(this, "activated", b.module);
    if (k) {
        var n = this.getPrimitiveRenderLines(b.module, b.constantHarmony);
        var l = [];
        var m = [];
        for (var c = 0; c < n.length; c++) {
            var f = n[c];
            var g = b.module.getRenderChannel(f.channel);
            if (!g) {
                console.log(" could not find render channel " + f.channel);
                continue
            }
            var a = f.getPositionedRenderElements(b.module, b.constantHarmony, 0, b);
            for (var d = 0; d < a.length; d++) {
                m.push(g)
            }
            addAll(l, a)
        }
        for (var d = 0; d < l.length; d++) {
            var h = l[d];
            b.renderChannel = m[d];
            h.renderBatch(b)
        }
    }
};
RenderLine.prototype.getPrimitiveRenderLines = function (b, a) {
    return [this]
};
RenderLine.prototype.getPositionedRenderElements = function (c, g, m, b) {
    var o = [];
    var k = getValueOrExpressionValue(this, "activated", c);
    if (k) {
        var n = this.getPrimitiveRenderLines(c, g);
        for (var d = 0; d < n.length; d++) {
            var a = n[d].renderElements;
            for (var f = 0; f < a.length; f++) {
                var h = a[f];
                var l = h.getPositionedRenderElements(c, g, m, b);
                addAll(o, l)
            }
        }
    }
    return o
};

function PrimitiveRenderLine() {
    RenderLine.call(this);
    this.channel = "";
    this.renderElements = [];
    this._constructorName = "PrimitiveRenderLine"
}
PrimitiveRenderLine.prototype = new RenderLine();
PrimitiveRenderLine.prototype.addRenderElement = function (a) {
    this.renderElements.push(a);
    return this
};
var RenderElementCutHarmonyMode = {
    STOP: 0,
    CONTINUE_ADAPT: 1,
    CONTINUE_SAME: 2
};

var NoteOverlapHarmonyMode = {
    SPLIT_REMOVE: 0,
    CONTINUE: 1,
    SPLIT_SNAP: 2,
    CONTINUE_OR_SPLIT_SNAP: 3
};


function RenderElement() {
    this.id = "";
    this.channel = "";
    this.activated = true;
    this._constructorName = "RenderElement"
}
RenderElement.prototype.copy = function () {
    return copyObjectDeep(this, null)
};
RenderElement.prototype.getPositionedRenderElements = function (e, d, c, g) {
    var b = getValueOrExpressionValue(this, "activated", e);
    if (b) {
        if (this instanceof PositionedRenderElement) {
            if (c != 0) {
                var a = this.copy();
                if (a._constructorName == this._constructorName) {
                    var f = d.get(0);
                    a.startTime = positionUnitToBeats(a.startTime, a.startTimeUnit, f.tsNumerator, f.tsDenominator, d) + c;
                    a.startTimeUnit = PositionUnit.BEATS;
                    return [a]
                } else {
                    console.log("Probably missing copy() for " + this._constructorName + "<br />")
                }
            }
            return [this]
        } else {
            console.log("Forgot to implement getPositionedRenderElements() in render element?")
        }
    } else {
        return []
    }
};
RenderElement.prototype.renderBatch = function (a) {
    console.log("Forgot to implement renderBatch() in render element? " + this._constructorName)
};

function PositionedRenderElement() {
    RenderElement.call(this);
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;
    this.maxLength = 1024;
    this.maxLengthUnit = PositionUnit.BEATS;
    this.renderOffset = 0;
    this.renderOffsetUnit = PositionUnit.BEATS;
    this._constructorName = "PositionedRenderElement"
}
PositionedRenderElement.prototype = new RenderElement();

function ZonesRenderElement() {
    PositionedRenderElement.call(this);
    this.useDefaultIfNoneApplicable = true;
    this.defaultZoneIndices = [0];
    this.zones = [];
    this._constructorName = "ZonesRenderElement"
}
ZonesRenderElement.prototype = new PositionedRenderElement();
ZonesRenderElement.prototype.getPositionedRenderElements = function (b, f, l, a) {
    var n = [];
    var h = getValueOrExpressionValue(this, "activated", b);
    if (h) {
        var m = {};
        var c = false;
        for (var d = 0; d < this.zones.length; d++) {
            var j = this.zones[d];
            var k = m[j.mutexClassIndex];
            if (!k && j.applicable(b, f)) {
                var g = j.getPositionedRenderElements(b, f, l, a);
                addAll(n, g);
                m[j.mutexClassIndex] = true;
                c = true;
                break
            }
        }
        if (!c && this.useDefaultIfNoneApplicable && this.zones.length > 0) {
            for (var d = 0; d < this.defaultZoneIndices.length; d++) {
                var e = this.defaultZoneIndices[d];
                var j = this.zones[e % this.zones.length];
                var g = j.getPositionedRenderElements(b, f, l, a);
                addAll(n, g)
            }
        }
    }
    return n
};

function RenderElementZone() {
    this.id = "";
    this.mutexClassIndex = 0;
    this._constructorName = "RenderElementZone"
}
RenderElementZone.prototype.applicable = function (b, a) {
    return true
};

function HarmonyCountRenderElementZone() {
    RenderElementZone.call(this);
    this.onePerHarmonyIndex = false;
    this.harmonyCounts = [];
    this.harmonyCountDividers = [];
    this.renderElements = [];
    this._constructorName = "HarmonyCountRenderElementZone"
}
HarmonyCountRenderElementZone.prototype = new RenderElementZone();
HarmonyCountRenderElementZone.prototype.applicable = function (c, a) {
    var f = a.getCount();
    for (var b = 0; b < this.harmonyCounts.length; b++) {
        var e = this.harmonyCounts[b];
        if (e == f) {
            return true
        }
    }
    for (var b = 0; b < this.harmonyCountDividers.length; b++) {
        var d = this.harmonyCountDividers[b];
        if ((f % d) == 0) {
            return true
        }
    }
    return false
};
HarmonyCountRenderElementZone.prototype.getPositionedRenderElements = function (b, g, l, a) {
    var m = [];
    for (var e = 0; e < this.renderElements.length; e++) {
        var k = this.renderElements[e];
        var f = l;
        if (this.onePerHarmonyIndex) {
            for (var c = 0; c < g.getCount(); c++) {
                var h = k.getPositionedRenderElements(b, g, f, a);
                h = arrayCopyWithCopy(h);
                addAll(m, h);
                var d = g.get(c);
                f += positionUnitToBeats(d.length, d.lengthUnit, d.tsNumerator, d.tsDenominator, g)
            }
        } else {
            var h = k.getPositionedRenderElements(b, g, f, a);
            h = arrayCopyWithCopy(h);
            addAll(m, h)
        }
    }
    return m
};

function PhraseStructureRenderElement() {
    PositionedRenderElement.call(this);
    this.renderElements = [];
    this.startRenderElements = [];
    this.endRenderElements = [];
    this._constructorName = "PhraseStructureRenderElement"
}
PhraseStructureRenderElement.prototype = new PositionedRenderElement();
PhraseStructureRenderElement.prototype.getPositionedRenderElements = function (d, j, l, c) {
    var n = [];
    var a = j.getPhraseRanges();
    var h = l;
    for (var f = 0; f < a.length; f++) {
        var g = a[f];
        var e = getItemFromArrayWithStartEndItems(null, this.renderElements, a.length, f, this.startRenderElements, this.endRenderElements);
        var m = j.getPhraseRangeBeatLength(g);
        if (e != null) {
            var b = copyObjectDeep(e);
            b.maxLength = m;
            var k = b.getPositionedRenderElements(d, j, h, c);
            addAll(n, k)
        }
        h += m
    }
    return n
};

function AbstractHarmonyIndexPatternMotifRenderElement() {
    PositionedRenderElement.call(this);
    this.useVoiceLine = true;
    this.relativeType = VerticalRelativeType.SCALE_BASE;
    this.offsets = [0];
    this.offsetType = OffsetType.SCALE;
    this.startOffsets = [];
    this.endOffsets = [];
    this.count = 1;
    this.countUnit = CountUnit.HARMONY_ELEMENT_COUNT;
    this.clampAtHarmonyEnd = true;
    this.clampAtPhraseEnd = false;
    this.voiceLine = "";
    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];
    this.cutHarmonyMode = RenderElementCutHarmonyMode.STOP;
    this.noteOverlapHarmonyMode = NoteOverlapHarmonyMode.SPLIT_REMOVE;
    this.noteOverlapSnapType = SnapType.SCALE;
    this._constructorName = "AbstractHarmonyIndexPatternMotifRenderElement"
}
AbstractHarmonyIndexPatternMotifRenderElement.prototype = new PositionedRenderElement();
AbstractHarmonyIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function (c, a, d, e, b) {
    console.log("" + this._constructorName + " must implement getMotifIdAtIndex()");
    return []
};
AbstractHarmonyIndexPatternMotifRenderElement.prototype.getRenderChannelIdsAtIndex = function (c, a, d, e, b) {
    return []
};
AbstractHarmonyIndexPatternMotifRenderElement.prototype.getPositionedRenderElements = function (b, l, t, f) {
    var k = [];
    var p = getValueOrExpressionValue(this, "activated", b);
    var a = f.voiceLineHarmonies[this.voiceLine];
    if (a) {
        l = a
    }
    if (p) {
        var v = l.getCount();
        var n = t;
        var e = l.getHarmonyIndexAt(n);
        var q = Math.round(CountUnit.getCount(this.count, this.countUnit, l, n));
        var d = e + q;
        if (this.clampAtHarmonyEnd) {
            d = Math.min(d, v)
        }
        for (var s = e; s < d; s++) {
            var g = l.get(s);
            var m = this.getMotifIdsAtIndex(s - e, d - e, s, v, b);
            var c = this.getRenderChannelIdsAtIndex(s - e, d - e, s, v, b);
            for (var r = 0; r < m.length; r++) {
                var o = m[r];
                var h = "";
                if (c.length > 0) {
                    h = c[r % c.length]
                }
                if (o) {
                    var w = new MotifRenderElement();
                    w.channel = h;
                    w.motif = o;
                    w.startTime = n;
                    w.startTimeUnit = PositionUnit.BEATS;
                    w.offsets = this.offsets;
                    w.offsetType = this.offsetType;
                    w.startOffsets = this.startOffsets;
                    w.endOffsets = this.endOffsets;
                    w.useVoiceLine = this.useVoiceLine;
                    w.voiceLine = this.voiceLine;
                    w.seed = getItemFromArrayWithStartEndItems(12345, this.seeds, v, s, this.startSeeds, this.endSeeds);
                    w.cutHarmonyMode = this.cutHarmonyMode;
                    w.noteOverlapHarmonyMode = this.noteOverlapHarmonyMode;
                    w.noteOverlapSnapType = this.noteOverlapSnapType;
                    k.push(w)
                } else { }
            }
            var u = positionUnitToBeats(g.length, g.lengthUnit, g.tsNumerator, g.tsDenominator, l);
            n += u
        }
    }
    return k
};

function HarmonyIndexPatternMotifRenderElement() {
    AbstractHarmonyIndexPatternMotifRenderElement.call(this);
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];
    this._constructorName = "HarmonyIndexPatternMotifRenderElement"
}
HarmonyIndexPatternMotifRenderElement.prototype = new AbstractHarmonyIndexPatternMotifRenderElement();
HarmonyIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function (c, a, d, f, b) {
    var e = getItemFromArrayWithStartEndItems("", this.motifs, a, c, this.startMotifs, this.endMotifs);
    return [e]
};

function HarmonyIndexIndexPatternMotifRenderElement() {
    AbstractHarmonyIndexPatternMotifRenderElement.call(this);
    this.indices = [];
    this.startIndices = [];
    this.endIndices = [];
    this.motifs = [];
    this.channelIndices = [];
    this.startChannelIndices = [];
    this.endChannelIndices = [];
    this.channels = [];
    this._constructorName = "HarmonyIndexIndexPatternMotifRenderElement"
}
HarmonyIndexIndexPatternMotifRenderElement.prototype = new AbstractHarmonyIndexPatternMotifRenderElement();
HarmonyIndexIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function (e, j, m, l, b) {
    var c = getValueOrExpressionValue(this, "indices", b);
    var d = getValueOrExpressionValue(this, "startIndices", b);
    var f = getValueOrExpressionValue(this, "endIndices", b);
    var h = getItemFromArrayWithStartEndItems([], c, j, e, d, f);
    var k = [];
    for (var e = 0; e < h.length; e++) {
        var g = h[e];
        if (g >= 0 && this.motifs.length > 0) {
            var a = this.motifs[g % this.motifs.length];
            k.push(a)
        }
    }
    return k
};
HarmonyIndexIndexPatternMotifRenderElement.prototype.getRenderChannelIdsAtIndex = function (e, j, m, l, a) {
    var b = getValueOrExpressionValue(this, "channelIndices", a);
    var d = getValueOrExpressionValue(this, "startChannelIndices", a);
    var f = getValueOrExpressionValue(this, "endChannelIndices", a);
    var h = getItemFromArrayWithStartEndItems([], b, j, e, d, f);
    var k = [];
    for (var e = 0; e < h.length; e++) {
        var g = h[e];
        if (g >= 0 && this.channels.length > 0) {
            var c = this.channels[g % this.channels.length];
            k.push(c)
        }
    }
    return k
};

function MultiMotifRenderElement() {
    PositionedRenderElement.call(this);
    this.count = 1;
    this.countUnit = CountUnit.HARMONY_MEASURES;
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];
    this.stepOffset = 1;
    this.stepOffsetUnit = PositionUnit.MEASURES;
    this.useVoiceLine = true;
    this.relativeType = VerticalRelativeType.SCALE_BASE;
    this.offsets = [0];
    this.offsetType = OffsetType.SCALE;
    this.startOffsets = [];
    this.endOffsets = [];
    this.voiceLine = "";
    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];
    this.cutHarmonyMode = RenderElementCutHarmonyMode.STOP;
    this.noteOverlapHarmonyMode = NoteOverlapHarmonyMode.CONTINUE;
    this.noteOverlapSnapType = SnapType.SCALE;
    this._constructorName = "MultiMotifRenderElement"
}
MultiMotifRenderElement.prototype = new PositionedRenderElement();
MultiMotifRenderElement.prototype.getPositionedRenderElements = function (b, g, n, a) {
    var p = [];
    var j = getValueOrExpressionValue(this, "activated", b);
    if (j) {
        var e = g.get(0);
        var c = positionUnitToBeats(this.startTime, this.startTimeUnit, e.tsNumerator, e.tsDenominator, g);
        var o = g.getHarmonyIndexAt(c);
        var h = CountUnit.getCount(this.count, this.countUnit, g, c);
        var f = c + n;
        for (var d = 0; d < h; d++) {
            var m = getItemFromArrayWithStartEndItems("", this.motifs, h, d, this.startMotifs, this.endMotifs);
            if (m) {
                var k = new MotifRenderElement();
                k.motif = m;
                k.startTime = f;
                k.startTimeUnit = PositionUnit.BEATS;
                k.offsets = this.offsets;
                k.offsetType = this.offsetType;
                k.startOffsets = this.startOffsets;
                k.endOffsets = this.endOffsets;
                k.useVoiceLine = this.useVoiceLine;
                k.voiceLine = this.voiceLine;
                k.seed = getItemFromArrayWithStartEndItems(12345, this.seeds, h, d, this.startSeeds, this.endSeeds);
                k.cutHarmonyMode = this.cutHarmonyMode;
                k.noteOverlapHarmonyMode = this.noteOverlapHarmonyMode;
                k.noteOverlapSnapType = this.noteOverlapSnapType;
                p.push(k)
            }
            var o = g.getHarmonyIndexAt(f);
            var e = g.get(o);
            var l = positionUnitToBeats(this.stepOffset, this.stepOffsetUnit, e.tsNumerator, e.tsDenominator, g);
            f += l
        }
    }
    return p
};

function AbstractPercussionMotifRenderElement() {
    PositionedRenderElement.call(this)
}
AbstractPercussionMotifRenderElement.prototype = new PositionedRenderElement();
AbstractPercussionMotifRenderElement.prototype.renderPercussionMotif = function (g, c, b, h, f) {
    var a = f.module.getPercussionMotif(g);
    var e = a.getPrimitivePercussionMotifElements(f.module, b, c);
    for (var d = 0; d < e.length; d++) {
        this.renderPrimitivePercussionMotifElement(e[d], c, b, h, f)
    }
};
AbstractPercussionMotifRenderElement.prototype.getPercussionMotifBeatLength = function (c, n, h, l, b) {
    var o = 0;
    var d = b.module.getPercussionMotif(c);
    var a = d.getPrimitivePercussionMotifElements(b.module, h, n);
    for (var f = 0; f < a.length; f++) {
        var g = a[f];
        var k = positionUnitToBeats2(g.length, g.lengthUnit, n, h);
        var e = positionUnitToBeats2(g.startTime, g.startTimeUnit, n, h);
        var m = e + k;
        o = Math.max(o, m)
    }
    return o
};
AbstractPercussionMotifRenderElement.prototype.getPercussionMotifsBeatLength = function (h, c, b, g, e) {
    var a = 0;
    for (var d = 0; d < h.length; d++) {
        var f = this.getPercussionMotifBeatLength(h[d], c, b, g, e);
        a += f;
        c += f
    }
    return a
};
AbstractPercussionMotifRenderElement.prototype.renderPrimitivePercussionMotifElement = function (f, n, h, l, a) {
    if (f.rest) {
        return
    }
    var g = a.renderChannel;
    if (f.renderChannel) {
        g = a.module.getRenderChannel(f.renderChannel);
        if (!g) {
            g = a.renderChannel
        }
    }
    var e = new NoteOnEvent();
    var j = positionUnitToBeats(f.startTime, f.startTimeUnit, l.tsNumerator, l.tsDenominator, h);
    e.time = snapMidiTicks(n + j + a.sectionTime, 192);
    e.onVelocity = f.strength;
    e.note = f.note;
    e.renderChannel = g;
    var b = j + positionUnitToBeats(f.length, f.lengthUnit, l.tsNumerator, l.tsDenominator, h);
    var m = new NoteOffEvent();
    m.time = snapMidiTicks(n + b * 0.99 + a.sectionTime, 192);
    m.offVelocity = f.strength;
    m.note = e.note;
    m.renderChannel = g;
    m.startTime = e.time;
    a.data.addEvent(e);
    a.data.addEvent(m);
    if (f.fillers) {
        for (var c = 0; c < f.fillers.length; c++) {
            var d = f.fillers[c]
        }
    }
};

function PercussionMotifRenderElement() {
    AbstractPercussionMotifRenderElement.call(this);
    this.count = 1;
    this.countUnit = CountUnit.HARMONY_MEASURES;
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];
    this.stepOffset = 1;
    this.stepOffsetUnit = PositionUnit.MEASURES;
    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];
    this._constructorName = "PercussionMotifRenderElement"
}
PercussionMotifRenderElement.prototype = new AbstractPercussionMotifRenderElement();
PercussionMotifRenderElement.prototype.renderBatch = function (a) {
    var h = getValueOrExpressionValue(this, "activated", a.module);
    if (h) {
        var f = a.constantHarmony;
        var c = f.get(0);
        var b = positionUnitToBeats(this.startTime, this.startTimeUnit, c.tsNumerator, c.tsDenominator, f);
        var g = CountUnit.getCount(this.count, this.countUnit, f, b);
        var e = b;
        for (var d = 0; d < g; d++) {
            var l = getItemFromArrayWithStartEndItems("", this.motifs, g, d, this.startMotifs, this.endMotifs);
            var k = f.getHarmonyIndexAt(e);
            var c = f.get(k);
            if (l) {
                this.renderPercussionMotif(l, e, f, c, a)
            }
            var j = positionUnitToBeats(this.stepOffset, this.stepOffsetUnit, c.tsNumerator, c.tsDenominator, f);
            e += j
        }
    }
};

function FlexiblePercussionMotifRenderElement() {
    AbstractPercussionMotifRenderElement.call(this);
    this.useIndexedMotifs = false;
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];
    this.motifIndices = [];
    this.startMotifIndices = [];
    this.endMotifIndices = [];
    this.indexedMotifs = [];
    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];
    this._constructorName = "FlexiblePercussionMotifRenderElement"
}
FlexiblePercussionMotifRenderElement.prototype = new AbstractPercussionMotifRenderElement();
FlexiblePercussionMotifRenderElement.prototype.snapBeat = function (a) {
    return Math.round(a)
};
FlexiblePercussionMotifRenderElement.prototype.renderBatch = function (m) {
    var x = getValueOrExpressionValue(this, "activated", m.module);
    if (x) {
        var u = m.constantHarmony;
        var p = u.get(0);
        var r = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, u);
        var f = positionUnitToBeats2(this.maxLength, this.maxLengthUnit, 0, u);
        var w = r;
        var I = Math.min(f + r, u.getBeatLength());
        var y = 64;
        var l = [];
        for (var C = 0; C < this.startMotifs.length; C++) {
            var t = this.startMotifs[C];
            l.push(t)
        }
        if (this.motifs.length > 0) {
            for (var C = 0; C < y; C++) {
                var t = this.motifs[C % this.motifs.length];
                l.push(t)
            }
        }
        var q = getValueOrExpressionValue(this, "startMotifIndices", m.module);
        var o = getValueOrExpressionValue(this, "motifIndices", m.module);
        var e = getValueOrExpressionValue(this, "endMotifIndices", m.module);
        var d = [];
        for (var C = 0; C < q.length; C++) {
            var A = q[C];
            d.push(A)
        }
        if (o.length > 0) {
            for (var C = 0; C < y; C++) {
                var A = o[C % o.length];
                d.push(A)
            }
        }
        var C = 0;
        while (w < I) {
            var D = this.endMotifs;
            if (this.useIndexedMotifs) {
                D = [];
                for (var B = 0; B < e.length; B++) {
                    var g = e[B];
                    var a = this.indexedMotifs[g];
                    if (a) {
                        D.push(a)
                    }
                }
            }
            var n = this.getPercussionMotifsBeatLength(D, w, u, p, m);
            var s = this.useIndexedMotifs ? d.length : l.length;
            var A = IndexBorderMode.getIndex(IndexBorderMode.CLAMP, s, C);
            var c = l[A];
            if (this.useIndexedMotifs) {
                var F = d[A];
                c = this.indexedMotifs[F]
            }
            var H = u.getHarmonyIndexAt(w);
            var p = u.get(H);
            var v = 1;
            var k = false;
            if (c) {
                v = this.getPercussionMotifBeatLength(c, w, u, p, m);
                if (v < 0.01) {
                    console.log(this._constructorName + " found empty percussion motif...");
                    v = 1
                } else {
                    if ((w + n + v <= I)) {
                        this.renderPercussionMotif(c, w, u, p, m)
                    } else {
                        k = true
                    }
                }
            }
            if ((k || (w + n + v > I))) {
                var b = w;
                w = this.snapBeat(I - n);
                if (this.useIndexedMotifs) {
                    var z = null;
                    for (var B = 0; B < e.length; B++) {
                        var h = e[B];
                        var z = this.indexedMotifs[h];
                        this.renderPercussionMotif(z, w, u, p, m);
                        var E = this.getPercussionMotifBeatLength(z, w, u, p, m);
                        if (E < 0.01) {
                            E = 1
                        }
                        w += E;
                        w = this.snapBeat(w)
                    }
                } else {
                    for (var B = 0; B < this.endMotifs.length; B++) {
                        var z = this.endMotifs[B];
                        this.renderPercussionMotif(z, w, u, p, m);
                        var E = this.getPercussionMotifBeatLength(z, w, u, p, m);
                        if (E < 0.01) {
                            E = 1
                        }
                        w += E;
                        w = this.snapBeat(w)
                    }
                }
                break
            }
            var G = v;
            w += G;
            w = this.snapBeat(w);
            C++
        }
    }
};

function MotifRenderElement() {
    PositionedRenderElement.call(this);
    this.motif = "";
    this.useVoiceLine = true;
    this.relativeType = VerticalRelativeType.SCALE_BASE;
    this.offsets = [0];
    this.offsetType = OffsetType.SCALE;
    this.startOffsets = [];
    this.endOffsets = [];
    this.voiceLine = "";
    this.seed = 12345;
    this.figurationPlanner = "";
    this.splitNoteMinLength = 1;
    this.splitNoteMinLengthUnit = PositionUnit.BEAT_EIGHTHS;
    this.cutHarmonyMode = RenderElementCutHarmonyMode.STOP;
    this.noteOverlapHarmonyMode = NoteOverlapHarmonyMode.CONTINUE;
    this.noteOverlapSnapType = SnapType.SCALE;
    this._constructorName = "MotifRenderElement"
}
MotifRenderElement.prototype = new PositionedRenderElement();
MotifRenderElement.prototype.render = function (n, o, g, s, d) {
    var f = n.get(0);
    var k = positionUnitToBeats(this.startTime, this.startTimeUnit, f.tsNumerator, f.tsDenominator, n);
    var B = k;
    var E = n.getBeatLength();
    for (var y = 0; y < o.length; y++) {
        var C = o[y];
        var D = n.getHarmonyIndexAt(B);
        var a = n.get(D);
        var t = g.get(D);
        var x = C.getBeatLength(a.tsNumerator, a.tsDenominator);
        if (!C.rest) {
            var h = s.get(C);
            if (h && h > 0 && h < 128) {
                var l = x;
                var F = n.getHarmonyIndexAt(B + x);
                if (F != D || B + x > E) {
                    var A = n.getBeatLengthUntilIndex(D + 1);
                    var r = B + x - A;
                    if (r > 0) {
                        switch (this.noteOverlapHarmonyMode) {
                            case NoteOverlapHarmonyMode.CONTINUE:
                                break;
                            case NoteOverlapHarmonyMode.SPLIT_REMOVE:
                                l -= r;
                                break;
                            case NoteOverlapHarmonyMode.SPLIT_SNAP:
                                l -= r;
                                break;
                            case NoteOverlapHarmonyMode.CONTINUE_OR_SPLIT_SNAP:
                                break
                        }
                    }
                }
                if (l > 0) {
                    var v = d.renderChannel;
                    if (this.channel) {
                        v = d.module.getRenderChannel(this.channel)
                    }
                    if (C.channel) {
                        v = d.module.getRenderChannel(C.channel)
                    }
                    if (!v) {
                        v = d.renderChannel
                    }
                    var c = new NoteOnEvent();
                    c.time = snapMidiTicks(B + d.sectionTime, 192);
                    c.onVelocity = C.strength;
                    c.note = h;
                    c.renderChannel = v;
                    var p = new NoteOffEvent();
                    p.time = snapMidiTicks(B + l * 0.99 + d.sectionTime, 192);
                    p.startTime = c.time;
                    p.offVelocity = C.strength;
                    p.note = c.note;
                    p.renderChannel = v;
                    d.data.addEvent(c);
                    d.data.addEvent(p);
                    if (C.fillers) {
                        var m = v;
                        for (var w = 0; w < C.fillers.length; w++) {
                            var b = C.fillers[w];
                            var u = b.getAbsoluteNote(h, a, t);
                            var z = B + d.sectionTime + positionUnitToBeats(b.positionOffset, b.positionOffsetUnit, a.tsNumerator, a.tsDenominator);
                            var q = positionUnitToBeats(b.length, b.lengthUnit, a.tsNumerator, a.tsDenominator);
                            switch (b.lengthMode) {
                                case FillerNoteLengthMode.INDEPENDENT:
                                    break;
                                case FillerNoteLengthMode.MATCH:
                                    q = l;
                                    break
                            }
                            if (b.channel) {
                                v = d.module.getRenderChannel(b.channel)
                            } else {
                                v = m
                            }
                            if (!v) {
                                v = d.renderChannel
                            }
                            c = new NoteOnEvent();
                            c.time = snapMidiTicks(z, 192);
                            c.onVelocity = b.strength;
                            c.note = u;
                            c.renderChannel = v;
                            p = new NoteOffEvent();
                            p.time = snapMidiTicks(z + q * 0.99, 192);
                            p.offVelocity = b.strength;
                            p.note = c.note;
                            p.renderChannel = v;
                            p.startTime = c.time;
                            d.data.addEvent(c);
                            d.data.addEvent(p)
                        }
                    }
                }
            } else { }
        }
        B += x
    }
};
MotifRenderElement.prototype.figurate = function (r, t, u, C, l, E, f, n, A, k, o) {
    var g = [];
    var z = [];
    for (var x = 0; x < t.length; x++) {
        var c = t[x];
        if (!c.rest) {
            var b = u.get(c);
            var v = C.get(c);
            if (v && !b && c instanceof AdaptiveMotifElement) {
                z.push(c);
                c.clusterId = g.length;
                c.clusterPositionIndex = z.length - 1
            } else {
                if (z.length > 0) {
                    g.push(z);
                    z = []
                }
            }
        }
    }
    if (z.length > 0) {
        g.push(z)
    }
    for (var x = 0; x < g.length; x++) {
        var y = g[x];
        var m = 0;
        var p = [];
        for (var w = 0; w < y.length; w++) {
            p[w] = m
        }
        var a = m;
        if (a < 0.000001) {
            a = y.length
        }
        for (var w = 0; w < y.length; w++) {
            y[w].clusterPositionFraction = p[w] / a
        }
    }
    var e = A.useExternalSeed ? this.seed : A.seed;
    var q = new MersenneTwister(e);
    for (var x = 0; x < g.length; x++) {
        var y = g[x];
        var D = [];
        for (var w = 0; w < y.length; w++) {
            D.push(l.get(y[w]))
        }
        var B = {
            seed: q.genrand_int32(),
            module: k,
            cluster: y,
            harmony: r,
            voiceLine: n,
            harmonyIndices: D,
            previousNotes: E,
            nextNotes: f,
            absoluteNotes: u,
            maxMLSolutions: 10
        };
        var d = null;
        var F = this.figurationPlanner;
        if (!F && o) {
            F = o.figurationPlanner
        }
        if (F) {
            var h = k.getFigurationPlanner(F);
            if (h) {
                d = h.getFigurator(B)
            }
        }
        if (!d) {
            d = new Figurator(B)
        }
        var s = d.searchML();
        if (s != null) {
            if (s.length != y.length) {
                console.log("Mitchmatch between solution and cluster lengths " + s.length + " " + y.length + "<br />")
            }
            for (var w = 0; w < y.length; w++) {
                if (typeof (s[w]) === "string") {
                    console.log("abs note is a string!!!")
                }
                u.put(y[w], s[w])
            }
        } else {
            console.log("Failed to find solution to figuration problem in cluster " + x + "<br />")
        }
    }
};
MotifRenderElement.prototype.assignHorizontalRelativeMotifElements = function (b, g, e, d, h) {
    var f = true;
    while (f) {
        f = false;

        function a(k) {
            var p = d[k];
            if (p instanceof HorizontalRelativeMotifElement) {
                var n = h.get(p);
                if (!n) {
                    var q = null;
                    var r = b.getCount();
                    var s = g.get(p);
                    var m = b.get(s);
                    var l = b.get(s);
                    var j = e.get(s);
                    switch (p.relativeType) {
                        case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                            if (s < r - 1) {
                                j = e.get(s + 1);
                                l = b.get(s + 1)
                            }
                            q = l.getAbsoluteNoteConstantVoiceLineElement(j);
                            break;
                        case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                            if (s > 0) {
                                j = e.get(s - 1);
                                l = b.get(s - 1)
                            }
                            q = l.getAbsoluteNoteConstantVoiceLineElement(j);
                            break;
                        case HorizontalRelativeType.NEXT_NOTE:
                            if (k < d.length - 1) {
                                q = h.get(d[k + 1])
                            } else {
                                if (s < r - 1) {
                                    j = e.get(s + 1);
                                    l = b.get(s + 1)
                                }
                                q = l.getAbsoluteNoteConstantVoiceLineElement(j)
                            }
                            break;
                        case HorizontalRelativeType.PREVIOUS_NOTE:
                            if (k > 0) {
                                q = h.get(d[k - 1])
                            } else {
                                if (s > 0) {
                                    j = e.get(s - 1);
                                    l = b.get(s - 1)
                                }
                                q = l.getAbsoluteNoteConstantVoiceLineElement(j)
                            }
                            break
                    }
                    if (q != null) {
                        var o = m.snapOffsetSnap(q, p.beforeOffsetSnapType, p.offsetType, p.afterOffsetSnapType, p.index, m);
                        h.put(p, o);
                        f = true
                    }
                }
            }
        }
        for (var c = 0; c < d.length; c++) {
            a(c)
        }
        for (var c = d.length - 1; c >= 0; c--) {
            a(c)
        }
    }
};
MotifRenderElement.prototype.assignVerticalRelativeMotifElements = function (b, k, g, a) {
    for (var e = 0; e < b.length; e++) {
        var j = b[e];
        var h = k.get(j);
        var c = g.get(j);
        var d = null;
        if (j instanceof VerticalRelativeMotifElement) {
            d = h.getVerticalRelativeAbsoluteNote(j.relativeType, c)
        }
        if (d != null) {
            var f = h.snapOffsetSnap(d, j.beforeOffsetSnapType, j.offsetType, j.afterOffsetSnapType, j.index, h);
            a.put(j, f)
        }
    }
};
MotifRenderElement.prototype.gatherVoiceAndHarmonyInfo = function (k, l, g, c, w, d, t, y, b) {
    var f = k.get(0);
    var h = positionUnitToBeats(this.startTime, this.startTimeUnit, f.tsNumerator, f.tsDenominator, k);
    var u = h;
    var m = k.getHarmonyIndexAt(u);
    for (var s = 0; s < l.length; s++) {
        var v = l[s];
        var x = k.getHarmonyIndexAt(u);
        var q = false;
        switch (this.cutHarmonyMode) {
            case RenderElementCutHarmonyMode.STOP:
                if (x != m) {
                    q = true
                }
                break;
            case RenderElementCutHarmonyMode.CONTINUE_ADAPT:
                break;
            case RenderElementCutHarmonyMode.CONTINUE_SAME:
                x = m;
                break
        }
        if (q) {
            break
        }
        c.put(v, x);
        var a = k.get(x);
        var p = g.get(x);
        w.put(v, a);
        d.put(v, p);
        if (!v.rest) {
            t.push(v)
        }
        var r = v.getBeatLength(a.tsNumerator, a.tsDenominator);
        u += r
    }
    for (var s = 0; s < t.length; s++) {
        var j = t[s];
        var n = null;
        if (s > 0) {
            n = t[s - 1]
        } else { }
        var o = null;
        if (s < t.length - 1) {
            o = t[s + 1]
        } else { }
        y.put(j, n);
        b.put(j, o)
    }
};
MotifRenderElement.prototype.getOrCreateVoiceLine = function (a, h) {
    var c = getObjectWithId(this.voiceLine, a.plannedVoiceLines);
    if (this.useVoiceLine) {
        if (!c) {
            console.log(" could not find voice line " + this.voiceLine + " in " + a.plannedVoiceLines);
            return
        }
    } else {
        var b = c;
        c = new ConstantVoiceLine();
        for (var g = 0; g < h.getCount(); g++) {
            var f = h.get(g);
            var k = new ConstantVoiceLineElement();
            var d = null;
            if (b) {
                d = b.get(g)
            }
            var j = f.getVerticalRelativeAbsoluteNote(this.relativeType, d);
            var e = getItemFromArrayWithStartEndItems(0, this.offsets, h.getCount(), g, this.startOffsets, this.endOffsets);
            j = f.offset(j, this.offsetType, e, f);
            k.index = j;
            k.indexType = IndexType.MIDI_NOTE;
            c.addVoiceLineElement(k)
        }
    }
    return c
};
MotifRenderElement.prototype.renderBatch = function (b) {
    var n = getValueOrExpressionValue(this, "activated", b.module);
    if (!n) {
        return
    }
    var e = b.module.getMotif(this.motif);
    if (!e) {
        console.log("could not find motif " + this.motif);
        return
    }
    var m = b.constantHarmony;
    var d = new CustomMap(true);
    var g = [];
    var c = new CustomMap(true);
    var p = new CustomMap(true);
    var q = new CustomMap(true);
    var o = new CustomMap(true);
    var k = new CustomMap(true);
    var f = this.getOrCreateVoiceLine(b, m);
    var h = b.voiceLineHarmonies[f.id];
    if (h) {
        m = h
    }
    var l = m.get(0);
    var j = positionUnitToBeats(this.startTime, this.startTimeUnit, l.tsNumerator, l.tsDenominator, m);
    var a = e.getConstantMotifElements(b.module, m, j);
    this.gatherVoiceAndHarmonyInfo(m, a, f, k, q, o, g, c, p);
    this.assignVerticalRelativeMotifElements(g, q, o, d);
    this.assignHorizontalRelativeMotifElements(m, k, f, g, d);
    this.figurate(m, a, d, q, k, c, p, f, e, b.module, b.section);
    this.render(m, a, f, d, b)
};

function ControlLine() {
    this.id = "";
    this._constructorName = "ControlLine"
}
ControlLine.prototype.copy = function () {
    return copyObjectDeep(this)
};
ControlLine.prototype.getPrimitiveControlLines = function (b, a) {
    return [this]
};
ControlLine.prototype.renderBatch = function (b) {
    var n = this.getPrimitiveControlLines(b.module, b.constantHarmony);
    var l = [];
    var m = [];
    for (var f = 0; f < n.length; f++) {
        var d = n[f];
        var c = b.module.getControlChannel(d.channel);
        if (!c) {
            console.log(" could not find control channel " + d.channel);
            continue
        }
        var a = d.getPrimitiveControlElements(b.module, b.constantHarmony);
        for (var g = 0; g < a.length; g++) {
            m.push(c)
        }
        addAll(l, a)
    }
    var k = b.constantHarmony.getBeatLength();
    for (var g = 0; g < l.length; g++) {
        var h = l[g];
        b.controlChannel = m[g];
        b.controlSlotData = b.controlSlotDatas[b.controlChannel.id];
        if (!b.controlSlotData) {
            b.controlSlotData = b.controlChannel.createSlotData(k);
            b.controlSlotDatas[b.controlChannel.id] = b.controlSlotData
        }
        h.renderBatch(b)
    }
};

function PrimitiveControlLine() {
    ControlLine.call(this);
    this.channel = "";
    this.controlElements = [];
    this._constructorName = "PrimitiveControlLine"
}
PrimitiveControlLine.prototype = new ControlLine();
PrimitiveControlLine.prototype.getPrimitiveControlElements = function (d, b) {
    var a = [];
    for (var c = 0; c < this.controlElements.length; c++) {
        var f = this.controlElements[c];
        addAll(a, f.getPrimitiveControlElements(d, b))
    }
    return a
};
PrimitiveControlLine.prototype.addControlElement = function (a) {
    this.controlElements.push(a);
    return this
};

function ControlElement() {
    this.id = "";
    this.active = true;
    this._constructorName = "ControlElement"
}
ControlElement.prototype.getPrimitiveControlElements = function (b, a) {
    return [this]
};

function PositionedControlElement() {
    ControlElement.call(this);
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;
    this.endTime = 1;
    this.endTimeUnit = PositionUnit.BEATS;
    this.controlOffset = 0;
    this.controlOffsetUnit = PositionUnit.BEATS;
    this._constructorName = "PositionedControlElement"
}
PositionedControlElement.prototype = new ControlElement();

function MultiStepControlElement() {
    PositionedControlElement.call(this);
    this.startIndices = [];
    this.indices = [];
    this.endIndices = [];
    this.elements = [];
    this._constructorName = "MultiStepControlElement"
}
MultiStepControlElement.prototype = new PositionedControlElement();
MultiStepControlElement.prototype.getPrimitiveControlElements = function (b, m) {
    var l = [];
    var h = getValueOrExpressionValue(this, "active", b);
    if (!h) {
        return l
    }
    var n = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, m);
    var s = m.getBeatLength();
    var e = getValueOrExpressionValue(this, "startIndices", b);
    var g = getValueOrExpressionValue(this, "indices", b);
    var t = getValueOrExpressionValue(this, "endIndices", b);
    if (this.verbose) {
        console.log(this._constructorName + " " + e + " " + g + " " + t + " " + this.activeExpression + " " + this.activeUseExpression)
    }
    var k = this;

    function c(B, E, u) {
        var F = 0;
        for (var x = 0; x < B.length; x++) {
            var A = B[x];
            if (A < u.length) {
                var y = u[A];
                var v = y.getPrimitiveControlElements(b, m);
                var z = 0;
                for (var w = 0; w < v.length; w++) {
                    var C = v[w];
                    var D = positionUnitToBeats2(C.endTime, C.endTimeUnit, F, m);
                    z = Math.max(z, D)
                }
                F += z
            }
        }
        return F
    }

    function o(B, E, u) {
        if (k.verbose) {
            console.log(" Rendering at index " + B + " beat: " + E)
        }
        var w = 1;
        if (B < u.length) {
            var x = u[B];
            x = copyObjectDeep(x);
            var v = x.getPrimitiveControlElements(b, m);
            var A = 0;
            for (var y = 0; y < v.length; y++) {
                var C = v[y];
                var z = positionUnitToBeats2(C.startTime, C.startTimeUnit, 0, m);
                var D = positionUnitToBeats2(C.endTime, C.endTimeUnit, 0, m);
                C.startTime = z + E;
                C.startTimeUnit = PositionUnit.BEATS;
                C.endTime = D + E;
                C.endTimeUnit = PositionUnit.BEATS;
                l.push(C);
                A = Math.max(A, D)
            }
            return Math.max(1, A)
        }
        return w
    }
    var a = 0;
    while (n < s) {
        var r = 1;
        var d = c(t, n, this.elements);
        var f = false;
        if (a < e.length) {
            var j = e[a];
            r = c([j], n, this.elements);
            if (n + r + d <= s) {
                r = o(j, n, this.elements)
            } else {
                f = true
            }
        } else {
            if (g.length > 0) {
                var j = g[positiveMod(a - e.length, g.length)];
                r = c([j], n, this.elements);
                if (n + r + d <= s) {
                    r = o(j, n, this.elements)
                } else {
                    f = true
                }
            } else {
                if (n + r + d > s) {
                    f = true
                }
            }
        }
        if (f) {
            r = s - n;
            n = s - d;
            var q = 0;
            for (var p = 0; p < t.length; p++) {
                q += o(t[p], n, this.elements)
            }
            if (q > 0.01) {
                r = q
            }
            break
        }
        n += r;
        a++
    }
    return l
};

function MultiParallelControlElement() {
    PositionedControlElement.call(this);
    this.indices = [];
    this.elements = [];
    this._constructorName = "MultiParallelControlElement"
}
MultiParallelControlElement.prototype = new PositionedControlElement();
MultiParallelControlElement.prototype.getPrimitiveControlElements = function (a, e) {
    var j = [];
    var b = getValueOrExpressionValue(this, "active", a);
    if (!b) {
        return j
    }
    var d = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, e);
    var h = getValueOrExpressionValue(this, "indices", a);
    if (this.verbose) {
        console.log(this._constructorName + " " + h + " " + this.activeExpression + " " + this.activeUseExpression)
    }
    var f = this;

    function g(p, s, k) {
        if (f.verbose) {
            console.log(f._constructorName + " Rendering at index " + p + " beat: " + s)
        }
        if (p < k.length) {
            var m = k[p];
            m = copyObjectDeep(m);
            var l = m.getPrimitiveControlElements(a, e);
            for (var n = 0; n < l.length; n++) {
                var q = l[n];
                var o = positionUnitToBeats2(q.startTime, q.startTimeUnit, 0, e);
                var r = positionUnitToBeats2(q.endTime, q.endTimeUnit, 0, e);
                q.startTime = o + s;
                q.startTimeUnit = PositionUnit.BEATS;
                q.endTime = r + s;
                q.endTimeUnit = PositionUnit.BEATS;
                j.push(q)
            }
        }
    }
    for (var c = 0; c < h.length; c++) {
        g(h[c], d, this.elements)
    }
    return j
};

function PrimitiveControlElement() {
    PositionedControlElement.call(this);
    this.batched = false;
    this._constructorName = "PrimitiveControlElement"
}
PrimitiveControlElement.prototype = new PositionedControlElement();
PrimitiveControlElement.prototype.renderBatch = function (c) {
    var f = getValueOrExpressionValue(this, "active", c.module);
    if (!f) {
        return
    }
    var k = c.constantHarmony;
    var h = positionUnitToBeats(this.startTime, this.startTimeUnit, k.tsNumerator, k.tsDenominator, k);
    var d = positionUnitToBeats(this.endTime, this.endTimeUnit, k.tsNumerator, k.tsDenominator, k);
    var n = c.controlSlotData;
    var m = c.controlChannel;
    var o = m.slotsPerBeat * h;
    var b = m.slotsPerBeat * d - 1;
    var l = b - o + 1;
    if (this.batched) {
        var e = [];
        var g = [];
        for (var j = o; j <= b; j++) {
            var a = (j - o) / l;
            g.push(a);
            e.push(j)
        }
        this.renderAtSlots(e, o, b, g, h, d, c, n)
    } else {
        for (var j = o; j <= b; j++) {
            var a = (j - o) / l;
            this.renderAtSlot(j, o, b, a, h, d, c, n)
        }
    }
};
PrimitiveControlElement.prototype.renderAtSlot = function (c, h, e, d, a, b, g, f) { };
PrimitiveControlElement.prototype.renderAtSlots = function (h, g, c, e, a, b, f, d) { };

function CurveControlElement() {
    PrimitiveControlElement.call(this);
    this.curve = "";
    this.cycles = 1;
    this.cyclesUnit = CyclesUnit.CYCLES_PER_PERIOD;
    this.amplitude = 1;
    this.bias = 0;
    this.phase = 0;
    this.frequencyMultiplier = 1;
    this.constantValue = 0;
    this.theCurve = null;
    this._constructorName = "CurveControlElement"
}
CurveControlElement.prototype = new PrimitiveControlElement();
CurveControlElement.prototype.renderAtSlot = function (g, j, c, a, f, d, b, h) {
    var k = a;
    this.theCurve = CurveComputation.prototype.getCurveReference(b.module, this.theCurve, this.curve);
    var e = CurveComputation.prototype.getCurveOrConstantValue(b.module, this.frequencyMultiplier * (k + this.phase), this.theCurve, this.constantValue);
    var l = this.bias + this.amplitude * e;
    if (this.verbose) {
        console.log(this._constructorName + " writing " + l + " at " + g + " rawValue: " + e + " amp: " + this.amplitude + " bias: " + this.bias + " slotFraction: " + a)
    }
    b.controlChannel.writeDouble(g, h, l)
};

function NaturalTempoCurveControlElement() {
    SectionModifier.call(this);
    this.baseTempo = 120;
    this.prevTempo = 120;
    this.currentTempo = 120;
    this.nextTempo = 120;
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.HARMONY;
    this.endTime = 1;
    this.endTimeUnit = PositionUnit.HARMONY;
    this.batched = true;
    this._constructorName = "NaturalTempoCurveControlElement"
}
NaturalTempoCurveControlElement.prototype = new PrimitiveControlElement();
NaturalTempoCurveControlElement.prototype.renderAtSlots = function (F, p, a, c, k, r, d, j) {
    var I = getValueOrExpressionValue(this, "baseTempo", d.module);
    var y = getValueOrExpressionValue(this, "prevTempo", d.module);
    var n = getValueOrExpressionValue(this, "currentTempo", d.module);
    var D = getValueOrExpressionValue(this, "nextTempo", d.module);
    var f = 0.95;
    var C = 1 - f;
    var m = n / I;
    var g = y / I;
    var h = D / I;
    var w = 0.5 * (g + 1);
    var z = 0.5 * (m + 1);
    var v = [0, 1];
    var t = [g, m];
    var q = [0, f, 1];
    var G = [g, m, z];
    var l = [0, C, 1];
    var B = [w, 1, m];
    var s = [0, C, f, 1];
    var J = [w, 1, m, z];
    var E = v;
    var b = t;
    if (n < y) {
        if (D >= n) {
            E = l;
            b = B
        } else {
            E = s;
            b = J
        }
    } else {
        if (n >= y) {
            if (D >= n) {
                E = v;
                b = t
            } else {
                E = q;
                b = G
            }
        }
    }
    var e = new LinearInterpolator(E, b);
    for (var A = 0; A < F.length; A++) {
        var o = c[A];
        var H = F[A];
        var u = e.interpolate(o);
        d.controlChannel.writeDouble(H, j, u)
    }
};

function GenMusicModule() {
    this.id = "module1";
    this.renderers = [];
    this.structures = [];
    this.sections = [];
    this.harmony = [];
    this.percussionMotifs = [];
    this.motifs = [];
    this.motifGroups = [];
    this.rythms = [];
    this.rythmGroups = [];
    this.curves = [];
    this.parameters = [];
    this.renderChannels = [];
    this.namedNotes = [];
    this.controlChannels = [];
    this.voiceLinePlanners = [];
    this.figurationPlanners = [];
    this._variables = [];
    this._variablesHash = {};
    this.voiceLines = [];
    this.idCounters = {};
    this.reusables = {};
    this._constructorName = "GenMusicModule"
}
GenMusicModule.prototype.getStructures = function () {
    return this.structures
};
GenMusicModule.prototype.addRenderer = function (a) {
    this.renderers.push(a);
    return this
};
GenMusicModule.prototype.addStructure = function (a) {
    this.structures.push(a);
    return this
};
GenMusicModule.prototype.addSection = function (a) {
    this.sections.push(a);
    return this
};
GenMusicModule.prototype.addHarmony = function (a) {
    this.harmony.push(a);
    return this
};
GenMusicModule.prototype.addMotif = function (a) {
    this.motifs.push(a);
    return this
};
GenMusicModule.prototype.addRythm = function (a) {
    this.rythms.push(a);
    return this
};
GenMusicModule.prototype.addCurve = function (a) {
    this.curves.push(a);
    return this
};
GenMusicModule.prototype.addRenderChannel = function (a) {
    this.renderChannels.push(a);
    return this
};
GenMusicModule.prototype.addControlChannel = function (a) {
    this.controlChannels.push(a);
    return this
};
GenMusicModule.prototype.addVoiceLinePlanner = function (a) {
    this.voiceLinePlanners.push(a);
    return this
};
GenMusicModule.prototype.addVariable = function (a) {
    this._variables.push(a);
    this._variablesHash[a.id] = a;
    return this
};
GenMusicModule.prototype.getRythm = function (a) {
    return getObjectWithId(a, this.rythms)
};
GenMusicModule.prototype.getVariable = function (a) {
    return this._variablesHash[a]
};
GenMusicModule.prototype.getCurve = function (a) {
    return getObjectWithId(a, this.curves)
};
GenMusicModule.prototype.getSynthRenderer = function (a) {
    return getObjectWithId(a, this.renderers)
};
GenMusicModule.prototype.getStructure = function (a) {
    return getObjectWithId(a, this.structures)
};
GenMusicModule.prototype.getSection = function (a) {
    return getObjectWithId(a, this.sections)
};
GenMusicModule.prototype.getHarmony = function (a) {
    return getObjectWithId(a, this.harmony)
};
GenMusicModule.prototype.getMotif = function (a) {
    return getObjectWithId(a, this.motifs)
};
GenMusicModule.prototype.getNamedNote = function (a) {
    return getObjectWithId(a, this.namedNotes)
};
GenMusicModule.prototype.getPercussionMotif = function (a) {
    return getObjectWithId(a, this.percussionMotifs)
};
GenMusicModule.prototype.getControlChannel = function (a) {
    return getObjectWithId(a, this.controlChannels)
};
GenMusicModule.prototype.getRenderChannel = function (a) {
    return getObjectWithId(a, this.renderChannels)
};
GenMusicModule.prototype.getVoiceLinePlanner = function (a) {
    return getObjectWithId(a, this.voiceLinePlanners)
};
GenMusicModule.prototype.getFigurationPlanner = function (a) {
    return getObjectWithId(a, this.figurationPlanners)
};
GenMusicModule.prototype.renderBatch = function (c) {
    var a = new RenderData();
    var b = this.getStructure(c);
    if (b) {
        var d = new RenderState(this, a);
        b.renderBatch(d)
    } else {
        console.log(" could not find structure " + c)
    }
    return a
};
var SplitStrategy = {
    NEVER: 0,
    HALVE: 1,
    DOT_FIRST: 2,
    DOT_SECOND: 3,
    TRIPLET: 4,
    DOT_NORMAL_DOT: 5,
    NORMAL_DOT_DOT: 6,
    DOT_DOT_NORMAL: 7
};

var DottedSplitStrategy = {
    NEVER: 0,
    LONGEST_FIRST: 1,
    LONGEST_LAST: 2,
    TWO_DOTTED: 3
};

var TripletSplitStrategy = {
    NEVER: 0,
    HALVE: 1
};

function SplitZone() {
    this.id = "";
    this.noteLengthInterval = [0, 16];
    this.noteLengthIntervalUnit = PositionUnit.BEATS;
    this.splitStrategy = SplitStrategy.HALVE;
    this.dottedSplitStrategy = DottedSplitStrategy.LONGEST_FIRST;
    this.tripletSplitStrategy = TripletSplitStrategy.HALVE;
    this.velocityMultipliers = [1, 0.95];
    this.dottedVelocityMultipliers = [1, 0.95];
    this.tripletVelocityMultipliers = [1, 0.97, 0.95];
    this.likelihood = 1;
    this.iterationInterval = [0, 128];
    this.positionInterval = [0, 1];
    this.positionIntervalUnit = PositionUnit.MEASURES;
    this.noteCountInterval = [0, 128];
    this.keepPattern = [1];
    this.maxApplications = 128;
    this._constructorName = "SplitZone"
}
SplitZone.prototype.applicable = function (e, f, d, a, c, g) {
    var b = positionUnitToBeats(e.length, e.lengthUnit, a, c);
    var l = positionUnitToBeats(this.noteLengthInterval[0], this.noteLengthIntervalUnit, a, c);
    var k = positionUnitToBeats(this.noteLengthInterval[1], this.noteLengthIntervalUnit, a, c);
    var j = b >= l && b <= k;
    if (j) {
        var m = positionUnitToBeats(this.positionInterval[0], this.positionIntervalUnit, a, c);
        var h = positionUnitToBeats(this.positionInterval[1], this.positionIntervalUnit, a, c);
        j = g >= m && g <= h
    }
    if (j) {
        j = f >= this.noteCountInterval[0] && f <= this.noteCountInterval[1]
    }
    if (j) {
        j = d >= this.iterationInterval[0] && d <= this.iterationInterval[1]
    }
    return j
};
SplitZone.prototype.setSplitStrategy = function (a) {
    this.splitStrategy = a;
    return this
};
SplitZone.prototype.setPositionInterval = function (a) {
    this.positionInterval = a;
    return this
};
SplitZone.prototype.setPositionIntervalUnit = function (a) {
    this.positionIntervalUnit = a;
    return this
};

function SplitZoneCollection() {
    this.id = "";
    this.minLength = 0.25;
    this.minLengthUnit = PositionUnit.BEATS;
    this.zones = [];
    this.defaultSplitStrategy = SplitStrategy.HALVE;
    this.defaultDottedSplitStrategy = DottedSplitStrategy.LONGEST_FIRST;
    this.defaultTripletSplitStrategy = TripletSplitStrategy.HALVE;
    this.defaultVelocityMultipliers = [1, 0.95];
    this.defaultDottedVelocityMultipliers = [1, 0.95];
    this.defaultTripletVelocityMultipliers = [1, 0.97, 0.95];
    this.tryHalveIfStrategyFails = true;
    this.seed = 12345;
    this._constructorName = "SplitZoneCollection"
}
SplitZoneCollection.prototype.addSplitZone = function (a) {
    this.zones.push(a);
    return this
};
SplitZoneCollection.prototype.splitAndCopy = function (n, p, m, d, l, b, c) {
    for (var h = 0; h < l.length; h++) {
        var o = positionUnitToBeats(l[h].length, l[h].lengthUnit, b, c);
        if (o < n) {
            return null
        }
    }
    var q = [];
    for (var h = 0; h < m.length; h++) {
        var k = m[h];
        var e = k.strength;
        if (h == p) {
            for (var f = 0; f < l.length; f++) {
                var a = l[f];
                var g = 1;
                if (d && d.length > 0) {
                    g = d[f % d.length]
                }
                a.strength = e * g;
                q.push(a)
            }
        } else {
            q.push(k)
        }
    }
    return q
};
SplitZoneCollection.prototype.split = function (a, n, o, p, h, j, c, k, e, s, b) {
    var d = j[h];
    var m = [];
    var l = [NoteRythmElementLengthType.NORMAL];
    var r = c;
    switch (d.lengthType) {
        case NoteRythmElementLengthType.NORMAL:
            r = c;
            switch (a) {
                case SplitStrategy.HALVE:
                    m = [0.5, 0.5];
                    l = [NoteRythmElementLengthType.NORMAL];
                    break;
                case SplitStrategy.DOT_FIRST:
                    m = [0.75, 0.25];
                    l = [NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.NORMAL];
                    break;
                case SplitStrategy.DOT_DOT_NORMAL:
                    m = [0.375, 0.375, 0.25];
                    l = [NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.NORMAL];
                    break;
                case SplitStrategy.DOT_NORMAL_DOT:
                    m = [0.375, 0.25, 0.375];
                    l = [NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.DOT];
                    break;
                case SplitStrategy.NORMAL_DOT_DOT:
                    m = [0.25, 0.375, 0.375];
                    l = [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.DOT];
                    break;
                case SplitStrategy.DOT_SECOND:
                    m = [0.25, 0.75];
                    l = [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.DOT];
                    break;
                case SplitStrategy.TRIPLET:
                    m = [1 / 3, 1 / 3, 1 / 3];
                    l = [NoteRythmElementLengthType.TRIPLET, NoteRythmElementLengthType.TRIPLET, NoteRythmElementLengthType.TRIPLET];
                    break;
                case SplitStrategy.NEVER:
                    return null
            }
            break;
        case NoteRythmElementLengthType.TRIPLET:
            r = e;
            switch (o) {
                case TripletSplitStrategy.HALVE:
                    m = [0.5, 0.5];
                    l = [NoteRythmElementLengthType.TRIPLET, NoteRythmElementLengthType.TRIPLET];
                    break;
                case TripletSplitStrategy.NEVER:
                    return null
            }
            break;
        case NoteRythmElementLengthType.DOT:
            r = k;
            switch (n) {
                case DottedSplitStrategy.LONGEST_FIRST:
                    m = [2 / 3, 1 / 3];
                    l = [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.NORMAL];
                    break;
                case DottedSplitStrategy.LONGEST_LAST:
                    m = [1 / 3, 2 / 3];
                    l = [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.NORMAL];
                    break;
                case DottedSplitStrategy.TWO_DOTTED:
                    m = [0.5, 0.5];
                    l = [NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.DOT];
                    break;
                case DottedSplitStrategy.NEVER:
                    return null
            }
            break
    }
    var g = [];
    for (var q = 0; q < m.length; q++) {
        var f = m[q];
        g.push(d.copy().setLength(d.length * f).setLengthType(l[q % l.length]))
    }
    return this.splitAndCopy(p, h, j, r, g, s, b)
};
SplitZoneCollection.prototype.getSplitBeat = function (c, b, j, k, a, e) {
    var h = b;
    var g = b.length;
    if (b.length >= j) {
        return h
    }
    var d = 0;
    var l = new CustomMap();
    while (true) {
        var f = this.singleSplit(c, k, h, j, a, e, d, l);
        d++;
        if (f == null) {
            break
        } else {
            h = f;
            if (h.length >= j || h.length == g) {
                break
            } else {
                g = h.length
            }
        }
    }
    return h
};
SplitZoneCollection.prototype.getBestSplitIndex = function (c, j, g, u, b) {
    var s = positionUnitToBeats(this.minLength, this.minLengthUnit, u, b);
    var p = j.length;
    var a = 0;
    for (var o = 0; o < j.length; o++) {
        var m = j[o];
        a += positionUnitToBeats(m.length, m.lengthUnit, u, b)
    }
    var q = a / p;
    var l = 999999999.9;
    var t = 0;
    var k = 0;
    for (var o = 0; o < j.length; o++) {
        var d = j[o];
        var n = positionUnitToBeats(d.length, d.lengthUnit, u, b);
        if (n > s * 1.0001) {
            var f = k / a;
            var e = g.getValue(c, f);
            var r = q / Math.pow(2, e);
            var h = r / n;
            if (h < l) {
                l = h;
                t = o
            }
        }
        k += n
    }
    return t
};
SplitZoneCollection.prototype.singleSplit = function (e, j, n, t, w, d, c, m) {
    var l = null;
    var q = positionUnitToBeats(this.minLength, this.minLengthUnit, w, d);
    var h = this.getBestSplitIndex(e, n, j);
    var b = n[h];
    var f = 0;
    for (var s = 0; s < h; s++) {
        f += positionUnitToBeats(n[s].length, n[s].lengthUnit, w, d)
    }
    f += 0.5 * positionUnitToBeats(n[h].length, n[h].lengthUnit, w, d);
    var r = [];
    for (var s = 0; s < this.zones.length; s++) {
        var k = this.zones[s];
        var v = m.get(k);
        if (typeof (v) === "undefined") {
            v = 0;
            m.put(k, v)
        }
        var o = v < k.maxApplications;
        if (o && k.applicable(b, t, c, w, d, f)) {
            r.push(k)
        }
    }
    if (r.length == 0) {
        l = this.split(this.defaultSplitStrategy, this.defaultDottedSplitStrategy, this.defaultTripletSplitStrategy, q, h, n, this.defaultVelocityMultipliers, this.defaultDottedVelocityMultipliers, this.defaultTripletVelocityMultipliers, w, d)
    } else {
        if (r.length > 0) {
            var u = null;
            if (r.length > 1) {
                var p = [];
                for (var s = 0; s < p.length; s++) {
                    p[s] = r[s].likelihood
                }
                if (this.rnd == null) {
                    this.rnd = new MersenneTwister(this.seed)
                }
                var g = sampleIndexIntegerDistribution(this.rnd, getProbabilityDistribution(p));
                u = r[g]
            } else {
                u = r[0]
            }
            var v = m.get(u);
            v++;
            m.put(u, v);
            var a = getValueOrExpressionValue(u, "splitStrategy", e);
            l = this.split(a, u.dottedSplitStrategy, u.tripletSplitStrategy, q, h, n, u.velocityMultipliers, u.dottedVelocityMultipliers, u.tripletVelocityMultipliers, w, d)
        } else {
            l = this.split(this.defaultSplitStrategy, this.defaultDottedSplitStrategy, this.defaultTripletSplitStrategy, q, h, n, this.defaultVelocityMultipliers, w, d)
        }
    }
    if (l == null && this.tryHalveIfStrategyFails) {
        l = this.split(SplitStrategy.HALVE, DottedSplitStrategy.TWO_DOTTED, TripletSplitStrategy.HALVE, q, h, n, this.defaultVelocityMultipliers, this.defaultDottedVelocityMultipliers, this.defaultTripletVelocityMultipliers, w, d)
    }
    return l
};

function Rythm() {
    this.id = "";
    this.rythmElements = [];
    this._constructorName = "Rythm"
}
Rythm.prototype.addRythmElement = function (a) {
    this.rythmElements.push(a);
    return this
};
Rythm.prototype.getNoteRythmElements = function (e, c, b) {
    var a = [];
    for (var d = 0; d < this.rythmElements.length; d++) {
        var f = this.rythmElements[d];
        addAll(a, f.getNoteRythmElements(e, c, b))
    }
    return a
};

function RythmElement() {
    this.id = "";
    this.length = 1;
    this.lengthUnit = PositionUnit.BEATS;
    this.strength = 1;
    this._constructorName = "RythmElement"
}
RythmElement.prototype.getNoteRythmElements = function (c, b, a) {
    if (this instanceof NoteRythmElement) {
        return [this]
    } else {
        console.log("RythmElements that are not NoteRythmElements must implement getNoteRythmElements()<br />")
    }
};
RythmElement.prototype.copy = function () {
    return copyObjectDeep(this)
};
RythmElement.prototype.setLength = function (a) {
    this.length = a;
    return this
};
RythmElement.prototype.setLengthUnit = function (a) {
    this.lengthUnit = a;
    return this
};
RythmElement.prototype.getLength = function () {
    return this.length
};
RythmElement.prototype.getLengthUnit = function () {
    return this.lengthUnit
};
var NoteRythmElementLengthType = {
    NORMAL: 0,
    DOT: 1,
    TRIPLET: 2
};

function NoteRythmElement() {
    RythmElement.call(this);
    this.rest = false;
    this.lengthType = NoteRythmElementLengthType.NORMAL;
    this._constructorName = "NoteRythmElement"
}
NoteRythmElement.prototype = new RythmElement();
NoteRythmElement.prototype.setLengthType = function (a) {
    this.lengthType = a;
    return this
};

function SequenceRythmElement() {
    RythmElement.call(this);
    this.elementLengths = [1];
    this.elementLengthUnit = PositionUnit.BEATS;
    this.elementLengthBorderMode = IndexBorderMode.RESTART;
    this.elementStrengths = [1];
    this.elementStrengthBorderMode = IndexBorderMode.RESTART;
    this.restPattern = [0];
    this.restPatternBorderMode = IndexBorderMode.RESTART;
    this.cutLast = true;
    this.minElementLength = 0;
    this.minElementLengthUnit = PositionUnit.BEATS;
    this._constructorName = "SequenceRythmElement"
}
SequenceRythmElement.prototype = new RythmElement();
SequenceRythmElement.prototype.getNoteRythmElements = function (c, h, d) {
    var q = [];
    if (this.elementLengths.length == 0) {
        return q
    }
    var n = h.getHarmonyAt(d);
    var p = positionUnitToBeats2(this.length, this.lengthUnit, d, h);
    var b = positionUnitToBeats2(this.minElementLength, d, h);
    var k = 0;
    var f = 0;
    while (f < p) {
        var l = IndexBorderMode.getIndex(this.elementLengthBorderMode, this.elementLengths.length, k);
        if (l == -1) {
            break
        }
        var o = this.elementLengths[l];
        var m = positionUnitToBeats(o, this.elementLengthUnit, n.tsNumerator, n.tsDenominator, h);
        var a = false;
        if (this.restPattern.length > 0) {
            var j = IndexBorderMode.getIndex(this.restPatternBorderMode, this.restPattern.length, k);
            if (j >= 0) {
                a = this.restPattern[j] != 0
            }
        }
        var g = false;
        if (f + m > p) {
            g = true;
            if (this.cutLast) {
                m = p - f
            } else {
                a = true
            }
        }
        if (!g || m >= b) {
            var e = new NoteRythmElement().setLength(m).setLengthUnit(PositionUnit.BEATS);
            e.rest = a;
            q.push(e)
        }
        if (g) {
            break
        }
        k++;
        f += m
    }
    return q
};

function SplitRythmElement() {
    RythmElement.call(this);
    this.autoDetectLengthType = true;
    this.startLengthType = NoteRythmElementLengthType.NORMAL;
    this.noteCount = 4;
    this.noteCountUnit = CountUnit.PLAIN;
    this.extraNoteCount = 0;
    this.extraNoteCountUnit = CountUnit.PLAIN;
    this.densityCurve = "";
    this.densityCurveAmplitude = 1;
    this.densityCurveBias = 0;
    this.densityCurveFrequency = 1;
    this.densityCurvePhase = 0;
    this.minLength = 0.25;
    this.minLengthUnit = PositionUnit.BEATS;
    this.splitZoneCollection = new SplitZoneCollection();
    this._constructorName = "SplitRythmElement"
}
SplitRythmElement.prototype = new RythmElement();
SplitRythmElement.prototype.addSplitZone = function (a) {
    this.splitZoneCollection.addSplitZone(a);
    return this
};
SplitRythmElement.prototype.getNoteRythmElements = function (e, m, c) {
    var f = getValueOrExpressionValue(this, "noteCount", e);
    var x = getValueOrExpressionValue(this, "extraNoteCount", e);
    var g = getValueOrExpressionValue(this, "startLengthType", e);
    var h = getValueOrExpressionValue(this, "length", e);
    f = CountUnit.getCount(f, this.noteCountUnit, m, c);
    f += CountUnit.getCount(x, this.extraNoteCountUnit, m, c);
    f = Math.round(f);
    var k = m.getHarmonyAt(c);
    var b = this.splitZoneCollection;
    b.minLength = this.minLength;
    b.minLengthUnit = this.minLengthUnit;
    var p = positionUnitToBeats2(h, this.lengthUnit, c, m);
    var a = new NoteRythmElement().setLength(p).setLengthUnit(PositionUnit.BEATS);
    if (this.autoDetectLengthType) {
        var j = [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.TRIPLET];
        var w = 9999999;
        var t = 0;
        var u = [1, 1.5, 1 / 3];
        for (var q = 0; q < u.length; q++) {
            var o = u[q];
            var s = p;
            var d = Math.abs(s - o);
            if (d < w) {
                w = d;
                t = q
            }
            while (s < o) {
                s *= 2;
                var d = Math.abs(s - o);
                if (d < w) {
                    w = d;
                    t = q
                }
            }
            while (s > o) {
                s /= 2;
                var d = Math.abs(s - o);
                if (d < w) {
                    w = d;
                    t = q
                }
            }
        }
        a.lengthType = j[t]
    } else {
        a.lengthType = g
    }
    var v = e.getCurve(this.densityCurve);
    if (v == null) {
        console.log("Could not find curve " + this.densityCurve + "<br />");
        v = {
            getValue: function (z, y) {
                return 0
            }
        }
    } else {
        var r = v;
        var l = this;
        v = {
            getValue: function (z, y) {
                return l.densityCurveBias + l.densityCurveAmplitude * r.getValue(z, l.densityCurveFrequency * (y + l.densityCurvePhase))
            }
        }
    }
    var n = b.getSplitBeat(e, [a], f, v, k.tsNumerator, k.tsDenominator);
    return n
};
SplitRythmElement.prototype.setNoteCount = function (a) {
    this.noteCount = a;
    return this
};
SplitRythmElement.prototype.setNoteCountUnit = function (a) {
    this.noteCountUnit = a;
    return this
};
SplitRythmElement.prototype.setExtraNoteCount = function (a) {
    this.extraNoteCount = a;
    return this
};
SplitRythmElement.prototype.setExtraNoteCountUnit = function (a) {
    this.extraNoteCountUnit = a;
    return this
};
SplitRythmElement.prototype.setDensityCurve = function (a) {
    this.densityCurve = a;
    return this
};

function AbstractSection() {
    this.id = "";
    this.active = true;
    this.modifiers = [];
    this._constructorName = "AbstractSection"
}
AbstractSection.prototype.getConcreteSections = function (a) {
    console.log("Sections need to implement getConcreteSections() " + this._constructorName + "<br />");
    return []
};
AbstractSection.prototype.concretizeSections = function (g, f) {
    var a = g;
    var c = false;
    do {
        c = true;
        for (var d = 0; d < a.length; d++) {
            if (!(a[d] instanceof Section)) {
                c = false
            }
        }
        if (!c) {
            var b = [];
            for (var d = 0; d < a.length; d++) {
                var e = a[d].getConcreteSections(f);
                addAll(b, e)
            }
            a = b
        }
    } while (!c);
    return a
};
AbstractSection.prototype.renderBatch = function (d) {
    var f = this.getConcreteSections(d);
    for (var c = 0; c < f.length; c++) {
        var a = f[c];
        if (!(a instanceof Section)) {
            console.log("Failed to concretize section... " + a._constructorName + " <br />");
            continue
        }
        for (var b = 0; b < this.modifiers.length; b++) {
            var e = this.modifiers[b];
            a = e.modifySection(a, d)
        }
        d.oldSectionTime = d.sectionTime;
        if (a.active) {
            a.renderBatch(d)
        }
        for (var b = 0; b < this.modifiers.length; b++) {
            var e = this.modifiers[b];
            e.beforeSectionFinalized(a, d)
        }
        for (var b = 0; b < this.modifiers.length; b++) {
            var e = this.modifiers[b];
            e.sectionRendered(a, d)
        }
    }
};

function SectionReference(a) {
    AbstractSection.call(this);
    this.section = a ? a : "";
    this._constructorName = "SectionReference"
}
SectionReference.prototype = new AbstractSection();
SectionReference.prototype.getConcreteSections = function (c) {
    var b = getValueOrExpressionValue(this, "section", c.module);
    var d = c.module.getSection(b);
    if (!d) {
        console.log("Could not find section " + b + "<br />");
        return []
    }
    var a = this.concretizeSections([d], c);
    return a
};
var SectionTempoMode = {
    CONSTANT: 0,
    CHANGE_CONTROL_CHANNEL: 1,
    CONTROL_CHANNEL: 2
};

function Section() {
    AbstractSection.call(this);
    this.harmonicRythm = "";
    this.voiceLinePlanner = "";
    this.figurationPlanner = "";
    this.tempoMode = SectionTempoMode.CONSTANT;
    this.tempo = 60;
    this.tempoChannel = "";
    this.voiceLines = [];
    this.renderLines = [];
    this.controlLines = [];
    this.suspAntStrategies = [];
    this._constructorName = "Section"
}
Section.prototype = new AbstractSection();
Section.prototype.getConcreteSections = function (a) {
    return [this]
};
Section.prototype.addVoiceLine = function (a) {
    this.voiceLines.push(a);
    return this
};
Section.prototype.addRenderLine = function (a) {
    this.renderLines.push(a);
    return this
};
Section.prototype.addControlLine = function (a) {
    this.controlLines.push(a);
    return this
};
Section.prototype.getVoiceLine = function (a) {
    return getObjectWithId(a, this.voiceLines)
};
Section.prototype.generateVoiceLineHarmonies = function (d, a, b) {
    var k = {};
    for (var e = 0; e < a.length; e++) {
        var h = a[e];
        var c = null;
        for (var f = 0; f < this.suspAntStrategies.length; f++) {
            var g = this.suspAntStrategies[f];
            if (arrayContains(g.voiceLines, h.id)) {
                c = g;
                break
            }
        }
        if (c) {
            k[h.id] = c.createVoiceLineHarmony(h, d, b)
        }
    }
    return k
};
Section.prototype.planVoices = function (d, a, b) {
    var p = [];
    if (this.voiceLinePlanner) {
        var n = getValueOrExpressionValue(this, "voiceLinePlanner", b);
        var h = b.getVoiceLinePlanner(n);
        if (!h) {
            console.log("Could not find voice line planner '" + n + "'<br />")
        } else {
            h.planVoices(a, d, b, p)
        }
    } else {
        for (var f = 0; f < a.length; f++) {
            var o = a[f];
            if (o instanceof DoubledVoiceLine) {
                continue
            }
            var m = o.getSingleStepVoiceLineElements(d, b);
            var k = new ConstantVoiceLine();
            k.id = o.id;
            for (var c = 0; c < m.length; c++) {
                var l = m[c];
                if (l instanceof ConstantVoiceLineElement || l instanceof UndefinedVoiceLineElement) {
                    k.add(l)
                } else {
                    console.log("Only supports Constant voice line elements when no voice line planner is selected")
                }
            }
            p.push(k)
        }
    }
    for (var f = 0; f < a.length; f++) {
        var o = a[f];
        if (o instanceof DoubledVoiceLine) {
            var g = o.doubleVoiceLine(p);
            if (g) {
                p.add(g)
            }
        }
    }
    return p
};
Section.prototype.renderBatch = function (e) {
    if (!this.active) {
        return
    }
    e.section = this;
    e.oldSectionTime = e.sectionTime;
    for (var w = 0; w < this.modifiers.length; w++) {
        var y = this.modifiers[w];
        e.section = y.modifySection(e.section, e)
    }
    var p = getValueOrExpressionValue(e.section, "harmonicRythm", e.module);
    var m = e.module.getHarmony(p);
    if (m) {
        e.harmony = m;
        var B = getValueOrExpressionValue(e.section, "tempo", e.module);
        var c = this.tempoMode;
        var s = m.getConstantHarmonyElements(e.module);
        var t = new ConstantHarmonicRythm(s);
        e.constantHarmony = t;
        for (var w = 0; w < this.modifiers.length; w++) {
            var y = this.modifiers[w];
            e.constantHarmony = y.modifyConstantHarmony(e.constantHarmony, e)
        }
        e.voiceLines = e.section.voiceLines;
        e.plannedVoiceLines = this.planVoices(e.constantHarmony, e.voiceLines, e.module);
        for (var w = 0; w < this.modifiers.length; w++) {
            var y = this.modifiers[w];
            e.plannedVoiceLines = y.modifyPlannedVoiceLines(e.plannedVoiceLines, e)
        }
        for (var w = 0; w < e.constantHarmony.getCount(); w++) {
            var b = e.constantHarmony.get(w);
            for (var u = 0; u < b.sectionModifiers.length; u++) {
                var y = b.sectionModifiers[u];
                e.plannedVoiceLines = y.modifyPlannedVoiceLines(e.plannedVoiceLines, e)
            }
        }
        e.voiceLineHarmonies = this.generateVoiceLineHarmonies(e.constantHarmony, e.plannedVoiceLines, e.module);
        e.renderLines = e.section.renderLines;
        e.controlLines = e.section.controlLines;
        for (var w = 0; w < e.renderLines.length; w++) {
            var l = e.renderLines[w];
            l.renderBatch(e)
        }
        for (var u = 0; u < b.sectionModifiers.length; u++) {
            var y = b.sectionModifiers[u];
            y.beforeControlRender(e)
        }
        for (var w = 0; w < e.controlLines.length; w++) {
            var l = e.controlLines[w];
            l.renderBatch(e)
        }
        for (var u = 0; u < b.sectionModifiers.length; u++) {
            var y = b.sectionModifiers[u];
            y.afterControlRender(e)
        }
        switch (c) {
            case SectionTempoMode.CONSTANT:
                e.data.addEvent(new SetTempoEvent(B, e.sectionTime));
                break;
            case SectionTempoMode.CHANGE_CONTROL_CHANNEL:
            case SectionTempoMode.CONTROL_CHANNEL:
                var x = e.module.getControlChannel(this.tempoChannel);
                if (x) {
                    var k = e.controlSlotDatas[x.id];
                    if (k) {
                        var g = e.constantHarmony.getBeatLength();
                        var r = 1 / x.slotsPerBeat;
                        var q = 0;
                        for (var w = 0; w < g; w++) {
                            for (var u = 0; u < x.slotsPerBeat; u++) {
                                var d = w * x.slotsPerBeat + u;
                                var h = x.readDouble(d, k);
                                var a = w + r * u;
                                var o = Math.round(B * h);
                                if (o > 10 && o != q) {
                                    e.data.addEvent(new SetTempoEvent(o, e.sectionTime + a));
                                    q = o
                                } else {
                                    if (o <= 10) {
                                        console.log("Tempo strange " + o + " tempoValue:" + h + " slot: " + d)
                                    }
                                }
                            }
                        }
                    } else {
                        var h = x.readDouble(0);
                        var o = Math.round(B * h);
                        e.data.addEvent(new SetTempoEvent(o, e.sectionTime))
                    }
                } else {
                    console.log("Could not find tempo channel " + x);
                    e.data.addEvent(new SetTempoEvent(B, e.sectionTime))
                }
                break
        }
        var v = e.constantHarmony.getBeatLength();
        for (var w = 0; w < e.module.controlChannels.length; w++) {
            var n = e.module.controlChannels[w];
            var k = e.controlSlotDatas[n.id];
            if (!k) {
                k = n.createSlotData(v);
                e.controlSlotDatas[n.id] = k
            }
        }
        for (var z in e.controlSlotDatas) {
            var k = e.controlSlotDatas[z];
            var A = e.module.getControlChannel(z);
            var f = A.getControlEvents(k, e.sectionTime);
            addAll(e.data.addEvents(f))
        }
        for (var w = 0; w < this.modifiers.length; w++) {
            var y = this.modifiers[w];
            y.beforeSectionFinalized(e.section, e)
        }
        for (var w = 0; w < this.modifiers.length; w++) {
            var y = this.modifiers[w];
            y.sectionRendered(e.section, e)
        }
        e.sectionTime += e.constantHarmony.getBeatLength();
        e.controlSlotDatas = {}
    } else {
        console.log(" could not find harmony " + p)
    }
};

function SectionModifier() {
    this.id = "";
    this.active = true;
    this._constructorName = "SectionModifier"
}
SectionModifier.prototype.modifySection = function (b, a) {
    return b
};
SectionModifier.prototype.modifyConstantHarmony = function (a, b) {
    return a
};
SectionModifier.prototype.modifyPlannedVoiceLines = function (a, b) {
    return a
};
SectionModifier.prototype.beforeControlRender = function (a) { };
SectionModifier.prototype.afterControlRender = function (a) { };
SectionModifier.prototype.beforeSectionFinalized = function (b, a) { };
SectionModifier.prototype.sectionRendered = function (b, a) { };

function NoteVelocitiesSectionModifier() {
    SectionModifier.call(this);
    this.curve = "";
    this.channel = "";
    this.curveBias = 0;
    this.curveMultiplier = 1;
    this.curveGlobalTime = true;
    this._constructorName = "NoteVelocitiesSectionModifier"
}
NoteVelocitiesSectionModifier.prototype = new SectionModifier();
NoteVelocitiesSectionModifier.prototype.beforeSectionFinalized = function (k, b) {
    var l = b.data.getEvents();
    var g = b.module.getCurve(this.curve);
    if (!g) {
        g = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT).setAmplitude(1)
    }
    var a = getValueOrExpressionValue(this, "curveMultiplier", b.module);
    var m = getValueOrExpressionValue(this, "curveBias", b.module);
    for (var d = 0; d < l.length; d++) {
        var h = l[d];
        if (h.time >= b.oldSectionTime && h instanceof NoteOnEvent) {
            if (!this.channel || h.renderChannel.id == this.channel) {
                var c = h.time;
                if (!this.curveGlobalTime) {
                    c = h.time - b.oldSectionTime
                }
                var f = g.getValue(b.module, c);
                var j = a * f + m;
                h.onVelocity *= j
            }
        }
    }
};

function ConditionalSuspendSectionModifier() {
    SectionModifier.call(this);
    this.suspendPitchClassPairs = [];
    this.harmonyIndex = 0;
    this._constructorName = "ConditionalSuspendSectionModifier"
}
ConditionalSuspendSectionModifier.prototype = new SectionModifier();
ConditionalSuspendSectionModifier.prototype.modifyPlannedVoiceLines = function (g, e) {
    var f = getValueOrExpressionValue(this, "active", e.module);
    if (f) {
        g = copyValueDeep(g);
        var b = [];
        var c = [];
        var d = [];
        var r = [];
        var k = [];
        for (var p = 0; p < g.length; p++) {
            var t = g[p];
            var s = t.get(this.harmonyIndex);
            var n = e.constantHarmony.get(this.harmonyIndex).getAbsoluteNoteConstantVoiceLineElement(s);
            var u = t.get(this.harmonyIndex + 1);
            var a = e.constantHarmony.get(this.harmonyIndex + 1).getAbsoluteNoteConstantVoiceLineElement(u);
            b.push(a);
            c.push(n);
            d.push(s);
            r.push(a % 12);
            k.push(n % 12)
        }
        for (var o = 0; o < this.suspendPitchClassPairs.length; o++) {
            var m = this.suspendPitchClassPairs[o];
            for (var p = 0; p < b.length; p++) {
                var l = c[p];
                var h = l % 12;
                var v = b[p];
                var q = v % 12;
                if (m[0] == h && m[1] == q) {
                    if (l <= v || l - v > 2) { } else {
                        d[p].suspend = true
                    }
                }
            }
        }
    }
    return g
};

function SetVariableValueSectionModifier() {
    SectionModifier.call(this);
    this.variable = "";
    this.variableProperty = "value";
    this.valueExpression = "";
    this.value = 0;
    this.restoreAfterRender = true;
    this.valueBefore = null;
    this.hasBeenSet = false;
    this._constructorName = "SetVariableValueSectionModifier"
}
SetVariableValueSectionModifier.prototype = new SectionModifier();
SetVariableValueSectionModifier.prototype.setVariable = function (a) {
    this.variable = a;
    return this
};
SetVariableValueSectionModifier.prototype.modifySection = function (d, c) {
    try {
        this.hasBeenSet = false;
        var a = null;
        if (this.valueExpression) {
            a = getExpressionValue(this.valueExpression, c.module)
        } else {
            a = this.value
        }
        if (!(typeof (a) === "undefined") && a != null) {
            var e = c.module.getVariable(this.variable);
            if (e) {
                if (typeof (e[this.variableProperty]) === "undefined") {
                    console.log("The variable " + this.variable + " does not have a property '" + this.variableProperty + "' <br />")
                } else {
                    this.valueBefore = e[this.variableProperty];
                    e[this.variableProperty] = a;
                    this.hasBeenSet = true
                }
            }
        }
    } catch (b) {
        console.log("" + b);
        console.log(this._constructorName + " Error in modifySection " + this.valueExpression);
        var a = getExpressionValue(this.valueExpression, c.module)
    }
    return d
};
SetVariableValueSectionModifier.prototype.sectionRendered = function (b, a) {
    if (this.restoreAfterRender && this.hasBeenSet) {
        var c = a.module.getVariable(this.variable);
        if (c) {
            c[this.variableProperty] = this.valueBefore
        }
    }
};

function ChangeHarmonySectionModifier() {
    SectionModifier.call(this);
    this.harmony = "";
    this._constructorName = "ChangeHarmonySectionModifier"
}
ChangeHarmonySectionModifier.prototype = new SectionModifier();
ChangeHarmonySectionModifier.prototype.modifySection = function (b, a) {
    var c = copyObjectDeep(b);
    c.harmonicRythm = this.harmony;
    return c
};

function ChangeTempoSectionModifier() {
    SectionModifier.call(this);
    this.tempo = 60;
    this._constructorName = "ChangeTempoSectionModifier"
}
ChangeTempoSectionModifier.prototype = new SectionModifier();
ChangeTempoSectionModifier.prototype.modifySection = function (b, a) {
    var c = copyObjectDeep(b);
    c.tempo = this.tempo;
    return c
};

function TransposeSectionModifier() {
    SectionModifier.call(this);
    this.semiSteps = 0;
    this._constructorName = "TransposeSectionModifier"
}
TransposeSectionModifier.prototype = new SectionModifier();
TransposeSectionModifier.prototype.modifyConstantHarmony = function (a, d) {
    var e = copyObjectDeep(a);
    for (var b = 0; b < e.getCount(); b++) {
        var c = e.get(b);
        c.baseNote += this.semiSteps
    }
    return e
};

function AbstractZone() {
    this.id = "";
    this.start = 0;
    this.end = 1;
    this.positionUnit = PositionUnit.MEASURES;
    this.useLengthRange = false;
    this.lengthRange = [0, 1];
    this.lengthRangeUnit = PositionUnit.MEASURES;
    this._constructorName = "AbstractZone"
}
AbstractZone.prototype.convertLengthRange = function (e, b, c, a) {
    var d = positionUnitToBeats2(this.lengthRange[0], this.lengthRangeUnit, a, c);
    var g = positionUnitToBeats2(this.lengthRange[1], this.lengthRangeUnit, a, c);
    var f = b - e;
    f = clamp(f, d, g);
    return e + f
};
AbstractZone.prototype.containsPosition = function (e, c, b) {
    var d = positionUnitToBeats2(this.start, this.positionUnit, b, c);
    var a = positionUnitToBeats2(this.end, this.positionUnit, b, c);
    if (this.useLengthRange) {
        a = this.convertLengthRange(d, a, c, b)
    }
    return e >= d && e < a
};
AbstractZone.prototype.intersectsRange = function (d, c, b) {
    var e = positionUnitToBeats2(this.start, this.positionUnit, b, c);
    var a = positionUnitToBeats2(this.end, this.positionUnit, b, c);
    if (this.useLengthRange) {
        a = this.convertLengthRange(e, a, c, b)
    }
    return intervalIntersect(d, [e, a])
};
var MotifZoneFillerLengthMode = {
    ABSOLUTE: 0,
    RELATIVE_MULT: 1,
    RELATIVE_ADD: 2
};


function MotifZone() {
    AbstractZone.call(this);
    this.useNoteRangeIfEmpty = false;
    this.fillerOffsets = [];
    this.fillerOffsetTypes = [OffsetType.CHORD];
    this.fillerOnOffs = [1];
    this.fillerSnapTypes = [SnapType.NONE];
    this.fillerIndexBorderMode = IndexBorderMode.CLAMP;
    this.fillerLengthModes = [MotifZoneFillerLengthMode.RELATIVE_ADD];
    this.fillerRelativeLengths = [
        [0]
    ];
    this.fillerLengths = [
        [1]
    ];
    this.fillerLengthUnits = [PositionUnit.BEATS];
    this.fillerPositionOffsets = [
        [0]
    ];
    this.fillerPositionOffsetUnits = [PositionUnit.BEATS];
    this.fillerRelativeTypes = [VerticalRelativeType.NOTE];
    this.fillerRelativeStrengths = [
        [1]
    ];
    this._constructorName = "MotifZone"
}
MotifZone.prototype = new AbstractZone();
MotifZone.prototype.addFillers = function (l, p, b) {
    var x = getValueOrExpressionValue(this, "fillerOffsets", b);
    var m = IndexBorderMode.getIndex(this.fillerIndexBorderMode, x.length, l);
    if (m >= 0) {
        var j = x[m];
        var d = this.fillerOnOffs[m % this.fillerOnOffs.length];
        if (d == 0) {
            return
        }
        var f = this.fillerLengthModes[m % this.fillerLengthModes.length];
        var r = this.fillerRelativeLengths[m % this.fillerRelativeLengths.length];
        var e = this.fillerRelativeStrengths[m % this.fillerRelativeStrengths.length];
        var v = this.fillerLengths[m % this.fillerLengths.length];
        var g = this.fillerLengthUnits[m % this.fillerLengthUnits.length];
        var o = this.fillerPositionOffsets[m % this.fillerPositionOffsets.length];
        var q = this.fillerPositionOffsetUnits[m % this.fillerPositionOffsetUnits.length];
        var u = this.fillerRelativeTypes[m % this.fillerRelativeTypes.length];
        var n = this.fillerOffsetTypes[m % this.fillerOffsetTypes.length];
        var s = this.fillerSnapTypes[m % this.fillerSnapTypes.length];
        for (var t = 0; t < j.length; t++) {
            var h = j[t];
            var k = o[t % o.length];
            var c = new FillerNote();
            c.offset = h;
            c.offsetType = n;
            c.snapType = s;
            c.relativeType = u;
            c.positionOffset = k;
            c.positionOffsetUnit = q;
            var w = r[t % r.length];
            var a = e[t % e.length];
            c.strength = p.strength * a;
            switch (f) {
                case MotifZoneFillerLengthMode.ABSOLUTE:
                    c.length = v[t % v.length];
                    c.lengthUnit = g;
                    break;
                case MotifZoneFillerLengthMode.RELATIVE_ADD:
                    c.length = p.length + w;
                    c.lengthUnit = p.lengthUnit;
                    break;
                case MotifZoneFillerLengthMode.RELATIVE_MULT:
                    c.length = p.length * w;
                    c.lengthUnit = p.lengthUnit;
                    break
            }
            p.addFiller(c)
        }
    }
};
MotifZone.prototype.applyMotifZone = function (b, a) {
    console.log("MotifZone must implement applyMotifZone()<br />");
    return null
};

function SimpleVerticalRelativeMotifZone() {
    MotifZone.call(this);
    this.indices = [0];
    this.indexBorderMode = IndexBorderMode.END;
    this.relativeType = VerticalRelativeType.VOICE_LINE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "SimpleVerticalRelativeMotifZone"
}
SimpleVerticalRelativeMotifZone.prototype = new MotifZone();
SimpleVerticalRelativeMotifZone.prototype.applyMotifZone = function (g, d) {
    var a = [];
    var j = 0;
    for (var c = 0; c < g.length; c++) {
        var h = g[c];
        var f = new VerticalRelativeMotifElement();
        f.length = h.length;
        f.lengthUnit = h.lengthUnit;
        f.rest = h.rest;
        f.strength = h.strength;
        var b = 0;
        if (this.indices.length > 0) {
            b = IndexBorderMode.getIndex(this.indexBorderMode, this.indices.length, c)
        }
        if (b >= 0) {
            f.index = this.indices.length > 0 ? this.indices[b] : 0;
            f.relativeType = this.relativeType;
            f.offsetType = this.offsetType;
            f.beforeOffsetSnapType = this.beforeOffsetSnapType;
            f.afterOffsetSnapType = this.afterOffsetSnapType
        } else {
            f.rest = true
        }
        a.push(f);
        if (!f.rest) {
            this.addFillers(j, f, d);
            j++
        }
    }
    return a
};

function SimpleHorizontalRelativeMotifZone() {
    MotifZone.call(this);
    this.indices = [0];
    this.indexBorderMode = IndexBorderMode.END;
    this.relativeType = HorizontalRelativeType.NEXT_NOTE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "SimpleHorizontalRelativeMotifZone"
}
SimpleHorizontalRelativeMotifZone.prototype = new MotifZone();
SimpleHorizontalRelativeMotifZone.prototype.applyMotifZone = function (f) {
    var a = [];
    for (var c = 0; c < f.length; c++) {
        var g = f[c];
        var d = new HorizontalRelativeMotifElement();
        d.length = g.length;
        d.lengthUnit = g.lengthUnit;
        d.rest = g.rest;
        d.strength = g.strength;
        var b = 0;
        if (this.indices.length > 0) {
            b = IndexBorderMode.getIndex(this.indexBorderMode, this.indices.length, c)
        }
        if (b >= 0) {
            d.index = this.indices.length > 0 ? this.indices[b] : 0;
            d.relativeType = this.relativeType;
            d.offsetType = this.offsetType;
            d.beforeOffsetSnapType = this.beforeOffsetSnapType;
            d.afterOffsetSnapType = this.afterOffsetSnapType
        } else {
            d.rest = true
        }
        a.push(d)
    }
    return a
};

function AdaptiveConnectMotifZone() {
    MotifZone.call(this);
    this.firstPartOfChord = false;
    this.firstConnectToPrevious = true;
    this.lastConnectToNext = true;
    this.horizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.horizontalLikelihoods = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.01, 1, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01];
    this.firstToPreviousHorizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.firstToPreviousHorizontalLikelihoods = [0.025, 0.025, 0.025, 0.05, 0.05, 0.1, 1, 0.2, 1, 0.1, 0.05, 0.05, 0.025, 0.025, 0.025];
    this.lastToNextHorizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.lastToNextHorizontalLikelihoods = [0.00005, 0.00005, 0.00005, 0.0001, 0.001, 0.01, 1, 0.01, 1, 0.01, 0.001, 0.0001, 0.00005, 0.00005, 0.00005];
    this._constructorName = "AdaptiveConnectMotifZone"
}
AdaptiveConnectMotifZone.prototype = new MotifZone();
AdaptiveConnectMotifZone.prototype.applyMotifZone = function (a, b) {
    var l = [];
    var k = false;
    var j = null;
    for (var f = 0; f < a.length; f++) {
        var g = a[f];
        var h = new AdaptiveMotifElement();
        h.length = g.length;
        h.lengthUnit = g.lengthUnit;
        h.rest = g.rest;
        h.strength = g.strength;
        h.horizontalDomainTypes = [AdaptiveHorizontalDomainType.ENUMERABLE];
        h.horizontalRelativeTypes = [HorizontalRelativeType.NEXT_NOTE];
        h.horizontalDomainOffsetTypes = [OffsetType.SCALE];
        h.verticalDomainOffsetRange = [-25, 25];
        h.verticalDomainOffsetElements = [-1, 0, 1];
        h.verticalDomainOffsetElementLikelihoods = [1, 1, 1];
        var d = this.horizontalOffsets;
        var c = this.horizontalLikelihoods;
        if (f == a.length - 1 && this.lastToNextHorizontalLikelihoods.length > 0 && this.lastToNextHorizontalOffsets.length > 0) {
            d = this.lastToNextHorizontalOffsets;
            c = this.lastToNextHorizontalLikelihoods
        }
        h.horizontalDomainOffsetElements = [d];
        h.horizontalDomainOffsetLikelihoods = [c];
        if (!h.rest) {
            j = h
        }
        if (!k && !h.rest) {
            if (this.firstConnectToPrevious) {
                var d = this.horizontalOffsets;
                var c = this.horizontalLikelihoods;
                if (this.firstToPreviousHorizontalOffsets.length > 0 && this.firstToPreviousHorizontalLikelihoods.length > 0) {
                    d = this.firstToPreviousHorizontalOffsets;
                    c = this.firstToPreviousHorizontalLikelihoods
                }
                h.horizontalDomainTypes.push(AdaptiveHorizontalDomainType.ENUMERABLE);
                h.horizontalRelativeTypes.push(HorizontalRelativeType.PREVIOUS_NOTE);
                h.horizontalDomainOffsetTypes.push(OffsetType.SCALE);
                h.horizontalDomainOffsetElements.push(d);
                h.horizontalDomainOffsetLikelihoods.push(c)
            }
            k = true
        }
        l.push(h);
        if (!h.rest) {
            this.addFillers(f, h, b)
        }
    }
    return l
};

function AdaptiveEmbellishMotifZone() {
    MotifZone.call(this);
    this.verticalIndices = [0];
    this.verticalOffsetDomains = [
        [-1, 0, 1]
    ];
    this.verticalOffsetLikelihoods = [
        [1]
    ];
    this.startVerticalIndices = [0];
    this.startVerticalOffsetDomains = [
        [0]
    ];
    this.startVerticalOffsetLikelihoods = [
        [1]
    ];
    this.endVerticalIndices = [];
    this.endVerticalOffsetDomains = [];
    this.endVerticalOffsetLikelihoods = [];
    this.verticalDomainOffsetType = OffsetType.SCALE;
    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;
    this.constantVerticalOffset = 0;
    this.constantVerticalOffsetType = OffsetType.HALF_STEP;
    this.useHorizontalOffsets = true;
    this.useFirstHorizontalOffsets = true;
    this.useLastHorizontalOffsets = false;
    this.horizontalOffsets = [
        [-1, 0, 1]
    ];
    this.horizontalLikelihoods = [
        [1, 0.001, 1]
    ];
    this.startHorizontalOffsets = [];
    this.startHorizontalLikelihoods = [];
    this.endHorizontalOffsets = [];
    this.endHorizontalLikelihoods = [];
    this.horizontalDomainOffsetType = OffsetType.SCALE;
    this._constructorName = "AdaptiveEmbellishMotifZone"
}
AdaptiveEmbellishMotifZone.prototype = new MotifZone();
AdaptiveEmbellishMotifZone.prototype.applyMotifZone = function (k, a) {
    var g = [];
    var d = [];
    for (var p = 0; p < k.length; p++) {
        var r = k[p];
        if (!r.rest) {
            d.push(r)
        }
    }
    var q = 0;
    var v = d.length;
    var n = getValueOrExpressionValue(this, "verticalIndices", a);
    var h = getValueOrExpressionValue(this, "startVerticalIndices", a);
    var t = getValueOrExpressionValue(this, "endVerticalIndices", a);
    for (var p = 0; p < k.length; p++) {
        var r = k[p];
        var u = new AdaptiveMotifElement();
        u.length = r.length;
        u.lengthUnit = r.lengthUnit;
        u.rest = r.rest;
        u.strength = r.strength;
        u.verticalDomainType = AdaptiveVerticalDomainType.ENUMERABLE;
        u.verticalDomainOffsetType = this.verticalDomainOffsetType;
        u.verticalRelativeType = this.verticalRelativeType;
        u.constantVerticalOffset = this.constantVerticalOffset;
        u.constantVerticalOffsetType = this.constantVerticalOffsetType;
        var c = true;
        if (n.length == 0 && h.length == 0 && t.length == 0) {
            c = false;
            u.rest = true
        }
        if (c && !u.rest) {
            var m = getItemFromArrayWithStartEndItems(0, n, v, q, h, t);
            var l = getItemFromArrayWithStartEndItems(0, this.verticalOffsetDomains, v, q, this.startVerticalOffsetDomains, this.endVerticalOffsetDomains);
            var w = getItemFromArrayWithStartEndItems(0, this.verticalOffsetLikelihoods, v, q, this.startVerticalOffsetLikelihoods, this.endVerticalOffsetLikelihoods);
            var f = [];
            for (var o = 0; o < l.length; o++) {
                f[o] = l[o] + m
            }
            u.verticalDomainOffsetElements = f;
            u.verticalDomainOffsetElementLikelihoods = w;
            u.horizontalRelativeTypes = [];
            if (this.useHorizontalOffsets && (q != 0 || this.useFirstHorizontalOffsets) && (q != v - 1 || this.useLastHorizontalOffsets)) {
                u.horizontalDomainTypes = [AdaptiveHorizontalDomainType.ENUMERABLE];
                u.horizontalRelativeTypes = [HorizontalRelativeType.NEXT_NOTE];
                u.horizontalDomainOffsetTypes = [OffsetType.SCALE];
                var b = getItemFromArrayWithStartEndItems([-1, 0, 1], this.horizontalOffsets, v, q, this.startHorizontalOffsets, this.endHorizontalOffsets);
                var s = getItemFromArrayWithStartEndItems([1], this.horizontalLikelihoods, v, q, this.startHorizontalLikelihoods, this.endHorizontalLikelihoods);
                u.horizontalDomainOffsetElements = [b];
                u.horizontalDomainOffsetLikelihoods = [s];
                u.horizontalDomainOffsetTypes = [this.horizontalDomainOffsetType]
            }
            q++
        }
        g.push(u);
        if (!u.rest) {
            this.addFillers(p, u, a)
        }
    }
    return g
};

function PercussionMotifZone() {
    AbstractZone.call(this);
    this.activated = true;
    this._constructorName = "PercussionMotifZone"
}
PercussionMotifZone.prototype = new AbstractZone();

function VersatilePercussionMotifZone() {
    PercussionMotifZone.call(this);
    this.useNamedNotes = true;
    this.namedNotes = [];
    this.notes = [];
    this.noteIndexPattern = [
        [0]
    ];
    this.startNoteIndexPattern = [];
    this.endNoteIndexPattern = [];
    this.positionOffsetPattern = [
        [0]
    ];
    this.startPositionOffsetPattern = [];
    this.endPositionOffsetPattern = [];
    this.positionOffsetUnit = PositionUnit.BEATS;
    this.beatConditionMultiplier = 1;
    this.beatConditionBias = 0;
    this.beatConditionDivisorCheck = 1;
    this.beatConditionDivisorCheckUnit = PositionUnit.MEASURES;
    this.beatConditionMaxRelativeDistance = 0.01;
    this.beatConditionQuotients = [];
    this.beatConditionRemainders = [];
    this.beatConditionQuotientStrengths = [1];
    this.beatConditionRemainderStrengths = [1];
    this._constructorName = "VersatilePercussionMotifZone"
}
VersatilePercussionMotifZone.prototype = new PercussionMotifZone();
VersatilePercussionMotifZone.prototype.getPercussionMotifElements = function (g, m, u, b) {
    var t = [];
    var C = getValueOrExpressionValue(this, "activated", g);
    var y = 0;
    var F = [];
    var p = [];
    var o = [];
    var B = [];
    var J = [];
    var n = this.beatConditionQuotients.length == 0 && this.beatConditionRemainders.length == 0;
    for (var I = 0; I < m.length; I++) {
        var l = u.getHarmonyAt(y + b);
        var x = m[I];
        var H = positionUnitToBeats(x.length, x.lengthUnit, l.tsNumerator, l.tsDenominator, u);
        var w = C;
        var L = x.strength;
        if (!n) {
            w = false;
            var E = positionUnitToBeats(this.beatConditionDivisorCheck, this.beatConditionDivisorCheckUnit, l.tsNumerator, l.tsDenominator, u);
            var k = y * this.beatConditionMultiplier + this.beatConditionBias;
            var c = k / E;
            var v = mod(k, E);
            for (var G = 0; G < this.beatConditionQuotients.length; G++) {
                var A = this.beatConditionQuotients[G];
                if (Math.abs(A - c) <= this.beatConditionMaxRelativeDistance) {
                    w = C;
                    if (this.beatConditionQuotientStrengths.length > 0) {
                        L *= this.beatConditionQuotientStrengths[G % this.beatConditionQuotientStrengths.length]
                    }
                    break
                }
            }
            for (var G = 0; G < this.beatConditionRemainders.length; G++) {
                var z = this.beatConditionRemainders[G];
                if (Math.abs(z - v) <= this.beatConditionMaxRelativeDistance) {
                    w = C;
                    if (this.beatConditionRemainderStrengths.length > 0) {
                        L *= this.beatConditionRemainderStrengths[G % this.beatConditionRemainderStrengths.length]
                    }
                    break
                }
            }
        }
        if (w) {
            F.push(x);
            p.push(y);
            o.push(H);
            B.push(l);
            J.push(L)
        }
        y += H
    }
    var K = y;
    var s = 0;
    for (var I = 0; I < F.length; I++) {
        var f = getItemFromArrayWithStartEndItems([], this.noteIndexPattern, F.length, I, this.startNoteIndexPattern, this.endNoteIndexPattern);
        var a = getItemFromArrayWithStartEndItems([], this.positionOffsetPattern, F.length, I, this.startPositionOffsetPattern, this.endPositionOffsetPattern);
        if (a.length == 0) {
            a = [0]
        }
        var l = B[I];
        for (var G = 0; G < f.length; G++) {
            var M = new PrimitivePercussionMotifElement();
            var e = positionUnitToBeats(a[G % a.length], this.positionOffsetUnit, l.tsNumerator, l.tsDenominator, u);
            M.startTime = p[I] + e;
            M.startTimeUnit = PositionUnit.BEATS;
            M.length = o[I];
            M.lengthUnit = PositionUnit.BEATS;
            M.rest = x.rest;
            M.strength = J[I];
            var h = MidiDrum.BASS_DRUM_1;
            if (this.useNamedNotes) {
                if (this.namedNotes.length > 0) {
                    var d = this.namedNotes[f[G] % this.namedNotes.length];
                    var D = g.getNamedNote(d);
                    if (D) {
                        h = D.note
                    }
                }
            } else {
                if (this.notes.length > 0) {
                    h = this.notes[f[G] % this.notes.length]
                }
            }
            s = Math.max(s, M.startTime + M.length);
            M.note = h;
            t.push(M)
        }
    }
    if (s < K) {
        var M = new PrimitivePercussionMotifElement();
        M.startTime = s;
        M.startTimeUnit = PositionUnit.BEATS;
        M.length = K - s;
        M.lengthUnit = PositionUnit.BEATS;
        M.rest = true;
        t.push(M)
    }
    return t
};

function Motif() {
    this.id = "";
    this.motifElements = [];
    this.motifZones = [];
    this.modifiers = [];
    this.rythmBased = false;
    this.rythm = "";
    this.inheritedMotif = "";
    this.seed = 12345;
    this.useExternalSeed = false;
    this._constructorName = "Motif"
}
Motif.prototype.getConstantMotifElements = function (c, n, b, v) {
    if (!v) {
        v = new CustomMap(true)
    }
    var l = [];
    if (this.inheritedMotif) {
        var q = c.getMotif(this.inheritedMotif);
        if (q) {
            if (v.get(this)) {
                console.log("Motif detected inherit loop...")
            } else {
                v.put(this, this);
                var D = q.getConstantMotifElements(c, n, b, v);
                addAll(l, D)
            }
        }
    } else {
        if (this.rythmBased) {
            var I = c.getRythm(this.rythm);
            if (I) {
                var s = n.getHarmonyIndexAt(b);
                var d = I.getNoteRythmElements(c, n, b);
                d = arrayCopyWithCopy(d);
                var B = [];
                var A = [];
                var J = [];
                var r = 0;
                for (var y = 0; y < d.length; y++) {
                    var f = d[y];
                    var a = positionUnitToBeats2(f.length, f.lengthUnit, b, n);
                    f.length = a;
                    f.lengthUnit = PositionUnit.BEATS;
                    B[y] = -1;
                    var H = n.getHarmonyIndexAt(r + b);
                    var g = n.get(H);
                    for (var z = 0; z < this.motifZones.length; z++) {
                        if (!A[z]) {
                            A[z] = []
                        }
                        if (!J[z]) {
                            J[z] = []
                        }
                        var E = this.motifZones[z];
                        if (E.intersectsRange([r, r + a], n, b)) {
                            J[z].push(y)
                        }
                    }
                    for (var z = 0; z < this.motifZones.length; z++) {
                        var E = this.motifZones[z];
                        if (E.containsPosition(r, n, b)) {
                            A[z].push(y);
                            B[y] = z;
                            break
                        }
                    }
                    r += a
                }
                for (var z = 0; z < this.motifZones.length; z++) {
                    var E = this.motifZones[z];
                    if (E.useNoteRangeIfEmpty && A[z].length == 0) {
                        for (var y = 0; y < J[z].length; y++) {
                            var h = J[z][y];
                            if (B[h] == -1) {
                                A[z].push(h);
                                B[h] = z
                            }
                        }
                    }
                }
                var G = {};
                for (var y = 0; y < d.length; y++) {
                    var f = d[y];
                    if (f.rest || B[y] == -1) {
                        var p = new ConstantMotifElement();
                        p.rest = true;
                        p.length = f.length;
                        p.lengthUnit = f.lengthUnit;
                        l.push(p)
                    } else {
                        var F = B[y];
                        if (!G[F]) {
                            var E = this.motifZones[B[y]];
                            var u = A[B[y]];
                            var o = [];
                            for (var x = 0; x < u.length; x++) {
                                o[x] = d[u[x]]
                            }
                            var t = E.applyMotifZone(o, c);
                            addAll(l, t);
                            G[F] = true
                        }
                    }
                }
            } else {
                console.log(" could not find rythm " + this.rythm)
            }
        } else {
            for (var z = 0; z < this.motifElements.length; z++) {
                var C = this.motifElements[z];
                var D = C.getConstantMotifElements(c, n, b, v);
                addAll(l, D)
            }
        }
    }
    for (var z = 0; z < this.modifiers.length; z++) {
        var w = this.modifiers[z];
        l = w.apply(c, l)
    }
    return l
};

function MotifElement() {
    this.id = "";
    this.length = 1;
    this.lengthUnit = PositionUnit.BEATS;
    this.strength = 1;
    this._constructorName = "MotifElement"
}
MotifElement.prototype.getConstantMotifElements = function (d, c, b, a) {
    return [this]
};
MotifElement.prototype.setLength = function (a) {
    this.length = a;
    return this
};
MotifElement.prototype.setLengthUnit = function (a) {
    this.lengthUnit = a;
    return this
};
MotifElement.prototype.getLength = function () {
    return this.length
};
MotifElement.prototype.getLengthUnit = function () {
    return this.lengthUnit
};
MotifElement.prototype.set = function (a) {
    MotifElement.set.call(this, a);
    a.length = this.length;
    a.lengthUnit = this.lengthUnit;
    a.strength = this.strength
};

function SimpleSequenceMotifElement() {
    MotifElement.call(this);
    this.verticalOffsetPattern = [0];
    this.verticalOffsetPatternBorderMode = IndexBorderMode.RESTART;
    this.verticalOffsetType = OffsetType.SCALE;
    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;
    this.elementLengthPattern = [1];
    this.elementLengthPatternUnit = PositionUnit.BEATS;
    this.elementLengthPatternBorderMode = IndexBorderMode.RESTART;
    this.elementStrengthPattern = [1];
    this.elementStrengthPatternBorderMode = IndexBorderMode.RESTART;
    this.restPattern = [0];
    this.restPatternBorderMode = IndexBorderMode.RESTART;
    this.cutLast = true;
    this.minElementLength = 0;
    this.minElementLengthUnit = PositionUnit.BEATS;
    this._constructorName = "SimpleSequenceMotifElement"
}
SimpleSequenceMotifElement.prototype = new MotifElement();
SimpleSequenceMotifElement.prototype.getConstantMotifElements = function (c, n, a, s) {
    var m = [];
    if (this.elementLengthPattern.length == 0) {
        return m
    }
    var g = n.getHarmonyAt(a);
    var o = positionUnitToBeats(this.length, this.lengthUnit, g.tsNumerator, g.tsDenominator, n);
    var d = positionUnitToBeats(this.minElementLength, this.minElementLengthUnit, g.tsNumerator, g.tsDenominator, n);
    var k = 0;
    var p = 0;
    while (p < o) {
        var h = IndexBorderMode.getIndex(this.elementLengthPatternBorderMode, this.elementLengthPattern.length, k);
        if (h == -1) {
            break
        }
        var e = this.elementLengthPattern[h];
        var t = positionUnitToBeats(e, this.elementLengthPatternUnit, g.tsNumerator, g.tsDenominator, n);
        var q = false;
        if (this.restPattern.length > 0) {
            var j = IndexBorderMode.getIndex(this.restPatternBorderMode, this.restPattern.length, k);
            if (j >= 0) {
                q = this.restPattern[j] != 0
            }
        }
        var f = 0;
        if (this.verticalOffsetPattern.length > 0) {
            var b = IndexBorderMode.getIndex(this.verticalOffsetPatternBorderMode, this.verticalOffsetPattern.length, k);
            if (b >= 0) {
                f = this.verticalOffsetPattern[b]
            }
        }
        var l = false;
        if (p + t > o) {
            l = true;
            if (this.cutLast) {
                t = o - p
            } else {
                q = true
            }
        }
        if (!l || t >= d) {
            var r = new VerticalRelativeMotifElement().setLength(t).setLengthUnit(PositionUnit.BEATS);
            r.rest = q;
            r.index = f;
            r.relativeType = this.verticalRelativeType;
            r.offsetType = this.verticalOffsetType;
            m.push(r)
        }
        if (l) {
            break
        }
        k++;
        p += t
    }
    return m
};
var FillerNoteLengthMode = {
    INDEPENDENT: 0,
    MATCH: 1
};

function FillerNote() {
    MotifElement.call(this);
    this.positionOffset = 0;
    this.positionOffsetUnit = PositionUnit.BEATS;
    this.relativeType = VerticalRelativeType.NOTE;
    this.offsetType = OffsetType.CHORD;
    this.offset = 1;
    this.snapType = SnapType.NONE;
    this.lengthMode = FillerNoteLengthMode.INDEPENDENT;
    this._constructorName = "FillerNote"
}
FillerNote.prototype = new MotifElement();
FillerNote.prototype.copy = function () {
    var a = new FillerNote();
    MotifElement.prototype.set(this, a);
    a.positionOffset = this.positionOffset;
    a.positionOffsetUnit = this.positionOffsetUnit;
    a.relativeType = this.relativeType;
    a.offsetType = this.offsetType;
    a.offset = this.offset;
    return a
};
FillerNote.prototype.getAbsoluteNote = function (b, c, a) {
    if (this.relativeType == VerticalRelativeType.NOTE) { } else {
        b = c.getVerticalRelativeAbsoluteNote(this.relativeType, a)
    }
    b = c.offset(b, this.offsetType, this.offset, c);
    return c.snap(b, this.snapType, c)
};

function ConstantMotifElement() {
    MotifElement.call(this);
    this.rest = false;
    this.fillers = [];
    this._constructorName = "ConstantMotifElement"
}
ConstantMotifElement.prototype = new MotifElement();
ConstantMotifElement.prototype.addFiller = function (a) {
    this.fillers.push(a);
    return this
};
ConstantMotifElement.prototype.set = function (b) {
    MotifElement.prototype.set.call(this, b);
    b.rest = this.rest;
    b.fillers = [];
    for (var a = 0; a < this.fillers.length; a++) {
        b.fillers.push(this.fillers[a].copy())
    }
};
ConstantMotifElement.prototype.getBeatLength = function (a, b) {
    return positionUnitToBeats(this.length, this.lengthUnit, a, b)
};

function VerticalRelativeMotifElement() {
    ConstantMotifElement.call(this);
    this.index = 0;
    this.relativeType = VerticalRelativeType.VOICE_LINE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "VerticalRelativeMotifElement"
}
VerticalRelativeMotifElement.prototype = new ConstantMotifElement();
VerticalRelativeMotifElement.prototype.setIndex = function (a) {
    this.index = a;
    return this
};
VerticalRelativeMotifElement.prototype.setRelativeType = function (a) {
    this.relativeType = a;
    return this
};
VerticalRelativeMotifElement.prototype.setOffsetType = function (a) {
    this.offsetType = a;
    return this
};
VerticalRelativeMotifElement.prototype.setBeforeOffsetSnapType = function (a) {
    this.beforeOffsetSnapType = a;
    return this
};
VerticalRelativeMotifElement.prototype.setAfterOffsetSnapType = function (a) {
    this.afterOffsetSnapType = a;
    return this
};
VerticalRelativeMotifElement.prototype.copy = function () {
    var a = new VerticalRelativeMotifElement();
    ConstantMotifElement.prototype.set.call(this, a);
    a.index = this.index;
    a.relativeType = this.relativeType;
    a.offsetType = this.offsetType;
    a.beforeOffsetSnapType = this.beforeOffsetSnapType;
    a.afterOffsetSnapType = this.afterOffsetSnapType;
    return a
};

function ClusterableMotifElement() {
    ConstantMotifElement.call(this);
    this.clusterPositionIndex = 0;
    this.clusterPositionFraction = 0;
    this.clusterId = 0;
    this._constructorName = "ClusterableMotifElement"
}
ClusterableMotifElement.prototype = new ConstantMotifElement();
ClusterableMotifElement.prototype.set = function (a) {
    ConstantMotifElement.prototype.set.call(this, a);
    a.clusterPositionIndex = this.clusterPositionIndex;
    a.clusterPositionFraction = this.clusterPositionFraction;
    a.clusterId = this.clusterId
};

function HorizontalRelativeMotifElement() {
    ClusterableMotifElement.call(this);
    this.index = 0;
    this.relativeType = HorizontalRelativeType.PREVIOUS_NOTE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "HorizontalRelativeMotifElement"
}
HorizontalRelativeMotifElement.prototype = new ClusterableMotifElement();
HorizontalRelativeMotifElement.prototype.setIndex = function (a) {
    this.index = a;
    return this
};
HorizontalRelativeMotifElement.prototype.setRelativeType = function (a) {
    this.relativeType = a;
    return this
};
HorizontalRelativeMotifElement.prototype.setOffsetType = function (a) {
    this.offsetType = a;
    return this
};
HorizontalRelativeMotifElement.prototype.setBeforeOffsetSnapType = function (a) {
    this.beforeOffsetSnapType = a;
    return this
};
HorizontalRelativeMotifElement.prototype.setAfterOffsetSnapType = function (a) {
    this.afterOffsetSnapType = a;
    return this
};
HorizontalRelativeMotifElement.prototype.copy = function () {
    var a = new HorizontalRelativeMotifElement();
    ClusterableMotifElement.prototype.set.call(this, a);
    a.index = this.index;
    a.relativeType = this.relativeType;
    a.offsetType = this.offsetType;
    a.beforeOffsetSnapType = this.beforeOffsetSnapType;
    a.afterOffsetSnapType = this.afterOffsetSnapType;
    return a
};
var AdaptiveVerticalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1,
    CURVE: 2
};

var AdaptiveHorizontalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1
};


function AdaptiveMotifElement() {
    ClusterableMotifElement.call(this);
    this.verticalDomainType = AdaptiveVerticalDomainType.RANGE;
    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;
    this.constantVerticalOffset = 0;
    this.constantVerticalOffsetType = OffsetType.HALF_STEP;
    this.verticalDomainOffsetType = OffsetType.SCALE;
    this.verticalDomainOffsetRange = [-15, 15];
    this.verticalDomainOffsetElements = [-1, 0, 1];
    this.verticalDomainOffsetElementLikelihoods = [1, 1, 1];
    this.verticalDomainCurve = "";
    this.verticalDomainCurveOffsetRange = [-1, 1];
    this.verticalDomainCurveOffsetLikelihoodMultiplier = 0.1;
    this.horizontalDomainTypes = [AdaptiveHorizontalDomainType.RANGE];
    this.horizontalRelativeTypes = [HorizontalRelativeType.PREVIOUS_NOTE];
    this.horizontalDomainOffsetTypes = [OffsetType.SCALE];
    this.horizontalDomainOffsetRanges = [
        [-2, 2]
    ];
    this.horizontalDomainOffsetElements = [
        [-1, 0, 1]
    ];
    this.horizontalDomainOffsetLikelihoods = [
        [1, 1, 1]
    ];
    this._constructorName = "AdaptiveMotifElement"
}
AdaptiveMotifElement.prototype = new ClusterableMotifElement();
var PercussionMotifMode = {
    RYTHM_AND_ZONES: 0,
    RYTHM_AND_RENDER_PATTERN: 1,
    ELEMENTS: 2
};


function AbstractPercussionMotif() {
    this.id = "";
    this.seed = 12345;
    this.useExternalSeed = false;
    this._constructorName = "AbstractPercussionMotif"
}

function PercussionMotif() {
    AbstractPercussionMotif.call(this);
    this.mode = PercussionMotifMode.ELEMENTS;
    this.rythm = "";
    this.elements = [];
    this.zones = [];
    this.modifiers = [];
    this.namedNotes = [];
    this.renderPattern = [
        [0]
    ];
    this.startRenderPattern = [];
    this.endRenderPattern = [];
    this._constructorName = "PercussionMotif"
}
PercussionMotif.prototype = new AbstractPercussionMotif();
PercussionMotif.prototype.getPercussionMotifElementsFromRythmAndZones = function (f, h, d, b) {
    var a = [];
    for (var e = 0; e < this.zones.length; e++) {
        var c = this.zones[e];
        var g = c.getPercussionMotifElements(f, h, d, b);
        addAll(a, g)
    }
    return a
};
PercussionMotif.prototype.getPercussionMotifElementsFromRythmAndRenderPattern = function (d, e, c, b) {
    var a = [];
    return a
};
PercussionMotif.prototype.getPrimitivePercussionMotifElements = function (b, g, d) {
    var k = [];
    switch (this.mode) {
        case PercussionMotifMode.RYTHM_AND_ZONES:
        case PercussionMotifMode.RYTHM_AND_RENDER_PATTERN:
            var c = b.getRythm(this.rythm);
            if (c) {
                var j = [];
                var a = c.getNoteRythmElements(b, g, d);
                if (this.mode == PercussionMotifMode.RYTHM_AND_ZONES) {
                    j = this.getPercussionMotifElementsFromRythmAndZones(b, a, g, d)
                } else {
                    if (this.mode == PercussionMotifMode.RYTHM_AND_RENDER_PATTERN) {
                        j = this.getPercussionMotifElementsFromRythmAndRenderPattern(b, a, g, d)
                    }
                }
                addAll(k, j)
            } else {
                console.log(this._constructorName + " Could not find rythm " + this.rythm + "<br />")
            }
            break;
        case PercussionMotifMode.ELEMENTS:
            for (var f = 0; f < this.elements.length; f++) {
                var h = this.elements[f];
                var j = h.getPrimitivePercussionMotifElements(b, g, d);
                addAll(k, j)
            }
            break
    }
    return k
};

function SingleElementPercussionMotif() {
    AbstractPercussionMotif.call(this);
    this.element = new PredefinedPercussionMotifElement();
    this._constructorName = "SingleElementPercussionMotif"
}
SingleElementPercussionMotif.prototype = new AbstractPercussionMotif();
SingleElementPercussionMotif.prototype.getPrimitivePercussionMotifElements = function (c, b, a) {
    return this.element.getPrimitivePercussionMotifElements(c, b, a)
};

function PercussionMotifElement() {
    this.id = "";
    this.renderChannel = "";
    this._constructorName = "PercussionMotifElement"
}
PercussionMotifElement.prototype.getPrimitivePercussionMotifElements = function (c, b, a) {
    return [this]
};

function PrimitivePercussionMotifElement() {
    PercussionMotifElement.call(this);
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;
    this.length = 1;
    this.lengthUnit = PositionUnit.BEATS;
    this.rest = false;
    this.strength = 1;
    this.note = 60;
    this._constructorName = "PrimitivePercussionMotifElement"
}
PrimitivePercussionMotifElement.prototype = new PercussionMotifElement();
var PredefinedPercussionMotifType = {
    FILL_DOTTED_QUARTER_1: 0,
    FILL_DOTTED_QUARTER_2: 1,
    FILL_DOTTED_QUARTER_3: 2,
    FILL_DOTTED_QUARTER_4: 3,
    ROCK_STANDARD_1: 4,
    ROCK_STANDARD_2: 5,
    ROCK_STANDARD_3: 6,
    ROCK_STANDARD_4: 7,
    ROCK_STANDARD_5: 8,
    ROCK_STANDARD_6: 9,
    ROCK_STANDARD_7: 10,
    ROCK_STANDARD_8: 11,
    ROCK_STANDARD_9: 12,
    FILL_QUARTER_1: 13,
    FILL_QUARTER_2: 14,
    FILL_QUARTER_3: 15,
    FILL_QUARTER_4: 16,
    MARCH_STANDARD_1: 17,
    MARCH_STANDARD_2: 18,
    MARCH_STANDARD_3: 19,
    FILL_QUARTER_TRIPLET_1: 20,
    FILL_QUARTER_TRIPLET_2: 21,
    FILL_QUARTER_TRIPLET_3: 22,
    FILL_EIGHTS_1: 23,
    FILL_EIGHTS_2: 24,
    FILL_EIGHTS_3: 25,
    FILL_EIGHTS_4: 26,
    FILL_EIGHTS_5: 27,
    FILL_EIGHTS_6: 28,
    FILL_EIGHTS_7: 29,
    FILL_EIGHTS_8: 30
};


function PredefinedPercussionMotifElement() {
    PercussionMotifElement.call(this);
    this.type = PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1;
    this.useDefaultDrums = true;
    this.useNamedNotes = false;
    this.drums = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.CLOSED_HIHAT, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1];
    this.namedNotes = [];
    this.ghostStrength = 0.6;
    this.rollStrength = 0.7;
    this.flamStrength = 0.7;
    this.normalStrength = 0.8;
    this.accentStrength = 0.9;
    this.marcatoStrength = 1;
    this.flamLength = 0.25;
    this.flamLengthUnit = PositionUnit.BEAT_EIGHTHS
}
PredefinedPercussionMotifElement.prototype = new PercussionMotifElement();
PredefinedPercussionMotifElement.prototype.setType = function (a) {
    this.type = a;
    return this
};
PredefinedPercussionMotifElement.prototype.getNote = function (b, c, e) {
    if (this.useDefaultDrums) {
        return e[b % e.length]
    }
    if (this.useNamedNotes && this.namedNotes.length > 0) {
        var a = this.namedNotes[b % this.namedNotes.length];
        var d = c.getNamedNote(a);
        if (d) {
            return d.getNote()
        }
    } else {
        if (this.drums.length > 0) {
            return this.drums[b % this.drums.length]
        }
    }
    return 60
};
PredefinedPercussionMotifElement.prototype.createFlams = function (d, a, h, j) {
    var g = getValueOrDefault(d, "flamLength", 1 / 16);
    var b = getValueOrDefault(d, "starts", [0]);
    var c = getValueOrDefault(d, "drumIndices", [0]);
    var f = [];
    for (var e = 0; e < b.length; e++) {
        f.push(b[e] - g)
    }
    this.getElementsFromPattern({
        starts: f,
        lengths: [g],
        flams: [1],
        drumIndices: c
    }, a, h, j)
};
PredefinedPercussionMotifElement.prototype.createRoll = function (l, d, k, m) {
    var c = getValueOrDefault(l, "length", 1);
    var a = getValueOrDefault(l, "start", 0);
    var b = getValueOrDefault(l, "drumIndex", 0);
    var g = getValueOrDefault(l, "noteLength", 0.25);
    var j = Math.round(c / g);
    var h = a;
    var e = [];
    for (var f = 0; f < j; f++) {
        e.push(h);
        h += g
    }
    this.getElementsFromPattern({
        starts: e,
        lengths: [g],
        rolls: [1],
        drumIndices: [b]
    }, d, k, m)
};
PredefinedPercussionMotifElement.prototype.getElementsFromPattern = function (j, c, b, m) {
    var h = j.starts ? j.starts : [0];
    var f = j.lengths ? j.lengths : [1 / 4];
    var d = j.lengthMultiplier ? j.lengthMultiplier : 1;
    var a = j.rests ? j.rests : [0];
    var u = j.ghosts ? j.ghosts : [0];
    var t = j.rolls ? j.rolls : [0];
    var q = j.velMults ? j.velMults : [1];
    var g = j.posShifts ? j.posShifts : [0];
    var k = j.flams ? j.flams : [0];
    var p = j.accents ? j.accents : [0];
    var e = j.marcatos ? j.marcatos : [0];
    var l = j.drumIndices ? j.drumIndices : [0];
    var n = typeof (j.positionShift) === "undefined" ? 0 : j.positionShift;
    if (n > 0) {
        var s = new PrimitivePercussionMotifElement();
        s.rest = true;
        s.length = n * d;
        s.startTime = 0;
        s.startTimeUnit = PositionUnit.BEATS;
        m.push(s)
    }
    for (var o = 0; o < h.length; o++) {
        var s = new PrimitivePercussionMotifElement();
        s.rest = a[o % a.length] == 1;
        s.note = this.getNote(l[o % l.length], c, b);
        s.startTime = h[o % h.length] * d + n + g[o % g.length];
        s.startTimeUnit = PositionUnit.BEATS;
        s.length = 0.95 * f[o % f.length] * d;
        s.lengthUnit = PositionUnit.BEATS;
        var r = this.normalStrength;
        if (k[o % k.length] == 1) {
            r = this.flamStrength
        } else {
            if (u[o % u.length] == 1) {
                r = this.ghostStrength
            } else {
                if (t[o % t.length] == 1) {
                    r = this.rollStrength
                } else {
                    if (p[o % p.length] == 1) {
                        r = this.accentStrength
                    } else {
                        if (e[o % e.length] == 1) {
                            r = this.marcatoStrength
                        }
                    }
                }
            }
        }
        r *= q[o % q.length];
        s.strength = r;
        m.push(s)
    }
};
PredefinedPercussionMotifElement.prototype.getPrimitivePercussionMotifElements = function (a, f, b) {
    var l = [];
    var e = f.getHarmonyAt(b);
    var j = e.getBeatLength();
    var g = positionUnitToBeats(1, PositionUnit.MEASURES, e.tsNumerator, e.tsDenominator);
    var k = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.CLOSED_HIHAT];
    switch (this.type) {
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_1:
        case PredefinedPercussionMotifType.FILL_EIGHTS_2:
        case PredefinedPercussionMotifType.FILL_EIGHTS_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_4:
        case PredefinedPercussionMotifType.FILL_EIGHTS_5:
        case PredefinedPercussionMotifType.FILL_EIGHTS_6:
        case PredefinedPercussionMotifType.FILL_EIGHTS_7:
        case PredefinedPercussionMotifType.FILL_EIGHTS_8:
        case PredefinedPercussionMotifType.FILL_QUARTER_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_3:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
            k = [MidiDrum.SNARE_DRUM_1];
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
            k = [MidiDrum.SNARE_DRUM_1, MidiDrum.LOW_TOM_1, MidiDrum.MID_TOM_1];
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_4:
            k = [MidiDrum.SNARE_DRUM_1, MidiDrum.LOW_TOM_1];
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            k = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.PEDAL_HIHAT];
            break
    }
    switch (this.type) {
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
            this.getElementsFromPattern({
                starts: [0, 1.5, 3],
                lengths: [1.5, 1.5, 1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
            this.getElementsFromPattern({
                starts: [0, 0.5, 2, 3.5],
                lengths: [0.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
            this.getElementsFromPattern({
                starts: [0, 1, 2.5, 4, 5.5, 7],
                lengths: [1, 1.5, 1.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0, 0, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
            this.getElementsFromPattern({
                starts: [0, 1, 2.5, 4, 5.5, 7],
                lengths: [1, 1.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0, 0, 0],
                drumIndices: [0, 0, 1, 2, 0, 1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_1:
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3],
                lengths: [1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_2:
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3],
                lengths: [1],
                rests: [0, 0, 1, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_3:
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3, 4, 5, 6, 7],
                lengths: [1],
                rests: [0, 0, 1, 0, 0, 1, 0, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_4:
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3],
                lengths: [1]
            }, a, k, l);
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3],
                lengths: [1],
                drumIndices: [1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_EIGHTS_1:
        case PredefinedPercussionMotifType.FILL_EIGHTS_2:
        case PredefinedPercussionMotifType.FILL_EIGHTS_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_4:
        case PredefinedPercussionMotifType.FILL_EIGHTS_5:
        case PredefinedPercussionMotifType.FILL_EIGHTS_6:
        case PredefinedPercussionMotifType.FILL_EIGHTS_7:
        case PredefinedPercussionMotifType.FILL_EIGHTS_8:
            var h = [0];
            var d = [0];
            switch (this.type) {
                case PredefinedPercussionMotifType.FILL_EIGHTS_2:
                    h = [1, 0, 0, 1, 0, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_3:
                    h = [1, 0, 1, 1, 0, 1, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_4:
                    h = [1, 1, 0, 1, 1, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_5:
                    h = [0, 1, 0, 1, 0, 1, 0, 1];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_6:
                    d = [0, 0, 1, 0, 0, 1, 0, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_7:
                    d = [0, 0, 0, 0, 1, 0, 0, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_8:
                    d = [1, 0, 0, 0, 0, 0, 1, 0];
                    break
            }
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(8, 0, 1 / 2),
                lengths: [1 / 2],
                accents: h,
                rests: d
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
            var h = [0];
            var d = [0];
            switch (this.type) {
                case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
                    h = [1, 0, 1, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
                    break
            }
            this.getElementsFromPattern({
                starts: [0, 2 / 3, 4 / 3, 6 / 3, 8 / 3, 10 / 3],
                lengths: [2 / 3],
                accents: h,
                rests: d
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            this.getElementsFromPattern({
                starts: [0, 1, 2, 3],
                lengths: [0.5],
                drumIndices: [0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            this.getElementsFromPattern({
                starts: [0, 2],
                lengths: [0.5],
                accents: [1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
            this.getElementsFromPattern({
                starts: [0, 1.5, 2],
                lengths: [0.25],
                accents: [1, 0, 1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
            this.getElementsFromPattern({
                starts: [0, 2, 2.5],
                lengths: [0.25],
                accents: [1, 1, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
            this.getElementsFromPattern({
                starts: [0, 1.5, 2.5],
                lengths: [0.25],
                accents: [1, 0, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
            this.getElementsFromPattern({
                starts: [0, 0.5, 1.5, 2.5, 3.5],
                lengths: [0.25],
                accents: [1, 0, 0, 0, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
            this.getElementsFromPattern({
                starts: [0, 0.5, 1.5, 2, 2.5, 3.5],
                lengths: [0.25],
                accents: [1, 0, 0, 1, 0, 0, 0]
            }, a, k, l);
            break
    }
    switch (this.type) {
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
            this.getElementsFromPattern({
                starts: [0, 0.5, 1, 1.25, 1.5, 1.75, 2, 2.5],
                lengths: [0.25],
                drumIndices: [1]
            }, a, k, l);
            this.createRoll({
                start: 3,
                length: 1,
                noteLength: 0.125,
                drumIndex: 1
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
            var c = [0.5, 1.5, 2.5, 3.5];
            this.getElementsFromPattern({
                starts: c,
                lengths: [0.25],
                drumIndices: [1]
            }, a, k, l);
            this.createFlams({
                starts: c,
                drumIndices: [1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            this.getElementsFromPattern({
                starts: [0, 2 / 3, 1, 5 / 3, 2, 8 / 3, 3],
                lengths: [0.125],
                drumIndices: [1]
            }, a, k, l);
            this.createFlams({
                starts: [1, 2, 3],
                drumIndices: [1]
            }, a, k, l);
            this.createRoll({
                start: 11 / 3,
                length: 1 / 3,
                noteLength: 1 / 8,
                drumIndex: 1
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
            this.getElementsFromPattern({
                starts: [1, 3],
                lengths: [1, 1],
                drumIndices: [1],
                accents: [1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
            this.getElementsFromPattern({
                starts: [1, 1.75, 3],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 1]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
            this.getElementsFromPattern({
                starts: [1, 1.75, 3, 3.75],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 1, 0]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            this.getElementsFromPattern({
                starts: [1, 1.75, 2.25, 3, 3.75],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 0, 0, 1, 0]
            }, a, k, l);
            break
    }
    switch (this.type) {
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(4, 0, 1),
                lengths: [1],
                drumIndices: [2]
            }, a, k, l);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(8, 0, 0.5),
                lengths: [0.25],
                drumIndices: [2],
                accents: [1, 0]
            }, a, k, l);
            break
    }
    return l
};

function applyHarmonyModifiers(e, b, d) {
    for (var c = 0; c < b.length; c++) {
        var a = b[c];
        e = a.modifyConstantHarmonyElements(e, d)
    }
    return e
}

function ConstantHarmonicRythm(a) {
    this.harmonyElements = a ? a : [];
    this.modifiers = [];
    this._constructorName = "ConstantHarmonicRythm"
}
ConstantHarmonicRythm.prototype.toRomanString = function () {
    var a = "[";
    var h = -1;
    var d = -1;
    for (var c = 0; c < this.harmonyElements.length; c++) {
        var g = this.harmonyElements[c];
        a += g.toRomanString();
        var f = g.getBaseNote();
        var b = g.getScaleType();
        if (f != h || b != d) {
            a += "(" + toPitchClassString(f) + " " + ScaleType.toString(b) + ")";
            h = f;
            d = b
        }
        if (c < this.harmonyElements.length - 1) {
            a += ", "
        }
    }
    a += "]";
    return a
};
ConstantHarmonicRythm.prototype.getCount = function () {
    return this.harmonyElements.length
};
ConstantHarmonicRythm.prototype.get = function (a) {
    return this.harmonyElements[a]
};
ConstantHarmonicRythm.prototype.getConstantHarmonyElements = function (e, b) {
    var a = [];
    for (var d = 0; d < this.harmonyElements.length; d++) {
        var c = this.harmonyElements[d];
        var f = c.getConstantHarmonyElements(e, b);
        addAll(a, f)
    }
    return applyHarmonyModifiers(a, this.modifiers, e)
};
ConstantHarmonicRythm.prototype.getPhraseRanges = function () {
    var a = [];
    var d = 0;
    for (var b = 0; b < this.getCount(); b++) {
        var c = this.get(b);
        if (c instanceof ConstantHarmonyElement) {
            if (c.startsPhrase && b > 0) {
                a.push([d, b - 1]);
                d = b
            }
        }
    }
    a.push([d, this.getCount() - 1]);
    return a
};
ConstantHarmonicRythm.prototype.getPhraseRangeBeatLength = function (b) {
    var a = 0;
    for (var c = b[0]; c <= b[1]; c++) {
        var d = this.get(c);
        if (d instanceof ConstantHarmonyElement) {
            a += d.getBeatLength()
        } else {
            console.log("Please do not call getPhraseRangeBeatLength() on " + d._constructorName + " <br />")
        }
    }
    return a
};
ConstantHarmonicRythm.prototype.getPhraseRangeAt = function (d) {
    var c = this.getHarmonyIndexAt(d);
    var e = this.getPhraseRanges();
    for (var b = 0; b < e.length; b++) {
        var a = e[b];
        if (a[0] <= c && c <= a[1]) {
            return [a[0], a[1]]
        }
    }
    return [0, this.getCount() - 1]
};
ConstantHarmonicRythm.prototype.getHarmonyIndexAt = function (d) {
    if (d < 0) {
        return 0
    }
    var a = this.harmonyElements.length - 1;
    var c = 0;
    for (var b = 0; b < this.harmonyElements.length; b++) {
        var f = this.harmonyElements[b];
        var g = positionUnitToBeats(f.length, f.lengthUnit, f.tsNumerator, f.tsDenominator);
        if (d >= c && d < c + g) {
            a = b;
            break
        }
        c += g
    }
    return a
};
ConstantHarmonicRythm.prototype.getHarmonyAt = function (a) {
    return this.harmonyElements[this.getHarmonyIndexAt(a)]
};
ConstantHarmonicRythm.prototype.getBeatLengthUntilIndex = function (c) {
    var a = 0;
    for (var b = 0; b < Math.min(this.harmonyElements.length, c); b++) {
        var d = this.harmonyElements[b];
        var f = positionUnitToBeats(d.length, d.lengthUnit, d.tsNumerator, d.tsDenominator);
        a += f
    }
    return a
};
ConstantHarmonicRythm.prototype.getBeatLength = function () {
    var a = 0;
    for (var b = 0; b < this.harmonyElements.length; b++) {
        var c = this.harmonyElements[b];
        var d = positionUnitToBeats(c.length, c.lengthUnit, c.tsNumerator, c.tsDenominator);
        a += d
    }
    return a
};

function HarmonyElement() {
    this.id = "";
    this.modifiers = [];
    this._constructorName = "HarmonyElement"
}

function HarmonyReferenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmony = "";
    this._constructorName = "HarmonyReferenceHarmonyElement"
}
HarmonyReferenceHarmonyElement.prototype = new HarmonyElement();

function SwitchHarmonyElement() {
    HarmonyElement.call(this);
    this.index = 0;
    this.indexedElements = [];
    this._constructorName = "SwitchHarmonyElement"
}
SwitchHarmonyElement.prototype = new HarmonyElement();

function ConstantHarmonyElement() {
    HarmonyElement.call(this);
    this.length = 1;
    this.lengthUnit = PositionUnit.MEASURES;
    this.strength = 1;
    this.startBeatStrength = 1;
    this.scaleType = ScaleType.MAJOR;
    this.baseNote = 60;
    this.chordType = ChordType.TRIAD;
    this.chordRoot = 0;
    this.chordInversions = 0;
    this.scale = [0, 2, 4, 5, 7, 9, 11];
    this.chord = [0, 2, 4];
    this.scaleMode = 0;
    this.tsNumerator = 4;
    this.tsDenominator = 4;
    this.alterations = [];
    this.voiceLineConstraints = [];
    this.sectionModifiers = [];
    this.startsPhrase = false;
    this.note = "";
    this._constructorName = "ConstantHarmonyElement"
}
ConstantHarmonyElement.prototype = new HarmonyElement();
var HarmonyLengthMode = {
    COUNT_AND_LENGTH_PATTERN: 0,
    COUNT_AND_RYTHM: 1,
    RYTHM_ONLY: 2
};


function SequenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmonyLengthMode = HarmonyLengthMode.RYTHM_ONLY;
    this.count = 1;
    this.lengthPattern = [1];
    this.startLengthPattern = [];
    this.endLengthPattern = [];
    this.lengthPatternUnit = PositionUnit.MEASURES;
    this.totalLength = 1;
    this.totalLengthUnit = PositionUnit.MEASURES;
    this.setTotalLengthExternally = false;
    this.beatStrengths = [1, 0.8, 0.9, 0.6, 0.3, 0.4, 0.2];
    this.lengthRythm = "";
    this.rythmTsNumerator = 4;
    this.rythmTsDenominator = 4;
    this.setTsNumeratorExternally = false;
    this.useMaxElementLength = false;
    this.maxElementLength = 1;
    this.maxElementLengthUnit = PositionUnit.MEASURES;
    this.lengthRepeats = 0;
    this.usePositionSnap = false;
    this.positionSnapPattern = [1];
    this.positionSnapUnit = PositionUnit.BEATS;
    this.positionSnapMetrics = SnapMetrics.ROUND;
    this.phraseStructureCounts = [];
    this.tsNumerators = [4];
    this.startTsNumerators = [];
    this.endTsNumerators = [];
    this.tsDenominators = [4];
    this.startTsDenominators = [];
    this.endTsDenominators = [];
    this._constructorName = "SequenceHarmonyElement"
}
SequenceHarmonyElement.prototype = new HarmonyElement();

function SimpleSequenceHarmonyElement() {
    SequenceHarmonyElement.call(this);
    this.scaleBaseNotes = [60];
    this.scaleBaseNoteIndices = [0];
    this.startScaleBaseNoteIndices = [];
    this.endScaleBaseNoteIndices = [];
    this.scaleTypes = [ScaleType.MAJOR];
    this.scaleTypeIndices = [0];
    this.startScaleTypeIndices = [];
    this.endScaleTypeIndices = [];
    this.scaleModes = [0];
    this.startScaleModes = [];
    this.endScaleModes = [];
    this.chordRoots = [0];
    this.startChordRoots = [];
    this.endChordRoots = [];
    this.chordInversions = [0];
    this.startChordInversions = [];
    this.endChordInversions = [];
    this.chordTypes = [ChordType.TRIAD];
    this.chordTypeIndices = [0];
    this.startChordTypeIndices = [];
    this.endChordTypeIndices = [];
    this.customScales = [
        [0, 2, 4, 5, 7, 9, 11]
    ];
    this.customScaleIndices = [0];
    this.startCustomScaleIndices = [];
    this.endCustomScaleIndices = [];
    this.customChords = [
        [0, 2, 4]
    ];
    this.customChordIndices = [0];
    this.startCustomChordIndices = [];
    this.endCustomChordIndices = [];
    this.voiceLineConstraints = [];
    this.voiceLineConstraintIndices = [];
    this.startVoiceLineConstraintIndices = [];
    this.endVoiceLineConstraintIndices = [];
    this._constructorName = "SimpleSequenceHarmonyElement"
}
SimpleSequenceHarmonyElement.prototype = new SequenceHarmonyElement();
SimpleSequenceHarmonyElement.prototype.voiceLineConstraints_allowedTypes = {
    VoiceChordNotesVoiceLinePlannerConstraint: 1
};

function PlannedHarmonyElement() {
    SequenceHarmonyElement.call(this);
    this.scaleBaseNote = 60;
    this.scaleType = ScaleType.MAJOR;
    this.seed = 12345;
    this._constructorName = "PlannedHarmonyElement"
}
PlannedHarmonyElement.prototype = new SequenceHarmonyElement();

function StaticSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);
    this.baseRoot = 0;
    this.baseToBaseLikelihood = 0.01;
    this.baseToNeighbourLikelihood = 1;
    this.baseToPassingLikelihood = 1;
    this.baseToAuxiliaryLikelihood = 1;
    this.auxiliaryToAuxiliaryLikelihood = 0.01;
    this.auxiliaryToBaseLikelihood = 1;
    this.auxiliaryToNeighbourLikelihood = 1;
    this.auxiliaryToPassingLikelihood = 1;
    this.auxiliaryChordRoots = [3, 4];
    this.auxiliaryChordRootLikelihoods = [1, 1];
    this.fromBasePassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBasePassingChordRootLikelihoods = [1];
    this.fromBasePassingIncrements = [-2, 1, 1, 2];
    this.fromBasePassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromBasePassingInversions = [0, 1, 2];
    this.fromBasePassingInversionLikelihoods = [0.5, 1, 0.5];
    this.fromBaseNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBaseNeighbourChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryPassingChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingIncrements = [-2, -1, 1, 2];
    this.fromAuxiliaryPassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromAuxiliaryNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryNeighbourChordRootLikelihoods = [1];
    this.canEndWithBase = true;
    this.canEndWithAuxiliary = false;
    this.possibleAuxiliaryEndRoots = [3, 4];
    this._constructorName = "StaticSequenceHarmonyElement"
}
StaticSequenceHarmonyElement.prototype = new PlannedHarmonyElement();

function DynamicSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);
    this.modulate = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.majorStartRoots = [0];
    this.majorStartRootLikelihoods = [1];
    this.majorProgressionRoots = [
        [0, 1, 2, 3, 4, 5]
    ];
    this.majorProgressionRootLikelihoods = [
        [1]
    ];
    this.minorProgressionRoots = [
        [0, 2, 3, 4, 5, 6]
    ];
    this.minorProgressionRootLikelihoods = [
        [1]
    ];
    this.majorProgressionMovements = [
        [-4, -2, 1]
    ];
    this.startMajorProgressionMovements = [];
    this.endMajorProgressionMovements = [];
    this.majorProgressionMovementLikelihoods = [
        [1]
    ];
    this.startMajorProgressionMovementLikelihoods = [];
    this.endMajorProgressionMovementLikelihoods = [];
    this.minorProgressionMovements = [
        [-4, -2, 1]
    ];
    this.startMinorProgressionMovements = [];
    this.endMinorProgressionMovements = [];
    this.minorProgressionMovementLikelihoods = [
        [1]
    ];
    this.startMinorProgressionMovementLikelihoods = [];
    this.endMinorProgressionMovementLikelihoods = [];
    this.majorPossibleEndRoots = [1, 3];
    this.minorPossibleEndRoots = [3];
    this.majorModulationPossibleEndRoots = [1, 3];
    this.minorModulationPossibleEndRoots = [3];
    this.passingRoots = [0, 1, 2, 3, 4, 5, 6];
    this.passingRootLikelihoods = [1];
    var a = null;
    this.passingInversions = getValueOrDefault(a, "passingInversions", [1, 2]);
    this.passingInversionLikelihoods = getValueOrDefault(a, "passingInversionLikelihoods", [1, 0.5]);
    this.passingIncrements = getValueOrDefault(a, "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(a, "passingIncrementLikelihoods", [0.5, 1, 1, 0.5]);
    this.neighbourRoots = getValueOrDefault(a, "neighbourRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.neighbourRootLikelihoods = getValueOrDefault(a, "neighbourRootLikelihoods", [1]);
    this.neighbourInversions = getValueOrDefault(a, "neighbourInversions", [1, 2]);
    this.neighbourInversionLikelihoods = getValueOrDefault(a, "neighbourInversionLikelihoods", [1, 0.5]);
    this.expansionRoots = getValueOrDefault(a, "expansionRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.expansionRootLikelihoods = getValueOrDefault(a, "expansionRootLikelihoods", [1]);
    this.expansionInversions = getValueOrDefault(a, "expansionInversions", [1]);
    this.expansionInversionLikelihoods = getValueOrDefault(a, "expansionInversionLikelihoods", [1]);
    this.rootProgressionLikelihood = getValueOrDefault(a, "rootProgressionLikelihood", 1);
    this.repeatRootLikelihood = getValueOrDefault(a, "repeatRootLikelihood", 0);
    this.passingLikelihood = getValueOrDefault(a, "passingLikelihood", 1);
    this.neighbourLikelihood = getValueOrDefault(a, "neighbourLikelihood", 1);
    this.expansionLikelihood = getValueOrDefault(a, "expansionLikelihood", 1);
    this.modulateLikelihoods = [1];
    this.startModulateLikelihoods = [0.01];
    this.endModulateLikelihoods = [0.01];
    this.majorAppliedChords = getValueOrDefault(a, "majorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.majorAppliedChordLikelihoods = getValueOrDefault(a, "majorAppliedChordLikelihoods", [1]);
    this.minorAppliedChords = getValueOrDefault(a, "minorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.minorAppliedChordLikelihoods = getValueOrDefault(a, "minorAppliedChordLikelihoods", [1]);
    this.addAllMovements = getValueOrDefault(a, "addAllMovements", true);
    this.addAllStarts = getValueOrDefault(a, "addAllStarts", true);
    this._constructorName = "DynamicSequenceHarmonyElement"
}
DynamicSequenceHarmonyElement.prototype = new PlannedHarmonyElement();
HarmonyElement.prototype.getLength = function () {
    return this.length
};
HarmonyElement.prototype.getLengthUnit = function () {
    return this.lengthUnit
};
HarmonyElement.prototype.setLengthUnit = function (a) {
    this.lengthUnit = a;
    return this
};
HarmonyElement.prototype.setLength = function (a) {
    this.length = a;
    return this
};
HarmonyElement.prototype.getConstantHarmonyElements = function (b, a) {
    return [this]
};
SwitchHarmonyElement.prototype.getConstantHarmonyElements = function (f, c) {
    var a = [];
    var d = getValueOrExpressionValue(this, "index", f);
    var e = this.indexedElements;
    if (e.length > 0) {
        var b = e[d % e.length];
        if (b) {
            return b.getConstantHarmonyElements(f)
        } else {
            console.log("harmony null in " + this._constructorName + " for index " + d)
        }
    } else {
        console.log("to few indexed elements in " + this._constructorName + " for index " + d)
    }
    a.push(new ConstantHarmonyElement())
};
ConstantHarmonyElement.prototype.getConstantHarmonyElements = function (b, a) {
    return applyHarmonyModifiers([this], this.modifiers, b)
};
ConstantHarmonyElement.prototype.getBeatLength = function () {
    return positionUnitToBeats(this.length, this.lengthUnit, this.tsNumerator, this.tsDenominator)
};
ConstantHarmonyElement.prototype.sameScale = function (d) {
    if (d.baseNote == this.baseNote) {
        var c = d.getScale();
        var a = this.getScale();
        if (c.length == a.length) {
            for (var b = 0; b < a.length; b++) {
                if (a[b] != c[b]) {
                    return false
                }
            }
            return true
        }
    }
    return false
};
ConstantHarmonyElement.prototype.toRomanString = function () {
    var a = "";
    var b = this.getScale();
    var c = positiveMod(this.chordRoot, b.length);
    switch (c) {
        case 0:
            a += "I";
            break;
        case 1:
            a += "II";
            break;
        case 2:
            a += "III";
            break;
        case 3:
            a += "IV";
            break;
        case 4:
            a += "V";
            break;
        case 5:
            a += "VI";
            break;
        case 6:
            a += "VII";
            break
    }
    switch (this.chordType) {
        case ChordType.TRIAD:
            switch (this.chordInversions) {
                case 0:
                    break;
                case 1:
                    a += "6";
                    break;
                case 2:
                    a += "64";
                    break
            }
            break;
        case ChordType.NINTH:
            switch (this.chordInversions) {
                case 0:
                    a += "9";
                    break;
                default:
                    a += "9(" + this.chordInversions + ")";
                    break
            }
            break;
        case ChordType.SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    a += "7";
                    break;
                case 1:
                    a += "65";
                    break;
                case 2:
                    a += "43";
                    break;
                case 3:
                    a += "42";
                    break
            }
            break;
        case ChordType.SUS2:
            switch (this.chordInversions) {
                case 0:
                    a += "sus2";
                    break;
                default:
                    a += "sus2(" + this.chordInversions + ")";
                    break
            }
            break;
        case ChordType.SUS4:
            switch (this.chordInversions) {
                case 0:
                    a += "sus4";
                    break;
                default:
                    a += "sus4(" + this.chordInversions + ")";
                    break
            }
            break;
        case ChordType.SUS2_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    a += "sus2_7";
                    break;
                default:
                    a += "sus2_7(" + this.chordInversions + ")";
                    break
            }
            break;
        case ChordType.SUS4_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    a += "sus4_7";
                    break;
                default:
                    a += "sus4_7(" + this.chordInversions + ")";
                    break
            }
            break
    }
    if (this.note) {
        a += "(" + this.note + ")"
    }
    return a
};
ConstantHarmonyElement.prototype.copy = function () {
    return copyObjectDeep(this)
};
ConstantHarmonyElement.prototype.setTimeSignature = function (b, a) {
    this.tsNumerator = b;
    this.tsDenominator = a;
    return this
};
ConstantHarmonyElement.prototype.setBaseNote = function (a) {
    this.baseNote = a;
    return this
};
ConstantHarmonyElement.prototype.getBaseNote = function () {
    return this.baseNote
};
ConstantHarmonyElement.prototype.getChordRootScaleIndex = function () {
    switch (this.chordType) {
        case ChordType.CUSTOM:
            return this.chord[0];
        default:
            return this.chordRoot
    }
};
ConstantHarmonyElement.prototype.alterScaleCopy = function (c) {
    var p = c;
    if (this.alterations && this.alterations.length > 0) {
        var b = arrayCopy(c);
        for (var f = 0; f < this.alterations.length; f += 2) {
            if (f < this.alterations.length - 1) {
                var k = this.alterations[f];
                var e = this.alterations[f + 1];
                b[k % b.length] += e
            }
        }
        p = b
    }
    var n = clamp(this.scaleMode, -12, 12);
    var h = Math.abs(n);
    for (var f = 0; f < h; f++) {
        var l = arrayCopy(p);
        if (n > 0) {
            var g = l.shift();
            l.push(12);
            var a = l[0];
            for (var d = 0; d < l.length; d++) {
                l[d] = Math.abs(l[d] - a)
            }
        } else {
            var m = l.pop();
            var o = 12 - m;
            for (var d = 0; d < l.length; d++) {
                l[d] = l[d] + o
            }
            l.unshift(0)
        }
        p = l
    }
    return p
};
ConstantHarmonyElement.prototype.getScale = function () {
    var a = ScaleType.MAJOR_SCALE_STEPS;
    switch (this.scaleType) {
        case ScaleType.CUSTOM:
            a = this.scale;
            break;
        default:
            a = ScaleType.getChromaticSteps(this.scaleType);
            break
    }
    return this.alterScaleCopy(a)
};
ConstantHarmonyElement.prototype.hasSeventh = function () {
    return this.isSeventh() || this.isNinth()
};
ConstantHarmonyElement.prototype.isNinth = function () {
    return this.chordType == ChordType.NINTH
};
ConstantHarmonyElement.prototype.addSeventh = function () {
    switch (this.chordType) {
        case ChordType.SUS2:
            this.chordType = ChordType.SUS2_SEVENTH;
            break;
        case ChordType.SUS4:
            this.chordType = ChordType.SUS4_SEVENTH;
            break;
        case ChordType.TRIAD:
            this.chordType = ChordType.SEVENTH;
            break
    }
    return this
};
ConstantHarmonyElement.prototype.removeSeventh = function () {
    switch (this.chordType) {
        case ChordType.SUS2_SEVENTH:
            this.chordType = ChordType.SUS2;
            break;
        case ChordType.SUS4_SEVENTH:
            this.chordType = ChordType.SUS4;
            break;
        case ChordType.SEVENTH:
        case ChordType.NINTH:
            this.chordType = ChordType.TRIAD;
            break
    }
    return this
};
ConstantHarmonyElement.prototype.isSeventh = function () {
    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4_SEVENTH:
            return true
    }
    return false
};
ConstantHarmonyElement.prototype.isSus = function () {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS4:
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4_SEVENTH:
            return true
    }
    return false
};
ConstantHarmonyElement.prototype.isSus2 = function () {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
            return true
    }
    return false
};
ConstantHarmonyElement.prototype.isSus4 = function () {
    switch (this.chordType) {
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
            return true
    }
    return false
};
ConstantHarmonyElement.prototype.isTriad = function () {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS4:
        case ChordType.TRIAD:
            return true
    }
    return false
};
ConstantHarmonyElement.prototype.is64Triad = function () {
    return this.chordType == ChordType.TRIAD && this.chordInversions == 2
};
ConstantHarmonyElement.prototype.setChordRoot = function (a) {
    this.chordRoot = a;
    return this
};
ConstantHarmonyElement.prototype.setChordType = function (a) {
    this.chordType = a;
    return this
};
ConstantHarmonyElement.prototype.setScaleType = function (a) {
    this.scaleType = a;
    return this
};
ConstantHarmonyElement.prototype.getScaleType = function () {
    return this.scaleType
};
ConstantHarmonyElement.prototype.setChordInversions = function (a) {
    this.chordInversions = a;
    return this
};
ConstantHarmonyElement.prototype.getChordScaleIndices = function () {
    var a = this.chordRoot;
    switch (this.chordType) {
        case ChordType.CUSTOM:
            return this.chord;
        case ChordType.SEVENTH:
            return [a, a + 2, a + 4, a + 6];
        case ChordType.NINTH:
            return [a, a + 2, a + 4, a + 6, a + 8];
        case ChordType.TRIAD:
            return [a, a + 2, a + 4];
        case ChordType.SUS2:
            return [a, a + 1, a + 4];
        case ChordType.SUS2_SEVENTH:
            return [a, a + 1, a + 4, a + 6];
        case ChordType.SUS4:
            return [a, a + 3, a + 4];
        case ChordType.SUS4_SEVENTH:
            return [a, a + 3, a + 4, a + 6]
    }
    return this.chord
};
ConstantHarmonyElement.prototype.getBassScaleIndex = function () {
    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.TRIAD:
        case ChordType.NINTH:
            return this.chordRoot + this.chordInversions * 2;
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    return this.chordRoot;
                case 1:
                    return this.chordRoot + 1;
                case 2:
                    return this.chordRoot + 4;
                case 3:
                    return this.chordRoot + 6
            }
            break;
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    return this.chordRoot;
                case 1:
                    return this.chordRoot + 3;
                case 2:
                    return this.chordRoot + 4;
                case 3:
                    return this.chordRoot + 6
            }
            break
    }
    return this.chordRoot + this.chordInversions * 2
};
ConstantHarmonyElement.prototype.getThirdAboveBassScaleIndex = function () {
    console.log("getThirdAboveBassScaleIndex() not implemented yet... <br />");
    return this.getBassScaleIndex() + 2
};
ConstantHarmonyElement.prototype.getChordRootPositionAbsoluteOffsets = function (e) {
    var a = [];
    var d = this.getChordRootPositionScaleIndices(e);
    var h = this.getScale();
    var g = d[0];
    var c = this.getAbsoluteNote(this.baseNote, h, g);
    var f = c - this.baseNote;
    for (var b = 0; b < d.length; b++) {
        a[b] = this.getAbsoluteNote(this.baseNote, h, d[b]) - c + f
    }
    return a
};
ConstantHarmonyElement.prototype.getChordRootPositionScaleIndices = function (c) {
    var b = this.chordRoot;
    var a = [b, b + 2, b + 4];
    switch (this.chordType) {
        case ChordType.CUSTOM:
            a = arrayCopy(this.chord);
            break;
        case ChordType.SEVENTH:
            a = [b, b + 2, b + 4, b + 6];
            break;
        case ChordType.NINTH:
            a = [b, b + 2, b + 4, b + 6, b + 8];
            break;
        case ChordType.TRIAD:
            a = [b, b + 2, b + 4];
            break;
        case ChordType.SUS2:
            a = [b, b + 1, b + 4];
            break;
        case ChordType.SUS4:
            a = [b, b + 3, b + 4];
            break;
        case ChordType.SUS2_SEVENTH:
            a = [b, b + 1, b + 4, b + 6];
            break;
        case ChordType.SUS4_SEVENTH:
            a = [b, b + 3, b + 4, b + 6];
            break
    }
    if (c) {
        a.length = c
    }
    return a
};
ConstantHarmonyElement.prototype.getAbsoluteNoteFromChordBassIndex = function (a) {
    var c = this.getChordRootPositionAbsoluteOffsets();
    var d = c[0];
    for (var b = 0; b < c.length; b++) {
        c[b] -= d
    }
    return this.getAbsoluteNote(this.baseNote + d, c, a + this.chordInversions)
};
ConstantHarmonyElement.prototype.getAbsoluteNoteFromChordRootIndex = function (a, d) {
    var c = this.getChordRootPositionAbsoluteOffsets(d);
    var e = c[0];
    for (var b = 0; b < c.length; b++) {
        c[b] -= e
    }
    return this.getAbsoluteNote(this.baseNote + e, c, a)
};
ConstantHarmonyElement.prototype.getAbsoluteNoteFromScaleIndex = function (b) {
    var a = this.getScale();
    return this.getAbsoluteNote(this.baseNote, a, b)
};
ConstantHarmonyElement.prototype.getAbsoluteNotesFromScaleIndices = function (d) {
    var b = this.getScale();
    var a = [];
    for (var c = 0; c < d.length; c++) {
        a.push(this.getAbsoluteNote(this.baseNote, b, d[c]))
    }
    return a
};
ConstantHarmonyElement.prototype.getChordAbsoluteNotes = function () {
    return this.getAbsoluteNotesFromScaleIndices(this.getChordScaleIndices())
};
ConstantHarmonyElement.prototype.getChordPitchClasses = function () {
    return this.getPitchClassesFromAbsoluteNotes(this.getAbsoluteNotesFromScaleIndices(this.getChordScaleIndices()))
};
ConstantHarmonyElement.prototype.getAbsoluteNote = function (e, c, b) {
    var a = 0;
    var d = 0;
    a = positiveMod(b, c.length);
    if (b >= 0) {
        d = Math.floor(b / c.length)
    } else {
        d = -Math.floor((-b + c.length - 1) / c.length)
    }
    return e + 12 * d + c[a]
};
ConstantHarmonyElement.prototype.getPitchClasses = function (d, c) {
    var a = [];
    for (var b = 0; b < c.length; b++) {
        a[b] = (d + c[b]) % 12
    }
    return a
};
ConstantHarmonyElement.prototype.getPitchClassesFromAbsoluteNotes = function (b) {
    var a = [];
    for (var c = 0; c < b.length; c++) {
        a[c] = b[c] % 12
    }
    return a
};
ConstantHarmonyElement.prototype.getPitchClassesFromScaleIndices = function (c) {
    var a = [];
    for (var b = 0; b < c.length; b++) {
        a[b] = this.getAbsoluteNoteFromScaleIndex(c[b]) % 12
    }
    return a
};
ConstantHarmonyElement.prototype.pitchClassDistance = function (b, a) {
    return Math.min(Math.abs(b - a), 12 - Math.abs(b - a))
};
ConstantHarmonyElement.prototype.lowerPitchClassDistance = function (b, a) {
    if (a <= b) {
        return b - a
    } else {
        return b + 12 - a
    }
};
ConstantHarmonyElement.prototype.getClosestNoteWithPitchClasses = function (d, c, h) {
    if (!h) {
        h = this.pitchClassDistance
    }
    d = Math.min(127, Math.max(1, d));
    var k = d % 12;
    var g = 99999;
    var b = 0;
    for (var e = 0; e < c.length; e++) {
        var a = h(k, c[e]);
        if (a < g) {
            g = a;
            b = c[e]
        }
    }
    var f = d + g;
    var j = d - g;
    if (f <= 127 && (f % 12) == b) {
        return d + g
    } else {
        if (j > 1 && (j % 12) == b) {
            return d - g
        } else {
            console.log("Error in getClosestNotewithPitchClasses() input " + d + " and " + c + "<br />");
            return Math.floor(d / 12) * 12 + b
        }
    }
};
ConstantHarmonyElement.prototype.getChordRootIndexAndChromaticOffsetForAbsoluteNote = function (g, e) {
    var b = this.getChordRootPositionAbsoluteOffsets(e);
    var d = this.getBaseNote();
    var f = b[0];
    d += f;
    for (var c = 0; c < b.length; c++) {
        b[c] -= f
    }
    var a = this.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(g, d, b);
    return a
};
ConstantHarmonyElement.prototype.getScaleIndexAndChromaticOffsetForAbsoluteNote = function (a) {
    return this.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(a, this.getBaseNote(), this.getScale())
};
ConstantHarmonyElement.prototype.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic = function (c, a, d) {
    var k = 0;
    var h = 0;
    var g = c - a;
    var e = 0;
    var l = g;
    while (l < 0) {
        l += 12;
        e--
    }
    while (l > 11) {
        l -= 12;
        e++
    }
    var j = 9999999;
    for (var b = 0; b < d.length; b++) {
        if (d[b] == l) {
            h = b + e * d.length;
            k = 0;
            break
        } else {
            var f = l - d[b];
            if (Math.abs(f) < j) {
                j = Math.abs(f);
                h = b + e * d.length;
                k = f
            }
        }
    }
    return [h, k]
};
ConstantHarmonyElement.prototype.getScaleAbsoluteNotes = function () {
    var a = [];
    var d = this.getScale();
    for (var c = 0; c < d.length; c++) {
        var b = this.getAbsoluteNoteFromScaleIndex(c);
        a.push(b)
    }
    return a
};
ConstantHarmonyElement.prototype.getVerticalRelativeAbsoluteNote = function (a, b) {
    var c = null;
    switch (a) {
        case VerticalRelativeType.VOICE_LINE:
        case VerticalRelativeType.NOTE:
            if (b) {
                c = this.getAbsoluteNoteConstantVoiceLineElement(b)
            } else {
                c = this.getBaseNote()
            }
            break;
        case VerticalRelativeType.MIDI_ZERO:
            c = 0;
            break;
        case VerticalRelativeType.SCALE_BASE:
            c = this.getBaseNote();
            break;
        case VerticalRelativeType.CHORD_ROOT:
            c = this.getAbsoluteNoteFromChordRootIndex(0);
            break;
        case VerticalRelativeType.CHORD_BASS:
            c = this.getAbsoluteNoteFromChordBassIndex(0);
            break
    }
    return c
};
ConstantHarmonyElement.prototype.getAbsoluteNoteWithIndexType = function (c, b) {
    var a = 0;
    switch (b) {
        case IndexType.SCALE:
            a = this.getAbsoluteNoteFromScaleIndex(c);
            break;
        case IndexType.CHORD_ROOT:
            a = this.getAbsoluteNoteFromChordRootIndex(c);
            break;
        case IndexType.CHORD_BASS:
            a = this.getAbsoluteNoteFromChordBassIndex(c);
            break;
        case IndexType.MIDI_NOTE:
            a = c;
            break
    }
    return a
};
ConstantHarmonyElement.prototype.getAbsoluteNoteConstantVoiceLineElement = function (b) {
    var a = this.getAbsoluteNoteWithIndexType(b.index, b.indexType);
    a = this.snap(a, b.snapType, this);
    return a + 12 * b.octaves
};
ConstantHarmonyElement.prototype.snap = function (f, b, e) {
    var a = Math.min(127, Math.max(1, f));
    switch (b) {
        case SnapType.NONE:
            break;
        case SnapType.SCALE:
            var d = e.getPitchClasses(e.baseNote, e.getScale());
            a = e.getClosestNoteWithPitchClasses(a, d);
            break;
        case SnapType.CHORD:
            var c = e.getChordRootPositionScaleIndices();
            var d = e.getPitchClassesFromScaleIndices(c);
            a = e.getClosestNoteWithPitchClasses(a, d);
            break
    }
    return a
};
ConstantHarmonyElement.prototype.offset = function (h, d, f, g) {
    var a = h;
    switch (d) {
        case OffsetType.SCALE:
            var c = g.getScaleIndexAndChromaticOffsetForAbsoluteNote(a);
            var e = c[0] + f;
            var b = g.getAbsoluteNoteFromScaleIndex(e);
            a = b;
            break;
        case OffsetType.HALF_STEP:
            a = h + f;
            break;
        case OffsetType.CHORD:
            var c = g.getChordRootIndexAndChromaticOffsetForAbsoluteNote(a);
            a = g.getAbsoluteNoteFromChordRootIndex(c[0] + f);
            break;
        case OffsetType.CHORD_TRIAD_ONLY:
            var c = g.getChordRootIndexAndChromaticOffsetForAbsoluteNote(a, 3);
            a = g.getAbsoluteNoteFromChordRootIndex(c[0] + f);
            break;
        case OffsetType.CHORD_SEVENTH_ONLY:
            var c = g.getChordRootIndexAndChromaticOffsetForAbsoluteNote(a, 4);
            a = g.getAbsoluteNoteFromChordRootIndex(c[0] + f);
            break;
        case OffsetType.OCTAVE:
            a = h + f * 12;
            break;
        default:
            console.log(" offset type " + OffsetType.toString(d) + " not supported yet");
            break
    }
    return a
};
ConstantHarmonyElement.prototype.snapOffsetSnap = function (g, c, d, b, e, f) {
    var a = g;
    a = f.snap(a, c, f);
    a = f.offset(a, d, e, f);
    a = f.snap(a, b, f);
    return a
};

function HarmonyModifier() {
    this.id = "";
    this.active = true;
    this._constructorName = "HarmonyModifier"
}
HarmonyModifier.prototype.modifyConstantHarmonyElements = function (b, a) {
    return b
};

function SuspendHarmonyModifier() {
    HarmonyModifier.call(this);
    this.seed = 12345;
    this.voiceLineOnPattern = [1];
    this.suspendProbabilities = [0.25];
    this.doubleSuspendProbabilities = [0.1];
    this.tripleSuspendProbabilities = [0.05];
    this._constructorName = "SuspendHarmonyModifier"
}
SuspendHarmonyModifier.prototype = new SectionModifier();
SuspendHarmonyModifier.prototype.modifyConstantHarmonyElements = function (e, b) {
    var v = copyValueDeep(e);
    var Q = getValueOrExpressionValue(this, "active", b);
    if (Q && e.length > 0) {
        var B = getValueOrExpressionValue(this, "seed", b);
        var c = getValueOrExpressionValue(this, "suspendProbabilities", b);
        var Y = false;
        var H = false;
        var L = false;
        var m = false;
        var E = true;
        var C = 2;
        var h = [];
        var O = 0;
        var l = positionUnitToBeats(1, PositionUnit.MEASURES, e[0].tsNumerator, e[0].tsDenominator);
        var M = 2;
        for (var U = 0; U < v.length - 1; U++) {
            var V = {};
            var p = v[U];
            var D = v[U + 1];
            var a = p.getBeatLength();
            var F = D.getBeatLength();
            var s = p.getChordScaleIndices();
            var A = p.getAbsoluteNotesFromScaleIndices(s);
            var I = p.getPitchClassesFromAbsoluteNotes(A);
            var z = D.getChordScaleIndices();
            var n = D.getAbsoluteNotesFromScaleIndices(z);
            var N = D.getPitchClassesFromAbsoluteNotes(n);
            var X = [];
            var d = p.getBeatLength();
            var J = D.getBeatLength();
            var G = !D.isSus();
            G = G && F >= M;
            if (F == 2 && (a == 4 || a == 6 || a == 8)) {
                G = false
            }
            var t = O + d;
            var u = (t % l);
            if (u != 0 && u != 2) {
                G = G && L
            }
            G = G && J >= C;
            if (G) {
                for (var T = 0; T < I.length; T++) {
                    var S = I[T];
                    var o = p.getClosestNoteWithPitchClasses(S + 24, N) % 12;
                    if (o == S && !H) {
                        continue
                    }
                    for (var R = 0; R < N.length; R++) {
                        var x = N[R];
                        var y = p.lowerPitchClassDistance(S, x);
                        if (S == x) {
                            console.log(" bad closest? " + o + " " + S + " " + x);
                            continue
                        }
                        if (y > 2) {
                            continue
                        }
                        X.push([S, x])
                    }
                }
            }
            V.pairs = X;
            if (V.pairs.length > 0) {
                V.text = p.toRomanString() + "->" + D.toRomanString()
            }
            h.push(V);
            O += d
        }
        if (c.length == 0) {
            c = [0.2]
        }
        var P = new MersenneTwister(B);
        for (var U = 0; U < h.length; U++) {
            var V = h[U];
            if (P.random() < c[U % c.length]) {
                var r = 1;
                if (P.random() < this.doubleSuspendProbabilities[U % this.doubleSuspendProbabilities.length]) {
                    r = 2
                }
                if (P.random() < this.tripleSuspendProbabilities[U % this.tripleSuspendProbabilities.length]) {
                    r = 3
                }
                var g = Math.min(V.pairs.length, r);
                var K = [];
                for (var T = 0; T < V.pairs.length; T++) {
                    K.push({
                        data: T,
                        likelihood: 1
                    })
                }
                var f = sampleNDataWithoutReplacement(K, g, P);
                for (var T = 0; T < f.length; T++) {
                    var q = V.pairs[f[T]];
                    var W = new SuspendVoiceLinePlannerConstraint();
                    W.onPattern = copyValueDeep(this.voiceLineOnPattern);
                    W.suspendPitchClassPairs.push(q);
                    v[U + 1].voiceLineConstraints.push(W);
                    var w = new ConditionalSuspendSectionModifier();
                    w.harmonyIndex = U;
                    w.suspendPitchClassPairs.push(q);
                    v[U + 1].sectionModifiers.push(w)
                }
            }
        }
    }
    return v
};

function RandomShortenHarmonyModifier() {
    HarmonyModifier.call(this);
    this.totalBeats = [0];
    this.maxAttempts = 20;
    this.indexLikelihoods = [1];
    this.startIndexLikelihoods = [];
    this.endIndexLikelihoods = [];
    this.minElementLength = 1;
    this.minElementLengthUnit = PositionUnit.BEATS;
    this.seed = 12345;
    this._constructorName = "RandomShortenHarmonyModifier"
}
RandomShortenHarmonyModifier.prototype = new HarmonyModifier();
RandomShortenHarmonyModifier.prototype.modifyConstantHarmonyElements = function (m, b) {
    var l = copyValueDeep(m);
    if (!this.active) {
        return l
    }
    if (l.length > 0) {
        var p = [];
        for (var s = 0; s < l.length; s++) {
            var d = getItemFromArrayWithStartEndItems(1, this.indexLikelihoods, l.length, s, this.startIndexLikelihoods, this.endIndexLikelihoods);
            p.push(d)
        }
        var n = getProbabilityDistribution(fixLikelihoods(p));
        var k = new MersenneTwister(this.seed);

        function g(v) {
            var I = [];
            var C = 0;
            var D = new ConstantHarmonicRythm(v);
            var H = positionUnitToBeats2(1, PositionUnit.MEASURES, C, D);
            var F = [];
            var w = v[0].tsNumerator;
            var E = HarmonyGenerator.prototype.getStartBeatStrengthsFromHarmonyElements(b, v, 0, w);
            for (var B = 0; B < v.length; B++) {
                var y = 0;
                if (B < v.length - 1) {
                    y = HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCost(v[B], E[B], v[B + 1], E[B + 1])
                }
                F[B] = y > 0;
                var G = v[B].getBeatLength();
                var x = Math.floor(C / H);
                var z = Math.floor((C + G) / H);
                var A = z * H;
                var j = C + G - A;
                F[B] = F[B] || (z > x && j > 0.01);
                C += G
            }
            return F
        }
        var a = g(l);
        for (var q = 0; q < this.totalBeats.length; q++) {
            var o = this.totalBeats[q];
            var h = false;
            for (var s = 0; s < this.maxAttempts; s++) {
                var f = sampleIndexIntegerDistribution(k, n);
                var e = l[f];
                var r = e.getBeatLength();
                e.length = r;
                e.lengthUnit = PositionUnit.BEATS;
                var c = positionUnitToBeats(this.minElementLength, this.minElementLengthUnit, e.tsNumerator, e.tsDenominator);
                if (r - o >= c) {
                    var u = e.length;
                    e.length -= o;
                    var t = g(l);
                    if (arrayEquals(a, t)) {
                        h = true;
                        break
                    } else {
                        e.length = u
                    }
                }
            }
            if (h) {
                break
            }
        }
    }
    return l
};

function MultiRandomShortenHarmonyModifier() {
    HarmonyModifier.call(this);
    this.totalBeats = [
        [0]
    ];
    this.maxAttempts = 20;
    this.indexLikelihoods = [
        [1]
    ];
    this.startIndexLikelihoods = [];
    this.endIndexLikelihoods = [];
    this.minElementLengths = [1];
    this.minElementLengthUnit = PositionUnit.BEATS;
    this.seed = 12345;
    this._constructorName = "MultiRandomShortenHarmonyModifier"
}
MultiRandomShortenHarmonyModifier.prototype = new HarmonyModifier();
MultiRandomShortenHarmonyModifier.prototype.modifyConstantHarmonyElements = function (a, c) {
    if (!this.active) {
        return copyValueDeep(a)
    }

    function d(m) {
        var n = 0;
        for (var l = 0; l < m.length; l++) {
            n += m[l].getBeatLength()
        }
        return n
    }
    var g = d(a);
    for (var f = 0; f < this.totalBeats.length; f++) {
        var h = this.totalBeats[f];
        var e = new RandomShortenHarmonyModifier();
        e.totalBeats = h;
        e.maxAttempts = this.maxAttempts;
        e.indexLikelihoods = this.indexLikelihoods.length > 0 ? this.indexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.indexLikelihoods.length, f)] : [1];
        e.startIndexLikelihoods = this.startIndexLikelihoods.length > 0 ? this.startIndexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.startIndexLikelihoods.length, f)] : [];
        e.endIndexLikelihoods = this.endIndexLikelihoods.length > 0 ? this.endIndexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.endIndexLikelihoods.length, f)] : [];
        e.minElementLength = this.minElementLengths.length > 0 ? this.minElementLengths[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.minElementLengths.length, f)] : 1;
        e.minElementLengthUnit = this.minElementLengthUnit;
        e.seed = this.seed;
        var b = copyValueDeep(a);
        var k = e.modifyConstantHarmonyElements(b, c);
        var j = d(k);
        if (h == 0 || (j < g - 0.9 * h)) {
            return k
        }
    }
    return copyValueDeep(a)
};

function AppendHarmonyModifier() {
    HarmonyModifier.call(this);
    this.elements = [];
    this._constructorName = "AppendHarmonyModifier"
}
AppendHarmonyModifier.prototype = new HarmonyModifier();
AppendHarmonyModifier.prototype.modifyConstantHarmonyElements = function (f, d) {
    var a = copyValueDeep(f);
    if (!this.active) {
        return a
    }
    for (var c = 0; c < this.elements.length; c++) {
        var g = this.elements[c];
        var b = g.getConstantHarmonyElements(d);
        addAll(a, b)
    }
    return a
};

function PartialHarmonyModifier() {
    HarmonyModifier.call(this);
    this._constructorName = "PartialHarmonyModifier"
}
PartialHarmonyModifier.prototype = new HarmonyModifier();
PartialHarmonyModifier.prototype.getModifierIndexRanges = function (b, a) {
    return [
        [0, b.length - 1]
    ]
};
PartialHarmonyModifier.prototype.modifyHarmonyElement = function (a, c, b) { };
PartialHarmonyModifier.prototype.modifyIndexRange = function (c, d, b) {
    for (var a = c[0]; a <= c[1]; a++) {
        this.modifyHarmonyElement(a, d, b)
    }
};
PartialHarmonyModifier.prototype.modifyConstantHarmonyElements = function (f, e) {
    var a = copyValueDeep(f);
    if (!this.active) {
        return a
    }
    var b = this.getModifierIndexRanges(f, e);
    for (var d = 0; d < b.length; d++) {
        var c = b[d];
        this.modifyIndexRange(c, a, e)
    }
    return a
};

function ModeMixtureHarmonyModifier() {
    HarmonyModifier.call(this);
    this.majorRoots = [];
    this.majorFromRoots = [];
    this.majorNewScaleTypes = [ScaleType.NATURAL_MINOR];
    this.minorRoots = [4, 6];
    this.minorFromRoots = [];
    this.minorNewScaleTypes = [ScaleType.MELODIC_MINOR, ScaleType.HARMONIC_MINOR];
    this.indexRanges = [];
    this.modifyPattern = [1];
    this.startModifyPattern = [];
    this.endModifyPattern = [];
    this.addCrossRelationConstraint = true;
    this._constructorName = "ModeMixtureHarmonyModifier"
}
ModeMixtureHarmonyModifier.prototype = new HarmonyModifier();
ModeMixtureHarmonyModifier.prototype.modify = function (j, a, d, c, l, b) {
    var g = a[j];
    var f = g.getAbsoluteNoteFromChordRootIndex(0) % 12;
    var k = false;
    if (c.length == 0) {
        k = true
    }
    if (j > 0) {
        var n = a[j - 1];
        var m = n.getAbsoluteNoteFromChordRootIndex(0) % 12;
        for (var e = 0; e < c.length; e++) {
            var h = n.getAbsoluteNoteFromScaleIndex(c[e]) % 12;
            if (h == m) {
                k = true;
                break
            }
        }
    }
    if (k) {
        k = false;
        for (var e = 0; e < l.length; e++) {
            var h = g.getAbsoluteNoteFromScaleIndex(l[e]) % 12;
            if (h == f) {
                k = true;
                break
            }
        }
    }
    if (k) {
        g.scaleType = b
    }
};
ModeMixtureHarmonyModifier.prototype.modifyHarmonyElement = function (a, d, c) {
    var b = d[a];
    switch (b.scaleType) {
        case ScaleType.MAJOR:
            this.modify(a, d, c, this.majorFromRoots, this.majorRoots, this.majorNewScaleTypes[a % this.majorNewScaleTypes.length]);
            break;
        case ScaleType.NATURAL_MINOR:
            this.modify(a, d, c, this.minorFromRoots, this.minorRoots, this.minorNewScaleTypes[a % this.minorNewScaleTypes.length]);
            break
    }
};
ModeMixtureHarmonyModifier.prototype.modifyConstantHarmonyElements = function (e, c) {
    var a = copyValueDeep(e);
    var f = getValueOrExpressionValue(this, "active", c);
    if (!f) {
        return a
    }
    var d = {};
    for (var b = 0; b < this.indexRanges.length; b++) {
        if (!d[b]) {
            this.modifyHarmonyElement(b, a, c);
            d[b] = true
        }
    }
    for (var b = 0; b < e.length; b++) {
        var g = getItemFromArrayWithStartEndItems(0, this.modifyPattern, e.length, b, this.startModifyPattern, this.endModifyPattern);
        if (g != 0 && !d[b]) {
            this.modifyHarmonyElement(b, a, c);
            d[b] = true
        }
    }
    return a
};
SequenceHarmonyElement.prototype.getTsNumerator = function (b) {
    var c = getValueOrExpressionValue(this, "tsNumerators", b);
    var a = c.length == 0 ? 4 : c[0];
    return a
};
SequenceHarmonyElement.prototype.getStartBeatStrengths = function (c, d, a, e) {
    var b = this.getTsNumerator(c);
    return HarmonyGenerator.prototype.getStartBeatStrengths(c, d, a, b, e)
};
SequenceHarmonyElement.prototype.getBeatLengths = function (c) {
    var u = [];
    var l = getValueOrExpressionValue(this, "tsNumerators", c);
    var z = getValueOrExpressionValue(this, "tsDenominators", c);
    var a = getValueOrExpressionValue(this, "count", c);
    var e = l.length == 0 ? 4 : l[0];
    var J = z.length == 0 ? 4 : z[0];
    switch (this.harmonyLengthMode) {
        case HarmonyLengthMode.COUNT_AND_RYTHM:
        case HarmonyLengthMode.RYTHM_ONLY:
            var n = getValueOrExpressionValue(this, "lengthRythm", c);
            var R = c.getRythm(n);
            if (!R) {
                console.log("Unable to find rythm " + n + "<br />");
                break
            }
            var O = getValueOrExpressionValue(this, "rythmTsNumerator", c);
            var S = new ConstantHarmonicRythm([new ConstantHarmonyElement().setTimeSignature(O, this.rythmTsDenominator)]);
            var g = R.getNoteRythmElements(c, S, 0);
            if (this.harmonyLengthMode == HarmonyLengthMode.RYTHM_ONLY) {
                a = g.length
            }
            var w = 0;
            for (var N = 0; N < Math.max(1, a); N++) {
                e = getItemFromArrayWithStartEndItems(4, l, a, N, this.startTsNumerators, this.endTsNumerators);
                J = getItemFromArrayWithStartEndItems(4, z, a, N, this.startTsDenominators, this.endTsDenominators);
                var f = Math.max(1, J);
                if (g.length > 0) {
                    var o = new ConstantHarmonicRythm([new ConstantHarmonyElement().setTimeSignature(e, J)]);
                    var p = g[N % g.length];
                    f = positionUnitToBeats(p.length, p.lengthUnit, e, J, o)
                }
                u.push(f);
                w += f
            }
            var I = getValueOrExpressionValue(this, "totalLength", c);
            var h = positionUnitToBeats(I, this.totalLengthUnit, e, J, S);
            var m = h / w;
            for (var N = 0; N < u.length; N++) {
                u[N] = u[N] * m
            }
            break;
        case HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN:
            var B = getValueOrExpressionValue(this, "lengthPattern", c);
            var G = getValueOrExpressionValue(this, "startLengthPattern", c);
            var v = getValueOrExpressionValue(this, "endLengthPattern", c);
            for (var N = 0; N < Math.max(1, a); N++) {
                e = getItemFromArrayWithStartEndItems(4, l, a, N, this.startTsNumerators, this.endTsNumerators);
                J = getItemFromArrayWithStartEndItems(4, z, a, N, this.startTsDenominators, this.endTsDenominators);
                var t = getItemFromArrayWithStartEndItems(1, B, a, N, G, v);
                var f = positionUnitToBeats(t, this.lengthPatternUnit, e, J, null);
                f = Math.max(1, f);
                u.push(f)
            }
            break
    }
    var Q = u.length;
    for (var N = 0; N < this.lengthRepeats; N++) {
        for (var L = 0; L < Q; L++) {
            u.push(u[L])
        }
    }
    if (u.length == 0) {
        u.push(1)
    }
    if (this.usePositionSnap && this.positionSnapPattern.length > 0) {
        var K = 0;
        var q = 0;
        var d = 0;
        var k = 0;
        while (d < u.length) {
            var t = u[d];
            K += t;
            if (K < q) { } else {
                var b = q;
                while (q < K) {
                    var y = this.positionSnapPattern[k % this.positionSnapPattern.length];
                    var E = positionUnitToBeats(y, this.positionSnapUnit, e, J, null);
                    E = Math.max(1 / 16, E);
                    b = q;
                    q += E;
                    k++
                }
                var C = b - K;
                var F = q - K;
                var M = 0;
                switch (this.positionSnapMetrics) {
                    case SnapMetrics.CEIL:
                        if (C >= 0) {
                            M = C
                        } else {
                            M = F
                        }
                        break;
                    case SnapMetrics.FLOOR:
                        if (C + t > (1 / 16)) {
                            M = C
                        } else {
                            M = F
                        }
                        break;
                    case SnapMetrics.ROUND:
                        if (C + t > (1 / 16)) {
                            if (Math.abs(C) < Math.abs(F)) {
                                M = C
                            } else {
                                M = F
                            }
                        } else {
                            M = F
                        }
                        break
                }
                t += M;
                K += M;
                u[d] = t
            }
            d++
        }
    }
    var x = getValueOrExpressionValue(this, "useMaxElementLength", c);
    if (x) {
        var P = [];
        var H = getValueOrExpressionValue(this, "maxElementLength", c);
        var r = getValueOrExpressionValue(this, "maxElementLengthUnit", c);
        var D = positionUnitToBeats(H, r, e, J);

        function A(T) {
            var j = [];
            if (T > D) {
                j.push(D);
                addAll(j, A(T - D))
            } else {
                if (T > 0.01) {
                    j.push(T)
                }
            }
            return j
        }
        for (var N = 0; N < u.length; N++) {
            var s = u[N];
            addAll(P, A(s))
        }
        u = P
    }
    return u
};
SequenceHarmonyElement.prototype.setLengthsAndPhraseStructure = function (h, b, k) {
    if (h != null) {
        if (!k) {
            k = 0
        }
        var c = this.getBeatLengths(b);
        var f = this.getStartBeatStrengths(b, c, k);
        for (var d = 0; d < h.length; d++) {
            var j = h[d];
            j.length = c[d % c.length];
            j.lengthUnit = PositionUnit.BEATS;
            j.startBeatStrength = f[d % f.length]
        }
        var e = getValueOrExpressionValue(this, "phraseStructureCounts", b);
        if (!e || typeof (e) === "undefined") {
            e = []
        }
        var g = 0;
        for (var d = 0; d < e.length; d++) {
            if (g < h.length) {
                h[g].startsPhrase = true
            }
            var a = e[d];
            g += a
        }
    }
};
SequenceHarmonyElement.prototype.getConstantHarmonyElements = function (b, a) {
    console.log(this._constructorName + " must implement getConstantHarmonyElements() <br />")
};
SimpleSequenceHarmonyElement.prototype.getConstantHarmonyElements = function (c, q) {
    var r = [];
    var o = this.getBeatLengths(c);
    for (var e = 0; e < o.length; e++) {
        var n = o[e];
        var p = new ConstantHarmonyElement();
        p.length = n;
        p.lengthUnit = PositionUnit.BEATS;
        var l = getItemFromArrayWithStartEndItems(0, this.scaleBaseNoteIndices, o.length, e, this.startScaleBaseNoteIndices, this.endScaleBaseNoteIndices);
        p.baseNote = this.scaleBaseNotes.length > 0 ? this.scaleBaseNotes[l % this.scaleBaseNotes.length] : 60;
        var h = getItemFromArrayWithStartEndItems(0, this.scaleTypeIndices, o.length, e, this.startScaleTypeIndices, this.endScaleTypeIndices);
        p.scaleType = this.scaleTypes.length > 0 ? this.scaleTypes[h % this.scaleTypes.length] : ScaleType.MAJOR;
        var k = getItemFromArrayWithStartEndItems(0, this.chordTypeIndices, o.length, e, this.startChordTypeIndices, this.endChordTypeIndices);
        p.chordType = this.chordTypes.length > 0 ? this.chordTypes[k % this.chordTypes.length] : ChordType.TRIAD;
        p.chordRoot = getItemFromArrayWithStartEndItems(0, this.chordRoots, o.length, e, this.startChordRoots, this.endChordRoots);
        p.chordInversions = getItemFromArrayWithStartEndItems(0, this.chordInversions, o.length, e, this.startChordInversions, this.endChordInversions);
        p.scaleMode = getItemFromArrayWithStartEndItems(0, this.scaleModes, o.length, e, this.startScaleModes, this.endScaleModes);
        var g = getItemFromArrayWithStartEndItems(0, this.customScaleIndices, o.length, e, this.startCustomScaleIndices, this.endCustomScaleIndices);
        p.scale = this.customScales.length > 0 ? this.customScales[g % this.customScales.length] : [0, 2, 3, 5, 7, 9, 11];
        var f = getItemFromArrayWithStartEndItems(0, this.customChordIndices, o.length, e, this.startCustomChordIndices, this.endCustomChordIndices);
        p.chord = this.customChords.length > 0 ? this.customChords[f % this.customChords.length] : [0, 2, 4];
        if (p.chord.length == 0) {
            p.chord = [0, 2, 4]
        }
        p.tsNumerator = getItemFromArrayWithStartEndItems(4, this.tsNumerators, o.length, e, this.startTsNumerators, this.endTsNumerators);
        if (this.voiceLineConstraints.length > 0) {
            var b = getItemFromArrayWithStartEndItems([], this.voiceLineConstraintIndices, o.length, e, this.startVoiceLineConstraintIndices, this.endVoiceLineConstraintIndices);
            if (b.length > 0) {
                for (var d = 0; d < b.length; d++) {
                    var m = b[d];
                    if (m >= 0) {
                        var a = this.voiceLineConstraints[m % this.voiceLineConstraints.length];
                        p.voiceLineConstraints.push(a)
                    }
                }
            }
        }
        r.push(p)
    }
    return r
};
PlannedHarmonyElement.prototype.fillOptions = function (a, b) {
    var d = this.getBeatLengths(b);
    var c = d.length;
    a.scaleBaseNote = getValueOrExpressionValue(this, "scaleBaseNote", b);
    a.count = c;
    a.seed = this.seed
};
PlannedHarmonyElement.prototype.setCount = function (a) {
    this.count = a;
    return this
};
StaticSequenceHarmonyElement.prototype.fillOptions = function (a, b) {
    copyObjectPropertiesDeep(a, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, a, b)
};
StaticSequenceHarmonyElement.prototype.getConstantHarmonyElements = function (d, b) {
    if (!d) {
        console.log("module missing in " + this._constructorName + "<br />");
    }
    var c = {};
    this.fillOptions(c, d);
    var e = new StaticHarmonyGenerator(c);
    var a = e.searchML();
    this.setLengthsAndPhraseStructure(a, d);
    return a
};
DynamicSequenceHarmonyElement.prototype.fillOptions = function (a, c) {
    copyObjectPropertiesDeep(a, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, a, c);
    a.modulateLikelihoods = [1];
    for (var b = 0; b < a.count; b++) {
        a.modulateLikelihoods[b] = getItemFromArrayWithStartEndItems(1, this.modulateLikelihoods, a.count, b, this.startModulateLikelihoods, this.endModulateLikelihoods);
        var d = a.count > 1 ? a.count - 1 : 1;
        a.majorProgressionMovements[b] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.majorProgressionMovements, d, b, this.startMajorProgressionMovements, this.endMajorProgressionMovements);
        a.minorProgressionMovements[b] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.minorProgressionMovements, d, b, this.startMinorProgressionMovements, this.endMinorProgressionMovements)
    }
};
DynamicSequenceHarmonyElement.prototype.getConstantHarmonyElements = function (d, b) {
    if (!d) {
        console.log("module missing in " + this._constructorName + "<br />");
    }
    var c = {};
    this.fillOptions(c, d);
    var e = new DynamicHarmonyGenerator(c);
    var a = e.searchML();
    this.setLengthsAndPhraseStructure(a, d);
    return a
};
var PhraseHarmonyElementShorteningMode = {
    BEATS: 0
};


function PhraseHarmonyElement() {
    PlannedHarmonyElement.call(this);
    this.phraseType = PhraseHarmonyElementType.COMPLETE;
    this.harmonyReference = "";
    this.modulate = false;
    this.modulateInvertScaleType = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.modulateRemoveDominant = true;
    this.modulateRemoveInitialTonic = true;
    this.modulateStaticLengthFactor = 0.2;
    this.modulateDynamicLengthFactor = 5;
    this.modulateDominantCadenceLengthFactor = 0.2;
    this.modulateTonicCadenceLengthFactor = 0.2;
    this.majorDeceptiveRoot = 5;
    this.majorDeceptiveInversions = 0;
    this.minorDeceptiveRoot = 5;
    this.minorDeceptiveInversions = 0;
    this.staticHarmonyLength = 25;
    this.staticHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthLimits = [0, 100];
    this.staticHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthImportance = 1;
    this.staticHarmonyUseLocalSeed = false;
    this.staticHarmonySeed = 12345;
    this.staticHarmonyRaiseLeadingToneRoots = [4, 6];
    this.staticHarmonyPassingChordLikelihood = 1;
    this.staticHarmonyNeighbourChordLikelihood = 1;
    this.staticHarmonySus2ChordLikelihood = 1;
    this.staticHarmonySus4ChordLikelihood = 1;
    this.staticHarmonySimpleMixtureLikelihood = 1;
    this.dynamicHarmonyLength = 25;
    this.dynamicHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthLimits = [0, 100];
    this.dynamicHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthImportance = 1;
    this.dynamicHarmonyUseLocalSeed = false;
    this.dynamicHarmonySeed = 12345;
    this.dynamicHarmonyRaiseLeadingToneRoots = [];
    this.dynamicHarmonyRaiseLeadingToneAppliedRoots = [4, 6];
    this.dynamicHarmonyPassingChordLikelihood = 1;
    this.dynamicHarmonyNeighbourChordLikelihood = 1;
    this.dynamicHarmonySus2ChordLikelihood = 1;
    this.dynamicHarmonySus4ChordLikelihood = 1;
    this.dynamicHarmonySimpleMixtureLikelihood = 1;
    this.dominantCadenceHarmonyLength = 1;
    this.dominantCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.dominantCadenceHarmonyLengthLimits = [0, 100];
    this.dominantCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dominantCadenceHarmonyLengthImportance = 1;
    this.dominantCadenceHarmonyUseLocalSeed = false;
    this.dominantCadenceHarmonySeed = 12345;
    this.dominantCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.dominantCadenceHarmonyPassingChordLikelihood = 1;
    this.dominantCadenceHarmonyNeighbourChordLikelihood = 1;
    this.dominantCadenceHarmonySus2ChordLikelihood = 1;
    this.dominantCadenceHarmonySus4ChordLikelihood = 1;
    this.dominantCadenceHarmonySimpleMixtureLikelihood = 1;
    this.tonicCadenceHarmonyLength = 1;
    this.tonicCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.tonicCadenceHarmonyLengthLimits = [0, 100];
    this.tonicCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.tonicCadenceHarmonyLengthImportance = 1;
    this.tonicCadenceHarmonyUseLocalSeed = false;
    this.tonicCadenceHarmonySeed = 12345;
    this.tonicCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.tonicCadenceHarmonyPassingChordLikelihood = 1;
    this.tonicCadenceHarmonyNeighbourChordLikelihood = 1;
    this.tonicCadenceHarmonySus2ChordLikelihood = 1;
    this.tonicCadenceHarmonySus4ChordLikelihood = 1;
    this.tonicCadenceHarmonySimpleMixtureLikelihood = 1;
    this.overrideDefaultPhraseStructure = false;
    this.phraseShorteningMode = PhraseHarmonyElementShorteningMode.BEATS;
    this.phraseShorteningBeats = [
        [4],
        [4],
        [2],
        [2],
        [2],
        [1],
        [1],
        [1]
    ];
    this.phraseShorteningMinLengths = [1];
    this.phraseShorteningMinLengthUnit = PositionUnit.BEATS;
    this.raiseLeadingTone = true;
    this.maxLengthSearchSteps = 200;
    this._constructorName = "PhraseHarmonyElement"
}
PhraseHarmonyElement.prototype = new PlannedHarmonyElement();
PhraseHarmonyElement.prototype.getSeed = function (d, c, b) {
    var a = c;
    if (!b) {
        a = d.genrand_int32()
    }
    return a
};
PhraseHarmonyElement.prototype.shiftRight = function (d, b) {
    var c = d[b];
    var a = d[b + 1];
    a.unshift(c.pop())
};
PhraseHarmonyElement.prototype.shiftLeft = function (d, a) {
    var c = d[a];
    var b = d[a - 1];
    b.push(c.shift())
};
PhraseHarmonyElement.prototype.getSuccessors = function (f, c, d) {
    var a = [];
    for (var b = 0; b < f.length; b++) {
        if (f[b].length > 1) {
            if (b > 0) {
                var e = array2dCopy(f);
                this.shiftLeft(e, b);
                a.push(e);
                if (b > 1) {
                    e = array2dCopy(e);
                    this.shiftLeft(e, b - 1);
                    a.push(e)
                }
            }
            if (b < f.length - 1) {
                var e = array2dCopy(f);
                this.shiftRight(e, b);
                a.push(e);
                if (b < f.length - 2) {
                    e = array2dCopy(e);
                    this.shiftRight(e, b + 1);
                    a.push(e)
                }
            }
        }
    }
    return a
};
PhraseHarmonyElement.prototype.getBestSuccessor = function (c, e, j, h) {
    var b = this.getSuccessors(c, e, j);
    var a = 9999999;
    var k = b[0];
    for (var d = 0; d < b.length; d++) {
        var g = b[d];
        var f = this.getPenalty(g, e, j, h);
        if (f < a) {
            k = g;
            a = f
        }
    }
    return k
};
PhraseHarmonyElement.prototype.getBeatLengthFromIndices = function (d, c) {
    var a = 0;
    for (var b = 0; b < d.length; b++) {
        a += c[d[b]]
    }
    return a
};
PhraseHarmonyElement.prototype.getSinglePenalty = function (b, c) {
    var a = Math.abs(b - c) / c;
    return a
};
PhraseHarmonyElement.prototype.getPenalty = function (b, l, o, n) {
    var a = 0;
    for (var j = 0; j < b.length; j++) {
        var p = b[j];
        var c = l[j];
        var m = c.length;
        var g = c.lengthUnit;
        var k = p.length;
        var f = this.getBeatLengthFromIndices(p, o);
        var e = 0;
        switch (g) {
            case LengthAndCountUnit.COUNT:
                var d = m;
                e = this.getSinglePenalty(k, d);
                break;
            case LengthAndCountUnit.COUNT_PERCENT:
                var d = m * 0.01 * o.length;
                e = this.getSinglePenalty(k, d);
                break;
            case LengthAndCountUnit.LENGTH:
                var h = m;
                e = this.getSinglePenalty(f, h);
                break;
            case LengthAndCountUnit.LENGTH_PERCENT:
                var h = m * 0.01 * n;
                e = this.getSinglePenalty(f, h);
                break
        }
        a += e * c.importance
    }
    return a
};
PhraseHarmonyElement.prototype.getBestIndices = function (b, k, p, o) {
    var g = b;
    var h = this.getPenalty(g, k, p, o);
    var m = 0;
    for (var d = 0; d < g.length; d++) {
        m += g[d].length
    }
    var a = m - g.length + 1;
    for (var d = 0; d < g.length; d++) {
        var n = [];
        var f = 0;
        for (var c = 0; c < g.length; c++) {
            n[c] = [];
            if (c == d) {
                n[c] = createFilledNumericIncArray(a, f, 1);
                f += a
            } else {
                n[c] = [f];
                f += 1
            }
        }
        var l = this.getPenalty(n, k, p, o);
        if (l < h) {
            h = l;
            g = n
        }
    }
    for (var d = 0; d < this.maxLengthSearchSteps; d++) {
        var e = this.getBestSuccessor(g, k, p, o);
        if (e) {
            var l = this.getPenalty(e, k, p, o);
            if (l < h) {
                g = e;
                h = l
            } else {
                break
            }
        }
    }
    return g
};
PhraseHarmonyElement.prototype.getLengthInfos = function (d, b) {
    var g = getValueOrDefault(d, "modulate", false);
    var q = getValueOrDefault(d, "skipInitialTonic", false);
    var o = getValueOrDefault(d, "skipDynamicHarmony", false);
    var h = getValueOrDefault(d, "skipDominant", false);
    var s = getValueOrDefault(d, "skipTonicCadence", false);
    var m = getValueOrExpressionValue(this, "staticHarmonyLength", b);
    var a = getValueOrExpressionValue(this, "dynamicHarmonyLength", b);
    var r = getValueOrExpressionValue(this, "dominantCadenceHarmonyLength", b);
    var l = getValueOrExpressionValue(this, "tonicCadenceHarmonyLength", b);
    var p = [];
    if (!q) {
        p.push({
            importance: this.staticHarmonyLengthImportance,
            length: g ? this.modulateStaticLengthFactor * m : m,
            lengthUnit: this.staticHarmonyLengthUnit,
            lengthLimits: this.staticHarmonyLengthLimits,
            lengthLimitsUnit: this.staticHarmonyLengthLimitsUnit
        })
    }
    if (!o) {
        p.push({
            importance: this.dynamicHarmonyLengthImportance,
            length: g ? this.modulateDynamicLengthFactor * a : a,
            lengthUnit: this.dynamicHarmonyLengthUnit,
            lengthLimits: this.dynamicHarmonyLengthLimits,
            lengthLimitsUnit: this.dynamicHarmonyLengthLimitsUnit
        })
    }
    if (!h) {
        p.push({
            importance: this.dominantCadenceHarmonyLengthImportance,
            length: g ? this.modulateDominantCadenceLengthFactor * r : r,
            lengthUnit: this.dominantCadenceHarmonyLengthUnit,
            lengthLimits: this.dominantCadenceHarmonyLengthLimits,
            lengthLimitsUnit: this.dominantCadenceHarmonyLengthLimitsUnit
        })
    }
    if (!s) {
        p.push({
            importance: this.tonicCadenceHarmonyLengthImportance,
            length: g ? this.modulateTonicCadenceLengthFactor * l : l,
            lengthUnit: this.tonicCadenceHarmonyLengthUnit,
            lengthLimits: this.tonicCadenceHarmonyLengthLimits,
            lengthLimitsUnit: this.tonicCadenceHarmonyLengthLimitsUnit
        })
    }
    var f = p[0].lengthUnit;
    if (f == LengthAndCountUnit.LENGTH_PERCENT || f == LengthAndCountUnit.COUNT_PERCENT) {
        var k = true;
        var c = 0;
        for (var n = 0; n < p.length; n++) {
            var e = p[n].lengthUnit;
            if (f != e) {
                k = false
            } else {
                c += p[n].length
            }
        }
        if (k && c > 0) {
            for (var n = 0; n < p.length; n++) {
                var j = p[n];
                j.length = 100 * (j.length / c)
            }
        }
    }
    return p
};
PhraseHarmonyElement.prototype.getConstantHarmonyElements = function (bv, bq) {
    var aD = getValueOrExpressionValue(this, "seed", bv);
    var N = getValueOrExpressionValue(this, "scaleBaseNote", bv);
    var aX = this.getBeatLengths(bv);
    var Z = this.getStartBeatStrengths(bv, aX, bq);
    var az = getValueOrExpressionValue(this, "scaleType", bv);
    var G = getValueOrExpressionValue(this, "phraseType", bv);
    var bx = getValueOrExpressionValue(this, "modulate", bv);
    var aV = getValueOrExpressionValue(this, "modulateInvertScaleType", bv);
    var V = getValueOrExpressionValue(this, "majorModulationTarget", bv);
    var C = getValueOrExpressionValue(this, "minorModulationTarget", bv);
    var au = getValueOrExpressionValue(this, "majorDeceptiveRoot", bv);
    var ar = getValueOrExpressionValue(this, "minorDeceptiveRoot", bv);
    var aH = getValueOrExpressionValue(this, "raiseLeadingTone", bv);
    var ae = az == ScaleType.NATURAL_MINOR;
    var bw = true;
    var a = false;
    var aC = this.modulateRemoveDominant;
    var aB = this.modulateRemoveInitialTonic;
    while (bw) {
        bw = false;
        var g = new MersenneTwister(aD);
        var aP = false;
        var bz = false;
        var E = false;
        var a3 = false;
        var o = 0;
        var a2 = 4;
        var aJ = [1, 3, 5];
        var aU = [3, 5];
        var O = [
            [0]
        ];
        var bs = [
            [0]
        ];
        var ay = 5;
        var bf = [1, 3];
        var x = [3];
        var m = [1, 3, 5];
        var bt = [3, 5];
        var h = [];
        var a7 = false;
        var bu = [
            [N, 0, 0]
        ];
        var aa = [
            [N, 3, 0]
        ];
        var aN = 0;
        var a0 = 0;
        var ab = 0;
        var F = false;
        var n = false;
        var y = false;
        var bg = [
            [N, 0, 0]
        ];
        var at = [
            [N, 0, 0]
        ];
        if (!ae) {
            aa.push([N, 3, 0])
        }
        var ap = new ConstantHarmonyElement().setBaseNote(N).setScaleType(az);
        switch (G) {
            case PhraseHarmonyElementType.INCOMPLETE_NO_DOMINANT:
                m = [1, 3];
                bt = [3];
                a3 = true;
                E = true;
                break;
            case PhraseHarmonyElementType.CHROMATIC_OSCILLATION:
                bz = true;
                E = true;
                a3 = true;
                y = true;
                at = [];
                for (var aj = 0; aj < 12; aj++) {
                    at.push([N + aj, 0, 0])
                }
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_INCOMPLETE:
                aP = true;
                a3 = true;
                E = false;
                var u = ap.getAbsoluteNoteFromScaleIndex(3);
                aa = [
                    [u, 0, 0]
                ];
                a7 = true;
                aN = 20;
                a0 = 20;
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_COMPLETE:
                aP = true;
                a3 = false;
                E = false;
                aN = 20;
                a0 = 20;
                var u = ap.getAbsoluteNoteFromScaleIndex(3);
                aa = [
                    [N, 0, 0]
                ];
                a7 = true;
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                aP = true;
                a3 = true;
                E = true;
                var aS = az == ScaleType.NATURAL_MINOR ? C : V;
                var aG = ap.getAbsoluteNoteFromScaleIndex(aS + 1);
                a0 = 20;
                aN = 10;
                aa = [
                    [aG, 0, aS + 1]
                ];
                a7 = true;
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.COMPLETE_IMPERFECT:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [0],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.COMPLETE:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC:
                F = true;
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT:
                n = true;
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                break;
            case PhraseHarmonyElementType.COMPLETE_PLAGIAL:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                a2 = 3;
                break;
            case PhraseHarmonyElementType.COMPLETE_MODULATE:
            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                bx = true;
                break;
            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [0],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                bx = true;
                break;
            case PhraseHarmonyElementType.DECEPTIVE:
                o = ae ? ar : au;
                break;
            case PhraseHarmonyElementType.INCOMPLETE:
                a3 = true;
                break;
            case PhraseHarmonyElementType.INCOMPLETE_INITIAL:
                aP = true;
                break;
            case PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT:
            case PhraseHarmonyElementType.CONSEQUENT:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                a3 = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                aP = true;
                bz = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_DOMINANT:
                aP = true;
                bz = true;
                a3 = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC:
                bz = true;
                E = true;
                a3 = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE:
                h.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([
                    [1, 2, 3],
                    [],
                    [],
                    []
                ]).setRootPitchCosts([
                    [ay]
                ]));
                bz = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC_INCOMPLETE:
                bz = true;
                a3 = true;
                break
        }
        if (bx) {
            if (aC) {
                E = true;
                aU = [4];
                aJ = [4];
                bs = [
                    [0]
                ];
                O = [
                    [0]
                ]
            }
            if (aB) {
                aP = true;
                x = [0];
                bf = [0]
            }
        }
        var af = 4;
        if (aP) {
            af--
        }
        if (bz) {
            af--
        }
        if (E) {
            af--
        }
        if (a3) {
            af--
        }
        if (af == 0) {
            a3 = false
        }
        if (aX.length < af) {
            return [new ConstantHarmonyElement().setBaseNote(N).setScaleType(az)]
        }
        var J = [];
        for (var ak = 0; ak < af; ak++) {
            if (ak == 0) {
                J.push(createFilledNumericIncArray(aX.length - af + 1, 0, 1))
            } else {
                J.push([aX.length - af + ak])
            }
        }
        var av = this.getLengthInfos({
            skipInitialTonic: aP,
            skipDynamicHarmony: bz,
            skipDominant: E,
            skipTonicCadence: a3,
            modulate: bx
        }, bv);
        var by = 0;
        for (var ak = 0; ak < aX.length; ak++) {
            by += aX[ak]
        }
        if (J.length > 1) {
            J = this.getBestIndices(J, av, aX, by)
        }
        var bc = 1;
        var a1 = 2;
        var L = 3;
        var ba = [];

        function bm(bF, bB, bC, bA, j) {
            if (aH) {
                for (var bD = 0; bD < bF.length; bD++) {
                    var bE = bF[bD];
                    if (bE.scaleMode == 0 && bE.scaleType == ScaleType.NATURAL_MINOR && bE.scaleType == bB && bE.baseNote == bC) {
                        var bG = positiveMod(bE.getChordRootScaleIndex(), 7);
                        if (arrayContains(bA, bG)) {
                            bE.scaleType = ScaleType.MELODIC_MINOR;
                            if (j) {
                                console.log("raising leading!")
                            }
                        }
                    }
                }
            }
        }

        function K(bC, bD) {
            var j = [];
            for (var bB = 0; bB < bC.length; bB++) {
                var bA = bC[bB];
                j.push(bD[bA % bD.length])
            }
            return j
        }
        if (!aP) {
            var aZ = {};
            aZ.count = J[0].length;
            aZ.startBeatStrengths = K(J[0], Z);
            aZ.seed = this.getSeed(g, this.staticHarmonySeed, this.staticHarmonyUseLocalSeed);
            aZ.scaleType = az;
            aZ.scaleBaseNote = N;
            var ag = null;
            if (y) {
                aZ.startScaleBaseChordRootScaleModeTuples = bg;
                aZ.endScaleBaseChordRootScaleModeTuples = at;
                var U = new ChromaticOscillationHarmonyGenerator(aZ);
                var ad = JSON.stringify(U);
                var bp = bv.reusables[ad];
                if (bp) {
                    ag = copyValueDeep(bp)
                } else {
                    ag = U.searchML();
                    bv.reusables[ad] = copyValueDeep(ag)
                }
            } else {
                aZ.baseSeventhLikelihoods = [
                    [0]
                ];
                aZ.startWithAccented64Likelihood = 0;
                aZ.startWithoutAccented64Likelihood = 1;
                aZ.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "staticHarmonyNeighbourChordLikelihood", bv);
                aZ.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "staticHarmonyNeighbourChordLikelihood", bv);
                aZ.baseToPassingLikelihood = getValueOrExpressionValue(this, "staticHarmonyPassingChordLikelihood", bv);
                aZ.simpleMixtureLikelihood = getValueOrExpressionValue(this, "staticHarmonySimpleMixtureLikelihood", bv);
                aZ.sus2Likelihood = getValueOrExpressionValue(this, "staticHarmonySus2ChordLikelihood", bv);
                aZ.sus4Likelihood = getValueOrExpressionValue(this, "staticHarmonySus4ChordLikelihood", bv);
                var A = new StaticHarmonyGenerator(aZ);
                var ad = JSON.stringify(A);
                var bp = bv.reusables[ad];
                if (bp) {
                    ag = copyValueDeep(bp)
                } else {
                    ag = A.searchML();
                    bv.reusables[ad] = copyValueDeep(ag)
                }
                bm(ag, az, N, getValueOrExpressionValue(this, "staticHarmonyRaiseLeadingToneRoots", bv))
            }
            addAll(ba, ag)
        } else {
            bc--;
            a1--;
            L--
        }
        var t = null;
        if (!bz) {
            var T = {};
            T.count = J[bc].length;
            T.seed = this.getSeed(g, this.dynamicHarmonySeed, this.dynamicHarmonyUseLocalSeed);
            T.scaleType = az;
            T.scaleBaseNote = N;
            T.startBeatStrengths = K(J[bc], Z);
            if (a7) {
                T.scaleBaseChordRootScaleModeTuples = bu;
                T.endScaleBaseChordRootScaleModeTuples = aa;
                T.chordRootChangeCost = a0;
                T.scaleBaseChangeCost = ab;
                T.scaleModeChangeCost = aN;
                var U = new ChromaticTransitionHarmonyGenerator(T);
                var ad = JSON.stringify(U);
                var bp = bv.reusables[ad];
                var t = null;
                if (bp) {
                    t = copyValueDeep(bp)
                } else {
                    t = U.searchML();
                    bv.reusables[ad] = copyValueDeep(t)
                }
                bm(t, az, N, aH ? [4, 6] : [])
            } else {
                T.majorStartRoots = bf;
                T.minorStartRoots = x;
                T.modulate = bx;
                T.modulateInvertScaleType = aV;
                T.majorModulationTarget = V;
                T.minorModulationTarget = C;
                T.neighbourLikelihood = getValueOrExpressionValue(this, "dynamicHarmonyNeighbourChordLikelihood", bv);
                T.passingLikelihood = getValueOrExpressionValue(this, "dynamicHarmonyPassingChordLikelihood", bv);
                T.simpleMixtureLikelihood = getValueOrExpressionValue(this, "dynamicHarmonySimpleMixtureLikelihood", bv);
                T.sus2Likelihood = getValueOrExpressionValue(this, "dynamicHarmonySus2ChordLikelihood", bv);
                T.sus4Likelihood = getValueOrExpressionValue(this, "dynamicHarmonySus4ChordLikelihood", bv);
                if (bx) {
                    T.mixture = false
                }
                T.minorPossibleEndRoots = bt;
                T.majorPossibleEndRoots = m;
                T.minorModulationPossibleEndRoots = aU;
                T.majorModulationPossibleEndRoots = aJ;
                T.minorModulationPossibleEndInversions = bs;
                T.majorModulationPossibleEndInversions = O;
                var l = new DynamicHarmonyGenerator(T);
                var ad = JSON.stringify(l);
                var bp = bv.reusables[ad];
                var t = null;
                if (bp) {
                    t = copyValueDeep(bp)
                } else {
                    t = l.searchML();
                    bv.reusables[ad] = copyValueDeep(t)
                }
                bm(t, az, N, getValueOrExpressionValue(this, "dynamicHarmonyRaiseLeadingToneRoots", bv));
                if (bx) {
                    var ap = new ConstantHarmonyElement().setBaseNote(N).setScaleType(az);
                    var aS = az == ScaleType.NATURAL_MINOR ? C : V;
                    var aG = ap.getAbsoluteNoteFromScaleIndex(aS + 1);
                    var Y = DynamicHarmonyModulationTarget.getScaleType(az, aS);
                    bm(t, Y, aG, getValueOrExpressionValue(this, "dynamicHarmonyRaiseLeadingToneAppliedRoots", bv))
                }
            }
        } else {
            a1--;
            L--
        }
        var bo = null;
        if (!t) {
            bo = new ConstantHarmonyElement().setScaleType(az).setBaseNote(N)
        } else {
            addAll(ba, t);
            bo = copyObjectDeep(t[t.length - 1]);
            bo.scaleType = (bo.scaleType == ScaleType.MELODIC_MINOR || bo.scaleType == ScaleType.HARMONIC_MINOR) ? ScaleType.NATURAL_MINOR : bo.scaleType
        }
        var Q = this.getTsNumerator(bv);

        function X(j) {
            var bA = sampleData([{
                data: 1,
                likelihood: 1
            }, {
                data: 2,
                likelihood: (Q > 2 ? 0.5 : 1) * 1
            }], j);
            return bA
        }

        function aF(bC, bE, bD) {
            var bA = sampleData([{
                data: 1,
                likelihood: Q * bE < 3 ? 1 : 0
            }, {
                data: 2,
                likelihood: 1
            }, {
                data: 3,
                likelihood: Q * bE >= 3 ? 0.5 * bE : 0
            }, {
                data: 4,
                likelihood: Q * bE >= 4 ? 0.25 * bE : 0
            }, {
                data: 5,
                likelihood: Q * bE >= 5 ? 0.125 * bE : 0
            }, {
                data: 6,
                likelihood: Q * bE >= 6 ? 0.1 * bE : 0
            }, {
                data: 7,
                likelihood: Q * bE >= 7 ? 0.05 * bE : 0
            }, {
                data: 8,
                likelihood: Q * bE >= 8 ? 0.025 * bE : 0
            }], bD);
            bC.count += bA;
            for (var bB = 0; bB < bA; bB++) {
                bC.startBeatStrengths.push(1)
            }
            return bA
        }

        function aO(bC, bB, bE) {
            if (bC) {
                for (var bD = 0; bD < bC; bD++) {
                    var bA = bB[bB.length - bC + bD];
                    if (bA) {
                        bE[bD] = bA
                    } else {
                        console.log("could not find any extra solution at " + (bB.length - bC + bD) + " solution length: " + bB.length + " j: " + bD + " lengthenCount: " + bC);
                        bC--
                    }
                }
                if (bB.length > bC) {
                    bB.length = bB.length - bC
                } else {
                    console.log("Tried to remove the complete solution after lengthening " + bC + " total: " + bB.length)
                }
            } else {
                console.log("strange lengthen count " + bC)
            }
        }
        var ah = 0;
        var k = [];
        var an = -1;
        if (!E) {
            var R = {};
            R.count = J[a1].length;
            R.startBeatStrengths = K(J[a1], Z);
            R.seed = this.getSeed(g, this.dominantCadenceHarmonySeed, this.dominantCadenceHarmonyUseLocalSeed);
            var br = 0;
            if (n) {
                var e = new MersenneTwister(R.seed);
                ah = X(e);
                br = aF(R, ah, e)
            }
            var bj = 0;
            for (var ak = 0; ak < a1 - 1; ak++) {
                var v = J[ak];
                for (var aj = 0; aj < v.length; aj++) {
                    var aM = v[aj];
                    bj += aX[aM]
                }
            }
            R.startWithAccented64Likelihood = 1;
            R.startWithoutAccented64Likelihood = 1;
            R.baseRoot = a2;
            R.auxiliaryChordRoots = [0];
            R.auxiliaryChordRootLikelihoods = [1];
            R.scaleType = bo.scaleType;
            R.scaleBaseNote = bo.baseNote;
            R.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyNeighbourChordLikelihood", bv);
            R.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyNeighbourChordLikelihood", bv);
            R.baseToPassingLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyPassingChordLikelihood", bv);
            R.simpleMixtureLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySimpleMixtureLikelihood", bv);
            R.sus2Likelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySus2ChordLikelihood", bv);
            R.sus4Likelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySus4ChordLikelihood", bv);
            if (a3) {
                R.baseSeventhLikelihoods = [
                    [0]
                ]
            }
            var z = new StaticHarmonyGenerator(R);
            var ad = JSON.stringify(z);
            var bp = bv.reusables[ad];
            var aq = null;
            if (bp) {
                aq = copyValueDeep(bp)
            } else {
                aq = z.searchML();
                bv.reusables[ad] = copyValueDeep(aq)
            }
            bm(aq, bo.scaleType, bo.baseNote, getValueOrExpressionValue(this, "dominantCadenceHarmonyRaiseLeadingToneRoots", bv));
            if (n) {
                aO(br, aq, k)
            }
            an = ba.length;
            addAll(ba, aq)
        } else {
            L--
        }
        var I = [];
        if (!a3) {
            var d = {};
            d.baseRoot = o;
            d.count = J[L].length;
            d.startBeatStrengths = K(J[L], Z);
            d.seed = this.getSeed(g, this.tonicCadenceHarmonySeed, this.tonicCadenceHarmonyUseLocalSeed);
            var br = 0;
            if (F) {
                var e = new MersenneTwister(d.seed);
                ah = X(e);
                br = aF(d, ah, e)
            }
            d.scaleType = bo.scaleType;
            d.scaleBaseNote = bo.baseNote;
            d.baseSeventhLikelihoods = [
                [0]
            ];
            d.startWithAccented64Likelihood = 0;
            d.startWithoutAccented64Likelihood = 1;
            d.baseExpandedLikelihood = 0;
            d.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyNeighbourChordLikelihood", bv);
            d.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyNeighbourChordLikelihood", bv);
            d.baseToPassingLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyPassingChordLikelihood", bv);
            d.simpleMixtureLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySimpleMixtureLikelihood", bv);
            d.sus2Likelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySus2ChordLikelihood", bv);
            d.sus4Likelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySus4ChordLikelihood", bv);
            var aE = new StaticHarmonyGenerator(d);
            var ad = JSON.stringify(aE);
            var bp = bv.reusables[ad];
            var aR = null;
            if (bp) {
                aR = copyValueDeep(bp)
            } else {
                aR = aE.searchML();
                bv.reusables[ad] = copyValueDeep(aR)
            }
            bm(aR, bo.scaleType, bo.baseNote, getValueOrExpressionValue(this, "tonicCadenceHarmonyRaiseLeadingToneRoots", bv));
            if (F) {
                aO(br, aR, I)
            }
            addAll(ba, aR)
        }
        this.setLengthsAndPhraseStructure(ba, bv, bq);
        if (!this.overrideDefaultPhraseStructure) {
            for (var ak = 0; ak < ba.length; ak++) {
                var aI = ba[ak];
                aI.startsPhrase = ak == 0
            }
        }
        if (G == PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT || G == PhraseHarmonyElementType.CONSEQUENT) {
            var ac = new ConstantHarmonicRythm(ba);
            var ax = [];
            for (var ak = 0; ak < this.phraseShorteningMinLengths.length; ak++) {
                ax[ak] = positionUnitToBeats2(this.phraseShorteningMinLengths[ak], this.phraseShorteningMinLengthUnit, 0, ac)
            }
            var bn = new MultiRandomShortenHarmonyModifier();
            bn.totalBeats = this.phraseShorteningBeats;
            bn.minElementLengths = ax;
            bn.minElementLengthUnit = PositionUnit.BEATS;
            bn.startIndexLikelihoods = [
                [0.001],
                [0.001],
                [0.001],
                [0.01],
                [0.01],
                []
            ];
            bn.indexLikelihoods = [
                [0.01],
                [0.01],
                [0.01],
                [0.1]
            ];
            bn.endIndexLikelihoods = [
                [0.1, 1, 10],
                [0.1, 1, 10],
                [0.1, 1, 10],
                [0.1, 1, 1],
                []
            ];
            var s = 0;
            for (var ak = 0; ak < ba.length; ak++) {
                s += ba[ak].getBeatLength()
            }
            var p = copyValueDeep(ba);
            p = bn.modifyConstantHarmonyElements(p, bv);
            var b = 0;
            for (var ak = 0; ak < p.length; ak++) {
                b += p[ak].getBeatLength()
            }
            var ai = s - b;
            if (ai > 0.001) {
                var c = new ConstantHarmonyElement();
                c.setLength(ai);
                c.setLengthUnit(PositionUnit.BEATS);
                c.scaleType = bo.scaleType;
                c.baseNote = bo.baseNote;
                p.push(c)
            } else {
                G = PhraseHarmonyElementType.COMPLETE;
                bw = true;
                a = true;
                continue
            }
            for (var ak = 0; ak < p.length; ak++) {
                var aI = p[ak];
                aI.startsPhrase = ak == 0
            }
            if (G == PhraseHarmonyElementType.CONSEQUENT) {
                ba = p
            } else {
                addAll(ba, p)
            }
        }
        for (var ak = 0; ak < ba.length - 1; ak++) {
            var aQ = ba[ak];
            var H = ba[ak + 1];
            var w = ba[ak + 2];
            if (aQ.baseNote == H.baseNote) {
                var aw = aQ.getChordPitchClasses();
                var bh = H.getChordPitchClasses();
                var S = null;
                if (w) {
                    S = w.getChordPitchClasses()
                }
                if (aQ.scaleType == ScaleType.MAJOR) {
                    if (H.scaleType == ScaleType.NATURAL_MINOR || H.scaleType == ScaleType.HARMONIC_MINOR || H.scaleType == ScaleType.MELODIC_MINOR) {
                        var a5 = aQ.getAbsoluteNoteFromScaleIndex(1) % 12;
                        var r = aQ.getAbsoluteNoteFromScaleIndex(2) % 12;
                        var aL = aQ.getAbsoluteNoteFromScaleIndex(4) % 12;
                        var aT = aQ.getAbsoluteNoteFromScaleIndex(5) % 12;
                        var a6 = H.getAbsoluteNoteFromScaleIndex(2) % 12;
                        var W = H.getAbsoluteNoteFromScaleIndex(5) % 12;
                        if ((arrayContains(aw, r) || arrayContains(aw, a5)) && arrayContains(bh, a6)) {
                            var B = new MinVoiceLinePlannerConstraint();
                            var f = new PitchClassStepVoiceLinePlannerConstraint();
                            f.id = "thirdToLoweredThirdC";
                            f.fromPitchClass = r;
                            f.toPitchClass = a6;
                            var P = new PitchClassStepVoiceLinePlannerConstraint();
                            P.id = "secondToLoweredThirdC";
                            P.fromPitchClass = a5;
                            P.toPitchClass = a6;
                            B.constraints = [f, P];
                            H.voiceLineConstraints.push(B)
                        }
                        if (w) {
                            var bd = w.getAbsoluteNoteFromScaleIndex(1) % 12;
                            if (arrayContains(bh, a6) && arrayContains(S, bd)) {
                                var be = new PitchClassStepVoiceLinePlannerConstraint();
                                be.id = "loweredThirdToSecondC";
                                be.fromPitchClass = a6;
                                be.toPitchClass = bd;
                                w.voiceLineConstraints.push(be)
                            }
                        }
                        if ((arrayContains(aw, aL) || arrayContains(aw, aT)) && arrayContains(bh, W)) {
                            var bb = new MinVoiceLinePlannerConstraint();
                            var am = new PitchClassStepVoiceLinePlannerConstraint();
                            am.fromPitchClass = aT;
                            am.toPitchClass = W;
                            var a8 = new PitchClassStepVoiceLinePlannerConstraint();
                            a8.fromPitchClass = aL;
                            a8.toPitchClass = W;
                            bb.constraints = [am, a8];
                            H.voiceLineConstraints.push(bb)
                        }
                        if (w) {
                            var al = w.getAbsoluteNoteFromScaleIndex(4) % 12;
                            if (arrayContains(bh, W) && arrayContains(S, al)) {
                                var bl = new PitchClassStepVoiceLinePlannerConstraint();
                                bl.fromPitchClass = W;
                                bl.toPitchClass = al;
                                w.voiceLineConstraints.push(bl)
                            }
                        }
                    }
                }
            }
        }
        if (bx && !bz) {
            var ap = new ConstantHarmonyElement().setBaseNote(N).setScaleType(az);
            var aS = az == ScaleType.NATURAL_MINOR ? C : V;
            var aG = ap.getAbsoluteNoteFromScaleIndex(aS + 1);
            var Y = DynamicHarmonyModulationTarget.getScaleType(az, aS);
            for (var ak = 1; ak < ba.length; ak++) {
                var aQ = ba[ak];
                var aA = ba[ak - 1];
                if (aQ.baseNote == aG) {
                    var aW = aQ.getAbsoluteNoteFromScaleIndex(6) % 12;
                    if (aA.baseNote == N) {
                        var q = new PitchClassLeapRangeVoiceLinePlannerConstraint();
                        q.pitchClass = aW;
                        q.enterRange = [-1, 1];
                        q.enterPenaltyFactor = 0.1;
                        q.enterNotFoundPenalty = 1;
                        q.enterDoublingPenalty = 1;
                        aQ.voiceLineConstraints.push(q);
                        var aK = new LeapRangeVoiceLinePlannerConstraint();
                        aK.range = [-3, 3];
                        aK.penaltyFactor = 0.2;
                        aQ.voiceLineConstraints.push(aK);
                        if (ak < ba.length - 1) {
                            var H = ba[ak + 1];
                            var aY = new PitchClassLeapRangeVoiceLinePlannerConstraint();
                            aY.pitchClass = aW;
                            aY.leaveRange = [1, 2];
                            aY.leavePenaltyFactor = 1;
                            aY.leaveNotFoundPenalty = 1;
                            aY.leaveDoublingPenalty = 1;
                            H.voiceLineConstraints.push(aY);
                            var D = new LeapRangeVoiceLinePlannerConstraint();
                            D.range = [-3, 3];
                            D.penaltyFactor = 0.2;
                            H.voiceLineConstraints.push(D)
                        }
                    }
                }
            }
        }
        var bi = false;
        for (var ak = 0; ak < ba.length; ak++) {
            var ao = ba[ak].toRomanString().indexOf("X") >= 0;
            var a4 = ba[ak].toRomanString().indexOf("sus") >= 0;
            var M = ba[ak].toRomanString().indexOf("NX") >= 0 || ba[ak].toRomanString().indexOf("NMX") >= 0;
            var a4 = ba[ak].toRomanString().indexOf("sus") >= 0;
            var bk = ba[ak].note.indexOf("D, E") >= 0
        }
        if (bi) {
            var ac = new ConstantHarmonicRythm(ba);
            console.log("The phrase progression: " + ac.toRomanString())
        }
        for (var ak = 0; ak < ba.length; ak++) {
            ba[ak].tsNumerator = Q
        }

        function a9(bK, bG, bH, bJ, bL) {
            var bB = bJ;
            var bI = Math.max(1, Math.floor(bJ / bK.length));
            var bF = bL;
            for (var bC = 0; bC < bK.length; bC++) {
                var bA = bK[bC];
                if (!bA) {
                    continue
                }
                var bE = bI;
                if (bC == bK.length - 1) {
                    bA.length = bB
                } else {
                    bF += bE;
                    bA.length = bE
                }
                bB -= bE;
                bA.lengthUnit = PositionUnit.BEATS;
                bA.tsNumerator = Q
            }
            if (bG < bH.length) {
                for (var bD = 0; bD < bK.length; bD++) {
                    var bA = bK[bD];
                    if (bA) {
                        bH.splice(bG + bD, 0, bA)
                    }
                }
            } else {
                for (var bD = 0; bD < bK.length; bD++) {
                    var bA = bK[bD];
                    if (bA) {
                        bH.push(bA)
                    }
                }
            }
        }
        if (F) {
            a9(I, ba.length, ba, ah * Q, bq)
        }
        if (n && an >= 0) {
            a9(k, an, ba, ah * Q, bq)
        }
        for (var ak = 0; ak < h.length; ak++) {
            ba[ba.length - 1].voiceLineConstraints.push(h[ak])
        }
    }
    return ba
};

function VoiceLine() {
    this.id = "voiceLine";
    this.lineElements = [];
    this.modifiers = [];
    this._constructorName = "VoiceLine"
}
VoiceLine.prototype.add = function (a) {
    this.lineElements.push(a);
    return this
};
VoiceLine.prototype.get = function (a) {
    return this.lineElements[a]
};
VoiceLine.prototype.getVoiceLineElements = function () {
    return this.lineElements
};
VoiceLine.prototype.size = function () {
    return this.lineElements.length
};
VoiceLine.prototype.getCount = function () {
    return this.lineElements.length
};
VoiceLine.prototype.addVoiceLineElement = function (a) {
    this.lineElements.push(a);
    return this
};
VoiceLine.prototype.getSingleStepVoiceLineElements = function (b, e) {
    var a = [];
    var g = 0;
    for (var d = 0; d < this.lineElements.length; d++) {
        var c = this.lineElements[d];
        var f = c.getSingleStepVoiceLineElements(b, e, g);
        addAll(a, f);
        g += f.length
    }
    return a
};

function DoubledVoiceLine() {
    VoiceLine.call(this);
    this.octaves = 0;
    this.toDouble = "";
    this._constructorName = "DoubledVoiceLine"
}
DoubledVoiceLine.prototype = new VoiceLine();
DoubledVoiceLine.prototype.doubleVoiceLine = function (f) {
    var e = null;
    for (var c = 0; c < f.length; c++) {
        var b = f[c];
        if (b.id == this.toDouble) {
            e = b;
            break
        }
    }
    if (e) {
        var d = e.getVoiceLineElements();
        var a = [];
        for (var c = 0; c < d.length; c++) {
            a[c] = d[c].copy()
        }
        return a
    } else {
        console.log("Could not find voice line " + this.toDouble + "<br />");
        return null
    }
};

function SimpleBassVoiceLine() {
    VoiceLine.call(this);
    this.octaves = -1;
    this.startOctaves = [];
    this.endOctaves = [];
    this._constructorName = "SimpleBassVoiceLine"
}
SimpleBassVoiceLine.prototype = new VoiceLine();
SimpleBassVoiceLine.prototype.getSingleStepVoiceLineElements = function (c, f) {
    var a = [];
    for (var e = 0; e < c.getCount(); e++) {
        var h = c.get(e);
        var g = new ConstantVoiceLineElement();
        var b = h.getAbsoluteNoteFromChordBassIndex(0);
        var d = getItemWithDefaultWithStartEndItems(this.octaves, c.getCount(), e, this.startOctaves, this.endOctaves);
        b += d * 12;
        g.index = h.getScaleIndexAndChromaticOffsetForAbsoluteNote(b)[0];
        g.indexType = IndexType.SCALE;
        g.snapType = SnapType.CHORD;
        a.push(g)
    }
    return a
};

function ClassicalAdaptiveVoiceLine() {
    VoiceLine.call(this);
    this.isUndefined = false;
    this.useHintCurve = false;
    this.hintCurve = "";
    this.hintCurveMultiplier = 1;
    this.hintCurveBias = 0;
    this.hintCurveSnapMetrics = SnapMetrics.ROUND;
    this.useHintCurveLengthFractionAmplitudeMultiplier = false;
    this.hintCurveReferenceCount = 8;
    this.hintCurveLengthFractionAmplitudeMultiplier = 0.5;
    this.hintIndices = [];
    this.hintIndexType = IndexType.SCALE;
    this.startHintIndices = [];
    this.endHintIndices = [];
    this.maxHintDistances = [12];
    this.startMaxHintDistances = [];
    this.endMaxHintDistances = [];
    this.penaltyMaxHintDistances = [3];
    this.startPenaltyMaxHintDistances = [];
    this.endPenaltyMaxHintDistances = [];
    this.hintDistanceOffsetType = OffsetType.HALF_STEP;
    this.chordRootPitchClassConstraints = [
        []
    ];
    this.chordBassPitchClassConstraints = [
        []
    ];
    this.suspendPattern = [0];
    this.startSuspendPattern = [];
    this.endSuspendPattern = [];
    this.suspendIndexRanges = [];
    this.suspendIndices = [];
    this.phraseSuspendPattern = [];
    this.startPhraseSuspendPattern = [];
    this.endPhraseSuspendPattern = [];
    this.anticipatePattern = [0];
    this.startAnticipatePattern = [];
    this.endAnticipatePattern = [];
    this.anticipateIndexRanges = [];
    this.anticipateIndices = [];
    this.startChordRootPitchClassConstraints = [];
    this.endChordRootPitchClassConstraints = [];
    this.startChordBassPitchClassConstraints = [];
    this.endChordBassPitchClassConstraints = [];
    this.maxSpacings = [24];
    this.startMaxSpacings = [];
    this.endMaxSpacings = [];
    this.penaltyMaxSpacings = [12];
    this.startPenaltyMaxSpacings = [];
    this.endPenaltyMaxSpacings = [];
    this.spacingOffsetType = OffsetType.HALF_STEP;
    this.ranges = [
        [30, 100]
    ];
    this.startRanges = [];
    this.endRanges = [];
    this.penaltyRanges = [
        [30, 100]
    ];
    this.startPenaltyRanges = [];
    this.endPenaltyRanges = [];
    this.rangeIndexType = IndexType.MIDI_NOTE;
    this.maxOverlaps = [0];
    this.overlapOffsetType = OffsetType.HALF_STEP;
    this.maxNoPenaltyLeaps = [12];
    this.leapOffsetType = OffsetType.HALF_STEP;
    this._constructorName = "ClassicalAdaptiveVoiceLine"
}
ClassicalAdaptiveVoiceLine.prototype = new VoiceLine();
ClassicalAdaptiveVoiceLine.prototype.getSingleStepVoiceLineElements = function (M, c) {
    var u = [];
    var G = M.getCount();
    var t = null;
    var e = getValueOrExpressionValue(this, "useHintCurve", c);
    if (e) {
        var v = getValueOrExpressionValue(this, "hintCurve", c);
        t = c.getCurve(v);
        if (!t) {
            console.log(this._constructorName + " could not find curve " + v + "<br />");
            t = new PredefinedCurve()
        }
    }
    var k = getValueOrExpressionValue(this, "hintCurveMultiplier", c);
    var S = getValueOrExpressionValue(this, "hintCurveBias", c);
    var h = getValueOrExpressionValue(this, "hintIndices", c);
    var N = getValueOrExpressionValue(this, "startHintIndices", c);
    var R = getValueOrExpressionValue(this, "endHintIndices", c);
    var A = getValueOrExpressionValue(this, "suspendPattern", c);
    var l = getValueOrExpressionValue(this, "startSuspendPattern", c);
    var H = getValueOrExpressionValue(this, "endSuspendPattern", c);
    var s = getValueOrExpressionValue(this, "phraseSuspendPattern", c);
    var B = getValueOrExpressionValue(this, "startPhraseSuspendPattern", c);
    var T = getValueOrExpressionValue(this, "endPhraseSuspendPattern", c);
    var D = getValueOrExpressionValue(this, "chordBassPitchClassConstraints", c);
    var Q = getValueOrExpressionValue(this, "startChordBassPitchClassConstraints", c);
    var y = getValueOrExpressionValue(this, "endChordBassPitchClassConstraints", c);
    var g = getValueOrExpressionValue(this, "useHintCurveLengthFractionAmplitudeMultiplier", c);
    if (g) {
        var I = G / this.hintCurveReferenceCount;
        if (I < 1) {
            var K = Math.max(0, Math.min(1, 2 * this.hintCurveLengthFractionAmplitudeMultiplier * I - 2 * this.hintCurveLengthFractionAmplitudeMultiplier + 1));
            k *= K
        }
    }
    var z = G > 1 ? (1 / (G - 1)) : 1;
    for (var P = 0; P < G; P++) {
        if (this.isUndefined) {
            var a = new UndefinedVoiceLineElement();
            u.push(a)
        } else {
            var a = new ClassicalAdaptiveVoiceLineElement();
            var m = null;
            var o = P * z;
            if (t) {
                var w = S + k * t.getValue(c, o);
                m = SnapMetrics.snap(w, this.hintCurveSnapMetrics)
            } else {
                m = getItemFromArrayWithStartEndItems(m, h, G, P, N, R)
            }
            var q = getItemFromArrayWithStartEndItems(6, this.maxHintDistances, G, P, this.startMaxHintDistances, this.endMaxHintDistances);
            var r = getItemFromArrayWithStartEndItems(3, this.penaltyMaxHintDistances, G, P, this.startPenaltyMaxHintDistances, this.endPenaltyMaxHintDistances);
            var F = getItemFromArrayWithStartEndItems([], D, G, P, Q, y);
            var p = getItemFromArrayWithStartEndItems([], this.chordRootPitchClassConstraints, G, P, this.startChordRootPitchClassConstraints, this.endChordRootPitchClassConstraints);
            var n = getItemFromArrayWithStartEndItems([], this.maxSpacings, G, P, this.startMaxSpacings, this.endMaxSpacings);
            var d = getItemFromArrayWithStartEndItems([], this.penaltyMaxSpacings, G, P, this.startPenaltyMaxSpacings, this.endPenaltyMaxSpacings);
            var E = getItemFromArrayWithStartEndItems(0, A, G, P, l, H);
            var C = getItemFromArrayWithStartEndItems(0, this.anticipatePattern, G, P, this.startAnticipatePattern, this.endAnticipatePattern);
            var f = getItemFromArrayWithStartEndItems(0, this.ranges, G, P, this.startRanges, this.endRanges);
            var J = getItemFromArrayWithStartEndItems(0, this.penaltyRanges, G, P, this.startPenaltyRanges, this.endPenaltyRanges);
            a.suspend = !!E;
            a.anticipate = !!C;
            a.chordBassPitchClassConstraint = F;
            a.chordRootPitchClassConstraint = p;
            a.hintIndex = m;
            a.hintIndexType = this.hintIndexType;
            a.maxHintDistance = q;
            a.penaltyMaxHintDistance = r;
            a.maxSpacing = n;
            a.penaltyMaxSpacing = d;
            a.spacingOffsetType = this.spacingOffsetType;
            a.range = f;
            a.penaltyRange = J;
            u.push(a)
        }
    }
    if (!this.isUndefined) {
        if (s.length > 0 || B.length > 0 || T.length > 0) {
            var L = M.getPhraseRanges();
            for (var P = 0; P < L.length; P++) {
                var b = L[P];
                A = [];
                if (s.length > 0) {
                    A = s[P % s.length]
                }
                l = [];
                if (B.length > 0) {
                    l = B[P % B.length]
                }
                H = [];
                if (T.length > 0) {
                    H = T[P % T.length]
                }
                for (var O = b[0]; O <= b[1]; O++) {
                    var x = O - b[0];
                    var E = getItemFromArrayWithStartEndItems(0, A, b[1] - b[0] + 1, x, l, H);
                    var a = u[O];
                    a.suspend = !!E
                }
            }
        }
    }
    return u
};

function ConstantVoiceLine() {
    VoiceLine.call(this);
    this._constructorName = "ConstantVoiceLine"
}
ConstantVoiceLine.prototype = new VoiceLine();
var HarmonyStepLengthType = {
    HARMONY_STEPS: 0,
    HARMONY_LENGTH_PLUS_STEPS: 1,
    getStepLength: function (a, b, c) {
        switch (b) {
            case HarmonyStepLengthType.HARMONY_STEPS:
                return c;
            case HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS:
                return a.getCount() + c
        }
        return c
    }
};


function VoiceLineElement() {
    this.id = "";
    this.length = 1;
    this.lengthType = HarmonyStepLengthType.HARMONY_STEPS;
    this.modifiers = [];
    this._constructorName = "VoiceLineElement"
}
VoiceLineElement.prototype.getLength = function (a) {
    return HarmonyStepLengthType.getStepLength(a, this.lengthType, this.length)
};
VoiceLineElement.prototype.getSingleStepVoiceLineElements = function (a, b, c) {
    if (this instanceof SingleStepVoiceLineElement) {
        return [this]
    } else {
        console.log("Missing getSingleStepVoiceLineElements() for non-SingleStepVoiceLineElement <br />");
        return null
    }
};

function ConstantSequenceVoiceLineElement() {
    VoiceLineElement.call(this);
    this.indexBorderMode = IndexBorderMode.RESTART;
    this.octaves = [0];
    this.indices = [0];
    this.indexType = IndexType.SCALE;
    this.snapType = SnapType.CHORD;
    this._constructorName = "ConstantSequenceVoiceLineElement"
}
ConstantSequenceVoiceLineElement.prototype = new VoiceLineElement();

function SingleStepVoiceLineElement() {
    VoiceLineElement.call(this);
    this.suspend = false;
    this.anticipate = false;
    this._constructorName = "SingleStepVoiceLineElement"
}
SingleStepVoiceLineElement.prototype = new VoiceLineElement();
SingleStepVoiceLineElement.prototype.getSingleStepVoiceLineElements = function (a, b, c) {
    return [this]
};

function UndefinedVoiceLineElement() {
    SingleStepVoiceLineElement.call(this);
    this._constructorName = "UndefinedVoiceLineElement"
}
UndefinedVoiceLineElement.prototype = new SingleStepVoiceLineElement();

function ConstantVoiceLineElement() {
    SingleStepVoiceLineElement.call(this);
    this.octaves = 0;
    this.index = 0;
    this.indexType = IndexType.SCALE;
    this.snapType = SnapType.CHORD;
    this._constructorName = "ConstantVoiceLineElement"
}
ConstantVoiceLineElement.prototype = new SingleStepVoiceLineElement();
ConstantVoiceLineElement.prototype.setIndex = function (a) {
    this.index = a;
    return this
};
ConstantVoiceLineElement.prototype.setIndexType = function (a) {
    this.indexType = a;
    return this
};
ConstantVoiceLineElement.prototype.setSnapType = function (a) {
    this.snapType = a;
    return this
};

function AdaptiveVoiceLineElement() {
    SingleStepVoiceLineElement.call(this)
}
AdaptiveVoiceLineElement.prototype = new SingleStepVoiceLineElement();

function ClassicalAdaptiveVoiceLineElement(a) {
    AdaptiveVoiceLineElement.call(this, a);
    this.hintIndex = 0;
    this.hintIndexType = IndexType.SCALE;
    this.maxHintDistance = 6;
    this.penaltyMaxHintDistance = 3;
    this.hintDistanceOffsetType = OffsetType.HALF_STEP;
    this.chordRootPitchClassConstraint = [];
    this.chordBassPitchClassConstraint = [];
    this.maxOverlap = 0;
    this.overlapOffsetType = OffsetType.HALF_STEP;
    this.maxSpacing = 24;
    this.penaltyMaxSpacing = 12;
    this.spacingOffsetType = OffsetType.HALF_STEP;
    this.maxNoPenaltyLeap = 12;
    this.leapOffsetType = OffsetType.HALF_STEP;
    this.range = [30, 100];
    this.penaltyRange = [30, 100];
    this.rangeIndexType = IndexType.MIDI_NOTE;
    this._constructorName = "ClassicalAdaptiveVoiceLineElement"
}
ClassicalAdaptiveVoiceLineElement.prototype = new AdaptiveVoiceLineElement();

function Structure() {
    this.id = "structure";
    this.references = [];
    this._constructorName = "Structure"
}
Structure.prototype.renderBatch = function (e, a) {
    for (var b = 0; b < this.references.length; b++) {
        var d = this.references[b];
        if (d.active) {
            d.renderBatch(e)
        }
        if (a) {
            var c = 1;
            if (this.references.length > 1) {
                c = b / (this.references.length - 1)
            }
            a(c)
        }
    }
};
function RenderState(a, b) {
    this.module = a;
    this.data = b;
    this.sectionTime = 0;
    this.harmony = null;
    this.previousConstantHarmony = null;
    this.constantHarmony = null;
    this.voiceLineHarmonies = {};
    this.section = null;
    this.sectionModifiers = null;
    this.voiceLines = null;
    this.previousPlannedVoiceLines = null;
    this.plannedVoiceLines = null;
    this.sectionTempo = 60;
    this.renderLines = null;
    this.controlLines = null;
    this.renderChannel = null;
    this.controlChannel = null;
    this.controlSlotDatas = {};
    this.controlSlotData = null
}

function RenderData() {
    this.events = []
}
RenderData.prototype.toNetJSON = function () {
    var f = [];
    f.push("{");
    var k = {};
    var b = [];
    var d = {};
    var a = [];
    for (var g = 0; g < this.events.length; g++) {
        var j = this.events[g];
        if (j.renderChannel) {
            var h = k[j.renderChannel.id];
            if (typeof (h) === "undefined") {
                k[j.renderChannel.id] = b.length;
                b.push(j.renderChannel.id)
            }
        }
        if (j.controlChannel) {
            var h = d[j.controlChannel.id];
            if (typeof (h) === "undefined") {
                d[j.controlChannel.id] = a.length;
                a.push(j.controlChannel.id)
            }
        }
    }
    f.push('"renderChannelNames": ' + JSON.stringify(b) + ",");
    f.push('"controlChannelNames": ' + JSON.stringify(a) + ",");
    f.push('"events": [');
    var c = [];
    for (var g = 0; g < this.events.length; g++) {
        c.push(this.events[g].toNetJSON(k, d))
    }
    f.push(c.join(",\n"));
    f.push("]}\n");
    return f.join("")
};
RenderData.prototype.sort = function () {
    this.events.sort(function (d, c) {
        var e = d.time - c.time;
        return e
    })
};
RenderData.prototype.addEvent = function (a) {
    this.events.push(a);
    return this
};
RenderData.prototype.addEvents = function (a) {
    addAll(this.events, a);
    return this
};
RenderData.prototype.getEvents = function () {
    return this.events
};
function RenderEvent(a) {
    this.time = a
}
RenderEvent.prototype.toNetJSON = function (d, f) {
    var a = [];
    for (var e in this.netJSONPropertiesMap) {
        var c = this[e];
        var b = this.netJSONPropertiesMap[e];
        c = this.netJSONTransformProperty(e, c, d, f);
        if (typeof (c) === "string") {
            a.push('"' + b + '":"' + c + '"')
        } else {
            a.push('"' + b + '":' + c)
        }
    }
    return "{" + a.join(",") + "}"
};
RenderEvent.prototype.netJSONTransformProperty = function (a, b, c, d) {
    if (a == "type") {
        return this.netJSONType
    }
    return b
};
RenderEvent.prototype.getTime = function () {
    return this.time
};

function NoteOnEvent(c, d, a, b) {
    RenderEvent.call(this, d);
    this.type = "noteOn";
    this.note = c;
    this.onVelocity = a;
    this.renderChannel = b
}
NoteOnEvent.prototype = new RenderEvent();
NoteOnEvent.prototype.netJSONPropertiesMap = {
    time: "t",
    type: "y",
    note: "n",
    onVelocity: "v",
    renderChannel: "c"
};
NoteOnEvent.prototype.netJSONType = "n";
NoteOnEvent.prototype.netJSONTransformProperty = function (a, b, c, d) {
    if (a == "renderChannel") {
        return c[b.id]
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, a, b, c, d)
    }
};

function NoteOffEvent(c, d, b, a) {
    RenderEvent.call(this, d);
    this.type = "noteOff";
    this.note = c;
    this.offVelocity = b;
    this.renderChannel = a
}
NoteOffEvent.prototype = new RenderEvent();
NoteOffEvent.prototype.netJSONPropertiesMap = {
    time: "t",
    type: "y",
    note: "n",
    offVelocity: "v",
    renderChannel: "c"
};
NoteOffEvent.prototype.netJSONType = "f";
NoteOffEvent.prototype.netJSONTransformProperty = function (a, b, c, d) {
    if (a == "renderChannel") {
        return c[b.id]
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, a, b, c, d)
    }
};

function SetControlEvent(b, c, a) {
    RenderEvent.call(this, c);
    this.type = "setControl";
    this.value = b;
    this.controlChannel = a
}
SetControlEvent.prototype = new RenderEvent();
SetControlEvent.prototype.netJSONPropertiesMap = {
    time: "t",
    type: "y",
    value: "v",
    controlChannel: "c"
};
SetControlEvent.prototype.netJSONType = "c";
SetControlEvent.prototype.netJSONTransformProperty = function (a, b, c, d) {
    if (a == "controlChannel") {
        return d[b.id]
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, a, b, c, d)
    }
};

function SetTempoEvent(b, a) {
    RenderEvent.call(this, a);
    this.type = "setTempo";
    this.bpm = b
}
SetTempoEvent.prototype = new RenderEvent();
SetTempoEvent.prototype.netJSONPropertiesMap = {
    time: "t",
    type: "y",
    bpm: "b"
};
SetTempoEvent.prototype.netJSONType = "t";

function HarmonyGenerator(a) {
    DfsSolver.call(this, a);
    this.maxMLSolutions = 20;
    this.maxSearchSteps = 5000;
    this.count = getValueOrDefault(a, "count", 1);
    this.startBeatStrengths = getValueOrDefault(a, "startBeatStrengths", [1]);
    this.seed = getValueOrDefault(a, "seed", 12345);
    this.setSeed(this.seed);
    this.failReason = "";
    this._constructorName = "HarmonyGenerator"
}
HarmonyGenerator.prototype = new DfsSolver();
HarmonyGenerator.prototype.extractStateResultData = function (a) {
    return a.harmony
};
HarmonyGenerator.prototype.getStartBeatStrengthsFromHarmonyElements = function (d, e, a, c, g) {
    var f = [];
    for (var b = 0; b < e.length; b++) {
        f[b] = e[b].getBeatLength()
    }
    return this.getStartBeatStrengths(d, f, a, c, g)
};
HarmonyGenerator.prototype.getStartBeatStrengths = function (b, j, k, a, f) {
    var l = [];
    var e = a;
    var d = k ? k : 0;
    if (!f) {
        f = [1, 0.7, 0.9, 0.5, 0.3, 0.2, 0.1]
    }
    for (var c = 0; c < j.length; c++) {
        var h = Math.floor(d) % e;
        l.push(f[h % f.length]);
        var g = j[c];
        d += g
    }
    return l
};
HarmonyGenerator.prototype.calculateSeventhToTriadCosts = function (d, k, h, g) {
    var a = d.state;
    var j = a.harmony;
    for (var f = 0; f < k.length; f++) {
        var e = k[f].harmony;
        if (j.sameScale(e)) {
            var b = positiveMod(j.chordRoot, 7);
            var l = positiveMod(e.chordRoot, 7);
            if (b == l && j.isSeventh() && e.isTriad()) {
                var c = 5;
                g[f] += c
            }
        }
    }
};
HarmonyGenerator.prototype.calculateSusCosts = function (c, m, k, g, j, e) {
    var a = c.state;
    var l = a.harmony;
    for (var f = 0; f < m.length; f++) {
        var d = m[f].harmony;
        if (d.isSus2()) {
            k[f] *= j
        } else {
            if (d.isSus4()) {
                k[f] *= e
            }
        }
        if (l.sameScale(d)) {
            var b = 0;
            if (l.isSus()) {
                var h = l.getAbsoluteNoteFromChordRootIndex(1) % 12;
                var n = d.getChordPitchClasses();
                if (!arrayContains(n, (h - 1) % 12) && !arrayContains(n, (h - 2) % 12)) {
                    b += 2
                } else { }
                if (d.isSus()) {
                    b += 1
                }
            }
            if (b > 0) {
                g[f] += b
            }
        }
    }
};
HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCost = function (e, a, d, g) {
    var c = 0;
    if (g > a) {
        if (e.sameScale(d)) {
            var b = positiveMod(e.chordRoot, 7);
            var j = positiveMod(d.chordRoot, 7);
            if (b == j) {
                c += 5
            }
            var h = e.getAbsoluteNoteFromChordBassIndex(0);
            var f = d.getAbsoluteNoteFromChordBassIndex(0);
            if (h == f) {
                c += 5
            }
            if ((b == 6 && j == 4) || (b == 4 && j == 6)) {
                c += 5
            }
        }
    }
    return c
};
HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCosts = function (d, k, h, g) {
    if (this.startBeatStrengths.length > 0) {
        var a = this.startBeatStrengths[d.depth % this.startBeatStrengths.length];
        var l = this.startBeatStrengths[(d.depth + 1) % this.startBeatStrengths.length];
        var b = d.state;
        if (l > a) {
            var j = b.harmony;
            for (var f = 0; f < k.length; f++) {
                var e = k[f].harmony;
                var c = this.calculateBeatStrengthRepetitionCost(j, a, e, l);
                if (c > 0) {
                    g[f] += c
                }
            }
        }
    }
};
HarmonyGenerator.prototype.getChordsStuff = function (h, g, e, r, m, l, s, p, u, a, q) {
    var k = g.harmony;
    var b = [0, 0, 0, 0, 0, 0, 0];
    if (m.length > 0) {
        b = m[h % m.length]
    }
    var o = [0, 0, 0, 0, 0, 0, 0];
    if (l.length > 0) {
        o = l[h % l.length]
    }
    var f = [0, 0, 0, 0, 0, 0, 0];
    if (s.length > 0) {
        f = s[h % s.length]
    }
    var d = [0, 0, 0, 0, 0, 0, 0];
    if (p.length > 0) {
        d = p[h % p.length]
    }
    var t = 0;
    if (b.length > 0) {
        t = b[positiveMod(k.chordRoot, 7) % b.length]
    }
    var c = 0;
    if (o.length > 0) {
        c = o[positiveMod(k.chordRoot, 7) % o.length]
    }
    var j = 0;
    if (f.length > 0) {
        j = f[positiveMod(k.chordRoot, 7) % f.length]
    }
    var n = 0;
    if (d.length > 0) {
        n = d[positiveMod(k.chordRoot, 7) % d.length]
    }
    if (t > 0) {
        var v = copyValueDeep(g);
        v.harmony.addSeventh();
        u.push(v);
        a.push(e * t);
        q.push(r + j)
    }
    if (c > 0) {
        var v = copyValueDeep(g);
        v.harmony.removeSeventh();
        u.push(v);
        a.push(e * c);
        q.push(r + n)
    }
    if (t == 0 && c == 0) {
        var v = copyValueDeep(g);
        u.push(v);
        a.push(e);
        q.push(r)
    }
};
HarmonyGenerator.prototype.setSeed = function (a) {
    this.seed = a;
    this.rnd = new MersenneTwister(this.seed)
};
HarmonyGenerator.prototype.isGoalNode = function (b) {
    if (b.depth >= this.count - 1) {
        var a = this.isGoalState(b.state);
        return a
    }
    return false
};
HarmonyGenerator.prototype.isMaxDepth = function (a) {
    return a.depth >= this.count - 1
};
HarmonyGenerator.prototype.getBassNeighbourChords = function (h, k, c, b, d) {
    var a = [];
    var g = h.chordInversions;
    if (g == 0) {
        var e = h.chordRoot;
        var f = h.chordType;
        if (!h.isSus()) {
            a.push(h.copy().setChordRoot(e - 2).setChordInversions(1));
            a.push(h.copy().setChordRoot(e - 3).setChordInversions(1));
            a.push(h.copy().setChordRoot(e - 4).setChordInversions(2));
            a.push(h.copy().setChordRoot(e - 5).setChordInversions(2))
        }
        if (!h.isSus()) {
            a.push(h.copy().setChordType(ChordType.SUS4))
        }
        if (h.scaleType == ScaleType.MAJOR) {
            if (h.chordRoot == 0 && h.chordType == ChordType.TRIAD) {
                a.push(h.copy().setChordRoot(3).setChordInversions(2).setScaleType(ScaleType.HARMONIC_MINOR))
            }
            if (h.chordRoot == 4 && h.chordType == ChordType.TRIAD) {
                a.push(h.copy().setChordRoot(0).setChordInversions(2).setScaleType(ScaleType.HARMONIC_MINOR))
            }
        }
    } else {
        console.log("Not supporting neighbour chords with inversion " + g + "<br />")
    }
    var j = this.filterChords(h, a, k, c, b, d);
    return j
};
HarmonyGenerator.prototype.filterChords = function (k, n, o, c, a, e) {
    var p = [];
    for (var f = 0; f < n.length; f++) {
        var d = n[f];
        var m = true;
        var l = positiveMod(d.chordRoot, 7);
        var b = d.isSus();
        var g = d.scaleType != k.scaleType && (d.scaleType == ScaleType.MAJOR || k.scaleType == ScaleType.MAJOR);
        if (!b && !g && o) {
            var h = o.indexOf(l);
            if (h >= 0) {
                if (c) {
                    var j = c[h];
                    if (j && !arrayContains(j, d.chordInversions)) {
                        m = false
                    } else {
                        if (!j) {
                            console.log("Invalid possible inversions? " + JSON.stringify(c))
                        }
                    }
                }
            } else {
                m = false
            }
        }
        if (!g && b) {
            if (a) {
                var h = a.indexOf(l);
                if (h >= 0) { } else {
                    m = false
                }
            } else {
                m = false
            }
        }
        if (g) {
            if (e) {
                if (!arrayContains(e, l)) {
                    m = false
                } else { }
            } else {
                m = false
            }
        }
        if (m) {
            p.push(d)
        }
    }
    return p
};
HarmonyGenerator.prototype.getBassPassingChords = function (f, b, c, m, a) {
    var g = [];
    var n = f.getBassScaleIndex();
    var d = b.getBassScaleIndex();
    var j = d - n;
    var k = Math.abs(j);
    c = Math.min(c, k);
    var h = c;
    if (j == 0) {
        console.log("Can not find a passing chord when the basses are the same <br />");
        return g
    } else {
        if (j < 0) {
            h = -h
        }
    }
    var e = f.getChordRootScaleIndex();
    if (f.chordInversions > 1) {
        console.log("getBassPassingChords() does not support chords with inversions > 1 yet <br />")
    } else {
        if (f.chordInversions == 0) {
            switch (h) {
                case -2:
                    g.push(f.copy().setChordRoot(e - 4).setChordInversions(1));
                    g.push(f.copy().setChordRoot(e - 2).setChordInversions(0));
                    break;
                case -1:
                    g.push(f.copy().setChordRoot(e - 3).setChordInversions(1));
                    g.push(f.copy().setChordRoot(e - 1).setChordInversions(0));
                    break;
                case 1:
                    g.push(f.copy().setChordRoot(e - 1).setChordInversions(1));
                    g.push(f.copy().setChordRoot(e + 1).setChordInversions(0));
                    break;
                case 2:
                    g.push(f.copy().setChordRoot(e + 2).setChordInversions(0));
                    g.push(f.copy().setChordRoot(e).setChordInversions(1));
                    break;
                default:
                    console.log("getBassPassingChords() does not support increments " + h + "<br />");
                    break
            }
        } else {
            switch (h) {
                case -2:
                    g.push(f.copy().setChordRoot(e - 2).setChordInversions(1));
                    g.push(f.copy().setChordRoot(e).setChordInversions(0));
                    break;
                case -1:
                    g.push(f.copy().setChordRoot(e + 1).setChordInversions(0));
                    g.push(f.copy().setChordRoot(e - 1).setChordInversions(1));
                    break;
                case 1:
                    g.push(f.copy().setChordRoot(e + 3).setChordInversions(0));
                    g.push(f.copy().setChordRoot(e + 1).setChordInversions(1));
                    break;
                case 2:
                    g.push(f.copy().setChordRoot(e + 2).setChordInversions(1));
                    g.push(f.copy().setChordRoot(e + 4).setChordInversions(0));
                    break;
                default:
                    console.log("getBassPassingChords() does not support increments " + h + "<br />");
                    break
            }
        }
    }
    var l = this.filterChords(f, g, m, a);
    return l
};
var StaticHarmonyMode = {
    BASE: 0,
    AUXILIARY: 1,
    BASE_NEIGHBOUR: 2,
    AUXILIARY_NEIGHBOUR: 3,
    PASSING_TOWARDS_BASE: 4,
    PASSING_TOWARDS_AUXILIARY: 5,
    ACCENTED_64_BASE: 6
};

function StaticHarmonyState() {
    this.harmony = null;
    this.targetHarmony = null;
    this.mode = StaticHarmonyMode.BASE;
    this.auxiliaryRoot = 0;
    this.stepCost = 0
}

function StaticHarmonyGenerator(a) {
    HarmonyGenerator.call(this, a);
    this.scaleBaseNote = getValueOrDefault(a, "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(a, "scaleType", ScaleType.MAJOR);
    this.baseRoot = getValueOrDefault(a, "baseRoot", 0);
    this.baseHarmony = new ConstantHarmonyElement().setChordRoot(this.baseRoot).setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType);
    this.baseToBaseLikelihood = getValueOrDefault(a, "baseToBaseLikelihood", 0.01);
    this.baseExpandedLikelihood = getValueOrDefault(a, "baseExpandedLikelihood", 1);
    this.baseToNeighbourLikelihood = getValueOrDefault(a, "baseToNeighbourLikelihood", 1);
    this.baseToPassingLikelihood = getValueOrDefault(a, "baseToPassingLikelihood", 1);
    this.baseToAuxiliaryLikelihood = getValueOrDefault(a, "baseToAuxiliaryLikelihood", 1);
    this.auxiliaryToAuxiliaryLikelihood = getValueOrDefault(a, "auxiliaryToAuxiliaryLikelihood", 0.01);
    this.auxiliaryExpandedLikelihood = getValueOrDefault(a, "auxiliaryExpandedLikelihood", 1);
    this.auxiliaryToBaseLikelihood = getValueOrDefault(a, "auxiliaryToBaseLikelihood", 1);
    this.auxiliaryToNeighbourLikelihood = getValueOrDefault(a, "auxiliaryToNeighbourLikelihood", 1);
    this.auxiliaryToPassingLikelihood = getValueOrDefault(a, "auxiliaryToPassingLikelihood", 1);
    this.baseToBaseCost = getValueOrDefault(a, "baseToBaseCost", 0);
    this.baseExpandedCost = getValueOrDefault(a, "baseExpandedCost", 0);
    this.baseToNeighbourCost = getValueOrDefault(a, "baseToNeighbourCost", 0);
    this.baseToPassingCost = getValueOrDefault(a, "baseToPassingCost", 0);
    this.baseToAuxiliaryCost = getValueOrDefault(a, "baseToAuxiliaryCost", 0);
    this.auxiliaryToAuxiliaryCost = getValueOrDefault(a, "auxiliaryToAuxiliaryCost", 0);
    this.auxiliaryExpandedCost = getValueOrDefault(a, "auxiliaryExpandedCost", 0);
    this.auxiliaryToBaseCost = getValueOrDefault(a, "auxiliaryToBaseCost", 0);
    this.auxiliaryToNeighbourCost = getValueOrDefault(a, "auxiliaryToNeighbourCost", 0);
    this.auxiliaryToPassingCost = getValueOrDefault(a, "auxiliaryToPassingCost", 0);
    this.auxiliaryChordRoots = getValueOrDefault(a, "auxiliaryChordRoots", [3, 4, 2, 5]);
    this.auxiliaryChordRootLikelihoods = getValueOrDefault(a, "auxiliaryChordRootLikelihoods", [1, 1, 0.2, 0.2]);
    this.auxiliaryChordRootCosts = getValueOrDefault(a, "auxiliaryChordRootCosts", [0, 0, 0, 0]);
    this.minorPassingChordRoots = getValueOrDefault(a, "minorPassingChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorPassingChordInversions = getValueOrDefault(a, "minorPassingChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.majorPassingChordRoots = getValueOrDefault(a, "majorPassingChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorPassingChordInversions = getValueOrDefault(a, "majorPassingChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.passingIncrements = getValueOrDefault(a, "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(a, "passingIncrementLikelihoods", [0.25, 1, 1, 0.25]);
    this.passingIncrementCosts = getValueOrDefault(a, "passingIncrementCosts", [0, 0, 0, 0]);
    this.majorNeighbourChordRoots = getValueOrDefault(a, "majorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorNeighbourChordInversions = getValueOrDefault(a, "majorNeighbourChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.minorNeighbourChordRoots = getValueOrDefault(a, "minorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourChordInversions = getValueOrDefault(a, "minorNeighbourChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.majorNeighbourSusChordRoots = getValueOrDefault(a, "majorNeighbourSusChordRoots", [0, 1, 4, 5]);
    this.minorNeighbourSusChordRoots = getValueOrDefault(a, "minorNeighbourSusChordRoots", [0, 2, 3]);
    this.majorNeighbourMixtureChordRoots = getValueOrDefault(a, "majorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourMixtureChordRoots = getValueOrDefault(a, "minorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.mixture = getValueOrDefault(a, "mixture", true);
    this.canEndWithBase = getValueOrDefault(a, "canEndWithBase", true);
    this.canEndWithAuxiliary = getValueOrDefault(a, "canEndWithAuxiliary", false);
    this.possibleAuxiliaryEndRoots = getValueOrDefault(a, "possibleAuxiliaryEndRoots", [3, 4, 2, 5]);
    this.possibleAuxiliaryEndInversions = getValueOrDefault(a, "possibleAuxiliaryEndInversions", [
        [0],
        [0],
        [0],
        [0]
    ]);
    this.possiblePassingEndRoots = getValueOrDefault(a, "possiblePassingEndRoots", [0]);
    this.possiblePassingEndInversions = getValueOrDefault(a, "possiblePassingEndInversions", [
        [0, 1]
    ]);
    this.possibleNeighbourEndRoots = getValueOrDefault(a, "possibleNeighbourEndRoots", [0]);
    this.possibleNeighbourEndInversions = getValueOrDefault(a, "possibleNeighbourEndInversions", [
        [0]
    ]);
    this.baseSeventhLikelihoods = getValueOrDefault(a, "baseSeventhLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.baseSeventhCosts = getValueOrDefault(a, "baseSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.baseTriadLikelihoods = getValueOrDefault(a, "baseTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.baseTriadCosts = getValueOrDefault(a, "baseTraidCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.auxiliarySeventhLikelihoods = getValueOrDefault(a, "auxiliarySeventhLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.auxiliaryTriadLikelihoods = getValueOrDefault(a, "auxiliaryTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.passingSeventhLikelihoods = getValueOrDefault(a, "passingSeventhLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.passingTriadLikelihoods = getValueOrDefault(a, "passingTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.neighbourSeventhLikelihoods = getValueOrDefault(a, "neighbourSeventhLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.neighbourTriadLikelihoods = getValueOrDefault(a, "neighbourTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.simpleMixtureLikelihood = getValueOrDefault(a, "simpleMixtureLikelihood", 1);
    this.sus2Likelihood = getValueOrDefault(a, "sus2Likelihood", 1);
    this.sus4Likelihood = getValueOrDefault(a, "sus4Likelihood", 1);
    this.neighbourMixtureSeventhLikelihoods = getValueOrDefault(a, "neighbourMixtureSeventhLikelihoods", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureTriadLikelihoods = getValueOrDefault(a, "neighbourMixtureTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.auxiliarySeventhCosts = getValueOrDefault(a, "auxiliarySeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.auxiliaryTriadCosts = getValueOrDefault(a, "auxiliaryTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.passingSeventhCosts = getValueOrDefault(a, "passingSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.passingTriadCosts = getValueOrDefault(a, "passingTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourSeventhCosts = getValueOrDefault(a, "neighbourSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourTriadCosts = getValueOrDefault(a, "neighbourTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureSeventhCosts = getValueOrDefault(a, "neighbourMixtureSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureTriadCosts = getValueOrDefault(a, "neighbourMixtureTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.startWithAccented64Likelihood = getValueOrDefault(a, "startWithAccented64Likelihood", 110);
    this.startWithoutAccented64Likelihood = getValueOrDefault(a, "startWithoutAccented64Likelihood", 1);
    this.startWithAccented64Cost = getValueOrDefault(a, "startWithAccented64Cost", 10);
    this.startWithoutAccented64Cost = getValueOrDefault(a, "startWithoutAccented64Cost", 0)
}
StaticHarmonyGenerator.prototype = new HarmonyGenerator();
StaticHarmonyGenerator.prototype.getStartStateIterator = function () {
    var j = [];
    var e = [];
    var b = [];
    if (this.count > 1 && this.startWithAccented64Likelihood > 0) {
        var g = new StaticHarmonyState();
        g.harmony = this.baseHarmony.copy();
        g.harmony.note = "S";
        g.harmony.chordRoot = (g.harmony.chordRoot + 3) % 7;
        g.harmony.chordInversions = 2;
        g.harmony.chordType = ChordType.TRIAD;
        g.mode = StaticHarmonyMode.ACCENTED_64_BASE;
        j.push(g);
        var f = this.startWithAccented64Likelihood;
        var c = this.startWithAccented64Cost;
        if (this.startBeatStrengths.length > 0) {
            var h = this.startBeatStrengths[0];
            var d = this.startBeatStrengths[1 % this.startBeatStrengths.length];
            if (d > h) {
                f *= 0.1;
                c += 10
            } else { }
        }
        e.push(f);
        b.push(c)
    }
    var a = new StaticHarmonyState();
    a.harmony = this.baseHarmony.copy();
    a.harmony.note = "S";
    a.mode = StaticHarmonyMode.BASE;
    this.getChordsStuff(0, a, this.startWithoutAccented64Likelihood, this.startWithoutAccented64Cost, this.baseSeventhLikelihoods, this.baseTriadLikelihoods, this.baseSeventhCosts, this.baseTriadCosts, j, e, b);
    return new RandomDfsStateIterator2(j, e, b, this.rnd)
};
StaticHarmonyGenerator.prototype.isGoalState = function (e) {
    var a = true;
    switch (e.mode) {
        case StaticHarmonyMode.BASE:
            a = this.canEndWithBase;
            break;
        case StaticHarmonyMode.AUXILIARY:
            if (this.canEndWithAuxiliary) {
                if (this.possibleAuxiliaryEndRoots.length > 0) {
                    var d = e.harmony.getAbsoluteNoteFromScaleIndex(e.harmony.getChordRootScaleIndex()) % 12;
                    for (var c = 0; c < this.possibleAuxiliaryEndRoots.length; c++) {
                        var b = e.harmony.getAbsoluteNoteFromScaleIndex(this.possibleAuxiliaryEndRoots[c]) % 12;
                        if (b == d) {
                            a = true;
                            break
                        }
                    }
                    a = false
                }
                a = true
            } else {
                a = false
            }
            break;
        default:
            a = false;
            break
    }
    return a
};
StaticHarmonyGenerator.prototype.isInvalidState = function (a) {
    return false
};
StaticHarmonyGenerator.prototype.getBaseState = function () {
    var a = new StaticHarmonyState();
    a.harmony = this.baseHarmony.copy();
    a.harmony.note = "S";
    a.mode = StaticHarmonyMode.BASE;
    return a
};
StaticHarmonyGenerator.prototype.getAuxiliaryHarmony = function (b) {
    var a = this.baseHarmony.copy();
    a.chordRoot = b;
    a.note = "S, A";
    return a
};
StaticHarmonyGenerator.prototype.getAuxiliaryState = function (a) {
    var b = new StaticHarmonyState();
    b.harmony = this.getAuxiliaryHarmony(a);
    b.mode = StaticHarmonyMode.AUXILIARY;
    return b
};
StaticHarmonyGenerator.prototype.getPassingTowardsTargetStatesAndLikelihoods = function (z, J, P, G) {
    var g = z.state.harmony;
    var A = z.state.targetHarmony;
    var s = g.getBassScaleIndex();
    var h = A.getBassScaleIndex();
    var C = z.state.mode == StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY;
    var x = this.passingIncrements;
    var n = this.passingIncrementLikelihoods;
    var I = this.passingIncrementCosts;
    var q = [];
    var f = [];
    var N = [];
    var T = [];
    var D = x;
    var a = [];
    var F = [];
    var d = [];
    var w = h - s;
    for (var O = 0; O < D.length; O++) {
        var Q = D[O];
        var K = n[O % n.length];
        var S = I[O % I.length];
        if ((w < 0 && Q < 0) || (w > 0 && Q > 0)) {
            a.push(Math.abs(Q));
            F.push(K);
            d.push(S)
        }
    }
    var E = Math.abs(w);
    var p = false;
    var H = 0;
    var t = 0;
    for (var L = 0; L < a.length; L++) {
        if (a[L] == E) {
            p = true;
            H = Math.max(H, F[L]);
            t = Math.max(t, d[L])
        }
    }
    if (p) {
        var R = A.copy();
        N.push(R);
        R.note = "S" + (C ? ", A" : "");
        T.push(C ? StaticHarmonyMode.AUXILIARY : StaticHarmonyMode.BASE);
        q.push(H);
        f.push(t)
    }
    var u = false;
    var y = u ? this.majorPassingChordRoots : this.minorPassingChordRoots;
    var B = u ? this.majorPassingChordInversions : this.minorPassingChordInversions;
    for (var L = 0; L < a.length; L++) {
        var b = a[L];
        if (b < E) {
            var e = F[L];
            var v = d[L];
            var m = this.getBassPassingChords(g.copy(), A, b, y, B);
            for (var M = 0; M < m.length; M++) {
                var r = m[M];
                N.push(r);
                r.note = "S, " + (C ? "PA" : "PB");
                q.push(e);
                f.push(v);
                T.push(C ? StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY : StaticHarmonyMode.PASSING_TOWARDS_BASE)
            }
        }
    }
    var o = z.depth;
    for (var O = 0; O < N.length; O++) {
        var U = new StaticHarmonyState();
        U.harmony = N[O];
        U.targetHarmony = A;
        U.mode = T[O];
        this.getChordsStuff(o, U, q[O], f[O], this.passingSeventhLikelihoods, this.passingTriadLikelihoods, this.passingSeventhCosts, this.passingTriadCosts, J, P, G)
    }
};
StaticHarmonyGenerator.prototype.getBaseStatesAndLikelihoods = function (C, M, R, K) {
    var h = C.state.harmony;
    var v = this.scaleType == ScaleType.MAJOR ? false : true;
    if (this.baseToBaseLikelihood > 0) {
        var y = this.getBaseState();
        M.push(y);
        y.harmony.note = "S";
        R.push(this.baseToBaseLikelihood);
        K.push(this.baseToBaseCost)
    }
    if (this.baseExpandedLikelihood > 0 && h.chordInversions == 0) {
        var y = this.getBaseState();
        y.harmony.chordInversions = 1;
        M.push(y);
        y.harmony.note = "S, BE";
        R.push(this.baseExpandedLikelihood);
        K.push(this.baseExpandedCost)
    }
    var q = C.depth;
    if (this.baseToAuxiliaryLikelihood > 0) {
        var J = [];
        var F = [];
        var g = [];
        for (var Q = 0; Q < this.auxiliaryChordRoots.length; Q++) {
            var m = this.auxiliaryChordRoots[Q];
            var o = this.auxiliaryChordRootLikelihoods[Q % this.auxiliaryChordRootLikelihoods.length];
            var G = this.auxiliaryChordRootCosts[Q % this.auxiliaryChordRootCosts.length];
            var A = this.getAuxiliaryState(m);
            this.getChordsStuff(q, A, o, G, this.auxiliarySeventhLikelihoods, this.auxiliaryTriadLikelihoods, this.auxiliarySeventhCosts, this.auxiliaryTriadCosts, g, J, F)
        }
        if (J.length > 0) {
            for (var Q = 0; Q < J.length; Q++) {
                M.push(g[Q]);
                g[Q].harmony.note = "S, A";
                R.push(this.baseToAuxiliaryLikelihood * J[Q]);
                K.push(this.baseToAuxiliaryCost + F[Q])
            }
        }
    }
    if (this.baseToNeighbourLikelihood > 0 && h.chordInversions == 0) {
        var s = [];
        var e = [];
        var P = [];
        var t = this.baseToNeighbourLikelihood;
        var r = v ? this.minorNeighbourChordRoots : this.majorNeighbourChordRoots;
        var S = v ? this.minorNeighbourChordInversions : this.majorNeighbourChordInversions;
        var d = v ? this.minorNeighbourSusChordRoots : this.majorNeighbourSusChordRoots;
        var I = v ? this.minorNeighbourMixtureChordRoots : this.majorNeighbourMixtureChordRoots;
        if (!this.mixture) {
            I = []
        }
        var p = this.getBassNeighbourChords(this.baseHarmony, r, S, d, I);
        for (var Q = 0; Q < p.length; Q++) {
            P.push(p[Q]);
            s.push(1);
            e.push(0)
        }
        for (var Q = 0; Q < P.length; Q++) {
            var x = this.neighbourSeventhLikelihoods;
            var L = this.neighbourTriadLikelihoods;
            var b = this.neighbourSeventhCosts;
            var c = this.neighbourTriadCosts;
            var U = new StaticHarmonyState();
            U.harmony = P[Q];
            U.harmony.note = "S, BN";
            if (this.baseHarmony.scaleType != U.harmony.scaleType) {
                U.harmony.note += "X";
                t *= this.simpleMixtureLikelihood;
                x = this.neighbourMixtureSeventhLikelihoods;
                L = this.neighbourMixtureTriadLikelihoods;
                b = this.neighbourMixtureSeventhCosts;
                c = this.neighbourMixtureTriadCosts
            }
            U.mode = StaticHarmonyMode.BASE_NEIGHBOUR;
            this.getChordsStuff(q, U, t, this.baseToNeighbourCost, x, L, b, c, M, R, K)
        }
    }
    if (this.baseToPassingLikelihood > 0) {
        var s = [];
        var e = [];
        var P = [];
        var z = [];
        var D = C.state.harmony.getScale();
        for (var Q = 0; Q < this.auxiliaryChordRoots.length; Q++) {
            var m = this.auxiliaryChordRoots[Q];
            var o = this.auxiliaryChordRootLikelihoods[Q % this.auxiliaryChordRootLikelihoods.length];
            var G = this.auxiliaryChordRootCosts[Q % this.auxiliaryChordRootCosts.length];
            var E = this.passingIncrements;
            for (var N = 0; N < E.length; N++) {
                var a = this.passingIncrementLikelihoods[N % this.passingIncrementLikelihoods.length];
                var w = this.passingIncrementCosts[N % this.passingIncrementCosts.length];
                var H = E[N];
                var T = m;
                if (this.baseRoot > m) {
                    T += 7
                }
                var f = T - D.length;
                var n = this.getAuxiliaryHarmony(H > 0 ? T : f);
                var l = this.getBassPassingChords(this.baseHarmony.copy(), n, Math.abs(H), this.majorPassingChordRoots, this.majorPassingChordInversions);
                for (var O = 0; O < l.length; O++) {
                    var u = l[O];
                    P.push(u);
                    z.push(n.copy());
                    s.push(o * a);
                    e.push(G + w)
                }
            }
        }
        var B = M.length;
        for (var Q = 0; Q < P.length; Q++) {
            var U = new StaticHarmonyState();
            U.harmony = P[Q];
            U.harmony.note = "S, PA";
            U.targetHarmony = z[Q];
            U.mode = StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY;
            this.getChordsStuff(q, U, this.baseToPassingLikelihood * s[Q], this.baseToPassingCost + e[Q], this.passingSeventhLikelihoods, this.passingTriadLikelihoods, this.passingSeventhCosts, this.passingTriadCosts, M, R, K)
        }
    }
};
StaticHarmonyGenerator.prototype.getAuxiliaryStatesAndLikelihoods = function (d, m, k, r) {
    var n = d.state.harmony;
    if (this.auxiliaryToAuxiliaryLikelihood > 0) {
        var q = new StaticHarmonyState();
        q.harmony = d.state.harmony.copy();
        q.harmony.note = "S, A";
        q.mode = StaticHarmonyMode.AUXILIARY;
        m.push(q);
        k.push(this.auxiliaryToAuxiliaryLikelihood);
        r.push(this.auxiliaryToAuxiliaryCost)
    }
    if (this.auxiliaryExpandedLikelihood > 0 && n.chordInversions == 0) {
        var q = new StaticHarmonyState();
        q.harmony = n.copy();
        q.harmony.note = "S, AE";
        q.harmony.chordInversions = 1;
        q.mode = StaticHarmonyMode.AUXILIARY;
        m.push(q);
        k.push(this.auxiliaryExpandedLikelihood);
        r.push(this.auxiliaryExpandedCost)
    }
    if (this.auxiliaryToBaseLikelihood > 0) {
        var q = new StaticHarmonyState();
        q.harmony = this.baseHarmony.copy();
        q.harmony.note = "S";
        q.mode = StaticHarmonyMode.BASE;
        m.push(q);
        k.push(this.auxiliaryToBaseLikelihood);
        r.push(this.auxiliaryToBaseCost)
    }
    if (this.auxiliaryToNeighbourLikelihood > 0 && n.chordInversions == 0) {
        var j = n.scaleType == ScaleType.NATURAL_MINOR;
        var p = j ? this.minorNeighbourChordRoots : this.majorNeighbourChordRoots;
        var h = j ? this.minorNeighbourChordInversions : this.majorNeighbourChordInversions;
        var o = j ? this.minorNeighbourSusChordRoots : this.majorNeighbourSusChordRoots;
        var g = j ? this.minorNeighbourMixtureChordRoots : this.majorNeighbourMixtureChordRoots;
        if (!this.mixture) {
            g = []
        }
        var c = this.getBassNeighbourChords(d.state.harmony.copy(), p, h, o, g);
        var e = [];
        var b = [];
        for (var l = 0; l < c.length; l++) {
            e.push(1);
            b.push(0)
        }
        for (var l = 0; l < c.length; l++) {
            var a = new StaticHarmonyState();
            a.harmony = c[l];
            a.harmony.note = "S, AN";
            var f = this.auxiliaryToNeighbourLikelihood * e[l];
            if (d.state.harmony.scaleType != a.harmony.scaleType) {
                a.harmony.note += "X";
                f *= this.simpleMixtureLikelihood
            }
            a.mode = StaticHarmonyMode.AUXILIARY_NEIGHBOUR;
            a.auxiliaryRoot = d.state.harmony.chordRoot;
            m.push(a);
            k.push(f);
            r.push(this.auxiliaryToNeighbourCost + b[l])
        }
    }
};
StaticHarmonyGenerator.prototype.getSuccessorIterator = function (d) {
    var e = d.state;
    var b = [];
    var a = [];
    var f = [];
    var c = this.count - d.depth;
    switch (e.mode) {
        case StaticHarmonyMode.ACCENTED_64_BASE:
            var e = new StaticHarmonyState();
            e.harmony = this.baseHarmony.copy();
            e.mode = StaticHarmonyMode.BASE;
            b.push(e);
            a.push(1);
            f.push(0);
            break;
        case StaticHarmonyMode.BASE:
            this.getBaseStatesAndLikelihoods(d, b, a, f);
            break;
        case StaticHarmonyMode.AUXILIARY:
            this.getAuxiliaryStatesAndLikelihoods(d, b, a, f);
            break;
        case StaticHarmonyMode.BASE_NEIGHBOUR:
            b.push(this.getBaseState());
            a.push(1);
            f.push(0);
            break;
        case StaticHarmonyMode.AUXILIARY_NEIGHBOUR:
            b.push(this.getAuxiliaryState(d.state.auxiliaryRoot));
            a.push(1);
            f.push(0);
            break;
        case StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY:
            this.getPassingTowardsTargetStatesAndLikelihoods(d, b, a, f);
            break;
        case StaticHarmonyMode.PASSING_TOWARDS_BASE:
            this.getPassingTowardsTargetStatesAndLikelihoods(d, b, a, f);
            break
    }
    this.calculateBeatStrengthRepetitionCosts(d, b, a, f);
    this.calculateSeventhToTriadCosts(d, b, a, f);
    this.calculateSusCosts(d, b, a, f, this.sus2Likelihood, this.sus4Likelihood);
    return new RandomDfsStateIterator2(b, a, f, this.rnd)
};
var MajorMixtureChordType = {
    I: 0,
    II6: 1,
    IV: 2,
    VI: 3
};
var MinorMixtureChordType = {
    I: 0
};
var DynamicHarmonyModulationTarget = {
    NONE: -1,
    SUPERTONIC: 0,
    MEDIANT: 1,
    SUBDOMINANT: 2,
    DOMINANT: 3,
    SUBMEDIANT: 4,
    SUBTONIC: 5,
    invert: function (a) {
        switch (a) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return DynamicHarmonyModulationTarget.SUBTONIC;
            case DynamicHarmonyModulationTarget.DOMINANT:
                return DynamicHarmonyModulationTarget.SUBDOMINANT;
            case DynamicHarmonyModulationTarget.MEDIANT:
                return DynamicHarmonyModulationTarget.SUBMEDIANT;
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return DynamicHarmonyModulationTarget.DOMINANT;
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return DynamicHarmonyModulationTarget.MEDIANT;
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return DynamicHarmonyModulationTarget.SUPERTONIC
        }
        return a
    },
    getScaleType: function (b, d, a) {
        var c = b == ScaleType.MAJOR ? ScaleType.NATURAL_MINOR : ScaleType.MAJOR;
        switch (d) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
            case DynamicHarmonyModulationTarget.MEDIANT:
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return a ? b : c
        }
        return a ? c : b
    }
};

var AppliedChordType = {
    V: 0,
    V6: 1,
    V7: 2,
    V65: 3,
    V43: 4,
    V42: 5,
    VII: 6,
    VII6: 7,
    VII7: 8,
};

var DynamicHarmonyMode = {
    ROOT: 0,
    NEIGHBOUR: 1,
    PASSING: 2,
    ROOT_MODULATION: 3,
    NEIGHBOUR_MODULATION: 4,
    PASSING_MODULATION: 5,
    ROOT_MIXTURE: 6,
    ROOT_MIXTURE_MODULATION: 7
};

function DynamicHarmonyState() {
    this.harmony = null;
    this.targetHarmony = null;
    this.mode = DynamicHarmonyMode.ROOT;
    this.stepCost = 0;
    this._constructorName = "DynamicHarmonyState"
}
DynamicHarmonyState.prototype.copy = function () {
    return copyObjectDeep(this)
};

function DynamicHarmonyGenerator(a) {
    HarmonyGenerator.call(this, a);
    this.scaleBaseNote = getValueOrDefault(a, "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(a, "scaleType", ScaleType.MAJOR);
    this.modulate = getValueOrDefault(a, "modulate", false);
    this.modulateInvertScaleType = getValueOrDefault(a, "modulateInvertScaleType", false);
    this.mixture = getValueOrDefault(a, "mixture", true);
    this.simpleMixtureLikelihood = getValueOrDefault(a, "simpleMixtureLikelihood", 1);
    this.sus2Likelihood = getValueOrDefault(a, "sus2Likelihood", 1);
    this.sus4Likelihood = getValueOrDefault(a, "sus4Likelihood", 1);
    this.majorMixtureChordTypes = getValueOrDefault(a, "majorMixtureChordTypes", [MajorMixtureChordType.I, MajorMixtureChordType.II6, MajorMixtureChordType.IV, MajorMixtureChordType.VI]);
    this.majorMixtureChordTypeLikelihoods = getValueOrDefault(a, "majorMixtureChordTypeLikelihoods", [1, 1, 1, 1]);
    this.majorMixtureChordTypeCosts = getValueOrDefault(a, "majorMixtureChordTypeCosts", [0, 0, 0, 0]);
    this.minorMixtureChordTypes = getValueOrDefault(a, "minorMixtureChordTypes", [MinorMixtureChordType.I]);
    this.minorMixtureChordTypeLikelihoods = getValueOrDefault(a, "minorMixtureChordTypeLikelihoods", [1]);
    this.minorMixtureChordTypeCosts = getValueOrDefault(a, "minorMixtureChordTypeCosts", [0]);
    this.startsOnStrong = getValueOrDefault(a, "startsOnStrong", [true]);
    this.majorModulationTarget = getValueOrDefault(a, "majorModulationTarget", DynamicHarmonyModulationTarget.DOMINANT);
    this.minorModulationTarget = getValueOrDefault(a, "minorModulationTarget", DynamicHarmonyModulationTarget.MEDIANT);
    this.majorStartRoots = getValueOrDefault(a, "majorStartRoots", [0]);
    this.majorStartRootLikelihoods = getValueOrDefault(a, "majorStartRootLikelihoods", [1]);
    this.majorStartRootCosts = getValueOrDefault(a, "majorStartRootCosts", [0]);
    this.minorStartRoots = getValueOrDefault(a, "minorStartRoots", [0]);
    this.minorStartRootLikelihoods = getValueOrDefault(a, "minorStartRootLikelihoods", [1]);
    this.minorStartRootCosts = getValueOrDefault(a, "minorStartRootCosts", [0]);
    this.startHarmony = getValueOrDefault(a, "startHarmony", new ConstantHarmonyElement().setChordRoot(this.majorStartRoots[0]).setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType));
    this.useSus2 = getValueOrDefault(a, "useSus2", false);
    this.useSus4 = getValueOrDefault(a, "useSus4", true);
    this.canEndWithSus2 = getValueOrDefault(a, "canEndWithSus2", true);
    this.canEndWithSus4 = getValueOrDefault(a, "canEndWithSus4", true);
    this.majorScaleSeventhLikelihoods = getValueOrDefault(a, "majorScaleSeventhLikelihoods", [
        [0, 1, 0, 1, 0, 1, 1]
    ]);
    this.majorScaleTriadLikelihoods = getValueOrDefault(a, "majorScaleTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.majorScaleSus2Likelihoods = getValueOrDefault(a, "majorScaleSus2Likelihoods", [
        [1, 1, 0, 1, 1, 1, 0]
    ]);
    this.majorScaleSus4Likelihoods = getValueOrDefault(a, "majorScaleSus4Likelihoods", [
        [1, 1, 1, 0, 1, 1, 0]
    ]);
    this.majorScaleSeventhCosts = getValueOrDefault(a, "majorScaleSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.majorScaleTriadCosts = getValueOrDefault(a, "majorScaleTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.majorScaleSus2Costs = getValueOrDefault(a, "majorScaleSus2Costs", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.majorScaleSus4Costs = getValueOrDefault(a, "majorScaleSus4Costs", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.minorScaleSeventhLikelihoods = getValueOrDefault(a, "minorScaleSeventhLikelihoods", [
        [0, 1, 0, 1, 0, 1, 0]
    ]);
    this.minorScaleTriadLikelihoods = getValueOrDefault(a, "minorScaleTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.minorScaleSus2Likelihoods = getValueOrDefault(a, "minorScaleSus2Likelihoods", [
        [0, 1, 1, 1, 0, 1, 0]
    ]);
    this.minorScaleSus4Likelihoods = getValueOrDefault(a, "minorScaleSus4Likelihoods", [
        [0, 1, 1, 1, 1, 0, 0]
    ]);
    this.minorScaleSeventhCosts = getValueOrDefault(a, "minorScaleSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.minorScaleTriadCosts = getValueOrDefault(a, "minorScaleTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.minorScaleSus2Costs = getValueOrDefault(a, "minorScaleSus2Costs", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.minorScaleSus4Costs = getValueOrDefault(a, "minorScaleSus4Costs", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.majorProgressionRoots = getValueOrDefault(a, "majorProgressionRoots", [
        [0, 1, 2, 3, 4, 5]
    ]);
    this.majorProgressionRootLikelihoods = getValueOrDefault(a, "majorProgressionRootLikelihoods", [
        [1]
    ]);
    this.minorProgressionRoots = getValueOrDefault(a, "minorProgressionRoots", [
        [0, 2, 3, 4, 5, 6]
    ]);
    this.minorProgressionRootLikelihoods = getValueOrDefault(a, "minorProgressionRootLikelihoods", [
        [1]
    ]);
    this.majorProgressionMovements = getValueOrDefault(a, "majorProgressionMovements", [
        [-4, -2, 1, -1, -3, 2]
    ]);
    this.majorProgressionMovementLikelihoods = getValueOrDefault(a, "majorProgressionMovementLikelihoods", [
        [1, 1, 1, 0.2, 0.2, 0.2]
    ]);
    this.majorProgressionMovementCosts = getValueOrDefault(a, "majorProgressionMovementCosts", [
        [0, 0, 0, 0, 0, 0]
    ]);
    this.minorProgressionMovements = getValueOrDefault(a, "minorProgressionMovements", [
        [-4, -2, 1, -1, -3, 2]
    ]);
    this.minorProgressionMovementLikelihoods = getValueOrDefault(a, "minorProgressionMovementLikelihoods", [
        [1, 1, 1, 0.2, 0.2, 0.2]
    ]);
    this.minorProgressionMovementCosts = getValueOrDefault(a, "minorProgressionMovementCosts", [
        [0, 0, 0, 0, 0, 0]
    ]);
    this.intoAppliedProgressionMovements = getValueOrDefault(a, "intoAppliedProgressionMovements", [
        [-4, -2, 1, 0, -1, -3, 2]
    ]);
    this.intoAppliedProgressionMovementLikelihoods = getValueOrDefault(a, "intoAppliedProgressionMovementLikelihoods", [
        [1, 0.75, 0.5, 0.25, 0.1, 0.1, 0.1]
    ]);
    this.intoAppliedProgressionMovementCosts = getValueOrDefault(a, "intoAppliedProgressionMovementCosts", [
        [0, 0, 0, 0, 0]
    ]);
    this.intoMixtureProgressionMovements = getValueOrDefault(a, "intoMixtureProgressionMovements", [-4, -2, 1, 0, -1, -3, 2]);
    this.intoMixtureProgressionMovementLikelihoods = getValueOrDefault(a, "intoMixtureProgressionMovementLikelihoods", [1, 1, 1, 1, 1, 0.2, 0.2]);
    this.intoMixtureProgressionMovementCosts = getValueOrDefault(a, "intoMixtureProgressionMovementCosts", [0, 0, 0, 0, 0, 0, 0]);
    this.majorPossibleEndRoots = getValueOrDefault(a, "majorPossibleEndRoots", [1, 3, 5]);
    this.minorPossibleEndRoots = getValueOrDefault(a, "minorPossibleEndRoots", [3, 5]);
    this.majorPossibleEndSus2Roots = getValueOrDefault(a, "majorPossibleEndSus2Roots", []);
    this.minorPossibleEndSus2Roots = getValueOrDefault(a, "minorPossibleEndSus2Roots", []);
    this.majorPossibleEndSus4Roots = getValueOrDefault(a, "majorPossibleEndSus4Roots", []);
    this.minorPossibleEndSus4Roots = getValueOrDefault(a, "minorPossibleEndSus4Roots", []);
    this.majorPossibleEndInversions = getValueOrDefault(a, "majorPossibleEndInversions", [
        [0]
    ]);
    this.minorPossibleEndInversions = getValueOrDefault(a, "minorPossibleEndInversions", [
        [0]
    ]);
    this.majorModulationPossibleEndRoots = getValueOrDefault(a, "majorModulationPossibleEndRoots", [1, 3, 5]);
    this.minorModulationPossibleEndRoots = getValueOrDefault(a, "minorModulationPossibleEndRoots", [3, 5]);
    this.majorModulationPossibleEndSus2Roots = getValueOrDefault(a, "majorModulationPossibleEndSus2Roots", []);
    this.majorModulationPossibleEndSus4Roots = getValueOrDefault(a, "majorModulationPossibleEndSus4Roots", []);
    this.minorModulationPossibleEndSus2Roots = getValueOrDefault(a, "minorModulationPossibleEndSus2Roots", []);
    this.minorModulationPossibleEndSus4Roots = getValueOrDefault(a, "minorModulationPossibleEndSus4Roots", []);
    this.majorModulationPossibleEndInversions = getValueOrDefault(a, "majorModulationPossibleEndInversions", [
        [0]
    ]);
    this.minorModulationPossibleEndInversions = getValueOrDefault(a, "minorModulationPossibleEndInversions", [
        [0]
    ]);
    this.majorPassingRoots = getValueOrDefault(a, "majorPassingRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorPassingRootLikelihoods = getValueOrDefault(a, "majorPassingRootLikelihoods", [1]);
    this.minorPassingRoots = getValueOrDefault(a, "minorPassingRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorPassingRootLikelihoods = getValueOrDefault(a, "minorPassingRootLikelihoods", [1]);
    this.passingInversions = getValueOrDefault(a, "passingInversions", [1, 2]);
    this.passingInversionLikelihoods = getValueOrDefault(a, "passingInversionLikelihoods", [1, 0.5]);
    this.passingIncrements = getValueOrDefault(a, "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(a, "passingIncrementLikelihoods", [0.5, 1, 1, 0.5]);
    this.majorNeighbourChordRoots = getValueOrDefault(a, "majorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorNeighbourChordInversions = getValueOrDefault(a, "majorNeighbourChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.minorNeighbourChordRoots = getValueOrDefault(a, "minorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourChordInversions = getValueOrDefault(a, "minorNeighbourChordInversions", [
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1]
    ]);
    this.majorNeighbourSusChordRoots = getValueOrDefault(a, "majorNeighbourSusChordRoots", [0, 1, 4, 5]);
    this.minorNeighbourSusChordRoots = getValueOrDefault(a, "minorNeighbourSusChordRoots", [0, 2, 3]);
    this.majorNeighbourMixtureChordRoots = getValueOrDefault(a, "majorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourMixtureChordRoots = getValueOrDefault(a, "minorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.expansionRoots = getValueOrDefault(a, "expansionRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.expansionInversions = getValueOrDefault(a, "expansionInversions", [
        [1]
    ]);
    this.rootProgressionLikelihood = getValueOrDefault(a, "rootProgressionLikelihood", 1);
    this.rootProgressionCost = getValueOrDefault(a, "rootProgressionCost", 0);
    this.repeatRootLikelihood = getValueOrDefault(a, "repeatRootLikelihood", 0);
    this.repeatRootCost = getValueOrDefault(a, "repeatRootCost", 0);
    this.passingLikelihood = getValueOrDefault(a, "passingLikelihood", 1);
    this.passingCost = getValueOrDefault(a, "passingCost", 10);
    this.neighbourLikelihood = getValueOrDefault(a, "neighbourLikelihood", 1);
    this.neighbourCost = getValueOrDefault(a, "neighbourCost", 0);
    this.expansionLikelihood = getValueOrDefault(a, "expansionLikelihood", 1);
    this.expansionCost = getValueOrDefault(a, "expansionCost", 0);
    this.modulateLikelihoods = getValueOrDefault(a, "modulateLikelihoods", [0.2, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    this.modulateCosts = getValueOrDefault(a, "modulateCosts", [0]);
    this.neighbourSeventhLikelihoods = getValueOrDefault(a, "neighbourSeventhLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.neighbourTriadLikelihoods = getValueOrDefault(a, "neighbourTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.neighbourSeventhCosts = getValueOrDefault(a, "neighbourSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourTriadCosts = getValueOrDefault(a, "neighbourTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureSeventhLikelihoods = getValueOrDefault(a, "neighbourMixtureSeventhLikelihoods", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureTriadLikelihoods = getValueOrDefault(a, "neighbourMixtureTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.neighbourMixtureSeventhCosts = getValueOrDefault(a, "neighbourMixtureSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.neighbourMixtureTriadCosts = getValueOrDefault(a, "neighbourMixtureTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.mixtureSeventhLikelihoods = getValueOrDefault(a, "mixtureSeventhLikelihoods", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.mixtureTriadLikelihoods = getValueOrDefault(a, "mixtureTriadLikelihoods", [
        [1, 1, 1, 1, 1, 1, 1]
    ]);
    this.mixtureSeventhCosts = getValueOrDefault(a, "mixtureSeventhCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.mixtureTriadCosts = getValueOrDefault(a, "mixtureTriadCosts", [
        [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.majorAppliedChords = getValueOrDefault(a, "majorAppliedChords", [AppliedChordType.V6, AppliedChordType.V, AppliedChordType.V7, AppliedChordType.V65, AppliedChordType.V43, AppliedChordType.VII6]);
    this.majorAppliedChordLikelihoods = getValueOrDefault(a, "majorAppliedChordLikelihoods", [1, 1, 1, 1, 1, 1]);
    this.majorAppliedChordCosts = getValueOrDefault(a, "majorAppliedChordCosts", [0, 0, 0, 0, 0, 0]);
    this.minorAppliedChords = getValueOrDefault(a, "minorAppliedChords", [AppliedChordType.V6, AppliedChordType.V, AppliedChordType.V7, AppliedChordType.V65, AppliedChordType.V43, AppliedChordType.VII6]);
    this.minorAppliedChordLikelihoods = getValueOrDefault(a, "minorAppliedChordLikelihoods", [1, 1, 1, 1, 1, 1]);
    this.minorAppliedChordCosts = getValueOrDefault(a, "minorAppliedChordCosts", [0, 0, 0, 0, 0, 0]);
    this.addAllMovements = getValueOrDefault(a, "addAllMovements", true);
    this.addAllStarts = getValueOrDefault(a, "addAllStarts", true)
}
DynamicHarmonyGenerator.prototype = new HarmonyGenerator();
DynamicHarmonyGenerator.prototype.getMinorSimpleMixtureChords = function (a, g, f, e, d, c, b) { };
DynamicHarmonyGenerator.prototype.getMajorSimpleMixtureChords = function (p, F, q, D, t, a, u) {
    var m = p.getAbsoluteNoteFromScaleIndex(1) % 12;
    var d = p.getAbsoluteNoteFromScaleIndex(2) % 12;
    var E = p.getAbsoluteNoteFromScaleIndex(4) % 12;
    var B = p.getAbsoluteNoteFromScaleIndex(5) % 12;
    var e = p.isSus();
    var f = p.getChordPitchClasses();
    var C = p.getAbsoluteNoteFromChordBassIndex(0) % 12;
    var z = C == m;
    var y = C == d;
    var h = C == E;
    var g = C == B;
    var k = arrayContains(f, m);
    var j = arrayContains(f, d);
    var x = arrayContains(f, E);
    var w = arrayContains(f, B);
    var c = this.intoMixtureProgressionMovementLikelihoods;
    var A = this.intoMixtureProgressionMovementLikelihoods;
    var n = this.intoMixtureProgressionMovementCosts;
    var l = [];
    for (var v = 0; v < c.length; v++) {
        l.push(positiveMod(p.chordRoot + c[v], 7))
    }
    for (var v = 0; v < F.length; v++) {
        var b = F[v];
        var s = null;
        switch (b) {
            case MajorMixtureChordType.I:
                var r = 0;
                var o = p.chordRoot == r;
                if (!o) {
                    o = ((k && !z) || (j && !y)) && arrayContains(l, r)
                }
                if (o) {
                    s = p.copy();
                    s.scaleType = ScaleType.HARMONIC_MINOR;
                    s.chordType = ChordType.TRIAD;
                    s.chordInversions = 0;
                    s.chordRoot = 0
                }
                break;
            case MajorMixtureChordType.IV:
                var r = 3;
                var o = p.chordRoot == r;
                if (!o) {
                    o = ((k && !z) || (j && !y)) && arrayContains(l, r)
                }
                if (o) {
                    s = p.copy();
                    s.scaleType = ScaleType.HARMONIC_MINOR;
                    s.chordType = ChordType.TRIAD;
                    s.chordInversions = 0;
                    s.chordRoot = 3
                }
                break;
            case MajorMixtureChordType.VI:
                var r = 5;
                var o = p.chordRoot == r;
                if (!o) {
                    o = ((k && !z) || (j && !y)) && ((x && !h) || (w && !g)) && arrayContains(l, r)
                }
                if (o) {
                    s = p.copy();
                    s.scaleType = ScaleType.HARMONIC_MINOR;
                    s.chordType = ChordType.TRIAD;
                    s.chordInversions = 0;
                    s.chordRoot = 5
                }
                break
        }
        if (s) {
            t.push(s);
            a.push(q[v % q.length]);
            u.push(D[v % D.length])
        }
    }
};
DynamicHarmonyGenerator.prototype.getMajorOutOfSimpleMixtureChords = function (s, u, a, w) {
    var e = s.getAbsoluteNoteFromScaleIndex(2) % 12;
    var E = s.getAbsoluteNoteFromScaleIndex(5) % 12;
    var f = s.getChordPitchClasses();
    var I = f[0];
    var F = s.getAbsoluteNoteFromChordBassIndex(0) % 12;
    var D = F == e;
    var g = F == E;
    var m = arrayContains(f, e);
    var B = arrayContains(f, E);
    var q = [
        [0, -4, -2, 1, -1]
    ];
    var l = [
        [1, 1, 1, 1, 1]
    ];
    var c = [
        [0, 0, 0, 0, 0]
    ];
    var d = q[0];
    var A = l[0];
    var H = c[0];
    var z = [0, 1];
    var b = [0, 1, 2, 3, 4, 5];
    for (var y = 0; y < d.length; y++) {
        for (var x = 0; x < z.length; x++) {
            var r = true;
            var t = copyObjectDeep(s);
            t.scaleType = ScaleType.MAJOR;
            t.chordRoot = positiveMod(t.chordRoot + d[y], 7);
            t.chordInversions = z[x];
            if (!arrayContains(b, t.chordRoot)) {
                continue
            }
            var p = t.getAbsoluteNoteFromScaleIndex(1) % 12;
            var G = t.getAbsoluteNoteFromScaleIndex(4) % 12;
            var o = t.getAbsoluteNoteFromChordBassIndex(0) % 12;
            var k = p == o;
            var v = G == o;
            var h = t.getChordPitchClasses();
            if (m) {
                var n = arrayContains(h, p);
                r = r && n && ((!D && !k) || (D && k))
            }
            if (B) {
                var C = arrayContains(h, G);
                r = r && C && ((!g && !v) || (g && v))
            }
            if (r) {
                u.push(t);
                a.push(A[y]);
                w.push(H[y])
            } else { }
        }
    }
};
DynamicHarmonyGenerator.prototype.getMinorOutOfSimpleMixtureChords = function (a, d, c, b) { };
DynamicHarmonyGenerator.prototype.getStartStateIterator = function () {
    var t = [];
    var C = [];
    var p = [];
    var m = this.scaleType == ScaleType.NATURAL_MINOR;
    var n = m ? this.minorStartRoots : this.majorStartRoots;
    if (n.length == 0) {
        n = [0]
    }
    var c = m ? this.minorStartRootLikelihoods : this.majorStartRootLikelihoods;
    if (c.length == 0) {
        c = [1]
    }
    var h = m ? this.minorStartRootCosts : this.majorStartRootCosts;
    if (h.length == 0) {
        h = [1]
    }
    var w = m ? this.minorScaleSeventhLikelihoods : this.majorScaleSeventhLikelihoods;
    var v = m ? this.minorScaleTriadLikelihoods : this.majorScaleTriadLikelihoods;
    var H = m ? this.minorScaleSeventhCosts : this.majorScaleSeventhCosts;
    var B = m ? this.minorScaleTriadCosts : this.majorScaleTriadCosts;
    var f = [0, 0, 0, 0, 0, 0, 0];
    if (w.length > 0) {
        f = w[0]
    }
    var z = [1, 1, 1, 1, 1, 1, 1];
    if (v.length > 0) {
        z = v[0]
    }
    var k = [0, 0, 0, 0, 0, 0, 0];
    if (H.length > 0) {
        k = H[0]
    }
    var j = [0, 0, 0, 0, 0, 0, 0];
    if (B.length > 0) {
        j = B[0]
    }
    for (var F = 0; F < n.length; F++) {
        var D = n[F];
        var s = new ConstantHarmonyElement().setChordRoot(D);
        s.setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType);
        var G = f[D % f.length];
        var g = z[D % z.length];
        var r = k[D % k.length];
        var x = j[D % j.length];
        if (G > 0) {
            var l = new DynamicHarmonyState();
            l.mode = DynamicHarmonyMode.ROOT;
            l.harmony = copyObjectDeep(s);
            l.harmony.note = "D";
            l.harmony.chordType = ChordType.SEVENTH;
            t.push(l);
            C.push(c[F % c.length] * G);
            p.push(h[F % h.length] + r)
        }
        if (g > 0) {
            var l = new DynamicHarmonyState();
            l.mode = DynamicHarmonyMode.ROOT;
            l.harmony = copyObjectDeep(s);
            l.harmony.note = "D";
            l.harmony.chordType = ChordType.TRIAD;
            t.push(l);
            C.push(c[F % c.length] * g);
            p.push(h[F % h.length] + x)
        }
    }
    if (this.addAllStarts) {
        var A = this.majorProgressionRoots;
        if (m) {
            A = this.minorProgressionRoots
        }
        if (A.length == 0) {
            A = m ? [
                [0, 2, 3, 4, 5, 6]
            ] : [
                    [0, 1, 2, 3, 4, 5]
                ]
        }
        var b = 0.001;
        var J = 10;
        var a = 100;
        var y = new ConstantHarmonyElement().setChordRoot(0);
        y.setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType);
        for (var F = 0; F < 7; F++) {
            var l = new DynamicHarmonyState();
            if (!arrayContains(n, F)) {
                l.harmony = new ConstantHarmonyElement().setChordRoot(F);
                l.harmony.setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType);
                l.harmony.note = "d";
                l.mode = DynamicHarmonyMode.ROOT;
                t.push(l);
                var q = 1;
                var d = 1;
                if (!arrayContains(A[0], F)) {
                    d *= 10
                }
                C.push(b);
                p.push(J * d)
            }
        }
        if (this.modulate) {
            var m = this.scaleType == ScaleType.NATURAL_MINOR;
            var e = this.majorModulationPossibleEndRoots;
            if (m) {
                e = this.minorModulationPossibleEndRoots
            }
            var o = this.majorModulationTarget;
            if (m) {
                o = this.minorModulationTarget
            }
            var I = new ConstantHarmonyElement();
            I.setScaleType(DynamicHarmonyModulationTarget.getScaleType(this.scaleType, o, this.modulateInvertScaleType));
            var E = y.getAbsoluteNoteFromScaleIndex(o + 1);
            I.setBaseNote(E);
            for (var F = 0; F < e.length; F++) {
                var u = new DynamicHarmonyState();
                u.harmony = copyObjectDeep(I).setChordRoot(e[F]);
                u.harmony.note = "d, m";
                u.mode = DynamicHarmonyMode.ROOT_MODULATION;
                t.push(u);
                C.push(b);
                p.push(a)
            }
        }
    }
    return new RandomDfsStateIterator2(t, C, p, this.rnd)
};
DynamicHarmonyGenerator.prototype.isGoalState = function (f) {
    var g = f.harmony.scaleType == ScaleType.NATURAL_MINOR;
    switch (f.mode) {
        case DynamicHarmonyMode.ROOT_MODULATION:
        case DynamicHarmonyMode.NEIGHBOUR_MODULATION:
        case DynamicHarmonyMode.PASSING_MODULATION:
            var e = g ? this.minorModulationPossibleEndRoots : this.majorModulationPossibleEndRoots;
            var b = g ? this.minorModulationPossibleEndInversions : this.majorModulationPossibleEndInversions;
            if (f.harmony.isSus2()) {
                e = g ? this.minorModulationPossibleEndSus2Roots : this.majorModulationPossibleEndSus2Roots
            }
            if (f.harmony.isSus4()) {
                e = g ? this.minorModulationPossibleEndSus4Roots : this.majorModulationPossibleEndSus4Roots
            }
            if (e.length > 0) {
                var d = f.harmony.getAbsoluteNoteFromScaleIndex(f.harmony.getChordRootScaleIndex()) % 12;
                for (var c = 0; c < e.length; c++) {
                    var h = f.harmony.chordInversions;
                    var a = f.harmony.getAbsoluteNoteFromScaleIndex(e[c]) % 12;
                    if (a == d && arrayContains(b[c % b.length], h)) {
                        return true
                    }
                }
                return false
            }
            return false;
        case DynamicHarmonyMode.ROOT:
        case DynamicHarmonyMode.NEIGHBOUR:
        case DynamicHarmonyMode.PASSING:
            var e = g ? this.minorPossibleEndRoots : this.majorPossibleEndRoots;
            var b = g ? this.minorPossibleEndInversions : this.majorPossibleEndInversions;
            if (f.harmony.isSus2()) {
                e = g ? this.minorPossibleEndSus2Roots : this.majorPossibleEndSus2Roots
            }
            if (f.harmony.isSus4()) {
                e = g ? this.minorPossibleEndSus4Roots : this.majorPossibleEndSus4Roots
            }
            if (this.modulate) {
                return false
            }
            if (e.length > 0) {
                var d = f.harmony.getAbsoluteNoteFromScaleIndex(f.harmony.getChordRootScaleIndex()) % 12;
                for (var c = 0; c < e.length; c++) {
                    var h = f.harmony.chordInversions;
                    var a = f.harmony.getAbsoluteNoteFromScaleIndex(e[c]) % 12;
                    if (a == d && arrayContains(b[c % b.length], h)) {
                        return true
                    }
                }
                return false
            }
            return false;
        default:
            return false
    }
};
DynamicHarmonyGenerator.prototype.isInvalidState = function (a) {
    return false
};
DynamicHarmonyGenerator.prototype.getAppliedChordsAndLikelihoods = function (o, a, p, t, u, j, e, n, f) {
    var d = j == ScaleType.NATURAL_MINOR;
    var l = d ? this.minorAppliedChords : this.majorAppliedChords;
    var k = d ? this.minorAppliedChordLikelihoods : this.majorAppliedChordLikelihoods;
    var g = d ? this.minorAppliedChordCosts : this.majorAppliedChordCosts;
    var m = [];
    for (var r = 0; r < l.length; r++) {
        var c = l[r];
        switch (c) {
            case AppliedChordType.V:
                m.push({
                    root: 4,
                    inv: 0,
                    type: ChordType.TRIAD
                });
                break;
            case AppliedChordType.V6:
                m.push({
                    root: 4,
                    inv: 1,
                    type: ChordType.TRIAD
                });
                break;
            case AppliedChordType.V7:
                m.push({
                    root: 4,
                    inv: 0,
                    type: ChordType.SEVENTH
                });
                break;
            case AppliedChordType.V65:
                m.push({
                    root: 4,
                    inv: 1,
                    type: ChordType.SEVENTH
                });
                break;
            case AppliedChordType.V43:
                m.push({
                    root: 4,
                    inv: 2,
                    type: ChordType.SEVENTH
                });
                break;
            case AppliedChordType.VII:
                m.push({
                    root: 6,
                    inv: 0,
                    type: ChordType.TRIAD
                });
                break;
            case AppliedChordType.VII6:
                m.push({
                    root: 6,
                    inv: 1,
                    type: ChordType.TRIAD
                });
                break;
            default:
                console.log("Applied chord " + c + " not supported yet...");
                m.push({
                    root: 4,
                    inv: 0,
                    type: ChordType.TRIAD
                });
                break
        }
    }
    for (var r = 0; r < m.length; r++) {
        var s = m[r];
        var q = copyObjectDeep(o.state);
        var b = q.harmony;
        b.setBaseNote(u);
        b.setChordRoot(s.root);
        b.setChordType(s.type);
        b.setChordInversions(s.inv);
        b.setScaleType(j);
        q.harmony = b;
        q.harmony.note = "D, M";
        q.mode = DynamicHarmonyMode.ROOT_MODULATION;
        var h = b.getAbsoluteNoteFromChordRootIndex(0) % 12;
        var v = a.indexOf(h);
        if (v >= 0) {
            e.push(q);
            n.push(k[r % k.length] * p[v]);
            f.push(g[r % g.length] + t[v])
        }
    }
};
DynamicHarmonyGenerator.prototype.addChordState = function (a, l, f, c, d, n, e, b, m, k, j, h) {
    if (typeof (k) === "undefined") {
        k = ChordType.TRIAD
    }
    if (typeof (j) === "undefined") {
        j = 0
    }
    var g = a.copy();
    g.harmony.setChordRoot(positiveMod(l, d.length));
    m.push(g.harmony.getAbsoluteNoteFromChordRootIndex(0) % 12);
    g.harmony.setChordType(k);
    g.harmony.setChordInversions(j);
    g.harmony.note = h;
    e.push(f);
    b.push(c);
    n.push(g)
};
DynamicHarmonyGenerator.prototype.getNeighbourStatesAndLikelihoods = function (e, f, c, b) {
    var a = e.state.targetHarmony;
    var d = e.state.copy();
    d.harmony = copyObjectDeep(a);
    d.mode = e.state.mode == DynamicHarmonyMode.NEIGHBOUR ? DynamicHarmonyMode.ROOT : DynamicHarmonyMode.ROOT_MODULATION;
    f.push(d);
    c.push(1);
    b.push(0)
};
DynamicHarmonyGenerator.prototype.getMixtureStatesAndLikelihoods = function (c, j, g, l) {
    var k = c.state.harmony;
    var f = k.scaleType == ScaleType.MAJOR ? false : true;
    var e = [];
    var d = [];
    var a = [];
    if (f) {
        this.getMajorOutOfSimpleMixtureChords(k, e, d, a)
    } else {
        this.getMinorOutOfSimpleMixtureChords(k, e, d, a)
    }
    for (var h = 0; h < e.length; h++) {
        var b = c.state.copy();
        b.harmony = e[h];
        b.mode = c.state.mode == DynamicHarmonyMode.ROOT_MIXTURE ? DynamicHarmonyMode.ROOT : DynamicHarmonyMode.ROOT_MODULATION;
        b.harmony.note = "D" + (b.mode == DynamicHarmonyMode.ROOT ? "" : ", M");
        this.getChordsStuff(c.depth, b, 1, 0, this.mixtureSeventhLikelihoods, this.mixtureTriadLikelihoods, this.mixtureSeventhCosts, this.mixtureTriadCosts, j, g, l)
    }
};
DynamicHarmonyGenerator.prototype.getRootStatesAndLikelihoods = function (ai, av, ah, ag) {
    var aL = ai.state;
    var af = aL.mode;
    var R = (af == DynamicHarmonyMode.ROOT || af == DynamicHarmonyMode.ROOT_MODULATION);
    var I = af == DynamicHarmonyMode.ROOT;
    var q = af == DynamicHarmonyMode.ROOT_MODULATION;
    if (R && this.repeatRootLikelihood > 0) {
        av.push(ai.state.copy());
        ah.push(this.repeatRootLikelihood);
        ag.push(this.repeatRootCost)
    }
    var aE = ai.state.harmony;
    var O = aE.scaleType == ScaleType.NATURAL_MINOR;
    var ax = aE.getScale();
    var aN = [];
    if (this.expansionLikelihood > 0 && aE.chordInversions == 0) {
        var p = ai.state.copy();
        p.harmony.chordInversions = 1;
        p.harmony.note = "D, " + (I ? "E" : "ME");
        av.push(p);
        ah.push(this.expansionLikelihood);
        ag.push(this.expansionCost)
    }
    if (R && this.rootProgressionLikelihood > 0) {
        var s = [];
        var ap = [];
        var N = [];
        var C = aE.getChordRootScaleIndex();
        var aq = O ? this.minorProgressionRoots : this.majorProgressionRoots;
        var aj = O ? this.minorProgressionMovements : this.majorProgressionMovements;
        if (aj.length == 0) {
            aj = [
                [-4, -2, 1]
            ]
        }
        if (aq.length == 0) {
            aq = O ? [
                [0, 2, 3, 4, 5, 6]
            ] : [
                    [0, 1, 2, 3, 4, 5]
                ]
        }
        var aw = aj[ai.depth % aj.length];
        var Y = aq[ai.depth % aq.length];
        var X = O ? this.minorProgressionMovementLikelihoods : this.majorProgressionMovementLikelihoods;
        if (X.length == 0) {
            X = [
                [1]
            ]
        }
        var Z = O ? this.minorProgressionMovementCosts : this.majorProgressionMovementCosts;
        if (Z.length == 0) {
            Z = [
                [1]
            ]
        }
        var al = O ? this.minorScaleSeventhLikelihoods : this.majorScaleSeventhLikelihoods;
        var P = O ? this.minorScaleTriadLikelihoods : this.majorScaleTriadLikelihoods;
        var ad = O ? this.minorScaleSus2Likelihoods : this.majorScaleSus2Likelihoods;
        var x = O ? this.minorScaleSus4Likelihoods : this.majorScaleSus4Likelihoods;
        var y = O ? this.minorScaleSeventhCosts : this.majorScaleSeventhCosts;
        var b = O ? this.minorScaleTriadCosts : this.majorScaleTriadCosts;
        var f = O ? this.minorScaleSus2Costs : this.majorScaleSus2Costs;
        var g = O ? this.minorScaleSus4Costs : this.majorScaleSus4Costs;
        var e = [0, 0, 0, 0, 0, 0, 0];
        if (al.length > 0) {
            e = al[ai.depth % al.length]
        }
        var G = [1, 1, 1, 1, 1, 1, 1];
        if (P.length > 0) {
            G = P[ai.depth % P.length]
        }
        var Q = [1, 1, 1, 1, 1, 1, 1];
        if (ad.length > 0) {
            Q = ad[ai.depth % ad.length]
        }
        var aC = [1, 1, 1, 1, 1, 1, 1];
        if (x.length > 0) {
            aC = x[ai.depth % x.length]
        }
        var z = [0, 0, 0, 0, 0, 0, 0];
        if (y.length > 0) {
            z = y[ai.depth % y.length]
        }
        var F = [0, 0, 0, 0, 0, 0, 0];
        if (b.length > 0) {
            F = b[ai.depth % b.length]
        }
        var d = [0, 0, 0, 0, 0, 0, 0];
        if (f.length > 0) {
            d = f[ai.depth % f.length]
        }
        var K = [0, 0, 0, 0, 0, 0, 0];
        if (g.length > 0) {
            K = g[ai.depth % g.length]
        }
        for (var T = 0; T < aw.length; T++) {
            var ar = C + aw[T];
            var aD = positiveMod(ar, 7);
            if (arrayContains(Y, aD)) {
                var aa = X[ai.depth % X.length];
                var B = Z[ai.depth % Z.length];
                var a = aa[T % aa.length];
                var az = B[T % B.length];
                var aI = e[aD % e.length];
                var A = G[aD % G.length];
                var M = Q[aD % Q.length];
                var n = aC[aD % aC.length];
                if (aI > 0) {
                    var m = z[aD % z.length];
                    this.addChordState(ai.state, C + aw[T], a * aI, az + m, ax, N, s, ap, aN, ChordType.SEVENTH, 0, I ? "D" : "D, M")
                }
                if (A > 0) {
                    var r = F[aD % F.length];
                    this.addChordState(ai.state, C + aw[T], a * A, az + r, ax, N, s, ap, aN, ChordType.TRIAD, 0, I ? "D" : "D, M")
                }
                if (this.useSus2 && M > 0) {
                    var H = d[aD % d.length];
                    this.addChordState(ai.state, C + aw[T], a * M, az + H, ax, N, s, ap, aN, ChordType.SUS2, 0, I ? "D" : "D, M")
                }
                if (this.useSus4 && n > 0) {
                    var aA = K[aD % K.length];
                    this.addChordState(ai.state, C + aw[T], a * n, az + aA, ax, N, s, ap, aN, ChordType.SUS4, 0, I ? "D" : "D, M")
                }
            } else { }
        }
        if (this.addAllMovements) {
            var an = [0, 1, 2, 3, 4, 5, 6];
            var t = [ai.state.mode];
            if (this.modulate && ai.state.mode != DynamicHarmonyMode.ROOT_MODULATION) {
                t.push(DynamicHarmonyMode.ROOT_MODULATION)
            }
            var aG = ai.state.mode;
            for (var T = 0; T < an.length; T++) {
                for (var S = 0; S < t.length; S++) {
                    var aL = ai.state.copy();
                    aL.mode = t[S];
                    if (aL.mode == DynamicHarmonyMode.ROOT_MODULATION) {
                        var am = this.majorModulationTarget;
                        if (O) {
                            am = this.minorModulationTarget
                        }
                        if (aG != DynamicHarmonyMode.ROOT_MODULATION) {
                            var w = aL.harmony.getAbsoluteNoteFromScaleIndex(am + 1);
                            aL.harmony.setBaseNote(w);
                            aL.harmony.note = "d, m";
                            aL.harmony.setScaleType(DynamicHarmonyModulationTarget.getScaleType(this.scaleType, am, this.modulateInvertScaleType))
                        }
                        this.addChordState(aL, C + an[T], 0.00001, 100, ax, N, s, ap, [], ChordType.TRIAD, 0, "d, m")
                    } else {
                        this.addChordState(aL, C + an[T], 0.0001, 100, ax, N, s, ap, [], ChordType.TRIAD, 0, "d")
                    }
                }
            }
        }
        if (s.length > 0) {
            for (var T = 0; T < s.length; T++) {
                av.push(N[T]);
                ah.push(this.rootProgressionLikelihood * s[T]);
                ag.push(this.rootProgressionCost + ap[T])
            }
        }
    }
    var o = this.modulateLikelihoods[ai.depth % this.modulateLikelihoods.length];
    var ao = this.modulateCosts[ai.depth % this.modulateCosts.length];
    if (I && this.modulate && o > 0) {
        var au = [];
        var ay = [];
        var k = [];
        var aH = this.intoAppliedProgressionMovements[ai.depth % this.intoAppliedProgressionMovements.length];
        var ak = this.intoAppliedProgressionMovementLikelihoods[ai.depth % this.intoAppliedProgressionMovementLikelihoods.length];
        var U = this.intoAppliedProgressionMovementCosts[ai.depth % this.intoAppliedProgressionMovementCosts.length];
        var C = aE.getChordRootScaleIndex();
        var ae = [];
        for (var T = 0; T < aH.length; T++) {
            var ar = C + aH[T];
            var aD = positiveMod(ar, 7);
            ae.push(aE.getAbsoluteNoteFromScaleIndex(aD) % 12)
        }
        var h = aE.getAbsoluteNoteFromScaleIndex(C) % 12;
        var am = this.majorModulationTarget;
        if (O) {
            am = this.minorModulationTarget
        }
        var u = ax[am + 1];
        var D = DynamicHarmonyModulationTarget.getScaleType(ai.state.harmony.scaleType, am, this.modulateInvertScaleType);
        this.getAppliedChordsAndLikelihoods(ai, ae, ak, U, aE.baseNote + u, D, au, ay, k);
        if (ay.length > 0) {
            for (var T = 0; T < ay.length; T++) {
                av.push(au[T]);
                ah.push(o * ay[T]);
                ag.push(ao + k[T])
            }
        } else { }
    }
    if (this.neighbourLikelihood > 0 && aE.chordInversions == 0) {
        var V = [];
        var B = [];
        var L = [];
        var aB = ai.depth;
        var aM = O ? this.minorNeighbourChordRoots : this.majorNeighbourChordRoots;
        var aK = O ? this.minorNeighbourChordInversions : this.majorNeighbourChordInversions;
        var v = O ? this.minorNeighbourSusChordRoots : this.majorNeighbourSusChordRoots;
        var ab = O ? this.minorNeighbourMixtureChordRoots : this.majorNeighbourMixtureChordRoots;
        if (!this.mixture) {
            ab = []
        }
        var aF = this.getBassNeighbourChords(aE, aM, aK, v, ab);
        for (var T = 0; T < aF.length; T++) {
            L.push(aF[T]);
            V.push(1);
            B.push(0)
        }
        for (var T = 0; T < L.length; T++) {
            var aJ = this.neighbourSeventhLikelihoods;
            var l = this.neighbourTriadLikelihoods;
            var W = this.neighbourSeventhCosts;
            var ac = this.neighbourTriadCosts;
            var aL = new DynamicHarmonyState();
            aL.harmony = L[T];
            aL.harmony.note = "D, N" + (I ? "" : "M");
            var c = this.neighbourLikelihood;
            if (aE.scaleType != aL.harmony.scaleType) {
                aL.harmony.note += "X";
                c *= this.simpleMixtureLikelihood;
                aJ = this.neighbourMixtureSeventhLikelihoods;
                l = this.neighbourMixtureTriadLikelihoods;
                W = this.neighbourMixtureSeventhCosts;
                ac = this.neighbourMixtureTriadCosts
            }
            aL.mode = I ? DynamicHarmonyMode.NEIGHBOUR : DynamicHarmonyMode.NEIGHBOUR_MODULATION;
            aL.targetHarmony = copyObjectDeep(aE);
            this.getChordsStuff(aB, aL, c, this.neighbourCost, aJ, l, W, W, av, ah, ag)
        }
    }
    if (R && this.mixture) {
        var aB = ai.depth;
        var E = [];
        var at = [];
        var J = [];
        if (O) {
            this.getMinorSimpleMixtureChords(aE, this.minorMixtureChordTypes, this.minorMixtureChordTypeLikelihoods, this.minorMixtureChordTypeCosts, E, at, J)
        } else {
            this.getMajorSimpleMixtureChords(aE, this.majorMixtureChordTypes, this.majorMixtureChordTypeLikelihoods, this.majorMixtureChordTypeCosts, E, at, J)
        }
        for (var T = 0; T < E.length; T++) {
            var aL = new DynamicHarmonyState();
            aL.harmony = E[T];
            aL.harmony.note = "D, X" + (I ? "" : "M");
            aL.mode = I ? DynamicHarmonyMode.ROOT_MIXTURE : DynamicHarmonyMode.ROOT_MIXTURE_MODULATION;
            aL.targetHarmony = copyObjectDeep(aE);
            this.getChordsStuff(aB, aL, this.simpleMixtureLikelihood * at[T], J[T], this.mixtureSeventhLikelihoods, this.mixtureTriadLikelihoods, this.mixtureSeventhCosts, this.mixtureTriadCosts, av, ah, ag)
        }
    }
};
DynamicHarmonyGenerator.prototype.getSuccessorIterator = function (d) {
    var e = d.state;
    var b = [];
    var a = [];
    var f = [];
    var c = this.count - d.depth - 2;
    switch (e.mode) {
        case DynamicHarmonyMode.ROOT:
        case DynamicHarmonyMode.ROOT_MODULATION:
            this.getRootStatesAndLikelihoods(d, b, a, f);
            break;
        case DynamicHarmonyMode.PASSING:
        case DynamicHarmonyMode.PASSING_MODULATION:
            break;
        case DynamicHarmonyMode.NEIGHBOUR:
        case DynamicHarmonyMode.NEIGHBOUR_MODULATION:
            this.getNeighbourStatesAndLikelihoods(d, b, a, f);
            break;
        case DynamicHarmonyMode.ROOT_MIXTURE:
        case DynamicHarmonyMode.ROOT_MIXTURE_MODULATION:
            this.getMixtureStatesAndLikelihoods(d, b, a, f);
            break
    }
    this.calculateBeatStrengthRepetitionCosts(d, b, a, f);
    this.calculateSeventhToTriadCosts(d, b, a, f);
    this.calculateSusCosts(d, b, a, f, this.sus2Likelihood, this.sus4Likelihood);
    return new RandomDfsStateIterator2(b, a, f, this.rnd)
};

function ChromaticTransitionHarmonyState() {
    this.harmony = null;
    this.stepCost = 0;
    this._constructorName = "ChromaticTransitionHarmonyState"
}
ChromaticTransitionHarmonyState.prototype.copy = function () {
    return copyObjectDeep(this)
};

function ChromaticTransitionHarmonyGenerator(a) {
    HarmonyGenerator.call(this, a);
    this.scaleBaseNote = getValueOrDefault(a, "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(a, "scaleType", ScaleType.MAJOR);
    this.scaleBaseChordRootScaleModeTuples = getValueOrDefault(a, "scaleBaseChordRootScaleModeTuples", [
        [this.scaleBaseNote, 0, 0]
    ]);
    this.endScaleBaseChordRootScaleModeTuples = getValueOrDefault(a, "endScaleBaseChordRootScaleModeTuples", [
        [this.scaleBaseNote, 0, 0]
    ]);
    this.chordRootChangeCost = getValueOrDefault(a, "chordRootChangeCost", 0);
    this.scaleBaseChangeCost = getValueOrDefault(a, "scaleBaseChangeCost", 0);
    this.scaleModeChangeCost = getValueOrDefault(a, "scaleModeChangeCost", 0);
    this.noChangeCost = getValueOrDefault(a, "noChangeCost", 3);
    this.toMuchChangeCost = getValueOrDefault(a, "toMuchChangeCost", 5);
    this._constructorName = "ChromaticTransitionHarmonyGenerator"
}
ChromaticTransitionHarmonyGenerator.prototype = new HarmonyGenerator();
ChromaticTransitionHarmonyGenerator.prototype.addTuple = function (c, b, h, a, f, e) {
    var d = new ConstantHarmonyElement();
    d.scaleType = this.scaleType;
    d.baseNote = c[0];
    d.chordRoot = c[1];
    d.scaleMode = c[2];
    var g = new ChromaticTransitionHarmonyState();
    g.harmony = d;
    a.push(g);
    f.push(b);
    e.push(h)
};
ChromaticTransitionHarmonyGenerator.prototype.getStartStateIterator = function () {
    var b = [];
    var e = [];
    var d = [];
    for (var c = 0; c < this.scaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.scaleBaseChordRootScaleModeTuples[c];
        this.addTuple(a, 1, 0, b, e, d)
    }
    for (var c = 0; c < this.endScaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.endScaleBaseChordRootScaleModeTuples[c];
        this.addTuple(a, 0.1, 1000, b, e, d)
    }
    return new RandomDfsStateIterator2(b, e, d, this.rnd)
};
ChromaticTransitionHarmonyGenerator.prototype.isGoalState = function (d) {
    var b = d.harmony;
    for (var c = 0; c < this.endScaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.endScaleBaseChordRootScaleModeTuples[c];
        if ((a[0] % 12) == (b.baseNote % 12) && (a[1] % 7) == (b.chordRoot % 12) && (a[2] % 7) == (b.scaleMode % 7)) {
            return true
        }
    }
    return false
};
ChromaticTransitionHarmonyGenerator.prototype.isInvalidState = function (a) {
    return false
};
ChromaticTransitionHarmonyGenerator.prototype.getSuccessors = function (f, g, s, h) {
    var C = [0, 1, 2, 3, 4, 5, 6];
    var o = [1, 1, 1, 1, 1, 1, 1];
    var z = [0, 0, 0, 0, 0, 0, 0];
    var c = [0, 1, 2, 3, 4, 5, 6];
    var k = [1, 1, 1, 1, 1, 1, 1];
    var p = [0, 0, 0, 0, 0, 0, 0];
    var t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var w = [1, 0.25, 0.25, 1, 1, 1, 0.1, 1, 1, 1, 0.25, 0.25];
    var l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var y = 0; y < this.endScaleBaseChordRootScaleModeTuples.length; y++) {
        var q = this.endScaleBaseChordRootScaleModeTuples[y];
        this.addTuple(q, 0.1, 1000, g, s, h)
    }
    var e = 1;
    var B = 0;

    function d(j, E, D) {
        e *= E[j % E.length];
        B += D[j % D.length]
    }
    for (var y = 0; y < C.length; y++) {
        var m = C[y];
        for (var v = 0; v < c.length; v++) {
            var u = c[v];
            var a = f.copy();
            var n = a.harmony;
            var A = n.chordRoot;
            var r = n.scaleMode;
            n.chordRoot = positiveMod(n.chordRoot + m, 7);
            n.scaleMode = positiveMod(n.scaleMode + u, 7);
            g.push(a);
            e = 1;
            B = 0;
            d(m, o, z);
            d(u, k, p);
            if (m == 0 && u == 0) {
                e *= 0.25;
                B += this.noChangeCost
            } else {
                if (m != 0 && u != 0) {
                    e *= 0.25 * (1 / 42);
                    B += this.toMuchChangeCost
                }
            }
            if (m != 0) {
                B += this.chordRootChangeCost;
                if (this.chordRootChangeCost > 0.1) {
                    e *= 0.01
                }
            }
            if (u != 0) {
                B += this.scaleModeChangeCost;
                if (this.scaleModeChangeCost > 0.1) {
                    e *= 0.01
                }
            }
            s.push(e);
            h.push(B)
        }
        for (var v = 0; v < t.length; v++) {
            var x = t[v];
            var a = f.copy();
            var n = a.harmony;
            var A = n.chordRoot;
            var b = n.baseNote;
            n.chordRoot = positiveMod(n.chordRoot + m, 7);
            n.baseNote = ((n.baseNote + x) % 12) + 60;
            g.push(a);
            e = 1;
            B = 0;
            d(m, o, z);
            d(x, w, l);
            if (m == 0 && x == 0) {
                e *= 0.25;
                B += this.noChangeCost
            } else {
                if (m != 0 && x != 0) {
                    e *= 0.25 / (7 * 11);
                    B += this.toMuchChangeCost
                }
            }
            if (m != 0) {
                B += this.chordRootChangeCost;
                if (this.chordRootChangeCost > 0.1) {
                    e *= 0.01
                }
            }
            if (x != 0) {
                B += this.scaleBaseChangeCost;
                if (this.scaleBaseChangeCost > 0.1) {
                    e *= 0.01
                }
            }
            s.push(e);
            h.push(B)
        }
    }
};
ChromaticTransitionHarmonyGenerator.prototype.getSuccessorIterator = function (c) {
    var d = c.state;
    var b = [];
    var a = [];
    var e = [];
    this.getSuccessors(d, b, a, e);
    return new RandomDfsStateIterator2(b, a, e, this.rnd)
};

function ChromaticOscillationHarmonyState() {
    this.harmony = null;
    this.stepCost = 0;
    this.mode = 0;
    this._constructorName = "ChromaticOscillationHarmonyState"
}
ChromaticOscillationHarmonyState.prototype.copy = function () {
    return copyObjectDeep(this)
};

function ChromaticOscillationHarmonyGenerator(a) {
    HarmonyGenerator.call(this, a);
    this.scaleBaseNote = getValueOrDefault(a, "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(a, "scaleType", ScaleType.MAJOR);
    this.startScaleBaseChordRootScaleModeTuples = getValueOrDefault(a, "startScaleBaseChordRootScaleModeTuples", [
        [this.scaleBaseNote, 0, 0]
    ]);
    this.endScaleBaseChordRootScaleModeTuples = getValueOrDefault(a, "endScaleBaseChordRootScaleModeTuples", [
        [this.scaleBaseNote, 0, 0]
    ]);
    this._constructorName = "ChromaticOscillationHarmonyGenerator"
}
ChromaticOscillationHarmonyGenerator.prototype = new HarmonyGenerator();
ChromaticOscillationHarmonyGenerator.prototype.addTuple = function (h, e, c, g, j, d, b) {
    var f = new ConstantHarmonyElement();
    f.scaleType = this.scaleType;
    f.baseNote = h[0];
    f.chordRoot = h[1];
    f.scaleMode = h[2];
    var a = new ChromaticOscillationHarmonyState();
    a.harmony = f;
    a.mode = g;
    j.push(a);
    d.push(e);
    b.push(c)
};
ChromaticOscillationHarmonyGenerator.prototype.getStartStates = function (b, e, d) {
    for (var c = 0; c < this.startScaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.startScaleBaseChordRootScaleModeTuples[c];
        this.addTuple(a, 1, 0, 0, b, e, d)
    }
    for (var c = 0; c < this.endScaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.endScaleBaseChordRootScaleModeTuples[c];
        this.addTuple(a, 0.1, 1000, 0, b, e, d)
    }
};
ChromaticOscillationHarmonyGenerator.prototype.getStartStateIterator = function () {
    var a = [];
    var c = [];
    var b = [];
    this.getStartStates(a, c, b);
    return new RandomDfsStateIterator2(a, c, b, this.rnd)
};
ChromaticOscillationHarmonyGenerator.prototype.isGoalState = function (d) {
    var b = d.harmony;
    for (var c = 0; c < this.endScaleBaseChordRootScaleModeTuples.length; c++) {
        var a = this.endScaleBaseChordRootScaleModeTuples[c];
        if ((a[0] % 12) == (b.baseNote % 12) && (a[1] % 7) == (b.chordRoot % 12) && (a[2] % 7) == (b.scaleMode % 7)) {
            return true
        }
    }
    return false
};
ChromaticOscillationHarmonyGenerator.prototype.isInvalidState = function (a) {
    return false
};
ChromaticOscillationHarmonyGenerator.prototype.getSuccessors = function (f, g, s, h) {
    switch (f.mode) {
        case 1:
            return this.getStartStates(g, s, h);
        default:
            break
    }
    var C = [0, 1, 2, 3, 4, 5, 6];
    var o = [1, 1, 1, 1, 1, 1, 1];
    var z = [0, 0, 0, 0, 0, 0, 0];
    var c = [1, 2, 3, 4, 5, 6];
    var k = [1, 1, 1, 1, 1, 1];
    var p = [0, 0, 0, 0, 0, 0];
    var t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var w = [0.25, 0.25, 1, 1, 1, 0.1, 1, 1, 1, 0.25, 0.25];
    var l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var y = 0; y < this.endScaleBaseChordRootScaleModeTuples.length; y++) {
        var q = this.endScaleBaseChordRootScaleModeTuples[y];
        this.addTuple(q, 0.0001, 1000, 0, g, s, h)
    }
    var e = 1;
    var B = 0;

    function d(j, E, D) {
        e *= E[j % E.length];
        B += D[j % D.length]
    }
    var m = 0;
    for (var v = 0; v < c.length; v++) {
        var u = c[v];
        var a = f.copy();
        var n = a.harmony;
        var A = n.chordRoot;
        var r = n.scaleMode;
        n.chordRoot = positiveMod(n.chordRoot + m, 7);
        n.scaleMode = positiveMod(n.scaleMode + u, 7);
        a.mode = (m == 0 && u == 0) ? 0 : 1;
        n.note = "mode " + a.mode + " rp: " + m + " mp: " + u;
        g.push(a);
        e = 1;
        B = 0;
        d(m, o, z);
        d(u, k, p);
        if (m == 0 && u == 0) {
            e *= 0.001;
            B += 10
        } else {
            if (m != 0 && u != 0) {
                e *= 0.001 * (1 / 42);
                B += 20
            }
        }
        s.push(e);
        h.push(B)
    }
    for (var v = 0; v < t.length; v++) {
        var x = t[v];
        var a = f.copy();
        var n = a.harmony;
        var A = n.chordRoot;
        var b = n.baseNote;
        n.chordRoot = positiveMod(n.chordRoot + m, 7);
        n.baseNote = ((n.baseNote + x) % 12) + 60;
        a.mode = (m == 0 && x == 0) ? 0 : 1;
        n.note = "mode " + a.mode + " rp: " + m + " sp: " + x;
        g.push(a);
        e = 1;
        B = 0;
        d(m, o, z);
        d(x, w, l);
        if (m == 0 && x == 0) {
            e *= 0.001;
            B += 10
        } else {
            if (m != 0 && x != 0) {
                e *= 0.001 / (7 * 11);
                B += 20
            }
        }
        s.push(e);
        h.push(B)
    }
};
ChromaticOscillationHarmonyGenerator.prototype.getSuccessorIterator = function (c) {
    var d = c.state;
    var b = [];
    var a = [];
    var e = [];
    this.getSuccessors(d, b, a, e);
    return new RandomDfsStateIterator2(b, a, e, this.rnd)
};

function DominantHarmonyGenerator(a) {
    a.baseRoot = 4;
    a.auxiliaryChordRoots = [0];
    a.auxiliaryChordRootLikelihoods = [1];
    StaticHarmonyGenerator.call(this, a)
}
DominantHarmonyGenerator.prototype = new StaticHarmonyGenerator();

function TonicCadenceHarmonyGenerator(a) {
    StaticHarmonyGenerator.call(this, a)
}
TonicCadenceHarmonyGenerator.prototype = new StaticHarmonyGenerator();

function SuspAntStrategy() {
    this.id = "";
    this.voiceLines = [];
    this._constructorName = "SuspAntStrategy"
}
SuspAntStrategy.prototype.getNewLengthsSuspend = function (d, c, b, a) {
    var f = d;
    var e = c;
    return [f, e]
};
SuspAntStrategy.prototype.getNewLengthsAnticipate = function (d, c, b, a) {
    return this.getNewLengthsSuspend(d, c, b, a)
};
SuspAntStrategy.prototype.changeLengths = function (g, f, e, d) {
    var a = d.get(g);
    var b = d.get(f);
    var j = a.getBeatLength();
    var h = b.getBeatLength();
    var c = [];
    if (e) {
        c = this.getNewLengthsSuspend(j, h, d, 0)
    } else {
        c = this.getNewLengthsAnticipate(j, h, d, 0)
    }
    a.length = c[0];
    a.lengthUnit = PositionUnit.BEATS;
    b.length = c[1];
    b.lengthUnit = PositionUnit.BEATS
};
SuspAntStrategy.prototype.createVoiceLineHarmony = function (e, a, c) {
    for (var b = 0; b < e.size(); b++) {
        var d = e.get(b);
        if (d.suspend) {
            a = this.suspend(b, a, c)
        } else {
            if (d.anticipate) {
                a = this.anticipate(b, a, c)
            }
        }
    }
    return a
};
SuspAntStrategy.prototype.suspend = function (c, b, d) {
    var a = b;
    if (c < a.getCount() - 1) {
        a = copyValueDeep(a);
        this.changeLengths(c, c + 1, true, a)
    }
    return a
};
SuspAntStrategy.prototype.anticipate = function (c, b, d) {
    var a = b;
    if (c > 0) {
        a = copyValueDeep(a);
        this.changeLengths(c, c - 1, false, a)
    }
    return a
};

function SimpleSuspAntStrategy() {
    SuspAntStrategy.call(this);
    this.possibleLengthIncrements = [1];
    this.possibleLengthIncrementUnit = PositionUnit.BEATS;
    this.possibleNewLengths = [1, 2, 3, 4, 6, 8];
    this.minLength = 1;
    this.minLengthUnit = PositionUnit.BEATS;
    this._constructorName = "SimpleSuspAntStrategy"
}
SimpleSuspAntStrategy.prototype = new SuspAntStrategy();
SimpleSuspAntStrategy.prototype.getNewLengthsSuspend = function (d, e, h, c) {
    var a = d;
    var f = e;
    var b = positionUnitToBeats2(this.minLength, this.minLengthUnit, c, h);
    for (var g = 0; g < this.possibleLengthIncrements.length; g++) {
        var k = this.possibleLengthIncrements[g];
        var j = positionUnitToBeats2(k, this.possibleLengthIncrementUnit, c, h);
        if (!arrayContains(this.possibleNewLengths, e - j)) {
            continue
        }
        if (!arrayContains(this.possibleNewLengths, d + j)) {
            continue
        }
        if (e - j >= b) {
            f -= j;
            a += j;
            break
        }
    }
    return [a, f]
};

function VoiceLineSearchNode(b, c, a) {
    this.state = b;
    this.searchDepth = c;
    this.resultIndex = a;
    this.totalCost = 0
}

function VoiceLineGenerator(a) {
    this.reusables = getValueOrDefault(a, "reusables", {});
    this.maxSearchDepth = getValueOrDefault(a, "maxSearchDepth", 3);
    this.maxSearchSteps = getValueOrDefault(a, "maxSearchSteps", 2000);
    this.harmony = getValueOrDefault(a, "harmony", new ConstantHarmonicRythm([new ConstantHarmonyElement().setChordRoot(0)]));
    this.checkParallelOctavesAndUnisons = getValueOrDefault(a, "checkParallelOctavesAndUnisons", true);
    this.parallelOctavesAndUnisonsPenalty = getValueOrDefault(a, "parallelOctavesAndUnisonsPenalty", 10);
    this.checkParallelFifths = getValueOrDefault(a, "checkParallelFifths", true);
    this.parallelFifthsPenalty = getValueOrDefault(a, "parallelFifthsPenalty", 10);
    this.checkLargeLeapReverseDirection = getValueOrDefault(a, "checkLargeLeapReverseDirection", true);
    this.largeLeapReverseDirectionPenaltyFactor = getValueOrDefault(a, "largeLeapReverseDirectionPenaltyFactor", 1);
    this.checkLeadingToneDoubling = getValueOrDefault(a, "checkLeadingToneDoubling", true);
    this.leadingToneDoublingPenalty = getValueOrDefault(a, "leadingToneDoubling", 5);
    this.bestSolutionCost = 99999999;
    this.resultStates = [];
    this.searchSteps = 0
}
VoiceLineGenerator.prototype.getlargeLeapToPitchClassPenaltyCount = function (d, b, c, a) {
    if ((b % 12) == a) {
        return this.getlargeLeapPenaltyCount(d, b, c)
    } else {
        return 0
    }
};
VoiceLineGenerator.prototype.getLeapRangeFromPitchClassPenaltyCount = function (e, c, b, d, a) {
    if ((e % 12) == a) {
        return this.getLeapRangePenaltyCount(e, c, b, d)
    } else {
        return 0
    }
};
VoiceLineGenerator.prototype.getlargeLeapPenaltyCount = function (d, a, c) {
    var b = Math.abs(d - a);
    if (b > c) {
        return b - c
    } else {
        return 0
    }
};
VoiceLineGenerator.prototype.getLeapRangePenaltyCount = function (e, b, a, d) {
    var c = b - e;
    if (c < a) {
        return a - c
    } else {
        if (c > d) {
            return c - d
        }
    }
    return 0
};
VoiceLineGenerator.prototype.getlargeLeapReverseDirectionPenaltyCount = function (d, f, a) {
    var c = f - d;
    var e = a - f;
    if (c < 0) {
        c = -c;
        e = -e
    }
    var b = 0;
    if (c < 5) { } else {
        if (c < 8) {
            if (e > 4) {
                b += (e - 4)
            }
            if (e < -4) {
                b += (-e - 4)
            }
        } else {
            if (e > -1) {
                b += (e + 1)
            }
            if (e < -4) {
                b += (-e - 4)
            }
        }
    }
    return b
};
VoiceLineGenerator.prototype.isParallelWithMod = function (b, h, a, g, f) {
    if (b == h || a == g) {
        return false
    }
    var e = b - a;
    var d = Math.abs(e);
    if ((d % 12) == f) {
        var j = h - g;
        var c = Math.abs(j);
        if ((c % 12) == f) {
            return true
        }
    }
};
VoiceLineGenerator.prototype.isParallelOctavesOrUnisons = function (b, d, a, c) {
    return this.isParallelWithMod(b, d, a, c, 0)
};
VoiceLineGenerator.prototype.isParallelPerfectFifths = function (b, d, a, c) {
    return this.isParallelWithMod(b, d, a, c, 7)
};
VoiceLineGenerator.prototype.searchRecursive = function (d) {
    var h = d.searchDepth + d.resultIndex;
    if (d.searchDepth >= this.maxSearchDepth || h >= this.harmony.getCount()) {
        this.bestSolutionCost = Math.min(d.totalCost, this.bestSolutionCost);
        return d
    }
    var f = 99999999;
    var k = null;
    var c = null;
    var l = this.getStates(d);
    for (var g = 0; g < l.length; g++) {
        this.searchSteps++;
        if (this.searchSteps > this.maxSearchSteps) {
            return k
        }
        var e = l[g];
        var j = new VoiceLineSearchNode(e, d.searchDepth + 1, d.resultIndex);
        var b = this.getStepCost(j);
        var a = b + d.totalCost;
        if (a < this.bestSolutionCost) {
            j.totalCost = a;
            this.resultStates[h] = e;
            var m = this.searchRecursive(j);
            if (m && m.totalCost < f) {
                f = m.totalCost;
                k = m;
                c = e
            }
        }
    }
    this.resultStates[h] = c;
    return k
};
VoiceLineGenerator.prototype.search = function () {
    var n = [];
    this.bestSolutionCost = 99999999;
    this.resultStates = [];
    this.prepareBeforeSearch();
    var g = this.harmony.getConstantHarmonyElements();
    var b = 0;
    var m = 0;
    var d = [];
    for (var f = 0; f < g.length; f++) {
        this.bestSolutionCost = 99999999;
        this.searchSteps = 0;
        var h = this.createInitialState();
        var c = new VoiceLineSearchNode(h, 0, f);
        var k = this.searchRecursive(c);
        if (k) {
            var a = this.resultStates[f];
            var l = this.extractSolution(a, f);
            for (var e = 0; e < l.length; e++) {
                if (e >= n.length) {
                    n[e] = new ConstantVoiceLine()
                }
                n[e].addVoiceLineElement(l[e])
            }
        } else {
            this.failReason = "Failed to find solution";
            return null
        }
        b += this.searchSteps;
        m += this.bestSolutionCost;
        d.push(this.searchSteps)
    }
    return n
};

function ClassicalVoiceLineState() {
    this.stateIndex = 0
}
ClassicalVoiceLineState.prototype.copy = function () {
    var a = new ClassicalVoiceLineState();
    a.stateIndex = this.stateIndex;
    return a
};

function ClassicalVoiceLineGenerator(a) {
    VoiceLineGenerator.call(this, a);
    this.voiceCount = getValueOrDefault(a, "voiceCount", 4);
    this.maxDomainSize = getValueOrDefault(a, "maxDomainSize", 100);
    this.constraints = getValueOrDefault(a, "constraints", []);
    this.constants = getValueOrDefault(a, "constants", [
        [false],
        [false],
        [false],
        [false]
    ]);
    this.undefines = getValueOrDefault(a, "undefines", [
        [false],
        [false],
        [false],
        [false]
    ]);
    this.anticipations = getValueOrDefault(a, "anticipations", [
        [false],
        [false],
        [false],
        [false]
    ]);
    this.suspensions = getValueOrDefault(a, "suspensions", [
        [false],
        [false],
        [false],
        [false]
    ]);
    this.absoluteNoteRanges = getValueOrDefault(a, "absoluteNoteRanges", [
        [
            [65, 85]
        ],
        [
            [50, 75]
        ],
        [
            [40, 70]
        ],
        [
            [35, 60]
        ]
    ]);
    this.penaltyAbsoluteNoteRanges = getValueOrDefault(a, "penaltyAbsoluteNoteRanges", [
        [
            [65, 85]
        ],
        [
            [50, 75]
        ],
        [
            [40, 70]
        ],
        [
            [35, 60]
        ]
    ]);
    this.noteRangePenalties = getValueOrDefault(a, "noteRangePenalties", [
        [0.5],
        [0.5],
        [0.5],
        [0.5]
    ]);
    this.absoluteNoteHints = getValueOrDefault(a, "absoluteNoteHints", [
        [70], null, null, [40]
    ]);
    this.maxAbsoluteHintDistances = getValueOrDefault(a, "maxAbsoluteHintDistances", [
        [6], null, null, [10]
    ]);
    this.penaltyMaxAbsoluteHintDistances = getValueOrDefault(a, "penaltyMaxAbsoluteHintDistances", [
        [3], null, null, [3]
    ]);
    this.hintDistancePenalties = getValueOrDefault(a, "hintDistancePenalties", [
        [0.5],
        [0.5],
        [0.5],
        [0.5]
    ]);
    this.chordRootPitchClassConstraints = getValueOrDefault(a, "chordRootPitchClassConstraints", [null, null, null, null]);
    this.chordBassPitchClassConstraints = getValueOrDefault(a, "chordBassPitchClassConstraints", [null, null, null, [
        [0]
    ]]);
    this.maxSpacings = getValueOrDefault(a, "maxSpacings", [
        [12],
        [12],
        [12],
        [24]
    ]);
    this.penaltyMaxSpacings = getValueOrDefault(a, "penaltyMaxSpacings", [
        [12],
        [12],
        [12],
        [24]
    ]);
    this.spacingPenalties = getValueOrDefault(a, "spacingPenalties", [
        [0.5],
        [0.5],
        [0.5],
        [0.5]
    ]);
    this.parallelOctavesAndUnisonsPenalties = getValueOrDefault(a, "parallelOctavesAndUnisonsPenalties", [4, 4, 4, 4]);
    this.parallelFifthsPenalties = getValueOrDefault(a, "parallelFifthsPenalties", [3, 3, 3, 3]);
    this.maxLeapSizes = getValueOrDefault(a, "maxLeapSizes", [
        [12],
        [5],
        [5],
        [12]
    ]);
    this.maxLeapSizePenalties = getValueOrDefault(a, "maxLeapSizePenalties", [
        [1],
        [1],
        [1],
        [1]
    ]);
    this.maxFinalLeapSizes = getValueOrDefault(a, "maxFinalLeapSizes", [
        [4],
        [5],
        [5],
        [12]
    ]);
    this.maxFinalLeapSizePenalties = getValueOrDefault(a, "maxFinalLeapSizePenalties", [
        [3],
        [0.5],
        [0.5],
        [0.5]
    ]);
    this.suspensionLeapPenalties = getValueOrDefault(a, "suspensionLeapPenalties", [
        [2],
        [2],
        [2],
        [2]
    ]);
    this.largeLeapReverseDirectionPenaltyFactors = getValueOrDefault(a, "largeLeapReverseDirectionPenaltyFactor", [1, 1, 1, 1]);
    this.unresolvedSusChordPenalties = getValueOrDefault(a, "unresolvedSusChordPenalties", [
        [1],
        [1],
        [1],
        [1]
    ]);
    this.unpreparedSusChordPenalties = getValueOrDefault(a, "unpreparedSusChordPenalties", [
        [0.2],
        [0.2],
        [0.2],
        [0.2]
    ]);
    this.augmentedSecondPenalties = getValueOrDefault(a, "augmentedSecondPenalties", [3]);
    this.rootDoublingPenalties = getValueOrDefault(a, "rootDoublingPenalties", [0]);
    this.thirdDoublingPenalties = getValueOrDefault(a, "thirdDoublingPenalties", [1]);
    this.fifthDoublingPenalties = getValueOrDefault(a, "fifthDoublingPenalties", [1]);
    this.seventhDoublingPenalties = getValueOrDefault(a, "seventhDoublingPenalties", [1]);
    this.leadingToneDoublingPenalties = getValueOrDefault(a, "leadingToneDoublingPenalties", [3]);
    this.missingRootPenalties = getValueOrDefault(a, "missingRootPenalties", [3]);
    this.missingThirdPenalties = getValueOrDefault(a, "missingThirdPenalties", [2]);
    this.missingFifthPenalties = getValueOrDefault(a, "missingFifthPenalties", [0.25]);
    this.missingSeventhPenalties = getValueOrDefault(a, "missingSeventhPenalties", [2]);
    this.invertedMissingRootPenalties = getValueOrDefault(a, "missingRootPenalties", [3]);
    this.invertedMissingThirdPenalties = getValueOrDefault(a, "missingThirdPenalties", [2]);
    this.invertedMissingFifthPenalties = getValueOrDefault(a, "missingFifthPenalties", [1]);
    this.invertedMissingSeventhPenalties = getValueOrDefault(a, "missingSeventhPenalties", [2]);
    this.unpreparedSeventhPenalties = getValueOrDefault(a, "unpreparedSeventhPenalties", [0.25]);
    this.unresolvedSeventhPenalties = getValueOrDefault(a, "unresolvedSeventhPenalties", [0.5]);
    this.unprepared64FourthPenalties = getValueOrDefault(a, "unprepared64FourthPenalties", [0.2]);
    this.unresolved64FourthPenalties = getValueOrDefault(a, "unresolved64FourthPenalties", [0.4]);
    this.crossRelationPenalties = getValueOrDefault(a, "crossRelationPenalties", [3]);
    this.chordPitchClassesArr = [];
    this.scalePitchClassesArr = [];
    this.allPairs = [];
    this.adjacentPairs = [];
    this.possibleAbsoluteNoteTuples = [];
    this.possibleScaleIndexTuples = [];
    this.zeroStepCosts = [];
    this.zeroStepDomainIndices = [];
    this.oneStepCosts = [];
    this.oneStepHeuristicCosts = [];
    this.oneStepDomainIndices = [];
    this.zeroStepConstraints = [];
    this.oneStepConstraints = [];
    this.twoStepConstraints = []
}
ClassicalVoiceLineGenerator.prototype = new VoiceLineGenerator();
ClassicalVoiceLineGenerator.prototype.getTwoStepCost = function (m, f, l, c, d) {
    var a = 0;
    var b = this.possibleAbsoluteNoteTuples[m][c];
    var g = this.possibleAbsoluteNoteTuples[m - 1][l];
    var k = this.possibleAbsoluteNoteTuples[m - 2][f];
    for (var e = 0; e < b.length; e++) {
        var j = this.largeLeapReverseDirectionPenaltyFactors[e % this.largeLeapReverseDirectionPenaltyFactors.length];
        var h = this.getlargeLeapReverseDirectionPenaltyCount(k[e], g[e], b[e]);
        a += j * h
    }
    return a
};
ClassicalVoiceLineGenerator.prototype.getOneStepCost = function (K, R, M, d) {
    var Y = 0;
    for (var I = 0; I < this.oneStepConstraints[K].length; I++) {
        var P = this.oneStepConstraints[K][I];
        Y += P.oneStepCost(K, R, M, this)
    }
    var O = this.possibleAbsoluteNoteTuples[K][M];
    var L = this.possibleAbsoluteNoteTuples[K - 1][R];
    var V = this.possibleScaleIndexTuples[K][M];
    var H = this.possibleScaleIndexTuples[K - 1][R];
    var aw = this.chordPitchClassesArr[K];
    var am = this.chordPitchClassesArr[K - 1];
    var F = this.harmony.get(K);
    var ac = F.hasSeventh();
    var b = F.isSus();
    var l = aw[0];
    if (b) {
        l = aw[1]
    }
    var s = aw[0];
    var X = am[0];
    var n = aw[1];
    var U = aw[2];
    var at = s;
    if (ac) {
        at = aw[3]
    }
    var k = F.is64Triad();
    var an = this.harmony.get(K - 1);
    var ag = an.hasSeventh();
    var r = an.isSus();
    var g = am[0];
    if (r) {
        g = am[1]
    }
    var av = am[0];
    if (ag) {
        av = am[3]
    }
    var ab = an.is64Triad();
    var a = am[0];
    var ap = K == this.harmony.getCount() - 1;
    var B = this.changedScaleArr[K];
    var W = this.scalePitchClassesArr[K];
    var N = this.scalePitchClassesArr[K - 1];
    if (B) {
        var ai = false;
        var aj = O[O.length - 1];
        var J = L[L.length - 1];
        var af = aj % 12;
        var C = !arrayContains(N, af);
        if (C) {
            if (Math.abs(aj - J) <= 2) { } else {
                var m = Math.floor(O.length / 2);
                var S = false;
                for (var I = 0; I < m; I++) {
                    var t = L[I];
                    var Q = O[I];
                    if ((Q % 12) == af && Math.abs(Q - t) <= 2) {
                        S = true;
                        break
                    }
                }
                if (!S) {
                    Y += this.crossRelationPenalties[K % this.crossRelationPenalties.length];
                    ai = true
                }
            }
        }
    }
    for (var I = 0; I < O.length; I++) {
        var t = L[I];
        var Q = O[I];
        var u = ac && ag && s == X;
        if (ac && !u) {
            var z = this.unpreparedSeventhPenalties[K % this.unpreparedSeventhPenalties.length];
            Y += z * this.getlargeLeapToPitchClassPenaltyCount(t, Q, 1, at)
        }
        if (ag && !u) {
            var o = this.unresolvedSeventhPenalties[K % this.unresolvedSeventhPenalties.length];
            var aa = o * this.getLeapRangeFromPitchClassPenaltyCount(t, Q, -2, -1, av);
            Y += aa
        }
        if (k) {
            var D = this.unprepared64FourthPenalties[K % this.unprepared64FourthPenalties.length];
            Y += D * this.getlargeLeapToPitchClassPenaltyCount(t, Q, 1, s)
        }
        if (ab) {
            var ae = this.unresolved64FourthPenalties[K % this.unresolved64FourthPenalties.length];
            var ad = ae * this.getLeapRangeFromPitchClassPenaltyCount(t, Q, -2, -1, a);
            Y += ad
        }
        if (Math.abs(t - Q) == 3) {
            var A = false;
            var au = V[I];
            var c = H[I];
            if (B) {
                var ah = arrayContains(N, Q % 12);
                var ao = arrayContains(W, t % 12);
                if (!ah || !ao) {
                    A = true
                }
            } else {
                if (Math.abs(c - au) == 1) {
                    A = true
                }
            }
            if (A) {
                Y += this.augmentedSecondPenalties[K % this.augmentedSecondPenalties.length]
            }
        }
        var v = this.parallelOctavesAndUnisonsPenalties[I % this.parallelOctavesAndUnisonsPenalties.length];
        var Z = this.parallelFifthsPenalties[I % this.parallelFifthsPenalties.length];
        for (var G = I + 1; G < O.length; G++) {
            var E = O[G];
            var ar = L[G];
            if (this.isParallelOctavesOrUnisons(ar, E, t, Q)) {
                Y += v
            }
            if (this.isParallelPerfectFifths(ar, E, t, Q)) {
                Y += Z
            }
        }
        var w = this.maxLeapSizePenalties[I % this.maxLeapSizePenalties.length];
        var ak = this.maxLeapSizes[I % this.maxLeapSizes.length];
        Y += w[K % w.length] * this.getlargeLeapPenaltyCount(t, Q, ak[K % ak.length]);
        if (ap) {
            var al = this.maxFinalLeapSizePenalties[I % this.maxFinalLeapSizePenalties.length];
            var e = this.maxFinalLeapSizes[I % this.maxFinalLeapSizes.length];
            var h = al[K % al.length] * this.getlargeLeapPenaltyCount(t, Q, e[K % e.length]);
            Y += h
        }
        var y = this.suspensions[I % this.suspensions.length];
        if (y[(K - 1) % y.length]) {
            var p = t % 12;
            var x = arrayContains(aw, p);
            if (x) { } else {
                var f = this.suspensionLeapPenalties[I % this.suspensionLeapPenalties.length];
                Y += f[K % f.length] * this.getLeapRangePenaltyCount(t, Q, -2, -1)
            }
        }
        if (r) {
            var q = this.unresolvedSusChordPenalties[I % this.unresolvedSusChordPenalties.length];
            Y += q[K % q.length] * this.getLeapRangeFromPitchClassPenaltyCount(t, Q, -2, -1, g)
        }
        if (b) {
            var aq = this.unpreparedSusChordPenalties[I % this.unpreparedSusChordPenalties.length];
            var T = aq[K % aq.length];
            Y += T * this.getlargeLeapToPitchClassPenaltyCount(t, Q, 1, l)
        }
    }
    return Y
};
ClassicalVoiceLineGenerator.prototype.getZeroStepCost = function (D, l, t) {
    var q = 0;
    var a = this.possibleAbsoluteNoteTuples[D][l];
    for (var z = 0; z < this.zeroStepConstraints[D].length; z++) {
        var p = this.zeroStepConstraints[D][z];
        q += p.zeroStepCost(D, l, this)
    }
    for (var z = 0; z < a.length; z++) {
        if (z > 0) {
            var v = Math.abs(a[z] - a[z - 1]);
            var h = this.penaltyMaxSpacings[z % this.penaltyMaxSpacings.length];
            var g = h[D % h.length];
            if (v > g) {
                var F = v - g;
                var b = this.spacingPenalties[z % this.spacingPenalties.length];
                q += F * b[D % b.length]
            }
        }
    }
    for (var z = 0; z < a.length; z++) {
        var f = a[z];
        var E = this.penaltyAbsoluteNoteRanges[z][D];
        var F = 0;
        if (f < E[0]) {
            F = E[0] - f
        } else {
            if (f > E[1]) {
                F = f - E[1]
            }
        }
        var y = this.noteRangePenalties[z % this.noteRangePenalties.length];
        q += y[D % y.length] * F
    }
    for (var z = 0; z < a.length; z++) {
        var f = a[z];
        var e = this.penaltyMaxAbsoluteHintDistances[z][D];
        var s = this.absoluteNoteHints[z][D];
        if (s === null) {
            continue
        }
        var v = Math.abs(s - f);
        var F = 0;
        if (v > e) {
            F = v - e
        }
        var y = this.hintDistancePenalties[z % this.hintDistancePenalties.length];
        var d = y[D % y.length] * F;
        q += d
    }
    var n = this.getPitchClassMap(a);
    var m = this.harmony.get(D);
    var o = m.isSeventh();
    var k = this.chordPitchClassesArr[D];
    var x = m.getAbsoluteNoteFromScaleIndex(6) % 12;
    var C = k[0];
    var j = k[1];
    var B = k[2];
    var u = C;
    if (o) {
        u = k[3]
    }
    var c = m.chordInversions == 0 ? this.missingRootPenalties : this.invertedMissingRootPenalties;
    var r = m.chordInversions == 0 ? this.missingThirdPenalties : this.invertedMissingThirdPenalties;
    var w = m.chordInversions == 0 ? this.missingFifthPenalties : this.invertedMissingFifthPenalties;
    var A = m.chordInversions == 0 ? this.missingSeventhPenalties : this.invertedMissingSeventhPenalties;
    if (!n[C]) {
        q += c[D % c.length]
    }
    if (!n[j]) {
        q += r[D % r.length]
    }
    if (!n[B]) {
        q += w[D % w.length]
    }
    if (o && !n[u]) {
        q += A[D % A.length]
    }
    if (n[C] > 1) {
        q += this.rootDoublingPenalties[D % this.rootDoublingPenalties.length] * (n[C] - 1)
    }
    if (n[j] > 1) {
        q += this.thirdDoublingPenalties[D % this.thirdDoublingPenalties.length] * (n[j] - 1)
    }
    if (n[B] > 1) {
        q += this.fifthDoublingPenalties[D % this.fifthDoublingPenalties.length] * (n[B] - 1)
    }
    if (o && n[u] > 1) {
        q += this.seventhDoublingPenalties[D % this.seventhDoublingPenalties.length] * (n[u] - 1)
    }
    if (n[x] > 1) {
        q += this.leadingToneDoublingPenalties[D % this.leadingToneDoublingPenalties.length] * (n[x] - 1)
    }
    return q
};
ClassicalVoiceLineGenerator.prototype.getPitchClassMap = function (a) {
    var d = {};
    for (var e = 0; e < a.length; e++) {
        var c = a[e];
        var b = c % 12;
        var f = d[b];
        if (f) {
            f++
        } else {
            f = 1
        }
        d[b] = f
    }
    return d
};
ClassicalVoiceLineGenerator.prototype.getStepCost = function (e) {
    var c = e.searchDepth + e.resultIndex - 1;
    var d = 0;
    var f = e.state;
    if (c > 0) {
        var g = this.resultStates[c - 1];
        var a = this.oneStepCosts[c][g.stateIndex][f.stateIndex];
        if (!a) {
            a = this.getOneStepCost(c, g.stateIndex, f.stateIndex);
            this.oneStepCosts[c][g.stateIndex][f.stateIndex] = a
        }
        d += a;
        if (c > 1) {
            var b = this.resultStates[c - 2];
            d += this.getTwoStepCost(c, b.stateIndex, g.stateIndex, f.stateIndex)
        }
    }
    d += this.zeroStepCosts[c][f.stateIndex];
    return d
};
ClassicalVoiceLineGenerator.prototype.getStates = function (e) {
    var a = [];
    var c = e.searchDepth + e.resultIndex;
    var b = this.zeroStepDomainIndices[c];
    for (var d = 0; d < b.length; d++) {
        var f = new ClassicalVoiceLineState();
        f.stateIndex = b[d];
        a.push(f)
    }
    return a
};
ClassicalVoiceLineGenerator.prototype.prepareBeforeSearch = function () {
    var u = this.harmony.getConstantHarmonyElements();
    this.chordPitchClassesArr = [];
    this.scalePitchClassesArr = [];
    this.changedScaleArr = [];
    for (var L = 0; L < u.length; L++) {
        var t = u[L];
        this.zeroStepConstraints[L] = [];
        this.oneStepConstraints[L] = [];
        this.twoStepConstraints[L] = [];
        if (!this.constraints[L]) {
            this.constraints[L] = []
        }
        addAll(this.constraints[L], t.voiceLineConstraints);
        var y = t.getPitchClassesFromAbsoluteNotes(t.getChordAbsoluteNotes());
        var d = t.getPitchClassesFromAbsoluteNotes(t.getScaleAbsoluteNotes());
        this.chordPitchClassesArr.push(y);
        this.scalePitchClassesArr.push(d);
        var a = false;
        if (L > 0) {
            var n = u[L - 1];
            a = (t.baseNote != n.baseNote) || !arrayEquals(d, this.scalePitchClassesArr[L - 1])
        }
        this.changedScaleArr[L] = a
    }
    for (var L = 0; L < this.constraints.length; L++) {
        var s = this.constraints[L];
        for (var K = 0; K < s.length; K++) {
            var M = s[K];
            var C = M.getCheckCostSteps();
            for (var I = 0; I < C.length; I++) {
                var B = C[I];
                var D = null;
                switch (B) {
                    case 0:
                        D = this.zeroStepConstraints;
                        break;
                    case 1:
                        D = this.oneStepConstraints;
                        break;
                    case 2:
                        D = this.twoStepConstraints;
                        break
                }
                if (D != null) {
                    D[L].push(M)
                }
            }
        }
    }
    for (var L = 0; L < this.voiceCount; L++) {
        for (var K = L + 1; K < this.voiceCount; K++) {
            this.allPairs.push([L, K])
        }
    }
    for (var L = 0; L < this.voiceCount - 1; L++) {
        this.adjacentPairs.push([L, L + 1])
    }
    var f = this.absoluteNoteRanges;
    var N = this.voiceCount;
    var e = this.maxSpacings;
    var m = this.absoluteNoteHints;
    var p = this.maxAbsoluteHintDistances;
    var x = this.chordRootPitchClassConstraints;
    var w = this.chordBassPitchClassConstraints;
    var O = this.chordPitchClassesArr;
    var E = this.constants;

    function l(Z, an, aa, aj, k, ad, ax, ao) {
        var X = E[an];
        var at = X[Z % X.length];
        var ac = f[an];
        var U = ac[Z % ac.length];
        var ag = u[Z];
        var S = {};
        if (at) {
            var af = ag.getScaleIndexAndChromaticOffsetForAbsoluteNote(U[0])[0];
            S[af] = U[0]
        } else {
            var ai = O[Z];
            var ar = aa;
            var aq = aj;
            if (!U) {
                console.log("Could not find absolute note range for voice " + an + "<br />");
                U = [aa, aa + 12]
            }
            var am = U[0];
            var ah = U[1];
            ar = Math.min(ah, ar);
            if (an > 0) {
                var Y = e[an];
                if (Y && Y.length > 0) {
                    am = Math.max(am, aa - Y[Z % Y.length])
                }
            }
            var ap = m[an];
            var av = p[an];
            if (ap && av && ap.length > 0 && av.length > 0) {
                var ae = ap[Z % ap.length];
                if (ae === null) { } else {
                    var Q = av[Z % av.length];
                    if (ae === null || Q === null) { } else {
                        var T = ae + Q;
                        var V = ae - Q;
                        ar = Math.min(ar, T);
                        am = Math.max(am, V)
                    }
                }
            }
            var ab = w[an];
            if (ab && ab.length > 0) {
                var ay = ab[Z % ab.length];
                if (ay && ay.length > 0) {
                    ai = [];
                    for (var au = 0; au < ay.length; au++) {
                        var j = ag.getAbsoluteNoteFromChordBassIndex(ay[au]) % 12;
                        ai.push(j)
                    }
                }
            }
            var R = x[an];
            if (R && R.length > 0) {
                var W = R[Z % R.length];
                if (W && W.length > 0) {
                    ai = [];
                    for (var au = 0; au < W.length; au++) {
                        var j = ag.getAbsoluteNoteFromChordRootIndex(W[au]) % 12;
                        ai.push(j)
                    }
                }
            }
            while (ar >= am) {
                if (arrayContains(ai, ar % 12)) {
                    var aq = ag.getScaleIndexAndChromaticOffsetForAbsoluteNote(ar)[0];
                    S[aq] = ar
                }
                ar--
            }
        }
        for (var af in S) {
            var aw = arrayCopy(k);
            var al = arrayCopy(ad);
            var ak = S[af];
            aw[an] = ak;
            al[an] = af;
            if (an < N - 1) {
                l(Z, an + 1, ak, af, aw, al, ax, ao)
            } else {
                ax[Z].push(aw);
                ao[Z].push(al)
            }
        }
    }
    var P = [];
    var G = [];
    for (var L = 0; L < u.length; L++) {
        var q = this.absoluteNoteRanges[0];
        var h = q[L % q.length][1];
        var v = t.getScaleIndexAndChromaticOffsetForAbsoluteNote(h)[0];
        P[L] = [];
        G[L] = [];
        l(L, 0, h, v, [], [], P, G)
    }
    this.possibleAbsoluteNoteTuples = P;
    this.possibleScaleIndexTuples = G;
    for (var L = 0; L < u.length; L++) {
        var o = this.possibleAbsoluteNoteTuples[L];
        var A = this.possibleScaleIndexTuples[L];
        for (var K = 0; K < A.length; K++) {
            for (var I = 0; I < A[K].length; I++) {
                A[K][I] = parseInt(A[K][I])
            }
        }
    }
    this.zeroStepCosts = [];
    this.oneStepCosts = [];
    this.zeroStepDomainIndices = [];
    this.oneStepDomainIndices = [];
    for (var L = 0; L < u.length; L++) {
        var o = this.possibleAbsoluteNoteTuples[L];
        var A = this.possibleScaleIndexTuples[L];
        var b = createFilledArray(o.length, 0);
        var g = createFilledNumericIncArray(o.length, 0, 1);
        for (var K = 0; K < o.length; K++) {
            b[K] = this.getZeroStepCost(L, K);
            if (isNaN(b[K])) {
                console.log("NaN cost for domain " + o[K].join(",") + " verbose follows:<br />");
                this.getZeroStepCost(L, K, true)
            }
        }
        g.sort(function (k, j) {
            return b[k] - b[j]
        });
        var r = this.maxDomainSize;
        var J = [];
        var F = [];
        var c = [];
        for (var K = 0; K < Math.min(r, g.length); K++) {
            var z = g[K];
            J[K] = o[z];
            F[K] = A[z];
            c[K] = b[z]
        }
        this.zeroStepDomainIndices[L] = createFilledNumericIncArray(J.length, 0, 1);
        this.zeroStepCosts[L] = c;
        this.possibleAbsoluteNoteTuples[L] = J;
        this.possibleScaleIndexTuples[L] = F;
        if (L > 0) {
            this.oneStepCosts[L] = [];
            this.oneStepHeuristicCosts[L] = [];
            this.oneStepDomainIndices[L] = [];
            var H = this.possibleAbsoluteNoteTuples[L - 1];
            for (var K = 0; K < H.length; K++) {
                this.oneStepCosts[L][K] = [];
                this.oneStepHeuristicCosts[L][K] = []
            }
        }
    }
};
ClassicalVoiceLineGenerator.prototype.createInitialState = function () {
    return new ClassicalVoiceLineState()
};
ClassicalVoiceLineGenerator.prototype.extractSolution = function (h, f) {
    var a = [];
    var g = this.possibleScaleIndexTuples[f][h.stateIndex];
    for (var c = 0; c < g.length; c++) {
        var e = false;
        if (this.undefines && this.undefines.length > 0) {
            var b = this.undefines[c % this.undefines.length];
            if (b.length > 0) {
                e = b[f % b.length]
            }
        }
        if (e) {
            a.push(new UndefinedVoiceLineElement())
        } else {
            var d = new ConstantVoiceLineElement();
            d.setIndexType(IndexType.SCALE);
            d.setSnapType(SnapType.NONE);
            d.setIndex(g[c]);
            d.suspend = this.suspensions[c][f];
            a.push(d)
        }
    }
    return a
};

function VoiceLinePlannerConstraint() {
    this.id = "";
    this._constructorName = "VoiceLinePlannerConstraint"
}

function EmptyVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this._constructorName = "EmptyVoiceLinePlannerConstraint"
}
EmptyVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

function MinVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.constraints = [];
    this._constructorName = "MinVoiceLinePlannerConstraint"
}
MinVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

function VoiceChordNotesVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.chordRootPitchClassConstraints = [];
    this.chordBassPitchClassConstraints = [];
    this.chordRootPitchClassConstraintCosts = [
        [1]
    ];
    this.chordBassPitchClassConstraintCosts = [
        [1]
    ];
    this._constructorName = "VoiceChordNotesVoiceLinePlannerConstraint"
}
VoiceChordNotesVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

function AbstractVoiceLinePlannerConstraintZone() {
    this.id = "";
    this.addInstanceDuplicates = false;
    this.addClassDuplicates = false;
    this._constructorName = "AbstractVoiceLinePlannerConstraintZone"
}
AbstractVoiceLinePlannerConstraintZone.prototype.applyZone = function (a, b) { };

function IndexedVoiceLinePlannerConstraintZone() {
    AbstractVoiceLinePlannerConstraintZone.call(this);
    this.globalIndices = [];
    this.indexPattern = [];
    this.startIndexPattern = [];
    this.endIndexPattern = [];
    this.phraseIndexPattern = [];
    this.startPhraseIndexPattern = [];
    this.endPhraseIndexPattern = [];
    this.indexRanges = [];
    this.indexConstraintIndices = [];
    this.constraints = [];
    this._constructorName = "IndexedVoiceLinePlannerConstraintZone"
}
IndexedVoiceLinePlannerConstraintZone.prototype = new AbstractVoiceLinePlannerConstraintZone();
IndexedVoiceLinePlannerConstraintZone.prototype.checkAndAddConstraint = function (d, b, e) {
    var f = this.constraints[d % this.constraints.length];
    if (f instanceof EmptyVoiceLinePlannerConstraint) {
        return
    }
    var a = b[e];
    if (!a) {
        a = [];
        b[e] = a
    }
    if ((this.addInstanceDuplicates || !arrayContainsExactly(a, f)) && (this.addClassDuplicates || !arrayContainsSameProperty(a, "_constructorName", f._constructorName))) {
        a.push(f)
    }
};
IndexedVoiceLinePlannerConstraintZone.prototype.applyZone = function (b, f) {
    var c = this.constraints.length;
    if (c > 0) {
        var g = b.getCount();
        for (var e = 0; e < this.globalIndices.length; e++) {
            var a = this.globalIndices[e];
            for (var d = 0; d < g; d++) {
                this.checkAndAddConstraint(a, f, d)
            }
        }
        if (this.indexPattern.length > 0) {
            for (var e = 0; e < g; e++) {
                var a = getItemFromArrayWithStartEndItems(0, this.indexPattern, g, e, this.startIndexPattern, this.endIndexPattern);
                this.checkAndAddConstraint(a, f, e)
            }
        }
    }
};
VoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return []
};
VoiceLinePlannerConstraint.prototype.getCheckValidSteps = function () {
    return []
};
VoiceLinePlannerConstraint.prototype.zeroStepCost = function (b, a, c) {
    return 0
};
VoiceLinePlannerConstraint.prototype.oneStepCost = function (b, c, a, d) {
    return 0
};
VoiceLinePlannerConstraint.prototype.twoStepCost = function (b, d, c, a, e) {
    return 0
};
EmptyVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return []
};
EmptyVoiceLinePlannerConstraint.prototype.getCheckValidSteps = function () {
    return []
};
var SuspendVoiceLinePlannerConstraintMode = {
    PITCH_CLASSES: 0
};

function SuspendVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.mode = SuspendVoiceLinePlannerConstraintMode.PITCH_CLASSES;
    this.suspendPitchClassPairs = [];
    this.onPattern = [1];
    this.penalties = [1];
    this._constructorName = "SuspendVoiceLinePlannerConstraint"
}
SuspendVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
SuspendVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [1]
};
SuspendVoiceLinePlannerConstraint.prototype.oneStepCost = function (r, m, b, h) {
    var a = 0;
    var d = h.possibleAbsoluteNoteTuples[r][b];
    var n = h.possibleAbsoluteNoteTuples[r - 1][m];
    for (var f = 0; f < this.suspendPitchClassPairs.length; f++) {
        var e = this.suspendPitchClassPairs[f];
        var k = this.penalties[f % this.penalties.length];
        var q = false;
        for (var g = 0; g < d.length; g++) {
            if (this.onPattern[g % this.onPattern.length] == 1) {
                var c = n[g];
                var p = c % 12;
                var o = d[g];
                var l = o % 12;
                if (e[0] == p && e[1] == l) {
                    q = true;
                    if (c <= o || c - o > 2) {
                        a += k
                    }
                }
            }
        }
        if (!q) {
            a += k
        }
    }
    return a
};
MinVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    var a = [];
    for (var e = 0; e < this.constraints.length; e++) {
        var f = this.constraints[e];
        var b = f.getCheckCostSteps();
        for (var d = 0; d < b.length; d++) {
            if (!arrayContains(a, b[d])) {
                a.push(b[d])
            }
        }
    }
    return a
};
MinVoiceLinePlannerConstraint.prototype.zeroStepCost = function (e, d, g) {
    if (this.constraints.length == 0) {
        return 0
    }
    var a = 99999999;
    for (var b = 0; b < this.constraints.length; b++) {
        var f = this.constraints[b];
        a = Math.min(a, f.zeroStepCost(e, d, g))
    }
    return a
};
MinVoiceLinePlannerConstraint.prototype.oneStepCost = function (e, f, d, h) {
    if (this.constraints.length == 0) {
        return 0
    }
    var a = 99999999;
    for (var b = 0; b < this.constraints.length; b++) {
        var g = this.constraints[b];
        a = Math.min(a, g.oneStepCost(e, f, d, h))
    }
    return a
};
MinVoiceLinePlannerConstraint.prototype.twoStepCost = function (e, g, f, d, j) {
    if (this.constraints.length == 0) {
        return 0
    }
    var a = 99999999;
    for (var b = 0; b < this.constraints.length; b++) {
        var h = this.constraints[b];
        a = Math.min(a, h.twoStepCost(e, g, f, d, j))
    }
    return a
};

function PitchClassStepVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.fromPitchClass = 0;
    this.toPitchClass = 0;
    this.sameRegister = true;
    this.penalty = 2;
    this.missingPenalty = 3;
    this.progressionCount = 1;
    this._constructorName = "PitchClassStepVoiceLinePlannerConstraint"
}
PitchClassStepVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
PitchClassStepVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [1]
};
PitchClassStepVoiceLinePlannerConstraint.prototype.oneStepCost = function (r, p, b, k) {
    var a = 0;
    var e = k.possibleAbsoluteNoteTuples[r][b];
    var q = k.possibleAbsoluteNoteTuples[r - 1][p];
    var c = k.chordPitchClassesArr[r];
    var h = k.chordPitchClassesArr[r - 1];
    if (!arrayContains(h, this.fromPitchClass) || !arrayContains(c, this.toPitchClass)) {
        return this.missingPenalty
    }
    var m = 0;
    var g = 0;
    for (var f = 0; f < e.length; f++) {
        var o = e[f];
        var d = q[f];
        var n = o % 12;
        var l = d % 12;
        if (l == this.fromPitchClass) {
            m++
        }
        if (l == this.fromPitchClass && n == this.toPitchClass && (!this.sameRegister || Math.abs(o - d) <= 6)) {
            g++
        }
    }
    if (m == 0) {
        a += this.missingPenalty
    }
    var j = Math.min(m, this.progressionCount);
    if (g >= j) { } else {
        a += this.penalty * (j - g)
    }
    return a
};

function PitchClassLeapRangeVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.pitchClass = 0;
    this.enterRange = [-1, 1];
    this.leaveRange = [-1, 1];
    this.enterPenaltyFactor = 0;
    this.leavePenaltyFactor = 0;
    this.enterNotFoundPenalty = 0;
    this.leaveNotFoundPenalty = 0;
    this.enterDoublingPenalty = 0;
    this.leaveDoublingPenalty = 0;
    this._constructorName = "PitchClassLeapRangeVoiceLinePlannerConstraint"
}
PitchClassLeapRangeVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
PitchClassLeapRangeVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [1]
};
PitchClassLeapRangeVoiceLinePlannerConstraint.prototype.oneStepCost = function (s, k, f, c) {
    var j = 0;
    var a = c.possibleAbsoluteNoteTuples[s][f];
    var d = c.possibleAbsoluteNoteTuples[s - 1][k];
    var h = false;
    var m = false;

    function l(u, v, x) {
        var w = 0;
        var y = x - v;
        if (y > u[1]) {
            w = y - u[1]
        } else {
            if (y < u[0]) {
                w = u[0] - y
            }
        }
        return w
    }
    var r = 0;
    var g = 0;
    var e = 0;
    var q = 0;
    for (var o = 0; o < a.length; o++) {
        var b = d[o];
        var n = b % 12;
        var t = a[o];
        var p = t % 12;
        if (this.pitchClass == p) {
            if (h) {
                j += this.enterDoublingPenalty
            }
            h = true;
            j += l(this.enterRange, b, t) * this.enterPenaltyFactor;
            e = b;
            q = t
        }
        if (this.pitchClass == n) {
            if (m) {
                j += this.leaveDoublingPenalty
            }
            m = true;
            j += l(this.leaveRange, b, t) * this.leavePenaltyFactor;
            r = b;
            g = t
        }
    }
    if (!h) {
        j += this.enterNotFoundPenalty
    }
    if (!m) {
        j += this.leaveNotFoundPenalty
    }
    return j
};

function LeapRangeVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.voiceIndices = [0, 1, 2, 3];
    this.range = [-1, 1];
    this.penaltyFactor = 0;
    this._constructorName = "LeapRangeVoiceLinePlannerConstraint"
}
LeapRangeVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
LeapRangeVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [1]
};
LeapRangeVoiceLinePlannerConstraint.prototype.oneStepCost = function (m, j, b, f) {
    var a = 0;
    var d = f.possibleAbsoluteNoteTuples[m][b];
    var k = f.possibleAbsoluteNoteTuples[m - 1][j];

    function g(n, o, q) {
        var p = 0;
        var r = q - o;
        if (r > n[1]) {
            p = r - n[1]
        } else {
            if (r < n[0]) {
                p = n[0] - r
            }
        }
        return p
    }
    for (var e = 0; e < this.voiceIndices.length; e++) {
        var h = this.voiceIndices[e];
        if (h < d.length) {
            var c = k[h];
            var l = d[h];
            a += g(this.range, c, l) * this.penaltyFactor
        }
    }
    return a
};
VoiceChordNotesVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [0]
};
VoiceChordNotesVoiceLinePlannerConstraint.prototype.setRootPitches = function (a) {
    this.chordRootPitchClassConstraints = a;
    return this
};
VoiceChordNotesVoiceLinePlannerConstraint.prototype.setRootPitchCosts = function (a) {
    this.chordRootPitchClassConstraintCosts = a;
    return this
};
VoiceChordNotesVoiceLinePlannerConstraint.prototype.zeroStepCost = function (q, d, o) {
    var b = 0;
    var c = o.possibleAbsoluteNoteTuples[q][d];
    var f = o.chordPitchClassesArr[q];
    for (var k = 0; k < this.chordRootPitchClassConstraints.length; k++) {
        var l = this.chordRootPitchClassConstraints[k];
        var a = this.chordRootPitchClassConstraintCosts[k % this.chordRootPitchClassConstraintCosts.length];
        if (k < c.length) {
            var p = c[k];
            var e = p % 12;
            for (var h = 0; h < l.length; h++) {
                var n = l[h];
                var g = a[h % a.length];
                if (n < f.length) {
                    var m = f[n];
                    if (e == m) {
                        b += g
                    }
                }
            }
        }
    }
    return b
};

function ChordDoublingVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.rootDoublingPenalty = 0;
    this.thirdDoublingPenalty = 1;
    this.fifthDoublingPenalty = 1;
    this.seventhDoublingPenalty = 1;
    this._constructorName = "ChordDoublingVoiceLinePlannerConstraint"
}
ChordDoublingVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
ChordDoublingVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [0]
};
ChordDoublingVoiceLinePlannerConstraint.prototype.zeroStepCost = function (n, d, j) {
    var a = 0;
    var b = j.possibleAbsoluteNoteTuples[n][d];
    var g = j.getPitchClassMap(b);
    var l = j.harmony.get(n);
    var e = l.isSeventh();
    var f = j.chordPitchClassesArr[n];
    var h = f[0];
    var k = f[1];
    var m = f[2];
    var c = h;
    if (e) {
        c = f[3]
    }
    if (g[h] > 1) {
        a += this.rootDoublingPenalty * (g[h] - 1)
    }
    if (g[k] > 1) {
        a += this.thirdDoublingPenalty * (g[k] - 1)
    }
    if (g[m] > 1) {
        a += this.fifthDoublingPenalty * (g[m] - 1)
    }
    if (e && g[c] > 1) {
        a += this.seventhDoublingPenalty * (g[c] - 1)
    }
    return a
};

function ChordCompletenessVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.missingRootPenalty = 3;
    this.missingThirdPenalty = 2;
    this.missingFifthPenalty = 1;
    this.missingSeventhPenalty = 2;
    this._constructorName = "ChordCompletenessVoiceLinePlannerConstraint"
}
ChordCompletenessVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
ChordCompletenessVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function () {
    return [0]
};
ChordCompletenessVoiceLinePlannerConstraint.prototype.zeroStepCost = function (n, d, j) {
    var a = 0;
    var b = j.possibleAbsoluteNoteTuples[n][d];
    var g = j.getPitchClassMap(b);
    var l = j.harmony.get(n);
    var e = l.isSeventh();
    var f = j.chordPitchClassesArr[n];
    var h = f[0];
    var k = f[1];
    var m = f[2];
    var c = h;
    if (e) {
        c = f[3]
    }
    if (!g[h]) {
        a += this.missingRootPenalty
    }
    if (!g[k]) {
        a += this.missingThirdPenalty
    }
    if (!g[m]) {
        a += this.missingFifthPenalty
    }
    if (e && !g[c]) {
        a += this.missingSeventhPenalty
    }
    return a
};

function VoiceLinePlanner() {
    this.id = "";
    this.maxSearchStepsPerStep = 5000;
    this.constraintZones = [];
    this._constructorName = "VoiceLinePlanner"
}
VoiceLinePlanner.prototype.planVoices = function (c, d, b, a) {
    console.log("A voice line planner must implement planVoices()<br />")
};

function ClassicalVoiceLinePlanner() {
    VoiceLinePlanner.call(this);
    this.defaultAbsoluteNoteRange = [20, 110];
    this.defaultMaxSpacing = 12;
    this.defaultHintDistance = 6;
    this._constructorName = "ClassicalVoiceLinePlanner"
}
ClassicalVoiceLinePlanner.prototype = new VoiceLinePlanner();
ClassicalVoiceLinePlanner.prototype.planVoices = function (L, y, f, w) {
    var a = [];
    for (var R = 0; R < this.constraintZones.length; R++) {
        var r = this.constraintZones[R];
        r.applyZone(y, a)
    }
    var m = [];
    var o = [];
    var K = [];
    var k = [];
    var N = [];
    var S = [];
    var T = [];
    var d = [];
    var u = [];
    var l = [];
    var n = [];
    var V = [];
    var O = [];
    for (var R = 0; R < L.length; R++) {
        var p = L[R];
        if (p instanceof DoubledVoiceLine) {
            continue
        }
        var E = p.getSingleStepVoiceLineElements(y, f);
        N[R] = [];
        S[R] = [];
        T[R] = [];
        m[R] = [];
        o[R] = [];
        d[R] = [];
        u[R] = [];
        l[R] = [];
        n[R] = [];
        K[R] = [];
        k[R] = [];
        V[R] = [];
        O[R] = [];
        for (var P = 0; P < E.length; P++) {
            var s = E[P];
            var H = arrayCopy(this.defaultAbsoluteNoteRange);
            var G = arrayCopy(this.defaultAbsoluteNoteRange);
            var B = y.get(P);
            var Q = false;
            var x = false;
            var J = null;
            var b = this.defaultHintDistance;
            var g = this.defaultHintDistance;
            var t = this.defaultMaxSpacing;
            var h = this.defaultMaxSpacing;
            var D = [];
            var q = [];
            if (s instanceof ConstantVoiceLineElement) {
                var F = B.getAbsoluteNoteConstantVoiceLineElement(s);
                H = [F, F];
                Q = true
            } else {
                if (s instanceof ClassicalAdaptiveVoiceLineElement) {
                    if (s.range && s.range.length == 2) {
                        var e = B.getAbsoluteNoteWithIndexType(s.range[0], s.rangeIndexType);
                        var M = B.getAbsoluteNoteWithIndexType(s.range[1], s.rangeIndexType);
                        H = [e, M]
                    }
                    if (s.penaltyRange && s.penaltyRange.length == 2) {
                        var e = B.getAbsoluteNoteWithIndexType(s.penaltyRange[0], s.rangeIndexType);
                        var M = B.getAbsoluteNoteWithIndexType(s.penaltyRange[1], s.rangeIndexType);
                        G = [e, M]
                    }
                    if (s.hintIndex === null || s.maxHintDistance === null) { } else {
                        J = B.getAbsoluteNoteWithIndexType(s.hintIndex, s.hintIndexType);
                        var M = B.offset(J, s.hintDistanceOffsetType, s.maxHintDistance, B);
                        var e = B.offset(J, s.hintDistanceOffsetType, -s.maxHintDistance, B);
                        b = Math.max(Math.abs(J - M), Math.abs(J - e));
                        var v = B.offset(J, s.hintDistanceOffsetType, s.penaltyMaxHintDistance, B);
                        var I = B.offset(J, s.hintDistanceOffsetType, -s.penaltyMaxHintDistance, B);
                        g = Math.max(Math.abs(J - v), Math.abs(J - I))
                    }
                    if (s.chordBassPitchClassConstraint) {
                        D = s.chordBassPitchClassConstraint
                    }
                    if (s.chordRootPitchClassConstraint) {
                        q = s.chordRootPitchClassConstraint
                    }
                    if (s.maxSpacing === null) { } else {
                        t = s.maxSpacing
                    }
                    if (s.penaltyMaxSpacing === null) { } else {
                        h = s.penaltyMaxSpacing
                    }
                } else {
                    if (s instanceof UndefinedVoiceLineElement) {
                        x = true
                    } else {
                        console.log(this._constructorName + " can not handle " + s._constructorName + "<br />")
                    }
                }
            }
            m[R][P] = H;
            o[R][P] = G;
            K[R][P] = Q;
            k[R][P] = x;
            N[R][P] = J;
            S[R][P] = b;
            T[R][P] = g;
            l[R][P] = t;
            n[R][P] = h;
            u[R][P] = D;
            d[R][P] = q;
            V[R][P] = s.suspend;
            O[R][P] = s.anticipate
        }
    }
    var C = {
        voiceCount: L.length,
        harmony: y,
        absoluteNoteRanges: m,
        penaltyAbsoluteNoteRanges: o,
        constants: K,
        undefines: k,
        suspensions: V,
        anticipations: O,
        absoluteNoteHints: N,
        maxAbsoluteHintDistances: S,
        penaltyMaxAbsoluteHintDistances: T,
        chordRootPitchClassConstraints: d,
        chordBassPitchClassConstraints: u,
        maxSpacings: l,
        penaltyMaxSpacings: n,
        maxSearchSteps: this.maxSearchStepsPerStep
    };
    var z = new ClassicalVoiceLineGenerator(C);
    z.constraints = a;
    var U = null;
    var c = JSON.stringify(z);
    z.reusables = f.reusables;
    var A = f.reusables[c];
    if (A) {
        U = copyValueDeep(A)
    } else {
        U = z.search();
        f.reusables[c] = U
    }
    if (U) {
        for (var R = 0; R < U.length; R++) {
            U[R].id = L[R].id
        }
    } else {
        console.log("ClassicalVoicePlanner failed with options: " + JSON.stringify(C))
    }
    addAll(w, U)
};
var MidiControllerType = {
    BANK_SELECT: 0,
    MODULATION: 1,
    BREATH_CONTROLLER: 2,
    FOOT_CONTROLLER: 3,
    PORTAMENTO_TIME: 4,
    DATA_ENTRY_MSB: 5,
    VOLUME: 6,
    BALANCE: 7,
    PAN: 8,
    EXPRESSION_CONTROLLER: 9,
    EFFECT_CONTROL_1: 10,
    EFFECT_CONTROL_2: 11,
    GENERAL_PURPOSE_1: 12,
    GENERAL_PURPOSE_2: 13,
    GENERAL_PURPOSE_3: 14,
    GENERAL_PURPOSE_4: 15,
    BANK_SELECT_LSB: 16,
    MODULATION_LSB: 17,
    BREATH_CONTROLLER_LSB: 18,
    FOOT_CONTROLLER_LSB: 19,
    PORTAMENTO_TIME_LSB: 20,
    DATA_ENTRY_LSB: 21,
    VOLUME_LSB: 22,
    BALANCE_LSB: 23,
    PAN_LSB: 24,
    EXPRESSION_CONTROLLER_LSB: 25,
    EFFECT_CONTROL_1_LSB: 26,
    EFFECT_CONTROL_2_LSB: 27,
    DAMPER_PEDAL: 28,
    PORTAMENTO: 29,
    SOSTENUTO: 30,
    SOFT_PEDAL: 31,
    LEGATO_FOOTSWITCH: 32,
    HOLD_2: 33,
    SOUND_CONTROLLER_1: 34,
    SOUND_CONTROLLER_2: 35,
    SOUND_CONTROLLER_3: 36,
    SOUND_CONTROLLER_4: 37,
    SOUND_CONTROLLER_5: 38,
    SOUND_CONTROLLER_6: 39,
    SOUND_CONTROLLER_7: 40,
    SOUND_CONTROLLER_8: 41,
    SOUND_CONTROLLER_9: 42,
    SOUND_CONTROLLER_10: 43,
    GENERAL_PURPOSE_5: 44,
    GENERAL_PURPOSE_6: 45,
    GENERAL_PURPOSE_7: 46,
    GENERAL_PURPOSE_8: 47,
    PORTAMENTO_CONTROL: 48,
    EFFECTS_DEPTH_1: 49,
    EFFECTS_DEPTH_2: 50,
    EFFECTS_DEPTH_3: 51,
    EFFECTS_DEPTH_4: 52,
    EFFECTS_DEPTH_5: 53,
    DATA_INCREMENT: 54,
    DATA_DECREMENT: 55,
    NRPN_LSB: 56,
    NRPN_MSB: 57,
    RPN_LSB: 58,
    RPN_MSB: 59,
    ALL_SOUNDS_OFF: 60,
    ALL_CONTROLLERS_OFF: 61,
    LOCAL_KEYBOARD: 62,
    ALL_NOTES_OFF: 63,
    OMNI_MODE_OFF: 64,
    OMNI_MODE_ON: 65,
    MONO_OPERATION: 66,
    POLY_OPERATION: 67,
    getValue: function (a) {
        switch (a) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return 121;
            case MidiControllerType.ALL_NOTES_OFF:
                return 123;
            case MidiControllerType.ALL_SOUNDS_OFF:
                return 120;
            case MidiControllerType.BALANCE:
                return 8;
            case MidiControllerType.BANK_SELECT:
                return 0;
            case MidiControllerType.BREATH_CONTROLLER:
                return 2;
            case MidiControllerType.BALANCE_LSB:
                return 40;
            case MidiControllerType.BANK_SELECT_LSB:
                return 32;
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return 34;
            case MidiControllerType.DAMPER_PEDAL:
                return 64;
            case MidiControllerType.DATA_DECREMENT:
                return 97;
            case MidiControllerType.DATA_ENTRY_MSB:
                return 6;
            case MidiControllerType.DATA_INCREMENT:
                return 96;
            case MidiControllerType.DATA_ENTRY_LSB:
                return 0;
            case MidiControllerType.EFFECTS_DEPTH_1:
                return 91;
            case MidiControllerType.EFFECTS_DEPTH_2:
                return 92;
            case MidiControllerType.EFFECTS_DEPTH_3:
                return 93;
            case MidiControllerType.EFFECTS_DEPTH_4:
                return 94;
            case MidiControllerType.EFFECTS_DEPTH_5:
                return 95;
            case MidiControllerType.EFFECT_CONTROL_1:
                return 12;
            case MidiControllerType.EFFECT_CONTROL_2:
                return 13;
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return 44;
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return 45;
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return 43;
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return 11;
            case MidiControllerType.FOOT_CONTROLLER:
                return 4;
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return 36;
            case MidiControllerType.GENERAL_PURPOSE_1:
                return 16;
            case MidiControllerType.GENERAL_PURPOSE_2:
                return 17;
            case MidiControllerType.GENERAL_PURPOSE_3:
                return 18;
            case MidiControllerType.GENERAL_PURPOSE_4:
                return 19;
            case MidiControllerType.GENERAL_PURPOSE_5:
                return 80;
            case MidiControllerType.GENERAL_PURPOSE_6:
                return 81;
            case MidiControllerType.GENERAL_PURPOSE_7:
                return 82;
            case MidiControllerType.GENERAL_PURPOSE_8:
                return 83;
            case MidiControllerType.HOLD_2:
                return 69;
            case MidiControllerType.LOCAL_KEYBOARD:
                return 0;
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return 68;
            case MidiControllerType.MODULATION:
                return 1;
            case MidiControllerType.MODULATION_LSB:
                return 33;
            case MidiControllerType.MONO_OPERATION:
                return 126;
            case MidiControllerType.NRPN_LSB:
                return 98;
            case MidiControllerType.NRPN_MSB:
                return 99;
            case MidiControllerType.OMNI_MODE_OFF:
                return 124;
            case MidiControllerType.OMNI_MODE_ON:
                return 125;
            case MidiControllerType.PAN:
                return 10;
            case MidiControllerType.PORTAMENTO:
                return 65;
            case MidiControllerType.PORTAMENTO_CONTROL:
                return 84;
            case MidiControllerType.PORTAMENTO_TIME:
                return 5;
            case MidiControllerType.PAN_LSB:
                return 42;
            case MidiControllerType.POLY_OPERATION:
                return 127;
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return 37;
            case MidiControllerType.RPN_LSB:
                return 100;
            case MidiControllerType.RPN_MSB:
                return 101;
            case MidiControllerType.SOFT_PEDAL:
                return 67;
            case MidiControllerType.SOSTENUTO:
                return 66;
            case MidiControllerType.SOUND_CONTROLLER_1:
                return 70;
            case MidiControllerType.SOUND_CONTROLLER_2:
                return 71;
            case MidiControllerType.SOUND_CONTROLLER_3:
                return 72;
            case MidiControllerType.SOUND_CONTROLLER_4:
                return 73;
            case MidiControllerType.SOUND_CONTROLLER_5:
                return 74;
            case MidiControllerType.SOUND_CONTROLLER_6:
                return 75;
            case MidiControllerType.SOUND_CONTROLLER_7:
                return 76;
            case MidiControllerType.SOUND_CONTROLLER_8:
                return 77;
            case MidiControllerType.SOUND_CONTROLLER_9:
                return 78;
            case MidiControllerType.SOUND_CONTROLLER_10:
                return 79;
            case MidiControllerType.VOLUME:
                return 7;
            case MidiControllerType.VOLUME_LSB:
                return 39
        }
        console.log("Warning unknown midi controller type " + a);
        return 0
    }
};

var MidiDrum = {
    BASS_DRUM_2: 35,
    BASS_DRUM_1: 36,
    RIMSHOT: 37,
    SNARE_DRUM_1: 38,
    HAND_CLAP: 39,
    SNARE_DRUM_2: 40,
    LOW_TOM_2: 41,
    CLOSED_HIHAT: 42,
    LOW_TOM_1: 43,
    PEDAL_HIHAT: 44,
    MID_TOM_2: 45,
    OPEN_HIHAT: 46,
    MID_TOM_1: 47,
    HIGH_TOM_2: 48,
    CRASH_CYMBAL_1: 49,
    HIGH_TOM_1: 50,
    RIDE_CYMBAL_1: 51,
    CHINESE_CYMBAL: 52,
    RIDE_BELL: 53,
    TAMBOURINE: 54,
    SPLASH_CYMBAL: 55,
    COWBELL: 56,
    CRASH_CYMBAL_2: 57,
    VIBRA_SLAP: 58,
    RIDE_CYMBAL_2: 59,
    HIGH_BONGO: 60,
    LOW_BONGO: 61,
    MUTE_HIGH_CONGA: 62,
    OPEN_HIGH_CONGA: 63,
    LOW_CONGA: 64,
    HIGH_TIMBALE: 65,
    LOW_TIMBALE: 66,
    HIGH_AGOGO: 67,
    LOW_AGOGO: 68,
    CABASA: 69,
    MARACAS: 70,
    SHORT_WHISTLE: 71,
    LONG_WHISTLE: 72,
    SHORT_GUIRO: 73,
    LONG_GUIRO: 74,
    CLAVES: 75,
    HIGH_WOOD_BLOCK: 76,
    LOW_WOOD_BLOCK: 77,
    MUTE_CUICA: 78,
    OPEN_CUICA: 79,
    MUTE_TRIANGLE: 80,
    OPEN_TRIANGLE: 81
};

var MidiProgram = {
    ACOUSTIC_GRAND_PIANO: 0,
    BRIGHT_ACOUSTIC_PIANO: 1,
    ELECTRIC_GRAND_PIANO: 2,
    HONKY_TONK_PIANO: 3,
    ELECTRIC_PIANO_1: 4,
    ELECTRIC_PIANO_2: 5,
    HARPSICHORD: 6,
    CLAVINET: 7,
    CELESTA: 8,
    GLOCKENSPIEL: 9,
    MUSIC_BOX: 10,
    VIBRAPHONE: 11,
    MARIMBA: 12,
    XYLOPHONE: 13,
    TUBULAR_BELLS: 14,
    DULCIMER: 15,
    DRAWBAR_ORGAN: 16,
    PERCUSSIVE_ORGAN: 17,
    ROCK_ORGAN: 18,
    CHURCH_ORGAN: 19,
    REED_ORGAN: 20,
    ACCORDION: 21,
    HARMONICA: 22,
    TANGO_ACCORDION: 23,
    ACOUSTIC_NYLON_GUITAR: 24,
    ACOUSTIC_STEEL_GUITAR: 25,
    ELECTRIC_JAZZ_GUITAR: 26,
    ELECTRIC_CLEAN_GUITAR: 27,
    ELECTRIC_MUTED_GUITAR: 28,
    OVERDRIVEN_GUITAR: 29,
    DISTORTION_GUITAR: 30,
    GUITAR_HARMONICS: 31,
    ACOUSTIC_BASS: 32,
    ELECTRIC_FINGER_BASS: 33,
    ELECTRIC_PICK_BASS: 34,
    FRETLESS_BASS: 35,
    SLAP_BASS_1: 36,
    SLAP_BASS_2: 37,
    SYNTH_BASS_1: 38,
    SYNTH_BASS_2: 39,
    VIOLIN: 40,
    VIOLA: 41,
    CELLO: 42,
    CONTRABASS: 43,
    TREMOLO_STRINGS: 44,
    PIZZICATO_STRINGS: 45,
    ORCHESTRAL_HARP: 46,
    TIMPANI: 47,
    STRING_ENSEMBLE_1: 48,
    STRING_ENSEMBLE_2: 49,
    SYNTH_STRINGS_1: 50,
    SYNTH_STRINGS_2: 51,
    CHOIR_AAHS: 52,
    VOICE_OOHS: 53,
    SYNTH_CHOIR: 54,
    ORCHESTRA_HIT: 55,
    TRUMPET: 56,
    TROMBONE: 57,
    TUBA: 58,
    MUTED_TRUMPET: 59,
    FRENCH_HORN: 60,
    BRASS_SECTION: 61,
    SYNTH_BRASS_1: 62,
    SYNTH_BRASS_2: 63,
    SOPRANO_SAX: 64,
    ALTO_SAX: 65,
    TENOR_SAX: 66,
    BARITONE_SAX: 67,
    OBOE: 68,
    ENGLISH_HORN: 69,
    BASSOON: 70,
    CLARINET: 71,
    PICCOLO: 72,
    FLUTE: 73,
    RECORDER: 74,
    PAN_FLUTE: 75,
    BLOWN_BOTTLE: 76,
    SHAKUHACHI: 77,
    WHISTLE: 78,
    OCARINA: 79,
    SQUARE_LEAD: 80,
    SAW_LEAD: 81,
    CALLIOPE_LEAD: 82,
    CHIFF_LEAD: 83,
    CHARANG_LEAD: 84,
    VOICE_LEAD: 85,
    FIFTHS_LEAD: 86,
    BASS_PLUS_LEAD: 87,
    NEW_AGE_PAD: 88,
    WARM_PAD: 89,
    POLYSYNTH_PAD: 90,
    CHOIR_PAD: 91,
    BOWED_PAD: 92,
    METALLIC_PAD: 93,
    HALO_PAD: 94,
    SWEEP_PAD: 95,
    RAIN_SFX: 96,
    SOUNDTRACK_SFX: 97,
    CRYSTAL_SFX: 98,
    ATMOSPHERE_SFX: 99,
    BRIGHTNESS_SFX: 100,
    GOBLINS_SFX: 101,
    ECHOES_SFX: 102,
    SCIFI_SFX: 103,
    SITAR: 104,
    BANJO: 105,
    SHAMISEN: 106,
    KOTO: 107,
    KALIMBA: 108,
    BAGPIPE: 109,
    FIDDLE: 110,
    SHANAI: 111,
    TINKLE_BELL: 112,
    AGOGO: 113,
    STEEL_DRUMS: 114,
    WOODBLOCK: 115,
    TAIKO_DRUM: 116,
    MELODIC_TOM: 117,
    SYNTH_DRUM: 118,
    REVERSE_CYMBAL: 119,
    GUITAR_FRET_NOISE: 120,
    BREATH_NOISE: 121,
    SEASHORE: 122,
    BIRD_TWEET: 123,
    TELEPHONE_RING: 124,
    HELICOPTER: 125,
    APPLAUSE: 126,
    GUNSHOT: 127
};


function MidiRenderer() {
    this.id = "";
    this.structure = "";
    this.channelMaps = [];
    this.controlChannelMaps = [];
    this._constructorName = "MidiRenderer"
}

function MidiChannelMap() {
    this.id = "";
    this.renderChannel = "";
    this.program = MidiProgram.ACOUSTIC_GRAND_PIANO;
    this.channel = 0;
    this.initialControllerMessages = [];
    this._constructorName = "MidiChannelMap"
}

function MidiControlChannelMap() {
    this.id = "";
    this.controlChannel = "";
    this.channel = 0;
    this.amplitude = 1;
    this.bias = 0;
    this.controllerType = MidiControllerType.VOLUME;
    this._constructorName = "MidiControlChannelMap"
}

function InitialMidiControllerMessage() {
    this.id = "";
    this.type = MidiControllerType.VOLUME;
    this.value = 64;
    this._constructorName = "InitialMidiControllerMessage"
}
InitialMidiControllerMessage.prototype.setType = function (a) {
    this.type = a;
    return this
};
InitialMidiControllerMessage.prototype.setValue = function (a) {
    this.value = a;
    return this
};
MidiRenderer.prototype.getMidiData = function (y, c, h) {
    var s = {};
    if (!h) {
        h = {
            exportEffects: true,
            exportVolume: true
        }
    }
    s.fileFormat = 0;
    s.midiDivisions = 192;
    var E = [];
    var z = {};
    E.push(z);
    var w = [];
    z.trackEvents = w;
    var m = 0;
    var b = y.getEvents();
    var G = 192;
    var k = {};
    var n = {};
    for (var D = 0; D < this.controlChannelMaps.length; D++) {
        var H = this.controlChannelMaps[D];
        n[H.controlChannel] = H
    }
    var p = {};
    for (var D = 0; D < this.channelMaps.length; D++) {
        var H = this.channelMaps[D];
        p[H.renderChannel] = H;
        k[H.channel] = true
    }
    for (var D = 0; D < b.length; D++) {
        var C = b[D];
        if (C.type == "noteOn" || C.type == "noteOff") {
            var t = p[C.renderChannel.id];
            if (t) {
                k[t.channel] = false
            }
        }
    }
    var v = {};
    for (var D = 0; D < this.channelMaps.length; D++) {
        var H = this.channelMaps[D];
        if (!k[H.channel]) {
            if (!v[H.channel]) {
                var q = {
                    eventTime: 0,
                    eventMessage: {
                        messageClass: "ProgramChangeMessage",
                        channel: H.channel,
                        program: H.program
                    }
                };
                w.push(q);
                v[H.channel] = true
            }
            for (var B = 0; B < H.initialControllerMessages.length; B++) {
                var r = H.initialControllerMessages[B];
                var a = MidiControllerType.getValue(r.type);
                if (h.exportEffects && r.type != MidiControllerType.VOLUME || h.exportVolume && r.type == MidiControllerType.VOLUME) {
                    q = {
                        eventTime: 0,
                        eventMessage: {
                            messageClass: "ChannelMessage",
                            channel: H.channel,
                            status: "CONTROL_CHANGE",
                            data1: a,
                            data2: r.value
                        }
                    };
                    w.push(q)
                } else { }
            }
        } else { }
    }
    var I = 0;
    for (var D = 0; D < b.length; D++) {
        var C = b[D];
        var g = C.time - m;
        var x = Math.round(G * g);
        I += x;
        var q = null;
        if (C.type == "noteOn" || C.type == "noteOff") {
            var t = p[C.renderChannel.id];
            if (!t) {
                t = {
                    channel: 0
                }
            }
            var f = C.type == "noteOn";
            var A = f ? "NOTE_ON" : "NOTE_OFF";
            var u = f ? C.onVelocity : C.offVelocity;
            var o = Math.round(clamp(u * 127, 0, 127));
            q = {
                eventTime: x,
                eventMessage: {
                    messageClass: "VoiceMessage",
                    status: A,
                    channel: t.channel,
                    data1: C.note,
                    data2: o
                }
            }
        } else {
            if (C.type == "setControl") {
                var e = n[C.controlChannel.id];
                if (!e) {
                    continue
                } else { }
                var l = clamp(Math.round(C.value * e.amplitude + e.bias), 0, 127);
                var a = MidiControllerType.getValue(e.controllerType);
                if (e && (h.exportEffects && e.controllerType != MidiControllerType.VOLUME || h.exportVolume && e.controllerType == MidiControllerType.VOLUME)) {
                    if (!k[e.channel]) {
                        q = {
                            eventTime: x,
                            eventMessage: {
                                messageClass: "ChannelMessage",
                                channel: e.channel,
                                status: "CONTROL_CHANGE",
                                data1: a,
                                data2: l
                            }
                        }
                    }
                } else { }
            } else {
                if (C.type == "setTempo") {
                    var d = 60000000;
                    var F = Math.round(d / C.bpm);
                    q = {
                        eventTime: x,
                        eventMessage: {
                            messageClass: "SetTempoMessage",
                            microsPerQuarter: F
                        }
                    }
                } else {
                    console.log("Unknown event type " + C.type)
                }
            }
        }
        if (q) {
            w.push(q);
            m = C.time
        }
    }
    w.push({
        eventTime: G,
        eventMessage: {
            messageClass: "EndTrackMessage"
        }
    });
    s.midiTracks = E;
    return s
};

function DataSample(a) {
    this.likelihood = getValueOrDefault(a, "likelihood", 1);
    this.active = true;
    this._constructorName = "DataSample"
}

function IntDataSample(a) {
    DataSample.call(this, a);
    this.data = 0;
    this._constructorName = "IntDataSample"
}
IntDataSample.prototype = new DataSample();

function IntListDataSample(a) {
    DataSample.call(this, a);
    this.data = [];
    this._constructorName = "IntListDataSample"
}
IntListDataSample.prototype = new DataSample();

function IntList2DDataSample(a) {
    DataSample.call(this, a);
    this.data = [];
    this._constructorName = "IntList2DDataSample"
}
IntList2DDataSample.prototype = new DataSample();

function FloatDataSample(a) {
    DataSample.call(this, a);
    this.data = 0;
    this._constructorName = "FloatDataSample"
}
FloatDataSample.prototype = new DataSample();

function FloatListDataSample(a) {
    DataSample.call(this, a);
    this.data = [];
    this._constructorName = "FloatListDataSample"
}
FloatListDataSample.prototype = new DataSample();

function MidiProgramDataSample(a) {
    DataSample.call(this, a);
    this.data = getValueOrDefault(a, "data", MidiProgram.ACOUSTIC_GRAND_PIANO);
    this._constructorName = "MidiProgramDataSample"
}
MidiProgramDataSample.prototype = new DataSample();

function MidiDrumDataSample(a) {
    DataSample.call(this, a);
    this.data = getValueOrDefault(a, "data", MidiDrum.BASS_DRUM_1);
    this._constructorName = "MidiDrumDataSample"
}
MidiDrumDataSample.prototype = new DataSample();

function PhraseGroupTypeDataSample(a) {
    DataSample.call(this, a);
    this.data = getValueOrDefault(a, "data", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT);
    this._constructorName = "PhraseGroupTypeDataSample"
}
PhraseGroupTypeDataSample.prototype = new DataSample();

function ModulationTargetDataSample(a) {
    DataSample.call(this, a);
    this.data = getValueOrDefault(a, "data", DynamicHarmonyModulationTarget.MEDIANT);
    this._constructorName = "ModulationTargetDataSample"
}
ModulationTargetDataSample.prototype = new DataSample();

function SongPartStructureInfoDataSample(a) {
    DataSample.call(this, a);
    this.data = [new SongPartStructureInfo()];
    this._constructorName = "SongPartStructureInfoDataSample"
}
SongPartStructureInfoDataSample.prototype = new DataSample();
SongPartStructureInfoDataSample.prototype.data_allowedTypes = {
    SongPartStructureInfo: 1
};

function HarmonicPlanDataSample(a) {
    DataSample.call(this, a);
    this.data = [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT];
    this._constructorName = "HarmonicPlanDataSample"
}
HarmonicPlanDataSample.prototype = new DataSample();

var SimpleModuleGeneratorPhraseGroupType = {
    SINGLE_COMPLETE: 0,
    TONIC_PROLONG_PLUS_COMPLETE: 1,
    DECEPTIVE_PLUS_COMPLETE: 2,
    COMPLETE_PLUS_COMPLETE: 3,
    ANTECEDENT_CONSEQUENT: 4,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE: 5,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG: 6,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE: 7,
    TONICIZE_PLUS_COMPLETE: 8,
    COMPLETE_PLUS_MODULATE: 9,
    MODULATE_PLUS_MODULATE_BACK: 10,
    MODULATE_PLUS_COMPLETE: 11,
    INCOMPLETE_PLUS_MODULATE: 12,
    INCOMPLETE_SHORTER_PLUS_COMPLETE: 13,
    INCOMPLETE_WEAK_PLUS_COMPLETE_WEAK_TONIC: 14,
    COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE: 15,
    SINGLE_INCOMPLETE: 16,
    SINGLE_TONIC_PROLONG: 17,
    INCOMPLETE_PLUS_COMPLETE: 18,
    ANTECEDENT_CONSEQUENT_SHORTEN: 19,
    COMPLETE_PLUS_PHRASE_MODULATE: 20,
    TONICIZE_PLUS_TONICIZE: 21,
    INCOMPLETE_INITIAL_PLUS_COMPLETE: 22,
    PHRASE_MODULATE: 23,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG: 24,
    INCOMPLETE_PLUS_DOMINANT_PROLONG: 25,
    INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE: 26,
    SINGLE_COMPLETE_PLAGIAL: 27,
    SINGLE_SILENT: 28,
    COMPLETE_PLAGIAL_PLUS_COMPLETE: 29,
    COMPLETE_PLUS_COMPLETE_PLAGIAL: 30,
    CUSTOM: 31,
    SINGLE_CUSTOM_HARMONY: 32,
    DOUBLE_CUSTOM_HARMONY: 33,
    INCOMPLETE_PLUS_COMPLETE_IMPERFECT: 34,
    SINGLE_COMPLETE_IMPERFECT: 35,
    INCOMPLETE_PLUS_DECEPTIVE: 36,
    DECEPTIVE_PLUS_DECEPTIVE: 37,
    COMPLETE_IMPERFECT_PLUS_DECEPTIVE: 38,
    TONICIZE_PLUS_DECEPTIVE: 39,
    SINGLE_DECEPTIVE: 40,
    COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT: 41,
    COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 42,
    INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 43,
    INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 44,
    DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 45,
    DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 46,
    MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 47,
    MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 48,
    TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 49,
    TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 50,
    INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT: 51,
    INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 52,
    tonicizeOrModulate: function (a) {
        switch (a) {
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
            case SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return true
        }
        return false
    }
};

var SongPartType = {
    VERSE_1: 0,
    VERSE_2: 1,
    CHORUS_1: 2,
    CHORUS_2: 3,
    BRIDGE_1: 4,
    BRIDGE_2: 5,
    MISC_1: 6,
    MISC_2: 7,
    getIndex: function (a) {
        switch (a) {
            case SongPartType.VERSE_1:
            case SongPartType.BRIDGE_1:
            case SongPartType.CHORUS_1:
            case SongPartType.MISC_1:
                return 0;
            case SongPartType.VERSE_2:
            case SongPartType.BRIDGE_2:
            case SongPartType.CHORUS_2:
            case SongPartType.MISC_2:
                return 1
        }
        return 0
    },
    isVerse: function (a) {
        switch (a) {
            case SongPartType.VERSE_1:
            case SongPartType.VERSE_2:
                return true
        }
        return false
    },
    isChorus: function (a) {
        switch (a) {
            case SongPartType.CHORUS_1:
            case SongPartType.CHORUS_2:
                return true
        }
        return false
    },
    isBridge: function (a) {
        switch (a) {
            case SongPartType.BRIDGE_1:
            case SongPartType.BRIDGE_2:
                return true
        }
        return false
    },
    toIndicatorString: function (a) {
        switch (a) {
            case SongPartType.BRIDGE_1:
                return "bridge1";
            case SongPartType.BRIDGE_2:
                return "bridge2";
            case SongPartType.CHORUS_1:
                return "chorus1";
            case SongPartType.CHORUS_2:
                return "chorus2";
            case SongPartType.VERSE_1:
                return "verse1";
            case SongPartType.VERSE_2:
                return "verse2";
            case SongPartType.MISC_1:
                return "misc1";
            case SongPartType.MISC_2:
                return "misc2"
        }
        return "verse1"
    }
};


function MotifRythmInfo(a) {
    this.noteCountRange = [0.25, 1];
    this.zone1Prob = 0.5;
    this.zone1TripletLikelihood = getValueOrDefault(a, "zone1TripletLikelihood", 0.5);
    this.zone1DotSecondLikelihood = getValueOrDefault(a, "zone1DotSecondLikelihood", 0.5);
    this.zone1DotFirstLikelihood = getValueOrDefault(a, "zone1DotFirstLikelihood", 2);
    this.zone1DotNormalDotLikelihood = getValueOrDefault(a, "zone1DotNormalDotLikelihood", 0.5);
    this.zone1NormalDotDotLikelihood = getValueOrDefault(a, "zone1NormalDotDotLikelihood", 0.5);
    this.zone1DotDotNormalLikelihood = getValueOrDefault(a, "zone1DotDotNormalLikelihood", 0.5);
    this.zone1StartPosRange = getValueOrDefault(a, "zone1StartPosRange", [0, 0]);
    this.zone1EndPosRange = getValueOrDefault(a, "zone1EndPosRange", [0.75, 0.75]);
    this._constructorName = "MotifRythmInfo"
}
var MelodyOffsetLevel = {
    VERY_LOW: -2,
    LOW: -1,
    MIDDLE: 0,
    HIGH: 1,
    VERY_HIGH: 2
};


function RenderAmountStrengthMap() {
    this.veryWeak = [0.02];
    this.weak = [0.15];
    this.medium = [0.4];
    this.strong = [0.7];
    this.veryStrong = [1];
    this._constructorName = "RenderAmountStrengthMap"
}

function IndexPropertyIndex() {
    this.indexProperty = PhraseGroupIndexProperty.HARMONY_RYTHM;
    this.otherPartType = SongPartType.VERSE_1;
    this._constructorName = "IndexPropertyIndex"
}

function SongPartTypeOverrideInfo(a) {
    AbstractSongPartStructureInfo.call(this, a);
    this.customPhraseTypes = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE];
    this.sameGroupIndexSames = getValueOrDefault(a, "sameGroupIndexSames", []);
    this.sameGroupIndexDifferents = getValueOrDefault(a, "sameGroupIndexDifferents", []);
    this.differentGroupIndexSameInfos = [];
    this.differentGroupIndexDifferentInfos = [];
    this._constructorName = "SongPartTypeOverrideInfo"
}
var PhraseGroupIndexProperty = {
    MELODY_SHAPE: 0,
    BASS_SHAPE: 1,
    HARMONY: 2,
    HARMONY_RYTHM: 3,
    SUSPEND: 4,
    MELODY_INSTRUMENT_DISTRIBUTION: 5,
    INNER_1_INSTRUMENT_DISTRIBUTION: 6,
    INNER_2_INSTRUMENT_DISTRIBUTION: 7,
    BASS_INSTRUMENT_DISTRIBUTION: 8,
    MELODY_MOTIF_DISTRIBUTION: 9,
    INNER_1_MOTIF_DISTRIBUTION: 10,
    INNER_2_MOTIF_DISTRIBUTION: 11,
    BASS_MOTIF_DISTRIBUTION: 12,
    HARMONY_CHARACTERISTIC: 13,
    PERCUSSION_MOTIF_DISTRIBUTION: 14,
    RENDER_AMOUNT: 15,
    TEMPO: 16,
    PERCUSSION_FILL_DISTRIBUTION: 17,
    TEMPO_CHANGE_1: 18,
    TEMPO_CHANGE_2: 19,
    MELODY_EFFECTS: 20,
    INNER_1_EFFECTS: 21,
    INNER_2_EFFECTS: 22,
    BASS_EFFECTS: 23,
    PERCUSSION_EFFECTS: 24
};

var SongPartStrength = {
    DEFAULT: 0,
    VERY_WEAK: 1,
    WEAK: 2,
    MEDIUM: 3,
    STRONG: 4,
    VERY_STRONG: 5,
    toIndicatorString: function (a) {
        switch (a) {
            case SongPartStrength.DEFAULT:
                return "";
            case SongPartStrength.MEDIUM:
                return "medium";
            case SongPartStrength.STRONG:
                return "strong";
            case SongPartStrength.VERY_STRONG:
                return "veryStrong";
            case SongPartStrength.VERY_WEAK:
                return "veryWeak";
            case SongPartStrength.WEAK:
                return "weak"
        }
        return ""
    }
};


function AbstractSongPartStructureInfo() {
    this.partType = SongPartType.VERSE_1;
    this.harmonyRythmCountOverrides = [];
    this.harmonyTotalLengthOverrides = [];
    this.overridePhraseGroupType = false;
    this.phraseGroupType = SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN;
    this.overrideMajorModulationTarget = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.overrideMinorModulationTarget = false;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.overrideScaleBaseNote = false;
    this.scaleBaseNote = 60;
    this.overrideScaleType = false;
    this.scaleType = ScaleType.MAJOR;
    this.harmonyElementIndices = [];
    this.customMelodyCurveIndices = [];
    this.customBassCurveIndices = [];
    this.extraMelodyRenderElementIndices = [];
    this.extraInner1RenderElementIndices = [];
    this.extraInner2RenderElementIndices = [];
    this.extraBassRenderElementIndices = [];
    this.extraPercussionRenderElementIndices = [];
    this.melodyShapeIndexOverride = [];
    this.bassShapeIndexOverride = [];
    this.harmonyIndexOverride = [];
    this.harmonyRythmIndexOverride = [];
    this.suspendIndexOverride = [];
    this.melodyChannelDistributionIndexOverride = [];
    this.inner1ChannelDistributionIndexOverride = [];
    this.inner2ChannelDistributionIndexOverride = [];
    this.bassChannelDistributionIndexOverride = [];
    this.melodyMotifDistributionIndexOverride = [];
    this.inner1MotifDistributionIndexOverride = [];
    this.inner2MotifDistributionIndexOverride = [];
    this.bassMotifDistributionIndexOverride = [];
    this.percussionMotifDistributionIndexOverride = [];
    this.percussionFillMotifDistributionIndexOverride = [];
    this.harmonyExtraIndexOverride = [];
    this.renderAmountIndexOverride = [];
    this.tempoIndexOverride = [];
    this.sequentialTempoChangeIndexOverride = [];
    this.parallelTempoChangeIndexOverride = [];
    this.sequentialMelodyEffectChangeIndexOverride = [];
    this.sequentialInner1EffectChangeIndexOverride = [];
    this.sequentialInner2EffectChangeIndexOverride = [];
    this.sequentialBassEffectChangeIndexOverride = [];
    this.sequentialPercussionEffectChangeIndexOverride = []
}

function SongPartStructureInfo(a) {
    AbstractSongPartStructureInfo.call(this, a);
    this.strength = getValueOrDefault(a, "strength", SongPartStrength.DEFAULT);
    this.prefixProbsOverride = getValueOrDefault(a, "prefixProbsOverride", []);
    this.postfixProbsOverride = getValueOrDefault(a, "postfixProbsOverride", []);
    this.majorGroupModulationTarget = getValueOrDefault(a, "majorGroupModulationTarget", -1);
    this.minorGroupModulationTarget = getValueOrDefault(a, "minorGroupModulationTarget", -1);
    this.melodyRenderAmountOverride = [];
    this.inner1RenderAmountOverride = [];
    this.inner2RenderAmountOverride = [];
    this.bassRenderAmountOverride = [];
    this.percussionRenderAmountOverride = [];
    this.prefixInfoOverrides = [];
    this.postfixInfoOverrides = [];
    this._constructorName = "SongPartStructureInfo"
}

function CustomVoiceLineCurveInfo(a) {
    this.amplitude = 1;
    this.bias = 0;
    this.type = 0;
    this.curveId = "";
    this._constructorName = "CustomVoiceLineCurveInfo"
}
CustomVoiceLineCurveInfo.prototype.counter = 0;
CustomVoiceLineCurveInfo.prototype.getCurve = function () {
    return null
};

function LinearInterpolatedCustomVoiceLineCurveInfo() {
    CustomVoiceLineCurveInfo.call(this);
    this.xValues = [0, 1];
    this.yValues = [60, 70];
    this._constructorName = "LinearInterpolatedCustomVoiceLineCurveInfo"
}
LinearInterpolatedCustomVoiceLineCurveInfo.prototype = new CustomVoiceLineCurveInfo();
LinearInterpolatedCustomVoiceLineCurveInfo.prototype.getCurve = function () {
    var a = new LinearInterpolationCurve();
    a.xValues = arrayCopy(this.xValues);
    a.yValues = arrayCopy(this.yValues);
    if (!this.curveId) {
        this.curveId = "CustomVoiceLineCurveInfo" + CustomVoiceLineCurveInfo.prototype.counter;
        CustomVoiceLineCurveInfo.prototype.counter++
    }
    a.id = this.curveId;
    return a
};
var InstrumentCapabilityProperty = {
    STRUM: 0,
    SLOW_BLOCK_CHORD: 1,
    QUICK_BLOCK_CHORD: 2,
    SLOW_ARPEGGIO: 3,
    QUICK_ARPEGGIO: 4,
    HARMONIZED_ARPEGGIO: 5,
    SLOW_MELODY: 6,
    QUICK_MELODY: 7,
    SLOW_BASS: 8,
    QUICK_BASS: 9,
    LONG_NOTE: 10,
    VIBRATO: 11,
    TREMOLO: 12,
    PORTAMENTO: 13,
    TRILL: 14,
    GLISSANDO: 15,
    NOTE_BEND: 16,
    SLIDE: 17,
    FILTER_FREQ_CHANGE: 18,
    FILTER_BW_CHANGE: 19,
    VELOCITY_CHANGE: 20,
    PAN_CHANGE: 21,
    NOTE_RANGE: 22
};
var SimpleModuleGeneratorInstrumentSetType = {
    ACOUSTIC: 0,
    ELECTRIC: 1,
    ELECTRONIC: 2
};
var SimpleModuleGeneratorHarmonyStyleType = {
    BLOCK_CHORDS_SIMPLE: 0,
    ARPEGGIO_RESTARTING: 1,
    SLOW_VOICE: 2,
    SLOW_HARMONIZED_VOICE: 3,
    BLOCK_CHORDS_SMOOTH: 4,
    SINGLE_STRUM: 5,
    ARPEGGIO_RESTARTING_HARMONIZED: 6,
    ARPEGGIO_RESTARTING_WITH_THIRDS: 7,
    ARPEGGIO_RESTARTING_WITH_SIXTHS: 8,
    ARPEGGIO_RESTARTING_WITH_OCTAVES: 9,
    SINGLE_BLOCK_CHORD: 10,
    SIMPLE_ARPEGGIO_RESTARTING: 11,
    SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED: 12,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS: 13,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS: 14,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES: 15,
    STRUMS: 16
};
var SimpleModuleGeneratorBassType = {
    REPEATED: 0,
    OCTAVES: 1,
    FIFTHS: 2,
    ARPEGGIO: 3,
    MELODIC: 4
};

function createSectionInfos(y) {
    var r = [];
    var j = y.songStructureInfo;
    var t = j.phraseTypeIndices;
    var o = j.melodyChannelDistributionIndices;
    var G = j.inner1ChannelDistributionIndices;
    var z = j.inner2ChannelDistributionIndices;
    var B = j.bassChannelDistributionIndices;
    var w = j.melodyMotifDistributionIndices;
    var C = j.inner1MotifDistributionIndices;
    var E = j.inner2MotifDistributionIndices;
    var g = j.bassMotifDistributionIndices;
    var m = j.percussionMotifDistributionIndices;
    var x = j.percussionFillMotifDistributionIndices;
    var k = j.harmonyRythmIndices;
    var F = j.harmonyIndices;
    var h = j.harmonyExtraIndices;
    var a = j.melodyShapeIndices;
    var p = j.bassShapeIndices;
    var d = j.suspendIndices;
    var q = j.renderAmountIndices;
    var v = j.tempoIndices;
    var c = j.sequentialMelodyEffectChangeIndices;
    var l = j.sequentialInner1EffectChangeIndices;
    var b = j.sequentialInner2EffectChangeIndices;
    var n = j.sequentialBassEffectChangeIndices;
    var s = j.sequentialPercussionEffectChangeIndices;
    var f = j.sequentialTempoChangeIndices;
    var u = j.parallelTempoChangeIndices;
    var e = j.modifierFunctions;
    for (var A = 0; A < t.length; A++) {
        var D = new SimpleModuleGeneratorSectionInfo({
            renderAmountIndex: q[A],
            melodyShapeIndex: a[A],
            bassShapeIndex: p[A],
            suspendIndex: d[A],
            phraseIndex: t[A],
            harmonyIndex: F[A],
            harmonyExtraIndex: h[A],
            harmonyRythmIndex: k[A],
            percussionMotifDistributionIndex: m[A],
            percussionFillMotifDistributionIndex: x[A],
            melodyChannelDistributionIndex: o[A],
            inner1ChannelDistributionIndex: G[A],
            inner2ChannelDistributionIndex: z[A],
            bassChannelDistributionIndex: B[A],
            melodyMotifDistributionIndex: w[A],
            inner1MotifDistributionIndex: C[A],
            inner2MotifDistributionIndex: E[A],
            bassMotifDistributionIndex: g[A],
            tempoIndex: v[A],
            sequentialMelodyEffectChangeIndex: c[A],
            sequentialInner1EffectChangeIndex: l[A],
            sequentialInner2EffectChangeIndex: b[A],
            sequentialBassEffectChangeIndex: n[A],
            sequentialPercussionEffectChangeIndex: s[A],
            sequentialTempoChangeIndex: f[A],
            parallelTempoChangeIndex: u[A],
            modifierFunctions: e[A],
            index: A
        });
        r.push(D)
    }
    return r
}

function createOrGetRandom(d, c) {
    var e = c + "Rnd";
    var b = d[e];
    if (!b) {
        var a = d[c];
        if (!a) {
            a = Math.round(Math.random() * 472389472);
            console.log("Could not find seed " + c);
            d[c] = a
        }
        b = new MersenneTwister(a);
        d[e] = b
    }
    return b
}

function getOscillatingIndices(a, h, g, b, f, l, c) {
    var k = [];
    var j = a.random() * 6 + 3;
    var e = h;
    for (var d = 0; d < j; d++) {
        k.push(e);
        if (e == h) {
            e = sampleData([{
                data: h,
                likelihood: b
            }, {
                data: g,
                likelihood: f
            }], a)
        } else {
            e = sampleData([{
                data: g,
                likelihood: l
            }, {
                data: h,
                likelihood: c
            }], a)
        }
    }
    return k
}

function getMelodicVerticalIndices(e, r) {
    var q = [];
    var d = getValueOrDefault(r, "maxLeaps", 1);
    var k = getValueOrDefault(r, "sameMultFactor", 1);
    var n = getValueOrDefault(r, "leapRndInfos", [{
        data: 2,
        likelihood: 1
    }, {
        data: -2,
        likelihood: 1
    }]);
    var p = e.random() * 6 + 3;
    var l = 0;
    var b = 0;
    var c = d;
    var o = 1;
    for (var j = 0; j < p; j++) {
        q.push(l);
        var h = [];
        var f = 0;
        if (c == 0 || Math.abs(b) > 1) {
            var a = 1;
            var g = 1;
            if (l > 0) {
                g = 1 / (1 + l)
            } else {
                if (l < 0) {
                    a = 1 / (1 - l)
                }
            }
            f = sampleData([{
                data: 0,
                likelihood: 0.5 * o
            }, {
                data: -1,
                likelihood: 1 * a
            }, {
                data: 1,
                likelihood: 1 * g
            }], e);
            if (b > 2 && f > 0) {
                f = -f
            } else {
                if (b < -2 && f < 0) {
                    f = -f
                }
            }
        } else {
            var m = sampleData(n, e);
            f = m;
            if (b > 1 && f > 0) {
                f = -f
            } else {
                if (b < -1 && f < 0) {
                    f = -f
                }
            }
            c--
        }
        if (f == 0) {
            o *= k
        } else {
            o = 1
        }
        l += f;
        b = f
    }
    return q
}

function setMelodyMotifVerticalIndices(b, g, d, f, a) {
    var c = createOrGetRandom(f, "melodyMotifSeed");
    var e = getMelodicVerticalIndices(c, {
        sameMultFactor: 0.8,
        maxLeaps: sampleData([{
            data: 1,
            likelihood: 1
        }, {
            data: 0,
            likelihood: 1
        }], c),
        leapRndInfos: [{
            data: 7,
            likelihood: 1
        }, {
            data: -7,
            likelihood: 1
        }, {
            data: 6,
            likelihood: 2
        }, {
            data: -6,
            likelihood: 2
        }, {
            data: 5,
            likelihood: 4
        }, {
            data: -5,
            likelihood: 4
        }, {
            data: 4,
            likelihood: 8
        }, {
            data: -4,
            likelihood: 8
        }, {
            data: 3,
            likelihood: 16
        }, {
            data: -3,
            likelihood: 16
        }, {
            data: 2,
            likelihood: 32
        }, {
            data: -2,
            likelihood: 32
        }]
    });
    g.verticalIndices = e
}

function setMotifRythm(d, g, z, x, p, e, k) {
    var v = createOrGetRandom(x, e);
    var s = getValueOrDefault(d, "noteCountRange", [0.25, 1]);
    var h = getValueOrDefault(d, "zone1Prob", 0.5);
    var b = getValueOrDefault(d, "zone1TripletLikelihood", 0.5);
    var u = getValueOrDefault(d, "zone1DotSecondLikelihood", 0.5);
    var j = getValueOrDefault(d, "zone1DotFirstLikelihood", 2);
    var B = getValueOrDefault(d, "zone1DotNormalDotLikelihood", 0.5);
    var q = getValueOrDefault(d, "zone1NormalDotDotLikelihood", 0.5);
    var n = getValueOrDefault(d, "zone1DotDotNormalLikelihood", 0.5);
    var A = getValueOrDefault(d, "zone1StartPosRange", [0, 0]);
    var w = getValueOrDefault(d, "zone1EndPosRange", [0.75, 0.75]);
    var t = getValueOrDefault(d, "zone1StartEnd", []);
    var m = getValueOrDefault(d, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);
    g.noteCount = 1;
    g.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS;
    g.densitySeed = Math.round(v.random() * 947283493 + 142);
    g.densityCurveType = m;
    g.addZone1 = v.random() < h;

    function o(D, E) {
        var C = D[1] - D[0];
        return E.random() * C + D[0]
    }

    function y(E, D, C) {
        return [o(E, C), o(D, C)]
    }
    var r = y(A, w, v);
    var a = r[1] - r[0];
    var f = v.random() * a + r[0];
    var l = 1 - f;
    var c = Math.min(1, f + v.random() * l);
    if (t && t.length > 1) {
        f = t[0];
        c = t[1]
    }
    g.zone1PositionInterval = [f, c];
    g.zone1SplitStrategy = sampleData([{
        data: SplitStrategy.TRIPLET,
        likelihood: b
    }, {
        data: SplitStrategy.DOT_SECOND,
        likelihood: u
    }, {
        data: SplitStrategy.DOT_FIRST,
        likelihood: j
    }, {
        data: SplitStrategy.DOT_NORMAL_DOT,
        likelihood: B
    }, {
        data: SplitStrategy.NORMAL_DOT_DOT,
        likelihood: q
    }, {
        data: SplitStrategy.DOT_DOT_NORMAL,
        likelihood: n
    }], v);
    g.zone1MaxApplications = 1 + Math.floor(v.random() * 3);
    g.noteCount = s[0] + v.random() * (s[1] - s[0])
}

function setMelodyMotifEmbellishConnectStuff(l, j, e, h) {
    l.embellishStart = 0;
    l.embellishEnd = 0.5;
    l.connectStart = 0.75;
    l.connectEnd = 1;
    var b = createOrGetRandom(e, "melodyMotifEmbellishConnectSeed");
    var a = b.random();
    l.embellishEnd = 0.25 + 0.5 * b.random();
    if (b.random() < 0.5) {
        l.embellishStart = Math.max(0, l.embellishEnd - 0.25 - b.random() * 0.5)
    }
    var k = l.embellishEnd - l.embellishStart;
    var c = 1 - k - l.embellishStart;
    var f = b.random() * 0.75 * c + 0.25 * c;
    var d = c - f;
    var g = b.random() * d;
    l.connectStart = l.embellishEnd + g;
    l.connectEnd = l.connectStart + f;
    if (b.random() < 0.2) {
        l.addConnect = false
    }
}

function setHarmonyMotifEmbellishConnectStuff(f, c, e, a) {
    f.embellishStart = 0;
    f.embellishEnd = 1;
    var d = createOrGetRandom(e, "harmonyMotifEmbellishConnectSeed");
    var b = d.random();
    if (b < 0.25) {
        f.embellishStart = d.random() * 0.35;
        f.embellishEnd = 1 - d.random() * 0.35
    } else {
        if (b < 0.65) {
            f.embellishStart = d.random() * 0.6
        } else {
            f.embellishEnd = 1 - d.random() * 0.6
        }
    }
    f.addConnect = false
}

function setBassMotifEmbellishConnectStuff(g, d, f, b) {
    g.embellishStart = 0;
    g.embellishEnd = 0.75;
    g.connectStart = 0.75;
    g.connectEnd = 1;
    var e = createOrGetRandom(f, "bassMotifEmbellishConnectSeed");
    var c = e.random();
    if (c < 0.25) {
        var a = -0.25 + e.random() * 0.5;
        g.connectStart += a;
        g.embellishEnd -= a
    }
}

function createMelodyMotifInfo(c, h, e, f) {
    var j = {};
    var d = e.melodyMotifRythmCountIncreasePerIndex;
    var a = e.melodyMotifRythmCountIncreaseOffsetRange;
    var b = [c * d + Math.min(a[0], a[1]), c * d + Math.max(a[1], a[0])];
    if (c == 0) {
        j.noteCount = 1;
        j.noteCountUnit = CountUnit.PLAIN
    } else {
        setMotifRythm({
            zone1Prob: getArrayValueOrDefault(e.melodyMotifZone1Probabilities, c - 1, 0.5),
            zone1TripletLikelihood: getArrayValueOrDefault(e.melodyMotifZone1TripletLikelihoods, c - 1, 0.5),
            zone1DotDotNormalLikelihood: getArrayValueOrDefault(e.melodyMotifZone1DotDotNormalLikelihoods, c - 1, 0.5),
            zone1DotFirstLikelihood: getArrayValueOrDefault(e.melodyMotifZone1DotFirstLikelihoods, c - 1, 2),
            zone1DotNormalDotLikelihood: getArrayValueOrDefault(e.melodyMotifZone1DotNormalDotLikelihoods, c - 1, 0.5),
            zone1DotSecondLikelihood: getArrayValueOrDefault(e.melodyMotifZone1DotSecondLikelihoods, c - 1, 0.5),
            zone1NormalDotDotLikelihood: getArrayValueOrDefault(e.melodyMotifZone1NormalDotDotLikelihoods, c - 1, 0.5),
            zone1StartPosRange: getArrayValueOrDefault(e.melodyMotifZone1StartPosRanges, c - 1, [0, 0]),
            zone1EndPosRange: getArrayValueOrDefault(e.melodyMotifZone1EndPosRanges, c - 1, [0.75, 0.75]),
            zone1StartEnd: getArrayValueOrDefault(e.melodyMotifZone1StartEnds, c - 1, []),
            noteCountRange: b
        }, j, h, e, f, "melodyMotifRythmSeed");
        setMelodyMotifEmbellishConnectStuff(j, h, e, f)
    }
    if (c > 0 && e.melodyMotifRythmNoteCountOverrides.length > 0) {
        j.noteCount = e.melodyMotifRythmNoteCountOverrides[(c - 1) % e.melodyMotifRythmNoteCountOverrides.length];
        j.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS
    }
    var g = [0.95, 0.75, 0.5, 0.25];
    j.fillerOffsetsExpression = createChainedLevelExpression(["[[1]]", "[[1]]", "[]", "[]", "[]"], g, "melodyRenderAmountVar");
    j.fillerOffsetTypes = [OffsetType.OCTAVE];
    setMelodyMotifVerticalIndices(c, j, h, e, f);
    return j
}

function createChainedExpression(a, c, f, d) {
    if (f == a.length - 1) {
        return "(" + a[f] + ")"
    }
    var e = a[f];
    var b = c[f];
    if (b) {
        return "(" + c[f] + " ? " + e + " : " + createChainedExpression(a, c, f + 1) + ")"
    } else {
        return "(" + d + ")"
    }
}

function createChainedLevelExpression(a, b, f) {
    var d = [];
    for (var c = 0; c < b.length; c++) {
        var e = f + " > " + b[c];
        d[c] = e
    }
    return createChainedExpression(a, d, 0, a[a.length - 1])
}

function setHarmonyMotif(l, D, w, r, q) {
    var x = createOrGetRandom(w, "harmonyMotifSeed");
    var g = SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING;
    g = sampleData([{
        data: SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.STRUMS,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SINGLE_BLOCK_CHORD,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES,
        likelihood: 2
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS,
        likelihood: 0.1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS,
        likelihood: 0.1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING,
        likelihood: 2
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED,
        likelihood: 2
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES,
        likelihood: 2
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS,
        likelihood: 0.1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS,
        likelihood: 0.1
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING,
        likelihood: 2
    }, {
        data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED,
        likelihood: 2
    }], x);
    var t = 4;
    var G = [0];
    var v = 1 / t;
    var E = 0;
    for (var B = 0; B < t - 1; B++) {
        E += v * 0.5 + x.random() * v;
        if (E >= 1) {
            E = 1
        }
        G.push(E)
    }
    G.push(1);
    var a = [0, 0.1, 0.25, 0.5, 1];
    var c = [];
    for (var B = 0; B < a.length - 1; B++) {
        c[B] = [];
        var F = a[B];
        var y = a[B + 1];
        var A = y - F;
        for (var z = 0; z < G.length - 1; z++) {
            var m = G[z];
            var o = G[z + 1] - G[z];
            var h = F + A * m;
            var f = F + A * (m + o);
            c[B].push([h, f])
        }
    }
    var b = 0.1 + 0.1 * x.random();
    var n = [0.95, 0.75, 0.5, 0.25, 0];
    var k = false;
    var s = true;
    var d = 1;
    var u = createOrGetRandom(w, "harmonyMotifRythmSeed");
    switch (g) {
        case SimpleModuleGeneratorHarmonyStyleType.STRUMS:
            s = false;
            d = 0.25 + 0.25 * u.random();
            break;
        case SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH:
            s = false;
            d = 0.25 + 0.5 * u.random();
            break;
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED:
            k = true;
            break
    }

    function e(K) {
        var H = 0.05 + x.random() * 0.1;
        var J = 2 + Math.floor(3 * x.random());
        var j = createFilledNumericIncArray(J, -H, -H);
        var I = createFilledNumericIncArray(J, H, H);
        K.fillerOffsets = [createFilledNumericIncArray(J, 1, 1)];
        K.fillerRelativeStrengths = [createFilledNumericIncArray(J, 0.8, -0.1)];
        K.fillerLengthModes = [MotifZoneFillerLengthMode.RELATIVE_ADD];
        K.fillerRelativeLengths = [j];
        K.fillerPositionOffsets = [I];
        K.fillerPositionOffsetUnits = [PositionUnit.BEATS]
    }
    switch (g) {
        case SimpleModuleGeneratorHarmonyStyleType.STRUMS:
        case SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED:
            var p = s ? getMelodicVerticalIndices(x, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([{
                    data: 1,
                    likelihood: 1
                }, {
                    data: 0,
                    likelihood: 2
                }], x)
            }) : [0];
            l.verticalOffsetType = OffsetType.CHORD;
            l.verticalIndices = p;
            l.verticalIndicesExpression = q + " > " + b + " ? " + JSON.stringify(p) + " : []";
            l.startVerticalIndices = [0];
            l.startVerticalIndicesExpression = q + " > " + b + " ? [0] : []";
            l.verticalOffsetDomains = [
                [0]
            ];
            l.verticalOffsetLikelihoods = [
                [1]
            ];
            l.verticalRelativeType = VerticalRelativeType.MIDI_ZERO;
            l.constantVerticalOffset = Math.floor(50 + 20 * x.random());
            l.constantVerticalOffsetType = OffsetType.HALF_STEP;
            l.fillerRelativeStrengths = [
                [0.75]
            ];

            function C(R, K, O) {
                var S = [];
                var Q = [];
                for (var L = 0; L < K.length; L++) {
                    Q.push({
                        likelihood: 1,
                        data: K[L]
                    })
                }
                for (var L = 0; L < R; L++) {
                    var N = Math.floor(x.random() * 10 + 1);
                    var M = [];
                    for (var J = 0; J < N; J++) {
                        var H = (L + 1) / R;
                        var I = Math.round(H * O * x.random());
                        var P = sampleNDataWithoutReplacement(Q, I, x);
                        M.push(P)
                    }
                    S.push(JSON.stringify(M))
                }
                return S.reverse()
            }
            if (g == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED || g == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED) {
                l.fillerOffsets = [
                    [1]
                ];
                l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [1, 2, 3], 3), n, q);
                l.fillerOffsetTypes = [OffsetType.CHORD]
            } else {
                if (g == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES || g == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES) {
                    l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [1, 2], 2), n, q);
                    l.fillerOffsets = [
                        [1]
                    ];
                    l.fillerOffsetTypes = [OffsetType.OCTAVE]
                } else {
                    if (g == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS || g == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS) {
                        l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [2, 7], 2), n, q);
                        l.fillerOffsets = [
                            [2]
                        ];
                        l.fillerOffsetTypes = [OffsetType.SCALE]
                    } else {
                        if (g == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS || g == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS) {
                            l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [5, 7], 2), n, q);
                            l.fillerOffsets = [
                                [5]
                            ];
                            l.fillerOffsetTypes = [OffsetType.SCALE]
                        } else {
                            if (g == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING || g == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING) {
                                l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [1], 1), n, q);
                                l.fillerOffsetTypes = [OffsetType.OCTAVE]
                            } else {
                                if (g == SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH) {
                                    l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [1, 2, 3], 3), n, q);
                                    l.fillerOffsetTypes = [OffsetType.CHORD]
                                } else {
                                    if (g == SimpleModuleGeneratorHarmonyStyleType.STRUMS) {
                                        l.fillerOffsetsExpression = createChainedLevelExpression(C(n.length, [1, 2, 3], 3), n, q);
                                        l.fillerOffsetTypes = [OffsetType.CHORD];
                                        e(l)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (k) {
                setMotifRythm({
                    zone1Prob: 0,
                    noteCountRange: [0.5 * d, 2 * d],
                    densityCurveType: PredefinedCurveType.LINEAR
                }, l, D, w, r, "harmonyMotifRythmSeed");
                l.densityAmplitude = u.random() * 0.1 - 0.05
            } else {
                setMotifRythm({
                    zone1TripletLikelihood: 0.1,
                    noteCountRange: [0.5 * d, 2 * d]
                }, l, D, w, r, "harmonyMotifRythmSeed")
            }
            break;
        case SimpleModuleGeneratorHarmonyStyleType.SINGLE_BLOCK_CHORD:
        case SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM:
            l.verticalOffsetType = OffsetType.CHORD;
            l.verticalIndices = [0];
            l.verticalOffsetDomains = [
                [0]
            ];
            l.verticalOffsetLikelihoods = [
                [1]
            ];
            l.verticalRelativeType = VerticalRelativeType.MIDI_ZERO;
            l.constantVerticalOffset = Math.floor(50 + 20 * x.random());
            l.constantVerticalOffsetType = OffsetType.HALF_STEP;
            l.fillerOffsets = [
                [1, 2]
            ];
            l.fillerOffsetsExpression = createChainedLevelExpression(["[[1, 2, 3]]", "[1, 2]", "[1, 2]", "[1]", "[]"], n, q);
            l.fillerOffsetTypes = [OffsetType.CHORD];
            l.fillerRelativeStrengths = [
                [0.8]
            ];
            if (g == SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM) {
                e(l)
            }
            l.noteCount = 1;
            l.noteCountUnit = CountUnit.PLAIN;
            break
    }
}

function setBassMotifVerticalIndices(o, l, j, k) {
    var f = createOrGetRandom(j, "bassMotifSeed");
    var a = f.random();
    o.verticalOffsetType = OffsetType.CHORD;
    o.verticalIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var h = sampleData([{
        data: SimpleModuleGeneratorBassType.ARPEGGIO,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorBassType.FIFTHS,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorBassType.OCTAVES,
        likelihood: 1
    }, {
        data: SimpleModuleGeneratorBassType.REPEATED,
        likelihood: 1
    }], f);
    var m = [0.95, 0.75, 0.5, 0.25];
    o.fillerOffsetsExpression = createChainedLevelExpression(["[[1]]", "[[1]]", "[]", "[]", "[]"], m, "bassRenderAmountVar");
    o.fillerOffsetTypes = [OffsetType.OCTAVE];
    switch (h) {
        case SimpleModuleGeneratorBassType.ARPEGGIO:
            var c = getMelodicVerticalIndices(f, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([{
                    data: 1,
                    likelihood: 2
                }, {
                    data: 0,
                    likelihood: 4
                }], f)
            });
            o.verticalIndices = c;
            o.verticalOffsetDomains = [
                [0]
            ];
            o.verticalOffsetLikelihoods = [
                [1]
            ];
            break;
        case SimpleModuleGeneratorBassType.FIFTHS:
            var d = 1;
            var g = 1;
            var n = 1;
            var e = 1;
            o.verticalIndices = getOscillatingIndices(f, 0, 2, d, g, n, e);
            o.verticalOffsetDomains = [
                [0]
            ];
            o.verticalOffsetLikelihoods = [
                [1]
            ];
            break;
        case SimpleModuleGeneratorBassType.MELODIC:
            var b = getMelodicVerticalIndices(f, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([{
                    data: 1,
                    likelihood: 1
                }, {
                    data: 0,
                    likelihood: 3
                }], f)
            });
            o.verticalIndices = b;
            o.verticalOffsetType = OffsetType.SCALE;
            break;
        case SimpleModuleGeneratorBassType.OCTAVES:
            var d = 1;
            var g = 1;
            var n = 1;
            var e = 1;
            o.verticalIndices = getOscillatingIndices(f, 0, 1, d, g, n, e);
            o.verticalOffsetType = OffsetType.OCTAVE;
            o.verticalOffsetDomains = [
                [0]
            ];
            o.verticalOffsetLikelihoods = [
                [1]
            ];
            break;
        case SimpleModuleGeneratorBassType.REPEATED:
            o.verticalIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            break
    }
}

function createBassMotifInfo(e, g, h, d) {
    var a = {};
    var f = h.bassMotifRythmCountIncreasePerIndex;
    var c = h.bassMotifRythmCountIncreaseOffsetRange;
    var b = [e * f + Math.min(c[0], c[1]), e * f + Math.max(c[1], c[0])];
    setMotifRythm({
        zone1Prob: getArrayValueOrDefault(h.bassMotifZone1Probabilities, e - 1, 0.5),
        zone1TripletLikelihood: getArrayValueOrDefault(h.bassMotifZone1TripletLikelihoods, e - 1, 0.01),
        zone1DotDotNormalLikelihood: getArrayValueOrDefault(h.bassMotifZone1DotDotNormalLikelihoods, e - 1, 0.5),
        zone1DotFirstLikelihood: getArrayValueOrDefault(h.bassMotifZone1DotFirstLikelihoods, e - 1, 2),
        zone1DotNormalDotLikelihood: getArrayValueOrDefault(h.bassMotifZone1DotNormalDotLikelihoods, e - 1, 0.5),
        zone1DotSecondLikelihood: getArrayValueOrDefault(h.bassMotifZone1DotSecondLikelihoods, e - 1, 0.5),
        zone1NormalDotDotLikelihood: getArrayValueOrDefault(h.bassMotifZone1NormalDotDotLikelihoods, e - 1, 0.5),
        zone1StartPosRange: getArrayValueOrDefault(h.bassMotifZone1StartPosRanges, e - 1, [0, 0]),
        zone1EndPosRange: getArrayValueOrDefault(h.bassMotifZone1EndPosRanges, e - 1, [0.75, 0.75]),
        zone1StartEnd: getArrayValueOrDefault(h.bassMotifZone1StartEnds, e - 1, []),
        noteCountRange: b
    }, a, g, h, d, "bassMotifRythmSeed");
    if (h.bassMotifRythmNoteCountOverrides.length > 0) {
        a.noteCount = h.bassMotifRythmNoteCountOverrides[e % h.bassMotifRythmNoteCountOverrides.length];
        a.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS
    }
    setBassMotifVerticalIndices(a, g, h, d);
    setBassMotifEmbellishConnectStuff(a, g, h, d);
    return a
}

function createHarmonyMotifInfo(d, c, e, b) {
    var a = {};
    setHarmonyMotif(a, c, e, b, d);
    setHarmonyMotifEmbellishConnectStuff(a, c, e, b);
    return a
}

function createPercussionMotifInfos(P, r, C, e, b, s) {
    var A = createOrGetRandom(b, "percussionMotifSeed");
    var V = createOrGetRandom(b, "percussionFillMotifSeed");
    var F = createOrGetRandom(b, "percussionInstrumentSeed");
    var p = createOrGetRandom(b, "percussionFillInstrumentSeed");
    var aa = createOrGetRandom(b, "percussionMotifRythmSeed");
    var R = createOrGetRandom(b, "percussionFillMotifRythmSeed");
    var a = b.songStructureInfo;
    var n = 4;
    if (a.numerators && a.numerators.length > 0) {
        n = a.numerators[0]
    }
    var B = b.bassDrumRndInfos;
    var E = sampleData(B, F);
    var l = b.snareRndInfos;
    var z = sampleData(l, F);
    var M = b.crashRndInfos;
    var G = sampleData(M, F);
    var x = b.rideRndInfos;
    var U = sampleNDataWithoutReplacement(x, 4, F);
    if (b.overrideBassDrumNote) {
        E = b.bassDrumNote
    }
    if (b.overrideSnareDrumNote) {
        z = b.snareDrumNote
    }
    if (b.overrideCrashDrumNote) {
        G = b.crashDrumNote
    }
    if (b.overrideRideDrumNotes && b.rideDrumNotes.length > 0) {
        U = b.rideDrumNotes
    }

    function m(ai, an) {
        if (!an) {
            an = aa
        }
        var aD = getValueOrDefault(ai, "pattern", []);
        var af = getValueOrDefault(ai, "strengths", []);
        var al = getValueOrDefault(ai, "patternLength", 16);
        var av = getValueOrDefault(ai, "pertubations", 1);
        var aw = getValueOrDefault(ai, "addMod", 1);
        var ae = getValueOrDefault(ai, "posShiftRndInfos", [{
            data: 1,
            likelihood: 1
        }]);
        var aj = [{
            data: "posShift",
            likelihood: 1
        }, {
            data: "addAccent",
            likelihood: 1
        }, {
            data: "addGhost",
            likelihood: 1
        }, {
            data: "addExtra",
            likelihood: 1
        }, {
            data: "remove",
            likelihood: 1
        }];
        var ap = sampleData(ae, an);
        var aA = sampleNData(aj, av, an);
        for (var az = 0; az < aA.length; az++) {
            var am = 0;
            if (aD.length > 0) {
                am = Math.floor(an.random() * aD.length)
            }
            var ag = aD[am];
            var aC = 0;
            var ak = 0;
            var ar = false;
            var ad = false;
            var aF = ag > 0;
            var ao = ag > ap - 1;
            var ax = ag < al - 1;
            var aE = ag < al - ap;
            if (am > 0) {
                aC = aD[am - 1];
                ar = true;
                aF = ag - 1 > aC;
                ao = ag - ap > aC
            }
            if (am < aD.length - 1) {
                ak = aD[am + 1];
                ad = true;
                ax = ag + 1 < ak;
                aE = ag + ap < ak
            }
            switch (aA[az]) {
                case "posShift":
                    if (aF) {
                        if (ax) {
                            aD[am] = an.random() < 0.5 ? ag + ap : ag - ap
                        } else {
                            aD[am] = ag - ap
                        }
                    } else {
                        if (ax) {
                            aD[am] = ag + ap
                        }
                    }
                    break;
                case "addAccent":
                    af[am] = 1;
                    break;
                case "addGhost":
                    if (aF) {
                        aD.splice(am, 0, ag - 1);
                        af.splice(am, 0, W * 0.7)
                    }
                    break;
                case "addExtra":
                    var aj = [];
                    var aB = createFilledNumericIncArray(al, 0, 1);
                    arrayDeleteAll(aB, aD);
                    var ac = [];
                    for (var ay = 0; ay < aB.length; ay++) {
                        var au = aB[ay];
                        if (au % aw == 0) {
                            ac.push(au)
                        }
                    }
                    aB = ac;
                    if (aB.length > 0) {
                        var ah = aB[Math.floor(an.random() * aB.length)];
                        var aq = aD.length;
                        for (var ay = 0; ay < aD.length; ay++) {
                            if (ah < aD[ay]) {
                                aq = ay;
                                break
                            }
                        }
                        aD.splice(aq, 0, ah);
                        af.splice(aq, 0, W)
                    }
                    break;
                case "remove":
                    if (aD.length > 1) {
                        aD.splice(am, 1);
                        af.splice(am, 1)
                    }
                    break;
                default:
                    console.log("unknown operation " + aA[az]);
                    break
            }
        }
    }

    function I(af, ac) {
        var j = [];
        var ah = {};
        for (var ae = 0; ae < af.length; ae++) {
            var ad = af[ae];
            var ag = ah[ad];
            if (typeof (ag) === "undefined") {
                ag = Math.floor(A.random() * ac);
                ah[ad] = ag
            }
            j.push(ag)
        }
        return j
    }
    var q = [{
        data: [0, 0.2],
        likelihood: 10
    }, {
        data: [0.2, 0.4],
        likelihood: 8
    }, {
        data: [0.4, 0.7],
        likelihood: 3
    }, {
        data: [0.7, 1],
        likelihood: 1
    }];

    function N(ad, j, ac) {
        if (ad.length > 0) {
            return ad[j % ad.length] != 0
        }
        return ac
    }

    // moved from inside the next for loop
    function J(ae, j, ad) {
        var ac = j[0] + ad.random() * (j[1] - j[0]);
        return ae + "RenderAmountVar > " + ac
    }

    for (var Y = 0; Y < P; Y++) {
        var Z = {};
        var y = copyValueDeep(q);
        var g = sampleNDataWithoutReplacement(y, 1, A, true)[0];
        var ab = sampleNDataWithoutReplacement(y, 1, A, true)[0];
        var Q = sampleNDataWithoutReplacement(y, 1, A, true)[0];
        var S = sampleNDataWithoutReplacement(y, 1, A, true)[0];
        var D = A.random() < 0.9;
        var H = A.random() < (D ? 0.85 : 0.7);
        var t = A.random() < (D || H ? 0.8 : 0.9);
        var c = A.random() < (D || t || H ? 0.1 : 0.15);
        D = N(b.addBassDrumsOverride, Y, D);
        H = N(b.addSnareDrumsOverride, Y, H);
        t = N(b.addRideDrumsOverride, Y, t);
        c = N(b.addCrashDrumsOverride, Y, c);
        if (!D && !H && !t && !c) {
            var O = sampleData([{
                data: 0,
                likelihood: 5
            }, {
                data: 1,
                likelihood: 1
            }, {
                data: 2,
                likelihood: 5
            }, {
                data: 3,
                likelihood: 0.5
            }], A);
            switch (O) {
                case 0:
                    D = true;
                    break;
                case 1:
                    H = true;
                    break;
                case 2:
                    t = true;
                    break;
                case 3:
                    c = true;
                    break
            }
        }
        Z.motifZoneInfos = [];
        Z.rythmNoteCount = n * 4;
        Z.densityAmplitude = 0.3 * aa.random();
        Z.densityFrequency = 1 + Math.ceil(aa.random() * 3);
        Z.densitySeed = aa.genrand_int31();
        var W = 0.8;
        var w = 16;

        if (D) {
            var T = {};
            var L = ab;
            T.activatedExpression = J("percussion", L, A);
            T.multiplier = 4;
            T.remainders = [0, 8];
            T.remainderStrengths = createFilledArray(T.remainders.length, 1);
            m({
                addMod: 2,
                posShiftRndInfos: [{
                    data: 0,
                    likelihood: 40
                }, {
                    data: 2,
                    likelihood: 10
                }],
                strengths: T.remainderStrengths,
                pattern: T.remainders,
                perturbations: Math.floor(aa.random() * 2)
            });
            T.divisorCheck = w;
            T.divisorCheckUnit = PositionUnit.BEATS;
            T.notes = [E];
            Z.motifZoneInfos.push(T)
        }
        if (H) {
            var T = {};
            var L = S;
            T.activatedExpression = J("percussion", L, A);
            T.multiplier = 4;
            T.remainders = [4, 12];
            T.remainderStrengths = createFilledArray(T.remainders.length, 1);
            m({
                addMod: 2,
                posShiftRndInfos: [{
                    data: 2,
                    likelihood: 20
                }],
                strengths: T.remainderStrengths,
                pattern: T.remainders,
                perturbations: Math.floor(aa.random() * 2)
            });
            T.divisorCheck = w;
            T.divisorCheckUnit = PositionUnit.BEATS;
            T.notes = [z];
            Z.motifZoneInfos.push(T)
        }
        if (t) {
            var T = {};
            var L = g;
            T.activatedExpression = J("percussion", L, A);
            T.multiplier = 4;
            T.remainders = sampleData([{
                data: createFilledNumericIncArray(8, 0, 2),
                likelihood: 1
            }], A);
            T.remainderStrengths = createFilledArray(T.remainders.length, W);
            m({
                strengths: T.remainderStrengths,
                pattern: T.remainders,
                perturbations: Math.floor(aa.random() * 3)
            });
            T.quotients = [];
            T.divisorCheck = w;
            T.divisorCheckUnit = PositionUnit.BEATS;
            T.notes = copyValueDeep(U);
            var f = [{
                data: [0],
                likelihood: 10
            }, {
                data: [0, 1],
                likelihood: 1
            }, {
                data: [0, 1, 0],
                likelihood: 1
            }, {
                data: [0, 1, 1],
                likelihood: 1
            }, {
                data: [0, 1, 2],
                likelihood: 1
            }, {
                data: [0, 0, 1],
                likelihood: 1
            }, {
                data: [0, 0, 0, 1],
                likelihood: 5
            }, {
                data: [0, 0, 1, 0],
                likelihood: 3
            }, {
                data: [0, 1, 0, 0],
                likelihood: 2
            }, {
                data: [0, 0, 1, 1],
                likelihood: 1
            }, {
                data: [0, 1, 1, 1],
                likelihood: 1
            }, {
                data: [0, 1, 1, 0],
                likelihood: 1
            }, {
                data: [0, 0, 1, 2],
                likelihood: 1
            }, {
                data: [0, 1, 2, 0],
                likelihood: 1
            }, {
                data: [0, 1, 2, 1],
                likelihood: 1
            }];
            var k = sampleData(f, A);
            k = I(k, U.length);
            T.noteIndexPattern = [];
            for (var X = 0; X < k.length; X++) {
                T.noteIndexPattern.push([k[X]])
            }
            if (A.random() < 0.2) {
                T.startNoteIndexPattern = [];
                k = sampleData(f, A);
                k = I(k, U.length);
                for (var X = 0; X < k.length; X++) {
                    T.startNoteIndexPattern.push([k[X]])
                }
            }
            if (A.random() < 0.2) {
                T.endNoteIndexPattern = [];
                k = sampleData(f, A);
                k = I(k, U.length);
                for (var X = 0; X < k.length; X++) {
                    T.endNoteIndexPattern.push([k[X]])
                }
            }
            Z.motifZoneInfos.push(T)
        }
        if (c) {
            var T = {};
            var L = Q;
            T.activatedExpression = J("percussion", L, A);
            T.multiplier = 4;
            T.remainders = [0];
            T.remainderStrengths = createFilledArray(T.remainders.length, 1);
            T.divisorCheck = w;
            T.divisorCheckUnit = PositionUnit.BEATS;
            T.notes = [G];
            Z.motifZoneInfos.push(T)
        }
        C.push(Z)
    }
    var K = [];
    K.push({
        data: E,
        likelihood: 1
    });
    K.push({
        data: G,
        likelihood: 1
    });
    K.push({
        data: z,
        likelihood: 5
    });
    for (var Y = 0; Y < U.length; Y++) {
        K.push({
            data: U[Y],
            likelihood: 1
        })
    }
    var v = sampleNDataWithoutReplacement(K, 4, p);
    if (b.overrideFillNotes && b.fillNotes.length > 0) {
        v = b.fillNotes
    }
    for (var Y = 0; Y < r; Y++) {
        var Z = {};
        Z.motifZoneInfos = [];
        Z.rythmNoteCount = n * 4;
        Z.densityAmplitude = 0.3 * R.random();
        Z.densityFrequency = 1 + Math.ceil(R.random() * 3);
        Z.densitySeed = R.genrand_int31();
        var W = 0.8;
        var o = b.fillActivatedRenderAmountRange;
        var T = {};
        T.multiplier = 4;
        T.activatedExpression = J("percussion", o, V);
        var d = V.random();
        var h = [{
            data: [0, 8],
            likelihood: 0.15
        }, {
            data: [0, 8, 12],
            likelihood: 0.15
        }, {
            data: [0, 4, 8, 12],
            likelihood: 0.15
        }, {
            data: [0, 4, 8, 10, 12],
            likelihood: 0.15
        }, {
            data: [0, 2, 4, 6, 8, 10, 12, 14],
            likelihood: 0.5
        }, {
            data: [0, 4, 8, 10, 12, 14],
            likelihood: 0.2
        }];
        T.remainders = sampleData(h, V);
        T.remainderStrengths = createFilledArray(T.remainders.length, W);
        m({
            strengths: T.remainderStrengths,
            pattern: T.remainders,
            perturbations: Math.floor(R.random() * 3)
        }, R);
        T.divisorCheck = w;
        T.divisorCheckUnit = PositionUnit.BEATS;
        T.notes = v;
        Z.motifZoneInfos.push(T);
        var u = copyValueDeep(b.fillIndexPatternRndInfos);
        var k = sampleData(u, V);
        T.noteIndexPattern = [];
        for (var X = 0; X < k.length; X++) {
            T.noteIndexPattern.push([k[X]])
        }
        if (V.random() < 0.2) {
            T.startNoteIndexPattern = [];
            k = sampleData(u, V);
            for (var X = 0; X < k.length; X++) {
                T.startNoteIndexPattern.push([k[X]])
            }
        }
        if (V.random() < 0.2) {
            T.endNoteIndexPattern = [];
            k = sampleData(u, V);
            for (var X = 0; X < k.length; X++) {
                T.endNoteIndexPattern.push([k[X]])
            }
        }
        C.push(Z)
    }
}

function createSuspendInfos(o, j, m) {
    var a = createOrGetRandom(j, "suspendSeed");
    var h = j.suspendTypeCount;
    var f = j.songStructureInfo.baseTempo;
    var c = 140;
    var e = 60;
    var n = c - e;
    var l = (f - e) / n;
    if (!j.adaptSuspensionToTempo) {
        l = 0.5
    }
    var g = 0.5 - 0.4 * l;
    for (var d = 0; d < h; d++) {
        var k = false;
        if (a.random() < j.voiceLineSuspensionProbabilities[d % j.voiceLineSuspensionProbabilities.length]) {
            k = true
        }
        var b = {};
        b.seed = a.genrand_int31();
        b.probability = k ? a.random() * g : 0;
        o.suspendInfos[d] = b
    }
}

function createMotifInfos(p, k, n) {
    var m = 4;
    var d = m;
    var o = d + m;
    var q = o + m;
    var h = 4;
    var a = q + h;
    var l = 4;
    var c = 2;
    var g = 4;
    for (var f = 0; f < m; f++) {
        var s = createMelodyMotifInfo(f, p, k, n);
        p.motifInfos[f] = s
    }

    function b(u, j) {
        var t = copyValueDeep(u);
        t.fillerOffsetsExpression = t.fillerOffsetsExpression.replace(/melody/g, j);
        return t
    }
    for (var f = 0; f < m; f++) {
        p.motifInfos[f + d] = b(p.motifInfos[f], "inner1")
    }
    for (var f = 0; f < m; f++) {
        p.motifInfos[f + o] = b(p.motifInfos[f], "inner2")
    }
    for (var f = 0; f < h; f++) {
        var s = createBassMotifInfo(f, p, k, n);
        p.motifInfos[f + q] = s
    }
    var r = ["melody", "inner1", "inner2"];
    for (var e = 0; e < r.length; e++) {
        for (var f = 0; f < l; f++) {
            var s = createHarmonyMotifInfo(r[e] + "RenderAmountVar", p, k, n);
            p.motifInfos[f + a + e * l] = s
        }
    }
    p.percussionMotifInfos = [];
    createPercussionMotifInfos(c, g, p.percussionMotifInfos, p, k, n)
}

function createIndexInfos(e, f, c) {
    var b = f.songStructureInfo;
    var a = b.indexInfos;
    for (var d = 0; d < a.length; d++) {
        e.indexInfos[d] = copyValueDeep(a[d])
    }
}

function createHarmonyRythmInfos(x, v, n) {
    var f = v.harmonyRythmCount;
    var y = createOrGetRandom(v, "harmonyRythmSeed");
    var j = v.songStructureInfo;
    var F = j.numerators[0];
    var s = y.random() < v.oddHarmonyRythmProbability;
    if (s) {
        console.log("Using odd time with numerator " + F)
    }
    for (var w = 0; w < f; w++) {
        var z = {};
        var A = {
            "2": 30,
            "4": 70
        };
        z.measureSplitStrategy = SplitStrategy.HALVE;
        if (F == 3) {
            z.measureSplitStrategy = SplitStrategy.TRIPLET
        }
        if (v.adaptHarmonyRythmToTimeSignature) {
            if (s) {
                switch (F) {
                    case 2:
                        A = {
                            "3": 30,
                            "6": 70
                        };
                        break;
                    case 3:
                        A = {
                            "3": 70,
                            "6": 30
                        };
                        break;
                    case 4:
                        A = {
                            "3": 100
                        };
                        break
                }
            } else {
                switch (F) {
                    case 2:
                        A = {
                            "2": 0,
                            "4": 100,
                            "8": 50
                        };
                        break;
                    case 3:
                        A = {
                            "2": 10,
                            "4": 90
                        };
                        break;
                    case 4:
                        A = {
                            "2": 30,
                            "4": 70
                        };
                        break
                }
            }
        }
        var o = {
            "2": NoteRythmElementLengthType.NORMAL,
            "3": NoteRythmElementLengthType.DOT,
            "4": NoteRythmElementLengthType.NORMAL,
            "6": NoteRythmElementLengthType.DOT,
            "8": NoteRythmElementLengthType.NORMAL
        };
        if (v.adaptHarmonyRythmToTempo) {
            if (j.baseTempo > 110) {
                if (s) {
                    A["6"] *= 2;
                    A["3"] *= 0.75
                } else {
                    A["4"] = 100;
                    A["2"] = 0
                }
            } else {
                if (j.baseTempo < 80) {
                    if (s) {
                        A["6"] = 0;
                        A["3"] = 100
                    } else {
                        A["4"] *= 1;
                        A["2"] *= 1
                    }
                }
            }
        }
        for (var d in v.harmonyLengthLikelihoodMultipliers[w % v.harmonyLengthLikelihoodMultipliers.length]) {
            var a = A[d];
            if (a) {
                A[d] *= v.harmonyLengthLikelihoodMultipliers[w % v.harmonyLengthLikelihoodMultipliers.length][d]
            }
        }
        for (var d in v.harmonyLengthLikelihoodOverwriters[w % v.harmonyLengthLikelihoodOverwriters.length]) {
            A[d] = v.harmonyLengthLikelihoodOverwriters[w % v.harmonyLengthLikelihoodOverwriters.length][d]
        }
        if (v.overwriteHarmonyLengthLikelihoods[w % v.overwriteHarmonyLengthLikelihoods.length]) {
            A = v.harmonyLengthLikelihoods[w % v.harmonyLengthLikelihoods.length]
        }
        var m = {
            "2": 3,
            "3": 4,
            "4": 6,
            "6": 7,
            "8": 8
        };
        var u = {
            "2": 4,
            "3": 4,
            "4": 4,
            "6": 6,
            "8": 7
        };
        if (v.adaptHarmonyRythmToTempo) {
            if (j.baseTempo > 115) {
                m["8"] = 2;
                m["6"] = 2;
                m["4"] = 3;
                m["3"] = 2;
                m["2"] = 2
            } else {
                if (j.baseTempo > 105) {
                    m["8"] = 2;
                    m["6"] = 2;
                    m["4"] = 4;
                    m["3"] = 3
                } else {
                    if (j.baseTempo > 90) {
                        m["8"] = 4;
                        m["6"] = 4;
                        m["4"] = 5
                    }
                }
            }
        }
        for (var C in m) {
            var t = m[C];
            t = Math.round(t * (F / 4));
            m[C] = t
        }
        if (v.harmonyRythmMeasureCountOverrides.length > 0) {
            var C = v.harmonyRythmMeasureCountOverrides[w % v.harmonyRythmMeasureCountOverrides.length];
            A = {};
            A[C] = 1
        }
        var b = [];
        for (var p in A) {
            var h = A[p];
            if (h > 0) {
                var k = o[p];
                b.push({
                    data: {
                        length: parseInt(p),
                        lengthType: k
                    },
                    likelihood: h
                })
            }
        }
        var r = sampleData(b, y);
        var E = m[r.length];
        if (!E) {
            E = 3
        }
        var g = u[r.length];
        if (!g) {
            g = 4
        }
        var l = g + Math.floor(y.random() * E);
        z.lengthType = r.lengthType;
        z.totalLength = r.length;
        z.count = l;
        z.count = getArrayValueOrDefault(v.harmonyRythmNoteCountOverrides, w, z.count);
        z.seed = Math.round(y.random() * 947283493 + 142);
        z.densityFrequency = 2 + Math.floor(y.random() * 4);
        z.densityAmplitude = 1;
        if (v.harmonyRythmDensityCurveFrequencyOverrides.length > 0) {
            z.densityFrequency = v.harmonyRythmDensityCurveFrequencyOverrides[w % v.harmonyRythmDensityCurveFrequencyOverrides.length]
        }
        if (v.harmonyRythmDensityCurveAmplitudeOverrides.length > 0) {
            z.densityAmplitude = v.harmonyRythmDensityCurveAmplitudeOverrides[w % v.harmonyRythmDensityCurveAmplitudeOverrides.length]
        }
        z.staticLength = 10;
        z.dynamicLength = 10;
        z.dominantCadenceLength = 10;
        z.tonicCadenceLength = 10;
        var q = [{
            data: {
                propName: "staticLength"
            },
            likelihood: v.prolongStaticLikelihoods[w % v.prolongStaticLikelihoods.length]
        }, {
            data: {
                propName: "dynamicLength"
            },
            likelihood: v.prolongDynamicLikelihoods[w % v.prolongDynamicLikelihoods.length]
        }, {
            data: {
                propName: "dominantCadenceLength"
            },
            likelihood: v.prolongDominantCadenceLikelihoods[w % v.prolongDominantCadenceLikelihoods.length]
        }, {
            data: {
                propName: "tonicCadenceLength"
            },
            likelihood: v.prolongTonicCadenceLikelihoods[w % v.prolongTonicCadenceLikelihoods.length]
        }];
        var D = v.prolongHarmonyPartBiases[w % v.prolongHarmonyPartBiases.length];
        var e = v.prolongHarmonyPartRandomFractions[w % v.prolongHarmonyPartRandomFractions.length];
        var B = sampleData(q, y);
        z[B.propName] = D + Math.ceil(y.random() * e);
        x.harmonyRythmInfos[w] = z
    }
}

function getCustomLinearInterpolationCurveInfo(h, g, a, e) {
    var d = sampleData(g, a);
    var b = d.ampRange;
    var c = d.biasRange;
    var f = new LinearInterpolationCurve();
    f.id = h;
    f.xValues = copyValueDeep(d.xValues);
    f.yValues = copyValueDeep(d.yValues);
    if (d.xValuesExpression) {
        f.xValuesExpression = d.xValuesExpression;
        f.xValuesUseExpression = true
    }
    if (d.yValuesExpression) {
        f.yValuesExpression = d.yValuesExpression;
        f.yValuesUseExpression = true
    }
    f.evaluateExpressions = f.yValuesUseExpression || f.xValuesUseExpression;
    d.amplitude = b[0] + a.random() * (b[1] - b[0]);
    d.bias = c[0] + a.random() * (c[1] - c[0]);
    d.curveId = f.id;
    d.curve = f;
    return d
}

function getRandomCurveInfos(b, k) {
    var t = getValueOrDefault(b, "leapsRange", [1, 1]);
    var r = getValueOrDefault(b, "startLevels", [-10, -5, 0, 5, 10]);
    var g = getValueOrDefault(b, "endLevels", [-10, -5, 0, 5, 10]);
    var h = getValueOrDefault(b, "depths", [2, 3]);
    var l = getValueOrDefault(b, "ampRange", [10, 14]);
    var d = getValueOrDefault(b, "biasRange", [68, 76]);

    function o(u, j, F, B, D, y, v) {
        D.push(u);
        if (B == v) {
            var G = arrayContains(g, u);
            var z = 0;
            for (var A = 1; A < D.length; A++) {
                var w = D[A] - D[A - 1];
                if (Math.abs(w) > 5) {
                    z++
                }
            }
            G = G || (z >= t[0] && z <= t[1]);
            if (G) {
                y.push(copyValueDeep(D))
            }
            return
        }
        var x = Math.abs(j);
        var C = Math.abs(F);
        var I = [];
        if (x != 0) {
            I.push(0)
        }
        if (u < 10) {
            I.push(5)
        }
        if (u > -10) {
            I.push(-5)
        }
        var E = x == 0 && C >= 10;
        if (!E) {
            if (u <= 0 && x <= 5) {
                I.push(10)
            }
            if (u >= 0 && x <= 5) {
                I.push(-10)
            }
            if (u <= -5 && x <= 5) {
                I.push(15)
            }
            if (u >= 5 && x <= 5) {
                I.push(-15)
            }
        }
        for (var A = 0; A < I.length; A++) {
            var w = I[A];
            var H = copyValueDeep(D);
            o(u + w, w, j, B + 1, H, y, v)
        }
    }
    var q = [];
    for (var p = 0; p < r.length; p++) {
        for (var n = 0; n < h.length; n++) {
            o(r[p], 0, 0, 0, [], q, h[n])
        }
    }
    var e = [];
    for (var p = 0; p < q.length; p++) {
        var a = q[p];
        var s = [];
        var c = [];
        var m = 1 / (a.length - 1);
        for (var n = 0; n < a.length; n++) {
            s[n] = n * m;
            c[n] = 0.1 * a[n]
        }
        if (k.random() < 0.5) {
            var f = 1 + Math.floor(k.random() * (s.length - 2));
            s[f] += -m * 0.25 + k.random() * m * 0.5
        }
        e.push({
            data: {
                ampRange: l,
                biasRange: d,
                xValues: s,
                yValues: c
            },
            likelihood: 1
        })
    }
    return e
}

function createMelodyShapeInfos(q, m, j) {
    var a = createOrGetRandom(m, "melodyShapeSeed");
    var f = createOrGetRandom(m, "bassShapeSeed");
    var l = m.melodyShapeCount;
    var e = getRandomCurveInfos({}, a);

    function h(x, u, w) {
        for (var t = 0; t < x.length; t++) {
            var v = x[t];
            v.data.ampRange = u;
            v.data.biasRange = w
        }
    }

    function p(u) {
        var t = [];
        for (var v = 0; v < u.length; v++) {
            t[v] = 5 * Math.round(clamp(u[v], -2, 2))
        }
        return t
    }

    function d(v, w) {
        var u = w;
        if (v.length > 0) {
            var t = v[o % v.length];
            if (t.length > 0) {
                u = t
            }
        }
        return p(u)
    }
    for (var o = 0; o < l; o++) {
        var s = copyValueDeep(e);
        var r = d(m.melodyStartLevels, [-2, -1, 0, 1, 2]);
        var g = d(m.melodyEndLevels, [-2, -1, 0, 1, 2]);
        var k = [6, 12];
        var c = [68, 76];
        if (m.melodyShapeAmpRanges.length > 0) {
            k = m.melodyShapeAmpRanges[o % m.melodyShapeAmpRanges.length]
        }
        if (m.melodyShapeBiasRanges.length > 0) {
            c = m.melodyShapeBiasRanges[o % m.melodyShapeBiasRanges.length]
        }
        h(s, copyValueDeep(k), copyValueDeep(c));
        q.melodyShapeInfos[o] = getCustomLinearInterpolationCurveInfo("melodyCurve" + (o + 1), s, a)
    }
    var n = m.bassShapeCount;
    for (var o = 0; o < n; o++) {
        var b = copyValueDeep(e);
        var k = [2, 4];
        var c = [35, 45];
        if (m.bassShapeAmpRanges.length > 0) {
            k = m.bassShapeAmpRanges[o % m.bassShapeAmpRanges.length]
        }
        if (m.bassShapeBiasRanges.length > 0) {
            c = m.bassShapeBiasRanges[o % m.bassShapeBiasRanges.length]
        }
        h(b, k, c);
        q.bassShapeInfos[o] = getCustomLinearInterpolationCurveInfo("bassCurve" + (o + 1), b, f)
    }
}

function createChannelDistributionInfos(g, h, b) {
    var e = ["melody", "inner1", "inner2", "bass"];
    for (var a = 0; a < e.length; a++) {
        var d = e[a];
        for (var c = 0; c < 3; c++) {
            var f = {
                channels: [
                    [c]
                ],
                endChannels: [
                    [c]
                ]
            };
            g[d + "ChannelDistributionInfos"][c] = f
        }
    }
}

function createChannelInstruments(u, o, j) {
    var q = createOrGetRandom(o, "instrumentTypeSeed");
    var f = createOrGetRandom(o, "melodyInstrumentSeed");
    var A = createOrGetRandom(o, "inner1InstrumentSeed");
    var x = createOrGetRandom(o, "inner2InstrumentSeed");
    var p = createOrGetRandom(o, "bassInstrumentSeed");
    var d = o.electronicMelodyInstrInfos;
    var n = o.electronicInnerFastInstrInfos;
    var w = o.electronicInnerSlowInstrInfos;
    var r = o.electronicBassInstrInfos;
    var B = o.electricMelodyInstrInfos;
    var c = o.electricInnerFastInstrInfos;
    var l = o.electricInnerSlowInstrInfos;
    var v = o.electricBassInstrInfos;
    var m = o.acousticMelodyInstrInfos;
    var h = o.acousticInnerFastInstrInfos;
    var e = o.acousticInnerSlowInstrInfos;
    var b = o.acousticBassInstrInfos;
    var t = m;
    var a = h;
    var y = e;
    var k = b;
    var z = sampleData([{
        data: SimpleModuleGeneratorInstrumentSetType.ACOUSTIC,
        likelihood: o.acousticLikelihood
    }, {
        data: SimpleModuleGeneratorInstrumentSetType.ELECTRIC,
        likelihood: o.electricLikelihood
    }, {
        data: SimpleModuleGeneratorInstrumentSetType.ELECTRONIC,
        likelihood: o.electronicLikelihood
    }], q);
    switch (z) {
        case SimpleModuleGeneratorInstrumentSetType.ACOUSTIC:
            t = m;
            a = h;
            y = e;
            k = b;
            break;
        case SimpleModuleGeneratorInstrumentSetType.ELECTRIC:
            t = B;
            a = c;
            y = l;
            k = v;
            break;
        case SimpleModuleGeneratorInstrumentSetType.ELECTRONIC:
            t = d;
            a = n;
            y = w;
            k = r;
            break
    }
    var g = o.allInstrumentsDifferentProbability;
    if (t.length < 3 || a.length < 3 || y.length < 3 || k.length < 3) {
        g = -1
    }
    if (f.random() < g) {
        u.melodyChannelInstruments = sampleNDataWithoutReplacement(t, 3, f);
        u.inner1ChannelInstruments = sampleNDataWithoutReplacement(a, 3, A);
        u.inner2ChannelInstruments = sampleNDataWithoutReplacement(y, 3, x);
        u.bassChannelInstruments = sampleNDataWithoutReplacement(k, 3, p)
    } else {
        for (var s = 0; s < 3; s++) {
            u.melodyChannelInstruments[s] = sampleData(t, f);
            u.inner1ChannelInstruments[s] = sampleData(a, A);
            u.inner2ChannelInstruments[s] = sampleData(y, x);
            u.bassChannelInstruments[s] = sampleData(k, p)
        }
    }
    if (o.overwriteMelodyInstruments && o.melodyInstruments.length > 0) {
        u.melodyChannelInstruments = copyValueDeep(createFilledPatternArray(3, o.melodyInstruments))
    }
    if (o.overwriteInner1Instruments && o.inner1Instruments.length > 0) {
        u.inner1ChannelInstruments = copyValueDeep(createFilledPatternArray(3, o.inner1Instruments))
    }
    if (o.overwriteInner2Instruments && o.inner2Instruments.length > 0) {
        u.inner2ChannelInstruments = copyValueDeep(createFilledPatternArray(3, o.inner2Instruments))
    }
    if (o.overwriteBassInstruments && o.bassInstruments.length > 0) {
        u.bassChannelInstruments = copyValueDeep(createFilledPatternArray(3, o.bassInstruments))
    }
}

function createMotifDistributionInfos(c, a, t) {
    var S = createOrGetRandom(a, "melodyMotifDistributionSeed");
    var r = createOrGetRandom(a, "inner1MotifDistributionSeed");
    var L = createOrGetRandom(a, "inner2MotifDistributionSeed");
    var I = createOrGetRandom(a, "bassMotifDistributionSeed");
    var af = createOrGetRandom(a, "percussionMotifDistributionSeed");
    var aa = createOrGetRandom(a, "percussionFillMotifDistributionSeed");
    var P = createOrGetRandom(a, "melodyHarmonyPunctationSeed");
    var ai = createOrGetRandom(a, "innerHarmonyPunctationSeed");
    var W = a.motifDistributionCount;
    var E = a.songStructureInfo.melodyMotifDistributionRythmIntensities;
    var N = 4;
    var V = N;
    var s = V + N;
    var z = s + N;
    var B = 4;
    var f = z + B;
    var n = 4;
    var A = 4;
    var aj = 2;
    var p = 4;
    var e = c.fillStartIndex;
    var d = [{
        data: [0],
        likelihood: 1
    }];
    for (var ad = 0; ad < W; ad++) {
        var U = {};
        var g = sampleData(d, af);
        var ae = {
            indices: []
        };
        for (var ac = 0; ac < g.length; ac++) {
            var M = g[ac];
            var h = U[M];
            if (typeof (h) === "undefined") {
                h = Math.floor(af.random() * aj);
                U[M] = h
            }
            ae.indices.push(h)
        }
        var u = af.random();
        c.percussionMotifDistributionInfos[ad] = ae
    }
    for (var ad = 0; ad < W; ad++) {
        var ae = {
            indices: []
        };
        var g = sampleData(d, aa);
        var u = aa.random();
        var ab = Math.floor(aa.random() * p);
        var Z = Math.floor(aa.random() * p);
        var D = getArrayValueOrDefault(a.percussionFillProbabilities, ad, 0.35);
        var R = getArrayValueOrDefault(a.percussionFillMotifIndicesOverride, ad, ab);
        if (R < 0) {
            D = 0
        } else {
            if (a.percussionFillMotifIndicesOverride.length > 0) {
                D = 1;
                ab = R
            }
        }
        if (u < D) {
            ae.indices = [ab + e]
        } else { }
        c.percussionFillMotifDistributionInfos[ad] = ae
    }
    var o = a.melodyMotifIndexPatternInfos;
    var x = a.bassMotifIndexPatternInfos;
    for (var ac = 0; ac < W; ac++) {
        var ae = {};
        var m = 1;
        var b = [];
        for (var ad = 1; ad < A; ad++) {
            b[ad - 1] = {
                data: ad,
                likelihood: 1
            }
        }
        var T = 1;
        for (var Y = 0; Y < b.length; Y++) {
            b[Y].likelihood *= T;
            T *= m
        }
        var l = sampleData(b, S);
        ae.endIndices = [
            [l],
            [0]
        ];
        var y = "";

        function G(j, am) {
            var ak = sampleData([{
                data: [],
                likelihood: 0.5
            }, {
                data: [0],
                likelihood: 1
            }, {
                data: [1],
                likelihood: 1
            }, {
                data: [0, 1],
                likelihood: 1
            }], P);
            for (var al = 0; al < ak.length; al++) {
                j[ak[al]].push(sampleData([{
                    data: am + f,
                    likelihood: 1
                }, {
                    data: am + f + 1,
                    likelihood: 1
                }, {
                    data: am + f + 2,
                    likelihood: 1
                }, {
                    data: am + f + 3,
                    likelihood: 1
                }], P))
            }
        }
        G(ae.endIndices, 0);
        var q = [];
        for (var ad = 1; ad < A; ad++) {
            q[ad - 1] = {
                data: ad,
                likelihood: 1
            }
        }
        var T = 1;
        for (var Y = 0; Y < q.length; Y++) {
            q[Y].likelihood *= T;
            T *= m
        }
        var J = [];
        J[0] = 0;
        for (var ad = 1; ad < A; ad++) {
            var M = sampleDataIndex(q, S);
            J[ad] = q[M].data;
            q.splice(M, 1)
        }
        var C = sampleData(o, S);
        var g = [];
        for (var ad = 0; ad < C.length; ad++) {
            var w = C[ad];
            g[ad] = [J[w[0]]]
        }
        ae.indices = copyValueDeep(g);
        c.melodyMotifDistributionInfos[ac] = ae
    }
    for (var ac = 0; ac < W; ac++) {
        var ae = {};
        var O = c.melodyMotifDistributionInfos[ac];
        ae.indices = createFilledArrayWithCopyValue(O.indices.length, [V]);
        ae.endIndices = [];
        c.inner1MotifDistributionInfos[ac] = ae;
        var ah = r.random() < a.melodyShareProbabilities[ac % a.melodyShareProbabilities.length];

        function F(am, ar, ap) {
            var at = [];
            var ak = [];
            for (var ao = 1; ao < am.length; ao++) {
                var au = am[ao];
                for (var an = 0; an < au; an++) {
                    var aq = au[an];
                    if (aq > 0 && aq < A) {
                        at.push(ao);
                        ak.push(aq)
                    }
                }
            }
            if (at.length > 0) {
                var al = [];
                for (var ao = 0; ao < at.length; ao++) {
                    al.push({
                        data: at[ao],
                        likelihood: 1
                    })
                }
                var aq = sampleDataIndex(al, r);
                var j = at[aq];
                ar[j].push(ap + ak[aq]);
                arrayDelete(am[j], ak[aq]);
                am[j].push(0);
                arrayDelete(ar[j], ap)
            }
        }
        if (ah) {
            F(O.indices, ae.indices, V)
        }
    }
    for (var ac = 0; ac < W; ac++) {
        var ae = {};
        var O = c.melodyMotifDistributionInfos[ac];
        ae.indices = createFilledArrayWithCopyValue(O.indices.length, [s]);
        ae.endIndices = createFilledArrayWithCopyValue(O.endIndices.length, [s]);
        c.inner2MotifDistributionInfos[ac] = ae
    }
    for (var ac = 0; ac < W; ac++) {
        var ae = {};
        var v = 1;
        var b = [];
        for (var ad = 0; ad < A; ad++) {
            b[ad] = {
                data: ad,
                likelihood: 1
            }
        }
        var T = 1;
        for (var Y = 0; Y < b.length; Y++) {
            b[Y].likelihood *= T;
            T *= v
        }
        var l = sampleData(b, I);
        ae.endIndices = [
            [l + z]
        ];
        var q = [];
        for (var ad = 0; ad < A; ad++) {
            q[ad] = {
                data: ad,
                likelihood: 1
            }
        }
        var T = 1;
        for (var Y = 0; Y < q.length; Y++) {
            q[Y].likelihood *= T;
            T *= v
        }
        var X = [];
        for (var ad = 0; ad < A; ad++) {
            var M = sampleDataIndex(q, I);
            X[ad] = q[M].data;
            q.splice(M, 1)
        }
        var C = sampleData(x, S);
        var g = [];
        for (var ad = 0; ad < C.length; ad++) {
            var w = C[ad];
            g[ad] = [X[w[0]] + z]
        }
        ae.indices = copyValueDeep(g);
        c.bassMotifDistributionInfos[ac] = ae
    }
    for (var ac = 0; ac < W; ac++) {
        var H = c.inner1MotifDistributionInfos[ac];
        var ag = [{
            data: [true],
            likelihood: 10
        }, {
            data: [false],
            likelihood: 1
        }, {
            data: [false, true],
            likelihood: 5
        }, {
            data: [true, false],
            likelihood: 5
        }, {
            data: [false, true, false],
            likelihood: 1
        }, {
            data: [false, true, true],
            likelihood: 1
        }, {
            data: [true, false, false],
            likelihood: 1
        }, {
            data: [true, false, true],
            likelihood: 3
        }, {
            data: [true, true, false],
            likelihood: 3
        }, {
            data: [false, false, false, true],
            likelihood: 1
        }, {
            data: [false, false, true, false],
            likelihood: 1
        }, {
            data: [false, false, true, true],
            likelihood: 1
        }, {
            data: [false, true, false, false],
            likelihood: 1
        }, {
            data: [false, true, true, false],
            likelihood: 3
        }, {
            data: [false, true, true, true],
            likelihood: 4
        }, {
            data: [true, false, false, false],
            likelihood: 1
        }, {
            data: [true, false, false, true],
            likelihood: 1
        }, {
            data: [true, false, true, true],
            likelihood: 1
        }, {
            data: [true, true, false, false],
            likelihood: 1
        }, {
            data: [true, true, false, true],
            likelihood: 3
        }, {
            data: [true, true, true, false],
            likelihood: 3
        }];
        var Q = sampleData(ag, ai);
        for (var ad = 0; ad < H.indices.length; ad++) {
            var K = Q[ad % Q.length];
            if (K) {
                var M = f + Math.floor(ai.random() * n);
                H.indices[ad].push(M + n)
            }
        }
    }
}

function createRenderAmountInfos(n, l, m) {
    var a = l.songStructureInfo;
    var o = ["melodyRenderAmount", "inner1RenderAmount", "inner2RenderAmount", "bassRenderAmount", "percussionRenderAmount"];

    function c(E, t) {
        var A = [{
            data: "partialRedistribute",
            likelihood: 1
        }, {
            data: "fullRedistribute",
            likelihood: 2
        }];

        function F(J) {
            var j = 0;
            var K = 0;
            for (var I in J) {
                var H = J[I];
                if (H > 0) {
                    j++;
                    if (I != "percussionRenderAmount") {
                        K++
                    }
                }
            }
            return K >= 2
        }
        var v = E;
        var q = 3;
        for (var C = 0; C < q; C++) {
            E = copyValueDeep(v);
            var u = sampleData(A, t);
            var w = o[0];
            while (w == o[0] || E[w] == 0) {
                w = o[Math.floor(t.random() * o.length)]
            }
            var p = [];
            var G = 0;
            var B = w;
            while (w == B) {
                B = o[Math.floor(t.random() * o.length)]
            }
            for (var z = 0; z < o.length; z++) {
                var r = o[z];
                if (w != r) {
                    p.push(r);
                    G += 1 - E[r]
                }
            }
            var x = E[w];
            var y = Math.min(G, x);

            function D(J, H, L) {
                var I = 0;
                while (H > 0.0001 && I < 5) {
                    var K = p[Math.floor(t.random() * p.length)];
                    var j = 0;
                    if (H <= 0.2 || t.random() < 0.5) {
                        j = Math.min(1 - J[K], H)
                    } else {
                        j = Math.min(1 - J[K], H * t.random())
                    }
                    J[K] += j;
                    J[L] -= j;
                    I++;
                    H -= j
                }
            }
            switch (u) {
                case "partialRedistribute":
                    s = y * t.random();
                    D(E, s, w);
                    break;
                case "fullRedistribute":
                    var s = y;
                    D(E, s, w);
                    break
            }
            if (F(E)) {
                v = E
            } else { }
        }
        return v
    }
    for (var g = 0; g < a.renderAmounts.length; g++) {
        var e = a.renderAmounts[g];
        var k = a.renderAmountSeeds[g];
        var b = new MersenneTwister(k);
        var d = {};
        for (var f = 0; f < o.length; f++) {
            var h = o[f];
            d[h] = e
        }
        d = c(d, b);
        n.renderAmountInfos[g] = d
    }
}

function createTempoInfos(k, h, j) {
    var b = createOrGetRandom(h, "tempoSeed");
    var a = h.songStructureInfo;
    var d = a.baseTempo;
    for (var f = 0; f < a.tempos.length; f++) {
        var g = a.tempos[f];
        var d = g;
        if (f > 0) {
            d = a.tempos[f - 1]
        }
        var e = g;
        if (f < a.tempos.length - 1) {
            e = a.tempos[f + 1]
        }
        var c = {
            tempo: g,
            prevTempo: d,
            nextTempo: e
        };
        k.tempoInfos[f] = c
    }
}

function getLinearInterpolationCurveControlElement(e, d, b) {
    var a = getCustomLinearInterpolationCurveInfo(e + "Curve", d, b);
    var c = new CurveControlElement();
    c.id = e;
    c.curve = a.curveId;
    c.amplitude = a.amplitude;
    c.bias = a.bias;
    c.theCurve = a.curve;
    return c
}

function getCustomCurveControlElement(c, b) {
    var a = new CurveControlElement();
    a.id = c;
    a.curve = b.id;
    a.amplitude = 1;
    a.bias = 0;
    a.theCurve = b;
    return a
}

function getEffectInfo(c, n) {
    var s = getValueOrDefault(c, "id", "");
    var j = getValueOrDefault(c, "useStartEndTime", false);
    var q = getValueOrDefault(c, "startTime", 0);
    var a = getValueOrDefault(c, "startTimeUnit", PositionUnit.HARMONY);
    var g = getValueOrDefault(c, "endTime", 0);
    var d = getValueOrDefault(c, "endTimeUnit", PositionUnit.HARMONY);
    var e = getValueOrDefault(c, "length", 1);
    var h = getValueOrDefault(c, "lengthUnit", PositionUnit.HARMONY);
    var k = getValueOrDefault(c, "offset", 0);
    var o = getValueOrDefault(c, "activeExpression", "");
    var p = getValueOrDefault(c, "phraseGroupIndex", -1);
    var f = getValueOrDefault(c, "curveData", {
        ampRange: [1, 1],
        biasRange: [0, 0],
        xValues: [0, 1],
        yValues: [0, 1]
    });
    var r = getValueOrDefault(c, "curve", null);
    var m = getValueOrDefault(c, "variables", []);
    var t = {};
    var l = null;
    if (r) {
        l = getCustomCurveControlElement(s, r)
    } else {
        l = getLinearInterpolationCurveControlElement(s, [{
            data: f,
            likelihood: 1
        }], n)
    }
    if (j) {
        l.startTime = q;
        l.startTimeUnit = a;
        l.endTime = g;
        l.endTimeUnit = d
    } else {
        l.startTime = k;
        l.startTimeUnit = h;
        l.endTime = e + k;
        l.endTimeUnit = h
    }
    if (o) {
        l.activeExpression = o;
        l.activeUseExpression = true
    }
    if (p >= 0) {
        var b = "indexInfoVar.phraseGroupIndex == " + p;
        if (l.activeExpression) {
            b = "(" + l.activeExpression + ") && " + b
        }
        l.activeExpression = b;
        l.activeUseExpression = true
    }
    t.element = l;
    t.curve = l.theCurve;
    t.variables = m;
    return t
}

function getNoChangeEffectDescription(b) {
    var g = getValueOrDefault(b, "prefixId", "prefix");
    var c = getValueOrDefault(b, "length", 1);
    var a = getValueOrDefault(b, "lengthUnit", PositionUnit.MEASURES);
    var e = getValueOrDefault(b, "value", 1);
    var d = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT).setAmplitude(e).setBias(0);
    d.id = g + "NoChangeCurve";
    var f = new CurveControlElement();
    f.endTime = c;
    f.endTimeUnit = a;
    f.curve = d.id;
    return {
        element: f,
        curve: d
    }
}

var PhraseGroupEffectType = {
    INC_DEC_FIRST_PHRASE: 0,
    DEC_INC_FIRST_PHRASE: 1,
    INC_DEC_SECOND_PHRASE: 2,
    DEC_INC_SECOND_PHRASE: 3,
    INC_SECOND_PHRASE: 4,
    DEC_SECOND_PHRASE: 5,
    INC_FIRST_PHRASE_STAY: 6,
    DEC_FIRST_PHRASE_STAY: 7,
    INC_FIRST_PHRASE_RETURN: 8,
    DEC_FIRST_PHRASE_RETURN: 9,
    INC_GROUP: 10,
    DEC_GROUP: 11,
    INC_DEC_GROUP: 12,
    DEC_INC_GROUP: 13,
    RANDOM_FIRST_PHRASE: 14,
    RANDOM_SECOND_PHRASE: 15,
    RANDOM_ALL_DIFFERENT: 16,
    RANDOM_ALL_SAME: 17,
    RANDOM_GROUP: 18
};


function createEffectChangeInfos(E, y, n) {
    var m = createOrGetRandom(y, "effectChangeSeed");
    var g = y.songStructureInfo;
    var J = 4;
    if (g.numerators && g.numerators.length > 0) {
        J = g.numerators[0]
    }
    var G = [{
        prefix: "melody",
        instruments: E.melodyChannelInstruments
    }, {
        prefix: "inner1",
        instruments: E.inner1ChannelInstruments
    }, {
        prefix: "inner2",
        instruments: E.inner2ChannelInstruments
    }, {
        prefix: "bass",
        instruments: E.bassChannelInstruments
    }];
    var u = [
        [MidiProgram.BOWED_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0.25]
        ],
        [MidiProgram.CHOIR_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0.25]
        ],
        [MidiProgram.DISTORTION_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.ELECTRIC_CLEAN_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.ELECTRIC_FINGER_BASS, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.ELECTRIC_PIANO_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.ELECTRIC_PIANO_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.ELECTRIC_PICK_BASS, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.HALO_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.35, 0.35, 0.25]
        ],
        [MidiProgram.METALLIC_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.35, 0.35, 0.25]
        ],
        [MidiProgram.NEW_AGE_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.35, 0.35, 0.25]
        ],
        [MidiProgram.OVERDRIVEN_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.1, 0.1, 0]
        ],
        [MidiProgram.POLYSYNTH_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0.25]
        ],
        [MidiProgram.SAW_LEAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.3, 0.3, 0]
        ],
        [MidiProgram.SQUARE_LEAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.3, 0.3, 0]
        ],
        [MidiProgram.SWEEP_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.35, 0.35, 0.25]
        ],
        [MidiProgram.SYNTH_BASS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0]
        ],
        [MidiProgram.SYNTH_BASS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0]
        ],
        [MidiProgram.SYNTH_BRASS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0]
        ],
        [MidiProgram.SYNTH_BRASS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.25, 0.25, 0]
        ],
        [MidiProgram.SYNTH_CHOIR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.15, 0.15, 0]
        ],
        [MidiProgram.SYNTH_STRINGS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.15, 0.15, 0.25]
        ],
        [MidiProgram.SYNTH_STRINGS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.15, 0.15, 0.25]
        ],
        [MidiProgram.WARM_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE, InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE],
        [0.35, 0.35, 0.25]
        ]
    ];
    for (var D = 0; D < u.length; D++) {
        var a = u[D];
        var c = a[1];
        var p = a[2];
        for (var C = 0; C < c.length; C++) {
            var o = c[C];
            var r = p[C % p.length];
            switch (o) {
                case InstrumentCapabilityProperty.FILTER_BW_CHANGE:
                    r *= y.filterBWEffectsProbMultiplier;
                    break;
                case InstrumentCapabilityProperty.FILTER_FREQ_CHANGE:
                    r *= y.filterFEffectsProbMultiplier;
                    break;
                case InstrumentCapabilityProperty.PAN_CHANGE:
                    r *= y.panEffectsProbMultiplier;
                    break
            }
            p[C % p.length] = r
        }
    }
    var q = {};
    for (var D = 0; D < u.length; D++) {
        var a = u[D];
        q[a[0]] = a[1]
    }
    var d = {};
    for (var D = 0; D < u.length; D++) {
        var a = u[D];
        d[a[0]] = a[2]
    }

    function l(ad, ar) {
        var X = getValueOrDefault(ad, "instruments", []);
        var ao = getValueOrDefault(ad, "prefix", "melody");
        var at = getValueOrDefault(ad, "effect", "FilterF");
        var T = getValueOrDefault(ad, "infos", []);
        var L = 0;
        var W = 1;
        var aj = 1;
        var ah = 1;
        var al = 1;
        var ae = 1;
        var aq = 1;
        switch (at) {
            case "FilterF":
                ah = 0.5;
                al = 0.1;
                ae = 0.2;
                switch (ao) {
                    case "melody":
                        W = 100 / 127;
                        L = 55 / 127;
                        break;
                    case "inner1":
                        W = 65 / 127;
                        L = 30 / 127;
                        break;
                    case "inner2":
                        W = 65 / 127;
                        L = 30 / 127;
                        break;
                    case "bass":
                        W = 45 / 127;
                        L = 10 / 127;
                        break;
                    default:
                        W = 80 / 127;
                        L = 20 / 127;
                        break
                }
                break;
            case "FilterQ":
                ah = 0.1;
                al = 0.1;
                ae = 0.2;
                var K = 0.4;
                var ax = 0.15;
                var ap = 0.65;
                var N = 0.15;
                switch (ao) {
                    case "melody":
                        K = 0.4;
                        ap = 0.65;
                        break
                }
                W = ap + ar.random() * N;
                L = K + ar.random() * ax;
                break;
            case "Pan":
                var O = 20;
                var aw = 110;
                var ai = 80;
                var ay = 60;
                var Y = 64;
                ah = 1e-7;
                al = 1e-7;
                ae = 0.0001;
                var aa = ar.random() < 0.8;
                var R = ar.random() * 0.3;
                var Q = ar.random() * 0.3;
                if (aa) {
                    Q = R
                }
                L = 0.05 + R;
                W = 0.95 - Q;
                switch (ao) {
                    case "melody":
                        aj = O / 127;
                        break;
                    case "inner1":
                        aj = ai / 127;
                        break;
                    case "inner2":
                        aj = ay / 127;
                        break;
                    case "bass":
                        aj = aw / 127;
                        break;
                    case "percussion":
                        aj = Y / 127;
                        break
                }
                break
        }
        var ag = [{
            data: {
                xValues: [0, 0.5, 1],
                yValues: [L, W, L]
            },
            likelihood: 1
        }, {
            data: {
                xValues: [0, 0.5, 1],
                yValues: [W, L, W]
            },
            likelihood: 1
        }, {
            data: {
                xValues: [0, 0.33, 0.67, 1],
                yValues: [L, W, W, L]
            },
            likelihood: 1
        }, {
            data: {
                xValues: [0, 0.33, 0.67, 1],
                yValues: [W, L, L, W]
            },
            likelihood: 1
        }, {
            data: {
                xValues: [0, 0.33, 0.67, 1],
                yValues: [L, W, L, W]
            },
            likelihood: ah
        }, {
            data: {
                xValues: [0, 0.33, 0.67, 1],
                yValues: [W, L, W, L]
            },
            likelihood: ah
        }, {
            data: {
                xValues: [0, 1],
                yValues: [L, W]
            },
            likelihood: ah
        }, {
            data: {
                xValues: [0, 1],
                yValues: [W, L]
            },
            likelihood: ah
        }];
        var U = [{
            data: {
                length: 0.5,
                lengthUnit: PositionUnit.HARMONY
            },
            likelihood: aq
        }, {
            data: {
                length: 1,
                lengthUnit: PositionUnit.HARMONY
            },
            likelihood: aq
        }, {
            data: {
                length: 1,
                lengthUnit: PositionUnit.BEATS
            },
            likelihood: al
        }, {
            data: {
                length: 2,
                lengthUnit: PositionUnit.BEATS
            },
            likelihood: al * (J == 3 ? 0.1 : 1)
        }, {
            data: {
                length: 3,
                lengthUnit: PositionUnit.BEATS
            },
            likelihood: al * (J == 3 ? 1 : 0.1)
        }, {
            data: {
                length: 1,
                lengthUnit: PositionUnit.MEASURES
            },
            likelihood: ae
        }];
        for (var av = 0; av < X.length; av++) {
            var k = X[av];
            var an = q[k];
            var M = d[k];
            if (!an) {
                an = [];
                M = [0, 0]
            }
            var Z = [];
            T[av][at] = Z;
            Z.push(getNoChangeEffectDescription({
                prefixId: ao + at + "SequentialEffect" + av,
                value: aj
            }));
            var ab = 3;
            switch (at) {
                case "Pan":
                    var S = an.indexOf(InstrumentCapabilityProperty.PAN_CHANGE);
                    if (S >= 0) {
                        var ac = ar.random() < M[S];
                        if (ac) {
                            for (var au = 0; au < ab; au++) {
                                var P = sampleData(ag, ar);
                                var am = sampleData(U, ar);
                                Z.push(getEffectInfo({
                                    id: ao + at + "SequentialEffectAdd" + av,
                                    length: am.length,
                                    lengthUnit: am.lengthUnit,
                                    activeExpression: ao + "RenderAmountVar > 0",
                                    curveData: {
                                        ampRange: [1, 1],
                                        biasRange: [0, 0],
                                        xValues: P.xValues,
                                        yValues: P.yValues
                                    }
                                }, ar))
                            }
                        }
                    }
                    break;
                case "FilterF":
                    var S = an.indexOf(InstrumentCapabilityProperty.FILTER_FREQ_CHANGE);
                    if (S >= 0) {
                        var ak = ar.random() < M[S];
                        if (ak) {
                            for (var au = 0; au < ab; au++) {
                                var P = sampleData(ag, ar);
                                var am = sampleData(U, ar);
                                Z.push(getEffectInfo({
                                    id: ao + at + "SequentialEffectAdd" + av,
                                    length: am.length,
                                    lengthUnit: am.lengthUnit,
                                    activeExpression: ao + "RenderAmountVar > 0",
                                    curveData: {
                                        ampRange: [1, 1],
                                        biasRange: [0, 0],
                                        xValues: P.xValues,
                                        yValues: P.yValues
                                    }
                                }, ar))
                            }
                        }
                    }
                    break;
                case "FilterQ":
                    var S = an.indexOf(InstrumentCapabilityProperty.FILTER_BW_CHANGE);
                    if (S >= 0) {
                        var af = ar.random() < M[S];
                        for (var au = 0; au < ab; au++) {
                            var P = sampleData(ag, ar);
                            var am = sampleData(U, ar);
                            if (af) {
                                Z.push(getEffectInfo({
                                    id: ao + at + "SequentialEffectAdd" + av,
                                    length: am.length,
                                    activeExpression: ao + "RenderAmountVar > 0",
                                    lengthUnit: am.lengthUnit,
                                    curveData: {
                                        ampRange: [1, 1],
                                        biasRange: [0, 0],
                                        xValues: P.xValues,
                                        yValues: P.yValues
                                    }
                                }, ar))
                            } else {
                                var V = ar.random() * (W - L) + L;
                                Z.push(getEffectInfo({
                                    id: ao + at + "SequentialEffectAdd" + av,
                                    length: 1,
                                    activeExpression: ao + "RenderAmountVar > 0",
                                    lengthUnit: PositionUnit.MEASURES,
                                    curveData: {
                                        ampRange: [1, 1],
                                        biasRange: [0, 0],
                                        xValues: [0, 1],
                                        yValues: [V, V]
                                    }
                                }, ar))
                            }
                        }
                    }
                    break
            }
        }
    }
    var A = ["FilterF", "FilterQ", "Pan"];
    for (var D = 0; D < G.length; D++) {
        var B = G[D].prefix;
        var f = B.substr(0, 1).toUpperCase() + B.substr(1);
        var t = "sequential" + f + "EffectChangeInfos";
        var w = "sequential" + f + "EffectChangePatternInfos";
        E[t] = [];
        E[w] = [];
        var I = G[D];
        I.infos = E[t];
        for (var C = 0; C < A.length; C++) {
            for (var z = 0; z < I.instruments.length; z++) {
                E[t].push({})
            }
            I.effect = A[C];
            l(I, m)
        }
        var s = E[w];
        var F = y.effectChangeCount;
        var x = [{
            data: [1],
            likelihood: 5
        }, {
            data: [1, 2],
            likelihood: 8
        }, {
            data: [1, 1, 2],
            likelihood: 2
        }, {
            data: [1, 2, 2],
            likelihood: 2
        }, {
            data: [1, 2, 3],
            likelihood: 2
        }, {
            data: [1, 1, 1, 2],
            likelihood: 1
        }, {
            data: [1, 1, 2, 1],
            likelihood: 1
        }, {
            data: [1, 1, 2, 2],
            likelihood: 1
        }, {
            data: [1, 2, 1, 1],
            likelihood: 1
        }, {
            data: [1, 2, 1, 2],
            likelihood: 1
        }];
        for (var z = 0; z < F; z++) {
            var h = {};
            for (var C = 0; C < A.length; C++) {
                var v = A[C];
                var e = sampleData(x, m);
                var b = m.random() < 0.5;
                var H = [];
                if (b) {
                    H = [1 + Math.floor(3 * m.random())]
                }
                h[v] = {
                    indices: e,
                    startIndices: [],
                    endIndices: H
                }
            }
            s[z] = h
        }
    }
}

function createTempoChangeInfos(o, l, g) {
    var f = createOrGetRandom(l, "tempoChangeSeed");
    var m = f.random() < l.endSongTempoChangeProbability;
    var q = true;
    var e = l.songStructureInfo;
    var s = 4;
    if (e.numerators && e.numerators.length > 0) {
        s = e.numerators[0]
    }
    o.sequentialTempoChangeInfos = [getNoChangeEffectDescription({
        prefixId: "sequentialTempo"
    })];
    var r = l.tempoChangeCount;
    for (var n = 0; n < r; n++) {
        var p = {};
        p.indices = [0];
        p.startIndices = [];
        p.endIndices = [];
        o.sequentialTempoChangePatternInfos.push(p)
    }
    var j = new ExpressionCurve();
    j.id = "tempoRenderAmountAdaptCurve";
    j.valueExpression = "1.0";
    o.parallelTempoChangeInfos = [getEffectInfo({
        id: "tempoGroupEnd",
        lengthUnit: PositionUnit.HARMONY,
        length: 0.5,
        offset: 0.5,
        curveData: {
            ampRange: [-0.3, -0.3],
            biasRange: [1, 1],
            xValues: [0, 1],
            yValues: [0, 1]
        },
        activeExpression: "indexInfoVar.phraseGroupIndex == indexInfoVar.phraseGroupCount - 1 && !indexInfoVar.isConnectGroup && !indexInfoVar.isIntro && !indexInfoVar.isEnd"
    }, f), getEffectInfo({
        id: "tempoSongEnd",
        useStartEndTime: true,
        startTimeUnit: PositionUnit.BEATS_PLUS_HARMONY,
        startTime: -s,
        endTimeUnit: PositionUnit.BEATS_PLUS_HARMONY,
        endTime: 0,
        curveData: {
            ampRange: [-0.4, -0.4],
            biasRange: [1, 1],
            xValues: [0, 1],
            yValues: [0, 1]
        },
        activeExpression: "indexInfoVar.phraseGroupIndex == indexInfoVar.phraseGroupCount - 1 && indexInfoVar.songGroupIndex == indexInfoVar.songGroupCount - 1"
    }, f), getEffectInfo({
        id: "tempoAdaptRenderAmount",
        lengthUnit: PositionUnit.HARMONY,
        length: 1,
        curve: j,
        activeExpression: "true"
    }, f)];
    var d = 0;
    var h = 1;
    var a = 2;
    var b = [{
        data: PhraseGroupEffectType.INC_FIRST_PHRASE_STAY,
        likelihood: 1
    }, {
        data: PhraseGroupEffectType.DEC_FIRST_PHRASE_STAY,
        likelihood: 1
    }, {
        data: PhraseGroupEffectType.DEC_SECOND_PHRASE,
        likelihood: 1
    }, {
        data: PhraseGroupEffectType.INC_SECOND_PHRASE,
        likelihood: 1
    }];
    var c = l.tempoChangeCount;
    for (var n = 0; n < c; n++) {
        var p = {};
        p.indices = [];
        var k = f.random() < l.endPhraseGroupTempoChangeProbabilities[n % l.endPhraseGroupTempoChangeProbabilities.length];
        if (k) {
            p.indices.push(d)
        }
        if (m) {
            p.indices.push(h)
        }
        if (q) {
            p.indices.push(a)
        }
        o.parallelTempoChangePatternInfos.push(p)
    }
}

function createPhraseInfos(e, f, b) {
    var a = f.songStructureInfo;
    if (a.phraseTypes && a.phraseTypes.length > 0) {
        for (var c = 0; c < a.phraseTypes.length; c++) {
            var d = {};
            d.phraseType = a.phraseTypes[c];
            d.minorModulationTarget = a.minorModulationTargets[c];
            d.majorModulationTarget = a.majorModulationTargets[c];
            e.phraseInfos[c] = d
        }
    } else {
        console.log("Must provide phrase types in song structure info")
    }
}

function createHarmonyExtraInfos(k, h, j) {
    var c = createOrGetRandom(h, "harmonySeed");
    var a = h.songStructureInfo;
    var f = h.harmonyExtraCount;
    var g = sampleNData(h.majorDeceptiveRootRndInfos, Math.max(f, 16), c);
    var b = sampleNData(h.minorDeceptiveRootRndInfos, Math.max(f, 16), c);
    for (var e = 0; e < f; e++) {
        var d = {};
        d.harmonySeed = c.genrand_int31();
        d.raiseLeadingTone = c.random() < h.raiseLeadingInMinorProbabilities[e % h.raiseLeadingInMinorProbabilities.length];
        d.simpleMixtureLikelihood = h.simpleMixtureLikelihoods[e % h.simpleMixtureLikelihoods.length];
        d.sus2ChordsLikelihood = h.sus2ChordsLikelihoods[e % h.sus2ChordsLikelihoods.length];
        d.sus4ChordsLikelihood = h.sus4ChordsLikelihoods[e % h.sus4ChordsLikelihoods.length];
        d.neighbourChordsLikelihood = h.neighbourChordsLikelihoods[e % h.neighbourChordsLikelihoods.length];
        d.passingChordsLikelihood = h.passingChordsLikelihoods[e % h.passingChordsLikelihoods.length];
        d.majorDeceptiveRoot = g[e];
        d.minorDeceptiveRoot = b[e];
        k.harmonyExtraInfos[e] = d
    }
}

function createHarmonyInfos(e, g, a) {
    var c = createOrGetRandom(g, "harmonySeed");
    var f = g.songStructureInfo;
    if (f.scaleTypes && f.scaleTypes.length > 0) {
        for (var b = 0; b < f.scaleTypes.length; b++) {
            var d = {};
            d.scaleType = f.scaleTypes[b];
            d.scaleBaseNote = f.scaleBaseNotes[b];
            d.numerator = f.numerators[b];
            d.harmonyElementIndex = f.harmonyElementIndices[b];
            e.harmonyInfos[b] = d
        }
    } else {
        console.log("Must provide scaletypes in song structure")
    }
}

function createModuleGeneratorData(c, a) {
    var b = new SimpleModuleGeneratorData();
    createIndexInfos(b, c, a);
    createMotifInfos(b, c, a);
    createSuspendInfos(b, c, a);
    createHarmonyRythmInfos(b, c, a);
    createMelodyShapeInfos(b, c, a);
    createChannelDistributionInfos(b, c, a);
    createChannelInstruments(b, c, a);
    createMotifDistributionInfos(b, c, a);
    createPhraseInfos(b, c, a);
    createHarmonyInfos(b, c, a);
    createHarmonyExtraInfos(b, c, a);
    createRenderAmountInfos(b, c, a);
    createTempoInfos(b, c, a);
    createTempoChangeInfos(b, c, a);
    createEffectChangeInfos(b, c, a);
    return b
}

function SimpleModuleGeneratorData() {
    this.baseTempo = 120;
    this.indexInfos = [];
    this.tempoInfos = [];
    this.sequentialTempoChangeInfos = [];
    this.sequentialTempoChangePatternInfos = [];
    this.parallelTempoChangeInfos = [];
    this.parallelTempoChangePatternInfos = [];
    this.sequentialMelodyEffectChangeInfos = [];
    this.sequentialMelodyEffectChangePatternInfos = [];
    this.sequentialInner1EffectChangeInfos = [];
    this.sequentialInner1EffectChangePatternInfos = [];
    this.sequentialInner2EffectChangeInfos = [];
    this.sequentialInner2EffectChangePatternInfos = [];
    this.sequentialBassEffectChangeInfos = [];
    this.sequentialBassEffectChangePatternInfos = [];
    this.sequentialPercussionEffectChangeInfos = [];
    this.sequentialPercussionEffectChangePatternInfos = [];
    this.renderAmountInfos = [];
    this.suspendInfos = [];
    this.harmonyExtraInfos = [];
    this.harmonyInfos = [];
    this.phraseInfos = [];
    this.harmonyRythmInfos = [];
    this.melodyShapeInfos = [];
    this.bassShapeInfos = [];
    this.melodyChannelInstruments = [];
    this.inner1ChannelInstruments = [];
    this.inner2ChannelInstruments = [];
    this.bassChannelInstruments = [];
    this.percussionMotifInfos = [];
    this.fillStartIndex = 2;
    this.percussionMotifDistributionInfos = [];
    this.percussionFillMotifDistributionInfos = [];
    this.motifInfos = [];
    this.bassStartIndex = 4;
    this.harmonyStartIndex = 8;
    this.melodyChannelDistributionInfos = [];
    this.inner1ChannelDistributionInfos = [];
    this.inner2ChannelDistributionInfos = [];
    this.bassChannelDistributionInfos = [];
    this.melodyMotifDistributionInfos = [];
    this.inner1MotifDistributionInfos = [];
    this.inner2MotifDistributionInfos = [];
    this.bassMotifDistributionInfos = []
}

function SimpleModuleGeneratorSectionInfo(a) {
    this.index = getValueOrDefault(a, "index", 0);
    this.harmonyRythmIndex = getValueOrDefault(a, "harmonyRythmIndex", 0);
    this.harmonyIndex = getValueOrDefault(a, "harmonyIndex", 0);
    this.harmonyExtraIndex = getValueOrDefault(a, "harmonyExtraIndex", 0);
    this.phraseIndex = getValueOrDefault(a, "phraseIndex", 0);
    this.renderAmountIndex = getValueOrDefault(a, "renderAmountIndex", 0);
    this.suspendIndex = getValueOrDefault(a, "suspendIndex", 0);
    this.melodyChannelDistributionIndex = getValueOrDefault(a, "melodyChannelDistributionIndex", 0);
    this.inner1ChannelDistributionIndex = getValueOrDefault(a, "inner1ChannelDistributionIndex", 0);
    this.inner2ChannelDistributionIndex = getValueOrDefault(a, "inner2ChannelDistributionIndex", 0);
    this.bassChannelDistributionIndex = getValueOrDefault(a, "bassChannelDistributionIndex", 0);
    this.melodyShapeIndex = getValueOrDefault(a, "melodyShapeIndex", 0);
    this.melodyMotifDistributionIndex = getValueOrDefault(a, "melodyMotifDistributionIndex", 0);
    this.melodyMotifsIndex = 0;
    this.inner1MotifDistributionIndex = getValueOrDefault(a, "inner1MotifDistributionIndex", 0);
    this.inner1MotifsIndex = 0;
    this.inner2MotifDistributionIndex = getValueOrDefault(a, "inner2MotifDistributionIndex", 0);
    this.inner2MotifsIndex = 0;
    this.bassShapeIndex = getValueOrDefault(a, "bassShapeIndex", 0);
    this.bassMotifDistributionIndex = getValueOrDefault(a, "bassMotifDistributionIndex", 0);
    this.bassMotifsIndex = 0;
    this.percussionMotifDistributionIndex = getValueOrDefault(a, "percussionMotifDistributionIndex", 0);
    this.percussionFillMotifDistributionIndex = getValueOrDefault(a, "percussionFillMotifDistributionIndex", 0);
    this.percussionMotifsIndex = 0;
    this.tempoIndex = getValueOrDefault(a, "tempoIndex", 0);
    this.sequentialMelodyEffectChangeIndex = getValueOrDefault(a, "sequentialMelodyEffectChangeIndex", 0);
    this.sequentialInner1EffectChangeIndex = getValueOrDefault(a, "sequentialInner1EffectChangeIndex", 0);
    this.sequentialInner2EffectChangeIndex = getValueOrDefault(a, "sequentialInner2EffectChangeIndex", 0);
    this.sequentialBassEffectChangeIndex = getValueOrDefault(a, "sequentialBassEffectChangeIndex", 0);
    this.sequentialPercussionEffectChangeIndex = getValueOrDefault(a, "sequentialPercussionEffectChangeIndex", 0);
    this.sequentialTempoChangeIndex = getValueOrDefault(a, "sequentialTempoChangeIndex", 0);
    this.parallelTempoChangeIndex = getValueOrDefault(a, "parallelTempoChangeIndex", 0);
    this.modifierFunctions = getValueOrDefault(a, "modifierFunctions", []);
    this.preModifierFunctions = getValueOrDefault(a, "preModifierFunctions", [])
}
SimpleModuleGeneratorSectionInfo.prototype.getSetVariableModifiers = function (D) {
    var x = D.melodyShapeInfos[this.melodyShapeIndex % D.melodyShapeInfos.length];
    var p = D.bassShapeInfos[this.bassShapeIndex % D.bassShapeInfos.length];
    var s = D.phraseInfos[this.phraseIndex % D.phraseInfos.length];
    var E = D.harmonyInfos[this.harmonyIndex % D.harmonyInfos.length];
    var u = D.harmonyExtraInfos[this.harmonyExtraIndex % D.harmonyExtraInfos.length];
    var d = D.harmonyRythmInfos[this.harmonyRythmIndex % D.harmonyRythmInfos.length];
    var n = D.melodyMotifDistributionInfos[this.melodyMotifDistributionIndex % D.melodyMotifDistributionInfos.length];
    var a = D.bassMotifDistributionInfos[this.bassMotifDistributionIndex % D.bassMotifDistributionInfos.length];
    var l = D.inner1MotifDistributionInfos[this.inner1MotifDistributionIndex % D.inner1MotifDistributionInfos.length];
    var t = D.inner2MotifDistributionInfos[this.inner2MotifDistributionIndex % D.inner2MotifDistributionInfos.length];
    var f = D.percussionMotifDistributionInfos[this.percussionMotifDistributionIndex % D.percussionMotifDistributionInfos.length];
    var A = D.percussionFillMotifDistributionInfos[this.percussionFillMotifDistributionIndex % D.percussionFillMotifDistributionInfos.length];
    var b = D.melodyChannelDistributionInfos[this.melodyChannelDistributionIndex % D.melodyChannelDistributionInfos.length];
    var c = D.bassChannelDistributionInfos[this.bassChannelDistributionIndex % D.bassChannelDistributionInfos.length];
    var k = D.inner1ChannelDistributionInfos[this.inner1ChannelDistributionIndex % D.inner1ChannelDistributionInfos.length];
    var z = D.inner2ChannelDistributionInfos[this.inner2ChannelDistributionIndex % D.inner2ChannelDistributionInfos.length];
    var m = D.suspendInfos[this.suspendIndex % D.suspendInfos.length];
    var q = D.renderAmountInfos[this.renderAmountIndex % D.renderAmountInfos.length];
    var r = D.tempoInfos[this.tempoIndex % D.tempoInfos.length];
    var v = D.sequentialMelodyEffectChangePatternInfos[this.sequentialMelodyEffectChangeIndex % D.sequentialMelodyEffectChangePatternInfos.length];
    var j = D.sequentialInner1EffectChangePatternInfos[this.sequentialInner1EffectChangeIndex % D.sequentialInner1EffectChangePatternInfos.length];
    var B = D.sequentialInner2EffectChangePatternInfos[this.sequentialInner2EffectChangeIndex % D.sequentialInner2EffectChangePatternInfos.length];
    var y = D.sequentialBassEffectChangePatternInfos[this.sequentialBassEffectChangeIndex % D.sequentialBassEffectChangePatternInfos.length];
    var o = D.sequentialPercussionEffectChangePatternInfos[this.sequentialPercussionEffectChangeIndex % D.sequentialPercussionEffectChangePatternInfos.length];
    var e = D.sequentialTempoChangePatternInfos[this.sequentialTempoChangeIndex % D.sequentialTempoChangePatternInfos.length];
    var g = D.parallelTempoChangePatternInfos[this.parallelTempoChangeIndex % D.parallelTempoChangePatternInfos.length];
    var C = D.indexInfos[this.index % D.indexInfos.length];
    for (var w = 0; w < this.preModifierFunctions.length; w++) {
        this.preModifierFunctions[w]({
            melodyShapeInfo: x,
            bassShapeInfo: p,
            phraseInfo: s,
            harmonyInfo: E,
            harmonyExtraInfo: u,
            harmonyRythmInfo: d,
            melodyMotifDistributionInfo: n,
            inner1MotifDistributionInfo: l,
            inner2MotifDistributionInfo: t,
            bassMotifDistributionInfo: a,
            percussionMotifDistributionInfo: f,
            percussionFillMotifDistributionInfo: A,
            melodyChannelDistributionInfo: b,
            inner1ChannelDistributionInfo: k,
            inner2ChannelDistributionInfo: z,
            bassChannelDistributionInfo: c,
            suspendInfo: m,
            renderAmountInfo: q,
            tempoInfo: r,
            sequentialMelodyEffectChangeInfo: v,
            sequentialInner1EffectChangeInfo: j,
            sequentialInner2EffectChangeInfo: B,
            sequentialBassEffectChangeInfo: y,
            sequentialPercussionEffectChangeInfo: o,
            parallelTempoChangeInfo: g,
            indexInfo: C
        })
    }
    var h = [
        ["indexInfoVar", C],
        ["melodyRenderAmountVar", "" + JSON.stringify(q.melodyRenderAmount)],
        ["inner1RenderAmountVar", "" + JSON.stringify(q.inner1RenderAmount)],
        ["inner2RenderAmountVar", "" + JSON.stringify(q.inner2RenderAmount)],
        ["bassRenderAmountVar", "" + JSON.stringify(q.bassRenderAmount)],
        ["percussionRenderAmountVar", "" + JSON.stringify(q.percussionRenderAmount)],
        ["suspendSeedVar", "" + JSON.stringify(m.seed)],
        ["suspendProbabilityVar", "" + JSON.stringify(m.probability)],
        ["melodyIndexMotifPatternVar", "" + JSON.stringify(n.indices)],
        ["endMelodyIndexMotifPatternVar", "" + JSON.stringify(n.endIndices)],
        ["melodyChannelIndicesVar", "" + JSON.stringify(b.channels)],
        ["endMelodyChannelIndicesVar", "" + JSON.stringify(b.endChannels)],
        ["bassIndexMotifPatternVar", "" + JSON.stringify(a.indices)],
        ["endBassIndexMotifPatternVar", "" + JSON.stringify(a.endIndices)],
        ["bassChannelIndicesVar", "" + JSON.stringify(c.channels)],
        ["endBassChannelIndicesVar", "" + JSON.stringify(c.endChannels)],
        ["inner1IndexMotifPatternVar", "" + JSON.stringify(l.indices)],
        ["endInner1IndexMotifPatternVar", "" + JSON.stringify(l.endIndices)],
        ["inner1ChannelIndicesVar", "" + JSON.stringify(k.channels)],
        ["endInner1ChannelIndicesVar", "" + JSON.stringify(k.endChannels)],
        ["inner2IndexMotifPatternVar", "" + JSON.stringify(t.indices)],
        ["endInner2IndexMotifPatternVar", "" + JSON.stringify(t.endIndices)],
        ["inner2ChannelIndicesVar", "" + JSON.stringify(z.channels)],
        ["endInner2ChannelIndicesVar", "" + JSON.stringify(z.endChannels)],
        ["percIndexMotifPatternVar", "" + JSON.stringify(f.indices)],
        ["endPercIndexMotifPatternVar", "" + JSON.stringify(A.indices)],
        ["harmonyNoteCountVar", "" + d.count],
        ["harmonyTotalLengthVar", "" + d.totalLength],
        ["harmonyRythmLengthTypeVar", "" + d.lengthType],
        ["harmonyRythmMeasureSplitStrategyVar", "" + d.measureSplitStrategy],
        ["hrDensityCurveSeedVar", "" + d.seed],
        ["hrDensityCurveAmpVar", "" + d.densityAmplitude],
        ["hrDensityCurveFreqVar", "" + d.densityFrequency],
        ["staticHarmonyLengthVar", "" + d.staticLength],
        ["dynamicHarmonyLengthVar", "" + d.dynamicLength],
        ["dominantCadenceHarmonyLengthVar", "" + d.dominantCadenceLength],
        ["tonicCadenceHarmonyLengthVar", "" + d.tonicCadenceLength],
        ["harmonyPhraseTypeVar", "" + s.phraseType],
        ["harmonyMajorModulationTargetVar", "" + s.majorModulationTarget],
        ["harmonyMinorModulationTargetVar", "" + s.minorModulationTarget],
        ["sectionTempoVar", "" + r.tempo],
        ["nextSectionTempoVar", "" + r.nextTempo],
        ["prevSectionTempoVar", "" + r.prevTempo],
        ["parallelTempoChangeIndicesVar", JSON.stringify(g.indices)],
        ["sequentialTempoChangeIndicesVar", JSON.stringify(e.indices)],
        ["sequentialTempoChangeStartIndicesVar", JSON.stringify(e.startIndices)],
        ["sequentialTempoChangeEndIndicesVar", JSON.stringify(e.endIndices)],
        ["sequentialMelodyEffectChangeInfoVar", v],
        ["sequentialInner1EffectChangeInfoVar", j],
        ["sequentialInner2EffectChangeInfoVar", B],
        ["sequentialBassEffectChangeInfoVar", y],
        ["sequentialPercussionEffectChangeInfoVar", o],
        ["harmonyScaleBaseVar", "" + E.scaleBaseNote],
        ["scaleTypeVar", "" + E.scaleType],
        ["numeratorVar", "" + E.numerator],
        ["harmonyElementIndexVar", "" + E.harmonyElementIndex],
        ["harmonySeedVar", "" + u.harmonySeed],
        ["harmonyRaiseLeadingToneVar", "" + u.raiseLeadingTone],
        ["harmonySimpleMixtureLikelihoodVar", "" + u.simpleMixtureLikelihood],
        ["harmonySus2ChordsLikelihoodVar", "" + u.sus2ChordsLikelihood],
        ["harmonySus4ChordsLikelihoodVar", "" + u.sus4ChordsLikelihood],
        ["harmonyNeighbourChordsLikelihoodVar", "" + u.neighbourChordsLikelihood],
        ["harmonyPassingChordsLikelihoodVar", "" + u.passingChordsLikelihood],
        ["harmonyMajorDeceptiveRootVar", "" + u.majorDeceptiveRoot],
        ["harmonyMinorDeceptiveRootVar", "" + u.minorDeceptiveRoot],
        ["melodyCurveAmplitudeVar", "" + x.amplitude],
        ["melodyCurveBiasVar", "" + x.bias],
        ["melodyCurveTypeVar", "" + x.curveType],
        ["melodyCurveIdVar", '"' + x.curveId + '"'],
        ["melodyCurveMultiplyAmpVar", "true"],
        ["bassCurveAmplitudeVar", "" + p.amplitude],
        ["bassCurveBiasVar", "" + p.bias],
        ["bassCurveTypeVar", "" + p.curveType],
        ["bassCurveIdVar", '"' + p.curveId + '"'],
        ["bassCurveMultiplyAmpVar", "true"]
    ];
    for (var w = 0; w < this.modifierFunctions.length; w++) {
        this.modifierFunctions[w](h)
    }
    return h
};

function findMod(d, c) {
    for (var b = 0; b < c.length; b++) {
        var a = c[b];
        if (a[0] == d) {
            return a[1]
        }
    }
    return null
}

function setMod(e, d, c) {
    for (var b = 0; b < c.length; b++) {
        var a = c[b];
        if (a[0] == e) {
            a[1] = d;
            break
        }
    }
}

function getPhraseIndexInfo(b) {
    var a = findMod("indexInfoVar", b);
    return a
}

function getPhraseGroupIndex(b) {
    var a = getPhraseIndexInfo(b);
    return a.phraseGroupIndex
}

function createPhraseGroupInfo(b7, cY, cx) {
    var p = cY.melodyShapeCount;
    var aG = cY.bassShapeCount;
    var al = cY.harmonyRythmCount;
    var n = cY.harmonyCount;
    var aA = cY.harmonyExtraCount;
    var ah = cY.suspendTypeCount;
    var A = cY.channelDistributionCount;
    var aE = cY.motifDistributionCount;
    var o = cY.renderAmountCount;
    var bE = cY.tempoCount;
    var cq = cY.tempoChangeCount;
    var ai = cY.effectChangeCount;
    var aI = [
        ["melodyShapeIndices", p],
        ["bassShapeIndices", aG],
        ["harmonyIndices", n],
        ["harmonyRythmIndices", al],
        ["suspendIndices", ah],
        ["melodyChannelDistributionIndices", A],
        ["inner1ChannelDistributionIndices", A],
        ["inner2ChannelDistributionIndices", A],
        ["bassChannelDistributionIndices", A],
        ["melodyMotifDistributionIndices", aE],
        ["inner1MotifDistributionIndices", aE],
        ["inner2MotifDistributionIndices", aE],
        ["bassMotifDistributionIndices", aE],
        ["harmonyExtraIndices", aA],
        ["percussionMotifDistributionIndices", aE],
        ["renderAmountIndices", o],
        ["tempoIndices", bE],
        ["percussionFillMotifDistributionIndices", aE],
        ["sequentialTempoChangeIndices", cq],
        ["parallelTempoChangeIndices", cq],
        ["sequentialMelodyEffectChangeIndices", ai],
        ["sequentialInner1EffectChangeIndices", ai],
        ["sequentialInner2EffectChangeIndices", ai],
        ["sequentialBassEffectChangeIndices", ai],
        ["sequentialPercussionEffectChangeIndices", ai]
    ];
    for (var bS = 0; bS < aI.length; bS++) {
        var x = aI[bS];
        x[2] = createOrGetRandom(cY, x[0] + "Seed")
    }
    var aa = createOrGetRandom(cY, "tempoSeed");
    var ar = aa.random() * (cY.tempoRange[1] - cY.tempoRange[0]) + cY.tempoRange[0];
    var cB = createOrGetRandom(cY, "scaleSeed");
    var bP = 55 + Math.round(cB.random() * 10);
    if (cY.setScaleBaseNote) {
        bP = positiveMod(cY.scaleBaseNote, 12) + 60
    }
    var cW = [{
        data: ScaleType.MAJOR,
        likelihood: cY.majorScaleLikelihood
    }, {
        data: ScaleType.NATURAL_MINOR,
        likelihood: cY.minorScaleLikelihood
    }];
    var bs = sampleData(cW, cB);
    var b5 = [16];

    function aF(cZ) {
        var j = copyValueDeep(cY.phraseGroupTypes);
        for (var k = 0; k < j.length; k++) {
            if (SimpleModuleGeneratorPhraseGroupType.tonicizeOrModulate(j[k].data)) {
                j[k].likelihood *= cZ
            }
        }
        return j
    }
    var bu = copyValueDeep(cY.modulatePhraseGroupTypes);
    var an = {};
    an[SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE] = [3, 9];
    an[SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN] = [3, 13];
    var bm = {};
    var af = [{
        data: 2,
        likelihood: cY.timeSignature2Likelihood
    }, {
        data: 3,
        likelihood: cY.timeSignature3Likelihood
    }, {
        data: 4,
        likelihood: cY.timeSignature4Likelihood
    }];
    var am = createOrGetRandom(cY, "tsSeed");
    var J = sampleData(af, am);
    var bf = cY.introGroupTypes;
    var cT = createOrGetRandom(cY, "introSeed");
    var aB = cT.random() < cY.songIntroProbability;
    var ap = sampleData(bf, cT);
    var bX = ap == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ? 2 + Math.floor(cT.random() * 3) : 4 + Math.floor(cT.random() * 2);
    var aW = sampleData([{
        data: 1,
        likelihood: ar < 90 ? 6 : 3
    }, {
        data: 2,
        likelihood: 1
    }], cT);
    if (J == 2) {
        aW *= 2
    }
    var ax = 0.7 * cT.random();
    var cd = false;
    var bZ = createOrGetRandom(cY, "endSeed");
    var cQ = cY.endGroupTypes;
    var s = bZ.random() < cY.songEndProbability;
    var Z = sampleData(cQ, bZ);
    var z = Z == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ? 2 + Math.floor(bZ.random() * 3) : 4 + Math.floor(bZ.random() * 2);
    var bi = sampleData([{
        data: 1,
        likelihood: ar < 90 ? 2 : 1
    }, {
        data: 2,
        likelihood: 2
    }], bZ);
    if (J == 2) {
        bi *= 2
    }
    var bG = 0.7 * bZ.random();
    var G = bZ.random() < 0.5;
    var T = cY.glueGroupTypes;
    var aL = [{
        data: PhraseGroupIndexProperty.MELODY_SHAPE,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.BASS_SHAPE,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.HARMONY,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.HARMONY_RYTHM,
        likelihood: 50
    }, {
        data: PhraseGroupIndexProperty.SUSPEND,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.MELODY_INSTRUMENT_DISTRIBUTION,
        likelihood: 40
    }, {
        data: PhraseGroupIndexProperty.INNER_1_INSTRUMENT_DISTRIBUTION,
        likelihood: 25
    }, {
        data: PhraseGroupIndexProperty.INNER_2_INSTRUMENT_DISTRIBUTION,
        likelihood: 25
    }, {
        data: PhraseGroupIndexProperty.BASS_INSTRUMENT_DISTRIBUTION,
        likelihood: 35
    }, {
        data: PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION,
        likelihood: 40
    }, {
        data: PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.INNER_2_MOTIF_DISTRIBUTION,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.BASS_MOTIF_DISTRIBUTION,
        likelihood: 10
    }, {
        data: PhraseGroupIndexProperty.HARMONY_CHARACTERISTIC,
        likelihood: 20
    }, {
        data: PhraseGroupIndexProperty.PERCUSSION_MOTIF_DISTRIBUTION,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.RENDER_AMOUNT,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.TEMPO,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.PERCUSSION_FILL_DISTRIBUTION,
        likelihood: 5
    }, {
        data: PhraseGroupIndexProperty.TEMPO_CHANGE_1,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.TEMPO_CHANGE_2,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.MELODY_EFFECTS,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.INNER_1_EFFECTS,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.INNER_2_EFFECTS,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.BASS_EFFECTS,
        likelihood: 15
    }, {
        data: PhraseGroupIndexProperty.PERCUSSION_EFFECTS,
        likelihood: 15
    }];
    var bq = [];
    var bT = [];
    var aY = [];
    var co = [];
    var bv = [];
    var cu = [];
    var W = [];
    var bz = [];
    var bH = [];
    var cH = [];
    var aD = [];
    var cC = createOrGetRandom(cY, "renderAmountSeed");
    var U = 0.2 + 0.4 * cC.random();
    var ad = 0.05 + 0.15 * cC.random();
    var bM = ad;
    var bW = U;
    var aP = 1;
    var bI = [{
        data: [bW, bW],
        likelihood: 1
    }, {
        data: [bW, bM],
        likelihood: 1
    }, {
        data: [bM, bW],
        likelihood: 1
    }, {
        data: [bM, bM],
        likelihood: 1
    }];
    var cG = [{
        data: [aP, aP],
        likelihood: 1
    }];
    var ce = [{
        data: [bM, bW],
        likelihood: 1
    }, {
        data: [bW, bM],
        likelihood: 1
    }];
    var B = [{
        data: [bM, bW],
        likelihood: 1
    }, {
        data: [bW, bM],
        likelihood: 1
    }];
    var cy = [{
        data: {
            groups: [0]
        },
        likelihood: 1
    }, {
        data: {
            groups: [1]
        },
        likelihood: 1
    }];
    var b6 = [{
        data: {
            groups: [2]
        },
        likelihood: 1
    }, {
        data: {
            groups: [3]
        },
        likelihood: 1
    }];
    var E = [{
        data: {
            groups: [4]
        },
        likelihood: 1
    }, {
        data: {
            groups: [5]
        },
        likelihood: 1
    }];
    var ae = [{
        data: {
            groups: [6]
        },
        likelihood: 1
    }, {
        data: {
            groups: [7]
        },
        likelihood: 1
    }];
    var ay = [];
    var au = [];
    var S = [];
    var cF = [];
    var bV = [];
    var cm = [];
    var a1 = [];
    var bJ = [];
    var M = [];
    var a3 = [];
    var ck = [];
    var P = [];
    var br = [];
    var cR = [];
    var ci = [];
    var aq = [{
        data: [
            ["verse1", {
                strength: "veryWeak",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0],
                sameGroupIndexSames: [createFilledNumericIncArray(24, 0, 1)]
            }],
            ["verse1", {
                strength: "medium",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["verse1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["chorus1", {
                strength: "veryWeak",
                prefixProbsOverride: [0.7]
            }],
            ["verse1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["chorus1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }]
        ],
        likelihood: 1 * cY.strictBuildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", {
                strength: "veryWeak",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0],
                sameGroupIndexSames: [createFilledNumericIncArray(24, 0, 1)]
            }],
            ["verse1", {
                strength: "medium",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["verse1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["chorus1", {
                strength: "veryWeak",
                prefixProbsOverride: [0.7]
            }],
            ["verse1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["bridgeNoMelody1", {
                strength: "strong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }],
            ["chorus1", {
                strength: "veryStrong",
                prefixProbsOverride: [0],
                postfixProbsOverride: [0]
            }]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.strictBuildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0],
                [createFilledNumericIncArray(24, 0, 1)]
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.strictBuildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0],
                [createFilledNumericIncArray(24, 0, 1)]
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.strictBuildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0],
                [createFilledNumericIncArray(24, 0, 1)]
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["bridgeNoMelody1", "strong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.strictBuildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryStrong", [0],
                [0]
            ]
        ],
        likelihood: 1 * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["bridgeNoMelody1", "strong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryStrong", [0],
                [0]
            ]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["bridgeNoMelody1", "strong", [0],
                [0]
            ],
            ["chorus1", "veryStrong", [0],
                [0]
            ]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["bridgeNoMelody1", "strong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1", "veryWeak", [0],
                [0], null
            ],
            ["verse1", "medium", [0],
                [0]
            ],
            ["chorus1", "veryWeak", [0.7], null],
            ["chorus1", "veryStrong", [0],
                [0]
            ],
            ["bridgeNoMelody1", "strong", [0],
                [0]
            ],
            ["verse1", "veryStrong", [0.7],
                [0]
            ]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.buildSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verseNoMelody2"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["chorusNoMelody1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["chorus1"],
            ["verseNoMelody1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus2"],
            ["chorus1"],
            ["chorusNoMelody2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["chorusNoMelody1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["verse1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["verse1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["verse1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["verse1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["bridge1"],
            ["verse1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["verse1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["bridge1"],
            ["verse2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse2"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["verse2"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["verse2"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["verse2"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["chorus1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["chorus1"],
            ["chorus1"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["chorus2"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["chorus2"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridge1"],
            ["chorus1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }, {
        data: [
            ["verse1"],
            ["chorus1"],
            ["verse1"],
            ["chorus1"],
            ["bridgeNoMelody1"],
            ["chorus1"],
            ["chorus2"]
        ],
        likelihood: 1 * cY.noMelodyPartSongStructureLikelihoodMultiplier * cY.verseChorusBridgeSongStructureLikelihoodMultiplier
    }];

    function aV(cZ) {
        for (var k = 0; k < cZ.length; k++) {
            if (cZ[k]._constructorName == "SongPartStructureInfo") {
                cZ[k].strength = SongPartStrength.toIndicatorString(cZ[k].strength);
                cZ[k] = [SongPartType.toIndicatorString(cZ[k].partType), cZ[k]]
            }
        }
    }
    var cr = copyValueDeep(cY.songPartStructureRndInfos);
    for (var bS = 0; bS < cr.length; bS++) {
        var cc = cr[bS];
        var bp = cc.data;
        aV(bp)
    }
    if (cY.overwriteSongPartStructureRndInfos && cr.length > 0) {
        aq = copyValueDeep(cr)
    }
    var bw = cY.minorHarmonicPlans;
    var cl = cY.majorHarmonicPlans;
    var a = createOrGetRandom(cY, "modulationSeed");
    var cK = copyValueDeep(aq);
    for (var bS = 0; bS < cK.length; bS++) {
        var Q = cK[bS];
        var bp = Q.data;
        var cN = bp.length > 5;
        for (var bO = 0; bO < bp.length; bO++) {
            if (bp[bO].length > 1) {
                cN = false;
                break
            }
        }
        var cp = false;
        var bF = [];
        var bD = copyValueDeep(Q);
        var w = bD.data;
        var X = bs == ScaleType.MAJOR ? cl : bw;
        var F = sampleData(X, a);
        if (cN) {
            var b0 = F.length - 1;
            var cb = 1 + Math.floor(a.random() * (w.length - 3));
            var ba = Math.max(cb + b0, w.length - 2 - Math.floor(a.random() * (w.length - cb)));
            var by = clamp(cb + 1 + Math.floor(a.random() * (ba - cb)), cb + 1, ba - 1);
            var bF = F.length == 2 ? [cb, ba] : [cb, by, ba];
            cp = true
        }
        if (cY.overwriteGroupModulationIndices) {
            var bk = true;
            var cS = [];
            var b9 = "groupModulation" + F.length + "Indices";
            if (cY[b9].length == F.length) {
                for (var bO = 0; bO < cY[b9].length; bO++) {
                    var cg = cY[b9][bO];
                    if (cg >= bp.length) {
                        bk = false
                    }
                    cS.push(cg)
                }
            } else {
                bk = false
            }
            if (bk) {
                bF = cS;
                cp = true
            } else {
                console.log("overwrite group modulation indices failed " + cY[b9] + " " + F.length)
            }
        }
        if (cp) {
            for (var bO = 0; bO < bF.length; bO++) {
                var cf = w[bF[bO]][1];
                if (!cf || isArray(cf)) {
                    w[bF[bO]][1] = {
                        groupModulationTarget: F[bO]
                    }
                } else {
                    cf.majorGroupModulationTarget = F[bO];
                    cf.minorGroupModulationTarget = F[bO]
                }
            }
            bD.likelihood *= cY.modulateLikelihoodMultiplier;
            aq.push(bD)
        }
    }
    var bB = createOrGetRandom(cY, "songStructureSeed");
    var b3 = sampleData(aq, bB);
    if (cY.overwriteSongPartStructure && cY.songPartStructure.length > 0) {
        b3 = copyValueDeep(cY.songPartStructure);
        aV(b3)
    }
    var av = false;
    var cL = false;
    var cn = false;
    var aN = cY.renderAmountStrengthMap;
    var cw = bP;
    var ca = bs;
    var aO = createOrGetRandom(cY, "glueSeed");
    var a4 = {};
    for (var bS = 0; bS < b3.length; bS++) {
        var ch = b3[bS][0];
        var aM = b3[bS][1];
        var cj = "";
        var aS = null;
        var a7 = null;
        var bt = null;
        var K = -1;
        var h = [];
        var bL = [];
        if (typeof (aM) == "object") {
            cj = aM.strength;
            aS = aM.prefixProbsOverride;
            a7 = aM.postfixProbsOverride;
            bt = aM.sameGroupIndexSames;
            h = (aM.harmonyElementIndices && aM.harmonyElementIndices.length > 0) ? aM.harmonyElementIndices : [];
            if (ca == ScaleType.NATURAL_MINOR) {
                K = typeof (aM.minorGroupModulationTarget) === "undefined" ? -1 : aM.minorGroupModulationTarget
            } else {
                K = typeof (aM.majorGroupModulationTarget) === "undefined" ? -1 : aM.majorGroupModulationTarget
            }
        } else {
            cj = b3[bS][1];
            aS = b3[bS][2];
            a7 = b3[bS][3];
            bt = b3[bS][4]
        }
        var aX = a4[ch];
        var ag = cj ? aN[cj] : null;
        var at = ch.indexOf("verse") >= 0;
        var R = ch.indexOf("chorus") >= 0;
        var D = ch.indexOf("bridge") >= 0;
        var aj = ch.indexOf("misc") >= 0;
        var aJ = ch.indexOf("NoMelody") >= 0;
        var O = parseInt(ch.charAt(ch.length - 1)) - 1;
        if (!aX) {
            if (at) {
                aX = cy[O % cy.length].data.groups
            } else {
                if (R) {
                    aX = b6[O % b6.length].data.groups
                } else {
                    if (D) {
                        aX = E[O % E.length].data.groups
                    } else {
                        aX = ae[O % ae.length].data.groups
                    }
                }
            }
            a4[ch] = aX
        }
        var cD = null;
        for (var bO = 0; bO < cY.songPartTypeOverrideInfos.length; bO++) {
            var ao = cY.songPartTypeOverrideInfos[bO];
            if (ao.partType == aX[0]) {
                cD = ao;
                break
            }
        }
        if (cD) {
            if (h.length == 0) {
                h = cD.harmonyElementIndices
            }
        }
        if (h.length == 0) {
            h = [0]
        }
        if (!ag) {
            if (at) {
                ag = createFilledPatternArray(aX.length, sampleData(bI, cC))
            } else {
                if (R) {
                    ag = createFilledPatternArray(aX.length, sampleData(cG, cC))
                } else {
                    if (D) {
                        ag = createFilledPatternArray(aX.length, sampleData(ce, cC))
                    } else {
                        ag = createFilledPatternArray(aX.length, sampleData(B, cC))
                    }
                }
            }
        }
        var bo = [];
        var a5 = [];
        var N = [];
        var a2 = [];
        var ct = [];
        var bC = bo.length;
        var bl = bo.length == 0;
        var a0 = bS < b3.length - 1;
        var bR = bS > 0 && a1[a1.length - 1] == 0;
        for (var bO = 0; bO < aX.length; bO++) {
            bL[bO] = [];
            if (bl) {
                bo[bO] = cC.genrand_int31()
            } else {
                bo[bO] = bo[bO % bC]
            }
            if (bt && bt.length > 0) {
                bm[aX[bO]] = bt[bO % bt.length]
            }
            var aw = cY.defaultPrefixGlueProbability;
            var c = cY.defaultPostfixGlueProbability;
            var aQ = [0.05, 0.14];
            var cM = [0.05, 0.25];
            if (D) {
                aw = 0.1;
                c = 0.1
            }
            if (cn) {
                c = 0.1
            }
            if (R) {
                c = 0.5;
                cM = [0.05, 0.15]
            }
            if ((av || cn) && R) {
                aw = 0.5;
                aQ = [0.3, 0.5]
            }
            a2[bO] = bO == 0 && bR && aO.random() < aw ? 1 : 0;
            ct[bO] = bO == aX.length - 1 && a0 && aO.random() < c ? 1 : 0;
            a2[bO] *= cY.prefixGlueProbabilityMultiplier;
            ct[bO] *= cY.postfixGlueProbabilityMultiplier;
            a5[bO] = aQ;
            N[bO] = cM;
            (function (k) {
                if (k && typeof (k) == "object") {
                    var j = [];
                    if (k.melodyRenderAmountOverride && k.melodyRenderAmountOverride.length > 0) {
                        j.push(function (cZ) {
                            setMod("melodyRenderAmountVar", "" + k.melodyRenderAmountOverride[0], cZ)
                        })
                    }
                    if (k.inner1RenderAmountOverride && k.inner1RenderAmountOverride.length > 0) {
                        j.push(function (cZ) {
                            setMod("inner1RenderAmountVar", "" + k.inner1RenderAmountOverride[0], cZ)
                        })
                    }
                    if (k.inner2RenderAmountOverride && k.inner2RenderAmountOverride.length > 0) {
                        j.push(function (cZ) {
                            setMod("inner2RenderAmountVar", "" + k.inner2RenderAmountOverride[0], cZ)
                        })
                    }
                    if (k.bassRenderAmountOverride && k.bassRenderAmountOverride.length > 0) {
                        j.push(function (cZ) {
                            setMod("bassRenderAmountVar", "" + k.bassRenderAmountOverride[0], cZ)
                        })
                    }
                    if (k.percussionRenderAmountOverride && k.percussionRenderAmountOverride.length > 0) {
                        j.push(function (cZ) {
                            setMod("percussionRenderAmountVar", "" + k.percussionRenderAmountOverride[0], cZ)
                        })
                    }
                    if (k.harmonyRythmCountOverrides && k.harmonyRythmCountOverrides.length > 0) {
                        j.push(function (cZ) {
                            setMod("harmonyNoteCountVar", "" + k.harmonyRythmCountOverrides[getPhraseGroupIndex(cZ) % k.harmonyRythmCountOverrides.length], cZ)
                        })
                    }
                    if (k.harmonyTotalLengthOverrides && k.harmonyTotalLengthOverrides.length > 0) {
                        j.push(function (cZ) {
                            setMod("harmonyTotalLengthVar", "" + k.harmonyTotalLengthOverrides[getPhraseGroupIndex(cZ) % k.harmonyTotalLengthOverrides.length], cZ)
                        })
                    }
                    if (k.customMelodyCurveIndices && k.customMelodyCurveIndices.length > 0) {
                        j.push(function (c1) {
                            var c0 = k.customMelodyCurveIndices[getPhraseGroupIndex(c1) % k.customMelodyCurveIndices.length];
                            if (cY.customMelodyCurveInfos && cY.customMelodyCurveInfos.length > 0) {
                                if (c0 > 0) {
                                    var cZ = cY.customMelodyCurveInfos[(c0 - 1) % cY.customMelodyCurveInfos.length];
                                    cZ = copyObjectDeep(cZ);
                                    var c2 = copyObjectDeep(cZ.getCurve());
                                    if (c2) {
                                        setMod("melodyCurveAmplitudeVar", "" + cZ.amplitude, c1);
                                        setMod("melodyCurveBiasVar", "" + cZ.bias, c1);
                                        setMod("melodyCurveTypeVar", "" + cZ.type, c1);
                                        setMod("melodyCurveIdVar", '"' + c2.id + '"', c1);
                                        setMod("melodyCurveMultiplyAmpVar", "false", c1);
                                        cx.addCurve(c2)
                                    }
                                }
                            }
                        })
                    }
                    if (k.customBassCurveIndices && k.customBassCurveIndices.length > 0) {
                        j.push(function (c1) {
                            var c0 = k.customBassCurveIndices[getPhraseGroupIndex(c1) % k.customBassCurveIndices.length];
                            if (cY.customBassCurveInfos && cY.customBassCurveInfos.length > 0) {
                                if (c0 > 0) {
                                    var cZ = cY.customBassCurveInfos[(c0 - 1) % cY.customBassCurveInfos.length];
                                    cZ = copyObjectDeep(cZ);
                                    var c2 = copyObjectDeep(cZ.getCurve());
                                    if (c2) {
                                        setMod("bassCurveAmplitudeVar", "" + cZ.amplitude, c1);
                                        setMod("bassCurveBiasVar", "" + cZ.bias, c1);
                                        setMod("bassCurveTypeVar", "" + cZ.type, c1);
                                        setMod("bassCurveIdVar", '"' + c2.id + '"', c1);
                                        setMod("bassCurveMultiplyAmpVar", "false", c1);
                                        cx.addCurve(c2)
                                    }
                                }
                            }
                        })
                    }
                    if (k.overrideScaleBaseNote) {
                        j.push(function (cZ) {
                            setMod("harmonyScaleBaseVar", "" + k.scaleBaseNote, cZ)
                        })
                    }
                    if (k.overrideScaleType) {
                        j.push(function (cZ) {
                            setMod("scaleTypeVar", "" + k.scaleType, cZ)
                        })
                    }
                    if (k.extraMelodyRenderElementIndices) {
                        j.push(function (cZ) {
                            setMod("extraMelodyRenderElementIndicesVar", JSON.stringify(k.extraMelodyRenderElementIndices), cZ)
                        })
                    }
                    if (k.extraInner1RenderElementIndices) {
                        j.push(function (cZ) {
                            setMod("extraInner1RenderElementIndicesVar", JSON.stringify(k.extraInner1RenderElementIndices), cZ)
                        })
                    }
                    if (k.extraInner2RenderElementIndices) {
                        j.push(function (cZ) {
                            setMod("extraInner2RenderElementIndicesVar", JSON.stringify(k.extraInner2RenderElementIndices), cZ)
                        })
                    }
                    if (k.extraBassRenderElementIndices) {
                        j.push(function (cZ) {
                            setMod("extraBassRenderElementIndicesVar", JSON.stringify(k.extraBassRenderElementIndices), cZ)
                        })
                    }
                    if (k.extraPercussionRenderElementIndices) {
                        j.push(function (cZ) {
                            setMod("extraPercussionRenderElementIndicesVar", JSON.stringify(k.extraPercussionRenderElementIndices), cZ)
                        })
                    }
                    bL[bO] = j
                }
            })(aM);
            if (aJ) {
                bL[bO].push(function (j) {
                    setMod("melodyRenderAmountVar", "0", j)
                })
            }
        }
        if (aS && aS.length > 0) {
            a2 = aS
        }
        if (a7 && a7.length > 0) {
            ct = a7
        }
        addAll(br, createFilledArray(aX.length, K >= 0));
        addAll(a3, createFilledArray(aX.length, K));
        addAll(P, createFilledArray(aX.length, cw));
        addAll(ck, createFilledArray(aX.length, ca));
        addAll(ci, createFilledArrayWithCopyValue(aX.length, h));
        addAll(S, aX);
        addAll(cF, ag);
        addAll(bV, bo);
        addAll(bJ, a5);
        addAll(M, N);
        addAll(cm, a2);
        addAll(a1, ct);
        addAll(cR, bL);
        if (K >= 0) {
            var cE = new ConstantHarmonyElement().setScaleType(ca).setBaseNote(cw);
            cw = cE.getAbsoluteNoteFromScaleIndex(K + 1);
            ca = DynamicHarmonyModulationTarget.getScaleType(ca, K, false)
        }
        cn = D;
        av = at;
        cL = R
    }
    var e = cw;
    var cJ = ca;
    var d = [];
    var bY = {};
    var cA = {};
    var aU = {};
    var bQ = {};
    var be = cY.majorModulationTargetInfos;
    var aK = cY.minorModulationTargetInfos;
    var bh = [];
    var bn = [];
    var L = [];
    var cX = [];
    var H = [];
    var cV = [];
    var a8 = [];
    var bg = 0;
    var b2 = 0;
    var g = [];
    var aC = [];
    var r = ar / 120;
    var cz = r * (cY.tempoAdaptBias + aa.random() * cY.tempoAdaptRandomMultiplier);
    if (!cY.adaptTempoToRenderAmount) {
        cz = 0
    }
    var bx = createOrGetRandom(cY, "phraseGroupSeed");
    var cU = createOrGetRandom(cY, "tonicizationSeed");
    var l = createOrGetRandom(cY, "phraseGroupSimilaritySeed");
    for (var bS = 0; bS < S.length; bS++) {
        var cg = S[bS];
        var I = bY[cg];
        var bL = cR[bS];
        var aZ = ci[bS];
        var cD = null;
        for (var bO = 0; bO < cY.songPartTypeOverrideInfos.length; bO++) {
            var ao = cY.songPartTypeOverrideInfos[bO];
            if (ao.partType == cg) {
                cD = ao;
                break
            }
        }
        var cv = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE];
        if (cD && cD.customPhraseTypes && cD.customPhraseTypes.length > 0) {
            cv = copyValueDeep(cD.customPhraseTypes);
            if (!cv) {
                console.log("Failed to clone custom phrase types " + cD.customPhraseTypes.join(", "))
            }
        }
        var K = a3[bS];
        var aR = ck[bS];
        var bb = P[bS];
        var V = cA[cg];
        var a6 = aU[cg];
        var bA = false;
        if (K >= 0) {
            var u = I;
            V = K;
            a6 = K;
            I = sampleData(bu, a);
            if (I == SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE) {
                I = u;
                bA = true
            }
        }
        var aH = bQ[cg];
        var C = cH[cg];
        if (!C) {
            C = [];
            cH[cg] = C
        }
        if (typeof (aH) === "undefined" || typeof (I) === "undefined") {
            var bd = Math.floor(aL.length * (cY.withinPhraseGroupSimilarBias + l.random() * cY.withinPhraseGroupSimilarRandomFraction));
            var ak = copyValueDeep(aL);
            for (var bO = 0; bO < b5.length; bO++) {
                ak[b5[bO]].likelihood = 0.0001
            }
            aH = sampleNDataWithoutReplacement(ak, bd, l, true);
            bQ[cg] = aH;
            addAll(aH, b5);
            if (K == -1 || bA) {
                var bK = aF(cY.tonicizeLikelihoodMultipliers[cg % cY.tonicizeLikelihoodMultipliers.length]);
                I = sampleData(bK, bx);
                if (cD && cD.overridePhraseGroupType) {
                    I = cD.phraseGroupType
                }
                V = -1;
                a6 = -1;
                if (SimpleModuleGeneratorPhraseGroupType.tonicizeOrModulate(I)) {
                    V = sampleData(be, cU);
                    a6 = sampleData(aK, cU);
                    if (cD && cD.overrideMajorModulationTarget) {
                        V = cD.majorModulationTarget
                    }
                    if (cD && cD.overrideMinorModulationTarget) {
                        a6 = cD.minorModulationTarget
                    }
                }
                cA[cg] = V;
                aU[cg] = a6;
                bY[cg] = I
            }
        }

        function b4(c4, da, c5, c8, c6, de, k, c9, j, cZ, db, c3, dd, c0, dc, c1, c2) {
            if (!dd) {
                dd = 4
            }
            if (typeof (c8) === "undefined") {
                console.log("Adding undef actual group " + c5 + " " + c6 + " " + de + "/" + k + " groupType: " + c8 + " connect: " + cZ + " isIntro: " + db + " isEnd: " + c3 + " groupmodtarget: " + K)
            }
            var c7 = ar + cz * c4;
            if (!dc) {
                dc = [0]
            }
            d.push(dc);
            ay.push(c4);
            au.push(da);
            bq.push(dd);
            aY.push(c5);
            g.push(c8);
            aC.push(cg);
            co.push(c6);
            bv.push(de);
            cu.push(k);
            W.push(!!c0);
            bz.push(copyValueDeep(c9));
            aD.push(j);
            C.push(b2);
            cX.push(!!cZ);
            H.push(!!c1);
            cV.push(!!c2);
            a8.push(cZ ? -1 : bg);
            L.push(c3);
            bn.push(db);
            bT.push(c7);
            bh.push(cv);
            if (!cZ) {
                bg++
            }
            b2++
        }

        function bc(k, c4, c3, c8, c9, j, da, cZ, c2) {
            var c7 = sampleData(T, aO);
            var c1 = c7 == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ? 2 + Math.floor(aO.random() * 4) : 4 + Math.floor(aO.random() * 3);
            var c6 = c7 == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG;
            var c1 = sampleData([{
                data: 1,
                likelihood: c6 ? 1 : 0
            }, {
                data: 2,
                likelihood: c6 ? 1 : 0
            }, {
                data: 3,
                likelihood: c6 ? 1 : 0
            }, {
                data: 4,
                likelihood: c6 ? 0.5 : 1
            }, {
                data: 5,
                likelihood: c6 ? 0.25 : 1
            }, {
                data: 6,
                likelihood: c6 ? 0 : 1
            }], aO);
            var c0 = sampleData([{
                data: 1,
                likelihood: ar < 90 ? 6 : 3
            }, {
                data: 2,
                likelihood: 1
            }], aO);
            if (J == 2) {
                c0 *= 2
            }
            if (c7 == SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT) {
                switch (J) {
                    case 2:
                        c0 = sampleData([{
                            data: 0.5,
                            likelihood: ar < 90 ? 0.5 : 1
                        }, {
                            data: 1,
                            likelihood: ar < 90 ? 0.25 : 0.5
                        }], aO);
                        break;
                    case 3:
                        c0 = sampleData([{
                            data: 1 / 3,
                            likelihood: ar < 90 ? 1 : 0.25
                        }, {
                            data: 2 / 3,
                            likelihood: ar < 90 ? 0.5 : 1
                        }, {
                            data: 1,
                            likelihood: ar < 90 ? 0.25 : 0.5
                        }], aO);
                        break;
                    case 4:
                        c0 = sampleData([{
                            data: 0.25,
                            likelihood: ar < 90 ? 1 : 0.25
                        }, {
                            data: 0.5,
                            likelihood: ar < 90 ? 0.5 : 1
                        }, {
                            data: 1,
                            likelihood: ar < 90 ? 0.25 : 0.5
                        }], aO);
                        break;
                    default:
                        c0 = 0.5
                }
                c1 = 1
            }
            var c5 = j + da * aO.random();
            var db = false;
            b4(c5, aO.genrand_int31(), k, c7, c4, c3, c8, c9, [function (dc) {
                setMod("harmonyNoteCountVar", "" + c1, dc);
                setMod("harmonyTotalLengthVar", "" + c0, dc);
                setMod("harmonyRythmLengthTypeVar", "" + (J == 3 ? NoteRythmElementLengthType.DOT : NoteRythmElementLengthType.NORMAL), dc);
                setMod("melodyRenderAmountVar", "" + 0, dc)
            }], true, false, false, J, false, aZ, cZ, c2)
        }
        if (bS == 0 && aB) {
            b4(ax, cT.genrand_int31(), aR, ap, bb, -1, -1, aH, [function (j) {
                setMod("harmonyNoteCountVar", "" + bX, j);
                setMod("harmonyTotalLengthVar", "" + aW, j);
                setMod("harmonyRythmLengthTypeVar", "" + (J == 3 ? NoteRythmElementLengthType.DOT : NoteRythmElementLengthType.NORMAL), j);
                setMod("melodyRenderAmountVar", "" + (cd ? 1 : 0), j)
            }], false, true, false, J, false, [0])
        }
        var y = aO.random() < cm[bS];
        if (y) {
            var bU = bJ[bS];
            bc(aR, bb, -1, -1, aH, bU[0], bU[1], true, false)
        }
        if (I == SimpleModuleGeneratorPhraseGroupType.CUSTOM) {
            if (cv) {
                for (var bN = 0; bN < cv.length; bN++) {
                    switch (cv[bN]) {
                        case PhraseHarmonyElementType.COMPLETE_MODULATE:
                        case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                        case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                        case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                        case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                        case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                            V = sampleData(be, cU);
                            a6 = sampleData(aK, cU);
                            if (cD && cD.overrideMajorModulationTarget) {
                                V = cD.majorModulationTarget
                            }
                            if (cD && cD.overrideMinorModulationTarget) {
                                a6 = cD.minorModulationTarget
                            }
                            break
                    }
                }
            } else {
                console.log("Could not find any custom phrase types")
            }
        }
        b4(cF[bS], bV[bS], aR, I, bb, V, a6, aH, bL, false, false, false, J, false, aZ);
        var b = aO.random() < a1[bS];
        if (b) {
            var b8 = aR;
            var cs = bb;
            if (bS + 1 < S.length) {
                b8 = ck[bS + 1];
                cs = P[bS + 1]
            }
            var bU = M[bS];
            bc(b8, cs, -1, -1, aH, bU[0], bU[1], false, true)
        }
        if (bS == S.length - 1 && s) {
            b4(bG, bZ.genrand_int31(), cJ, Z, e, -1, -1, aH, [function (j) {
                setMod("harmonyNoteCountVar", "" + z, j);
                setMod("harmonyTotalLengthVar", "" + bi, j);
                setMod("harmonyRythmLengthTypeVar", "" + (J == 3 ? NoteRythmElementLengthType.NORMAL : NoteRythmElementLengthType.NORMAL), j);
                setMod("melodyRenderAmountVar", "" + (G ? 1 : 0), j)
            }], false, false, true, J, false)
        }
    }
    var aT = createOrGetRandom(cY, "groupSimilaritySeed");
    var cI = createOrGetRandom(cY, "groupDifferenceSeed");
    var v = [];
    for (var az in bY) {
        var I = bY[az];
        az = parseInt(az);
        var m = cH[az];
        if (m.length > 1) {
            var f = copyValueDeep(aL);
            var bd = Math.floor(aL.length * (cY.samePhraseGroupIndexSimilarBias + cY.samePhraseGroupIndexSimilarRandomFraction * aT.random()));
            var bj = sampleNDataWithoutReplacement(f, bd, aT, true);
            var Q = {
                groupIndices: m,
                properties: bj
            };
            v.push(Q);
            var t = an[I];
            if (t) {
                v.push({
                    groupIndices: m,
                    properties: t
                })
            }
            t = bm[az];
            if (t) {
                v.push({
                    groupIndices: m,
                    properties: t
                })
            }
        }
    }
    var b1 = [];
    for (var cP in bY) {
        cP = parseInt(cP);
        var ac = cH[cP];
        for (var cO in bY) {
            cO = parseInt(cO);
            if (cO > cP) {
                var ab = cH[cO];
                var f = copyValueDeep(aL);
                var a9 = Math.floor(aL.length * (cY.differentPhraseGroupIndexDifferentBias + cY.differentPhraseGroupIndexDifferentRandomFraction * cI.random()));
                var q = sampleNDataWithoutReplacement(f, a9, cI, true);
                for (var bS = 0; bS < ac.length; bS++) {
                    for (var bO = 0; bO < ab.length; bO++) {
                        var Q = {
                            groupIndices: [ac[bS], ab[bO]],
                            properties: q
                        };
                        b1.push(Q)
                    }
                }
            }
        }
    }
    var Y = {
        baseTempo: ar,
        propertyNameCounts: aI,
        groupTypes: g,
        songPartTypes: aC,
        customPhraseTypes: bh,
        groupRenderAmounts: ay,
        groupRenderAmountSeeds: au,
        groupNumerators: bq,
        groupTempos: bT,
        groupHarmonyElementIndices: d,
        groupScaleTypes: aY,
        groupScaleBaseNotes: co,
        groupMajorModulationTargets: bv,
        groupMinorModulationTargets: cu,
        groupModulationInvertScaleTypes: W,
        alwaysSameInfos: [
            [PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION, PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION]
        ],
        withinGroupSameInfos: bz,
        withinGroupDifferentInfos: bH,
        groupSameInfos: v,
        groupDifferentInfos: b1,
        groupModifierFunctions: aD,
        notConnectGroupIndices: a8,
        isConnectGroups: cX,
        isPrefixGroups: H,
        isPostfixGroups: cV,
        isIntros: bn,
        isEnds: L
    };
    return Y
}

function checkConstraints(y, d, n, p, z, l, r, b, B) {
    var A = 0;
    var h = d.groupIndices[z];
    var m = d.indicesForGroups[h];
    var t = m[m.length - 1] == z;
    for (var v = 0; v < l.length; v++) {
        var q = l[v];
        if (arrayContains(q, h)) {
            if (t) {
                for (var x = 0; x < q.length; x++) {
                    var o = q[x];
                    if (o < h) {
                        var c = d.indicesForGroups[o];
                        for (var w = 0; w < Math.min(m.length, c.length); w++) {
                            var a = m[w];
                            var e = c[w];
                            if (p[a][0] != p[e][0]) {
                                A++
                            }
                        }
                    }
                }
            }
        }
    }
    for (var v = 0; v < r.length; v++) {
        var g = r[v];
        if (arrayContains(g, h)) {
            if (t) {
                for (var x = 0; x < g.length; x++) {
                    var o = g[x];
                    if (o < h) {
                        var c = d.indicesForGroups[o];
                        var s = true;
                        for (var w = 0; w < Math.min(m.length, c.length); w++) {
                            var a = m[w];
                            var e = c[w];
                            if (p[a][0] != p[e][0]) {
                                s = false
                            }
                        }
                        if (s) {
                            A++
                        }
                    }
                }
            }
        }
    }
    if (t) {
        if (arrayContains(b, h)) {
            var f = m[0];
            var u = p[f][0];
            for (var x = 1; x < m.length; x++) {
                if (p[m[x]][0] != u) {
                    A++
                }
            }
        }
        if (arrayContains(B, h)) {
            var f = m[0];
            var u = p[f][0];
            var s = true;
            for (var x = 1; x < m.length; x++) {
                if (p[m[x]][0] != u) {
                    s = false;
                    break
                }
            }
        }
    }
    return A
}

function assignPropertyIndexArrayRec(m, l, n, q, h, j, a, d, b, c) {
    if (h >= l.phraseTypes.length) {
        if (c.currentSolutionCost < c.bestSolutionCost) {
            c.bestSolutionCost = c.currentSolutionCost;
            c.bestSolution = q
        }
        if (c.bestSolution == null) {
            c.bestSolution = q
        }
        return q
    }
    var p = null;
    var e = q[h];
    for (var g = 0; g < e.length; g++) {
        c.expansions++;
        if (c.expansions > c.maxExpansions) {
            break
        }
        var f = copyValueDeep(q);
        f[h] = [e[g]];
        var o = checkConstraints(m, l, n, f, h, j, a, d, b);
        if (o + c.currentSolutionCost < c.bestSolutionCost) {
            c.currentSolutionCost += o;
            var k = assignPropertyIndexArrayRec(m, l, n, f, h + 1, j, a, d, b, c);
            c.currentSolutionCost -= o;
            if (k) {
                p = k;
                if (c.bestSolutionCost < 0.01) {
                    break
                }
            }
        }
    }
    return p
}

function assignPropertyIndexArray(w, f, k, l) {
    var r = 100;
    var p = false;
    while (!p && r < 20000) {
        var d = {
            expansions: 0,
            maxExpansions: r,
            bestSolution: null,
            bestSolutionCost: 1,
            currentSolutionCost: 0
        };
        var x = k.propertyNameCounts[w];
        var q = x[0];
        var a = x[1];
        var m = [];
        for (var t = 0; t < f.phraseTypes.length; t++) {
            var z = createFilledNumericIncArray(a, 0, 1);
            arrayShuffle(z, l);
            m.push(z)
        }
        var o = [];
        for (var t = 0; t < k.groupSameInfos.length; t++) {
            var j = k.groupSameInfos[t];
            var b = [];
            if (arrayContains(j.properties, w)) {
                addAll(b, j.groupIndices);
                o.push(b)
            }
        }
        var g = [];
        for (var t = 0; t < k.groupDifferentInfos.length; t++) {
            var n = k.groupDifferentInfos[t];
            var b = [];
            if (arrayContains(n.properties, w)) {
                addAll(b, n.groupIndices);
                g.push(b)
            }
        }
        var c = [];
        for (var t = 0; t < k.withinGroupSameInfos.length; t++) {
            var v = k.withinGroupSameInfos[t];
            if (arrayContains(v, w)) {
                c.push(t)
            }
        }
        var y = [];
        for (var t = 0; t < k.withinGroupDifferentInfos.length; t++) {
            var h = k.withinGroupDifferentInfos[t];
            if (arrayContains(h, w)) {
                y.push(t)
            }
        }
        var u = assignPropertyIndexArrayRec(w, f, k, m, 0, o, g, c, y, d);
        if (d.bestSolution) {
            for (var t = 0; t < u.length; t++) {
                var s = u[t][0];
                f[q][t] = s
            }
            p = true
        } else {
            r *= 2;
            p = false
        }
    }
    if (!p) {
        console.log("Unable to find solution for " + q);
        for (var t = 0; t < f.phraseTypes.length; t++) {
            var e = f.songPartTypes[t % f.songPartTypes.length];
            f[q][t] = e % f.phraseTypes.length
        }
    }
}

function assignPropertyIndexArrays(c, h, l, q) {
    var o = [];
    for (var u = 0; u < h.propertyNameCounts.length; u++) {
        if (!o[u]) {
            var p = h.propertyNameCounts[u][2];
            assignPropertyIndexArray(u, c, h, p);
            for (var s = 0; s < h.alwaysSameInfos.length; s++) {
                var n = h.alwaysSameInfos[s];
                if (arrayContains(n, u)) {
                    for (var r = 0; r < n.length; r++) {
                        var d = n[r];
                        if (d != u) {
                            var x = h.propertyNameCounts[u];
                            var m = x[0];
                            var w = h.propertyNameCounts[d];
                            var t = w[0];
                            c[t] = copyValueDeep(c[m]);
                            o[d] = true
                        }
                    }
                }
            }
            o[u] = true
        }
    }
    for (var u = 0; u < h.propertyNameCounts.length; u++) {
        var x = h.propertyNameCounts[u];
        var m = x[0];
        var e = m.substring(0, m.indexOf("Indices")) + "IndexOverride";
        var f = -1;
        var y = 0;
        for (var r = 0; r < c.phraseTypes.length; r++) {
            var b = c.songPartTypes[r];
            if (b == f) {
                y++
            } else {
                y = 0
            }
            f = b;
            for (var s = 0; s < q.songPartTypeOverrideInfos.length; s++) {
                var v = q.songPartTypeOverrideInfos[s];
                if (v.partType == b) {
                    var g = v[e];
                    if (g && g.length > 0) {
                        var a = g[y % g.length];
                        c[m][r] = a
                    } else {
                        if (typeof (g) === "undefined") {
                            console.log("Could not find index override prop " + e)
                        }
                    }
                }
            }
        }
    }
    c.phraseTypeIndices = [];
    for (var u = 0; u < c.phraseTypes.length; u++) {
        c.phraseTypeIndices[u] = u;
        c.harmonyIndices[u] = u;
        c.tempoIndices[u] = u;
        c.renderAmountIndices[u] = u
    }
}

function getPhraseTypesFromGroupType(a, c, b) {
    if (!b) {
        b = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE]
    }
    switch (a) {
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DOUBLE_CUSTOM_HARMONY:
            c.push(PhraseHarmonyElementType.COMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
            addAll(c, b);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL:
            c.push(PhraseHarmonyElementType.COMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL:
            c.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            c.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG:
            c.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE:
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
            c.push(PhraseHarmonyElementType.COMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
            c.push(PhraseHarmonyElementType.COMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.CONSEQUENT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_IMPERFECT:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE:
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE:
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.INCOMPLETE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            c.push(PhraseHarmonyElementType.COMPLETE_TONICIZE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            c.push(PhraseHarmonyElementType.COMPLETE_TONICIZE);
            c.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE:
            c.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        default:
            console.log("Unknown group type " + a);
            c.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            c.push(PhraseHarmonyElementType.COMPLETE);
            break
    }
}

function createSongStructureInfo(L, a, c) {
    var G = createPhraseGroupInfo(L, a, c);
    var E = {
        baseTempo: G.baseTempo,
        songPartTypes: [],
        phraseTypes: [],
        groupIndices: [],
        indicesForGroups: [],
        renderAmounts: [],
        renderAmountSeeds: [],
        numerators: [],
        tempos: [],
        scaleTypes: [],
        scaleBaseNotes: [],
        harmonyElementIndices: [],
        minorModulationTargets: [],
        majorModulationTargets: [],
        indexInfos: [],
        modifierFunctions: []
    };
    for (var P = 0; P < G.groupTypes.length; P++) {
        var F = G.groupTypes[P];
        var B = G.songPartTypes[P];
        var A = G.customPhraseTypes[P];
        var z = E.phraseTypes.length;
        var I = G.groupRenderAmounts[P];
        var g = G.groupRenderAmountSeeds[P];
        var S = G.groupScaleTypes[P];
        var p = G.groupTempos[P];
        var e = G.groupScaleBaseNotes[P];
        var l = G.groupHarmonyElementIndices[P];
        var v = G.groupMajorModulationTargets[P];
        var Q = G.groupMinorModulationTargets[P];
        var H = G.groupModulationInvertScaleTypes[P];
        var m = G.groupModifierFunctions[P];
        var h = G.groupNumerators[P];
        var D = G.isConnectGroups[P];
        var u = G.isPrefixGroups[P];
        var s = G.isPostfixGroups[P];
        var O = G.notConnectGroupIndices[P];
        var b = G.notConnectGroupIndices.length;
        var w = G.isEnds[P];
        var T = G.isIntros[P];
        var x = createFilledArray(4, p);
        var y = createFilledArray(4, S);
        var r = createFilledArray(4, e);
        var t = createFilledArray(4, -1);
        var q = createFilledArray(4, -1);
        var R = createFilledArray(4, m);
        var n = createFilledArray(4, I);
        var f = createFilledArray(4, g);
        var d = createFilledArray(4, h);

        function U(Z, k, W, j) {
            t[Z] = v;
            q[Z] = Q;
            if (Z == 0) {
                if (!k) {
                    var Y = v;
                    switch (y[0]) {
                        case ScaleType.MAJOR:
                            Y = v;
                            break;
                        case ScaleType.NATURAL_MINOR:
                            Y = Q;
                            break
                    }
                    var X = DynamicHarmonyModulationTarget.getScaleType(y[0], Y, false);
                    y[1] = X;
                    var V = new ConstantHarmonyElement().setScaleType(y[0]).setBaseNote(r[0]);
                    r[1] = V.getAbsoluteNoteFromScaleIndex(Y + 1)
                } else {
                    y[1] = y[0]
                }
            } else {
                if (W) {
                    if (y[0] == y[1]) {
                        t[Z] = DynamicHarmonyModulationTarget.invert(v);
                        q[Z] = DynamicHarmonyModulationTarget.invert(Q)
                    } else {
                        t[Z] = DynamicHarmonyModulationTarget.invert(Q);
                        q[Z] = DynamicHarmonyModulationTarget.invert(v)
                    }
                }
            }
            if (j) {
                t[Z] = -1;
                q[Z] = -1
            }
        }
        getPhraseTypesFromGroupType(F, E.phraseTypes, A);
        switch (F) {
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
                break;
            case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
                if (A) {
                    for (var N = 0; N < A.length; N++) {
                        switch (A[N]) {
                            case PhraseHarmonyElementType.COMPLETE_MODULATE:
                            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                                U(N, false);
                                break;
                            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                                U(N, true);
                                break
                        }
                    }
                } else {
                    console.log("Could not find any custom phrase types for group " + P)
                }
                break;
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
                R[0].push(function (j) {
                    setMod("melodyRenderAmountVar", "" + 0, j);
                    setMod("inner1RenderAmountVar", "" + 0, j);
                    setMod("inner2RenderAmountVar", "" + 0, j);
                    setMod("bassRenderAmountVar", "" + 0, j);
                    setMod("percussionRenderAmountVar", "" + 0, j)
                });
                break;
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                U(0, false);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                U(0, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
                U(0, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
                U(0, true);
                U(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
                U(0, false);
                U(1, true, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
                U(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
                U(0, false, false, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
                U(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
                y[1] = S == ScaleType.MAJOR ? ScaleType.NATURAL_MINOR : ScaleType.MAJOR;
                break
        }
        var J = E.phraseTypes.length - z;
        E.indicesForGroups[P] = [];
        for (var N = 0; N < J; N++) {
            E.indicesForGroups[P].push(E.groupIndices.length);
            E.groupIndices.push(P);
            E.renderAmounts[z + N] = n[N];
            E.renderAmountSeeds[z + N] = f[N];
            E.numerators[z + N] = d[N];
            E.tempos[z + N] = x[N];
            E.scaleTypes[z + N] = y[N];
            E.scaleBaseNotes[z + N] = r[N];
            E.majorModulationTargets[z + N] = t[N];
            E.minorModulationTargets[z + N] = q[N];
            E.modifierFunctions[z + N] = R[N];
            E.songPartTypes.push(B);
            E.harmonyElementIndices[z + N] = (l && l.length > 0) ? l[N % l.length] : 0;
            var C = {
                phraseGroupIndex: N,
                phraseGroupCount: J,
                songGroupIndex: P,
                songGroupCount: G.groupTypes.length,
                isConnectGroup: D,
                isPrefixGroup: u,
                isPostfixGroup: s,
                notConnectGroupIndex: O,
                notConnectGroupCount: b,
                isIntro: T,
                isEnd: w
            };
            E.indexInfos[z + N] = C
        }
        for (var N = 0; N < G.propertyNameCounts.length; N++) {
            var K = G.propertyNameCounts[N][0];
            var o = E[K];
            if (!o) {
                o = [];
                E[K] = o
            }
            for (var M = 0; M < J; M++) {
                o.push(-1)
            }
        }
    }
    assignPropertyIndexArrays(E, G, L, a);
    return E
}

function createTestModule(seed, inputGenInfo, resultObj) {
    if (!resultObj) {
        resultObj = {}
    }
    if (!seed) {
        seed = 898443427
    }
    if (!inputGenInfo) {
        inputGenInfo = {}
    }
    var rnd = new MersenneTwister(seed);
    var genInfo = new GenInfo();
    genInfo.randomize(rnd);
    genInfo.set(inputGenInfo);
    var globalRnd = new MersenneTwister(genInfo.globalSeed);
    globalRnd = null;
    var module = new GenMusicModule();
    var songStructureInfo = createSongStructureInfo(globalRnd, genInfo, module);
    genInfo.songStructureInfo = songStructureInfo;
    resultObj.songStructureInfo = songStructureInfo;
    var sectionInfos = createSectionInfos(genInfo);
    var genData = createModuleGeneratorData(genInfo, sectionInfos);
    var bassDrum = new MidiDrumNamedNote().setNote(MidiDrum.BASS_DRUM_1).setId("Bass drum");
    var snareDrum = new MidiDrumNamedNote().setNote(MidiDrum.SNARE_DRUM_1).setId("Snare drum");
    var hihat = new MidiDrumNamedNote().setNote(MidiDrum.CLOSED_HIHAT).setId("Hihat");
    module.namedNotes = [bassDrum, snareDrum, hihat];
    var percussionRenderChannel1 = new RenderChannel();
    percussionRenderChannel1.id = "percussionRenderChannel1";
    module.renderChannels.push(percussionRenderChannel1);
    var tempoChannel = new DoubleControlChannel();
    tempoChannel.defaultValue = 1;
    tempoChannel.mixMode = NumericControlChannelMixMode.MULT;
    tempoChannel.mixWithDefault = true;
    tempoChannel.id = "tempoChannel";
    module.controlChannels.push(tempoChannel);
    var voicePlanner = new ClassicalVoiceLinePlanner();
    voicePlanner.id = "voicePlanner";
    var hrDensityCurveSeedVar = new SimpleIntegerEditorVariable();
    hrDensityCurveSeedVar.id = "hrDensityCurveSeedVar";
    hrDensityCurveSeedVar.value = 341234;
    module.addVariable(hrDensityCurveSeedVar);
    var hrDensityCurveAmpVar = new SimpleIntegerEditorVariable();
    hrDensityCurveAmpVar.id = "hrDensityCurveAmpVar";
    hrDensityCurveAmpVar.value = 1;
    module.addVariable(hrDensityCurveAmpVar);
    var hrDensityCurveFreqVar = new SimpleIntegerEditorVariable();
    hrDensityCurveFreqVar.id = "hrDensityCurveFreqVar";
    hrDensityCurveFreqVar.value = 1;
    module.addVariable(hrDensityCurveFreqVar);
    var hrDensityCurve = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT_NOISE).setAmplitude(1).setFrequency(3).setSeed(3242);
    hrDensityCurve.seedUseExpression = true;
    hrDensityCurve.seedExpression = hrDensityCurveSeedVar.id;
    hrDensityCurve.amplitudeUseExpression = true;
    hrDensityCurve.amplitudeExpression = hrDensityCurveAmpVar.id;
    hrDensityCurve.frequencyUseExpression = true;
    hrDensityCurve.frequencyExpression = hrDensityCurveFreqVar.id;
    hrDensityCurve.id = "HR density curve";
    module.addCurve(hrDensityCurve);

    function createSplitRythm(rythmInfo) {
        var id = getValueOrDefault(rythmInfo, "id", "unnamedRythm1");
        var length = getValueOrDefault(rythmInfo, "length", 1);
        var lengthUnit = getValueOrDefault(rythmInfo, "lengthUnit", PositionUnit.HARMONY_ELEMENTS);
        var noteCount = getValueOrDefault(rythmInfo, "noteCount", 1);
        var noteCountUnit = getValueOrDefault(rythmInfo, "noteCountUnit", CountUnit.HARMONY_ELEMENT_BEATS);
        var extraNoteCount = getValueOrDefault(rythmInfo, "extraNotes", 0);
        var extraNoteCountUnit = getValueOrDefault(rythmInfo, "extraNoteCountUnit", CountUnit.PLAIN);
        var addZone1 = getValueOrDefault(rythmInfo, "addZone1", false);
        var zone1PositionInterval = getValueOrDefault(rythmInfo, "zone1PositionInterval", [0.5, 1]);
        var zone1MaxApplications = getValueOrDefault(rythmInfo, "zone1MaxApplications", 128);
        var zone1SplitStrategy = getValueOrDefault(rythmInfo, "zone1SplitStrategy", SplitStrategy.DOT_FIRST);
        var densityCurveId = getValueOrDefault(rythmInfo, "densityCurveId", "");
        var rythm = new Rythm();
        rythm.id = id;
        var rythmElement = new SplitRythmElement();
        rythmElement.setLength(length);
        rythmElement.setLengthUnit(lengthUnit);
        rythmElement.setExtraNoteCount(extraNoteCount);
        rythmElement.setExtraNoteCountUnit(extraNoteCountUnit);
        rythmElement.setNoteCount(noteCount);
        rythmElement.setNoteCountUnit(noteCountUnit);
        rythmElement.setDensityCurve(densityCurveId);
        if (addZone1) {
            var splitZone1 = new SplitZone();
            splitZone1.setPositionInterval(zone1PositionInterval);
            splitZone1.setPositionIntervalUnit(PositionUnit.HARMONY_ELEMENTS);
            splitZone1.setSplitStrategy(zone1SplitStrategy);
            splitZone1.maxApplications = zone1MaxApplications;
            rythmElement.addSplitZone(splitZone1)
        }
        rythm.addRythmElement(rythmElement);
        return rythm
    }
    var hrRythm = new Rythm();
    hrRythm.id = "hrRythm";
    var harmonyRaiseLeadingToneVar = new SimpleBooleanEditorVariable();
    harmonyRaiseLeadingToneVar.id = "harmonyRaiseLeadingToneVar";
    harmonyRaiseLeadingToneVar.value = true;
    module.addVariable(harmonyRaiseLeadingToneVar);
    var harmonySimpleMixtureLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySimpleMixtureLikelihoodVar.id = "harmonySimpleMixtureLikelihoodVar";
    harmonySimpleMixtureLikelihoodVar.value = 1;
    module.addVariable(harmonySimpleMixtureLikelihoodVar);
    var harmonySus2ChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySus2ChordsLikelihoodVar.id = "harmonySus2ChordsLikelihoodVar";
    harmonySus2ChordsLikelihoodVar.value = 1;
    module.addVariable(harmonySus2ChordsLikelihoodVar);
    var harmonySus4ChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySus4ChordsLikelihoodVar.id = "harmonySus4ChordsLikelihoodVar";
    harmonySus4ChordsLikelihoodVar.value = 1;
    module.addVariable(harmonySus4ChordsLikelihoodVar);
    var harmonyNeighbourChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonyNeighbourChordsLikelihoodVar.id = "harmonyNeighbourChordsLikelihoodVar";
    harmonyNeighbourChordsLikelihoodVar.value = 1;
    module.addVariable(harmonyNeighbourChordsLikelihoodVar);
    var harmonyPassingChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonyPassingChordsLikelihoodVar.id = "harmonyPassingChordsLikelihoodVar";
    harmonyPassingChordsLikelihoodVar.value = 1;
    module.addVariable(harmonyPassingChordsLikelihoodVar);
    var harmonyMajorDeceptiveRootVar = new SimpleIntegerEditorVariable();
    harmonyMajorDeceptiveRootVar.id = "harmonyMajorDeceptiveRootVar";
    harmonyMajorDeceptiveRootVar.value = 5;
    module.addVariable(harmonyMajorDeceptiveRootVar);
    var harmonyMinorDeceptiveRootVar = new SimpleIntegerEditorVariable();
    harmonyMinorDeceptiveRootVar.id = "harmonyMinorDeceptiveRootVar";
    harmonyMinorDeceptiveRootVar.value = 5;
    module.addVariable(harmonyMinorDeceptiveRootVar);
    var harmonyPhraseTypeVar = new SimpleIntegerEditorVariable();
    harmonyPhraseTypeVar.id = "harmonyPhraseTypeVar";
    harmonyPhraseTypeVar.value = 2;
    module.addVariable(harmonyPhraseTypeVar);
    var harmonyNoteCountVar = new SimpleIntegerEditorVariable();
    harmonyNoteCountVar.id = "harmonyNoteCountVar";
    harmonyNoteCountVar.value = 5;
    module.addVariable(harmonyNoteCountVar);
    var harmonyTotalLengthVar = new SimpleDoubleEditorVariable();
    harmonyTotalLengthVar.id = "harmonyTotalLengthVar";
    harmonyTotalLengthVar.value = 4;
    module.addVariable(harmonyTotalLengthVar);
    var harmonyRythmLengthTypeVar = new SimpleIntegerEditorVariable();
    harmonyRythmLengthTypeVar.id = "harmonyRythmLengthTypeVar";
    harmonyRythmLengthTypeVar.value = NoteRythmElementLengthType.NORMAL;
    module.addVariable(harmonyRythmLengthTypeVar);
    var harmonyRythmMeasureSplitStrategyVar = new SimpleIntegerEditorVariable();
    harmonyRythmMeasureSplitStrategyVar.id = "harmonyRythmMeasureSplitStrategyVar";
    harmonyRythmMeasureSplitStrategyVar.value = NoteRythmElementLengthType.NORMAL;
    module.addVariable(harmonyRythmMeasureSplitStrategyVar);
    var harmonySRE = new SplitRythmElement().setLength(1).setNoteCount(harmonyNoteCountVar.value).setNoteCountUnit(CountUnit.PLAIN).setLengthUnit(PositionUnit.MEASURES).setDensityCurve(hrDensityCurve.id);
    harmonySRE.startLengthTypeUseExpression = true;
    harmonySRE.autoDetectLengthType = false;
    harmonySRE.startLengthTypeExpression = harmonyRythmLengthTypeVar.id;
    harmonySRE.noteCountUseExpression = true;
    harmonySRE.lengthUseExpression = true;
    harmonySRE.lengthExpression = harmonyTotalLengthVar.id;
    harmonySRE.lengthUnit = PositionUnit.MEASURES;
    harmonySRE.noteCountExpression = harmonyNoteCountVar.id;
    var harmonySzc = new SplitZoneCollection();
    var harmonySz = new SplitZone();
    harmonySz.splitStrategy = SplitStrategy.HALVE;
    harmonySz.splitStrategyUseExpression = true;
    harmonySz.splitStrategyExpression = harmonyRythmMeasureSplitStrategyVar.id;
    harmonySz.positionInterval = [0, 128];
    harmonySz.noteLengthInterval = [0.95, 1.001];
    harmonySz.noteLengthIntervalUnit = PositionUnit.MEASURES;
    harmonySzc.addSplitZone(harmonySz);
    harmonySRE.splitZoneCollection = harmonySzc;
    hrRythm.addRythmElement(harmonySRE);
    var allPercMotifs = [];
    for (var i = 0; i < genData.percussionMotifInfos.length; i++) {
        var info = genData.percussionMotifInfos[i];
        var percussionMotif = null;
        if (typeof (info.predefinedType) != "undefined") {
            percussionMotif = new SingleElementPercussionMotif();
            percussionMotif.element = new PredefinedPercussionMotifElement().setType(info.predefinedType);
            percussionMotif.mode = PercussionMotifMode.ELEMENTS
        } else {
            percussionMotif = new PercussionMotif();
            percussionMotif.verbose = true;
            percussionMotif.mode = PercussionMotifMode.RYTHM_AND_ZONES;
            var percDensCurve = new PredefinedCurve();
            percDensCurve.type = getValueOrDefault(info, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);
            percDensCurve.amplitude = getValueOrDefault(info, "densityAmplitude", 1);
            percDensCurve.frequency = getValueOrDefault(info, "densityFrequency", 3);
            percDensCurve.seed = getValueOrDefault(info, "densitySeed", 334324);
            percDensCurve.id = "percussionRythmCurve" + (i + 1);
            module.addCurve(percDensCurve);
            var percRythmElement = new SplitRythmElement();
            percRythmElement.verbose = true;
            percRythmElement.densityCurve = percDensCurve.id;
            percRythmElement.noteCount = getValueOrDefault(info, "rythmNoteCount", 4);
            percRythmElement.length = getValueOrDefault(info, "rythmLength", 1);
            percRythmElement.lengthUnit = getValueOrDefault(info, "rythmLengthUnit", PositionUnit.MEASURES);
            percRythmElement.minLength = getValueOrDefault(info, "rythmMinLength", 0.125);
            percRythmElement.minLengthUnit = getValueOrDefault(info, "rythmMinLengthUnit", PositionUnit.BEATS);
            var percRythm = new Rythm();
            percRythm.id = "percussionRythm" + (i + 1);
            percRythm.addRythmElement(percRythmElement);
            module.addRythm(percRythm);
            percussionMotif.rythm = percRythm.id;
            var zoneInfos = getValueOrDefault(info, "motifZoneInfos", []);
            for (var j = 0; j < zoneInfos.length; j++) {
                var zoneInfo = zoneInfos[j];
                var zone = new VersatilePercussionMotifZone();
                zone.activatedExpression = getValueOrDefault(zoneInfo, "activatedExpression", "");
                if (zone.activatedExpression) {
                    zone.activatedUseExpression = true
                }
                zone.useNamedNotes = false;
                zone.notes = getValueOrDefault(zoneInfo, "notes", [MidiDrum.CHINESE_CYMBAL]);
                zone.noteIndexPattern = getValueOrDefault(zoneInfo, "noteIndexPattern", [
                    [0]
                ]);
                zone.startNoteIndexPattern = getValueOrDefault(zoneInfo, "startNoteIndexPattern", []);
                zone.endNoteIndexPattern = getValueOrDefault(zoneInfo, "endNoteIndexPattern", []);
                zone.start = getValueOrDefault(zoneInfo, "start", 0);
                zone.end = getValueOrDefault(zoneInfo, "end", 1);
                zone.beatConditionMultiplier = getValueOrDefault(zoneInfo, "multiplier", 1);
                zone.beatConditionBias = getValueOrDefault(zoneInfo, "bias", 0);
                zone.beatConditionRemainders = getValueOrDefault(zoneInfo, "remainders", []);
                zone.beatConditionRemainderStrengths = getValueOrDefault(zoneInfo, "remainderStrengths", [1]);
                zone.beatConditionQuotients = getValueOrDefault(zoneInfo, "quotients", []);
                zone.beatConditionDivisorCheck = getValueOrDefault(zoneInfo, "divisorCheck", 1);
                zone.beatConditionDivisorCheckUnit = getValueOrDefault(zoneInfo, "divisorCheckUnit", PositionUnit.MEASURES);
                percussionMotif.zones.push(zone)
            }
            if (percussionMotif.zones.length == 0) {
                console.log("no zones in " + percussionMotif.id)
            }
        }
        percussionMotif.id = "percussionMotif" + (i + 1);
        module.percussionMotifs.push(percussionMotif);
        allPercMotifs.push(percussionMotif.id)
    }
    var indexInfoVar = new SimpleObjectEditorVariable();
    indexInfoVar.id = "indexInfoVar";
    indexInfoVar.value = {};
    module.addVariable(indexInfoVar);
    var staticHarmonyElement = new StaticSequenceHarmonyElement().setCount(4);
    staticHarmonyElement.lengthPattern = [2, 1];
    var dhe1 = new DynamicSequenceHarmonyElement().setCount(4);
    dhe1.seed = 124153542;
    dhe1.lengthPattern = [4, 2, 1, 1];
    dhe1.lengthPatternUnit = PositionUnit.BEATS;
    dhe1.scaleBaseNote = 60;
    dhe1.modulate = true;
    var che1 = new ConstantHarmonyElement().setBaseNote(67).setChordRoot(4).setLength(4).setLengthUnit(PositionUnit.BEATS);
    var che2 = new ConstantHarmonyElement().setBaseNote(67).setChordRoot(0).setLength(4).setLengthUnit(PositionUnit.BEATS);
    var harmony1 = new ConstantHarmonicRythm([dhe1, che1, che2]);
    harmony1.id = "harmony1";
    var harmonySeedVar = new SimpleIntegerEditorVariable();
    harmonySeedVar.id = "harmonySeedVar";
    harmonySeedVar.value = 123456789;
    module.addVariable(harmonySeedVar);
    var harmonyScaleBaseVar = new SimpleIntegerEditorVariable();
    harmonyScaleBaseVar.id = "harmonyScaleBaseVar";
    harmonyScaleBaseVar.value = 60;
    module.addVariable(harmonyScaleBaseVar);
    var numeratorVar = new SimpleIntegerEditorVariable();
    numeratorVar.id = "numeratorVar";
    numeratorVar.value = 4;
    module.addVariable(numeratorVar);
    var harmonyMajorModulationTargetVar = new SimpleIntegerEditorVariable();
    harmonyMajorModulationTargetVar.id = "harmonyMajorModulationTargetVar";
    harmonyMajorModulationTargetVar.value = -1;
    module.addVariable(harmonyMajorModulationTargetVar);
    var harmonyMinorModulationTargetVar = new SimpleIntegerEditorVariable();
    harmonyMinorModulationTargetVar.id = "harmonyMinorModulationTargetVar";
    harmonyMinorModulationTargetVar.value = -1;
    module.addVariable(harmonyMinorModulationTargetVar);
    var scaleTypeVar = new SimpleIntegerEditorVariable();
    scaleTypeVar.id = "scaleTypeVar";
    scaleTypeVar.value = ScaleType.MAJOR;
    module.addVariable(scaleTypeVar);
    var staticHarmonyLengthVar = new SimpleIntegerEditorVariable();
    staticHarmonyLengthVar.id = "staticHarmonyLengthVar";
    staticHarmonyLengthVar.value = 10;
    module.addVariable(staticHarmonyLengthVar);
    var dynamicHarmonyLengthVar = new SimpleIntegerEditorVariable();
    dynamicHarmonyLengthVar.id = "dynamicHarmonyLengthVar";
    dynamicHarmonyLengthVar.value = 10;
    module.addVariable(dynamicHarmonyLengthVar);
    var dominantCadenceHarmonyLengthVar = new SimpleIntegerEditorVariable();
    dominantCadenceHarmonyLengthVar.id = "dominantCadenceHarmonyLengthVar";
    dominantCadenceHarmonyLengthVar.value = 10;
    module.addVariable(dominantCadenceHarmonyLengthVar);
    var tonicCadenceHarmonyLengthVar = new SimpleIntegerEditorVariable();
    tonicCadenceHarmonyLengthVar.id = "tonicCadenceHarmonyLengthVar";
    tonicCadenceHarmonyLengthVar.value = 10;
    module.addVariable(tonicCadenceHarmonyLengthVar);
    var phe = new PhraseHarmonyElement().setCount(12);
    phe.seed = 23463;
    phe.staticHarmonyLength = 10;
    phe.staticHarmonyLengthUseExpression = true;
    phe.staticHarmonyLengthExpression = staticHarmonyLengthVar.id;
    phe.staticHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.staticHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.staticHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.staticHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.staticHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.staticHarmonyPassingChordLikelihoodUseExpression = true;
    phe.staticHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.staticHarmonySus2ChordLikelihoodUseExpression = true;
    phe.staticHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.staticHarmonySus4ChordLikelihoodUseExpression = true;
    phe.staticHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;
    phe.dynamicHarmonyLength = 70;
    phe.dynamicHarmonyLengthUseExpression = true;
    phe.dynamicHarmonyLengthExpression = dynamicHarmonyLengthVar.id;
    phe.dynamicHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.dynamicHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.dynamicHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.dynamicHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.dynamicHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.dynamicHarmonyPassingChordLikelihoodUseExpression = true;
    phe.dynamicHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.dynamicHarmonySus2ChordLikelihoodUseExpression = true;
    phe.dynamicHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.dynamicHarmonySus4ChordLikelihoodUseExpression = true;
    phe.dynamicHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonyLength = 10;
    phe.dominantCadenceHarmonyLengthUseExpression = true;
    phe.dominantCadenceHarmonyLengthExpression = dominantCadenceHarmonyLengthVar.id;
    phe.dominantCadenceHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.dominantCadenceHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.dominantCadenceHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonyPassingChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonySus2ChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonySus4ChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonyLength = 10;
    phe.tonicCadenceHarmonyLengthUseExpression = true;
    phe.tonicCadenceHarmonyLengthExpression = tonicCadenceHarmonyLengthVar.id;
    phe.tonicCadenceHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.tonicCadenceHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.tonicCadenceHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonyPassingChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonySus2ChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonySus4ChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;
    phe.useMaxElementLength = genInfo.useMaxHarmonyElementLength;
    phe.maxElementLength = 2;
    phe.maxElementLengthUnit = PositionUnit.MEASURES;
    phe.maxElementLengthUseExpression = true;
    phe.maxElementLengthExpression = "Math.floor(3 / " + numeratorVar.id + " + 1)";
    phe.seedUseExpression = true;
    phe.seedExpression = harmonySeedVar.id;
    phe.tsNumerators = [4];
    phe.tsNumeratorsUseExpression = true;
    phe.tsNumeratorsExpression = "[" + numeratorVar.id + "]";
    phe.rythmTsNumeratorUseExpression = true;
    phe.rythmTsNumeratorExpression = numeratorVar.id;
    phe.scaleBaseNote = 60;
    phe.scaleBaseNoteUseExpression = true;
    phe.scaleBaseNoteExpression = harmonyScaleBaseVar.id;
    phe.raiseLeadingToneUseExpression = true;
    phe.raiseLeadingToneExpression = harmonyRaiseLeadingToneVar.id;
    phe.majorDeceptiveRootUseExpression = true;
    phe.majorDeceptiveRootExpression = harmonyMajorDeceptiveRootVar.id;
    phe.minorDeceptiveRootUseExpression = true;
    phe.minorDeceptiveRootExpression = harmonyMinorDeceptiveRootVar.id;
    phe.modulate = false;
    phe.modulateUseExpression = true;
    phe.modulateExpression = harmonyMajorModulationTargetVar.id + " != -1 || " + harmonyMinorModulationTargetVar.id + " != -1";
    phe.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    phe.majorModulationTargetUseExpression = true;
    phe.majorModulationTargetExpression = harmonyMajorModulationTargetVar.id;
    phe.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    phe.minorModulationTargetUseExpression = true;
    phe.minorModulationTargetExpression = harmonyMinorModulationTargetVar.id;
    phe.harmonyLengthMode = HarmonyLengthMode.RYTHM_ONLY;
    phe.lengthRythm = hrRythm.id;
    phe.scaleType = ScaleType.MAJOR;
    phe.scaleTypeUseExpression = true;
    phe.scaleTypeExpression = scaleTypeVar.id;
    phe.totalLength = 4;
    phe.totalLengthUseExpression = true;
    phe.totalLengthExpression = harmonyTotalLengthVar.id;
    phe.totalLengthUnit = PositionUnit.MEASURES;
    phe.lengthRepeats = 0;
    phe.phraseType = PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT;
    phe.phraseTypeUseExpression = true;
    phe.phraseTypeExpression = "harmonyPhraseTypeVar";
    phe.phraseStructureCounts = [harmonyNoteCountVar.value, harmonyNoteCountVar.value];
    phe.phraseStructureCountsUseExpression = true;
    phe.phraseStructureCountsExpression = "[harmonyNoteCountVar, harmonyNoteCountVar]";
    var harmonies = [phe];
    for (var i = 0; i < genInfo.harmonyElements.length; i++) {
        var he = copyValueDeep(genInfo.harmonyElements[i]);
        if (he instanceof SequenceHarmonyElement) {
            he.lengthRythm = he.lengthRythm ? he.lengthRythm : hrRythm.id;
            if (he.setTotalLengthExternally) {
                he.totalLengthUseExpression = true;
                he.totalLengthExpression = harmonyTotalLengthVar.id
            }
            if (he.setTsNumeratorExternally) {
                he.tsNumeratorsUseExpression = true;
                he.tsNumeratorsExpression = "[" + numeratorVar.id + "]";
                he.rythmTsNumeratorUseExpression = true;
                he.rythmTsNumeratorExpression = numeratorVar.id
            }
            he.useMaxElementLength = genInfo.useMaxCustomHarmonyElementLength;
            he.maxElementLength = genInfo.maxCustomHarmonyElementLength;
            he.maxElementLengthUnit = genInfo.maxCustomHarmonyElementLengthUnit;
            he.maxElementLengthUseExpression = genInfo.maxCustomHarmonyElementLengthUseExpression;
            he.maxElementLengthExpression = "Math.floor(3 / " + numeratorVar.id + " + 1)"
        } else {
            console.log("Constant harmony of unknown type " + he._constructorName)
        }
        harmonies.push(he)
    }
    var harmonyElementIndexVar = new SimpleIntegerEditorVariable();
    harmonyElementIndexVar.id = "harmonyElementIndexVar";
    harmonyElementIndexVar.value = 0;
    module.addVariable(harmonyElementIndexVar);
    var she = new SwitchHarmonyElement();
    she.indexExpression = harmonyElementIndexVar.id;
    she.indexUseExpression = true;
    she.indexedElements = harmonies;
    var harmony2 = new ConstantHarmonicRythm([she]);
    harmony2.id = "harmony2";
    var suspendSeedVar = new SimpleIntegerEditorVariable();
    suspendSeedVar.id = "suspendSeedVar";
    suspendSeedVar.value = true;
    module.addVariable(suspendSeedVar);
    var suspendProbabilityVar = new SimpleDoubleEditorVariable();
    suspendProbabilityVar.id = "suspendProbabilityVar";
    suspendProbabilityVar.value = true;
    module.addVariable(suspendProbabilityVar);
    var suspendModifier = new SuspendHarmonyModifier();
    suspendModifier.voiceLineOnPattern = [0, 1, 1, 0];
    suspendModifier.seedUseExpression = true;
    suspendModifier.seedExpression = suspendSeedVar.id;
    suspendModifier.suspendProbabilitiesUseExpression = true;
    suspendModifier.suspendProbabilitiesExpression = "[" + suspendProbabilityVar.id + "]";
    harmony2.modifiers = [suspendModifier];
    var sectionTempoVar = new SimpleDoubleEditorVariable();
    sectionTempoVar.id = "sectionTempoVar";
    sectionTempoVar.value = 120;
    module.addVariable(sectionTempoVar);
    var nextSectionTempoVar = new SimpleDoubleEditorVariable();
    nextSectionTempoVar.id = "nextSectionTempoVar";
    nextSectionTempoVar.value = 120;
    module.addVariable(nextSectionTempoVar);
    var prevSectionTempoVar = new SimpleDoubleEditorVariable();
    prevSectionTempoVar.id = "prevSectionTempoVar";
    prevSectionTempoVar.value = 120;
    module.addVariable(prevSectionTempoVar);
    var section = new Section();
    section.id = "section";
    section.harmonicRythm = harmony2.id;
    section.tempo = songStructureInfo.baseTempo;
    if (!genInfo.useNaturalTempoChanges) {
        section.tempoUseExpression = true;
        section.tempoExpression = "" + sectionTempoVar.id
    }
    module.addSection(section);
    if (genInfo.exportChordsToNewChannel) {
        var chordsRenderChannel = new RenderChannel();
        chordsRenderChannel.id = "chordsRenderChannel";
        module.renderChannels.push(chordsRenderChannel);
        var chordMotif = new Motif();
        chordMotif.id = "chordMotif";
        var cme = new VerticalRelativeMotifElement();
        cme.relativeType = VerticalRelativeType.CHORD_BASS;
        cme.length = 1;
        cme.lengthUnit = PositionUnit.HARMONY_INDEX;
        for (var i = 1; i < 4; i++) {
            var filler = new FillerNote();
            filler.offset = i;
            filler.lengthMode = FillerNoteLengthMode.MATCH;
            cme.addFiller(filler)
        }
        chordMotif.motifElements = [cme];
        module.addMotif(chordMotif);
        var chordMotifRenderElement = new HarmonyIndexPatternMotifRenderElement();
        chordMotifRenderElement.useVoiceLine = false;
        chordMotifRenderElement.count = 1;
        chordMotifRenderElement.countUnit = CountUnit.HARMONY_ELEMENT_COUNT;
        chordMotifRenderElement.motifs = [chordMotif.id];
        var chordRenderLine = new PrimitiveRenderLine();
        chordRenderLine.channel = chordsRenderChannel.id;
        chordRenderLine.id = "chordsRenderLine";
        chordRenderLine.addRenderElement(chordMotifRenderElement);
        section.addRenderLine(chordRenderLine)
    }

    function createHintCurvesIfNecessary(infos) {
        for (var i = 0; i < infos.length; i++) {
            var shapeInfo = infos[i];
            if (shapeInfo.curveId) {
                var shapeCurve = copyObjectDeep(shapeInfo.curve);
                module.addCurve(shapeCurve)
            }
        }
    }
    createHintCurvesIfNecessary(genData.melodyShapeInfos);
    createHintCurvesIfNecessary(genData.bassShapeInfos);
    var controlChannels = {};

    function createControlLineAndChannel(options) {
        var controlLineId = getValueOrDefault(options, "controlLineId", "");
        var controlLineVerbose = getValueOrDefault(options, "controlLineVerbose", false);
        var channelId = getValueOrDefault(options, "channelId", "");
        var channelMixMode = getValueOrDefault(options, "channelMixMode", NumericControlChannelMixMode.MULT);
        var channelMixWithDefault = getValueOrDefault(options, "channelMixWithDefault", true);
        var channelDefaultValue = getValueOrDefault(options, "channelDefaultValue", 1);
        var controlWriteMode = getValueOrDefault(options, "controlWriteMode", ControlChannelControlWriteMode.NONE);
        var controlLine = new PrimitiveControlLine();
        controlLine.id = controlLineId;
        controlLine.channel = channelId;
        section.addControlLine(controlLine);
        if (!controlChannels[channelId]) {
            var channel = new DoubleControlChannel();
            channel.id = channelId;
            channel.defaultValue = channelDefaultValue;
            channel.mixMode = channelMixMode;
            channel.mixWithDefault = channelMixWithDefault;
            channel.controlWriteMode = controlWriteMode;
            module.addControlChannel(channel);
            controlChannels[channelId] = channel
        }
        return controlLine
    }

    function createControlLineFromDescription(desc, options) {
        var type = getValueOrDefault(desc, "type", "sequential");
        var activeExpression = getValueOrDefault(desc, "activeExpression", "");
        var verbose = getValueOrDefault(options, "verbose", false);
        var elementsVerbose = getValueOrDefault(options, "elementsVerbose", false);
        var multiStepVerbose = getValueOrDefault(options, "multiStepVerbose", false);
        var controlLine = createControlLineAndChannel(options);
        var elements = getValueOrDefault(desc, "elements", []);
        var curves = getValueOrDefault(desc, "curves", []);
        var indices = getValueOrDefault(desc, "indices", []);
        var indicesExpression = getValueOrDefault(desc, "indicesExpression", "");
        for (var i = 0; i < curves.length; i++) {
            module.addCurve(curves[i])
        }
        var elementsCopy = arrayCopyWithCopy(elements);
        if (elementsVerbose) {
            for (var i = 0; i < elementsCopy.length; i++) {
                elementsCopy[i].verbose = true
            }
        }
        switch (type) {
            case "sequential":
                var startIndicesExpression = getValueOrDefault(desc, "startIndicesExpression", "");
                var startIndices = getValueOrDefault(desc, "startIndices", []);
                var endIndicesExpression = getValueOrDefault(desc, "endIndicesExpression", "");
                var endIndices = getValueOrDefault(desc, "endIndices", []);
                var msce = new MultiStepControlElement();
                if (multiStepVerbose) {
                    msce.verbose = true
                }
                if (activeExpression) {
                    msce.activeUseExpression = true;
                    msce.activeExpression = activeExpression
                }
                msce.startIndices = startIndices;
                if (startIndicesExpression) {
                    msce.startIndicesUseExpression = true;
                    msce.startIndicesExpression = startIndicesExpression
                }
                msce.indices = indices;
                if (indicesExpression) {
                    msce.indicesUseExpression = true;
                    msce.indicesExpression = indicesExpression
                }
                msce.endIndices = endIndices;
                if (endIndicesExpression) {
                    msce.endIndicesUseExpression = true;
                    msce.endIndicesExpression = endIndicesExpression
                }
                msce.elements = elementsCopy;
                controlLine.addControlElement(msce);
                if (verbose) {
                    console.log("Adding element " + JSON.stringify(msce))
                }
                break;
            case "parallel":
                var msce = new MultiParallelControlElement();
                if (multiStepVerbose) {
                    msce.verbose = true
                }
                if (activeExpression) {
                    msce.activeUseExpression = true;
                    msce.activeExpression = activeExpression
                }
                msce.indices = indices;
                if (indicesExpression) {
                    msce.indicesUseExpression = true;
                    msce.indicesExpression = indicesExpression
                }
                msce.elements = elementsCopy;
                controlLine.addControlElement(msce);
                if (verbose) {
                    console.log("Adding element " + JSON.stringify(msce))
                }
                break;
            default:
                console.log("Missing type in effect description");
                break
        }
        return controlLine
    }

    function createVoiceLineAndRenderLine(options) {
        var name = getValueOrDefault(options, "name", "dummy");
        var addHintCurve = getValueOrDefault(options, "addHintCurve", false);
        var chordRootPitchClassConstraints = getValueOrDefault(options, "chordRootPitchClassConstraints", []);
        var chordBassPitchClassConstraints = getValueOrDefault(options, "chordBassPitchClassConstraints", []);
        var chordBassPitchClassConstraintsExpression = getValueOrDefault(options, "chordBassPitchClassConstraintsExpression", "");
        var penaltyRanges = getValueOrDefault(options, "penaltyRanges", [
            [50, 100]
        ]);
        var ranges = getValueOrDefault(options, "ranges", [
            [40, 110]
        ]);
        var maxSpacings = getValueOrDefault(options, "maxSpacings", [24]);
        var penaltyMaxSpacings = getValueOrDefault(options, "penaltyMaxSpacings", [12]);
        var pan = getValueOrDefault(options, "pan", 64);
        var capName = name.substr(0, 1).toUpperCase() + name.substr(1);
        var voiceLine = new ClassicalAdaptiveVoiceLine();
        voiceLine.ranges = ranges;
        voiceLine.penaltyRanges = penaltyRanges;
        voiceLine.chordRootPitchClassConstraints = chordRootPitchClassConstraints;
        voiceLine.chordBassPitchClassConstraints = chordBassPitchClassConstraints;
        if (chordBassPitchClassConstraintsExpression) {
            voiceLine.chordBassPitchClassConstraintsExpression = chordBassPitchClassConstraintsExpression;
            voiceLine.chordBassPitchClassConstraintsUseExpression = true
        }
        voiceLine.maxSpacings = maxSpacings;
        voiceLine.penaltyMaxSpacings = penaltyMaxSpacings;
        var sequentialEffectChangeInfoVar = new SimpleObjectEditorVariable();
        sequentialEffectChangeInfoVar.id = "sequential" + capName + "EffectChangeInfoVar";
        module.addVariable(sequentialEffectChangeInfoVar);
        for (var i = 0; i < 3; i++) {
            var noteVelocitiesChannel = new DoubleControlChannel();
            noteVelocitiesChannel.id = name + "NoteVelocitiesChannel" + (i + 1);
            noteVelocitiesChannel.defaultValue = 1;
            noteVelocitiesChannel.controlWriteMode = ControlChannelControlWriteMode.NONE;
            module.controlChannels.push(noteVelocitiesChannel);
            var noteVelocitiesControlLine = new PrimitiveControlLine();
            noteVelocitiesControlLine.id = name + "NoteVelocitiesControlLine" + (i + 1);
            noteVelocitiesControlLine.channel = noteVelocitiesChannel.id;
            section.addControlLine(noteVelocitiesControlLine);
            var effects = [
                ["FilterF", NumericControlChannelMixMode.MULT, 1],
                ["FilterQ", NumericControlChannelMixMode.MULT, 1],
                ["Pan", NumericControlChannelMixMode.OVERWRITE_LAST, pan / 127]
            ];
            for (var j = 0; j < effects.length; j++) {
                var effectName = effects[j][0];
                var mixMode = effects[j][1];
                var defaultValue = effects[j][2];
                var elements = [];
                var curves = [];
                var infosForVoice = genData["sequential" + capName + "EffectChangeInfos"];
                if (!infosForVoice) {
                    console.log("Could not find any infos for voice " + ("sequential" + capName + "EffectChangeInfos"))
                }
                var infosForInstrument = infosForVoice[i];
                if (!infosForInstrument) {
                    console.log("Could not find any infos for instrument " + i)
                }
                var effectInfos = infosForInstrument[effectName];
                if (!effectInfos) {
                    console.log("Could not find any effect infos for " + ("sequential" + capName + "EffectChangeInfos") + " " + i + " " + effectName);
                    console.log(" infos for instrument " + JSON.stringify(infosForInstrument))
                }
                for (var k = 0; k < effectInfos.length; k++) {
                    var effectInfo = effectInfos[k];
                    elements.push(effectInfo.element);
                    curves.push(effectInfo.curve)
                }
                var indicesVarName = name + "ChannelIndicesVar";
                var controlLineActiveExpression = indicesVarName + "[0].indexOf(" + i + ") >= 0";
                createControlLineFromDescription({
                    type: "sequential",
                    elements: elements,
                    curves: curves,
                    activeExpression: controlLineActiveExpression,
                    indicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".indices",
                    startIndicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".startIndices",
                    endIndicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".endIndices"
                }, {
                    channelId: name + "ControlChannel" + effectName + (i + 1),
                    channelMixMode: mixMode,
                    channelDefaultValue: defaultValue,
                    controlLineId: name + effectName + "ControlLine" + (i + 1),
                    controlWriteMode: ControlChannelControlWriteMode.SET_CONTROL
                })
            }
        }
        if (addHintCurve) {
            var curveMultAmpVar = new SimpleBooleanEditorVariable();
            curveMultAmpVar.id = name + "CurveMultiplyAmpVar";
            curveMultAmpVar.value = true;
            module.addVariable(curveMultAmpVar);
            voiceLine.useHintCurveLengthFractionAmplitudeMultiplier = true;
            voiceLine.useHintCurveLengthFractionAmplitudeMultiplierUseExpression = true;
            voiceLine.useHintCurveLengthFractionAmplitudeMultiplierExpression = curveMultAmpVar.id;
            voiceLine.hintCurveReferenceCount = 6;
            voiceLine.hintCurveLengthFractionAmplitudeMultiplier = 0.5;
            voiceLine.hintIndices = [70];
            voiceLine.hintIndexType = IndexType.MIDI_NOTE;
            var curveTypeVar = new SimpleIntegerEditorVariable();
            curveTypeVar.id = name + "CurveTypeVar";
            curveTypeVar.value = PredefinedCurveType.LINEAR;
            module.addVariable(curveTypeVar);
            var curveIdVar = new SimpleStringEditorVariable();
            curveIdVar.id = name + "CurveIdVar";
            curveIdVar.value = "";
            module.addVariable(curveIdVar);
            var curveAmplitudeVar = new SimpleDoubleEditorVariable();
            curveAmplitudeVar.id = name + "CurveAmplitudeVar";
            curveAmplitudeVar.value = 10;
            module.addVariable(curveAmplitudeVar);
            var curveBiasVar = new SimpleDoubleEditorVariable();
            curveBiasVar.id = name + "CurveBiasVar";
            curveBiasVar.value = 60;
            module.addVariable(curveBiasVar);
            var hintCurve = new PredefinedCurve();
            hintCurve.type = PredefinedCurveType.LINEAR;
            hintCurve.typeUseExpression = true;
            hintCurve.typeExpression = curveTypeVar.id;
            hintCurve.id = name + "HintCurve";
            module.addCurve(hintCurve);
            voiceLine.useHintCurve = true;
            voiceLine.hintCurve = hintCurve.id;
            voiceLine.hintCurveUseExpression = true;
            voiceLine.hintCurveExpression = curveIdVar.id + " ? " + curveIdVar.id + ' : "' + hintCurve.id + '"';
            voiceLine.hintCurveMultiplier = curveAmplitudeVar.value;
            voiceLine.hintCurveMultiplierUseExpression = true;
            voiceLine.hintCurveMultiplierExpression = curveAmplitudeVar.id;
            voiceLine.hintCurveBias = curveBiasVar.value;
            voiceLine.hintCurveBiasUseExpression = true;
            voiceLine.hintCurveBiasExpression = curveBiasVar.id
        }
        voiceLine.id = name + "VoiceLine";
        section.voiceLines.push(voiceLine);
        var indexMotifPatternVar = new SimpleIntegerArray2DEditorVariable();
        indexMotifPatternVar.id = name + "IndexMotifPatternVar";
        indexMotifPatternVar.value = [
            [1],
            [2],
            [0],
            [2]
        ];
        module.addVariable(indexMotifPatternVar);
        var endIndexMotifPatternVar = new SimpleIntegerArray2DEditorVariable();
        endIndexMotifPatternVar.id = "end" + capName + "IndexMotifPatternVar";
        endIndexMotifPatternVar.value = [
            [2],
            [0]
        ];
        module.addVariable(endIndexMotifPatternVar);
        var renderChannel1 = new RenderChannel();
        renderChannel1.id = name + "RenderChannel1";
        module.addRenderChannel(renderChannel1);
        var renderChannel2 = new RenderChannel();
        renderChannel2.id = name + "RenderChannel2";
        module.addRenderChannel(renderChannel2);
        var renderChannel3 = new RenderChannel();
        renderChannel3.id = name + "RenderChannel3";
        module.addRenderChannel(renderChannel3);
        var renderChannels = [renderChannel1.id, renderChannel2.id, renderChannel3.id];
        var channelIndicesVar = new SimpleIntegerArray2DEditorVariable();
        channelIndicesVar.id = name + "ChannelIndicesVar";
        channelIndicesVar.value = [
            [0]
        ];
        module.addVariable(channelIndicesVar);
        var endChannelIndicesVar = new SimpleIntegerArray2DEditorVariable();
        endChannelIndicesVar.id = "end" + capName + "ChannelIndicesVar";
        endChannelIndicesVar.value = [
            [0]
        ];
        module.addVariable(endChannelIndicesVar);
        var renderAmountVar = new SimpleDoubleEditorVariable();
        renderAmountVar.id = name + "RenderAmountVar";
        renderAmountVar.value = 1;
        module.addVariable(renderAmountVar);
        var hipre1 = new HarmonyIndexIndexPatternMotifRenderElement();
        hipre1.voiceLine = voiceLine.id;
        hipre1.count = 1;
        hipre1.countUnit = CountUnit.PHRASE_ELEMENT_COUNT;
        hipre1.channels = copyValueDeep(renderChannels);
        hipre1.channelIndicesUseExpression = true;
        hipre1.channelIndicesExpression = channelIndicesVar.id;
        hipre1.endChannelIndicesUseExpression = true;
        hipre1.endChannelIndicesExpression = endChannelIndicesVar.id;
        hipre1.indicesUseExpression = true;
        hipre1.indicesExpression = renderAmountVar.id + " > 0 ? " + indexMotifPatternVar.id + " : []";
        hipre1.endIndicesUseExpression = true;
        hipre1.endIndicesExpression = renderAmountVar.id + " > 0 ? " + endIndexMotifPatternVar.id + " : []";
        hipre1.motifs = arrayCopy(allMotifIds);
        var psre = new PhraseStructureRenderElement();
        psre.renderElements = [hipre1];
        var renderLine = new PrimitiveRenderLine();
        renderLine.voiceLine = voiceLine.id;
        renderLine.channel = renderChannel1.id;
        renderLine.id = name + "RenderLine";
        renderLine.addRenderElement(psre);
        var extraRenderElementIndicesVar = new SimpleObjectEditorVariable();
        extraRenderElementIndicesVar.id = "extra" + capName + "RenderElementIndicesVar";
        extraRenderElementIndicesVar.defaultValue = [];
        module.addVariable(extraRenderElementIndicesVar);
        var extraRenderElements = genInfo["extra" + capName + "RenderElements"];
        if (extraRenderElements && extraRenderElements.length > 0) {
            for (var i = 0; i < extraRenderElements.length; i++) {
                var extra = extraRenderElements[i];
                extra.activatedUseExpression = true;
                var varId = extraRenderElementIndicesVar.id;
                var varIndexed = varId + "[indexInfoVar.phraseGroupIndex]";
                extra.activatedExpression = varId + " && " + varIndexed + " && (" + varIndexed + ".indexOf(" + i + ") != -1)"
            }
        }
        return renderLine
    }
    var percussionRenderAmountVar = new SimpleDoubleEditorVariable();
    percussionRenderAmountVar.id = "percussionRenderAmountVar";
    percussionRenderAmountVar.value = 1;
    module.addVariable(percussionRenderAmountVar);
    var ivl1SuspStrategy = new SimpleSuspAntStrategy();
    ivl1SuspStrategy.possibleLengthIncrements = [2, 1];
    ivl1SuspStrategy.voiceLines = ["melodyVoiceLine", "inner1VoiceLine", "inner2VoiceLine", "bassVoiceLine"];
    section.suspAntStrategies = [ivl1SuspStrategy];
    module.addVoiceLinePlanner(voicePlanner);
    module.addRythm(hrRythm);
    module.addHarmony(harmony1);
    module.addHarmony(harmony2);
    section.voiceLinePlanner = voicePlanner.id;

    function createHarmonyIndexMotif(options) {
        var rythmId = getValueOrDefault(options, "rythmId", "rythm1");
        var id = getValueOrDefault(options, "id", "bassMotif1");
        var embellishStart = getValueOrDefault(options, "embellishStart", 0);
        var embellishEnd = getValueOrDefault(options, "embellishEnd", 0.75);
        var connectStart = getValueOrDefault(options, "connectStart", 0.75);
        var connectEnd = getValueOrDefault(options, "connectEnd", 1);
        var verticalOffsetType = getValueOrDefault(options, "verticalOffsetType", OffsetType.SCALE);
        var horizontalOffsetType = getValueOrDefault(options, "horizontalOffsetType", OffsetType.SCALE);
        var verticalIndices = getValueOrDefault(options, "verticalIndices", [0]);
        var verticalIndicesExpression = getValueOrDefault(options, "verticalIndicesExpression", "");
        var startVerticalIndices = getValueOrDefault(options, "startVerticalIndices", [0]);
        var startVerticalIndicesExpression = getValueOrDefault(options, "startVerticalIndicesExpression", "");
        var verticalOffsetDomains = getValueOrDefault(options, "verticalOffsetDomains", [
            [-3, -2, -1, 0, 1, 2, 3]
        ]);
        var verticalOffsetLikelihoods = getValueOrDefault(options, "verticalOffsetLikelihoods", [
            [0.2, 0.3, 0.5, 1, 0.5, 0.3, 0.2]
        ]);
        var addConnect = getValueOrDefault(options, "addConnect", true);
        var addEmbellish = getValueOrDefault(options, "addEmbellish", true);
        var fillerRelativeStrengths = getValueOrDefault(options, "fillerRelativeStrengths", [
            [0.75]
        ]);
        var fillerRelativeLengths = getValueOrDefault(options, "fillerRelativeLengths", [
            [0]
        ]);
        var fillerLengthModes = getValueOrDefault(options, "fillerLengthModes", [MotifZoneFillerLengthMode.RELATIVE_ADD]);
        var fillerPositionOffsets = getValueOrDefault(options, "fillerPositionOffsets", [
            [0]
        ]);
        var fillerPositionOffsetUnits = getValueOrDefault(options, "fillerPositionOffsetUnits", [PositionUnit.BEATS]);
        var fillerOffsets = getValueOrDefault(options, "fillerOffsets", []);
        var fillerOffsetsExpression = getValueOrDefault(options, "fillerOffsetsExpression", "");
        var fillerOffsetTypes = getValueOrDefault(options, "fillerOffsetTypes", []);
        var verticalRelativeType = getValueOrDefault(options, "verticalRelativeType", VerticalRelativeType.VOICE_LINE);
        var constantVerticalOffset = getValueOrDefault(options, "constantVerticalOffset", 0);
        var constantVerticalOffsetType = getValueOrDefault(options, "constantVerticalOffsetType", OffsetType.HALF_STEP);
        var motif = new Motif();
        motif.id = id;
        motif.rythmBased = true;
        motif.rythm = rythmId;
        var eZone = new AdaptiveEmbellishMotifZone();
        eZone.useNoteRangeIfEmpty = true;
        eZone.positionUnit = PositionUnit.HARMONY_ELEMENTS;
        eZone.start = embellishStart;
        eZone.end = embellishEnd;
        eZone.verticalDomainOffsetType = verticalOffsetType;
        eZone.horizontalDomainOffsetType = horizontalOffsetType;
        eZone.verticalRelativeType = verticalRelativeType;
        eZone.constantVerticalOffset = constantVerticalOffset;
        eZone.constantVerticalOffsetType = constantVerticalOffsetType;
        eZone.verticalIndices = verticalIndices;
        if (verticalIndicesExpression) {
            eZone.verticalIndicesUseExpression = true;
            eZone.verticalIndicesExpression = verticalIndicesExpression
        }
        eZone.startVerticalIndices = startVerticalIndices;
        if (startVerticalIndicesExpression) {
            eZone.startVerticalIndicesUseExpression = true;
            eZone.startVerticalIndicesExpression = startVerticalIndicesExpression
        }
        eZone.verticalOffsetDomains = verticalOffsetDomains;
        eZone.verticalOffsetLikelihoods = verticalOffsetLikelihoods;
        eZone.fillerRelativeStrengths = fillerRelativeStrengths;
        eZone.fillerOffsets = fillerOffsets;
        eZone.fillerOffsetsExpression = fillerOffsetsExpression;
        if (fillerOffsetsExpression) {
            eZone.fillerOffsetsUseExpression = true
        }
        eZone.fillerOffsetTypes = fillerOffsetTypes;
        eZone.fillerPositionOffsets = fillerPositionOffsets;
        eZone.fillerPositionOffsetUnits = fillerPositionOffsetUnits;
        eZone.fillerRelativeLengths = fillerRelativeLengths;
        eZone.fillerLengthModes = fillerLengthModes;
        eZone.useHorizontalOffsets = false;
        var cZone = new AdaptiveConnectMotifZone();
        cZone.start = connectStart;
        cZone.end = connectEnd;
        cZone.positionUnit = PositionUnit.HARMONY_ELEMENTS;
        motif.motifZones = [];
        if (addEmbellish) {
            motif.motifZones.push(eZone)
        }
        if (addConnect) {
            motif.motifZones.push(cZone)
        }
        return motif
    }

    function createMotifFromMotifInfo(motifInfo, idPrefix, idPostfix) {
        var densityCurveType = getValueOrDefault(motifInfo, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);
        var densityAmplitude = getValueOrDefault(motifInfo, "densityAmplitude", 1);
        var densitySeed = getValueOrDefault(motifInfo, "densitySeed", 123);
        var densityFrequency = getValueOrDefault(motifInfo, "densityFrequency", 4);
        var densityCurve = new PredefinedCurve().setType(densityCurveType).setAmplitude(densityAmplitude).setSeed(densitySeed).setFrequency(densityFrequency);
        densityCurve.id = idPrefix + "RythmDensityCurve" + idPostfix;
        module.addCurve(densityCurve);
        var rythmOptions = copyValueDeep(motifInfo);
        rythmOptions.id = idPrefix + "Rythm" + idPostfix;
        rythmOptions.densityCurveId = densityCurve.id;
        var rythm = createSplitRythm(rythmOptions);
        module.addRythm(rythm);
        var motifOptions = copyValueDeep(motifInfo);
        motifOptions.rythmId = rythm.id;
        motifOptions.id = idPrefix + "Motif" + idPostfix;
        var motif = createHarmonyIndexMotif(motifOptions);
        return motif
    }
    var allMotifIds = [];
    for (var i = 0; i < genData.motifInfos.length; i++) {
        var prefix = "melody";
        var motifInfo = genData.motifInfos[i];
        var motif = createMotifFromMotifInfo(motifInfo, prefix, "" + (i + 1));
        module.addMotif(motif);
        allMotifIds.push(motif.id)
    }
    var bassStartIndex = genData.bassStartIndex;
    var harmonyStartIndex = genData.harmonyStartIndex;
    var melodyPan = 20;
    var bassPan = 110;
    var inner1Pan = 80;
    var inner2Pan = 60;
    var melodyRenderLine = createVoiceLineAndRenderLine({
        name: "melody",
        addHintCurve: true,
        ranges: [
            [40, 110]
        ],
        penaltyRanges: [
            [50, 100]
        ],
        pan: melodyPan,
        chordBassPitchClassConstraintsExpression: "melodyRenderAmountVar == 0 ? [[0]] : []"
    });
    section.addRenderLine(melodyRenderLine);
    var inner1RenderLine = createVoiceLineAndRenderLine({
        name: "inner1",
        addHintCurve: false,
        penaltyRanges: [
            [50, 80]
        ],
        pan: inner1Pan,
        chordBassPitchClassConstraintsExpression: "inner1RenderAmountVar == 0 || (bassRenderAmountVar == 0 && inner2RenderAmountVar == 0) ? [[0]] : []"
    });
    section.addRenderLine(inner1RenderLine);
    var inner2RenderLine = createVoiceLineAndRenderLine({
        name: "inner2",
        addHintCurve: false,
        penaltyRanges: [
            [50, 80]
        ],
        pan: inner2Pan,
        chordBassPitchClassConstraintsExpression: "inner2RenderAmountVar == 0 || bassRenderAmountVar == 0 ? [[0]] : []"
    });
    section.addRenderLine(inner2RenderLine);
    var bassRenderLine = createVoiceLineAndRenderLine({
        name: "bass",
        addHintCurve: true,
        chordBassPitchClassConstraints: [
            [0]
        ],
        pan: bassPan,
        maxSpacings: [36],
        penaltyMaxSpacings: [36],
        ranges: [
            [25, 80]
        ],
        penaltyRanges: [
            [30, 70]
        ]
    });
    section.addRenderLine(bassRenderLine);
    var percIndexMotifPatternVar = new SimpleIntegerArrayEditorVariable();
    percIndexMotifPatternVar.id = "percIndexMotifPatternVar";
    percIndexMotifPatternVar.value = [0];
    module.addVariable(percIndexMotifPatternVar);
    var endPercIndexMotifPatternVar = new SimpleIntegerArrayEditorVariable();
    endPercIndexMotifPatternVar.id = "endPercIndexMotifPatternVar";
    endPercIndexMotifPatternVar.value = [0];
    module.addVariable(endPercIndexMotifPatternVar);
    var percMRE = new FlexiblePercussionMotifRenderElement();
    percMRE.verbose = true;
    percMRE.activatedUseExpression = true;
    percMRE.activatedExpression = percussionRenderAmountVar.id + " > 0";
    percMRE.useIndexedMotifs = true;
    percMRE.motifIndicesUseExpression = true;
    percMRE.motifIndicesExpression = percIndexMotifPatternVar.id;
    percMRE.endMotifIndicesUseExpression = true;
    percMRE.endMotifIndicesExpression = endPercIndexMotifPatternVar.id;
    percMRE.indexedMotifs = copyValueDeep(allPercMotifs);
    var percussionPsre = new PhraseStructureRenderElement();
    percussionPsre.verbose = true;
    percussionPsre.renderElements = [percMRE];
    var percussionLine1 = new PrimitiveRenderLine();
    percussionLine1.addRenderElement(percussionPsre);
    percussionLine1.id = "percussionLine1";
    percussionLine1.channel = percussionRenderChannel1.id;
    section.addRenderLine(percussionLine1);
    section.tempoMode = SectionTempoMode.CHANGE_CONTROL_CHANNEL;
    section.tempoChannel = tempoChannel.id;
    var parallelTempoChangeIndicesVar = new SimpleIntegerArrayEditorVariable();
    parallelTempoChangeIndicesVar.value = [];
    parallelTempoChangeIndicesVar.id = "parallelTempoChangeIndicesVar";
    module.addVariable(parallelTempoChangeIndicesVar);
    var sequentialTempoChangeStartIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeStartIndicesVar.value = [];
    sequentialTempoChangeStartIndicesVar.id = "sequentialTempoChangeStartIndicesVar";
    module.addVariable(sequentialTempoChangeStartIndicesVar);
    var sequentialTempoChangeIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeIndicesVar.value = [0];
    sequentialTempoChangeIndicesVar.id = "sequentialTempoChangeIndicesVar";
    module.addVariable(sequentialTempoChangeIndicesVar);
    var sequentialTempoChangeEndIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeEndIndicesVar.value = [];
    sequentialTempoChangeEndIndicesVar.id = "sequentialTempoChangeEndIndicesVar";
    module.addVariable(sequentialTempoChangeEndIndicesVar);
    var sequentialTempoElements = [];
    var sequentialTempoCurves = [];
    for (var i = 0; i < genData.sequentialTempoChangeInfos.length; i++) {
        var info = genData.sequentialTempoChangeInfos[i];
        sequentialTempoElements.push(info.element);
        sequentialTempoCurves.push(info.curve)
    }
    var sequentialTempoDesc = {
        elements: sequentialTempoElements,
        curves: sequentialTempoCurves,
        type: "sequential",
        indicesExpression: sequentialTempoChangeIndicesVar.id,
        startIndicesExpression: sequentialTempoChangeStartIndicesVar.id,
        endIndicesExpression: sequentialTempoChangeEndIndicesVar.id
    };
    createControlLineFromDescription(sequentialTempoDesc, {
        channelId: tempoChannel.id,
        controlWriteMode: ControlChannelControlWriteMode.NONE
    });
    var parallelTempoElements = [];
    var parallelTempoCurves = [];
    for (var i = 0; i < genData.parallelTempoChangeInfos.length; i++) {
        var info = genData.parallelTempoChangeInfos[i];
        parallelTempoElements.push(info.element);
        parallelTempoCurves.push(info.curve);
        if (info.variables) {
            for (var j = 0; j < info.variables.length; j++) {
                module.addVariable(info.variables[j])
            }
        }
    }
    var parallelTempoDesc = {
        elements: parallelTempoElements,
        curves: parallelTempoCurves,
        type: "parallel",
        indicesExpression: parallelTempoChangeIndicesVar.id
    };
    var tempoControlLine = createControlLineFromDescription(parallelTempoDesc, {
        channelId: tempoChannel.id,
        controlWriteMode: ControlChannelControlWriteMode.NONE
    });
    if (genInfo.useNaturalTempoChanges) {
        var naturalTempoElement = new NaturalTempoCurveControlElement();
        naturalTempoElement.baseTempo = songStructureInfo.baseTempo;
        naturalTempoElement.prevTempoUseExpression = true;
        naturalTempoElement.prevTempoExpression = prevSectionTempoVar.id;
        naturalTempoElement.currentTempoUseExpression = true;
        naturalTempoElement.currentTempoExpression = sectionTempoVar.id;
        naturalTempoElement.nextTempoUseExpression = true;
        naturalTempoElement.nextTempoExpression = nextSectionTempoVar.id;
        tempoControlLine.addControlElement(naturalTempoElement)
    }
    var structure = new Structure();
    structure.id = "structure";
    var measureVelocityCurve = new LinearInterpolationCurve();
    measureVelocityCurve.id = "measureVelocityCurve";
    module.addCurve(measureVelocityCurve);
    measureVelocityCurve.xValuesUseExpression = true;
    measureVelocityCurve.yValuesUseExpression = true;
    measureVelocityCurve.xValuesExpression = "[0, 1, 2, 3, 3.99]";
    measureVelocityCurve.yValuesExpression = "[1.0, 0.9, 0.95, 0.85, 0.85]";
    var sectionVelocityCurve = new ComputationCurve();
    sectionVelocityCurve.id = "sectionVelocityCurve";
    module.addCurve(sectionVelocityCurve);
    var modCompute = new PeriodicCurveComputation();
    modCompute.inputCurve = measureVelocityCurve.id;
    modCompute.periodUseExpression = true;
    modCompute.periodExpression = numeratorVar.id;
    sectionVelocityCurve.computation = modCompute;

    function createSectionModifiers(mods, arr, index) {
        for (var i = 0; i < mods.length; i++) {
            var modInfo = mods[i];
            var sm = new SetVariableValueSectionModifier().setVariable(modInfo[0]);
            var valueExpression = modInfo[1];
            if (typeof (valueExpression) == "string") {
                if (!valueExpression.match(/[a-z]/i)) {
                    sm.value = eval(valueExpression)
                } else {
                    sm.valueExpression = valueExpression
                }
            } else {
                sm.valueExpression = valueExpression
            }
            sm.id = "Set " + modInfo[0] + " section " + index;
            arr.push(sm)
        }
        var prefixes = ["melody", "inner1", "inner2", "bass", "percussion"];
        var counts = [3, 3, 3, 1];
        for (var i = 0; i < prefixes.length; i++) {
            for (var j = 0; j < counts[i]; j++) {
                var nvsm = new NoteVelocitiesSectionModifier();
                nvsm.curveGlobalTime = false;
                nvsm.curve = sectionVelocityCurve.id;
                nvsm.curveMultiplierUseExpression = true;
                nvsm.curveMultiplierExpression = prefixes[i] + "RenderAmountVar * 0.4 + 0.6";
                nvsm.channel = prefixes[i] + "RenderChannel" + (j + 1);
                arr.push(nvsm)
            }
        }
    }
    for (var i = 0; i < sectionInfos.length; i++) {
        var sectionInfo = sectionInfos[i];
        var sectionRef = new SectionReference(section.id);
        var mods = sectionInfo.getSetVariableModifiers(genData);
        createSectionModifiers(mods, sectionRef.modifiers, i + 1);
        structure.references.push(sectionRef)
    }
    module.addStructure(structure);
    if (!(typeof (MidiRenderer) === "undefined")) {
        var midiRenderer = new MidiRenderer();
        midiRenderer.id = "midiRenderer";
        midiRenderer.structure = module.getStructures()[0].id;

        function getIdsWithIdContains(str, arr) {
            var result = [];
            if (!arr) {
                arr = module.renderChannels
            }
            for (var i = 0; i < arr.length; i++) {
                var channel = arr[i];
                if (channel.id.indexOf(str) != -1) {
                    result.push(channel.id)
                }
            }
            return result
        }
        var reverbSendType = MidiControllerType.EFFECTS_DEPTH_1;
        var chorusSendType = MidiControllerType.EFFECTS_DEPTH_3;
        var melodyRenderChannels = getIdsWithIdContains("melodyRenderChannel");
        var inner1RenderChannels = getIdsWithIdContains("inner1RenderChannel");
        var inner2RenderChannels = getIdsWithIdContains("inner2RenderChannel");
        var bassRenderChannels = getIdsWithIdContains("bassRenderChannel");
        var controlChannels = getIdsWithIdContains("ControlChannel", module.controlChannels);
        var controllerTypeMap = {
            FilterF: MidiControllerType.SOUND_CONTROLLER_2,
            FilterQ: MidiControllerType.SOUND_CONTROLLER_5,
            Pan: MidiControllerType.PAN
        };
        if (genInfo.exportChordsToNewChannel) {
            var chId = chordsRenderChannel.id;
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = 15;
            midiMap.renderChannel = chId;
            midiMap.program = 1;
            midiRenderer.channelMaps.push(midiMap)
        }
        for (var i = 0; i < melodyRenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 0 : i;
            var chId = melodyRenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.melodyChannelInstruments[mergeIndex % genData.melodyChannelInstruments.length];
            midiMap.program = program;
            if (!genInfo.mergeChannels) {
                var melodyReverbSend = 127 * genInfo.melodyReverbSends[mergeIndex % genInfo.melodyReverbSends.length];
                var melodyChorusSend = 127 * genInfo.melodyChorusSends[mergeIndex % genInfo.melodyChorusSends.length];
                var melodyVolume = 127 * genInfo.melodyVolumeMultipliers[mergeIndex % genInfo.melodyVolumeMultipliers.length];
                midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(melodyVolume), new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(melodyPan), new InitialMidiControllerMessage().setType(reverbSendType).setValue(melodyReverbSend), new InitialMidiControllerMessage().setType(chorusSendType).setValue(melodyChorusSend)]
            }
            midiRenderer.channelMaps.push(midiMap)
        }
        if (!genInfo.mergeChannels) {
            for (var i = 0; i < controlChannels.length; i++) {
                var chId = controlChannels[i];
                var controlMap = new MidiControlChannelMap();
                controlMap.amplitude = 127;
                controlMap.id = "Map for " + chId;
                controlMap.controlChannel = chId;
                var offset = chId.indexOf("ControlChannel") + "ControlChannel".length;
                var controllerStr = chId.substring(offset, chId.length - 1);
                var voiceStr = chId.substring(0, chId.indexOf("ControlChannel"));
                var voiceIndex = parseInt(chId.substring(chId.length - 1, chId.length));
                var channelOffset = 0;
                if (voiceStr == "inner1") {
                    channelOffset = 3
                } else {
                    if (voiceStr == "inner2") {
                        channelOffset = 6
                    } else {
                        if (voiceStr == "percussion") {
                            channelOffset = 9
                        } else {
                            if (voiceStr == "bass") {
                                channelOffset = 11
                            }
                        }
                    }
                }
                controlMap.channel = voiceIndex + channelOffset - 1;
                var controllerType = controllerTypeMap[controllerStr];
                if (typeof (controllerType) === "undefined") {
                    console.log("Could not find controller type for " + controllerStr)
                } else {
                    controlMap.controllerType = controllerType;
                    midiRenderer.controlChannelMaps.push(controlMap)
                }
            }
        }
        var volumeHints = [];
        for (var progStr in genInfo) {
            var program = parseInt(progStr);
            if (!isNaN(program)) {
                volumeHints[program] = 127 * genInfo[progStr]
            }
        }
        for (var i = 0; i < inner1RenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 3 : i + 3;
            var chId = inner1RenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.inner1ChannelInstruments[mergeIndex % genData.inner1ChannelInstruments.length];
            midiMap.program = program;
            if (!genInfo.mergeChannels) {
                var volume = 127;
                if (volumeHints[program]) {
                    volume = volumeHints[program]
                }
                volume *= genInfo.inner1VolumeMultipliers[i % genInfo.inner1VolumeMultipliers.length];
                var inner1ReverbSend = 127 * genInfo.inner1ReverbSends[i % genInfo.inner1ReverbSends.length];
                var inner1ChorusSend = 127 * genInfo.inner1ChorusSends[i % genInfo.inner1ChorusSends.length];
                midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(volume), new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(inner1Pan), new InitialMidiControllerMessage().setType(reverbSendType).setValue(inner1ReverbSend), new InitialMidiControllerMessage().setType(chorusSendType).setValue(inner1ChorusSend)]
            }
            midiRenderer.channelMaps.push(midiMap)
        }
        for (var i = 0; i < inner2RenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 6 : i + 6;
            var chId = inner2RenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.inner2ChannelInstruments[mergeIndex % genData.inner2ChannelInstruments.length];
            midiMap.program = program;
            if (!genInfo.mergeChannels) {
                var volume = 127;
                if (volumeHints[program]) {
                    volume = volumeHints[program]
                }
                volume *= genInfo.inner2VolumeMultipliers[i % genInfo.inner2VolumeMultipliers.length];
                var inner2ReverbSend = 127 * genInfo.inner2ReverbSends[i % genInfo.inner2ReverbSends.length];
                var inner2ChorusSend = 127 * genInfo.inner2ChorusSends[i % genInfo.inner2ChorusSends.length];
                midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(volume), new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(inner2Pan), new InitialMidiControllerMessage().setType(reverbSendType).setValue(inner2ReverbSend), new InitialMidiControllerMessage().setType(chorusSendType).setValue(inner2ChorusSend)]
            }
            midiRenderer.channelMaps.push(midiMap)
        }
        for (var i = 0; i < bassRenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 11 : i + 11;
            var chId = bassRenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.bassChannelInstruments[mergeIndex % genData.bassChannelInstruments.length];
            midiMap.program = program;
            if (!genInfo.mergeChannels) {
                var bassReverbSend = 127 * genInfo.bassReverbSends[i % genInfo.bassReverbSends.length];
                var bassChorusSend = 127 * genInfo.bassChorusSends[i % genInfo.bassChorusSends.length];
                var bassVolume = 127 * genInfo.bassVolumeMultipliers[i % genInfo.bassVolumeMultipliers.length];
                midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(bassVolume), new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(bassPan), new InitialMidiControllerMessage().setType(reverbSendType).setValue(bassReverbSend), new InitialMidiControllerMessage().setType(chorusSendType).setValue(bassChorusSend)]
            }
            midiRenderer.channelMaps.push(midiMap)
        }
        var percussionMidiMap = new MidiChannelMap();
        percussionMidiMap.id = "Map for " + percussionRenderChannel1.id;
        percussionMidiMap.channel = 9;
        percussionMidiMap.renderChannel = percussionRenderChannel1.id;
        percussionMidiMap.program = 0;
        if (!genInfo.mergeChannels) {
            var percussionVolume = 127 * genInfo.percussionVolumeMultiplier;
            percussionMidiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(percussionVolume), new InitialMidiControllerMessage().setType(reverbSendType).setValue(127 * genInfo.percussionReverbSend), new InitialMidiControllerMessage().setType(chorusSendType).setValue(127 * genInfo.percussionChorusSend)]
        }
        midiRenderer.channelMaps.push(percussionMidiMap);
        module.addRenderer(midiRenderer)
    }
    traverseValue(module, function (v, propName, obj) {
        if (stringEndsWith(propName, "Expression")) {
            var valuePropName = propName.substring(0, propName.indexOf("Expression"));
            var useStr = valuePropName + "UseExpression";
            if (obj[useStr]) {
                if (typeof (v) === "string" && !v.match(/[a-z]/i)) {
                    if (typeof (obj[valuePropName]) != "undefined") {
                        obj[valuePropName] = eval(v);
                        obj[useStr] = false
                    } else { }
                } else { }
            }
        }
    });
    return module
};


var Midi = (function () {


    var MessageStatus = {
        NOTE_OFF: 0x80,
        NOTE_ON: 0x90,
        KEY_PRESSURE: 0xA0,
        CONTROL_CHANGE: 0xB0,
        PROGRAM_CHANGE: 0xC0,
        CHANNEL_PRESSURE: 0xD0,
        PITCH_BEND: 0xE0,
        SYSTEM: 0xF0,
        INVALID: 0x00,
        isStatus: function (value) {
            return value != MessageStatus.INVALID && MessageStatus.STRING_TABLE[value] != null;
        }
    };

    MessageStatus.STRING_TABLE = {};
    MessageStatus.STRING_TABLE[MessageStatus.NOTE_OFF] = "NOTE_OFF";
    MessageStatus.STRING_TABLE[MessageStatus.NOTE_ON] = "NOTE_ON";
    MessageStatus.STRING_TABLE[MessageStatus.KEY_PRESSURE] = "KEY_PRESSURE";
    MessageStatus.STRING_TABLE[MessageStatus.CONTROL_CHANGE] = "CONTROL_CHANGE";
    MessageStatus.STRING_TABLE[MessageStatus.PROGRAM_CHANGE] = "PROGRAM_CHANGE";
    MessageStatus.STRING_TABLE[MessageStatus.CHANNEL_PRESSURE] = "CHANNEL_PRESSURE";
    MessageStatus.STRING_TABLE[MessageStatus.PITCH_BEND] = "PITCH_BEND";
    MessageStatus.STRING_TABLE[MessageStatus.SYSTEM] = "SYSTEM";
    MessageStatus.STRING_TABLE[MessageStatus.INVALID] = "INVALID";


    function Message(status) {
        this.status = typeof (status) === 'undefined' ? 0 : status;
    }
    Message.prototype.encode = function (data) {
    };

    function DataMessage(status, data1, data2) {
        Message.call(this, status);
        this.data1 = typeof (data1) === 'undefined' ? 0 : data1;
        this.data2 = typeof (data2) === 'undefined' ? 0 : data2;
    }

    DataMessage.prototype = new Message();

    DataMessage.prototype.combinedData = function () {
        var combined = this.data2;
        combined <<= 7;
        combined |= this.data1;
        return combined;
    };

    function ChannelMessage(status, channel, data1, data2) {
        DataMessage.call(this, status, data1, data2);
        this.channel = typeof (channel) === 'undefined' ? 0 : channel;
    }

    ChannelMessage.prototype = new DataMessage();

    ChannelMessage.prototype.encode = function (data) {
        data.writeByte(this.status | this.channel);
        data.writeByte(Math.round(this.data1));
        data.writeByte(Math.round(this.data2));
    };

    function VoiceMessage(status, channel, data1, data2) {
        ChannelMessage.call(this, status, channel, data1, data2);
    }
    VoiceMessage.prototype = new ChannelMessage();

    VoiceMessage.prototype.octave = function () {
        return Math.floor(this.data1 / 12) - 1;
    };
    VoiceMessage.prototype.pitch = function () {
        return this.data1;
    };
    VoiceMessage.prototype.note = function () {
        return this.pitch() % 12;
    };
    VoiceMessage.prototype.velocity = function () {
        return this.data2;
    };
    var MIDINote = {
        C: 0,
        C_SHARP: 1,
        D: 2,
        D_SHARP: 3,
        E: 4,
        F: 5,
        F_SHARP: 6,
        G: 7,
        G_SHARP: 8,
        A: 9,
        A_SHARP: 10,
        B: 11
    };

    var MetaEventMessageType =
    {
        SEQUENCE_NUM: 0x00,

        TEXT: 0x01,
        COPYRIGHT: 0x02,
        TRACK_NAME: 0x03,
        INSTRUMENT_NAME: 0x04,
        LYRIC: 0x05,
        MARKER: 0x06,
        CUE_POINT: 0x07,
        PROGRAM_NAME: 0x08,
        DEVICE_NAME: 0x09,

        CHANNEL_PREFIX: 0x20,
        MIDI_PORT: 0x21,
        END_OF_TRACK: 0x2F,
        SET_TEMPO: 0x51,
        SMPTE_OFFSET: 0x54,
        TIME_SIGNATURE: 0x58,
        KEY_SIGNATURE: 0x59,
        SEQUENCER_SPECIFIC: 0x7F
    }

    var SystemMessageType = {
        SYS_EX_START: 0x0,
        MIDI_TIME_CODE: 0x1,
        SONG_POSITION: 0x2,
        SONG_SELECT: 0x3,
        TUNE_REQUEST: 0x6,
        SYS_EX_END: 0x7,
        TIMING_CLOCK: 0x8,
        START: 0xA,
        CONTINUE: 0xB,
        STOP: 0xC,
        ACTIVE_SENSING: 0xE,
        SYSTEM_RESET: 0xF
    };

    function MetaEventMessage(type) {
        Message.call(this, SystemMessageType.SYSTEM_RESET);
        this.type = type;
    }
    MetaEventMessage.prototype = new Message();

    function EndTrackMessage(type) {
        MetaEventMessage.call(this, type);
    }

    EndTrackMessage.prototype = new MetaEventMessage();
    EndTrackMessage.prototype.END_OF_TRACK = new EndTrackMessage(MetaEventMessageType.END_OF_TRACK);
    EndTrackMessage.prototype.encode = function (data) {
        data.writeByte(0xff);
        data.writeByte(0x2f);
        data.writeByte(0);
    };

    function ProgramChangeMessage(channel, instrument) {
        ChannelMessage.call(this, MessageStatus.PROGRAM_CHANGE, channel, instrument);
    }
    ProgramChangeMessage.prototype = new ChannelMessage();

    ProgramChangeMessage.prototype.encode = function (data) {
        data.writeByte(this.status | this.channel);
        data.writeByte(this.data1);
    };

    function SetTempoMessage(microsPerQuarter) {
        MetaEventMessage.call(this, MetaEventMessageType.SET_TEMPO);

        this.microsPerQuarter = microsPerQuarter;
    }
    SetTempoMessage.prototype = new MetaEventMessage();

    SetTempoMessage.prototype.encode = function (data) {
        data.writeByte(0xff);
        data.writeByte(0x51);
        writeVariableLengthUInt(data, 3);
        data.writeByte((this.microsPerQuarter >> 16) & 0xff);
        data.writeByte((this.microsPerQuarter >> 8) & 0xff);
        data.writeByte((this.microsPerQuarter) & 0xff);
    };

    function MIDITrackEvent(time, message) {
        this.eventTime = time;
        this.eventMessage = message;

    }

    MIDITrackEvent.prototype.encode = function (data) {
        writeVariableLengthUInt(data, this.eventTime);
        this.eventMessage.encode(data);
    };

    function MIDITrack(events) {
        this.trackEvents = events;
    }

    function MIDIFile(format, division, tracks) {
        this.fileFormat = format;
        this.midiDivision = division;
        this.midiTracks = tracks ? tracks : [];

    }
    MIDIFile.prototype.numTracks = function () {
        return this.midiTracks.length;
    };

    function MIDIEncoder() {
    }
    MIDIEncoder.prototype.MIDI_FILE_HEADER_TAG = 0x4D546864; // MThd
    MIDIEncoder.prototype.MIDI_FILE_HEADER_SIZE = 0x00000006;
    MIDIEncoder.prototype.MIDI_TRACK_HEADER_TAG = 0x4D54726B; // MTrk

    MIDIEncoder.prototype.encodeEvents = function (data, events) {
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            event.encode(data);
        }
    };

    MIDIEncoder.prototype.encodeFile = function (data, file) {

        data.writeInt(this.MIDI_FILE_HEADER_TAG);
        data.writeInt(this.MIDI_FILE_HEADER_SIZE);

        var format = file.fileFormat;
        var numTracks = file.midiTracks.length;
        var timingDivision = file.midiDivision;

        if (typeof (format) === 'undefined') {
            console.log("format undef...");
        }
        if (typeof (numTracks) === 'undefined') {
            console.log("numtracks undef...");
        }
        if (typeof (timingDivision) === 'undefined') {
            console.log("divisiion undef...");
        }
        data.writeShort(format);
        data.writeShort(numTracks);
        data.writeShort(timingDivision);

        var tracks = file.midiTracks;

        var track;
        var trackHeader;
        var trackSize;
        var trackEnd;
        var trackTime;

        var events;
        var event;
        var eventDelta;

        var messageBytes;
        var message;

        var previousStatusByte;

        for (var i = 0; i < numTracks; i++) {
            track = tracks[i];

            events = track.trackEvents;

            data.writeInt(this.MIDI_TRACK_HEADER_TAG);

            // Encoding all events in the track and then check and write the size
            var trackBytes = new FakeByteArray();
            this.encodeEvents(trackBytes, events);

            data.writeInt(trackBytes.length);

            // Write all the track bytes
            data.appendByteArray(trackBytes);
        }
        //    console.log("Data length: " + data.lengths.length);
    }

    function writeVariableLengthUInt(data, theUInt) {
        var mask = 0xffffff7f;

        var bytes = [];

        for (var i = 0; i < 4; i++) {
            var masked = theUInt & mask;
            var byt = masked & 0x7f;
            if (masked) {
                bytes.push(byt);
            }
            theUInt = theUInt >> 7;
        }
        if (bytes.length == 0) {
            bytes.push(0);
        }

        for (i = bytes.length - 1; i >= 0; i--) {
            byt = bytes[i];
            if (i != 0) {
                byt = byt | 0x80;
            }
            data.writeByte(byt);
        }
    }

    function encodeMidi(midiDataObject, resultBuffer) {

        var resultMidiTracks = [];

        if (typeof (midiDataObject.midiTracks) === 'undefined') {
            console.log("Midi data missing midiTracks property<br />");
            return;
        }

        if (typeof (midiDataObject.midiTracks.length) === 'undefined') {
            console.log("Midi data midiTracks property not an array<br />");
            return;
        }

        var inputMidiTracks = midiDataObject.midiTracks;

        inputMidiTracks.push({});

        for (var i = 0; i < inputMidiTracks.length - 1; i++) {

            var trackEvents = [];

            var track = inputMidiTracks[i];

            if (typeof (track.trackEvents) === 'undefined') {
                //        textArea.text += "Midi data track missing trackEvents property\n";
                //        textArea.text += JSON.stringify(track) + "\n";
                //        textArea.text += JSON.stringify(inputMidiTracks[i]) + "\n";
                //        textArea.text += JSON.stringify(inputMidiTracks) + "\n";
                return;
            }

            var events = track.trackEvents;
            for (var j = 0; j < events.length; j++) {
                var event = events[j];

                if (typeof (event.eventTime) === 'undefined') {
                    //            textArea.text += "Midi data event missing eventTime property\n";
                    return;
                }

                var eventTime = event.eventTime;

                if (typeof (event.eventMessage) === 'undefined') {
                    //            textArea.text += "Midi data event missing eventMessage property\n";
                    return;
                }

                var eventMessage = event.eventMessage;

                if (typeof (eventMessage.messageClass) === 'undefined') {
                    //            textArea.text += "Midi data event message missing messageClass property\n";
                    return;
                }

                var messageClass = eventMessage.messageClass;

                var message = null;
                var statusStr = "";
                var status = 0;
                switch (messageClass) {
                    case "ChannelMessage":
                        statusStr = eventMessage.status;
                        status = MessageStatus.CONTROL_CHANGE;
                        switch (statusStr) {
                            case "CONTROL_CHANGE":
                                status = MessageStatus.CONTROL_CHANGE;
                                break;
                        }
                        message = new ChannelMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "VoiceMessage":
                        statusStr = eventMessage.status;
                        status = MessageStatus.NOTE_OFF;
                        switch (statusStr) {
                            case "NOTE_ON":
                                status = MessageStatus.NOTE_ON;
                                break;
                            case "NOTE_OFF":
                                status = MessageStatus.NOTE_OFF;
                                break;
                        }
                        message = new VoiceMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "EndTrackMessage":
                        message = EndTrackMessage.prototype.END_OF_TRACK;
                        break;
                    case "ProgramChangeMessage":
                        message = new ProgramChangeMessage(eventMessage.channel, eventMessage.program);
                        break;
                    case "SetTempoMessage":
                        message = new SetTempoMessage(eventMessage.microsPerQuarter);
                        break;
                }
                if (message != null) {
                    trackEvents.push(new MIDITrackEvent(eventTime, message));
                } else {
                    console.log("message was " + message + " " + messageClass);
                }

            }
            resultMidiTracks.push(new MIDITrack(trackEvents));
        }

        var midiFile = new MIDIFile(midiDataObject.fileFormat, midiDataObject.midiDivisions, resultMidiTracks);

        var encoder = new MIDIEncoder();
        encoder.encodeFile(resultBuffer, midiFile);

    }

    return {
        encodeMidi: encodeMidi
    }

})();

function inputOk(genInfo, correct) {
    var valid = true;
    try {
        valid = validateValueWithSafeValue(genInfo, new GenInfo(), null, {
            "array": 1,
            "number": 1
        }, correct);
        if (!valid) {
            console.log("Input validation failed");
        }
    } catch (exc) {
        console.log("Input validation threw exception:");
        console.log(exc.toString());
        valid = false;
    }
    return valid;
}

function render(jsonRenderRequestData) {
    var content = jsonRenderRequestData;

    var seed = content.seed;

    var rnd = new MersenneTwister(seed);
    var genInfo = content.genInfo;

    if (inputOk(genInfo, true)) {
        var resultObj = {};
        var maxSections = 40;
        var module = createTestModule(rnd.genrand_int31(), genInfo, resultObj);

        var midiRenderer = module.getSynthRenderer("midiRenderer");

        var result = {
            songStructureInfo: resultObj.songStructureInfo,
            seed: seed,
            channelMaps: midiRenderer.channelMaps,
            module: module
        };

        var renderData = new RenderData();
        var state = new RenderState(module, renderData);
        var structure = module.structures[0];
        if (structure.references.length > maxSections) {
            structure.references.length = maxSections;
        }
        var sectionTimes = [];
        structure.renderBatch(state, function (progress) {
            sectionTimes.push(state.sectionTime);
        });
        renderData.sort();

        result.origRenderData = renderData;

        var netJson = renderData.toNetJSON();

        result.renderData = JSON.parse(netJson);
        result.renderDataLength = state.sectionTime;
        result.sectionTimes = sectionTimes;

        return result;
    }

    return null;
}

function generateMidiData(jsonRenderRequestData) {
    var result = render(jsonRenderRequestData);

    if (result) {
        var midiRenderer = result.module.getSynthRenderer("midiRenderer");
        var midiData = midiRenderer.getMidiData(result.origRenderData, result.module, jsonRenderRequestData.genInfo);
        result.midiData = midiData;

        delete result.origRenderData; // No use to us now after midi has been rendered
        delete result.module; // No use to us now after midi has been rendered

        return result;
    }
}

function parseSeed(seedString) {
    // Try parsing the seed as an integer
    var seed = parseInt(seedString);

    // If it couldn't be parsed, use hashCode
    if (isNaN(seed)) {
        seed = hashCode(seedString);
    }

    return seed;
}

// Properly parses seeds and sets them on the object Sets the seed values
// function setSeeds(result, settings) {
//     for (var prop in settings) {
//         // using indexOf prevents the _constructorName property (potentially among other defaults) from being copied
//         if (prop.indexOf("Seed") >= 0) {
//             var seedStr = settings[prop];
//             if (seedStr) {
//                 var seed = parseSeed(seedStr);

//                 if (!isNaN(seed)) {
//                     result[prop] = seed;
//                 }
//             }
//         }
//     }
// }

// function setProperties(result, settings) {
//     for (var prop in settings) {
//         let value = settings[prop];
//         if (!isFunction(value)) {
//             result[prop] = value;
//         }
//     }
// }

// Create a new object to use as genInfo
// function createGenInfo() {
//     var result = new GenInfo(); // Start with the plain gen info object

//     setSeeds(result, new SongStructureSeedSettings());
//     setSeeds(result, new SongContentSeedSettings());
//     setSeeds(result, new SongIndicesSeedSettings());

//     setProperties(result, new SongParameters());
//     setProperties(result, new SongDomains());
//     setProperties(result, new SongDetails());

//     setProperties(result, new MidiExportSettings())

//     return result;
// }

function exportMidi(seedString) {
    //console.log("starting midi export...");
    let seed = parseSeed(seedString); // Parse the user provided seed

    var renderRequestData = {
        seed: seed, 
        strSeed: seedString, // strSeed is not used anywhere.
        name: 'Song',
        sectionIndex: -1, 
        genInfo: genInfo_overrides_default // located in geninfo.overrides.js
    };

    var midiResult = generateMidiData(renderRequestData);

    // that.resultRenderData = result.renderData;
    // that.resultRenderDataLength = result.renderDataLength;
    // that.resultChannelMaps = result.channelMaps;
    // that.resultSongStructureInfo = result.songStructureInfo;
    // that.resultSectionTimes = result.sectionTimes;

    var fakeByteArray = new FakeByteArray();
    Midi.encodeMidi(midiResult.midiData, fakeByteArray);
    var buffer = fakeByteArray.toBuffer();

    return new Uint8Array(buffer);
}