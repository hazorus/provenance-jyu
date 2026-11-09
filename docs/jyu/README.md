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

Ohjeet:

- [Opiskelijan ohje](opiskelijan-ohje.md)
- [Opettajan käyttöönotto-ohje](opettajan-ohje.md)

Ohjeiden muokattava alkuperäinen on Claude Docs -dokumentti; nämä ovat
kopioita 2026-11-09 tilanteesta, ja niihin on päivitetty alla olevien
selvitysten tulokset.

## Uusi VSIX jokaisen recorder-muutoksen jälkeen

Tiiviste (`extension_hash`) lasketaan laajennuksen `dist/`-hakemistosta, joten
jokainen recorderin koodimuutos vaatii uuden paketin ja uuden tiivisteen
allowlistiin. Rakenna paketti ja tiiviste samalla kertaa:

```bash
npm run update-hashes -- --root-keypair ~/root-keypair.json
```

Jaa opiskelijoille juuri se `.vsix`, josta tiiviste laskettiin. Vanhan
tiivisteen voi poistaa (`node scripts/update-extension-hash-allowlist.mjs
--remove <hex>`), kun kukaan ei enää käytä vanhaa pakettia.

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
- `/local`-näkymä hyväksyy myös repo-zipit, mutta vaatii palvelimen ja
  henkilökunnan Google-kirjautumisen (`RequireAuth` + `RequireStaff`).
  Kirjautuminen hyväksyy vain `AUTH_ALLOWED_HOSTED_DOMAINS`-asetuksen
  Google Workspace -domainit.
- Palvelimelle on määritettävä juuriavaimen julkinen osa, muuten Manifest
  2.0 -tarkistukset eivät toimi täysin.
