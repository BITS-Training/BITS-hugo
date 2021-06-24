# BITS - Behörden IT Sicherheitstraining

## Abhängigkeiten

1. Hugo extended version
   1. [Dowload hugo from GitHub releases](https://github.com/gohugoio/hugo/releases)

Die EXE-Datei sollte, für einfache Verwendung, in einem Pfad gespeichert sein der in der PATH-Variablen des Betriebssystems enthalten ist. Alternativ kann sie auch in das Projektverzeichnis kopiert werden.

## Anleitung für Anpassungen

1. Lokales Klonen des Repositorys (rekursiv!)
   
    ```bash
    git clone --recursive https://github.com/BITS-Editor/BITS-hugo
    ```

2. Lokal in das heruntergeladene Repository-Verzeichnis wechseln

    ```bash
    cd BITS-hugo
    ```

3. Hugo-Server starten

    ```bash
    hugo server
    ```

4. Browser öffnen und auf http://localhost:1313 navigieren

5. Anpassungen an den Markdown-Dateien vornehmen. 

    - Änderungen werden direkt von Hugo erkannt und im Browser angezeigt.
    - Tipps und weitere Infos findet man in der Datei [LearnTheme-howto.md](https://github.com/BITS-Training/BITS-hugo/blob/main/LearnTheme-HowTo.md) 

## BITS Release generieren

Mit folgenden Befehlen werden im Unterverzeichnis "public" die HTML Dateien von Hugo für die Veröffentlichung generiert.

1. für die Verwendung mit einem Webserver und voller Funktionalität:

	```bash
	hugo --cleanDestinationDir
	```

2. für die Verwendung ohne Webserver als direkte HTML-Dateien (Suche und Verlauf-Haken gehen nicht!):

	```bash
	hugo --environment html --cleanDestinationDir
	```

## Weitere Infos

https://themes.gohugo.io/theme/hugo-theme-learn/en/

https://gohugo.io/documentation/
