# Betrieb

Wie die Installation auf `lmkwitg-fblmu01.srv.mwn.de` (SSH-Alias `lakof`) aufgebaut ist
und wie man sie bedient. Beschreibt den aktuellen Stand und wird fortgeschrieben.

## Aufbau

```
Debian 13 (trixie)          System-Python 3.13  ── von Plone NICHT genutzt
  │
  ├─ /opt/python/cpython-3.8-linux-x86_64-gnu     portables CPython 3.8.20
  │      └─ /opt/Plone/buildout.lakof             Buildout und venv in einem
  │              ├─ zeoserver        127.0.0.1:9090
  │              ├─ zeoclient1       127.0.0.1:9082
  │              ├─ zeoclient2       127.0.0.1:9083
  │              └─ zeoclient_debug  127.0.0.1:9084  (nicht dauerhaft aktiv)
  │
  ├─ /usr/local/venv-supervisor-py38              Supervisor 4.3.0 + superlance
  └─ Apache 2.4                                   Reverse Proxy, VirtualHostBase
```

| | |
|---|---|
| Anwendung | Plone 5.2.10, Zope 4.8.3 |
| Add-ons | `lakof.theme` (Diazo, in `src/`), `plone.app.mosaic`, `collective.easyform` |
| Daten | `/srv/Plone/buildout.lakof/lakof`, eingehängt als `var/` im Buildout |
| Egg-Cache | `/usr/local/buildout-cache/eggs/cp38` |
| Website | <https://www.lakof-bayern.de/> |

**Der Interpreter liegt bewusst außerhalb der Paketverwaltung.** Plone 5.2 läuft weder auf
dem Python 3.13 von Debian 13 noch auf dem 3.11 von Debian 12. Das portable CPython aus
`/opt/python` — bereitgestellt über `uv` — hat die Distributions-Upgrades von Debian 11
über 12 auf 13 unverändert überstanden. Die Begründung steht in
[ADR 0001](adr/0001-python-38-fuer-die-debian-bruecke.md).

## Dienste steuern

Alle Prozesse laufen unter Supervisor:

```bash
sudo supervisorctl status
sudo supervisorctl restart zeoclients:zeoclient1 zeoclients:zeoclient2
sudo supervisorctl restart zeoserver
```

Die Instanzen werden von `httpok` überwacht (Neustart, wenn `@@ok` nicht antwortet) und von
`memmon` (Neustart bei Speicherüberschreitung, Alarmmail). Deren Konfiguration steht in
`/etc/supervisor/conf.d/lakof.conf` — **diese Datei wird von Hand gepflegt**, nicht vom
Buildout erzeugt; die `supervisor-parts` sind in `local_production.cfg` auskommentiert.
Wer dort etwas ändert, muss es auf dem Server tun.

## Logs

```
/srv/Plone/buildout.lakof/lakof/log/zeoclient1.log     Event-Log der Instanz
/srv/Plone/buildout.lakof/lakof/log/zeoclient2.log
/srv/Plone/buildout.lakof/lakof/log/zeoserver.log
/var/log/supervisor/                                   stdout/stderr der Prozesse
/var/log/apache2/lakof/                                Zugriffe und Fehler des Vhost
```

Bis August 2026 schrieben die Instanzen ihr Event-Log in eine Datei namens `disable` im
jeweiligen `parts/`-Verzeichnis — die starzel-Basiskonfiguration setzt
`event-log = disable`, was `plone.recipe.zope2instance` als *Dateinamen* liest. Das ist
korrigiert; sollte nach einem Buildout-Neubau wieder eine Datei `disable` auftauchen, ist
die Einstellung in `local_production.cfg` verloren gegangen.

## Buildout neu bauen

Nötig nach jedem Distributions-Upgrade und nach Änderungen an den `.cfg`-Dateien:

```bash
sudo supervisorctl stop zeoclients:zeoclient1 zeoclients:zeoclient2
cd /opt/Plone/buildout.lakof
sudo -u plone_buildout ./bin/buildout -c buildout.cfg
sudo supervisorctl start zeoclients:zeoclient1 zeoclients:zeoclient2
```

`SyntaxError` zu `zodbpickle/tests/pickletester_2.py` und `SyntaxWarning` aus
`plone.app.contenttypes` sind normal — Python-2-Testdateien, die beim Byte-Compile-Schritt
nicht übersetzbar sind.

### Nach einem Distributions-Upgrade

Pakete mit C-Extensions sind gegen Systembibliotheken gelinkt. Ändert sich deren SONAME,
startet Zope nicht mehr. Beim Sprung auf Debian 12 traf das `Pillow`
(`libtiff.so.5` → `.so.6`). So findet man die Betroffenen:

```bash
for egg in /usr/local/buildout-cache/eggs/cp38/*linux-x86_64.egg; do
  miss=$(find "$egg" -name "*.so" -exec ldd {} \; 2>/dev/null | grep "not found" | sort -u)
  [ -n "$miss" ] && echo "$(basename $egg): $miss"
done
```

Das betroffene Egg aus dem Cache entfernen und den Buildout laufen lassen — sonst wird die
kaputte Fassung wiederverwendet. Voraussetzung sind `build-essential` und die passenden
`-dev`-Pakete (`libxml2-dev`, `libxslt1-dev`, `libjpeg-dev`, `libtiff-dev`, `zlib1g-dev`,
`libssl-dev`, `libffi-dev`).

## Versions-Pins

`pinned_versions_project.cfg` nagelt fünf Pakete fest, die Plone 5.2.10 floaten lässt:
`AccessControl`, `RestrictedPython`, `Zope`, `plone.namedfile` und `plone.restapi`.

Das ist keine Vorsichtsmaßnahme, sondern eine Notwendigkeit. Ohne die Pins zieht jeder
Neubau die jeweils neuesten Fassungen — und bei `plone.restapi` führt das in die falsche
Reihe: Die Linien 7.x und 8.x laufen **parallel**, nicht nacheinander. 8.x zielt auf
Plone 6, während 7.x bis Mai 2025 für Plone 5.2 gepflegt wurde. Mit 8.x wird die
Mosaic-Startseite als `text/plain` ausgeliefert und rendert nicht mehr.

`constraints.txt` pinnt die Buildout-Werkzeuge passend zu Plone 5.2.10. Beim Wechsel auf
5.2.15 müssen sie mitgezogen werden — dort gibt es getrennte Sätze für Python 2.7 und
Python 3; nimmt man die falschen, aktualisiert Buildout sich endlos selbst und startet neu.
Die Werte stehen als Kommentar in der Datei.

## Datensicherung

```
täglich 02:37   bin/backup   (Crontab von plone_daemon)
```

Sicherungen liegen unter `backup/lakof/backups/`, Blobs über Hardlinks
(`--link-dest`), es werden die letzten zwei vollständigen Stände gehalten. Ein
eigenständiger Stand lässt sich jederzeit ziehen:

```bash
sudo -u plone_daemon /opt/Plone/buildout.lakof/bin/snapshotbackup -n
```

Das läuft im laufenden Betrieb; erst `repozo` auf die `Data.fs`, dann `rsync` der Blobs. In
dieser Reihenfolge, damit jeder von der `Data.fs` referenzierte Blob in der Sicherung
vorhanden ist.

**Die Sicherung liegt auf derselben Platte wie die Produktivdaten.** Ein Offsite-Backup
über TSM ist beantragt; die Paketquelle ist vorbereitet, der Client heißt `tivsm-ba`.

Das Backup lief zwischen Dezember 2021 und August 2026 **nicht**. Ursache war nicht die
auskommentierte Cron-Zeile, sondern ein Rechteproblem darunter: Der Lauf gehört
`plone_daemon`, das Zielverzeichnis aber `plone_buildout:plone_group` ohne
Gruppenschreibrecht. Wer den Backup-Baum neu anlegt, braucht dort `g+w` und setgid.

## Plattenplatz-Überwachung

```
täglich 06:17   /usr/local/sbin/check-disk-usage.sh   (/etc/cron.d/check-disk-usage)
```

Meldet per Mail an `Alexander.Loechel@verwaltung.uni-muenchen.de`, sobald ein Dateisystem
**80 %** überschreitet. Geprüft werden `/` und `/boot/efi`.

Die Meldung enthält die `df`-Ausgabe, die zwölf größten Verzeichnisse und einen Hinweis auf
die üblichen Verursacher auf diesem Server. Damit eine dauerhaft volle Platte nicht täglich
mailt, merkt sich das Skript unter `/var/lib/check-disk-usage/` den Wert der letzten
Warnung und meldet sich erst wieder, wenn die Belegung um **weitere 5 Punkte** gestiegen
ist. Fällt sie unter die Schwelle, kommt einmalig eine Entwarnung.

Quelle und Cron-Eintrag liegen unter [`scripts/`](../scripts/) im Repository — beides muss
bei einem Neuaufbau des Servers wieder ausgerollt werden:

```bash
sudo install -m 0755 scripts/check-disk-usage.sh /usr/local/sbin/check-disk-usage.sh
sudo install -m 0644 scripts/cron-check-disk-usage /etc/cron.d/check-disk-usage
```

Schwelle, Schrittweite und Empfänger stehen als Variablen oben im Skript. Der Mailweg läuft
über Postfix nach `mailout.lrz.de`; ein Testversand lässt sich so prüfen:

```bash
echo test | mail -s "[lakof] Test" Alexander.Loechel@verwaltung.uni-muenchen.de
sudo journalctl -u postfix --since "-2 minutes" | grep status=
```

## Update-Automatik

Das LRZ aktualisiert die VM über `/etc/cron.d/lrz-base` (täglich 2 und 12 Uhr sowie nach
jedem Boot) und startet bei Kernel-Updates automatisch neu — Mo–Fr zwischen 07:00 und
07:30. Vor größeren Eingriffen ist beides stillzulegen:

```bash
sudo systemctl stop cron
sudo systemctl disable --now lrz-base.timer lrz-base-kernel-check.timer \
     apt-daily.timer apt-daily-upgrade.timer
sudo mv /etc/cron.d/lrz-base-automatic-reboot{,.disabled}
```

**Ein Paket-Upgrade reaktiviert die Timer wieder.** Nach jedem Schritt kontrollieren.

## Statusanzeige beim Login

Beim interaktiven Login zeigt `terminal-status-panel` ein Systemdashboard, eingebunden über
`/etc/profile.d/zz-terminal-status-panel.sh`. Das Snippet prüft auf interaktive Shells und
bleibt bei `scp`, `rsync` und Kommandoaufrufen still. Manuell:

```bash
status-server    # System, Last, Speicher, Dateisystem, Top-Prozesse
status-full      # zusätzlich Docker, Cluster, Traefik
```

Installiert als systemweites uv-Tool unter `/opt/uv-tools`.

## Bekannte Einschränkungen

- **Plone 5.2 ist ohne Security-Support** (Ende 31.10.2024), **Python 3.8 ebenfalls**
  (Ende Oktober 2024). Die Installation ist eine bewusst befristete Brücke — siehe
  [ADR 0001](adr/0001-python-38-fuer-die-debian-bruecke.md).
- Die VM hat **1 vCPU, 3,8 GB RAM und keinen Swap**. Buildout-Läufe dauern entsprechend,
  und `/tmp` wurde bewusst auf der Platte gehalten (`tmp.mount` ist maskiert), statt es
  wie in Debian 13 vorgesehen als tmpfs in den Arbeitsspeicher zu legen.
- Der Weg zu Plone 6.0 verlangt Python ≥3.9, umfasst also einen Interpreter-Wechsel. Die
  Vorarbeit zu Plone 5.2.15 samt der dabei gelösten Buildout-Probleme steht in
  [docs/superpowers/2026-08-14-debian-13-migration.md](superpowers/2026-08-14-debian-13-migration.md).
