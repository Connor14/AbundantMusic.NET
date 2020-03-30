using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AbundantMusic.NET
{
    public class Composition : IDisposable
    {

        public string Seed { get; set; }
        public MemoryStream Midi { get; set; }

        public Composition(string seed, MemoryStream midiStream)
        {
            Seed = seed;
            Midi = midiStream;
        }

        public void Dispose()
        {
            Midi.Dispose();
        }
    }
}
