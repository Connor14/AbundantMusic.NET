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
