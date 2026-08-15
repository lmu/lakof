# Machbarkeitsnachweis: Plone 5.2.10 → 6.2.1

**Stand: 15.08.2026** · Server `lmkwitg-fblmu01.srv.mwn.de` (SSH-Alias `lakof`) ·
Website <https://www.lakof-bayern.de/>

Arbeitsdokument und Momentaufnahme. Es hält fest, was am 15.08.2026 erprobt und gemessen
wurde, und wird nicht rückwirkend umgeschrieben — spätere Entscheidungen bekommen ein
eigenes Dokument.

Vorgänger: [2026-08-14-debian-13-migration.md](2026-08-14-debian-13-migration.md) —
die Brücke auf Debian 13 unter Beibehaltung von Plone 5.2.10.
Entscheidung aus diesem Dokument:
[ADR 0002](../adr/0002-direktsprung-auf-plone-62.md).

---

## 1. Anlass und Frage

Die Brücke vom 14./15.08.2026 hat die Frist gerettet, nicht die Substanz: Plone 5.2 ist
seit dem 31.10.2024 ohne Security-Support, Python 3.8 seit Oktober 2024. Der Anschluss
sollte terminiert werden.

Zwei Fragen waren zu beantworten:

1. Trägt `starzel/buildout` einen Plone-6.2-Stand, und laufen unsere Add-ons darauf?
2. Übersteht die Produktionsdatenbank den Sprung — und was kostet er?

Beides wurde an **Wegwerf-Aufbauten** geprüft, ohne Berührung von Produktion oder
Repository. Kein Ergebnis dieses Tages ist ein Produktionskandidat.

---

## 2. Aufbau

| | |
|---|---|
| Buildout | `starzel/buildout` Tag `6.2.1` (= `master` am 15.08.2026) |
| Plone | 6.2.1, veröffentlicht 26.06.2026 |
| Python | CPython 3.13.15 — dasselbe Minor wie das System-Python von Debian 13 |
| Datenquelle | `lakof-zodb-snapshot-2026-08-14.tar.gz`, SHA-256 vor Gebrauch geprüft |
| Arbeitsort | `/Volumes/Data2/lakof-migration/plone62-test/` (APFS, 1,8 TB frei) |

Das Backup-Archiv wurde ausschließlich **gelesen**. Die Rückfalllinie aus dem
Vorgängerdokument ist unangetastet.

Wiederherstellung der Daten:

```bash
tar xzf lakof-zodb-snapshot-2026-08-14.tar.gz          # -> snapshotbackups/
bin/zopepy -c "import sys; sys.argv=['repozo','-R','-r','<snapshotbackups/filestorage>',
              '-o','var/filestorage/Data.fs']; from ZODB.scripts import repozo; repozo.main()"
mv snapshotbackups/blob/blobstorage.*/blobstorage var/blobstorage
```

Ergebnis: `Data.fs` 100.109.836 Bytes, 9.582 Blob-Dateien (1,0 GB) — deckungsgleich mit
dem im Vorgängerdokument dokumentierten Umfang.

---

## 3. Der Unterbau trägt

Plone 6.2.1 baut auf Python 3.13 fehlerfrei durch: 282 Pakete, alle C-Erweiterungen als
`cp313`-Wheels, nichts wird übersetzt. Eine leere Site liefert HTTP 200 ohne
Renderfehler, Classic UI, kein Volto.

Die Umstellung im Buildout ist im Kern **eine Zeile** — die `extends`-URL von
`5.2.10/linkto/base.cfg` auf `6.2.1/linkto/base.cfg`. Der ganze Pin-Schmerz aus der
Brücke entfällt: `constraints.txt` zeigt bei 6.2.1 nur noch auf
`dist.plone.org/release/6.2.1/requirements.txt`.

### 3.1 Add-ons

Alle drei sind für 6.2 verfügbar und deklarieren `Framework :: Plone :: 6.2`:

| Paket | heute | für 6.2 | Installation in leerer Site |
|---|---|---|---|
| `plone.app.mosaic` | 2.2.5 | **4.0.0** | fehlerfrei |
| `collective.easyform` | 3.2.1 | **5.0.1** | fehlerfrei |
| `Products.validation` | 2.1.3 | **4.0.1** | (Abhängigkeit) |

`plone.app.mosaic` und `Products.validation` sind von Plone 6.2.1 bereits gepinnt.
`collective.easyform` nicht — es braucht drei Projekt-Pins, weil
`allow-picked-versions = false` gilt:

```ini
[versions]
collective.easyform = 5.0.1
openpyxl = 3.1.5     # XLSX-Export der Formulardaten, neu in easyform 5.x
et-xmlfile = 2.0.0   # transitiv über openpyxl
```

### 3.2 Änderungen in starzels base.cfg, die uns betreffen

- **Prozessverwaltung von Supervisor auf systemd** umgestellt (`site_unit`,
  `zeoserver_unit`, `zeoclient_unit`, dazu `run.sh`). Das berührt Phase 3 der
  Brückenmigration und will beim Umstieg mitgedacht werden.
- `event-log = disable` steht unverändert in `zeoclient-base`. Unsere
  Per-Client-Überschreibung aus `local_production.cfg` muss mitgenommen werden, sonst
  kehrt die Logdatei namens `disable` zurück.

---

## 4. Das Theme trägt nicht

`lakof.theme` lässt sich installieren, aber nur nach einem Eingriff, und liefert danach
**nicht** das LAKOF-Design. Drei Befunde, aufeinander aufbauend:

1. **`plone.lessvariables` bricht die Installation ab.** Der Eintrag in
   `profiles/default/registry.xml` stammt aus der LESS-Ära von Plone 5; Classic UI 6
   baut auf Bootstrap-5-SCSS und kennt das Feld nicht:
   `ValueError: Cannot find a field for the record plone.lessvariables`.

2. **`[theme:parameters]` fehlt in der `manifest.cfg`.** Barcelonetas Regeln in Plone 6
   enthalten `<notheme if="$ajax_load" />` und definieren `$ajax_load` in ihrer *eigenen*
   `manifest.cfg`. `lakof.theme` bindet die Regeln per `xi:include` ein, bringt den
   Parameterblock aber nicht mit. Folge: `notheme` greift immer. Das Theme gilt im
   Control Panel als aktiv und tut trotzdem nichts — **lautlos**, mit HTTP 200, ohne
   Log-Eintrag und ohne Diazo-Fehlermeldung. Das war der zeitraubendste Befund des Tages.

3. **Danach greift Barceloneta, nicht LAKOF.** Das `<theme href="index.html" />` stammt
   aus den eingebundenen Barceloneta-Regeln und löst gegen deren Basis auf. Gemessen am
   Ergebnis: `offcanvasNavbar`, `portal-globalnav-wrapper`, `navbar-barceloneta` sind
   vorhanden, LAKOFs eigene `content-container`/`column1-container` nicht — geladen wird
   `barceloneta.min.css` statt `default.ce2fa80.css`.

Das ist kein Konfigurationsdetail mehr. Der Webpack-Aufbau unter `theme_resources/` ist
Plone-5-Technik: Glyphicons, `col-xs-12` (Bootstrap 3), eine Diazo-Regel für RequireJS
`config.js`, kompilierte Mockup-Bundles. Classic UI 6 ist Bootstrap 5 mit Patternslib,
ohne RequireJS.

**Das Frontend des Themes wird neu gebaut, nicht portiert.**

Die Python-Seite dagegen hält: alle fünf `z3c.jbot`-Overrides finden ihre Zielvorlagen in
6.2 noch (`listing_summary.pt`, `summary_view.pt`, `listing_view.pt`, `event_view.pt`,
`logo.pt`), der Monkeypatch auf `FolderView.tabular_fields` ebenfalls, Viewlets und
Behaviors laden. Nur Deprecation-Warnungen: `IPloneSiteRoot` und `INonInstallable` sind
nach `plone.base.interfaces` gewandert.

---

## 5. Die Daten

### 5.1 Bestand

716 Katalogeinträge, ausschließlich Dexterity (`plone.app.contenttypes`) — **keine
Archetypes-Altlast**:

| Typ | Anzahl |
|---|---:|
| File | 330 |
| Image | 91 |
| News Item | 86 |
| Folder | 81 |
| Document | 58 |
| Event | 53 |
| Collection | 11 |
| EasyForm | 6 |

Profilstände vor der Migration: `Products.CMFPlone:plone` = **5218** (Plone 5.2.10),
`lakof.theme:default` = 1005, `plone.app.mosaic:default` = 5028,
`collective.easyform:default` = 1007.

### 5.2 Der Upgrade-Pfad ist durchgängig

`plone.app.upgrade` 4.1.0 (mit Plone 6.2.1 ausgeliefert) enthält die Profilpakete `v52`,
`v60`, `v61` und `v62`. Die scheinbare Lücke zwischen Zielstand 5219 und Quellstand 5299
ist keine: `Products.GenericSetup.upgrade._extractStepInfo` fällt fürs **Auflisten** auf
nicht-striktes Versions-Matching zurück. `versionMatch` selbst arbeitet mit `strict=True`
und steuert damit nur, ob ein Schritt vorangekreuzt ist. Ein Direktsprung 5.2.10 → 6.2.1
ist also maschinell vorgesehen — und wurde an unseren Daten bestätigt.

### 5.3 81 nicht ladbare Records

`bin/zodbverify -f var/filestorage/Data.fs` (Laufzeit knapp 3 Sekunden) findet vor der
Migration 81 Records, die Plone 6.2 nicht laden kann. Sie zerfallen in drei Gruppen:

**a) Plone-5-Altlasten** — vom Upgrade selbst abgeräumt:

| Referenz | Vorkommen |
|---|---:|
| `Products.CMFQuickInstallerTool.InstalledProduct` | 52 |
| `Products.CMFDefault.MetadataTool` | 21 |
| `Products.CMFPlone.PropertiesTool` | 7 |
| `Products.CMFEditions.StandardModifiers` (AT-Modifier) | 4 |
| `Products.CMFPlone.interfaces.controlpanel.ITinyMCESpellCheckerSchema` | 4 |
| `Products.CMFFormController.*` | 6 |
| `Products.PloneLanguageTool`, `Products.ZODBMountPoint`, `Products.ResourceRegistries`, `Products.CMFPlone.MetadataTool` | je 1–2 |

**b) 33 Python-2-Artefakte in der `mimetypes_registry`.** Die Glob-Muster liegen dort als
*kompilierte* Regexe der Form `.*\.class\Z(?ms)` — mit den globalen Flags am **Ende**. So
erzeugte sie `fnmatch.translate()` in **Python 2.7** (`return res + '\Z(?ms)'`); ab
Python 3.6 schreibt CPython die moderne Form `(?s:…)\Z`. Seit Python 3.11 ist die alte
Form ein harter `re.PatternError` statt einer Deprecation-Warnung.

Das ist **kein Plone-Problem, sondern ein Python-Versionsproblem.** Es hätte die Brücke
auf Debian 13 genauso getroffen, wäre sie nicht bewusst auf Python 3.8 geblieben. Diese
Records haben die py2→py3-Migration der Site vor Jahren überlebt.

**c) Zwei Fremdkörper:**

- `ftw.footer.interfaces.IFooterSettings` — ein Registry-Eintrag (`columns_count`,
  „Footer Columns count") eines Add-ons, das irgendwann entfernt wurde, ohne die Registry
  aufzuräumen.
- `plone.app.upgrade.bbb.ITinyMCE` — siehe nächster Abschnitt.

### 5.4 Der Blocker

```
Couldn't load state for zope.component.persistentregistry.PersistentAdapterRegistry
AttributeError: type object 'ITinyMCE' has no attribute '__iro__'
```

Die Site hat ein Werkzeug `portal_tinymce` als **lokale Utility** unter dem Interface
`plone.app.upgrade.bbb.ITinyMCE` registriert — ein Überbleibsel aus der
`Products.TinyMCE`-Ära (Plone 4). Das Modul `plone.app.upgrade.bbb` gab es in der
5.2-Linie von `plone.app.upgrade` (2.x); in 4.x ist es weg. ZODB setzt dafür ein
*Broken*-Platzhalterobjekt ein, und das ist kein Interface.

**Wirkung: Totalblockade.** Die persistente Komponenten-Registry lädt nicht, damit
scheitert jede Utility-Abfrage — auch `queryUtility(IRegistry)` —, damit lässt sich weder
ein Upgrade starten noch eine Seite ausliefern.

Plone kennt das Muster und löst es für den QuickInstaller mit
`plone.app.upgrade.utils.alias_module` und einem `bbb_qi`-Paket. Für `bbb` gibt es kein
Gegenstück.

---

## 6. Der Probelauf

Mit einem nachgebauten `bbb`-Modul (Kopie der Namen aus `plone.app.upgrade` 2.1.8) lief
die Migration durch:

```
instance version   : 5218  ->  6204
filesystem version : 6204
needs upgrading    : False
```

Danach waren noch drei Dinge zu tun, bis die Seite vollständig auslieferte. Alle drei
gehören in den echten Plan.

### 6.1 Katalog-Metadatenspalte `mime_type`

Während des Upgrades scheiterte `plone.app.upgrade.utils.update_catalog_metadata` mit
einem `ComponentLookupError` auf `IIndexableObject`. Folge: die Plone-6-Spalte
`mime_type` fehlt. Plones Navigationsportlet
(`plone.app.portlets/portlets/navigation_recurse.pt`) rendert für jede gelistete `File`
ein Mimetype-Symbol über `icons.tag(f'mimetype-{item.mime_type}')`. Fehlt die Spalte,
läuft der Zugriff per Acquisition ins Leere:

```
AttributeError: 'RequestContainer' object has no attribute 'mime_type'
```

Drei Ordner antworteten deshalb mit HTTP 500. Behoben durch erneutes Ausführen des
`catalog`-Importschritts aus `Products.CMFPlone:plone` (37 → 30 Spalten: acht veraltete
Plone-5-Spalten entfernt, `mime_type` ergänzt) und `refreshCatalog`.

### 6.2 …und danach zwingend der Event-Index

Der Core-Katalogschritt ersetzt `start` und `end` durch gewöhnliche `DateIndex` — so
deklariert Plone 6.2 sie in seiner `catalog.xml`. `plone.app.event` 6.0.1 braucht dort
aber einen `DateRecurringIndex`:

```python
# plone/app/event/browser/event_summary.py
num = len(idx["start"]) - len(self.next_occurrences)   # TypeError bei DateIndex
```

Ergebnis: **alle 53 Termine antworteten mit HTTP 500.**

Der Fallstrick: `plone.app.event` legt diese Indizes in einem **Setup-Handler** an
(`plone/app/event/setuphandlers.py`), nicht über eine `catalog.xml`. Ein erneuter Lauf
seines GenericSetup-Profils holt sie deshalb **nicht** zurück — der Handler muss
nachgebildet werden:

```python
class extra:
    recurdef = "recurrence"
    until = ""

for name in ("start", "end"):
    if catalog._catalog.getIndex(name).meta_type == "DateIndex":
        catalog.delIndex(name)
    catalog.addIndex(name, "DateRecurringIndex", extra=extra())
catalog.addIndex("sync_uid", "FieldIndex")
catalog.clearFindAndRebuild()
```

**Reihenfolgeregel für den echten Plan:** erst der Core-Katalogschritt, dann die
Indizes der Add-ons wiederherstellen, dann neu aufbauen. Umgekehrt oder ohne den zweiten
Schritt bleibt die Terminverwaltung tot.

### 6.3 Endstand des Probelaufs

Vollständiger Crawl über alle 388 URLs der Sitemap, anonym:

| | |
|---|---|
| HTTP 200 | **388 von 388** |
| Viewlet-Renderfehler | **0** |
| Exceptions im Instanz-Log | **0** |
| Katalogeinträge | 704 (von 716; 12 verwaiste Brains beim Neuaufbau entfallen) |

Die Seite läuft. Inhalte, Navigation, Termine, Formulare und Dateien werden ausgeliefert.

### 6.4 Was noch offen blieb

Die Add-ons wurden **nicht** aktualisiert. Mosaics Registry zeigt weiterhin auf das
Plone-5-Bundle `plone-logged-in` und auf Ressourcen, die es nicht mehr gibt — 776
Warnungen pro Seitenaufruf:

```
Bundle 'mosaic' has a nonexistent dependency on 'plone-logged-in'
Could not find resource ++plone++mosaic/mosaic-grid.js
```

Ob die Mosaic-Seiten den Sprung 2.2.5 → 4.0.0 inhaltlich überstehen, ist damit **noch
nicht geprüft**. Das ist der nächste sinnvolle Schritt.

---

## 7. Warum die Bereinigung in Plone 5.2 stattfindet

Der Probelauf hat sein eigenes Gegenargument geliefert. Nach der Migration stand in der
Datenbank:

```
ModuleNotFoundError: No module named 'lakof_bbb': 2
```

Das Upgrade hat die tote Registrierung **nicht entfernt**, sondern auf den Namen des
Wegwerf-Moduls umgeschrieben. Die Datenbank war ohne diese Attrappe nicht mehr
startfähig; die Registrierung musste in einem zweiten Schritt eigens abgemeldet werden.

|  | nachträglich in 6.2 | vorher in 5.2 |
|---|---|---|
| Methode | Attrappen für gelöschte Klassen | Plones eigene Deinstallationswege |
| Prüfbarkeit | „läuft durch" | `zodbverify` muss sauber sein — messbar |
| Wiederholbarkeit | Skript voller Sonderfälle | ein Reinigungsschritt, dann Standard-Migration |
| Rückfall | keiner, die Attrappen sind eingeflossen | frisches Backup **nach** der Reinigung |

In Plone 5.2 sind `Products.TinyMCE`, `CMFFormController`, `PloneLanguageTool` und die
AT-Modifier **noch als Code vorhanden**. Dort abzumelden ist ein normaler Vorgang; in 6.2
ist es Rekonstruktion.

Siehe [ADR 0002](../adr/0002-direktsprung-auf-plone-62.md).

### 7.1 Reinigungsliste für die 5.2-Seite

Vor dem frischen Backup zu erledigen:

1. `portal_tinymce` abmelden und löschen — **der Blocker**
2. `ftw.footer`-Registry-Reste entfernen (`IFooterSettings`)
3. Registry-Reste von `ResourceRegistries`, `IEventSettings`,
   `ITinyMCESpellCheckerSchema`
4. AT-Modifier in `portal_modifier`: `RetainATRefs`, `NotRetainATRefs`, `SkipBlobs`,
   `CloneBlobs`
5. `portal_metadata`, `portal_properties`, `portal_languages`, `portal_quickinstaller`
   (52 `InstalledProduct`-Objekte) und die `CMFFormController`-Reste
6. Die 13 verwaisten Katalogeinträge
7. `mimetypes_registry` neu registrieren — auf Python 3.8 schreibt Plone die 33
   Python-2-Regexe in der modernen Form zurück

**Abnahmekriterium:** `zodbverify` muss danach von 81 auf nahe null fallen. Messbar,
nicht „läuft schon".

Das Reinigungsskript gehört ins Repository und wird **vor** dem Einsatz auf der
Produktion gegen eine Kopie geprüft. Dafür lässt sich eine 5.2-Umgebung aus diesem
Repository plus dem gesicherten `buildout-cache` auf uv-Python 3.8 nachbauen.

---

## 8. Vorgeschlagene Reihenfolge

| Schritt | Inhalt | Ort |
|---|---|---|
| 1 | Reinigungsskript schreiben, gegen eine Kopie prüfen | lokal, Plone 5.2 / Python 3.8 |
| 2 | Reinigung auf der Produktion, `zodbverify` als Abnahme | Produktion, Wartungsfenster |
| 3 | **Frisches Backup**, abgezogen | Produktion |
| 4 | Migration an der Kopie: 5.2.10 → 6.2.1, dann Katalog, dann Event-Indizes | lokal |
| 5 | Add-on-Upgrades, Mosaic-Seiten inhaltlich prüfen | lokal |
| 6 | Theme neu bauen oder Barceloneta 6 anpassen | eigenes Vorhaben |
| 7 | Umstellung der Produktion, Interpreter auf System-Python 3.13 | Produktion |

Schritt 6 ist der Posten, der sich ohne eine Gestaltungsentscheidung nicht schätzen
lässt.

---

## 9. Restrisiken und Vorbehalte

| Risiko | Umgang |
|---|---|
| Gemessen auf macOS/arm64, nicht auf Debian 13/amd64 | Vor Schritt 7 auf der Zielplattform wiederholen |
| Mosaic-Inhalte 2.2.5 → 4.0.0 ungeprüft | Schritt 5, an echten Mosaic-Seiten |
| Theme ist ein Neubau, Aufwand offen | Eigenes Vorhaben, eigene Schätzung |
| Die Testdatenbank vom 15.08.2026 ist **kein** Produktionskandidat | Attrappe war zwischenzeitlich eingeflossen, Katalogeingriffe teils in falscher Reihenfolge und korrigiert |

---

## 10. Verweise

- Plone: [Release Schedule und Policy](https://plone.org/download/release-schedule) —
  Security-Support für alle 6.x bis 31.12.2027
- [`starzel/buildout`](https://github.com/starzel/buildout), Tag `6.2.1`
- [`plone.app.upgrade`](https://github.com/plone/plone.app.upgrade), Tag `4.1.0`
- [`zodbverify`](https://pypi.org/project/zodbverify/) — Werkzeug für Abschnitt 5.3
- CPython: `fnmatch.translate` in
  [2.7](https://github.com/python/cpython/blob/2.7/Lib/fnmatch.py) gegenüber
  [3.8](https://github.com/python/cpython/blob/3.8/Lib/fnmatch.py)
