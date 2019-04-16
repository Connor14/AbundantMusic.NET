using AbundantMusic.NET;
using Commons.Music.Midi;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DemoPlayer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter seed: ");
            string seed = Console.ReadLine();

            // Generate a MIDI using Abundant Music
            Console.WriteLine("Generating Midi...");
            byte[] midiFile = MidiComposer.Generate(seed);

            // Play the MIDI using managed-midi
            // https://github.com/atsushieno/managed-midi
            var access = MidiAccessManager.Default;
            var music = MidiMusic.Read(new MemoryStream(midiFile));
            using (var player = new MidiPlayer(music, access))
            {
                long totalPlayTime = player.GetTotalPlayTimeMilliseconds();
                Console.WriteLine("Play time: " + TimeSpan.FromMilliseconds(totalPlayTime).ToString("g"));

                player.Play();
                while (player.State == PlayerState.Playing)
                {

                }
            }

            Console.WriteLine("Press any key to continue...");
            Console.ReadLine();
        }
    }
}
