using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace AbundantMusic.NET
{
    /// <summary>
    /// Generates MIDI files using Abundant Music
    /// </summary>
    public static class MidiComposer
    {
        private static readonly string[] resources = new string[]
        {
            "abundant_music_composer.js.enums.js",
            "abundant_music_composer.js.utilities.js",
            "abundant_music_composer.js.geninfo.js",
            "abundant_music_composer.js.prototypes.js",
            "abundant_music_composer.js.midi.js",
            "abundant_music_composer.js.geninfo.overrides.js",
            "abundant_music_composer.js.abundant-music-consolidated.js"
        };

        private static readonly List<IPrecompiledScript> scripts;

        // Note: I believe this is thread-safe based on the documentation and comments here: 
        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-constructors
        // https://github.com/dotnet/docs/issues/10243
        static MidiComposer()
        {
            scripts = new List<IPrecompiledScript>();

            // Load all required scripts from embedded resource and precompile them
            using (var compilationEngine = new ChakraCoreJsEngine())
            {
                foreach (var resource in resources)
                    scripts.Add(compilationEngine.PrecompileResource(resource, typeof(MidiComposer)));
            }
        }

        /// <summary>
        /// Composes a new MIDI file based on the given seed
        /// </summary>
        /// <param name="seed"></param>
        /// <returns></returns>
        public static Composition Compose(string seed)
        {
            using (var engine = new ChakraCoreJsEngine())
            {
                foreach (var script in scripts)
                    engine.Execute(script);

                var result = engine.CallFunction<string>("exportMidi", seed);
                var midiBytes = result.Split(',').Select(str => Convert.ToByte(str)).ToArray();

                return new Composition(seed, new MemoryStream(midiBytes));
            }
        }
    }
}
