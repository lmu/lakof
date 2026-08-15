# 1. Python 3.8 als Interpreter für die Debian-Brücke

Datum: 2026-08-14

## Status

Angenommen

## Kontext

Debian 11 (bullseye) erreicht am 31.08.2026 das Ende des LTS-Supports. Das LRZ schaltet
die VM ab, wenn sie nicht auf eine unterstützte Version gehoben wird. Der Weg führt über
Debian 12 nach 13; ein Direktsprung ist nicht unterstützt.

Die Plone-Installation hängt am System-Python:

- Debian 11 liefert Python 3.9 — die letzte Debian-Version, die das tut
- Debian 12 liefert 3.11, Debian 13 liefert 3.13
- Plone 5.2 läuft auf keinem von beiden

Das Distributions-Upgrade zerstört die Installation, solange der Interpreter nicht vom
System gelöst ist. Die Wahl des Interpreters ist damit die Kernentscheidung.

Die Installation läuft heute auf Python 3.9.2. Beim Nachbau zeigte sich, dass diese
Kombination laut Paketmetadaten gar nicht zulässig ist:

```
Zope 4.8.x:  Requires-Python  >=2.7, !=3.0.*, …, <3.9
```

Zope 4.8 schließt Python 3.9 ausdrücklich aus. Dass die Produktion trotzdem seit Jahren
darauf läuft, liegt allein daran, dass das dort verwendete Werkzeugpaar
(`zc.buildout 2.13.8` / `setuptools 42.0.2`) `Requires-Python` nicht auswertete. Neuere
Werkzeuge werten es aus und verweigern die Installation.

Es standen zur Wahl:

1. **Bei 3.9 bleiben** und die Metadatengrenze weiter umgehen, indem die alten Werkzeuge
   beibehalten werden.
2. **Auf 3.8 gehen**, die letzte Version, für die alle Metadaten stimmen.

## Entscheidung

Die Brücke läuft auf **CPython 3.8 (aktuellster Patchstand, derzeit 3.8.20)**,
bereitgestellt als portabler python-build-standalone-Build über `uv` unter
`/opt/python`, außerhalb der Paketverwaltung des Betriebssystems.

Der Plone-Stand bleibt zunächst **5.2.10**. Nur der Interpreter wechselt.

## Begründung

Wir umgehen keine Metadatengrenze, deren Tragfähigkeit wir nicht prüfen können. Zope 4.8
sagt, es unterstütze Python 3.9 nicht; die Deklaration mangels Prüfung jahrelang
unbemerkt verletzt zu haben, ist kein Argument dafür, sie weiter zu verletzen — erst
recht nicht, während wir das darunterliegende Betriebssystem zweimal austauschen.

Der Interpreter wird gemessen portabel: Der 3.8.20-Build benötigt höchstens
`GLIBC_2.2.5`, während Debian 11, 12 und 13 die Versionen 2.31, 2.36 und 2.41 liefern.
Er läuft damit über alle drei Distributionsstände unverändert.

Der Plone-Stand bleibt bei 5.2.10, damit **nur eine Variable** wechselt. Ein
gleichzeitiger Sprung auf 5.2.15 wurde erprobt und funktioniert im Kern — das
ZODB-Upgrade läuft sauber durch —, brachte aber zwei Viewlet-Regressionen zutage
(`lakof.leadimage.full`, `plone.htmlhead.socialtags`), die vor der Frist nicht
verlässlich zu klären sind. Bei einem unumkehrbaren Distributions-Upgrade ohne
Snapshot-Rollback ist die Zahl gleichzeitiger Änderungen selbst ein Risikofaktor.

## Konsequenzen

**Gewonnen:** Eine Installation, deren Versionsstände zueinander passen, auf einem
Interpreter, der die beiden Distributions-Upgrades unverändert übersteht. Die
Fehlersuche nach einem OS-Sprung muss nicht mehr zwischen Interpreter- und
Anwendungsproblemen unterscheiden.

**Aufgegeben:** Python 3.8 ist seit Oktober 2024 selbst end of life, ein Jahr früher als
3.9. Für eine ausdrücklich befristete Brücke ist das hinnehmbar — beide sind ohnehin
ohne Support.

**Erschwert:** Plone 6.0 verlangt Python ≥3.9. Der Weg zu Plone 6 umfasst damit einen
Interpreter-Wechsel und lässt sich nicht, wie zunächst geplant, auf demselben
Interpreter fahren. Plone 6.0 deckt die Spanne 3.9 bis 3.13 ab; der Wechsel kann also
weiterhin von der Plone-Migration getrennt werden, nur eben in umgekehrter Reihenfolge:
erst der Interpreter auf ≥3.9, dann Plone.

**Offen:** Plone 5.2 ist seit dem 31.10.2024 ohne Security-Support. Die Brücke behebt
das nicht. Der Anschluss auf Plone 6 sollte terminiert und nicht vertagt werden; die
Vorarbeit zu 5.2.15 ist in
[2026-08-14-debian-13-migration.md](../superpowers/2026-08-14-debian-13-migration.md)
festgehalten und bleibt verwendbar.
