
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
MersenneTwister.prototype.init_by_array = function (a, f) {
    var d, c, b;
    this.init_genrand(19650218);
    d = 1;
    c = 0;
    b = (this.N > f ? this.N : f);
    for (; b; b--) {
        var e = this.mt[d - 1] ^ (this.mt[d - 1] >>> 30);
        this.mt[d] = (this.mt[d] ^ (((((e & 4294901760) >>> 16) * 1664525) << 16) + ((e & 65535) * 1664525))) + a[c] + c;
        this.mt[d] >>>= 0;
        d++;
        c++;
        if (d >= this.N) {
            this.mt[0] = this.mt[this.N - 1];
            d = 1
        }
        if (c >= f) {
            c = 0
        }
    }
    for (b = this.N - 1; b; b--) {
        var e = this.mt[d - 1] ^ (this.mt[d - 1] >>> 30);
        this.mt[d] = (this.mt[d] ^ (((((e & 4294901760) >>> 16) * 1566083941) << 16) + (e & 65535) * 1566083941)) - d;
        this.mt[d] >>>= 0;
        d++;
        if (d >= this.N) {
            this.mt[0] = this.mt[this.N - 1];
            d = 1
        }
    }
    this.mt[0] = 2147483648
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
MersenneTwister.prototype.genrand_real1 = function () {
    return this.genrand_int32() * (1 / 4294967295)
};
MersenneTwister.prototype.random = function () {
    return this.genrand_int32() * (1 / 4294967296)
};
MersenneTwister.prototype.genrand_real3 = function () {
    return (this.genrand_int32() + 0.5) * (1 / 4294967296)
};
MersenneTwister.prototype.genrand_res53 = function () {
    var d = this.genrand_int32() >>> 5,
        c = this.genrand_int32() >>> 6;
    return (d * 67108864 + c) * (1 / 9007199254740992)
};