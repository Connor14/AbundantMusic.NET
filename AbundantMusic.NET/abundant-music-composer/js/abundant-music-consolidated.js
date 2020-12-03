'use strict';

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

function applyHarmonyModifiers(e, b, d) {
    for (var c = 0; c < b.length; c++) {
        var a = b[c];
        e = a.modifyConstantHarmonyElements(e, d)
    }
    return e
}

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