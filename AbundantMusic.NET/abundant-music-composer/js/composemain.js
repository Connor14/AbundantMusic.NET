var asyncOperations = [];
var asyncOperationCounter = 0;

var AsyncServerChildTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2,
    EXPORT_MP3: 3,
    EXPORT_OGG: 4,
    SAVE_PRESET: 5,
    SAVE_SONG: 6,
    DELETE_SONG: 7,
    RENAME_SONG: 8,
    DUPLICATE_SONGS: 9,
    OVERWRITE_SONG: 10
};

var WorkerTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2
};

var renderRequestData = {
    "seed": hashCode(songSeed),
    "strSeed": songSeed,
    "name": "Song",
    "sectionIndex": -1,
    "genInfo": {
        "minorScaleLikelihood": 1,
        "majorScaleLikelihood": 1,
        "timeSignature2Likelihood": 1,
        "timeSignature3Likelihood": 1,
        "timeSignature4Likelihood": 3,
        "electronicLikelihood": 1,
        "electricLikelihood": 1,
        "acousticLikelihood": 1,
        "strictBuildSongStructureLikelihoodMultiplier": 1,
        "buildSongStructureLikelihoodMultiplier": 1,
        "verseChorusSongStructureLikelihoodMultiplier": 1,
        "verseChorusBridgeSongStructureLikelihoodMultiplier": 1,
        "noMelodyPartSongStructureLikelihoodMultiplier": 1,
        "percussionFillProbabilities": [
            0.35
        ],
        "raiseLeadingInMinorProbabilities": [
            0.5
        ],
        "tonicizeLikelihoodMultipliers": [
            1
        ],
        "modulateLikelihoodMultiplier": 0.25,
        "simpleMixtureLikelihoods": [
            1
        ],
        "sus2ChordsLikelihoods": [
            1
        ],
        "sus4ChordsLikelihoods": [
            1
        ],
        "neighbourChordsLikelihoods": [
            1
        ],
        "passingChordsLikelihoods": [
            1
        ],
        "melodyMotifRythmCountIncreasePerIndex": 0.4,
        "melodyMotifRythmCountIncreaseOffsetRange": [
            0.5,
            1
        ],
        "bassMotifRythmCountIncreasePerIndex": 0.4,
        "bassMotifRythmCountIncreaseOffsetRange": [
            0.25,
            0.75
        ],
        "melodyMotifZone1Probabilities": [
            0.5
        ],
        "melodyMotifZone1TripletLikelihoods": [
            0.5
        ],
        "melodyMotifZone1DotFirstLikelihoods": [
            2
        ],
        "melodyMotifZone1DotSecondLikelihoods": [
            0.5
        ],
        "melodyMotifZone1DotNormalDotLikelihoods": [
            0.5
        ],
        "melodyMotifZone1NormalDotDotLikelihoods": [
            0.5
        ],
        "melodyMotifZone1DotDotNormalLikelihoods": [
            0.5
        ],
        "melodyMotifZone1StartPosRanges": [
            [
                0,
                0
            ]
        ],
        "melodyMotifZone1EndPosRanges": [
            [
                0.75,
                0.75
            ]
        ],
        "melodyMotifZone1StartEnds": [],
        "bassMotifZone1Probabilities": [
            0.5
        ],
        "bassMotifZone1TripletLikelihoods": [
            0.01
        ],
        "bassMotifZone1DotFirstLikelihoods": [
            2
        ],
        "bassMotifZone1DotSecondLikelihoods": [
            0.5
        ],
        "bassMotifZone1DotNormalDotLikelihoods": [
            0.5
        ],
        "bassMotifZone1NormalDotDotLikelihoods": [
            0.5
        ],
        "bassMotifZone1DotDotNormalLikelihoods": [
            0.5
        ],
        "bassMotifZone1StartPosRanges": [
            [
                0,
                0
            ]
        ],
        "bassMotifZone1EndPosRanges": [
            [
                0.75,
                0.75
            ]
        ],
        "bassMotifZone1StartEnds": [],
        "allInstrumentsDifferentProbability": 0.35,
        "adaptHarmonyRythmToTempo": true,
        "adaptHarmonyRythmToTimeSignature": true,
        "adaptSuspensionToTempo": true,
        "adaptMotifRythmsToTempo": true,
        "filterFEffectsProbMultiplier": 1,
        "filterBWEffectsProbMultiplier": 1,
        "panEffectsProbMultiplier": 1,
        "oddHarmonyRythmProbability": 0.01,
        "melodyShareProbabilities": [
            0.3
        ],
        "endSongTempoChangeProbability": 0.5,
        "endPhraseGroupTempoChangeProbabilities": [
            0
        ],
        "adaptTempoToRenderAmount": true,
        "tempoAdaptBias": 3,
        "tempoAdaptRandomMultiplier": 3,
        "useNaturalTempoChanges": true,
        "voiceLineSuspensionProbabilities": [
            0.5
        ],
        "songIntroProbability": 0.7,
        "songEndProbability": 0.5,
        "withinPhraseGroupSimilarRandomFraction": 0.35,
        "withinPhraseGroupSimilarBias": 0.55,
        "samePhraseGroupIndexSimilarRandomFraction": 0.25,
        "samePhraseGroupIndexSimilarBias": 0.5,
        "differentPhraseGroupIndexDifferentRandomFraction": 0.3,
        "differentPhraseGroupIndexDifferentBias": 0.25,
        "prefixGlueProbabilityMultiplier": 1,
        "postfixGlueProbabilityMultiplier": 1,
        "useMaxHarmonyElementLength": true,
        "prolongStaticLikelihoods": [
            2
        ],
        "prolongDynamicLikelihoods": [
            4
        ],
        "prolongDominantCadenceLikelihoods": [
            3
        ],
        "prolongTonicCadenceLikelihoods": [
            1
        ],
        "prolongHarmonyPartBiases": [
            20
        ],
        "prolongHarmonyPartRandomFractions": [
            50
        ],
        "tempoRange": [
            60,
            140
        ],
        "melodyShapeAmpRanges": [
            [
                6,
                12
            ]
        ],
        "melodyShapeBiasRanges": [
            [
                68,
                76
            ]
        ],
        "bassShapeAmpRanges": [
            [
                2,
                4
            ]
        ],
        "bassShapeBiasRanges": [
            [
                35,
                45
            ]
        ],
        "overwriteSongPartStructureRndInfos": false,
        "songPartStructureRndInfos": [],
        "phraseGroupTypes": [{
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 20
            },
            {
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 11
            },
            {
                "likelihood": 0.125,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 8
            },
            {
                "likelihood": 0.125,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 10
            },
            {
                "likelihood": 0.25,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 4
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 19
            },
            {
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 15
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 3
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 18
            },
            {
                "likelihood": 0.5,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 22
            },
            {
                "likelihood": 0.5,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 2
            }
        ],
        "modulatePhraseGroupTypes": [{
                "likelihood": 0.5,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 23
            },
            {
                "likelihood": 0.5,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 20
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 11
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 9
            },
            {
                "likelihood": 0.5,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 12
            }
        ],
        "majorDeceptiveRootRndInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 6
            },
            {
                "likelihood": 4,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 5
            },
            {
                "likelihood": 4,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 3
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 2
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 1
            }
        ],
        "minorDeceptiveRootRndInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 6
            },
            {
                "likelihood": 4,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 5
            },
            {
                "likelihood": 4,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 3
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 2
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "IntDataSample",
                "data": 1
            }
        ],
        "introGroupTypes": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 17
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 27
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 0
            }
        ],
        "endGroupTypes": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 17
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 27
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 0
            }
        ],
        "glueGroupTypes": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 17
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 27
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "PhraseGroupTypeDataSample",
                "data": 0
            }
        ],
        "majorModulationTargetInfos": [{
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 1
            },
            {
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 4
            },
            {
                "likelihood": 0.2,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 0
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 3
            }
        ],
        "minorModulationTargetInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 1
            },
            {
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 4
            },
            {
                "likelihood": 0.1,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 5
            },
            {
                "likelihood": 0.2,
                "active": true,
                "_constructorName": "ModulationTargetDataSample",
                "data": 3
            }
        ],
        "electronicMelodyInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 4
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 5
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 62
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 63
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 81
            }
        ],
        "electronicInnerFastInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 4
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 5
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 2
            }
        ],
        "electronicInnerSlowInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 94
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 93
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 88
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 90
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 95
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 50
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 51
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 89
            }
        ],
        "electronicBassInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 38
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 38
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 39
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 39
            }
        ],
        "electricMelodyInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 30
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 2
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 17
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 18
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 62
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 63
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 4
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 5
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 29
            }
        ],
        "electricInnerFastInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 30
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 2
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 26
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 28
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 4
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 5
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 29
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 62
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 63
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 54
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 27
            }
        ],
        "electricInnerSlowInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 30
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 29
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 62
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 63
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 54
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 92
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 94
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 93
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 88
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 90
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 95
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 50
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 51
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 89
            }
        ],
        "electricBassInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 2
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 33
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 34
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 38
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 39
            }
        ],
        "acousticMelodyInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 0
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 1
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 24
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 25
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 46
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 42
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 73
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 72
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 45
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 74
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 40
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 68
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 20
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 18
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 41
            }
        ],
        "acousticInnerFastInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 0
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 1
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 24
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 25
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 46
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 42
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 73
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 72
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 45
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 74
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 40
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 68
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 20
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 18
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 57
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 41
            }
        ],
        "acousticInnerSlowInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 48
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 49
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 53
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 52
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 19
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 71
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 7
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 69
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 68
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 79
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 75
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 20
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 18
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 42
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 73
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 72
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 74
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 40
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 41
            }
        ],
        "acousticBassInstrInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 0
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 1
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 35
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 36
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 37
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiProgramDataSample",
                "data": 32
            }
        ],
        "bassDrumRndInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 43
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 41
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 61
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 64
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 66
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 36
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 35
            }
        ],
        "snareRndInfos": [{
                "likelihood": 30,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 38
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 39
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 50
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 48
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 47
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 45
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 63
            },
            {
                "likelihood": 30,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 40
            }
        ],
        "crashRndInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 52
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 55
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 49
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 57
            }
        ],
        "rideRndInfos": [{
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 70
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 81
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 80
            },
            {
                "likelihood": 1,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 75
            },
            {
                "likelihood": 2,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 53
            },
            {
                "likelihood": 5,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 37
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 51
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 59
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 44
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 42
            },
            {
                "likelihood": 20,
                "active": true,
                "_constructorName": "MidiDrumDataSample",
                "data": 46
            }
        ],
        "setScaleBaseNote": false,
        "scaleBaseNote": 60,
        "overwriteSongPartStructure": false,
        "songPartStructure": [{
            "partType": 0,
            "harmonyRythmCountOverrides": [],
            "harmonyTotalLengthOverrides": [],
            "overridePhraseGroupType": false,
            "phraseGroupType": 19,
            "overrideMajorModulationTarget": false,
            "majorModulationTarget": 3,
            "overrideMinorModulationTarget": false,
            "minorModulationTarget": 3,
            "overrideScaleBaseNote": false,
            "scaleBaseNote": 60,
            "overrideScaleType": false,
            "scaleType": 1,
            "harmonyElementIndices": [],
            "customMelodyCurveIndices": [],
            "customBassCurveIndices": [],
            "extraMelodyRenderElementIndices": [],
            "extraInner1RenderElementIndices": [],
            "extraInner2RenderElementIndices": [],
            "extraBassRenderElementIndices": [],
            "extraPercussionRenderElementIndices": [],
            "melodyShapeIndexOverride": [],
            "bassShapeIndexOverride": [],
            "harmonyIndexOverride": [],
            "harmonyRythmIndexOverride": [],
            "suspendIndexOverride": [],
            "melodyChannelDistributionIndexOverride": [],
            "inner1ChannelDistributionIndexOverride": [],
            "inner2ChannelDistributionIndexOverride": [],
            "bassChannelDistributionIndexOverride": [],
            "melodyMotifDistributionIndexOverride": [],
            "inner1MotifDistributionIndexOverride": [],
            "inner2MotifDistributionIndexOverride": [],
            "bassMotifDistributionIndexOverride": [],
            "percussionMotifDistributionIndexOverride": [],
            "percussionFillMotifDistributionIndexOverride": [],
            "harmonyExtraIndexOverride": [],
            "renderAmountIndexOverride": [],
            "tempoIndexOverride": [],
            "sequentialTempoChangeIndexOverride": [],
            "parallelTempoChangeIndexOverride": [],
            "sequentialMelodyEffectChangeIndexOverride": [],
            "sequentialInner1EffectChangeIndexOverride": [],
            "sequentialInner2EffectChangeIndexOverride": [],
            "sequentialBassEffectChangeIndexOverride": [],
            "sequentialPercussionEffectChangeIndexOverride": [],
            "strength": 0,
            "prefixProbsOverride": [],
            "postfixProbsOverride": [],
            "majorGroupModulationTarget": -1,
            "minorGroupModulationTarget": -1,
            "melodyRenderAmountOverride": [],
            "inner1RenderAmountOverride": [],
            "inner2RenderAmountOverride": [],
            "bassRenderAmountOverride": [],
            "percussionRenderAmountOverride": [],
            "prefixInfoOverrides": [],
            "postfixInfoOverrides": [],
            "_constructorName": "SongPartStructureInfo"
        }],
        "songPartTypeOverrideInfos": [],
        "harmonyRythmMeasureCountOverrides": [],
        "harmonyRythmNoteCountOverrides": [],
        "harmonyRythmDensityCurveAmplitudeOverrides": [],
        "harmonyRythmDensityCurveFrequencyOverrides": [],
        "melodyMotifRythmNoteCountOverrides": [],
        "bassMotifRythmNoteCountOverrides": [],
        "overwriteMelodyInstruments": false,
        "melodyInstruments": [
            0,
            46,
            25
        ],
        "overwriteInner1Instruments": false,
        "inner1Instruments": [
            0,
            46,
            25
        ],
        "overwriteInner2Instruments": false,
        "inner2Instruments": [
            0,
            46,
            25
        ],
        "overwriteBassInstruments": false,
        "bassInstruments": [
            0,
            32,
            43
        ],
        "percussionFillMotifIndicesOverride": [],
        "addBassDrumsOverride": [],
        "addSnareDrumsOverride": [],
        "addCrashDrumsOverride": [],
        "addRideDrumsOverride": [],
        "overrideBassDrumNote": false,
        "bassDrumNote": 36,
        "overrideSnareDrumNote": false,
        "snareDrumNote": 38,
        "overrideCrashDrumNote": false,
        "crashDrumNote": 49,
        "overrideRideDrumNotes": false,
        "rideDrumNotes": [
            42,
            46,
            51
        ],
        "harmonyElements": [],
        "customMelodyCurveInfos": [],
        "customBassCurveInfos": [],
        "exportVolume": true,
        "exportEffects": true,
        "mergeChannels": false,
        "exportChordsToNewChannel": false,
        "melodyVolumeMultipliers": [
            1
        ],
        "inner1VolumeMultipliers": [
            1
        ],
        "inner2VolumeMultipliers": [
            1
        ],
        "bassVolumeMultipliers": [
            1
        ],
        "percussionVolumeMultiplier": 1,
        "melodyReverbSends": [
            1
        ],
        "melodyChorusSends": [
            0.3
        ],
        "bassReverbSends": [
            0.1
        ],
        "bassChorusSends": [
            0.1
        ],
        "inner1ReverbSends": [
            0.1
        ],
        "inner1ChorusSends": [
            0.1
        ],
        "inner2ReverbSends": [
            0.1
        ],
        "inner2ChorusSends": [
            0.1
        ],
        "percussionReverbSend": 0,
        "percussionChorusSend": 0
    }
}

// need
function exportMidi() {
    //console.log("starting midi export...");
    //var renderRequestData = {seed: seed, strSeed: songSettings.seed, name: songSettings.name, sectionIndex: -1, genInfo: genInfo};

    var params = {
        taskType: AsyncServerChildTaskType.EXPORT_MIDI,
        content: renderRequestData,
        caption: "Exporting midi...",
        doneCaption: "Done!",
        resultDivId: "midi-export-result-div",
        id: "task" + asyncOperationCounter
    };

    var task = null;
    //params.taskType = WorkerTaskType.EXPORT_MIDI;
    
    
    //task = new AsyncWorkerTask(params);

    var midiData = returnMidiData(params);
    //console.log(midiData);

    var fileString = getFileAsString(midiData);
    //console.log(blob);
    //var resultUrl = window.URL.createObjectURL(blob);
    //$("#resultUrl").attr("href", resultUrl);

    return fileString;
}