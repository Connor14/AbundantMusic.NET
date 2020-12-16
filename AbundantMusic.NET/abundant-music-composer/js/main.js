
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

// Properly parses seeds and sets them back on the object
function adjustSeedValues(inputGenInfo) {
    for (var prop in inputGenInfo) {
        // using indexOf ensures that only "seed" properties are ajusted
        if (prop.indexOf("Seed") >= 0) {
            var seedStr = inputGenInfo[prop];
            if (seedStr) {
                var seed = parseSeed(seedStr); // Parse the seed

                if (!isNaN(seed)) {
                    inputGenInfo[prop] = seed; // Replace the value
                }
            }
        }
    }
}

function exportMidi(seedString) {    
    //console.log("starting midi export...");
    let seed = parseSeed(seedString); // Parse the user provided seed

    // Copy the overrides object
    // genInfo_overrides_default is located in geninfo.overrides.js
    let inputGenInfo = copyObjectDeep(genInfo_overrides_default); 

    // Make sure any seed values are properly parsed the same way they are in Abundant Music web
    adjustSeedValues(inputGenInfo);

    var renderRequestData = {
        seed: seed, 
        strSeed: seedString, // strSeed is not used anywhere.
        name: 'Song',
        sectionIndex: -1, 
        genInfo: inputGenInfo
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

    return new Uint8Array(buffer).join();
}
