# Marathi audit findings

The current Marathi option was not a Marathi translation. It used the Hindi canonical text and converted it to Devanagari, so the user was correct that it looked the same as Hindi.

Two independent Marathi meaning pages provide a genuine Marathi rendering. The clearest verse-by-verse source is HanumanChalisaInMarathi.com, which supplies Marathi translations for the opening dohas, all 40 chaupais, and the closing doha. Webdunia Marathi and Sant Sahitya independently show the same translation approach and wording family, with small editorial variations.

## Sources

1. [Hanuman Chalisa in Marathi — verse-by-verse Marathi translation](https://hanumanchalisainmarathi.com/)
2. [Webdunia Marathi — Hanuman Chalisa with meaning](https://marathi.webdunia.com/article/hinduism-marathi/shri-hanuman-chalisa-with-meaning-120091500007_1.html)
3. [Sant Sahitya — Hanuman Chalisa Marathi meaning](https://www.santsahitya.in/articles/hanuman-chalisa/)

## Implementation decision

The Marathi language entry should use a dedicated `mr` field containing Marathi-script meaning text rather than the Hindi verse transliterated into Devanagari. The Marathi audio should speak the Marathi meaning edition, while Hindi audio remains the original Hindi recitation. Regional-script editions for other languages should be clearly labeled as script renderings unless native-language translations are separately verified.
