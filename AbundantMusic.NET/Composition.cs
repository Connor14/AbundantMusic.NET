using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AbundantMusic.NET
{
    public class Composition : IDisposable
    {

        public string InputSeed { get; set; }
        public string AcceptedSeed { get; set; }

        public MemoryStream Midi { get; set; }

        public Composition(string inputSeed, string acceptedSeed, MemoryStream midiStream)
        {
            this.InputSeed = inputSeed;
            this.AcceptedSeed = acceptedSeed;
            this.Midi = midiStream;
        }

        public void Dispose()
        {
            Midi.Dispose();
        }
    }
}
