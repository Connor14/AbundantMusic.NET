﻿using AbundantMusic.NET;
using Commons.Music.Midi;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DemoPlayer
{
    // This demo player will ONLY work on Windows (without tweaking)
    // Save the file and/or use another midi synthesizer to play the midi on Mac or Linux
    class Program
    {
        static void Main(string[] args)
        {
            Task.Run(async () =>
            {
                // Continuously ask for seeds
                while (true)
                {
                    Console.Write("Enter seed: ");
                    string seed = Console.ReadLine();

                    // Generate a MIDI using Abundant Music
                    Console.WriteLine("Generating Midi...");
                    MidiComposer composer = new MidiComposer();
                    Composition composition = await composer.Generate(seed);

                    Console.WriteLine("Accepted Seed: " + composition.AcceptedSeed);

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
            }).Wait();
        }
    }
}
