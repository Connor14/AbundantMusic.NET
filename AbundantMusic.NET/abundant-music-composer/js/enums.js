'use strict';

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

var SoundFontType = {
    STANDARD_LIGHT: 0,
    STANDARD_HEAVY: 1,
    SNES_STYLE: 2,
    GXSCC_STYLE: 3
};

var ControlChannelDatatype = {
    DOUBLE: 0,
    INTEGER: 1,
    BOOLEAN: 2
};

var ControlChannelControlWriteMode = {
    NONE: 0,
    SET_CONTROL: 1
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

var Mix1DType = {
    FUBAR: 0
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

var SectionTempoMode = {
    CONSTANT: 0,
    CHANGE_CONTROL_CHANNEL: 1,
    CONTROL_CHANNEL: 2
};

var MotifZoneFillerLengthMode = {
    ABSOLUTE: 0,
    RELATIVE_MULT: 1,
    RELATIVE_ADD: 2
};

var FillerNoteLengthMode = {
    INDEPENDENT: 0,
    MATCH: 1
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

var HarmonyLengthMode = {
    COUNT_AND_LENGTH_PATTERN: 0,
    COUNT_AND_RYTHM: 1,
    RYTHM_ONLY: 2
};

var PhraseHarmonyElementShorteningMode = {
    BEATS: 0
};

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

var StaticHarmonyMode = {
    BASE: 0,
    AUXILIARY: 1,
    BASE_NEIGHBOUR: 2,
    AUXILIARY_NEIGHBOUR: 3,
    PASSING_TOWARDS_BASE: 4,
    PASSING_TOWARDS_AUXILIARY: 5,
    ACCENTED_64_BASE: 6
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

var SuspendVoiceLinePlannerConstraintMode = {
    PITCH_CLASSES: 0
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

var MelodyOffsetLevel = {
    VERY_LOW: -2,
    LOW: -1,
    MIDDLE: 0,
    HIGH: 1,
    VERY_HIGH: 2
};

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

