# Migrationsplan: Debian 11 → 13 bei Erhalt von Plone 5.2.10

**Stand: 14.08.2026** · Server `lmkwitg-fblmu01.srv.mwn.de` (SSH-Alias `lakof`) ·
Website <https://www.lakof-bayern.de/>

Arbeitsdokument und Momentaufnahme. Es hält fest, was am 14.08.2026 vorgefunden,
entschieden und getan wurde, und wird nicht rückwirkend umgeschrieben — spätere
Entscheidungen bekommen ein eigenes Dokument.

---

## 1. Anlass

Debian 11 (bullseye) erreicht am **31.08.2026** das Ende des LTS-Supports. Das LRZ hat
angekündigt, die VM abzuschalten, wenn sie nicht auf eine unterstützte Version gehoben
wird. Am Tag dieses Dokuments bleiben **17 Tage**.

Die Aufgabe lautet: Debian aktualisieren, **ohne** dass die Plone-Website ausfällt.

---

## 2. Ausgangslage

### 2.1 System

| | |
|---|---|
| OS | Debian 11.11 (bullseye), Kernel 5.10.0-46 |
| Hardware | 1 vCPU, 3,8 GB RAM, **kein Swap**, 100 GB Platte (20 % belegt) |
| Plattform | VMware (open-vm-tools), LRZ-verwaltet über Paket `lrz-base` 6.4.3 |
| Paketquellen | `debian.mirror.lrz.de` — debian, debian-security, debian-lrz |
| Firewall | UFW aktiv: 80/443 offen, 22 nur aus LMU-Netzen |
| Monitoring | SplunkForwarder, `update-debian.sh` via `lrz-base.timer` (2×/Tag) |

### 2.2 Plone

Entgegen der ursprünglichen Annahme läuft Plone hier **nicht** auf Python 2.7:

| | |
|---|---|
| Plone | 5.2.10 |
| Zope | 4.8.3 |
| **Python** | **3.9.2** — das System-Python von Debian 11 |
| Eggs | 265 Stück unter `/usr/local/buildout-cache/eggs/cp39/` |
| Topologie | ZEO-Server (9090) + zeoclient1 (9082) + zeoclient2 (9083) |
| Prozessverwaltung | Supervisor mit `memmon`/`httpok` aus `superlance` |
| Add-ons | `lakof.theme` (Diazo, in `src/`), `plone.app.mosaic` 2.2.5, `collective.easyform` 3.0.5 |
| Buildout | `/opt/Plone/buildout.lakof`, auf Basis `starzel/buildout` 5.2.10 |
| Daten | `/srv/Plone/buildout.lakof/lakof` — Data.fs 100 MB, blobstorage 1,1 GB |
| Frontend | Apache 2.4 als Reverse Proxy, `VirtualHostBase`-Rewrite auf 9082 |
| Zertifikat | Let's Encrypt, `lakof-bayern.de` + `www.`, gültig bis 27.09.2026 |

Python 2.7 findet sich nur noch im **Supervisor-venv** `/usr/local/venv-supervisor`
(Python 2.7.16, `supervisor` + `superlance`). Das ist ein Prozessmanager, kein
Anwendungscode.

Der Serverstand des Buildouts entspricht bitgenau dem Commit `e662c30` dieses
Repositorys — geprüft am 14.08.2026. Der Buildout ist damit vollständig
rekonstruierbar.

### 2.3 Der Bruchpunkt

Das Buildout-venv zeigt über `/opt/Plone/buildout.lakof/bin/python3` auf
`/usr/bin/python3` — also auf das System-Python. Damit gilt:

- Debian 11 liefert Python **3.9** — die letzte Debian-Version, die das tut
- Debian 12 liefert Python **3.11**
- Debian 13 liefert Python **3.13**

Plone 5.2 unterstützt laut [Release Schedule](https://plone.org/download/release-schedule)
offiziell Python 2.7 und 3.8; dass es hier auf 3.9 läuft, ist ein *gemessener*
Ist-Zustand, keine zugesicherte Kombination. Auf 3.11 oder 3.13 läuft Zope 4 nicht.

**Ein Distributions-Upgrade zerstört die Plone-Installation, solange der Interpreter
nicht vom System entkoppelt ist.** Das ist der Kern dieser Migration.

Zusätzlich: `python2.7` existiert in Debian 12 nicht mehr — das Supervisor-venv muss
vor dem ersten Sprung ersetzt werden.

### 2.4 Vorgefundene Mängel

Unabhängig vom Debian-Thema:

1. **Keine laufende Datensicherung.** Der Cron-Eintrag
   `#37 2 * * * .../bin/backup --quiet` ist auskommentiert; das letzte reguläre Backup
   stammt vom **14.12.2021**. Ein TSM-Client ist nicht installiert. Einziges jüngeres
   Artefakt: ein manuelles `db_lakof_20250219.tar` — auf derselben Platte wie die
   Produktivdaten.
2. **Plone 5.2 ist end of life.** Security-Support endete am **31.10.2024**. Die
   Instanz läuft seit rund 22 Monaten ohne Sicherheitsaktualisierungen.
3. **Drei konkurrierende Update-Automatiken:** ein von Ansible eingetragener
   stündlicher `apt upgrade -y` in der root-Crontab, `update-debian.sh` 2×/Tag über
   `lrz-base`, dazu `apt-daily`/`apt-daily-upgrade`. Zusätzlich ein automatischer
   Reboot Mo–Fr 07:00.
4. **Rechteproblem im Backup-Baum.** `/opt/Plone/buildout.lakof/backup/lakof` gehört
   `plone_buildout` mit `drwxr-xr-x`; der als `plone_daemon` laufende Backup-Cron
   könnte dort gar nicht schreiben. Das ist vermutlich der Grund, warum er abgeschaltet
   wurde.
5. **Kein Rollback.** Weder VMware-Snapshot noch TSM verfügbar.
6. **Alarmmails** aus `memmon` gehen an `team@starzel.de` — die externe Agentur.
7. **Altlasten** (~2,8 GB): `db_lakof_20250219.tar`, zwei `lakof.tar.gz`, `db.tgz`,
   die cp37m-Eggs eines früheren Python-3.7-Stands, sowie eine verirrte 13-MB-Logdatei
   namens `disable` im Buildout-Wurzelverzeichnis.

---

## 3. Entscheidungen

| Frage | Entscheidung | Begründung |
|---|---|---|
| Plone 6 jetzt? | **Nein** — Brücke bauen | Migration 5.2 → 6.x mit Diazo-Theme, Mosaic und EasyForm ist in 17 Tagen nicht seriös abnehmbar |
| Interpreter | **uv-verwaltetes Python 3.8.20** (python-build-standalone) | Portabel (nur GLIBC_2.2.5), läuft unverändert auf Debian 11, 12 und 13. Zu 3.9 siehe unten |
| Plone-Stand | **5.2.10 bleibt** für die Brücke | Nur eine Variable wechseln. Der Sprung auf 5.2.15 ist erprobt und funktioniert im Kern, brachte aber zwei Viewlet-Regressionen; er folgt nach der Frist als eigener Schritt. Siehe [ADR 0001](../adr/0001-python-38-fuer-die-debian-bruecke.md) |
| Container? | **Später** | Sauberer, aber unter Zeitdruck zu viele bewegliche Teile; wird mit der Plone-6-Migration zusammengelegt |
| OS-Ziel | **Debian 13 (trixie)** | Debian 12 ist bereits aus dem regulären Support; ein Halt dort führte binnen Monaten zur nächsten Mahnung |
| Reihenfolge | **Plone zuerst entkoppeln, OS danach** | Andernfalls ist Plone nach dem ersten Sprung tot und wird unter Zeitdruck auf unbekanntem System repariert |
| Sicherungsziel | Arbeitsrechner, `/Volumes/Data2/lakof-migration/` | Kein TSM, kein Snapshot; sofort verfügbar |

**Warum 3.8 und nicht 3.9:** Zope 4.8.x deklariert `Requires-Python >=2.7, …, <3.9` und
schließt Python 3.9 damit ausdrücklich aus. Dass die Produktion trotzdem seit Jahren auf
3.9 läuft, liegt allein daran, dass das dort verwendete Werkzeugpaar
(`zc.buildout 2.13.8` / `setuptools 42.0.2`) das Feld nicht auswertete. Der von Plone
5.2.15 für Python 3 verlangte `zc.buildout 3.0.1` wertet es aus und verweigert die
Installation. Statt die Grenze weiter zu umgehen, gehen wir auf die letzte Version, für
die alle Metadaten stimmen.

Folge für später: Plone 6.0 verlangt Python ≥3.9. Der Weg zu Plone 6 umfasst daher einen
Interpreter-Wechsel; er lässt sich nicht wie ursprünglich gedacht auf demselben
Interpreter fahren.

### Zielarchitektur

```
Debian 13 (trixie)              System-Python 3.13  ── von Plone nicht genutzt
  │
  ├─ /opt/python/cpython-3.8.20-linux-x86_64-gnu   (uv, portabel, GLIBC_2.2.5)
  │      └─ /opt/Plone/buildout.lakof/bin/python3
  │              ├─ zeoserver   127.0.0.1:9090
  │              ├─ zeoclient1  127.0.0.1:9082
  │              └─ zeoclient2  127.0.0.1:9083
  │
  ├─ Supervisor  ── Python 3, nicht mehr das 2.7-venv
  └─ Apache 2.4  ── unverändert
```

Unverändert bleiben: Datenverzeichnis, Apache-Vhosts, Let's Encrypt, Ports, die
Benutzer `plone_daemon` und `plone_buildout`. Der Eingriff beschränkt sich darauf,
**worauf der Interpreter zeigt**.

---

## 4. Phasenplan

| Phase | Inhalt | Umkehrbar | Stand |
|---|---|---|---|
| 0 | Sicherung, Aufräumen, Automatik zähmen | — | teilweise erledigt |
| 1 | Machbarkeitsnachweis an einer Kopie, Nebenports | folgenlos | offen |
| 2 | Produktion auf uv-Python 3.9 umstellen (noch Debian 11) | ✅ | offen |
| 3 | Supervisor vom Python-2.7-venv lösen | ✅ | offen |
| 4 | Debian 11 → 12, Buildout neu bauen, prüfen | ❌ | offen |
| 5 | Debian 12 → 13, Buildout neu bauen, prüfen | ❌ | offen |
| 6 | Aufräumen, Datensicherung dauerhaft einschalten, dokumentieren | — | offen |

**Phase 2 ist die tragende Absicherung.** Sie ist der letzte umkehrbare Schritt, weil
das alte, gegen `/usr/bin/python3.9` gebaute venv unangetastet daneben liegen bleibt.
Erst wenn Plone nachweislich auf dem uv-Interpreter läuft, wird das unumkehrbare
OS-Upgrade angefasst.

### Phase 0 — Stand 14.08.2026

**Erledigt:**

- Systeminventar: Paketstände (`dpkg --get-selections`, `apt-mark showmanual`),
  Crontabs aller Nutzer, systemd-Timer, UFW-Regeln, Netzkonfiguration, Dienste
- Konsistente ZODB-Sicherung über `bin/snapshotbackup` — erst `repozo` auf Data.fs,
  dann `rsync` der Blobs. Diese Reihenfolge stellt sicher, dass jeder von Data.fs
  referenzierte Blob in der Sicherung vorhanden ist. Kein Dienst wurde gestoppt,
  keine Downtime.
- Archive erzeugt, auf den Arbeitsrechner übertragen, Größen gegen den Server geprüft:

  | Archiv | Größe |
  |---|---:|
  | `lakof-zodb-snapshot-2026-08-14.tar.gz` | 1,07 GB |
  | `lakof-buildout-cache-2026-08-14.tar.gz` | 564 MB |
  | `lakof-buildout-2026-08-14.tar.gz` | 32 MB |
  | `lakof-venv-supervisor-2026-08-14.tar.gz` | 8,4 MB |
  | `lakof-etc-2026-08-14.tar.gz` | 731 KB |

  Serverseitig unter `/var/tmp/lakof-migration-2026-08-14/`, lokal unter
  `/Volumes/Data2/lakof-migration/2026-08-14/`, jeweils mit `SHA256SUMS`.

- **Sicherung verifiziert:** alle fünf SHA-256-Prüfsummen der lokalen Kopien stimmen
  mit den serverseitig erzeugten überein. Die Sicherung ist damit bestätigt und trägt
  als Rückfalllinie für die Phasen 4 und 5.

**Offen:**

- **Update-Automatik zähmen:**

  ```
  # root-Crontab, die beiden von Ansible eingetragenen Zeilen auskommentieren:
  #   @hourly apt upgrade -y
  #   @hourly apt update
  mv /etc/cron.d/lrz-base-automatic-reboot{,.disabled-lakof-migration}
  systemctl disable --now lrz-base-automatic-reboot.timer
  ```

  Der Ist-Zustand ist in `automation-state-before.txt` protokolliert, die
  Original-Crontab in `root-crontab.orig`. Das LRZ-Monitoring (`lrz-base.timer`)
  bleibt bewusst aktiv, damit die VM beim LRZ nicht als ungepflegt gilt; es wird erst
  für die eigentlichen Upgrade-Fenster stillgelegt und danach sofort wieder
  eingeschaltet.

### Phase 1 — Machbarkeitsnachweis · durchgeführt am 14.08.2026

Aufbau unter `/opt/Plone/buildout.lakof-test`, eigener Egg-Cache
(`/opt/buildout-cache-test`), Ports 91xx statt 90xx, eigenes `var/`. Die Produktion
blieb durchgehend erreichbar und wurde zu keinem Zeitpunkt angefasst.

**Was trägt:**

| Prüfung | Ergebnis |
|---|---|
| Portabler Interpreter | CPython 3.8.20 via uv, benötigt nur **GLIBC_2.2.5** — Debian 11/12/13 liefern 2.31/2.36/2.41. Damit ist die OS-Unabhängigkeit **gemessen**, nicht angenommen |
| Buildout-Lauf | fehlerfrei; alle Skripte und parts erzeugt |
| C-Extensions | kommen als **manylinux-Wheels** (BTrees, persistent, cffi …), bringen ihre Bibliotheken mit und sind damit OS-unabhängig. Das ursprünglich größte Restrisiko entfällt weitgehend |
| Plone-Start mit Produktionsdaten | Instanz startet, Startseite rendert (HTTP 200), `@@ok` liefert OK |
| ZODB-Upgrade 5.2.10 → 5.2.15 | Probelauf und echter Lauf fehlerfrei: fünf Schritte, Profil 5218 → 5223, „Your Plone instance is now up-to-date" |
| Theme und Add-ons | `lakof.theme` aktiv, EasyForm und Mosaic installiert |

**Drei Befunde, die den Bau zunächst verhinderten** — alle behoben und im Repository
festgehalten:

1. **`constraints.txt` pinnte die Python-2.7-Werkzeuge.** Plone 5.2.15 pinnt
   `zc.buildout`/`setuptools`/`wheel` getrennt nach `[versions:python27]` und
   `[versions:python3]`; bei 5.2.10 gab es nur den einen Satz. Mit den alten Werten
   upgradete Buildout sich endlos selbst und startete neu (38 Durchläufe, bis der
   Prozess gestoppt wurde). Korrigiert auf `setuptools==65.7.0`, `zc.buildout==3.0.1`,
   `wheel==0.38.4`.
2. **Zope 4.8 verlangt Python <3.9** — führte zur Entscheidung für 3.8, siehe oben.
3. **`collective.easyform 3.0.5` hat ein defektes Wheel auf PyPI**: Es ist
   `py2-none-any` getaggt, offenbar unter Python 2 gebaut. Auf Python 3 fällt der Bau
   deshalb auf das sdist zurück; modernes setuptools benennt das Egg dann nach PEP 625
   `collective_easyform-…`, während zc.buildout `collective.easyform-…` sucht — der
   Lauf endet in einem `AssertionError`. 3.0.4 davor und 3.1.0 bis 3.2.1 danach haben
   korrekte `py3`-Wheels. Pin auf **3.2.1** gehoben, die letzte 3.x mit
   Plone-5.2-Deklaration.

**Was noch nicht trägt — offen vor Phase 2:**

Nach dem Upgrade auf 5.2.15 brechen **zwei Viewlets**, die in der Produktion (5.2.10)
fehlerfrei rendern:

```
error while rendering lakof.leadimage.full
error while rendering plone.htmlhead.socialtags
```

Die Seite liefert weiterhin HTTP 200 und den vollständigen Inhalt; es fehlen das
Kopfbild und die Open-Graph-Metadaten. Beide Viewlets erzeugen Bildskalierungen.
Eingegrenzt ist bisher:

- Die Skalierung selbst funktioniert: `getMultiAdapter((obj, request), name='images')`
  und `scale('image', width=1420, height=300, direction='down')` liefern ein gültiges
  `ImageScale` samt `<img>`-Tag.
- `Pillow 6.2.2` ist im Test identisch ausgestattet wie in der Produktion (jpg, zlib,
  libtiff, webp, freetype2 jeweils vorhanden).
- `plone.scale` ist in 5.2.10 und 5.2.15 dieselbe Version (3.1.2).
- **`ILeadImage.providedBy(obj)` liefert `False`** für die Startseite, obwohl das
  Objekt ein `NamedBlobImage` trägt. Das Viewlet in
  `src/lakof.theme/src/lakof/theme/browser/viewlets.py` überspringt das Objekt deshalb.
  Ob daraus der Renderfehler folgt oder ob er im Template `decoration.pt` entsteht, ist
  noch nicht geklärt.

Ein Traceback ließ sich bisher nicht gewinnen: `plone.app.viewletmanager` fängt
Viewlet-Fehler ab, das Plone-Fehlerprotokoll bleibt leer, und auch mit `debug-mode on`
erscheint nur der Kommentar im HTML.

**Nebenbefund:** Das Event-Log der Instanz landet in einer Datei namens `disable` im
Arbeitsverzeichnis des jeweiligen Client-Parts. Ursache ist eine Fehlkonfiguration —
`plone.recipe.zope2instance` nimmt den Wert der Option als *Dateinamen*, wo jemand das
Log abschalten wollte. Das erklärt die 13-MB-Datei `disable` im Wurzelverzeichnis des
Produktions-Buildouts und den Umstand, dass es keine `instance.log` gibt. Gehört in
Phase 6 geradegezogen.

### Phase 1 — ursprünglicher Plan (zur Nachvollziehbarkeit)

Auf derselben VM, in einem eigenen Verzeichnis, ohne Berührung der Produktion:

1. `uv` bereitstellen und `uv python install 3.9` nach `/opt/python` legen.
   Verfügbar ist derzeit CPython **3.9.25**. Falls der Server GitHub nicht erreicht,
   wird das Tarball vom Arbeitsrechner hochgeladen.
2. Kopie des Buildouts anlegen, venv gegen den uv-Interpreter erzeugen.
3. `bin/buildout` gegen den lokalen `buildout-cache` laufen lassen.
4. Instanz auf **Nebenports** starten, gegen eine Kopie der ZODB.
5. Prüfen: Startet Zope? Rendert die Startseite? Greift das Diazo-Theme? Funktionieren
   Mosaic-Seiten und EasyForm-Formulare? Läuft die Anmeldung?

**Dies ist der Punkt, an dem der Plan steht oder fällt.** Trägt er nicht, muss auf den
Container-Weg umgeschwenkt werden — und das will man wissen, solange noch Zeit dafür
ist.

Zu beobachten: die C-Extensions. Ein Teil der Eggs ist gegen
Debian-11-Systembibliotheken gelinkt, vor allem `lxml` (libxml2/libxslt, für Diazo
unverzichtbar) und `Pillow`. Nach jedem OS-Sprung müssen diese entweder neu übersetzt
werden — dafür `build-essential` plus die passenden `-dev`-Pakete — oder durch
manylinux-Wheels für cp39 ersetzt werden, die ihre Bibliotheken mitbringen.

### Phasen 2 bis 5 — durchgeführt in der Nacht vom 14. auf den 15.08.2026

Alle vier Schritte sind erledigt. Der Endstand:

| | vorher | nachher |
|---|---|---|
| Betriebssystem | Debian 11.11 | **Debian 13.6 (trixie)** |
| Kernel | 5.10.0-46 | 6.12.101+deb13 |
| System-Python | 3.9.2 | 3.13.5 |
| glibc | 2.31 | 2.41 |
| Plone-Interpreter | System-Python 3.9.2 | **portables CPython 3.8.20** aus `/opt/python` |
| Prozessmanager | Supervisor 4.2.1 auf Python 2.7.16 | **Supervisor 4.3.0 auf Python 3.8** |
| Plone | 5.2.10, Zope 4.8.3 | unverändert 5.2.10, Zope 4.8.3 |
| Website | 26.266 Bytes, 0 Renderfehler | **identisch** |

**Was sich bewährt hat.** Der portable Interpreter hat *beide* Distributionswechsel
unverändert überstanden — von glibc 2.31 über 2.36 auf 2.41. Das war die tragende Wette
des Plans, und sie ist aufgegangen; am System-Python wäre Plone zweimal gestorben.

Phase 3 zahlte sich unmittelbar aus: Nach dem Reboot auf Debian 12 lief der Supervisor
sofort. Das alte Python-2.7-venv wäre dort ins Leere gelaufen, denn `python2.7` gibt es ab
Debian 12 nicht mehr — und ohne Prozessmanager wäre auch Plone unten geblieben.

**Der eine Bruch.** Nach dem Sprung auf Debian 12 starteten die Zope-Clients nicht:

```
ImportError: libtiff.so.5: cannot open shared object file
  ← Pillow-6.2.2-py3.8-linux-x86_64.egg/PIL/_imaging
```

`Pillow` war gegen Debian 11s `libtiff.so.5` und `libwebp.so.6` gelinkt; Debian 12 liefert
`.so.6` und `.so.7`. Von **18 Eggs mit C-Extensions war genau dieses eine betroffen** — die
übrigen linken nur gegen glibc und libstdc++ und sind damit abwärtskompatibel. Behoben
durch Entfernen des Eggs aus dem Cache und einen Buildout-Lauf, Dauer unter fünf Minuten.

Beim zweiten Sprung trat der Fehler **nicht** erneut auf: Trixie führt dieselben SONAMEs
wie Bookworm. Plone lief nach dem Reboot sofort.

Hier bewährten sich die Versions-Pins: Nach dem Neubau liefen exakt dieselben Paketstände
wie vorher. Ohne sie wäre nicht zu unterscheiden gewesen, ob ein Fehler vom Betriebssystem
oder von stillschweigend gewechselten Paketen kommt.

**Weitere Beobachtungen**

- Das Paket-Upgrade auf Debian 12 hat die zuvor stillgelegten Timer (`lrz-base`,
  `apt-daily*`) **wieder aktiviert**. Vor dem zweiten Sprung mussten sie erneut
  abgeschaltet werden; wer das übersieht, bekommt mitten im `full-upgrade` einen zweiten
  apt-Lauf.
- `python2.7` blieb als verwaistes Debian-11-Paket zurück und wurde entfernt. Weitere Reste
  (`libssl1.1`, `libruby2.7`, `python3.9-*`) hängen noch an Abhängigkeiten und blieben
  bewusst stehen.
- In Debian 13 wird `/tmp` standardmäßig ein tmpfs im RAM. Bei 3,8 GB ohne Swap wären das
  bis zu 1,9 GB, die Plone fehlen — und Zope legt beim Hochladen temporäre Kopien dort ab.
  `tmp.mount` wurde vor dem Reboot maskiert, `/tmp` bleibt auf der Platte.
- Bei den dpkg-Rückfragen wurden die lokalen Fassungen von `/etc/sudoers` (enthält
  `%sudo ALL=(ALL:ALL) NOPASSWD: ALL`) und `/etc/default/ufw` behalten. Mit den
  Paketvarianten wäre der passwortlose Verwaltungszugang verloren gewesen.
- `apt modernize-sources` überführte die Quellen ins deb822-Format, verlor dabei aber die
  LRZ-Komponente `tsm`. Sie wurde in `/etc/apt/sources.list.d/lrz.sources` ergänzt, damit
  der Backup-Client `tivsm-ba` installierbar bleibt.

### Phase 2 — ursprünglicher Plan (zur Nachvollziehbarkeit)

1. Wartungsfenster ankündigen.
2. Supervisor-Gruppe stoppen.
3. Bestehendes venv als `bin.debian-python39` beiseitelegen — **nicht löschen**.
4. venv gegen den uv-Interpreter neu erzeugen, Buildout laufen lassen.
5. Dienste starten, Prüfliste abarbeiten.
6. Bei Fehlschlag: zurück auf das alte venv, Dienste starten, neu bewerten.

### Phase 3 — Supervisor lösen

Das venv `/usr/local/venv-supervisor` läuft auf Python 2.7, das es in Debian 12 nicht
mehr gibt. Zwei Wege:

- **Debian-Paket `supervisor`** (Python 3). Einfach, aber `superlance` — Quelle von
  `memmon` und `httpok` — muss separat bereitgestellt werden.
- **venv auf Python 3 neu aufbauen** mit `supervisor` + `superlance` aus PyPI. Näher am
  Bestand, hält die `eventlistener`-Konfiguration unverändert.

Zu klären: ob `superlance` in einer Fassung vorliegt, die zu einem aktuellen Supervisor
passt. Bei dieser Gelegenheit sollte die Empfängeradresse der Alarmmails von
`team@starzel.de` auf eine LMU-Adresse gezogen werden.

### Phasen 4 und 5 — die Distributions-Upgrades

Nach LRZ-Doku ([Debian-VM](https://doku.lrz.de/debian-vm-11481178.html),
[auf 12](https://doku.lrz.de/upgrade-auf-debian-12-bookworm-35882194.html),
[auf 13](https://doku.lrz.de/upgrade-auf-debian-13-trixie-1921298568.html)). Ein
Direktsprung von 11 auf 13 ist nicht unterstützt.

Je Schritt:

1. `etckeeper` installieren, damit `/etc`-Änderungen nachvollziehbar bleiben.
2. Sicherung auffrischen und **abziehen**.
3. Automatik vollständig stilllegen, einschließlich `lrz-base.timer` und `cron`.
4. `apt update && apt full-upgrade` auf dem alten Stand, dann Reboot.
5. Paketquellen umschreiben.
6. `apt upgrade --without-new-pkgs`, dann `apt full-upgrade`, dann Reboot.
7. Buildout neu bauen, Dienste prüfen.
8. Automatik wieder einschalten.

**Fallstricke aus der LRZ-Doku, die hier zutreffen:**

*Auf Debian 12:*

- `systemd-resolved` ist ein eigenes Paket geworden und wird **nicht** automatisch
  mitinstalliert. Es ist vor dem `full-upgrade` explizit zu installieren, sonst fällt
  die Namensauflösung aus. Auf lakof läuft `systemd-resolved` — der Fall trifft zu.
- Neue Komponente `non-free-firmware` in den Paketquellen ergänzen.
- LRZ-Repo-Schlüssel auf `signed-by` umstellen.
- PEP 668 verbietet ab Python 3.11 `pip` in den globalen Interpreter. Für uns ohne
  Belang, da Plone in einem venv auf eigenem Interpreter läuft.

*Auf Debian 13:*

- Neuer LRZ-GPG-Schlüssel, Fingerabdruck
  `A0D98AE0F9140A82D8E1D209ECB9C1905AD42837`, Ablage unter `/usr/share/keyrings`.
- Der TSM-Client zieht von `non-free` in eine eigene Komponente `tsm` um.
- **`/tmp` wird tmpfs**, standardmäßig bis zur Hälfte des RAM. Bei 3,8 GB und ohne Swap
  ist das ernst zu nehmen: Zope legt temporäre Dateien dort ab. Verhalten nach dem
  Reboot prüfen, notfalls über `systemctl edit tmp.mount` begrenzen oder `tmp.mount`
  maskieren.
- Erwartete Endstände: Kernel `6.12.41+deb13`, `/etc/debian_version` = `13.0`.
- Anschließend `apt modernize-sources` auf das deb822-Format.

**Zusätzlich für lakof:**

- Vor dem Reboot sicherstellen, dass ein **zweiter Zugangsweg** besteht (LRZ-Konsole
  über vSphere). SSH oder UFW können durch das Upgrade unbrauchbar werden, und die
  VPN-Strecke ist erfahrungsgemäß nicht verlässlich.
- Apache-Konfiguration prüfen: `Order deny,allow` und `Deny from all` stammen aus
  `mod_access_compat` und sind seit Langem abgekündigt.
- `certbot` über den Versionswechsel im Auge behalten; das Zertifikat läuft am
  27.09.2026 ab.
- Nicht am Freitag. Zwischen den beiden Sprüngen mindestens einen Werktag Beobachtung.

### Phase 6 — Nacharbeiten

**Erledigt am 15.08.2026:**

- **Datensicherung läuft wieder — erstmals seit dem 14.12.2021.** Die Ursache war nie der
  auskommentierte Cron-Eintrag, sondern ein Rechteproblem darunter: Der Backup-Lauf
  gehört `plone_daemon`, das Zielverzeichnis aber `plone_buildout:plone_group` mit
  `drwxr-xr-x` — die Gruppe durfte nicht schreiben. Es *hätte gar nicht funktionieren
  können*; jemand hat daraufhin die Cron-Zeile stillgelegt statt die Ursache zu suchen.
  Behoben durch `g+w` samt setgid auf dem Backup-Baum, verifiziert mit einem Probelauf
  als `plone_daemon`. Der Cron-Eintrag läuft wieder täglich um 02:37.
- **Update-Automatik vollständig reaktiviert**: `lrz-base`, `lrz-base-kernel-check`,
  `apt-daily`, `apt-daily-upgrade`, `certbot`, `cron` — und der **automatische Reboot**
  (`/etc/cron.d/lrz-base-automatic-reboot`, Mo–Fr 07:00 mit 30 Minuten Streuung). Zum
  Zeitpunkt der Reaktivierung stand kein Reboot an, und der laufende Kernel war der
  neueste installierte. Die eigentliche Update-Arbeit erledigt `/etc/cron.d/lrz-base`
  (täglich 2 und 12 Uhr sowie nach jedem Boot); die gleichnamigen systemd-Timer zeigen
  deshalb kein `NEXT`, was bereits vor der Migration so war.
- **Noch stillgelegt:** die beiden von Ansible eingetragenen Zeilen in der root-Crontab
  (`@hourly apt upgrade -y` und `@hourly apt update`). Sie sind redundant zur
  LRZ-Automatik, und ein stündliches unbeaufsichtigtes Upgrade ist unüblich. Da sie aus
  einem Ansible-Playbook stammen, kehren sie beim nächsten Lauf zurück — die Entscheidung
  gehört daher ins Playbook, nicht in die Crontab.
- **Status-Panel eingerichtet.** `terminal-status-panel` 0.7.0 als systemweites uv-Tool
  unter `/opt/uv-tools`, Einbindung über `/etc/profile.d/zz-terminal-status-panel.sh` mit
  dem Panel `server`. Das Snippet prüft `case $- in *i*)` und bleibt bei nicht-interaktiven
  Sitzungen still — `scp` und `rsync` wurden gegengeprüft. Laufzeit 1,2 s.

**Weiterhin offen:**

- **TSM** ist beantragt, die Beschaffung liegt bei einem anderen Administrator (Stand
  15.08.2026). Die Paketquelle auf lakof ist vorbereitet, der Client heißt `tivsm-ba`.
  Bis dahin gilt: Die lokale Sicherung liegt auf derselben Platte wie die Produktivdaten
  und ersetzt keine Offsite-Sicherung.
- Altlasten entfernen (~2,8 GB), inklusive der verirrten `disable`-Datei.
- `/etc` unter `etckeeper` belassen.
- Alarmmails auf eine LMU-Adresse umstellen.
- Betriebsdokumentation in `docs/` schreiben.

---

## 5. Restrisiken

| Risiko | Wirkung | Umgang |
|---|---|---|
| Kein Rollback für Phase 4/5 | Bei Fehlschlag Neuaufbau statt Rückkehr | Sicherung so vollständig, dass eine frische VM daraus rekonstruierbar ist |
| C-Extensions brechen nach OS-Sprung | Plone startet nicht | In Phase 1 vorab klären; Wheels als Ausweichweg |
| Nur 1 vCPU, 3,8 GB RAM, kein Swap | Buildout-Läufe langsam; `/tmp` als tmpfs in Trixie kritisch | Läufe einplanen; `tmp.mount` nach dem Upgrade prüfen |
| VPN-Abrisse | Arbeitsschritte brechen mitten im Lauf ab | Lange Läufe in `screen`/`tmux`; zweiter Zugangsweg |
| Plone 5.2 ohne Security-Support | Bleibt auch nach der Brücke bestehen | Zeitlich befristen — siehe Abschnitt 6 |
| Python 3.9 ist selbst EOL (seit Okt. 2025) | dito | dito |

---

## 6. Nach der Brücke

Die Brücke rettet die Frist, sie behebt nicht die Substanz: Plone 5.2 und Python 3.9
sind beide abgekündigt. Der Anschluss sollte terminiert werden, nicht vertagt.

Zielbild ist **Plone 6.x**. Bemerkenswert ist dabei, dass **Plone 6.0 die Python-Spanne
3.9 bis 3.13 abdeckt** — es ist damit die einzige Version, die sowohl auf dem
eingefrorenen 3.9 als auch auf dem System-Python von Debian 13 läuft. Das erlaubt, die
Plone-Migration und den Interpreter-Wechsel voneinander zu trennen, statt beides in
einem Schritt zu wagen:

1. Auf dem uv-Python 3.9 von Plone 5.2.10 auf 6.0 migrieren.
2. Danach den Interpreter auf das System-Python 3.13 heben.
3. Erst dann auf 6.1 oder 6.2 nachziehen.

Alle Plone-6-Minor-Versionen haben Security-Support bis **31.12.2027**.

---

## 7. Verweise

- LRZ: [Debian-VM](https://doku.lrz.de/debian-vm-11481178.html) ·
  [Upgrade auf 12](https://doku.lrz.de/upgrade-auf-debian-12-bookworm-35882194.html) ·
  [Upgrade auf 13](https://doku.lrz.de/upgrade-auf-debian-13-trixie-1921298568.html)
- Plone: [Release Schedule und Policy](https://plone.org/download/release-schedule)
- Debian: [Release Notes bookworm](https://www.debian.org/releases/bookworm/amd64/release-notes/)
