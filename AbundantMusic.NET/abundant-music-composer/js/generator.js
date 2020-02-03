// stuff from worker.js
function returnMidiData(message) {
    var data = message;
    var taskType = data.taskType;

    var result = render(data);
    //$("#json").html(JSON.stringify(result));

    if (result) {
        var midiRenderer = result.module.getSynthRenderer("midiRenderer");
        var midiData = midiRenderer.getMidiData(result.origRenderData, result.module, data.content.genInfo);
        result.midiData = midiData;

        //                            logit("Result midi data " + JSON.stringify(result.midiData));

        delete result.origRenderData; // No use to us now after midi has been rendered
        delete result.module; // No use to us now after midi has been rendered

        return result;
    }
}

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

function render(data) {
    var content = data.content;
    var seed = content.seed;

    var sectionIndex = content.sectionIndex;

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

// receive result from asyncoperation.js
function getFileAsString(data){
    //console.log(data);
    var result = data;
    // that.resultRenderData = result.renderData;
    // that.resultRenderDataLength = result.renderDataLength;
    // that.resultChannelMaps = result.channelMaps;
    // that.resultSongStructureInfo = result.songStructureInfo;
    // that.resultSectionTimes = result.sectionTimes;
    
    var buffer = null;
    var extension = ".mid";
    
    var fakeByteArray = new FakeByteArray();
    Midi.encodeMidi(result.midiData, fakeByteArray);
    buffer = fakeByteArray.toBuffer();
    //                                addAudioElement = true;
    //                                audioType = "audio/midi";

    // create a comma separated list of integers representing the bytes of the file
    return new Uint8Array(buffer).join(); 
}