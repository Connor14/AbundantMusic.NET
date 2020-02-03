using AbundantMusic.NET;
using Commons.Music.Midi;
using System;
using System.Diagnostics;

namespace DemoPlayer
{
    // Because of the midi playback library used in this demo, this demo will only work on Windows
    // Save the file and/or use another midi synthesizer to play the midi on Mac or Linux
    class Program
    {
        static void Main(string[] args)
        {
            Stopwatch stopwatch = new Stopwatch();

            while (true)
            {
                Console.Write("Enter seed: ");
                string seed = Console.ReadLine();

                Console.WriteLine("Generating Midi...");

                stopwatch.Restart();

                // Generate a MIDI using Abundant Music
                using (MidiComposer composer = new MidiComposer())
                using(Composition composition = composer.Generate(seed))
                {
                    stopwatch.Stop();
                    Console.WriteLine("Accepted Seed: " + composition.AcceptedSeed);
                    Console.WriteLine("Generated in: " + stopwatch.Elapsed);

                    // Play the MIDI using managed-midi
                    // https://github.com/atsushieno/managed-midi
                    var access = MidiAccessManager.Default;
                    var music = MidiMusic.Read(composition.Midi);
                    using (var player = new MidiPlayer(music, access))
                    {
                        long totalPlayTime = player.GetTotalPlayTimeMilliseconds();
                        Console.WriteLine("Play time: " + TimeSpan.FromMilliseconds(totalPlayTime).ToString("g"));

                        player.Play();

                        while (player.State == PlayerState.Playing)
                        {

                        }
                    }
                }
            }
        }
    }
}
