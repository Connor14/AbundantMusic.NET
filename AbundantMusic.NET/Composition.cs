using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AbundantMusic.NET
{
    public class Composition
    {

        public string Seed { get; set; }
        public string AcceptedSeed { get; set; }

        public MemoryStream Midi { get; set; }

        public Composition(string seed, string acceptedSeed, MemoryStream midiStream)
        {
            this.Seed = seed;
            this.AcceptedSeed = acceptedSeed;
            this.Midi = midiStream;
        }
    }
}
