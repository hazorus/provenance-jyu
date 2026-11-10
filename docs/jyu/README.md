# Provenance JYU:lla (TIES4080)

Tämä hakemisto kuvaa JYU:n käyttöönoton. Haara `jyu` eroaa upstreamista
(`ProvenanceTools/provenance`) seuraavasti:

- laajennuksen tunniste on `jyu-tjlahton.provenance-recorder-jyu-it`, jotta
  Marketplacen Berkeley-versio ei korvaa sitä automaattipäivityksessä
  (`packages/recorder/package.json`, `package-lock.json`);
- recorder tunnistaa itsensä `context.extension`-kentästä eikä kovakoodatusta
  tunnisteesta (`packages/recorder/src/extension.ts`), joten lokiin
  tallentuu oikea `extension_id` ja versio;
- Analyzerin hyväksyttyjen laajennustiivisteiden listassa on JYU:n VSIX
  (`packages/analysis-core/src/heuristics/config/known-good-extension-hashes.json`).

## Lataa laajennus

[provenance-recorder-jyu-it-2.0.3.vsix](https://github.com/hazorus/provenance-jyu/raw/vsix/provenance-recorder-jyu-it-2.0.3.vsix)
(SHA-256 `60160bbe196352f194b7f2006c8194b47f1e14b75a545dcea30dc152a11844d3`).
Kaikki versiot tarkistussummineen ovat
[`vsix`-haarassa](https://github.com/hazorus/provenance-jyu/tree/vsix).

## Mallivideot

- [Opiskelija: asennus ja käyttö (1 min 39 s)](https://github.com/hazorus/provenance-jyu/raw/videot/provenance-opiskelija.mp4)
- [Opettaja: manifestin luonti ja lokien tarkastelu (1 min 59 s)](https://github.com/hazorus/provenance-jyu/raw/videot/provenance-opettaja.mp4)

Kaikki videot tarkistussummineen ovat
[`videot`-haarassa](https://github.com/hazorus/provenance-jyu/tree/videot).

## Ohjeet

- [Opiskelijan ohje](opiskelijan-ohje.md)
- [Opettajan käyttöönotto-ohje](opettajan-ohje.md)

Ohjeiden muokattava alkuperäinen on Claude Docs -dokumentti; nämä ovat
kopioita 2026-11-10 tilanteesta, ja niihin on päivitetty alla olevien
selvitysten tulokset.

## Uusi VSIX jokaisen recorder-muutoksen jälkeen

Tiiviste (`extension_hash`) lasketaan laajennuksen `dist/`-hakemistosta, joten
jokainen recorderin koodimuutos vaatii uuden paketin ja uuden tiivisteen
allowlistiin. Rakenna paketti ja tiiviste samalla kertaa:

```bash
PROVENANCE_ROOT_PUBLIC_KEY_HEX=1432603d08c93282725d899dd459cb5c9b6d723fff2362945b2eb11fef921f27 \
  npm run update-hashes
```

Rakentamiseen riittää juuriavaimen julkinen osa. Nosta ennen rakentamista
versionumero tiedostoissa `packages/recorder/package.json` ja
`package-lock.json`; pelkkä versionumero ei muuta tiivistettä.

Jaa opiskelijoille juuri se `.vsix`, josta tiiviste laskettiin: lisää se
`vsix`-haaraan ja päivitä latauslinkki tähän tiedostoon ja opiskelijan
ohjeeseen. Vanhan
tiivisteen voi poistaa (`node scripts/update-extension-hash-allowlist.mjs
--remove <hex>`), kun kukaan ei enää käytä vanhaa pakettia.

## Analyzer omalla koneella ilman kirjautumista

JYU-haarassa Analyzerin voi rakentaa versioksi, joka sisältää vain selaimessa
toimivan `/local`-näkymän ilman kirjautumista ja palvelinta. Lokit eivät lähde
koneelta. Rakenna ja käynnistä repon juuressa:

```bash
npm run build:local --workspace=packages/analyzer
```

```bash
npm run preview --workspace=packages/analyzer
```

Avaa selaimessa `http://localhost:4173/` ja pudota opiskelijan repo-zip
sivulle. Skripti ottaa asetukset tiedostosta
`packages/analyzer/.env.jyu-local`: `VITE_LOCAL_ONLY=true` ja juuriavaimen
julkinen osa `VITE_ROOT_PUBLIC_KEY_HEX`. Jos juuriavain vaihtuu, päivitä se
sinne.

Versio toimii myös mistä tahansa web-palvelimen kansiosta, esimerkiksi Apachen
käyttäjäkansiosta. Kopioi rakennuksen tulos kansioon ja avaa kansion osoite
selaimessa:

```bash
cp -r packages/analyzer/dist/. ~/public_html/provenance/
```

Uudelleenohjaussääntöjä tai `.htaccess`-tiedostoa ei tarvita, koska näkymät
ovat osoitteen #-osassa (esimerkiksi `…/provenance/#/local/load`). Palvelin vain
jakaa tiedostot; lokit käsitellään selaimessa eivätkä ne lähde koneelta.

Valmiiksi rakennettu versio: [provenance-analyzer.zip](https://github.com/hazorus/provenance-jyu/raw/analyzer/provenance-analyzer.zip)
([`analyzer`-haara](https://github.com/hazorus/provenance-jyu/tree/analyzer)). Pura se web-palvelimen kansioon ja avaa
kansion `provenance-analyzer/` osoite; Node.js:ää ei tarvita.

Versio ei kysy kirjautumista. Jos kansio näkyy internetiin, kuka tahansa voi
käyttää sitä omien tiedostojensa tarkasteluun. Rajaa pääsy tarvittaessa Apachen
pääsynhallinnalla (esimerkiksi `Require ip` tai yliopiston kirjautuminen).

Sama versio sisältää välilehden **Compose manifest**, jolla tehtävän
manifestin voi luoda ja allekirjoittaa selaimessa. Kurssiavain valitaan
tiedostona, luetaan vain allekirjoituksen ajaksi eikä lähde koneelta. Tulos on
tavu tavulta sama kuin `npm run sign:manifest` -komennon.

## Selvitetyt avoimet kysymykset

### `scope: "repo"` vai `"directory"`?

Arvo vain jäsennetään, allekirjoitetaan ja näytetään Analyzerissa; recorder
ja analyysi eivät käytä sitä mihinkään (`recorder-context.ts` kutsuu sitä
"still-open format decision"). Käytä `"directory"`.

Opiskelijan itse luomat tiedostot tallentuvat lokiin (avaukset, muutokset,
tallennukset, liitokset), mutta ulkoisten muutosten tunnistus ja
tiedostokohtaiset heuristiikat koskevat vain `files_under_review`-listaa.
Listaa siis kaikki arvioitavat tiedostot, myös apumoduulit, jos ne kuuluvat
arvioitavaan työhön.

### Toimiiko loki, kun opiskelija työskentelee kahdella koneella?

Toimii. `"submission": "git"` -manifestilla recorder pitää jokaisen session
allekirjoitettua sinettiä (`.provenance/manifest-<session>.json/.sig`) ajan
tasalla koko ajan, eikä erillistä "Prepare Submission Bundle" -vaihetta
tarvita. Jokainen sessio kirjoittaa vain omiin tiedostoihinsa
(`session-<uuid>.slog`), joten kahden koneen lokit eivät ole ristiriidassa.
Recorder kirjoittaa `.provenance/.gitattributes`-tiedoston (`* -text`), joka
estää gitiä muuttamasta rivinvaihtoja ja rikkomasta allekirjoituksia.

Mitä voi silti näkyä Analyzerissa:

- `multiple_sessions_overlap`, jos VS Code on auki kahdella koneella yhtä
  aikaa (rekisteröitymättömälle opiskelijalle matala vakavuus);
- `inter_session_external_change`, jos toisella koneella aloitetaan vanhasta
  työkopiosta tai edellisen koneen muutoksia ei pushattu;
- `external_edits`, jos `git pull` ajetaan kesken session: oman työn
  vetäminen näkyy ulkoisena muutoksena;
- `extension_hash_mismatch`, jos koneilla on eri recorder-versiot.

Ohje opiskelijoille: sulje VS Code (tai kansio) ensimmäisellä koneella,
tee commit ja push, aja toisella koneella `git pull` **ennen** kansion
avaamista, ja käytä molemmilla koneilla samaa `.vsix`-pakettia.

### Hyväksyykö Analyzer repon zip-tiedostona?

Hyväksyy. Palvelimen ingest (`POST /api/v1/semesters/:id/ingest`) tunnistaa
zipin, jossa on `.provenance/`-hakemisto missä tahansa syvyydessä, joten
GitLabin "Download zip" kelpaa sellaisenaan ylimmän kansion kanssa. Palvelin
kokoaa siitä bundlen: lokit ja sinetit sekä sinetöidyt palautustiedostot.
Muut tiedostot jätetään pois.

- Käytä oletusarvoista scope-tilaa `self_identifying`. Älä valitse
  `repo_whole`: GitLabin ylimmän kansion takia se hylkää zipin.
- Yksi zip, jossa on opiskelijoiden repo-zipit, käy erätuontina.
- Opiskelija tunnistetaan tiedostonimestä lukukauden
  `filename_convention`-säännöllä, jossa on `(?<sid>…)`-ryhmä. Nimeä zipit
  esim. `<opiskelijatunnus>.zip` ja käytä sääntöä `^(?<sid>[^/.]+)`.
  Tunnistamattomat päätyvät "unmatched"-listaan.
- `/local`-näkymä hyväksyy myös repo-zipit. Palvelinversiossa se vaatii
  henkilökunnan Google-kirjautumisen, local-only-versiossa ei (ks. yllä).
- Palvelimelle on määritettävä juuriavaimen julkinen osa, muuten Manifest
  2.0 -tarkistukset eivät toimi täysin.
