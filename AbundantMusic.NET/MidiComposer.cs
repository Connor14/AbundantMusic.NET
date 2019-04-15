using MsieJavaScriptEngine;
using System;
using System.IO;

namespace AbundantMusic.NET
{
    public class MidiComposer
    {

        public MidiComposer()
        {

        }

        public static byte[] Generate(string seed)
        {
            byte[] file = null;

            using (var engine = new MsieJsEngine())
            {
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\composeeditoronlinesource.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\fakebytearray.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\composeworkersource.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\riffwave.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthsource.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthenvelope.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthfilter.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthoscillator.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthvoice.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynthinstrument.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midisynth.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\stacktrace.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\midi.js"));
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\generator.js"));
                engine.Execute("songSeed = \"" + seed + "\";");
                engine.Execute(File.ReadAllText(".\\abundant-music-composer\\js\\composemain.js"));

                string fileResult = engine.Evaluate<string>("exportMidi();");

                string[] nums = fileResult.Split(',');
                byte[] newFile = new byte[nums.Length];
                for (int i = 0; i < newFile.Length; i++)
                {
                    newFile[i] = byte.Parse(nums[i]);
                }

                file = newFile;
            }

            return file;
        }

    }
}
