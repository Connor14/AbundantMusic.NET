// When you first navigate to Abundant Music (https://pernyblom.github.io/abundant-music/index.html) and type in a seed,
// the song that generates is NOT using the default GenInfo properties on the GenInfo object.
// Rather, it is using some of the default GenInfo properties (after they've been randomized by your seed) with overrides applied from songpresets/song_20121105_120934_788.json
// 
// The genInfo_overrides_default object below is a consolidated version of the overrides that Abundant Music uses on startup. 
// "consolidated" means it only contains the properties necessary for AbundantMusic.NET to generate the same music as Abundant Music by default.
//
// The code below was used to create the consolidated object. 
// new GenInfo() was compared to the genInfo property on renderRequestData.json

/*
let originalGenInfo = new GenInfo();
let inputGenInfo = genInfo; // genInfo from the default renderRequestData

// Determine which properties in inputGenInfo are already existing in originalGenInfo
var consolidatedInput = {};
for(var inputProp in inputGenInfo){
    if(originalGenInfo[inputProp] === undefined) console.log("input prop is missing on original: " + inputProp);

    var originalValue = originalGenInfo[inputProp];
    var inputValue = inputGenInfo[inputProp];

    // if the values don't match for some reason, our consolidatedInput needs this input value
    if(JSON.stringify(originalValue) !== JSON.stringify(inputValue)){
        consolidatedInput[inputProp] = inputValue;
    }
}

console.log(JSON.stringify(consolidatedInput));
*/
var genInfo_overrides_default = {
    "phraseGroupTypes": [{
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 20
    }, {
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 11
    }, {
        "likelihood": 0.125,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 8
    }, {
        "likelihood": 0.125,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 10
    }, {
        "likelihood": 0.25,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 4
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 19
    }, {
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 15
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 3
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 18
    }, {
        "likelihood": 0.5,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 22
    }, {
        "likelihood": 0.5,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 2
    }],
    "modulatePhraseGroupTypes": [{
        "likelihood": 0.5,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 23
    }, {
        "likelihood": 0.5,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 20
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 11
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 9
    }, {
        "likelihood": 0.5,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 12
    }],
    "majorDeceptiveRootRndInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 6
    }, {
        "likelihood": 4,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 5
    }, {
        "likelihood": 4,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 3
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 2
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 1
    }],
    "minorDeceptiveRootRndInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 6
    }, {
        "likelihood": 4,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 5
    }, {
        "likelihood": 4,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 3
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 2
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "IntDataSample",
        "data": 1
    }],
    "introGroupTypes": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 17
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 27
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 0
    }],
    "endGroupTypes": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 17
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 27
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 0
    }],
    "glueGroupTypes": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 17
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 27
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "PhraseGroupTypeDataSample",
        "data": 0
    }],
    "majorModulationTargetInfos": [{
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 1
    }, {
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 4
    }, {
        "likelihood": 0.2,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 0
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 3
    }],
    "minorModulationTargetInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 1
    }, {
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 4
    }, {
        "likelihood": 0.1,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 5
    }, {
        "likelihood": 0.2,
        "active": true,
        "_constructorName": "ModulationTargetDataSample",
        "data": 3
    }],
    "electronicMelodyInstrInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 4
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 5
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 62
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 63
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 81
    }],
    "electricMelodyInstrInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 30
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 2
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 17
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 18
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 62
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 63
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 4
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 5
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 29
    }],
    "electricInnerFastInstrInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 30
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 2
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 26
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 28
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 4
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 5
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 29
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 62
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 63
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 54
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 27
    }],
    "electricInnerSlowInstrInfos": [{
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 30
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 29
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 62
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 63
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 54
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 92
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 94
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 93
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 88
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 90
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 95
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 50
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 51
    }, {
        "likelihood": 1,
        "active": true,
        "_constructorName": "MidiProgramDataSample",
        "data": 89
    }]
};