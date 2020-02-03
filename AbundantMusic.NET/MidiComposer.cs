using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AbundantMusic.NET
{
    /// <summary>
    /// Generates MIDI files using Abundant Music
    /// </summary>
    public class MidiComposer : IDisposable
    {
        // I save the compiled scripts to prevent the JS Engine from needing to recompile them for every new instance of MidiComposer
        // For example, the first run took something like .33 seconds to initiate MidiComposer
        // The Second run took like 0.04 seconds. There is improvement from caching the scripts
        private static readonly IReadOnlyList<IPrecompiledScript> precompiledScripts;

        private IJsEngine engine;

        // Allow only certian characters in the JSON
        // https://stackoverflow.com/questions/181356/regex-to-match-alphanumeric-and-spaces
        // https://stackoverflow.com/questions/2998519/net-regex-what-is-the-word-character-w
        public const string RegexPattern = @"[^\w _.-]"; // todo does this prevent unsafe input? Is it even necessary?
        public const string RegexReplacement = "_";

        /// <summary>
        /// Initialize the MidiComposer by pre-compiling the Abundant Music JavaScript
        /// </summary>
        // Note: I believe this is thread-safe based on the documentation and comments here: 
        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-constructors
        // https://github.com/dotnet/docs/issues/10243
        static MidiComposer()
        {
            Debug.WriteLine("Initializing MidiComposer");
            // Create a temporary engine to pre-compile the scripts
            using(var compilationEngine = new ChakraCoreJsEngine())
            {
                var scripts = new List<IPrecompiledScript>();

                scripts.Add(compilationEngine.Precompile("function logit(param){ }")); // logit function is referenced from within Abundant Music and is called once in a while
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.composeeditoronlinesource.js", typeof(MidiComposer)));
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.fakebytearray.js", typeof(MidiComposer)));
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.composeworkersource.js", typeof(MidiComposer)));
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.midi.js", typeof(MidiComposer)));
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.generator.js", typeof(MidiComposer)));
                scripts.Add(compilationEngine.PrecompileResource("abundant_music_composer.js.composemain.js", typeof(MidiComposer)));

                precompiledScripts = scripts;
            }
        }

        /// <summary>
        /// Initialize a new MidiComposer. 
        /// 
        /// WARNING: In multi-client/multi-user/multi-thread situations, each thread MUST have his own instance of MidiComposer due to global JavaScript variables within Abundant Music.
        /// </summary>
        public MidiComposer()
        {
            engine = new ChakraCoreJsEngine();

            // load the precompiled scripts
            foreach (IPrecompiledScript script in precompiledScripts)
            {
                engine.Execute(script);
            }
        }

        public async Task<Composition> GenerateAsync(string seed)
        {
            return await Task.Run(() => { return Generate(seed); });
        }

        public Composition Generate(string seed)
        {
            string acceptedSeed = Regex.Replace(seed, RegexPattern, RegexReplacement);

            string fileResult = engine.Evaluate<string>(string.Format("exportMidi('{0}');", acceptedSeed));
            string[] unsignedIntegers = fileResult.Split(',');

            byte[] newFile = new byte[unsignedIntegers.Length];
            for (int i = 0; i < newFile.Length; i++)
            {
                newFile[i] = byte.Parse(unsignedIntegers[i]);
            }

            return new Composition(seed, acceptedSeed, new MemoryStream(newFile));
        }

        public void Dispose()
        {
            engine.Dispose();
        }
    }
}
