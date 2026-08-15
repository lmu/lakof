# 2. Direktsprung auf Plone 6.2 mit Bereinigung auf der 5.2-Seite

Datum: 2026-08-15

## Status

Angenommen

Ergänzt den Ausblick aus [ADR 0001](0001-python-38-fuer-die-debian-bruecke.md). Dessen
Kernentscheidung — Python 3.8 als Interpreter der Brücke — bleibt unberührt; abgelöst
wird allein die dort skizzierte Anschlussfolge.

## Kontext

ADR 0001 hielt fest, wie der Weg zu Plone 6 aussehen sollte: Plone 6.0 sei die einzige
Version, die sowohl auf dem eingefrorenen Python 3.9 als auch auf dem System-Python von
Debian 13 läuft. Daraus folgte eine dreistufige Anschlussfolge — erst 5.2.10 → 6.0 auf
uv-Python, dann der Interpreter auf 3.13, dann 6.1 oder 6.2.

Ein Machbarkeitsnachweis am 15.08.2026 hat diese Annahme überholt und zugleich einen
Blocker gefunden, den keine der beiden Varianten umgeht. Die Messungen stehen in
[2026-08-15-plone-62-machbarkeit.md](../superpowers/2026-08-15-plone-62-machbarkeit.md).

Drei Befunde sind für diese Entscheidung maßgeblich:

1. **Der Direktsprung funktioniert.** `plone.app.upgrade` 4.1.0, mit Plone 6.2.1
   ausgeliefert, enthält die Profilpakete `v52` bis `v62`. An einer Kopie der
   Produktionsdaten lief die Migration 5218 → 6204 durch; anschließend lieferten
   **388 von 388 Seiten HTTP 200** ohne Renderfehler.

2. **Ein Zwischenhalt auf 6.0 kauft nichts.** Plone 6.2 verlangt Python ≥3.10 und
   unterstützt bis 3.13 — das System-Python von Debian 13. Der Interpreter-Wechsel und
   die Plone-Migration fallen damit ohnehin zusammen, gleich welche 6.x das Ziel ist. Ein
   Halt auf 6.0 fügte eine zusätzliche Migration hinzu, ohne eine Variable zu isolieren.

3. **Die Datenbank enthält Objekte, die Plone 6.2 nicht laden kann** — 81 Records. Der
   schwerste: ein Werkzeug `portal_tinymce`, registriert als lokale Utility unter
   `plone.app.upgrade.bbb.ITinyMCE`. Dieses Modul gab es in der 5.2-Linie von
   `plone.app.upgrade`, in 4.x ist es weg. Die persistente Komponenten-Registry lädt
   dadurch nicht, und ohne sie scheitert **jede** Utility-Abfrage: kein Upgrade, keine
   Seitenauslieferung.

Für Befund 3 standen zwei Wege zur Wahl:

- **Nachträglich in 6.2 reparieren**, indem für die gelöschten Klassen Attrappen
  bereitgestellt werden (`plone.app.upgrade.utils.alias_module`, wie Plone es selbst für
  den QuickInstaller tut).
- **Vorher in 5.2 bereinigen**, wo die Klassen noch vorhanden sind.

Der Probelauf ist den ersten Weg gegangen und hat dabei sein eigenes Gegenargument
geliefert: Das Upgrade entfernte die tote Registrierung nicht, sondern schrieb sie auf
den Namen des Wegwerf-Moduls um. Die Datenbank war anschließend ohne diese Attrappe nicht
mehr startfähig.

## Entscheidung

Der Weg führt in **einem** Plone-Schritt von 5.2.10 auf **6.2.1**, auf dem
**System-Python von Debian 13**. Kein Zwischenhalt auf 6.0 oder 6.1, kein weiterer
uv-Interpreter.

Vorgeschaltet wird eine **Bereinigung auf der 5.2-Seite**: Die nicht mehr auflösbaren
Objekte werden abgemeldet und gelöscht, solange ihr Code noch vorhanden ist. Erst danach
wird ein frisches Backup gezogen, und erst dieses geht in die Migration.

Abnahmekriterium der Bereinigung ist ein **messbares Ergebnis**: `zodbverify` muss von 81
nicht ladbaren Records auf nahe null fallen.

## Begründung

Wir reparieren nicht am offenen Herzen, was sich vorher sauber entfernen lässt. Eine
Attrappe ist kein Werkzeug, das nach Gebrauch verschwindet — sie wird beim Upgrade
mitgeschrieben und damit zum Bestandteil der Datenbank. Das ist gemessen, nicht
befürchtet.

Die Bereinigung auf der Quellversion ist außerdem die einzige Variante mit einer
Rückfalllinie: Sie endet in einem frischen, geprüften Backup eines Zustands, der noch
produktiv läuft. Scheitert die Migration danach, ist der Ausgangspunkt sauberer als
vorher, nicht schlechter.

Der Verzicht auf den Zwischenhalt widerspricht der sonst gültigen Regel, nur eine
Variable auf einmal zu wechseln. Er ist hier vertretbar, weil die Regel bei dieser
Aufteilung gar nicht einlösbar wäre: Plone-Stand und Interpreter lassen sich nicht
trennen, wenn jede in Frage kommende Zielversion einen neueren Interpreter verlangt als
die Brücke. Und anders als bei den Distributions-Upgrades gibt es hier einen echten
Rückweg — die Migration läuft an einer Kopie, die Produktion bleibt bis zur Umstellung
unberührt.

Für 6.2 statt 6.0 spricht zudem der Support: Alle 6.x-Minor-Versionen haben
Security-Support bis zum 31.12.2027. Ein Einstieg bei 6.0 verschenkt zwei
Minor-Versionen, ohne diesen Horizont zu verlängern.

## Konsequenzen

**Gewonnen:** Eine Plone-Version mit Security-Support bis Ende 2027, auf dem
System-Python der Distribution — der Sonderweg über einen mitgelieferten Interpreter
endet. Eine Datenbank, deren nicht ladbare Objekte entfernt statt überbrückt sind, mit
einem prüfbaren Abnahmekriterium.

**Aufgegeben:** Die Trennung von Interpreter- und Plone-Wechsel, wie ADR 0001 sie in
Aussicht stellte. Beide fallen zusammen.

**Erschwert:** Es braucht eine lauffähige 5.2-Umgebung, um das Reinigungsskript zu
entwickeln und zu prüfen, bevor es die Produktion anfasst. Sie lässt sich aus diesem
Repository plus dem gesicherten `buildout-cache` auf uv-Python 3.8 nachbauen.

**Offen:** Das Diazo-Theme `lakof.theme` überlebt den Sprung nicht. Sein Webpack-Aufbau
ist Plone-5-Technik (Bootstrap 3, RequireJS, Mockup-Bundles), während Classic UI 6 auf
Bootstrap 5 und Patternslib steht. Ob neu gebaut oder auf Barceloneta 6 aufgesetzt wird,
ist eine Gestaltungsentscheidung und bekommt ein eigenes Dokument. Ebenfalls offen: ob
die Mosaic-Inhalte den Sprung 2.2.5 → 4.0.0 überstehen — das ist an einer leeren Site
nicht prüfbar und wurde noch nicht gemessen.
