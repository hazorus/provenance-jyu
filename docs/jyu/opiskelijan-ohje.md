# Provenance – asennus- ja käyttöohje opiskelijalle

Oct 27, 2026 · @Tommi

## Mikä Provenance on

Provenance on VS Coden laajennus, joka tallentaa tehtäväkansiossa tekemäsi muokkaukset lokiin. Loki palautetaan tehtävän mukana, ja se toimii todisteena siitä, että olet kirjoittanut koodisi itse.

- **Mitä tallentuu:** muokkaukset, jotka teet tehtäväkansion tiedostoihin VS Codessa.
- **Mitä ei tallennu:** selaimesi, muut projektisi tai mikään tehtäväkansion ulkopuolinen.
- **Mihin tallentuu:** vain omalle koneellesi, tehtäväkansion `.provenance/`-alikansioon tavallisena tekstinä. Laajennus ei lähetä mitään verkkoon, vaan sinä palautat lokin itse.
- **Mitä se ei tee:** se ei arvioi koodiasi eikä sisällä tekoälytunnistinta. Opettaja lukee lokia vain, jos on syytä epäillä, ettei ratkaisu ole omaa työtäsi.

Oman aiemmin kirjoittamasi koodin kopioiminen ja liittäminen on täysin normaalia eikä aiheuta ongelmia.

Kurssilla käytetään Provenancen JYU-versiota (tunniste `jyu-tjlahton.provenance-recorder-jyu-it`). Se perustuu UC Berkeleyn avoimeen lähdekoodiin, ja sen lähdekoodi on luettavissa [GitHubissa](https://github.com/hazorus/provenance-jyu/tree/jyu).

## Asennus

Asennat laajennuksen JYU-version alla linkitetystä `.vsix`-tiedostosta. **Älä asenna Provenance Recorderia VS Coden Marketplacesta.** Marketplacen versio on tehty Berkeleyn kursseille, eikä se tallenna tämän kurssin tehtäviä.

1. Asenna tai päivitä Visual Studio Code. Tarvitset version 1.100 tai uudemman. Version näet valikosta **Help → About** (Windows, Linux) tai **Code → About Visual Studio Code** (Mac).
2. Lataa laajennus omalle koneellesi: [provenance-recorder-jyu-it-2.0.3.vsix](https://github.com/hazorus/provenance-jyu/raw/vsix/provenance-recorder-jyu-it-2.0.3.vsix). Uudemmat versiot löytyvät [samasta paikasta](https://github.com/hazorus/provenance-jyu/tree/vsix).
3. Jos olet aiemmin asentanut Provenance Recorderin Marketplacesta, poista se ensin: laajennusnäkymä (**Ctrl+Shift+X**, Macissa **Cmd+Shift+X**) → Provenance Recorder → **Uninstall**.
4. Avaa komentopaletti (**Ctrl+Shift+P**, Macissa **Shift+Cmd+P**), kirjoita `Install from VSIX` ja valitse **Extensions: Install from VSIX…**. Valitse lataamasi tiedosto.
5. Käynnistä VS Code uudelleen.

Tarkista asennus laajennusnäkymästä: Provenance Recorderin julkaisijaksi pitää näkyä `jyu-tjlahton`.

Jos opettaja julkaisee laajennuksesta uuden version, asenna se samalla tavalla. Uusi versio korvaa vanhan.

## Tehtävän tekeminen

Tallennus toimii vain, kun avaat VS Codessa nimenomaan tehtävän oman kansion.

1. Kloonaa tehtävän repo gitlab.jyu.fi:stä omalle koneellesi, esimerkiksi `git clone <repon osoite> kurssi/tehtava1`. Älä tallenna sitä Lataukset-kansioon.
2. Avaa VS Codessa **File → Open Folder…** ja valitse **itse tehtäväkansio**, ei sen yläpuolista kansiota.
3. Jos VS Code kysyy, luotatko kansion tekijöihin, vastaa **Yes, I trust the authors**.
4. Tarkista VS Code -ikkunan alareunan tilariviltä, että siinä lukee **Provenance: recording**.
5. Tee tehtävä normaalisti VS Codessa. Kytke päälle **File → Auto Save**, jotta muutokset tallentuvat aina levylle.

Tee kaikki tehtävän koodi tässä kansiossa ja VS Codessa. Muokkaukset muilla editoreilla eivät näy lokissa.

## Palautus

Loki palautuu tehtävän git-repossa koodisi mukana. Repon juuressa on kaksi Provenancen tiedostoa:

- `.provenance-manifest` tulee tehtäväpohjan mukana ja kertoo laajennukselle, että kansio on kurssin tehtävä.
- `.provenance/`-kansioon laajennus kirjoittaa lokin työn aikana.

1. Tee commit ja push normaalisti. Varmista `git status` -komennolla, että `.provenance/`-kansio on mukana.
2. Älä nimeä uudelleen, siirrä, muokkaa tai poista `.provenance-manifest`-tiedostoa tai `.provenance/`-kansiota, äläkä lisää niitä `.gitignore`-tiedostoon.
3. Tarkista kurssin git-palvelusta, että `.provenance/`-kansio näkyy repossasi.
4. Lokia ei tarvitse palauttaa erikseen kurssin palautusjärjestelmään, koska se kulkee repossa koodisi mukana.

Jos teet tehtävän parin kanssa, kirjoittakaa koodi yhdellä koneella kerrallaan. Kirjoittajaa voi vaihtaa niin usein kuin haluatte, ja konetta vaihdettaessa toimikaa alla olevan ohjeen mukaan.

Voit tehdä tehtävää useammalla koneella, kun siirrät työn gitin kautta. Asenna sama `.vsix`-tiedosto kaikille koneille ja toimi näin:

1. Sulje VS Code ensimmäisellä koneella.
2. Tee commit ja push.
3. Aja toisella koneella `git pull` ennen kuin avaat tehtäväkansion VS Codessa.

Älä aja `git pull`-komentoa, kun tehtäväkansio on auki VS Codessa. Muuten omat muutoksesi näkyvät lokissa ulkoisina muutoksina.

## Jos tilarivillä ei lue "Provenance: recording"

Käy läpi nämä kohdat järjestyksessä:

1. **VS Code on ajan tasalla.** Päivitä VS Code ja käynnistä se uudelleen. Avaa sitten tehtäväkansio uudelleen.
2. **Provenance on ajan tasalla.** Tarkista, että olet asentanut uusimman `.vsix`-tiedoston etkä Marketplacen versiota. JYU-version julkaisija laajennusnäkymässä on `jyu-tjlahton`.
3. **Oikea kansio on auki.** Avaa kloonatun repon kansio, jonka juuressa on `.provenance-manifest`-tiedosto, eikä sen yläpuolista kansiota.
4. **Kansioon luotetaan.** Jos ikkunan yläreunassa on harmaa palkki, jossa mainitaan Restricted Mode, valitse palkista luottamus kansioon.
5. **Kansioon voi kirjoittaa.** Macissa Lataukset-kansiossa olevat tiedostot voivat olla vain luku -tilassa. Siirrä tehtäväkansio esimerkiksi Työpöydälle tai omaan kurssikansioon.

Jos tallennus ei vieläkään käynnisty, ota yhteyttä opettajaan ennen kuin teet tehtävää pidemmälle.

## Usein kysyttyä

**Saanko kopioida ja liittää omaa koodiani?** Kyllä.

**Vaikuttaako Provenance arvosanaani?** Ei. Se ei anna pisteitä eikä arvioi koodia.

**Merkitäänkö minut automaattisesti epäillyksi?** Ei. Opettaja käsittelee mahdolliset epäselvyydet tapauskohtaisesti.

**Lähettääkö laajennus jotain, kun työskentelen?** Ei. Se ei tee verkkoyhteyksiä.

**Voinko lukea oman lokini?** Kyllä. Se on tekstitiedostoina tehtäväkansion `.provenance/`-kansiossa.

**Unohdin pitää tallennuksen päällä osan ajasta. Mitä teen?** Voit palauttaa tehtävän silti, jolloin opettaja saattaa ottaa sinuun yhteyttä. Vaihtoehtoisesti voit kloonata tehtäväpohjan uudelleen ja tehdä tehtävän alusta tallennus päällä.

## Lähteet

- [Provenance, JYU-versio, GitHub](https://github.com/hazorus/provenance-jyu/tree/jyu)
- [Provenance, CS 61A, UC Berkeley](https://cs61a.org/fa26/articles/provenance/)
- [Lab 0: Getting Started, CS 61A, UC Berkeley](https://cs61a.org/fa26/labs/lab00/)
- [Project 1, CS 61C, UC Berkeley](https://cs61c.org/fa26/projects/proj1/)
