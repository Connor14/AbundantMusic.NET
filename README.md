# AbundantMusic.NET
A C# wrapper for the Abundant Music MIDI composer

## About

**Abundant Music** was written by **Per Nyblom**. The original source code can be found here: https://github.com/pernyblom/pernyblom.github.io/tree/master/abundant-music

Check out the original Abundant Music application here: https://pernyblom.github.io/abundant-music/index.html

I created **AbundantMusic.NET** because I wanted an easy way to generate MIDI files and play them back in C# based applications. I looked through the Abundant Music source code starting with the `exportMidi()` function in `composemain.js`. I copied the relevant files and modified some code to work with **MsieJavaScriptEngine**. The biggest change I made was removing the Web Workers dependency. This was to make the code compatible with **MsieJavaScriptEngine**. 

## Tools

AbundantMusic.NET

* .NET Standard 2.0
* Abundant Music (https://github.com/pernyblom/pernyblom.github.io/tree/master/abundant-music)
* MsieJavaScriptEngine (https://github.com/Taritsyn/MsieJavaScriptEngine)

DemoPlayer

* .NET Core 2.2
* managed-midi (https://github.com/atsushieno/managed-midi)

## Getting Started

Simply run the `Generate` method with any `string` of your choosing. The resulting `byte[]` is your MIDI file. Now that you have the `byte[]`, you can write the file to disk or use it elsewhere in your program.

```
...
using AbundantMusic.NET;
...
byte[] midiFile = MidiComposer.Generate("my seed string");
...
```

See `DemoProject` for a more detailed example.

## License Information

As Per noted in the *Help/Credits > Questions and Answers* tab of the original Abundant Music application, **_all songs_** are licensed under **_CC0, "No rights reserved"_**. He included a link to the license which can be found here: https://creativecommons.org/share-your-work/public-domain/cc0

The **Abundant Music** repository contained its own `LICENSE` file including the *MIT* license and *Copyright (c) 2017 Per Nyblom*. The same license can be found in the `AbundantMusic.NET/abundant-music-composer` directory of this repository. 

## Future Development

Cleaning up the modified JavaScript files is the number one thing on my todo list. It works as is, but the readability and code quality need to be improved. 

Error checking should also be implemented within the AbundantMusic.NET project.
