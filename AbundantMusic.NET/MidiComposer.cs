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
        // Like in a web browser, each midi composer requires it's own JavaScript engine instance.
        // Due to the way Abundant Music uses some global JS variables, we cannot share the JS Engine.
        // See "index.html" in the "abundant-music-composer" source directory.
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
                engine.ExecuteResource("abundant_music_composer.js.composeeditoronlinesource.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.fakebytearray.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.composeworkersource.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.riffwave.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthsource.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthenvelope.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthfilter.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthoscillator.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthvoice.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynthinstrument.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midisynth.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.stacktrace.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.midi.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.generator.js", typeof(MidiComposer));
                engine.ExecuteResource("abundant_music_composer.js.composemain.js", typeof(MidiComposer));
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
