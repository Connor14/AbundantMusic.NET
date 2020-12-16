
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