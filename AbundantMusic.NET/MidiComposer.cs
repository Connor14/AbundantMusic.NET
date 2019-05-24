using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Core;
using System;
using System.IO;
using System.Text.RegularExpressions;

namespace AbundantMusic.NET
{
    public class MidiComposer
    {
        private IJsEngineSwitcher engineSwitcher = null;
        private IJsEngine engine = null;

        // didn't work quite right
        //public const string RegexPattern = "[^A-Za-z0-9_ ]*";

        // https://stackoverflow.com/questions/181356/regex-to-match-alphanumeric-and-spaces
        // https://stackoverflow.com/questions/2998519/net-regex-what-is-the-word-character-w
        public const string RegexPattern = @"[^\w _.-]"; // todo is this safe?
        public const string RegexReplacement = "_";

        public MidiComposer()
        {
            Configure();
        }

        // Configure only once
        private void Configure()
        {
            if (engineSwitcher == null)
            {
                engineSwitcher = JsEngineSwitcher.Current;
                engineSwitcher.EngineFactories.AddChakraCore();
                engineSwitcher.DefaultEngineName = "ChakraCoreJsEngine";
            }

            if (engine == null)
            {
                engine = JsEngineSwitcher.Current.CreateEngine(ChakraCoreJsEngine.EngineName);

                engine.Execute("function logit(param){ }"); // logit function is referenced from within Abundant Music and could cause crashes once in a while
                engine.ExecuteFile("./abundant-music-composer/js/composeeditoronlinesource.js");
                engine.ExecuteFile("./abundant-music-composer/js/fakebytearray.js");
                engine.ExecuteFile("./abundant-music-composer/js/composeworkersource.js");
                engine.ExecuteFile("./abundant-music-composer/js/riffwave.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthsource.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthenvelope.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthfilter.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthoscillator.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthvoice.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynthinstrument.js");
                engine.ExecuteFile("./abundant-music-composer/js/midisynth.js");
                engine.ExecuteFile("./abundant-music-composer/js/stacktrace.js");
                engine.ExecuteFile("./abundant-music-composer/js/midi.js");
                engine.ExecuteFile("./abundant-music-composer/js/generator.js");
                engine.ExecuteFile("./abundant-music-composer/js/composemain.js");
            }
        }

        public MemoryStream Generate(string seed)
        {
            string safeSeed = Regex.Replace(seed, RegexPattern, RegexReplacement);
            Console.WriteLine("Accepted seed: " + safeSeed);

            string fileResult = engine.Evaluate<string>(string.Format("exportMidi('{0}');", safeSeed));
            string[] nums = fileResult.Split(',');

            // Debugging to ensure connsistency between JavaScript engines
            //Console.WriteLine(nums.Length);

            byte[] newFile = new byte[nums.Length];
            for (int i = 0; i < newFile.Length; i++)
            {
                newFile[i] = byte.Parse(nums[i]);
            }

            return new MemoryStream(newFile);
        }

    }
}
