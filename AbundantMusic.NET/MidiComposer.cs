using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Core;
using System;
using System.IO;
using System.Text.RegularExpressions;

namespace AbundantMusic.NET
{
    public class MidiComposer
    {

        private static IJsEngineSwitcher engineSwitcher = null;

        public MidiComposer()
        {

        }

        // Configure only once
        private static void Configure()
        {
            if(engineSwitcher == null)
            {
                engineSwitcher = JsEngineSwitcher.Current;
                engineSwitcher.EngineFactories.AddChakraCore();
                engineSwitcher.DefaultEngineName = "ChakraCoreJsEngine";
            }
        }

        public static byte[] Generate(string seed)
        {
            Configure();

            byte[] file = null;

            IJsEngine engine = JsEngineSwitcher.Current.CreateEngine(ChakraCoreJsEngine.EngineName);

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
            engine.SetVariableValue("songSeed", Regex.Escape(seed));
            engine.ExecuteFile("./abundant-music-composer/js/composemain.js");

            string fileResult = engine.Evaluate<string>("exportMidi();");

            string[] nums = fileResult.Split(',');

            // Debugging to ensure connsistency between JavaScript engines
            //Console.WriteLine(nums.Length);
             
            byte[] newFile = new byte[nums.Length];
            for (int i = 0; i < newFile.Length; i++)
            {
                newFile[i] = byte.Parse(nums[i]);
            }

            file = newFile;

            return file;
        }

    }
}
