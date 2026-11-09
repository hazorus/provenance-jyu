# Provenance – käyttöönotto-ohje opettajalle

Oct 27, 2026 · @Tommi

Provenance otetaan kurssilla käyttöön omalla avaimella ja omalla laajennuspaketilla. Opiskelijat palauttavat lokin git-repossa koodinsa mukana.

Työ jakautuu kahteen osaan:

- **Kerran (tai kun juuriavain vaihtuu):** juuriavaimen luonti, laajennuksen tunnisteen vaihto ja oman `.vsix`-paketin kääntäminen.
- **Kerran kurssille ja lukukaudelle:** kurssiavaimen luonti ja sille juuriavaimella allekirjoitettu kurssisertifikaatti.
- **Jokaiselle tehtävälle:** manifestin kirjoittaminen tehtäväpohjan juureen ja sen allekirjoittaminen kurssiavaimella.

Avainketju on kolmiportainen (Manifest 2.0): laajennukseen on upotettu juuriavain, juuriavain allekirjoittaa kurssisertifikaatin, ja kurssiavain allekirjoittaa manifestit. Sertifikaatti kulkee jokaisen manifestin mukana. Siksi yksi `.vsix`-paketti kelpaa kaikille kursseillesi, eikä sitä tarvitse kääntää uudelleen uutta kurssia varten.

Komennot ajetaan kloonatun [Provenance-repon](https://github.com/ProvenanceTools/provenance) juuressa. Tarvitset Node.js:n version 22 tai uudemman ja npm:n version 10 tai uudemman. Komennot on kirjoitettu bash-muodossa, eli Windowsissa ympäristömuuttujat asetetaan eri tavalla tai komennot ajetaan WSL:ssä.

## Avaimet, sertifikaatti ja laajennus

### 1. Hae ja käännä repo

```bash
git clone https://github.com/ProvenanceTools/provenance.git
cd provenance
npm install
npm run build
```

`npm run build` on pakollinen ensimmäinen vaihe. Ilman sitä Analyzer ja muut osat eivät löydä yhteisiä paketteja.

### 2. Luo juuriavain (kerran)

```bash
npm run keygen:course -- ~/root-keypair.json
```

Juuriavain on järjestelmän arvokkain salaisuus: sillä voi valtuuttaa minkä tahansa kurssiavaimen. Tee siitä varmuuskopio ja siirrä se pois työkoneelta, kun laajennus on käännetty. Tarvitset yksityistä osaa vain uuden kurssisertifikaatin allekirjoittamiseen. Julkinen osa tulostuu näytölle; kirjoita se talteen.

### 3. Luo kurssiavain ja kurssisertifikaatti (kerran kurssille ja lukukaudelle)

```bash
npm run keygen:course -- ~/kurssi-2026s.json
```

Komento tulostaa kurssiavaimen julkisen osan. Sen voi myös lukea tiedostosta myöhemmin:

```bash
node -e "console.log(require(process.env.HOME + '/kurssi-2026s.json').public_key_hex)"
```

Allekirjoita kurssiavaimelle sertifikaatti juuriavaimella:

```bash
npm run mint:course-cert -- \
  --course-id ties4080 --course-pubkey <kurssiavaimen julkinen osa> \
  --valid-from 2026-11-09 --valid-until 2027-01-31 \
  --root-keypair ~/root-keypair.json \
  --out ~/ties4080-2026s.cert.json
```

- `--course-pubkey` on **kurssiavaimen** julkinen osa, ei juuriavaimen. Tarkista tulosteesta, että `course_pubkey` on sama kuin kurssiavaimesi.
- Pidä voimassaoloaika lyhyenä, esimerkiksi yksi lukukausi. Laajennus ei saa tietoa avaimen mitätöinnistä, joten vuotanutta kurssiavainta voi käyttää koko voimassaoloajan.
- Säilytä kurssiavaimen yksityinen osa repojen ulkopuolella. Sertifikaatti ei ole salainen, koska se kulkee jokaisen manifestin mukana.

### 4. Vaihda laajennuksen tunniste (kerran)

Marketplacen versio on tunnisteeltaan `itsgeagle.provenance-recorder`. Jos oma pakettisi käyttää samaa tunnistetta, VS Coden automaattinen päivitys voi korvata sen Marketplacen versiolla, joka ei hyväksy kurssisi manifesteja.

Vaihda tiedostosta `packages/recorder/package.json` kentät `publisher` ja `name`, esimerkiksi `"publisher": "jyu"` ja `"name": "provenance-recorder-kurssi"`. Voit samalla vaihtaa `displayName`-kentän, jotta opiskelijat tunnistavat laajennuksen.

### 5. Käännä oma VSIX-paketti (kerran)

```bash
npm run update-hashes -- --root-keypair ~/root-keypair.json
```

Komento tekee kaksi asiaa kerralla:

- Se kääntää tuotantoversion, johon juuriavaimen julkinen osa on upotettu, ja tallentaa paketin kansioon `packages/recorder/` (esimerkiksi `provenance-recorder-jyu-it-2.0.2.vsix`).
- Se lisää paketin tiivisteen Analyzerin hyväksyttyjen versioiden listaan. Ilman tätä Analyzer merkitsee palautukset epäilyttäviksi.

Ilmoitus `PROVENANCE_LEGACY_COURSE_PUBLIC_KEY_HEX is not set` on odotettu: paketti hyväksyy vain Manifest 2.0 -manifestit, eli juuri ne, joita tämä ohje tuottaa.

Jaa `.vsix`-tiedosto opiskelijoille. Uutta pakettia tarvitaan vain, kun päivität laajennuksen uudempaan versioon tai vaihdat juuriavaimen. Uusi kurssi ei vaadi uutta pakettia.

### 6. Tallenna muutokset omaan haaraan

Muokattu `package.json` ja päivitetty tiivistelista ovat vain työkopiossasi. Tee niistä commit omaan haaraan, jotta ne säilyvät, kun haet uusia versioita Berkeleyn reposta:

```bash
git checkout -b jyu
git commit -am "JYU: oma laajennustunniste ja tiivistelista"
```

## Jokaiselle tehtävälle

Jokaisen tehtäväpohjan juureen tulee oma allekirjoitettu `.provenance-manifest`-tiedosto. Laajennus aloittaa tallennuksen vain kansiossa, jonka manifesti on allekirjoitettu kurssisi avaimella.

### 1. Kirjoita manifesti

Luo tehtäväpohjan juureen tiedosto `.provenance-manifest`:

```json
{
  "assignment_id": "tehtava3",
  "semester": "2026s",
  "issued_at": "2026-11-09T00:00:00Z",
  "files_under_review": ["tehtava3.py"],
  "course_id": "ties4080",
  "collaboration": "solo",
  "submission": "git",
  "scope": "directory",
  "policy": { "enrollment": { "required": false } }
}
```

| Kenttä                       | Sisältö                                                                                                                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assignment_id`              | Tehtävän yksilöivä tunniste. Sen on oltava jokaisessa tehtävässä eri, koska se estää vanhan tallennuksen käyttämisen uudessa tehtävässä.                                                                                                                  |
| `semester`                   | Lukukauden tunniste, esimerkiksi `2026s`. Vaihda se, kun käytät samaa tehtävää uudelleen.                                                                                                                                                                 |
| `issued_at`                  | Julkaisuaika ISO 8601 -muodossa UTC-aikana.                                                                                                                                                                                                               |
| `files_under_review`         | Tiedostot, joiden muutoksia VS Coden ohi laajennus valvoo. Opiskelijan itse luomat tiedostot tallentuvat lokiin silti, mutta niistä ei tunnisteta ulkoisia muutoksia.                                                                                     |
| `course_id`                  | Sama tunniste kuin kurssisertifikaatissa. Jos ne eroavat, allekirjoitus epäonnistuu.                                                                                                                                                                      |
| `collaboration`              | `solo` tai `group`.                                                                                                                                                                                                                                       |
| `submission`                 | `git`, kun loki palautetaan repossa, tai `bundle`, kun opiskelija palauttaa laajennuksen tekemän zip-paketin.                                                                                                                                             |
| `scope`                      | `directory` tai `repo`. README ei kerro tarkemmin eroa, joten kokeile ennen käyttöä, kumpi sopii tehtäviin, joissa opiskelija luo omia tiedostoja.                                                                                                        |
| `policy.enrollment.required` | Aseta `false`, ellei käytössäsi ole Provenance-palvelinta. Oletusarvolla `true` laajennus pyytää opiskelijaa rekisteröitymään palvelimelle. Tallennus toimii samoin kummallakin arvolla, mutta ilman rekisteröintiä loki ei yksin todista, kuka sen teki. |

`policy`-lohkossa voi myös säätää, mitä tallennetaan (esimerkiksi päätteen käyttö ja kohdistimen liikkeet). Oletuksena kaikki on päällä. Älä lisää kenttiä `sig` ja `course_cert`; allekirjoitustyökalu lisää ne.

### 2. Allekirjoita manifesti

```bash
PROVENANCE_COURSE_KEYPAIR_PATH=~/kurssi-2026s.json \
PROVENANCE_COURSE_CERT_PATH=~/ties4080-2026s.cert.json \
  npm run sign:manifest -- /polku/tehtava3-pohja/.provenance-manifest
```

Työkalu allekirjoittaa manifestin kurssiavaimella, liittää siihen kurssisertifikaatin ja tarkistaa koko ketjun juuriavaimesta manifestiin ennen kuin kirjoittaa tiedoston. Jos tarkistus epäonnistuu, tiedostoa ei kirjoiteta. Jos allekirjoitat manifestin uudelleen, vanha allekirjoitus ja sertifikaatti poistetaan automaattisesti.

### 3. Kokeile ennen julkaisua

Avaa tehtäväpohja VS Codessa, johon on asennettu oma `.vsix`-pakettisi. Tilarivillä pitää lukea **Provenance: recording**. Jos ei lue, tarkista, että kurssisertifikaatti on allekirjoitettu samalla juuriavaimella, joka on upotettu pakettiin, ja ettei sertifikaatin voimassaolo ole päättynyt.

## Palautus git-repon kautta

Loki kulkee repossa koodin mukana ilman erillistä palautusvaihetta. Laajennus pitää repon juuressa kahta asiaa: tehtäväpohjan mukana tulevaa `.provenance-manifest`-tiedostoa ja `.provenance/`-kansiota, johon loki kirjoittuu työn aikana. Kun opiskelija tekee commitin ja pushin normaalisti, loki lähtee mukana. Berkeleyn CS 61C -kurssi käyttää juuri tätä mallia.

Tehtäväpohjaa valmistellessa:

- Lisää allekirjoitettu manifesti tehtäväpohjan repon juureen ennen kuin opiskelijat kloonaavat tai haarauttavat sen.
- Varmista, ettei pohjan `.gitignore` sisällä `.provenance/`-kansiota eikä manifestia.
- Jos käytät tarkistusskriptiä tai CI-ajoa, voit tarkistaa samalla, että `.provenance/`-kansio on mukana palautuksessa. CS 61C vähentää 100 pistettä, jos loki puuttuu.

### gitlab.jyu.fi

1. Tee tehtäväpohjasta oma projekti kurssin ryhmään ja lisää allekirjoitettu `.provenance-manifest` sen juureen ennen kuin opiskelijoiden repot luodaan. Manifesti kulkee mukana, kun opiskelijan repo luodaan pohjasta haarauttamalla (fork) tai kloonaamalla.
2. Jos korjaat manifestia julkaisun jälkeen, opiskelijoiden jo luomissa repoissa on vanha versio. Silloin opiskelijoiden on haettava muutos pohjasta itse, joten allekirjoita manifesti valmiiksi ennen julkaisua.
3. Lokin olemassaolon voi tarkistaa kloonaamalla opiskelijoiden repot ja ajamalla jokaisessa `git ls-tree -d HEAD .provenance`. Tyhjä tulos tarkoittaa, että loki puuttuu.
4. Jos kurssin ryhmällä on käytössä CI-ajot, voit lisätä pohjan `.gitlab-ci.yml`-tiedostoon tarkistuksen `test -d .provenance`. Opiskelija näkee silloin heti pushin jälkeen, jos loki ei ole mukana. Selvitä ensin, onko gitlab.jyu.fi:ssä kurssiryhmille saatavilla CI-ajureita (runners).
5. Lokin koko kasvaa työn edetessä. Kokeile yhdellä pidemmällä tehtävällä, ettei repo kasva ongelmallisen suureksi.

Opiskelijoille kerrottavaa:

- Manifestia ja `.provenance/`-kansiota ei saa nimetä uudelleen, siirtää, muokata eikä poistaa.
- Parityössä kaikki koodi kirjoitetaan yhdellä koneella, jotta loki on yhtenäinen. Kirjoittajaa voi vaihtaa, mutta konetta ei.

Kokeile ennen käyttöönottoa, miten loki käyttäytyy, kun opiskelija tekee työtä kahdella eri koneella ja synkronoi niiden välillä gitillä (`git pull`). Lähteistä ei selviä, yhdistyvätkö kahden koneen lokit siististi.

## Lokien tarkastelu

Analyzerin offline-tila käsittelee lokit selaimessa, eikä lokien data lähde koneeltasi. Uusimmassa versiossa se kuitenkin vaatii kirjautumisen henkilökunnan tunnuksella, joten tarvitset Analyzerin palvelimen ja Google-kirjautumisen (Google OAuth) myös offline-tilaa varten.

```bash
npm run dev --workspace=packages/analyzer
```

Avaa selaimessa `http://localhost:5173/local/load` ja pudota sivulle zip-tiedosto. Analyzer näyttää muun muassa aikajanan, muokkausten toiston ja lokin eheystarkistuksen.

Offline-tila on tehty laajennuksen tekemälle palautuspaketille. Kokeile, kelpaako sille myös opiskelijan repo zip-tiedostoksi pakattuna. Jos ei kelpaa, opiskelijat voivat lisäksi tehdä paketin komennolla **Provenance: Prepare Submission Bundle** ja lisätä sen repoon.

Palvelin vaatii Dockerin ja PostgreSQL:n, ja sen syötteeksi on valmiina vain Gradescopen vientitiedosto. Käyttöönotto on kuvattu repon tiedostoissa `docs/dev-setup.md` ja `docs/admin-guide.md`. Selvitä ennen kurssin alkua, voiko Analyzeria ajaa omalla palvelimella yliopiston tietosuojakäytäntöjen mukaisesti ja onko Google-kirjautuminen sallittu.

## Muistettavaa

- Laajennus vaatii VS Coden version 1.100 tai uudemman.
- Jos opiskelijat tekevät työtä etäkoneella Remote-SSH:n kautta, laajennus on asennettava etäkoneen VS Code -istuntoon.
- Provenance on uusi ohjelmisto, ja se kehittyy nopeasti. Päivitä repo ajoittain ja käännä paketti uudelleen.
- Provenance on lisensoitu Apache 2.0 -lisenssillä, joten oman version jakaminen opiskelijoille on sallittua, kunhan lisenssi- ja NOTICE-tiedostot säilyvät mukana.
- Kerro opiskelijoille etukäteen, mitä loki sisältää ja milloin sitä luetaan. Käytännöistä kannattaa sopia yliopiston tietosuojavastaavan kanssa.

| Tiedosto                   | Salainen?       | Milloin tarvitaan                                                                                       |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| `root-keypair.json`        | Kyllä, erittäin | Uuden kurssisertifikaatin allekirjoitus ja laajennuksen kääntäminen (kääntämiseen riittää julkinen osa) |
| `kurssi-2026s.json`        | Kyllä           | Manifestien allekirjoitus                                                                               |
| `ties4080-2026s.cert.json` | Ei              | Manifestien allekirjoitus; kulkee jokaisen manifestin mukana                                            |

## Lähteet

- [ProvenanceTools/provenance, GitHub](https://github.com/ProvenanceTools/provenance)
- [Project 1, CS 61C, UC Berkeley](https://cs61c.org/fa26/projects/proj1/)
- [Lab 0: Getting Started, CS 61A, UC Berkeley](https://cs61a.org/fa26/labs/lab00/)
