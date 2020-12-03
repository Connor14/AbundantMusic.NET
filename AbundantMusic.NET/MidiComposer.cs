using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript.V8;
using System;
using System.IO;
using System.Reflection;
using System.Text;

namespace AbundantMusic.NET
{
    /// <summary>
    /// Generates MIDI files using Abundant Music
    /// </summary>
    public static class MidiComposer
    {
        private static readonly string javascript;

        // Note: I believe this is thread-safe based on the documentation and comments here: 
        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-constructors
        // https://github.com/dotnet/docs/issues/10243
        static MidiComposer()
        {
            string[] resources = new string[]
            {
                "abundant_music_composer.js.geninfo.js",
                "abundant_music_composer.js.geninfo.overrides.js",
                "abundant_music_composer.js.enums.js",
                "abundant_music_composer.js.midi.js",
                "abundant_music_composer.js.prototypes.js",
                "abundant_music_composer.js.abundant-music-consolidated.js"
            };

            // Load all required scripts from embedded resource
            using (var memoryStream = new MemoryStream())
            {
                // Copy each resource to the MemoryStream
                foreach(string resource in resources)
                {
                    using (var resourceStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(typeof(MidiComposer), resource))
                    {
                        resourceStream.CopyTo(memoryStream);
                    }
                }

                javascript = Encoding.UTF8.GetString(memoryStream.ToArray());
            }
        }

        /// <summary>
        /// Composes a new MIDI file based on the given seed
        /// </summary>
        /// <param name="seed"></param>
        /// <returns></returns>
        public static Composition Compose(string seed)
        {
            using (var engine = new V8ScriptEngine())
            {
                engine.Execute(javascript);

                var result = (ITypedArray<byte>)engine.Script.exportMidi(seed);
                var midiBytes = result.ToArray();

                return new Composition(seed, new MemoryStream(midiBytes));
            }
        }
    }
}
