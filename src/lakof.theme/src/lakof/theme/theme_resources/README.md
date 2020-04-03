#### Entwicklung mit Webpack

Das Theme befindet sich in `src/lakof.theme/src/lakof/theme/theme_resources`,
erst müssen die dort die Javascript Abhängigkeiten installiert werden:

.. code-block:: bash

    $ cd src/lakof.theme/src/lakof/theme/theme_resources
    $ npm install

Jetzt kann hot-reloading verwendet werden, bedeutet bei Änderungen im
`theme_resources` Verzeichnis wird automatisch die Seite neu geladen.
Die Plone Instanz muss dazu laufen:

.. code-block:: bash

    $ bin/instance fg
    $ cd src/lakof.theme/src/lakof/theme/theme_resources
    $ npm run watch

#### Styles anpassen/ändern

Unsere Styles befinden sich in `src/lakof.theme/src/lakof/theme/theme_resources/src`.

Für css kann man vor allem die Datei `src/lakof.theme/src/lakof/theme/theme_resources/src/lakof.theme/lakof.less` anpassen.
In `src/lakof.theme/src/lakof/theme/theme_resources/src/lakof.theme/default.js` wird alles (js und less) mit webpack zusammengebaut.


#### Neue Bundle-Files erstellen

Damit aktualisierte CSS/JS Dateien direkt von Plone ausgeliefert werden, müssen diese
erstellt und eingecheckt werden:

.. code-block:: bash

    $ bin/instance fg

    # Wir löschen die alten bundle Dateien, so behalten wir keine unnötigen Dateien
    $ cd src/lakof.theme/src/lakof/theme/theme_resources
    $ rm -Rf theme

    # Wir lassen das theme Verzeichnis mit allen bundle Dateien neu erstellen.
    $ npm run build

    # Wir commiten die Source Dateien extra, damit ist der Merge-Request besser zu lesen
    $ git add src/
    $ git commit -m "Update xyz styling"
    $ Jetzt commiten wir die Webpack bundle Dateien
    $ git add theme/
    $ git commit -m "Update bundle files"

Haben sich CSS/LESS/JS Dateien von Plone oder in unseren bestehenden
Resources (z.B in: `Plone/src/docpool.theme/docpool/theme/diazo_resources/static`)
geändert,  muss das `.plone` Verzeichins in `theme_resources` gelöscht werden. Beim
nächsten `npm run build/watch` werden diese Dateien dann neu von Plone geladen.