
var ChordType = {
    TRIAD: 0,
    SEVENTH: 1,
    SUS2: 2,
    SUS4: 3,
    SUS2_SEVENTH: 4,
    SUS4_SEVENTH: 5,
    NINTH: 6,
    CUSTOM: 7,
    toString: function (a) {
        switch (a) {
            case ChordType.CUSTOM:
                return "Custom";
            case ChordType.SEVENTH:
                return "Seventh";
            case ChordType.SUS2:
                return "Sus2";
            case ChordType.SUS2_SEVENTH:
                return "Sus2 Seventh";
            case ChordType.SUS4:
                return "Sus4";
            case ChordType.SUS4_SEVENTH:
                return "Sus4 Seventh";
            case ChordType.TRIAD:
                return "Triad";
            case ChordType.NINTH:
                return "Ninth"
        }
        return "Unknown chord type " + a
    }
};
addPossibleValuesFunction(ChordType, ChordType.TRIAD, ChordType.CUSTOM);
var SimpleScaleType = {
    MAJOR: 1,
    NATURAL_MINOR: 2,
    toString: function (a) {
        switch (a) {
            case SimpleScaleType.MAJOR:
                return "Major";
            case SimpleScaleType.NATURAL_MINOR:
                return "Minor"
        }
        return "Unknown scale type " + a
    }
};
addPossibleValuesFunction(SimpleScaleType, SimpleScaleType.MAJOR, SimpleScaleType.NATURAL_MINOR);
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
        return ScaleType.MAJOR_SCALE_STEPS
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
addPossibleValuesFunction(ScaleType, ScaleType.CUSTOM, ScaleType.WHOLE_NOTE);
var IndexType = {
    MIDI_NOTE: 0,
    SCALE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3,
    toString: function (a) {
        switch (a) {
            case IndexType.MIDI_NOTE:
                return "Midi note";
            case IndexType.SCALE:
                return "Scale";
            case IndexType.CHORD_BASS:
                return "Chord bass";
            case IndexType.CHORD_ROOT:
                return "Chord root"
        }
        return "Unknown index type " + a
    }
};
addPossibleValuesFunction(IndexType, IndexType.MIDI_NOTE, IndexType.CHORD_ROOT);
var SnapType = {
    NONE: 0,
    SCALE: 1,
    CHORD: 2,
    toString: function (a) {
        switch (a) {
            case SnapType.NONE:
                return "None";
            case SnapType.CHORD:
                return "Chord";
            case SnapType.SCALE:
                return "Scale"
        }
        return "Unknown snap type " + a
    }
};
addPossibleValuesFunction(SnapType, SnapType.NONE, SnapType.CHORD);
var FrequencyUnit = {
    HERTZ: 0,
    MIDI_NOTE: 1,
    toString: function (a) {
        switch (a) {
            case FrequencyUnit.HERTZ:
                return "Hertz";
            case FrequencyUnit.MIDI_NOTE:
                return "Midi note"
        }
        return "Unknown frequency unit " + a
    }
};
addPossibleValuesFunction(FrequencyUnit, FrequencyUnit.HERTZ, FrequencyUnit.MIDI_NOTE);
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
    },
    toString: function (a) {
        switch (a) {
            case CyclesUnit.CYCLES_PER_PERIOD:
                return "Cycles per period";
            case CyclesUnit.CYCLES_PER_BEAT:
                return "Cycles per beat";
            case CyclesUnit.CYCLES_PER_MEASURE:
                return "Cycles per measure";
            case CyclesUnit.CYCLES_PER_HARMONY:
                return "Cycles per harmony"
        }
        return "Unknown cycles unit " + a
    }
};
addPossibleValuesFunction(CyclesUnit, CyclesUnit.CYCLES_PER_PERIOD, CyclesUnit.CYCLES_PER_HARMONY);

var SnapMetrics = {
    FLOOR: 0,
    CEIL: 1,
    ROUND: 2,
    toString: function (a) {
        switch (a) {
            case SnapMetrics.CEIL:
                return "Ceil";
            case SnapMetrics.FLOOR:
                return "Floor";
            case SnapMetrics.ROUND:
                return "Round"
        }
        return "Unknown snap metrics " + a
    },
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
addPossibleValuesFunction(SnapMetrics, SnapMetrics.FLOOR, SnapMetrics.ROUND);
var VerticalRelativeType = {
    MIDI_ZERO: 0,
    SCALE_BASE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3,
    VOICE_LINE: 4,
    NOTE: 5,
    toString: function (a) {
        switch (a) {
            case VerticalRelativeType.MIDI_ZERO:
                return "Midi zero";
            case VerticalRelativeType.SCALE_BASE:
                return "Scale base";
            case VerticalRelativeType.CHORD_BASS:
                return "Chord bass";
            case VerticalRelativeType.CHORD_ROOT:
                return "Chord root";
            case VerticalRelativeType.VOICE_LINE:
                return "Voice line";
            case VerticalRelativeType.NOTE:
                return "Note"
        }
        return "Unknown type " + a
    },
    sample: function (a) {
        return Math.min(4, Math.max(0, Math.floor(a.random() * 5)))
    }
};
addPossibleValuesFunction(VerticalRelativeType, VerticalRelativeType.MIDI_ZERO, VerticalRelativeType.NOTE);
var IndexBorderMode = {
    END: 0,
    RESTART: 1,
    MIRROR: 2,
    CLAMP: 3,
    toString: function (a) {
        switch (a) {
            case IndexBorderMode.END:
                return "End";
            case IndexBorderMode.RESTART:
                return "Restart";
            case IndexBorderMode.MIRROR:
                return "Mirror";
            case IndexBorderMode.CLAMP:
                return "Clamp"
        }
    },
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
                return b % c
        }
        return b
    }
};
addPossibleValuesFunction(IndexBorderMode, IndexBorderMode.END, IndexBorderMode.CLAMP);
var HorizontalRelativeType = {
    PREVIOUS_NOTE: 0,
    NEXT_NOTE: 1,
    PREVIOUS_VOICE_LINE_ELEMENT: 2,
    NEXT_VOICE_LINE_ELEMENT: 3,
    toString: function (a) {
        switch (a) {
            case HorizontalRelativeType.NEXT_NOTE:
                return "Next note";
            case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                return "Next voice line element";
            case HorizontalRelativeType.PREVIOUS_NOTE:
                return "Previous note";
            case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                return "Previous voice line element"
        }
        return "Unknown horiz. relative type " + a
    }
};
addPossibleValuesFunction(HorizontalRelativeType, HorizontalRelativeType.PREVIOUS_NOTE, VerticalRelativeType.NEXT_VOICE_LINE_ELEMENT);
var OffsetType = {
    CHORD: 0,
    SCALE: 1,
    HALF_STEP: 2,
    OCTAVE: 3,
    CHORD_TRIAD_ONLY: 4,
    CHORD_SEVENTH_ONLY: 5,
    toString: function (a) {
        switch (a) {
            case OffsetType.CHORD:
                return "Chord";
            case OffsetType.SCALE:
                return "Scale";
            case OffsetType.HALF_STEP:
                return "Half step";
            case OffsetType.OCTAVE:
                return "Octave";
            case OffsetType.CHORD_TRIAD_ONLY:
                return "Chord triad only";
            case OffsetType.CHORD_SEVENTH_ONLY:
                return "Chord seventh only"
        }
        return "Unknown offset type " + a
    }
};
addPossibleValuesFunction(OffsetType, OffsetType.CHORD, OffsetType.CHORD_SEVENTH_ONLY);
var LengthAndCountUnit = {
    LENGTH_PERCENT: 0,
    COUNT_PERCENT: 1,
    LENGTH: 2,
    COUNT: 3,
    toString: function (a) {
        switch (a) {
            case LengthAndCountUnit.LENGTH:
                return "Length";
            case LengthAndCountUnit.COUNT:
                return "Count";
            case LengthAndCountUnit.LENGTH_PERCENT:
                return "Length percent";
            case LengthAndCountUnit.COUNT_PERCENT:
                return "Count percent"
        }
        return "Unknown length and count unit"
    }
};
addPossibleValuesFunction(LengthAndCountUnit, LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit.COUNT);
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
    toString: function (a) {
        switch (a) {
            case CountUnit.PLAIN:
                return "Plain";
            case CountUnit.HARMONY_BEATS:
                return "Harmony beats";
            case CountUnit.HARMONY_ELEMENT_BEATS:
                return "Harmony element beats";
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return "Harmony element count";
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                return "Harmony element measures";
            case CountUnit.HARMONY_MEASURES:
                return "Harmony measures";
            case CountUnit.PHRASE_ELEMENT_COUNT:
                return "Phrase element count";
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                return "Plain + Harmony beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                return "Plain + Harmony element beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return "Plain + Harmony element count";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                return "Plain + Harmony element measures";
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                return "Plain + Harmony measures"
        }
        return "Unknown count unit " + a
    },
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
addPossibleValuesFunction(CountUnit, CountUnit.PLAIN, CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT);
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
    PHRASE: 20,
    toString: function (a) {
        switch (a) {
            case PositionUnit.BEATS:
                return "Beats";
            case PositionUnit.BEATS_PLUS_MEASURE:
                return "Beats plus one measure";
            case PositionUnit.BEATS_PLUS_HARMONY:
                return "Beats plus harmony length";
            case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
                return "Beats plus harmony element length";
            case PositionUnit.BEAT_EIGHTHS:
                return "Beat eighths";
            case PositionUnit.BEAT_FIFTHS:
                return "Beat fifths";
            case PositionUnit.BEAT_FOURTHS:
                return "Beat fourths";
            case PositionUnit.BEAT_NINTHS:
                return "Beat ninths";
            case PositionUnit.BEAT_SEVENTHS:
                return "Beat sevenths";
            case PositionUnit.BEAT_SIXTHS:
                return "Beat sixths";
            case PositionUnit.BEAT_THIRDS:
                return "Beat thirds";
            case PositionUnit.EIGHTH_NOTES:
                return "Eighth notes";
            case PositionUnit.HALF_NOTES:
                return "Half notes";
            case PositionUnit.MEASURES:
                return "Measures";
            case PositionUnit.QUARTER_NOTES:
                return "Quarter notes";
            case PositionUnit.SIXTEENTH_NOTES:
                return "Sixteenth notes";
            case PositionUnit.WHOLE_NOTES:
                return "Whole notes";
            case PositionUnit.HARMONY_INDEX:
                return "Harmony index";
            case PositionUnit.HARMONY:
                return "Harmony";
            case PositionUnit.HARMONY_ELEMENTS:
                return "Harmony elements";
            case PositionUnit.PHRASE:
                return "Phrase"
        }
        return "Unknown position unit " + a
    }
};
addPossibleValuesFunction(PositionUnit, PositionUnit.MEASURES, PositionUnit.PHRASE);

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
    CHROMATIC_OSCILLATION: 25,
    toString: function (a) {
        switch (a) {
            case PhraseHarmonyElementType.CHROMATIC_OSCILLATION:
                return "Chromatic oscillation";
            case PhraseHarmonyElementType.INCOMPLETE_NO_DOMINANT:
                return "Incomplete no dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                return "Complete tonicize";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Complete lengthen final tonic";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT:
                return "Complete lengthen cadence dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                return "Complete tonicize imperfect";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                return "Chromatic transition modulate";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                return "Chromatic transition tonicize";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_INCOMPLETE:
                return "Chromatic transition incomplete";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_COMPLETE:
                return "Chromatic transition complete";
            case PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT:
                return "Antecedent consequent";
            case PhraseHarmonyElementType.COMPLETE:
                return "Complete";
            case PhraseHarmonyElementType.COMPLETE_IMPERFECT:
                return "Complete imperfect";
            case PhraseHarmonyElementType.INCOMPLETE:
                return "Incomplete";
            case PhraseHarmonyElementType.INCOMPLETE_INITIAL:
                return "Incomplete initial";
            case PhraseHarmonyElementType.DECEPTIVE:
                return "Deceptive";
            case PhraseHarmonyElementType.PROLONGED_TONIC:
                return "Prolonged tonic";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE:
                return "Prolonged tonic complete";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE_IMPERFECT:
                return "Prolonged tonic imperfect";
            case PhraseHarmonyElementType.PROLONGED_TONIC_INCOMPLETE:
                return "Prolonged tonic incomplete";
            case PhraseHarmonyElementType.COMPLETE_MODULATE:
                return "Complete modulate";
            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                return "Complete modulate imperfect";
            case PhraseHarmonyElementType.CONSEQUENT:
                return "Consequent";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT:
                return "Prolonged dominant";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE:
                return "Prolonged dominant cadence";
            case PhraseHarmonyElementType.COMPLETE_PLAGIAL:
                return "Complete plagial"
        }
        return "Unknown phrase harmony element type " + a
    }
};
addPossibleValuesFunction(PhraseHarmonyElementType, PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType.CHROMATIC_OSCILLATION);

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
    PREDEFINED_CURVE_TYPE: 11,
    toString: function (a) {
        switch (a) {
            case EnumType.CHORD_TYPE:
                return "ChordType";
            case EnumType.COUNT_UNIT:
                return "CountUnit";
            case EnumType.HORIZONTAL_RELATIVE_TYPE:
                return "HorizontalRelativeType";
            case EnumType.INDEX_BORDER_MODE:
                return "IndexBorderMode";
            case EnumType.INDEX_TYPE:
                return "IndexType";
            case EnumType.OFFSET_TYPE:
                return "OffsetType";
            case EnumType.POSITION_UNIT:
                return "PositionUnit";
            case EnumType.SCALE_TYPE:
                return "ScaleType";
            case EnumType.SNAP_METRICS:
                return "SnapMetrics";
            case EnumType.SNAP_TYPE:
                return "SnapType";
            case EnumType.VERTICAL_RELATIVE_TYPE:
                return "VerticalRelativeType";
            case EnumType.PREDEFINED_CURVE_TYPE:
                return "PredefinedCurveType"
        }
        return "Unknown enum type " + a
    }
};
addPossibleValuesFunction(EnumType, EnumType.POSITION_UNIT, EnumType.PREDEFINED_CURVE_TYPE);

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
    NAMED_NOTE: 9,
    toString: function (a) {
        switch (a) {
            case EditorIdReferenceType.CONTROL_CHANNEL:
                return "Control channel";
            case EditorIdReferenceType.CURVE:
                return "Curve";
            case EditorIdReferenceType.HARMONY:
                return "Harmony";
            case EditorIdReferenceType.MOTIF:
                return "Motif";
            case EditorIdReferenceType.NAMED_NOTE:
                return "Named note";
            case EditorIdReferenceType.PERCUSSION_MOTIF:
                return "Percussion motif";
            case EditorIdReferenceType.RENDER_CHANNEL:
                return "Render channel";
            case EditorIdReferenceType.RYTHM:
                return "Rythm";
            case EditorIdReferenceType.SECTION:
                return "Section";
            case EditorIdReferenceType.STRUCTURE:
                return "Structure"
        }
        return "Unknown id reference type " + a
    }
};

addPossibleValuesFunction(EditorIdReferenceType, EditorIdReferenceType.HARMONY, EditorIdReferenceType.NAMED_NOTE);
var SoundFontType = {
    STANDARD_LIGHT: 0,
    STANDARD_HEAVY: 1,
    SNES_STYLE: 2,
    GXSCC_STYLE: 3,
    getSamplesPrefix: function (a) {
        switch (a) {
            case SoundFontType.STANDARD_LIGHT:
                return "standard_light";
            case SoundFontType.STANDARD_HEAVY:
                return "standard_heavy";
            case SoundFontType.SNES_STYLE:
                return "snes_style";
            case SoundFontType.GXSCC_STYLE:
                return "gxscc_style"
        }
        return "Unknown soundfont type " + a
    },
    toString: function (a) {
        switch (a) {
            case SoundFontType.STANDARD_LIGHT:
                return "Standard (light)";
            case SoundFontType.STANDARD_HEAVY:
                return "Standard (heavy)";
            case SoundFontType.SNES_STYLE:
                return "SNES Style";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC Style"
        }
        return "Unknown soundfont type " + a
    },
    toShortString: function (a) {
        switch (a) {
            case SoundFontType.STANDARD_LIGHT:
                return "Light";
            case SoundFontType.STANDARD_HEAVY:
                return "Heavy";
            case SoundFontType.SNES_STYLE:
                return "SNES";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC"
        }
        return "Unknown soundfont type " + a
    }
};
addPossibleValuesFunction(SoundFontType, SoundFontType.STANDARD_LIGHT, SoundFontType.GXSCC_STYLE);

var ControlChannelDatatype = {
    DOUBLE: 0,
    INTEGER: 1,
    BOOLEAN: 2,
    toString: function (a) {
        switch (a) {
            case ControlChannelDatatype.DOUBLE:
                return "Double";
            case ControlChannelDatatype.BOOLEAN:
                return "Boolean";
            case ControlChannelDatatype.INTEGER:
                return "Integer"
        }
        return "Unknown data type " + a
    }
};
addPossibleValuesFunction(ControlChannelDatatype, ControlChannelDatatype.DOUBLE, ControlChannelDatatype.BOOLEAN);

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
    },
    toString: function (a) {
        switch (a) {
            case NumericControlChannelMixMode.ADD:
                return "Add";
            case NumericControlChannelMixMode.MAX:
                return "Max";
            case NumericControlChannelMixMode.MEAN:
                return "Mean";
            case NumericControlChannelMixMode.MIN:
                return "Min";
            case NumericControlChannelMixMode.MULT:
                return "Mult";
            case NumericControlChannelMixMode.OVERWRITE_FIRST:
                return "Overwrite first";
            case NumericControlChannelMixMode.OVERWRITE_LAST:
                return "Overwrite last"
        }
        return "Unknown mix mode " + a
    }
};
addPossibleValuesFunction(NumericControlChannelMixMode, NumericControlChannelMixMode.ADD, NumericControlChannelMixMode.OVERWRITE_LAST);

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
    },
    toString: function (a) {
        switch (a) {
            case BooleanControlChannelMixMode.OR:
                return "Or";
            case BooleanControlChannelMixMode.AND:
                return "And";
            case BooleanControlChannelMixMode.NOR:
                return "Nor";
            case BooleanControlChannelMixMode.NAND:
                return "Nand";
            case BooleanControlChannelMixMode.XOR:
                return "Xor";
            case BooleanControlChannelMixMode.OVERWRITE_FIRST:
                return "Overwrite first";
            case BooleanControlChannelMixMode.OVERWRITE_LAST:
                return "Overwrite last"
        }
        return "Unknown mix mode " + a
    }
};
addPossibleValuesFunction(BooleanControlChannelMixMode, BooleanControlChannelMixMode.OR, BooleanControlChannelMixMode.OVERWRITE_LAST);

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
    PERLIN_NOISE: 14,
    toString: function (a) {
        switch (a) {
            case PredefinedCurveType.CONSTANT:
                return "Constant";
            case PredefinedCurveType.CONSTANT_NOISE:
                return "Constant noise";
            case PredefinedCurveType.COSINE:
                return "Cosine";
            case PredefinedCurveType.EXP:
                return "Exponential";
            case PredefinedCurveType.LINEAR:
                return "Linear";
            case PredefinedCurveType.LINEAR_NOISE:
                return "Linear noise";
            case PredefinedCurveType.QUADRATIC:
                return "Quadratic";
            case PredefinedCurveType.QUADRATIC_NOISE:
                return "Quadratic noise";
            case PredefinedCurveType.SAW:
                return "Saw";
            case PredefinedCurveType.SINE:
                return "Sine";
            case PredefinedCurveType.SQUARE:
                return "Square";
            case PredefinedCurveType.TRIANGLE:
                return "Triangle";
            case PredefinedCurveType.WHITE_NOISE:
                return "White noise";
            case PredefinedCurveType.CUBIC_NOISE:
                return "Cubic noise";
            case PredefinedCurveType.PERLIN_NOISE:
                return "Perlin noise"
        }
        return "Unknown type " + a
    }
};
addPossibleValuesFunction(PredefinedCurveType, PredefinedCurveType.LINEAR, PredefinedCurveType.PERLIN_NOISE);

var Mix1DType = {
    FUBAR: 0
};

var RenderElementCutHarmonyMode = {
    STOP: 0,
    CONTINUE_ADAPT: 1,
    CONTINUE_SAME: 2,
    toString: function (a) {
        switch (a) {
            case RenderElementCutHarmonyMode.STOP:
                return "Stop";
            case RenderElementCutHarmonyMode.CONTINUE_ADAPT:
                return "Continue adapt";
            case RenderElementCutHarmonyMode.CONTINUE_SAME:
                return "Continue same"
        }
        return "Unknown cut mode " + a
    }
};
addPossibleValuesFunction(RenderElementCutHarmonyMode, RenderElementCutHarmonyMode.STOP, RenderElementCutHarmonyMode.CONTINUE_SAME);
var NoteOverlapHarmonyMode = {
    SPLIT_REMOVE: 0,
    CONTINUE: 1,
    SPLIT_SNAP: 2,
    CONTINUE_OR_SPLIT_SNAP: 3,
    toString: function (a) {
        switch (a) {
            case NoteOverlapHarmonyMode.CONTINUE:
                return "Continue";
            case NoteOverlapHarmonyMode.SPLIT_REMOVE:
                return "Split Remove";
            case NoteOverlapHarmonyMode.SPLIT_SNAP:
                return "Split Snap";
            case NoteOverlapHarmonyMode.CONTINUE_OR_SPLIT_SNAP:
                return "Continue or split snap"
        }
        return "Unknown overlap mode " + a
    }
};
addPossibleValuesFunction(NoteOverlapHarmonyMode, NoteOverlapHarmonyMode.SPLIT_REMOVE, NoteOverlapHarmonyMode.CONTINUE_OR_SPLIT_SNAP);

var SplitStrategy = {
    NEVER: 0,
    HALVE: 1,
    DOT_FIRST: 2,
    DOT_SECOND: 3,
    TRIPLET: 4,
    DOT_NORMAL_DOT: 5,
    NORMAL_DOT_DOT: 6,
    DOT_DOT_NORMAL: 7,
    toString: function (a) {
        switch (a) {
            case SplitStrategy.DOT_DOT_NORMAL:
                return "Dot dot normal";
            case SplitStrategy.DOT_FIRST:
                return "Dot first";
            case SplitStrategy.DOT_NORMAL_DOT:
                return "Dot normal dot";
            case SplitStrategy.DOT_SECOND:
                return "Dot second";
            case SplitStrategy.HALVE:
                return "Halve";
            case SplitStrategy.NEVER:
                return "Never";
            case SplitStrategy.NORMAL_DOT_DOT:
                return "Normal dot dot";
            case SplitStrategy.TRIPLET:
                return "Triplet"
        }
        return "Unknown strategy " + a
    }
};
addPossibleValuesFunction(SplitStrategy, SplitStrategy.NEVER, SplitStrategy.DOT_DOT_NORMAL);
var DottedSplitStrategy = {
    NEVER: 0,
    LONGEST_FIRST: 1,
    LONGEST_LAST: 2,
    TWO_DOTTED: 3,
    toString: function (a) {
        switch (a) {
            case DottedSplitStrategy.LONGEST_FIRST:
                return "Longest first";
            case DottedSplitStrategy.LONGEST_LAST:
                return "Longest last";
            case DottedSplitStrategy.NEVER:
                return "Never";
            case DottedSplitStrategy.TWO_DOTTED:
                return "Two dotted"
        }
        return "Unknown strategy " + a
    }
};
addPossibleValuesFunction(DottedSplitStrategy, DottedSplitStrategy.NEVER, DottedSplitStrategy.TWO_DOTTED);
var TripletSplitStrategy = {
    NEVER: 0,
    HALVE: 1,
    toString: function (a) {
        switch (a) {
            case TripletSplitStrategy.HALVE:
                return "Halve";
            case TripletSplitStrategy.NEVER:
                return "Never"
        }
        return "Unknown strategy " + a
    }
};
addPossibleValuesFunction(TripletSplitStrategy, TripletSplitStrategy.NEVER, TripletSplitStrategy.HALVE);

var NoteRythmElementLengthType = {
    NORMAL: 0,
    DOT: 1,
    TRIPLET: 2,
    toString: function (a) {
        switch (a) {
            case NoteRythmElementLengthType.NORMAL:
                return "Normal";
            case NoteRythmElementLengthType.DOT:
                return "Dotted";
            case NoteRythmElementLengthType.TRIPLET:
                return "Triplet"
        }
        return "Unknown type " + a
    },
    possibleValues: null,
    getPossibleValues: function () {
        if (!NoteRythmElementLengthType.possibleValues) {
            NoteRythmElementLengthType.possibleValues = [];
            for (var a = NoteRythmElementLengthType.NORMAL; a <= NoteRythmElementLengthType.TRIPLET; a++) {
                NoteRythmElementLengthType.possibleValues.push(a)
            }
        }
        return NoteRythmElementLengthType.possibleValues
    }
};

var SectionTempoMode = {
    CONSTANT: 0,
    CHANGE_CONTROL_CHANNEL: 1,
    CONTROL_CHANNEL: 2
};

var MotifZoneFillerLengthMode = {
    ABSOLUTE: 0,
    RELATIVE_MULT: 1,
    RELATIVE_ADD: 2,
    toString: function (a) {
        switch (a) {
            case MotifZoneFillerLengthMode.ABSOLUTE:
                return "Absolute";
            case MotifZoneFillerLengthMode.RELATIVE_ADD:
                return "Relative add";
            case MotifZoneFillerLengthMode.RELATIVE_MULT:
                return "Relative mult"
        }
        return "Unknown length mode " + a
    }
};
addPossibleValuesFunction(MotifZoneFillerLengthMode, MotifZoneFillerLengthMode.ABSOLUTE, MotifZoneFillerLengthMode.RELATIVE_ADD);

var FillerNoteLengthMode = {
    INDEPENDENT: 0,
    MATCH: 1
};

var AdaptiveVerticalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1,
    CURVE: 2,
    toString: function (a) {
        switch (a) {
            case AdaptiveVerticalDomainType.ENUMERABLE:
                return "Enumerable";
            case AdaptiveVerticalDomainType.RANGE:
                return "Range";
            case AdaptiveVerticalDomainType.CURVE:
                return "Curve"
        }
        return "Unknown ad. vert. dom. type " + a
    }
};
addPossibleValuesFunction(AdaptiveVerticalDomainType, AdaptiveVerticalDomainType.ENUMERABLE, AdaptiveVerticalDomainType.CURVE);
var AdaptiveHorizontalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1,
    toString: function (a) {
        switch (a) {
            case AdaptiveHorizontalDomainType.ENUMERABLE:
                return "Enumerable";
            case AdaptiveHorizontalDomainType.RANGE:
                return "Range"
        }
        return "Unknown ad. horiz. dom. type " + a
    }
};
addPossibleValuesFunction(AdaptiveHorizontalDomainType, AdaptiveHorizontalDomainType.ENUMERABLE, AdaptiveHorizontalDomainType.RANGE);

var PercussionMotifMode = {
    RYTHM_AND_ZONES: 0,
    RYTHM_AND_RENDER_PATTERN: 1,
    ELEMENTS: 2,
    toString: function (a) {
        switch (a) {
            case PercussionMotifMode.ELEMENTS:
                return "Elements";
            case PercussionMotifMode.RYTHM_AND_RENDER_PATTERN:
                return "Rythm and render pattern";
            case PercussionMotifMode.RYTHM_AND_ZONES:
                return "Rythm and zones"
        }
        return "Unknown percussion motif mode " + a
    }
};
addPossibleValuesFunction(PercussionMotifMode, PercussionMotifMode.RYTHM_AND_ZONES, PercussionMotifMode.ELEMENTS);

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
    FILL_EIGHTS_8: 30,
    toString: function (a) {
        switch (a) {
            case PredefinedPercussionMotifType.FILL_EIGHTS_1:
                return "Fill eights 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_2:
                return "Fill eights 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_3:
                return "Fill eights 3 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_4:
                return "Fill eights 4 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_5:
                return "Fill eights 5 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_6:
                return "Fill eights 6 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_7:
                return "Fill eights 7 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_8:
                return "Fill eights 8 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
                return "Fill quarter triplet 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
                return "Fill quarter triplet 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
                return "Fill quarter triplet 3 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
                return "Fill dotted quarter 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
                return "Fill dotted quarter 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
                return "Fill dotted quarter 3 (two measures)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
                return "Fill dotted quarter 4 (two measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_1:
                return "Fill quarter 1 (one measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_2:
                return "Fill quarter 2 (one measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_3:
                return "Fill quarter 3 (two measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_4:
                return "Fill quarter 4 (one measures)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_1:
                return "Rock standard 1 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_2:
                return "Rock standard 2 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_3:
                return "Rock standard 3 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_4:
                return "Rock standard 4 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_5:
                return "Rock standard 5 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_6:
                return "Rock standard 6 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_7:
                return "Rock standard 7 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_8:
                return "Rock standard 8 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_9:
                return "Rock standard 9 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_1:
                return "March standard 1 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_2:
                return "March standard 2 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_3:
                return "March standard 3 (one measure)"
        }
        return "Unknown predefined type " + a
    }
};
addPossibleValuesFunction(PredefinedPercussionMotifType, PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1, PredefinedPercussionMotifType.FILL_EIGHTS_8);

var HarmonyLengthMode = {
    COUNT_AND_LENGTH_PATTERN: 0,
    COUNT_AND_RYTHM: 1,
    RYTHM_ONLY: 2,
    toString: function (a) {
        switch (a) {
            case HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN:
                return "Count and length pattern";
            case HarmonyLengthMode.COUNT_AND_RYTHM:
                return "Count and rythm";
            case HarmonyLengthMode.RYTHM_ONLY:
                return "Rythm only"
        }
        return "Unknown length mode " + a
    }
};
addPossibleValuesFunction(HarmonyLengthMode, HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN, HarmonyLengthMode.RYTHM_ONLY);

var PhraseHarmonyElementShorteningMode = {
    BEATS: 0,
    toString: function (a) {
        switch (a) {
            case PhraseHarmonyElementShorteningMode.BEATS:
                return "Beats"
        }
        return "Unknown phrase harmony element shortening mode " + a
    }
};
addPossibleValuesFunction(PhraseHarmonyElementShorteningMode, PhraseHarmonyElementShorteningMode.BEATS, PhraseHarmonyElementShorteningMode.BEATS);

var HarmonyStepLengthType = {
    HARMONY_STEPS: 0,
    HARMONY_LENGTH_PLUS_STEPS: 1,
    toString: function (a) {
        switch (a) {
            case HarmonyStepLengthType.HARMONY_STEPS:
                return "Harmony steps";
            case HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS:
                return "Harmony steps plus harmony length"
        }
        return "Unknown step length type " + a
    },
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
addPossibleValuesFunction(HarmonyStepLengthType, HarmonyStepLengthType.HARMONY_STEPS, HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS);

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
    },
    toString: function (a) {
        switch (a) {
            case DynamicHarmonyModulationTarget.DOMINANT:
                return "Dominant";
            case DynamicHarmonyModulationTarget.MEDIANT:
                return "Mediant";
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return "Subdominant";
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return "Submediant";
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return "Subtonic";
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return "Supertonic";
            case DynamicHarmonyModulationTarget.NONE:
                return "None"
        }
        return "Unknown modulation target " + a
    }
};
addPossibleValuesFunction(DynamicHarmonyModulationTarget, DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget.SUBTONIC);
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
    toString: function (a) {
        switch (a) {
            case AppliedChordType.V:
                return "V";
            case AppliedChordType.V42:
                return "V42";
            case AppliedChordType.V43:
                return "V43";
            case AppliedChordType.V65:
                return "V65";
            case AppliedChordType.V6:
                return "V6";
            case AppliedChordType.V7:
                return "V7";
            case AppliedChordType.VII:
                return "VII";
            case AppliedChordType.VII6:
                return "VII6";
            case AppliedChordType.VII7:
                return "VII7"
        }
        return "Unknown applied chord type " + a
    }
};
addPossibleValuesFunction(AppliedChordType, AppliedChordType.V, AppliedChordType.VII7);
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
    },
    toString: function (a) {
        switch (a) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return "All controllers off";
            case MidiControllerType.ALL_NOTES_OFF:
                return "All notes off";
            case MidiControllerType.ALL_SOUNDS_OFF:
                return "All sounds off";
            case MidiControllerType.BALANCE:
                return "Balance";
            case MidiControllerType.BALANCE_LSB:
                return "Balance LSB";
            case MidiControllerType.BANK_SELECT:
                return "Bank select";
            case MidiControllerType.BANK_SELECT_LSB:
                return "Bank select LSB";
            case MidiControllerType.BREATH_CONTROLLER:
                return "Breath controller";
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return "Breath controller LSB";
            case MidiControllerType.DAMPER_PEDAL:
                return "Damper pedal";
            case MidiControllerType.DATA_DECREMENT:
                return "Data decrement";
            case MidiControllerType.DATA_ENTRY_LSB:
                return "Data entry LSB";
            case MidiControllerType.DATA_ENTRY_MSB:
                return "Data entry MSB";
            case MidiControllerType.DATA_INCREMENT:
                return "Data increment";
            case MidiControllerType.EFFECTS_DEPTH_1:
                return "Effects depth 1";
            case MidiControllerType.EFFECTS_DEPTH_2:
                return "Effects depth 2";
            case MidiControllerType.EFFECTS_DEPTH_3:
                return "Effects depth 3";
            case MidiControllerType.EFFECTS_DEPTH_4:
                return "Effects depth 4";
            case MidiControllerType.EFFECTS_DEPTH_5:
                return "Effects depth 5";
            case MidiControllerType.EFFECT_CONTROL_1:
                return "Effect control 1";
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return "Effect control 1 LSB";
            case MidiControllerType.EFFECT_CONTROL_2:
                return "Effect control 2";
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return "Effect control 2 LSB";
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return "Expression controller";
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return "Expression controller LSB";
            case MidiControllerType.FOOT_CONTROLLER:
                return "Foot controller";
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return "Foot controller LSB";
            case MidiControllerType.GENERAL_PURPOSE_1:
                return "General purpose 1";
            case MidiControllerType.GENERAL_PURPOSE_2:
                return "General purpose 2";
            case MidiControllerType.GENERAL_PURPOSE_3:
                return "General purpose 3";
            case MidiControllerType.GENERAL_PURPOSE_4:
                return "General purpose 4";
            case MidiControllerType.GENERAL_PURPOSE_5:
                return "General purpose 5";
            case MidiControllerType.GENERAL_PURPOSE_6:
                return "General purpose 6";
            case MidiControllerType.GENERAL_PURPOSE_7:
                return "General purpose 7";
            case MidiControllerType.GENERAL_PURPOSE_8:
                return "General purpose 8";
            case MidiControllerType.HOLD_2:
                return "Hold 2";
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return "Legato footswitch";
            case MidiControllerType.LOCAL_KEYBOARD:
                return "Local keyboard";
            case MidiControllerType.MODULATION:
                return "Modulation";
            case MidiControllerType.MODULATION_LSB:
                return "Modulation LSB";
            case MidiControllerType.MONO_OPERATION:
                return "Mono operation";
            case MidiControllerType.NRPN_LSB:
                return "NRPN LSB";
            case MidiControllerType.NRPN_MSB:
                return "NRPN MSB";
            case MidiControllerType.OMNI_MODE_OFF:
                return "Omni mode off";
            case MidiControllerType.OMNI_MODE_ON:
                return "Omni mode on";
            case MidiControllerType.PAN:
                return "Pan";
            case MidiControllerType.PAN_LSB:
                return "Pan LSB";
            case MidiControllerType.POLY_OPERATION:
                return "Poly operation";
            case MidiControllerType.PORTAMENTO:
                return "Portamento";
            case MidiControllerType.PORTAMENTO_CONTROL:
                return "Portamento control";
            case MidiControllerType.PORTAMENTO_TIME:
                return "Portamento time";
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return "Portamento time LSB";
            case MidiControllerType.RPN_LSB:
                return "RPN LSB";
            case MidiControllerType.RPN_MSB:
                return "RPN MSB";
            case MidiControllerType.SOFT_PEDAL:
                return "Soft pedal";
            case MidiControllerType.SOSTENUTO:
                return "Sostenuto";
            case MidiControllerType.SOUND_CONTROLLER_1:
                return "Sound controller 1";
            case MidiControllerType.SOUND_CONTROLLER_2:
                return "Sound controller 2";
            case MidiControllerType.SOUND_CONTROLLER_3:
                return "Sound controller 3";
            case MidiControllerType.SOUND_CONTROLLER_4:
                return "Sound controller 4";
            case MidiControllerType.SOUND_CONTROLLER_5:
                return "Sound controller 5";
            case MidiControllerType.SOUND_CONTROLLER_6:
                return "Sound controller 6";
            case MidiControllerType.SOUND_CONTROLLER_7:
                return "Sound controller 7";
            case MidiControllerType.SOUND_CONTROLLER_8:
                return "Sound controller 8";
            case MidiControllerType.SOUND_CONTROLLER_9:
                return "Sound controller 9";
            case MidiControllerType.SOUND_CONTROLLER_10:
                return "Sound controller 10";
            case MidiControllerType.VOLUME:
                return "Volume";
            case MidiControllerType.VOLUME_LSB:
                return "Volume LSB"
        }
        return "Unknown midi controller type " + a
    }
};
addPossibleValuesFunction(MidiControllerType, MidiControllerType.BANK_SELECT, MidiControllerType.POLY_OPERATION);
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
    OPEN_TRIANGLE: 81,
    toString: function (a) {
        var b = " (" + a + ", " + toPitchClassString(a) + "" + Math.floor(a / 12) + ")";
        switch (a) {
            case MidiDrum.BASS_DRUM_1:
                return "Bass drum 1" + b;
            case MidiDrum.BASS_DRUM_2:
                return "Bass drum 2" + b;
            case MidiDrum.CABASA:
                return "Cabasa" + b;
            case MidiDrum.CHINESE_CYMBAL:
                return "Chinese cymbal" + b;
            case MidiDrum.CLAVES:
                return "Claves" + b;
            case MidiDrum.CLOSED_HIHAT:
                return "Closed hi-hat" + b;
            case MidiDrum.COWBELL:
                return "Cowbell" + b;
            case MidiDrum.CRASH_CYMBAL_1:
                return "Crash cymbal 1" + b;
            case MidiDrum.CRASH_CYMBAL_2:
                return "Crash cymbal 2" + b;
            case MidiDrum.HAND_CLAP:
                return "Hand clap" + b;
            case MidiDrum.HIGH_AGOGO:
                return "High agogo" + b;
            case MidiDrum.HIGH_BONGO:
                return "High bongo" + b;
            case MidiDrum.HIGH_TIMBALE:
                return "Timbale" + b;
            case MidiDrum.HIGH_TOM_1:
                return "High tom 1" + b;
            case MidiDrum.HIGH_TOM_2:
                return "High tom 2" + b;
            case MidiDrum.HIGH_WOOD_BLOCK:
                return "High wood block" + b;
            case MidiDrum.LONG_GUIRO:
                return "Long guiro" + b;
            case MidiDrum.LONG_WHISTLE:
                return "Long whistle" + b;
            case MidiDrum.LOW_AGOGO:
                return "Low agogo" + b;
            case MidiDrum.LOW_BONGO:
                return "Low bongo" + b;
            case MidiDrum.LOW_CONGA:
                return "Low conga" + b;
            case MidiDrum.LOW_TIMBALE:
                return "Low timbale" + b;
            case MidiDrum.LOW_TOM_1:
                return "Low tom 1" + b;
            case MidiDrum.LOW_TOM_2:
                return "Low tom 2" + b;
            case MidiDrum.LOW_WOOD_BLOCK:
                return "Low wood block" + b;
            case MidiDrum.MARACAS:
                return "Maracas" + b;
            case MidiDrum.MID_TOM_1:
                return "Mid tom 1" + b;
            case MidiDrum.MID_TOM_2:
                return "Mid tom 2" + b;
            case MidiDrum.MUTE_CUICA:
                return "Mute cuica" + b;
            case MidiDrum.MUTE_HIGH_CONGA:
                return "Mute high conga" + b;
            case MidiDrum.MUTE_TRIANGLE:
                return "Mute triangle" + b;
            case MidiDrum.OPEN_CUICA:
                return "Open cuica" + b;
            case MidiDrum.OPEN_HIGH_CONGA:
                return "Open high conga" + b;
            case MidiDrum.OPEN_HIHAT:
                return "Open hi-hat" + b;
            case MidiDrum.OPEN_TRIANGLE:
                return "Open triangle" + b;
            case MidiDrum.PEDAL_HIHAT:
                return "Pedal hi-hat" + b;
            case MidiDrum.RIDE_BELL:
                return "Ride bell" + b;
            case MidiDrum.RIDE_CYMBAL_1:
                return "Ride cymbal 1" + b;
            case MidiDrum.RIDE_CYMBAL_2:
                return "Ride cymbal 2" + b;
            case MidiDrum.RIMSHOT:
                return "Rimshot" + b;
            case MidiDrum.SHORT_GUIRO:
                return "Short guiro" + b;
            case MidiDrum.SHORT_WHISTLE:
                return "Short whistle" + b;
            case MidiDrum.SNARE_DRUM_1:
                return "Snare drum 1" + b;
            case MidiDrum.SNARE_DRUM_2:
                return "Snare drum 2" + b;
            case MidiDrum.SPLASH_CYMBAL:
                return "Splash cymbal" + b;
            case MidiDrum.TAMBOURINE:
                return "Tambourine" + b;
            case MidiDrum.VIBRA_SLAP:
                return "Vibraslap" + b
        }
        return "unknown midi drum" + b
    }
};
addPossibleValuesFunction(MidiDrum, MidiDrum.BASS_DRUM_2, MidiDrum.VIBRA_SLAP);
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
    GUNSHOT: 127,
    toString: function (a) {
        switch (a) {
            case MidiProgram.ACCORDION:
                return "Accordion";
            case MidiProgram.ACOUSTIC_BASS:
                return "Acoustic bass";
            case MidiProgram.ACOUSTIC_GRAND_PIANO:
                return "Acoustic grand piano";
            case MidiProgram.ACOUSTIC_NYLON_GUITAR:
                return "Acoustic nylon guitar";
            case MidiProgram.ACOUSTIC_STEEL_GUITAR:
                return "Acoustic steel guitar";
            case MidiProgram.AGOGO:
                return "Agogo";
            case MidiProgram.ALTO_SAX:
                return "Alto sax";
            case MidiProgram.APPLAUSE:
                return "Applause";
            case MidiProgram.ATMOSPHERE_SFX:
                return "Atmosphere sfx";
            case MidiProgram.BRIGHT_ACOUSTIC_PIANO:
                return "Bright acoustic piano";
            case MidiProgram.BAGPIPE:
                return "Bagpipe";
            case MidiProgram.BANJO:
                return "Banjo";
            case MidiProgram.BARITONE_SAX:
                return "Baritone sax";
            case MidiProgram.BASSOON:
                return "Bassoon";
            case MidiProgram.BASS_PLUS_LEAD:
                return "Bass plus lead";
            case MidiProgram.BIRD_TWEET:
                return "Bird tweet";
            case MidiProgram.BLOWN_BOTTLE:
                return "Blown bottle";
            case MidiProgram.BOWED_PAD:
                return "Bowed pad";
            case MidiProgram.BRASS_SECTION:
                return "Brass section";
            case MidiProgram.BREATH_NOISE:
                return "Breath noise";
            case MidiProgram.BRIGHTNESS_SFX:
                return "Brightness sfx";
            case MidiProgram.CELESTA:
                return "Celesta";
            case MidiProgram.CELLO:
                return "Cello";
            case MidiProgram.CHOIR_AAHS:
                return "Choir aahs";
            case MidiProgram.CHURCH_ORGAN:
                return "Church organ";
            case MidiProgram.CLAVINET:
                return "Clavinet";
            case MidiProgram.CONTRABASS:
                return "Contrabass";
            case MidiProgram.CALLIOPE_LEAD:
                return "Calliope lead";
            case MidiProgram.CHARANG_LEAD:
                return "Charang lead";
            case MidiProgram.CHIFF_LEAD:
                return "Chiff lead";
            case MidiProgram.CHOIR_PAD:
                return "Choir pad";
            case MidiProgram.CLARINET:
                return "Clarinet";
            case MidiProgram.CRYSTAL_SFX:
                return "Crystal sfx";
            case MidiProgram.DISTORTION_GUITAR:
                return "Distortion guitar";
            case MidiProgram.DRAWBAR_ORGAN:
                return "Drawbar organ";
            case MidiProgram.DULCIMER:
                return "Dulcimer";
            case MidiProgram.ELECTRIC_CLEAN_GUITAR:
                return "Electric clean guitar";
            case MidiProgram.ELECTRIC_FINGER_BASS:
                return "Electric finger bass";
            case MidiProgram.ELECTRIC_GRAND_PIANO:
                return "Electric grand piano";
            case MidiProgram.ELECTRIC_JAZZ_GUITAR:
                return "Electric jazz guitar";
            case MidiProgram.ELECTRIC_MUTED_GUITAR:
                return "Electric muted guitar";
            case MidiProgram.ELECTRIC_PIANO_1:
                return "Electric piano 1";
            case MidiProgram.ELECTRIC_PIANO_2:
                return "Electric piano 2";
            case MidiProgram.ELECTRIC_PICK_BASS:
                return "Electric pick bass";
            case MidiProgram.ECHOES_SFX:
                return "Echoes sfx";
            case MidiProgram.ENGLISH_HORN:
                return "English hord";
            case MidiProgram.FRETLESS_BASS:
                return "Fretless bass";
            case MidiProgram.FIDDLE:
                return "Fiddle";
            case MidiProgram.FIFTHS_LEAD:
                return "Fifths lead";
            case MidiProgram.FLUTE:
                return "Flute";
            case MidiProgram.FRENCH_HORN:
                return "French horn";
            case MidiProgram.GLOCKENSPIEL:
                return "Glockenspiel";
            case MidiProgram.GUITAR_HARMONICS:
                return "Guitar harmonics";
            case MidiProgram.GOBLINS_SFX:
                return "Goblins sfx";
            case MidiProgram.GUITAR_FRET_NOISE:
                return "Guitar fret noise";
            case MidiProgram.GUNSHOT:
                return "Gunshot";
            case MidiProgram.HARMONICA:
                return "Harmonica";
            case MidiProgram.HARPSICHORD:
                return "Harpsichord";
            case MidiProgram.HONKY_TONK_PIANO:
                return "Honky-tonk piano";
            case MidiProgram.HALO_PAD:
                return "Halo pad";
            case MidiProgram.HELICOPTER:
                return "Helicopter";
            case MidiProgram.KALIMBA:
                return "Kalimba";
            case MidiProgram.KOTO:
                return "Koto";
            case MidiProgram.MARIMBA:
                return "Marimba";
            case MidiProgram.MUSIC_BOX:
                return "Music box";
            case MidiProgram.MELODIC_TOM:
                return "Melodic tom";
            case MidiProgram.METALLIC_PAD:
                return "Metallic pad";
            case MidiProgram.MUTED_TRUMPET:
                return "Muted trumpet";
            case MidiProgram.NEW_AGE_PAD:
                return "New age pad";
            case MidiProgram.ORCHESTRAL_HARP:
                return "Orchestral harp";
            case MidiProgram.ORCHESTRA_HIT:
                return "Orchestra hit";
            case MidiProgram.OVERDRIVEN_GUITAR:
                return "Overdriven guitar";
            case MidiProgram.OBOE:
                return "Oboe";
            case MidiProgram.OCARINA:
                return "Ocarina";
            case MidiProgram.PERCUSSIVE_ORGAN:
                return "Percussive organ";
            case MidiProgram.PIZZICATO_STRINGS:
                return "Pizzicato strings";
            case MidiProgram.PAN_FLUTE:
                return "Pan flute";
            case MidiProgram.PICCOLO:
                return "Piccolo";
            case MidiProgram.POLYSYNTH_PAD:
                return "Polysynth pad";
            case MidiProgram.REED_ORGAN:
                return "Reed organ";
            case MidiProgram.ROCK_ORGAN:
                return "Rock organ";
            case MidiProgram.RAIN_SFX:
                return "Rain sfx";
            case MidiProgram.RECORDER:
                return "Recorder";
            case MidiProgram.REVERSE_CYMBAL:
                return "Reverse cymbal";
            case MidiProgram.SLAP_BASS_1:
                return "Slap bass 1";
            case MidiProgram.SLAP_BASS_2:
                return "Slap bass 2";
            case MidiProgram.STRING_ENSEMBLE_1:
                return "String ensemble 1";
            case MidiProgram.STRING_ENSEMBLE_2:
                return "String ensemble 2";
            case MidiProgram.SYNTH_BASS_1:
                return "Synth bass 1";
            case MidiProgram.SYNTH_BASS_2:
                return "Synth bass 2";
            case MidiProgram.SYNTH_CHOIR:
                return "Synth choir";
            case MidiProgram.SYNTH_STRINGS_1:
                return "Synth strings 1";
            case MidiProgram.SYNTH_STRINGS_2:
                return "Synth strings 2";
            case MidiProgram.SAW_LEAD:
                return "Saw lead";
            case MidiProgram.SCIFI_SFX:
                return "Sci-fi sfx";
            case MidiProgram.SEASHORE:
                return "Seashore";
            case MidiProgram.SHAKUHACHI:
                return "Shakuhachi";
            case MidiProgram.SHAMISEN:
                return "Shamisen";
            case MidiProgram.SHANAI:
                return "Shanai";
            case MidiProgram.SITAR:
                return "Sitar";
            case MidiProgram.SOPRANO_SAX:
                return "Soprano sax";
            case MidiProgram.SOUNDTRACK_SFX:
                return "Soundtrack sfx";
            case MidiProgram.SQUARE_LEAD:
                return "Square lead";
            case MidiProgram.STEEL_DRUMS:
                return "Steel drums";
            case MidiProgram.SWEEP_PAD:
                return "Sweep pad";
            case MidiProgram.SYNTH_DRUM:
                return "Synth drum";
            case MidiProgram.SYNTH_BRASS_1:
                return "Synth brass 1";
            case MidiProgram.SYNTH_BRASS_2:
                return "Synth brass 2";
            case MidiProgram.TANGO_ACCORDION:
                return "Tango accordion";
            case MidiProgram.TIMPANI:
                return "Timpani";
            case MidiProgram.TREMOLO_STRINGS:
                return "Tremolo strings";
            case MidiProgram.TUBULAR_BELLS:
                return "Tubular bells";
            case MidiProgram.TAIKO_DRUM:
                return "Taiko drum";
            case MidiProgram.TELEPHONE_RING:
                return "Telephone ring";
            case MidiProgram.TENOR_SAX:
                return "Tenor sax";
            case MidiProgram.TINKLE_BELL:
                return "Tinkle bell";
            case MidiProgram.TROMBONE:
                return "Trombone";
            case MidiProgram.TRUMPET:
                return "Trumpet";
            case MidiProgram.TUBA:
                return "Tuba";
            case MidiProgram.VIBRAPHONE:
                return "Vibraphone";
            case MidiProgram.VIOLA:
                return "Viola";
            case MidiProgram.VIOLIN:
                return "Violin";
            case MidiProgram.VOICE_OOHS:
                return "Voice oohs";
            case MidiProgram.VOICE_LEAD:
                return "Voice lead";
            case MidiProgram.WARM_PAD:
                return "Warm pad";
            case MidiProgram.WHISTLE:
                return "Whistle";
            case MidiProgram.WOODBLOCK:
                return "Woodblock";
            case MidiProgram.XYLOPHONE:
                return "Xylophone"
        }
        return "Unknown midi program " + a
    }
};
addPossibleValuesFunction(MidiProgram, MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.GUNSHOT);

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
    toString: function (a) {
        switch (a) {
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Complete imperfect + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Complete imperfect + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Incomplete + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Incomplete + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Deceptive + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Deceptive + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Modulate + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Modulate + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Tonicize + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Tonicize + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Incomplete initial + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Incomplete initial + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE:
                return "Incomplete + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE:
                return "Deceptive + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE:
                return "Complete imperfect + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
                return "Tonicize + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE:
                return "Complete plagial + complete";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL:
                return "Complete + complete plagial";
            case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT:
                return "Antecedent consequent";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
                return "Single silent";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE:
                return "Single deceptive";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL:
                return "Single complete plagial";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT:
                return "Single complete imperfect";
            case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN:
                return "Antecedent consequent shorten";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE:
                return "Complete + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_IMPERFECT:
                return "Complete + complete imperfect";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
                return "Complete + complete change scale type";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
                return "Complete + modulate";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
                return "Complete + phrase modulate";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE:
                return "Deceptive + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE:
                return "Incomplete initial + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE:
                return "Incomplete + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
                return "Incomplete + modulate";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG:
                return "Incomplete + dominant prolong";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE:
                return "Incomplete + dominant prolong cadence";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_SHORTER_PLUS_COMPLETE:
                return "Incomplete shorter + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_WEAK_PLUS_COMPLETE_WEAK_TONIC:
                return "Incomplete weak + complete weak tonic";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
                return "Modulate + complete";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
                return "Modulate + modulate back";
            case SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE:
                return "Phrase modulate";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE:
                return "Single complete";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE:
                return "Single incomplete";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG:
                return "Single tonic prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE:
                return "Tonic prolong + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE:
                return "Tonic prolong + dominant prolong cadence";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG:
                return "Tonic prolong + dominant prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE:
                return "Tonic prolong + dominaint prolong + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG:
                return "Tonic prolong + dominant prolong + tonic cadence prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
                return "Tonicize + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
                return "Tonicize + tonicize";
            case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
                return "Custom";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
                return "Single custom harmony";
            case SimpleModuleGeneratorPhraseGroupType.DOUBLE_CUSTOM_HARMONY:
                return "Double custom harmony"
        }
        return "Unknown phrase group type " + a
    },
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
addPossibleValuesFunction(SimpleModuleGeneratorPhraseGroupType, SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC);
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
    },
    toString: function (a) {
        switch (a) {
            case SongPartType.BRIDGE_1:
                return "Bridge 1";
            case SongPartType.BRIDGE_2:
                return "Bridge 2";
            case SongPartType.CHORUS_1:
                return "Chorus 1";
            case SongPartType.CHORUS_2:
                return "Chorus 2";
            case SongPartType.VERSE_1:
                return "Verse 1";
            case SongPartType.VERSE_2:
                return "Verse 2";
            case SongPartType.MISC_1:
                return "Misc 1";
            case SongPartType.MISC_2:
                return "Misc 2"
        }
        return "Unknown song part type " + a
    }
};
addPossibleValuesFunction(SongPartType, SongPartType.VERSE_1, SongPartType.MISC_2);

var MelodyOffsetLevel = {
    VERY_LOW: -2,
    LOW: -1,
    MIDDLE: 0,
    HIGH: 1,
    VERY_HIGH: 2,
    toString: function (a) {
        switch (a) {
            case MelodyOffsetLevel.HIGH:
                return "High";
            case MelodyOffsetLevel.LOW:
                return "Low";
            case MelodyOffsetLevel.MIDDLE:
                return "Middle";
            case MelodyOffsetLevel.VERY_HIGH:
                return "Very high";
            case MelodyOffsetLevel.VERY_LOW:
                return "Very low"
        }
        return "Unknown melody offset level " + a
    }
};
addPossibleValuesFunction(MelodyOffsetLevel, MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.VERY_HIGH);

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
    PERCUSSION_EFFECTS: 24,
    toString: function (a) {
        switch (a) {
            case PhraseGroupIndexProperty.BASS_EFFECTS:
                return "Bass Effects";
            case PhraseGroupIndexProperty.BASS_INSTRUMENT_DISTRIBUTION:
                return "Bass Instrument Distribution";
            case PhraseGroupIndexProperty.BASS_MOTIF_DISTRIBUTION:
                return "Bass Motif Distribution";
            case PhraseGroupIndexProperty.BASS_SHAPE:
                return "Bass Shape";
            case PhraseGroupIndexProperty.HARMONY:
                return "Harmony";
            case PhraseGroupIndexProperty.HARMONY_CHARACTERISTIC:
                return "Harmony Characteristic";
            case PhraseGroupIndexProperty.HARMONY_RYTHM:
                return "Harmony Rythm";
            case PhraseGroupIndexProperty.INNER_1_EFFECTS:
                return "Inner 1 Effects";
            case PhraseGroupIndexProperty.INNER_1_INSTRUMENT_DISTRIBUTION:
                return "Inner 1 Instrument Distribution";
            case PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION:
                return "Inner 1 Motif Distribution";
            case PhraseGroupIndexProperty.INNER_2_EFFECTS:
                return "Inner 2 Effects";
            case PhraseGroupIndexProperty.INNER_2_INSTRUMENT_DISTRIBUTION:
                return "Inner 2 Instrument Distribution";
            case PhraseGroupIndexProperty.INNER_2_MOTIF_DISTRIBUTION:
                return "Inner 2 Motif Distribution";
            case PhraseGroupIndexProperty.MELODY_EFFECTS:
                return "Melody Effects";
            case PhraseGroupIndexProperty.MELODY_INSTRUMENT_DISTRIBUTION:
                return "Melody Instrument Distribution";
            case PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION:
                return "Melody Motif Distribution";
            case PhraseGroupIndexProperty.MELODY_SHAPE:
                return "Melody Shape";
            case PhraseGroupIndexProperty.PERCUSSION_EFFECTS:
                return "Percussion Effects";
            case PhraseGroupIndexProperty.PERCUSSION_FILL_DISTRIBUTION:
                return "Percussion Fill Distribution";
            case PhraseGroupIndexProperty.PERCUSSION_MOTIF_DISTRIBUTION:
                return "Percussion Motif Distribution";
            case PhraseGroupIndexProperty.RENDER_AMOUNT:
                return "Render Amount";
            case PhraseGroupIndexProperty.SUSPEND:
                return "Suspend";
            case PhraseGroupIndexProperty.TEMPO:
                return "Tempo";
            case PhraseGroupIndexProperty.TEMPO_CHANGE_1:
                return "Tempo Change 1";
            case PhraseGroupIndexProperty.TEMPO_CHANGE_2:
                return "Tempo Change 2"
        }
        return "Unknown phrase group index property"
    }
};
addPossibleValuesFunction(PhraseGroupIndexProperty, PhraseGroupIndexProperty.MELODY_SHAPE, PhraseGroupIndexProperty.PERCUSSION_EFFECTS);
var SongPartStrength = {
    DEFAULT: 0,
    VERY_WEAK: 1,
    WEAK: 2,
    MEDIUM: 3,
    STRONG: 4,
    VERY_STRONG: 5,
    toString: function (a) {
        switch (a) {
            case SongPartStrength.DEFAULT:
                return "Default";
            case SongPartStrength.MEDIUM:
                return "Medium";
            case SongPartStrength.STRONG:
                return "Strong";
            case SongPartStrength.VERY_STRONG:
                return "Very Strong";
            case SongPartStrength.VERY_WEAK:
                return "Very Weak";
            case SongPartStrength.WEAK:
                return "Weak"
        }
        return "Medium"
    },
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
addPossibleValuesFunction(SongPartStrength, SongPartStrength.DEFAULT, SongPartStrength.VERY_STRONG);

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
    NOTE_RANGE: 22,
    toString: function (a) {
        return a
    }
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
    RANDOM_GROUP: 18,
    appendEffectInfos: function (g, f, l) {
        var a = getValueOrDefault(f, "ampFraction", 0.5);
        var r = getValueOrDefault(f, "xFraction", 0.5);
        var v = getValueOrDefault(f, "infos", []);
        var k = getValueOrDefault(f, "indices", []);
        var s = getValueOrDefault(f, "id", "theId");
        var q = getValueOrDefault(f, "constraints1", []);
        var p = getValueOrDefault(f, "constraints2", []);
        var u = [0, 1];
        var j = [1, 1];
        var t = [0, 1];
        var h = [1, 1];
        var c = s + "1";
        var b = s + "2";
        var o = null;
        var n = null;
        switch (g) {
            case PhraseGroupEffectType.RANDOM_ALL_SAME:
            case PhraseGroupEffectType.RANDOM_ALL_DIFFERENT:
            case PhraseGroupEffectType.RANDOM_FIRST_PHRASE:
            case PhraseGroupEffectType.RANDOM_GROUP:
            case PhraseGroupEffectType.RANDOM_SECOND_PHRASE:
                var e = getRandomCurveInfos({
                    ampRange: [0.3, 0.5],
                    biasRange: [1, 1]
                }, l);
                var d = getRandomCurveInfos({
                    ampRange: [0.3, 0.5],
                    biasRange: [1, 1]
                }, l);
                o = sampleData(curveRndInfos, l);
                switch (g) {
                    case PhraseGroupEffectType.RANDOM_ALL_SAME:
                        n = o;
                        break;
                    case PhraseGroupEffectType.RANDOM_ALL_DIFFERENT:
                        n = sampleData(curveRndInfos, l);
                        break;
                    case PhraseGroupEffectType.RANDOM_FIRST_PHRASE:
                        break;
                    case PhraseGroupEffectType.RANDOM_SECOND_PHRASE:
                        n = o;
                        o = null;
                        break;
                    case PhraseGroupEffectType.RANDOM_GROUP:
                        break
                }
                break;
            case PhraseGroupEffectType.DEC_SECOND_PHRASE:
                h = [1 - a, 1];
                break;
            case PhraseGroupEffectType.INC_SECOND_PHRASE:
                h = [1 + a, 1];
                break;
            case PhraseGroupEffectType.DEC_INC_GROUP:
                j = [1, 1 - a];
                h = [1 - a, 1];
                break;
            case PhraseGroupEffectType.INC_DEC_GROUP:
                j = [1, 1 + a];
                h = [1 + a, 1];
                break;
            case PhraseGroupEffectType.DEC_FIRST_PHRASE_STAY:
                j = [1, 1 - a];
                h = [1 - a, 1 - a];
                break;
            case PhraseGroupEffectType.INC_FIRST_PHRASE_STAY:
                j = [1, 1 + a];
                h = [1 + a, 1 + a];
                break;
            case PhraseGroupEffectType.DEC_FIRST_PHRASE_RETURN:
                j = [1, 1 - a];
                break;
            case PhraseGroupEffectType.INC_FIRST_PHRASE_RETURN:
                j = [1, 1 + a];
                break;
            case PhraseGroupEffectType.INC_GROUP:
                j = [1, 1 + a * r];
                h = [1 + a * r, 1 + a];
                break;
            case PhraseGroupEffectType.DEC_GROUP:
                j = [1, 1 - a * r];
                h = [1 - a * r, 1 - a];
                break;
            case PhraseGroupEffectType.INC_DEC_FIRST_PHRASE:
                u = [0, r, 1];
                j = [1, 1 + a, 1];
                break;
            case PhraseGroupEffectType.INC_DEC_SECOND_PHRASE:
                t = [0, r, 1];
                h = [1, 1 + a, 1];
                break;
            case PhraseGroupEffectType.DEC_INC_FIRST_PHRASE:
                u = [0, r, 1];
                j = [1, 1 - a, 1];
                break;
            case PhraseGroupEffectType.DEC_INC_SECOND_PHRASE:
                t = [0, r, 1];
                h = [1, 1 - a, 1];
                break;
            default:
                console.log("Unknown effect " + g);
                break
        }
        var m = v.length;
        if (!o) {
            o = {
                ampRange: [1, 1],
                biasRange: [0, 0],
                xValues: u,
                yValues: j
            }
        }
        if (!n) {
            n = {
                ampRange: [1, 1],
                biasRange: [0, 0],
                xValues: t,
                yValues: h
            }
        }
        addAll(v, [getEffectInfo({
            id: c,
            curveData: o,
            activeExpression: "indexInfoVar.phraseGroupCount == 2",
            phraseGroupIndex: 0
        }, l), getEffectInfo({
            id: b,
            curveData: n,
            activeExpression: "indexInfoVar.phraseGroupCount == 2",
            phraseGroupIndex: 1
        }, l)]);
        k.push(m);
        k.push(m + 1)
    },
    toString: function (a) {
        return "toString() for PhraseGroupEffectType not implemented"
    }
};
addPossibleValuesFunction(PhraseGroupEffectType, PhraseGroupEffectType.INC_DEC_FIRST_PHRASE, PhraseGroupEffectType.DEC_INC_GROUP);

var ControlChannelControlWriteMode = {
    NONE: 0,
    SET_CONTROL: 1
};

