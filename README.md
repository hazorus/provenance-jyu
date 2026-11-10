# Provenance Analyzer (JYU) – valmis selainversio

Tässä haarassa on vain valmiiksi rakennettu Analyzer, joka toimii mistä tahansa
web-palvelimen kansiosta (esimerkiksi Apache). Lähdekoodi ja ohjeet ovat haarassa
[`jyu`](https://github.com/hazorus/provenance-jyu/tree/jyu).

| Tiedosto | Rakennettu | SHA-256 |
| --- | --- | --- |
| [provenance-analyzer.zip](https://github.com/hazorus/provenance-jyu/raw/analyzer/provenance-analyzer.zip) | `jyu` @ `a99213d` | `a610e778c103266df82ed2b9aea576518679b2ef41e487c8bcb76ec1aeaf8958` |

## Käyttöönotto

```bash
curl -LO https://github.com/hazorus/provenance-jyu/raw/analyzer/provenance-analyzer.zip
unzip provenance-analyzer.zip -d ~/public_html/
```

Avaa selaimessa kansion `provenance-analyzer/` osoite. Asetuksia,
`.htaccess`-tiedostoa tai Node.js:ää ei tarvita.

- **Analyze bundles:** pudota opiskelijan repo-zip (GitLab: Download zip).
- **Compose manifest:** luo ja allekirjoita tehtävän manifesti selaimessa.

Lokit käsitellään selaimessa eivätkä ne lähde koneelta. Versio ei kysy
kirjautumista: jos kansio näkyy internetiin, rajaa pääsy web-palvelimella
(esimerkiksi `Require ip` tai yliopiston kirjautuminen). Toistonäkymän editori
ladataan osoitteesta `cdn.jsdelivr.net`.

Versioon on upotettu JYU:n juuriavaimen julkinen osa
`1432603d08c93282725d899dd459cb5c9b6d723fff2362945b2eb11fef921f27` ja
hyväksyttyjen laajennustiivisteiden lista rakennushetkellä. Kun lista tai
juuriavain muuttuu, rakenna uusi zip komennolla
`npm run build:local --workspace=packages/analyzer` ja pakkaa
`packages/analyzer/dist`-kansion sisältö.
