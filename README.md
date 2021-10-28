Stand: 28.10.2021

# BITS - Behörden-IT-Sicherheitstraining

## Einleitung
Diese Datei beschreibt, wie BITS über das Werkzeug "Hugo" bearbeitet werden kann.

Alternativ kann die HTML-Version von BITS heruntergeladen und direkt über einen Text-Editor in den statischen HTML-Seiten gearbeitet werden. Dies entspricht BITS, wie es bis Version 5.5 entwickelt wurde. Außerdem gibt es neben dieser HTML-Version ein weiteres Archiv mit dem gleichen Stand, das die Installation auf einem Web-Server ermöglicht - damit funktioniert die eingebaute Suche.  In diesen Download-Archiven (Repositorys) ist im Unterordner /static eine weitere Readme.md enthalten, die konkrete Hinweise zur Anpassung, aber auch zur Aktivierung des Gewinnspiels etc. beinhaltet.

Das BITS-Repository mit den beiden Download-Archiven ("Releases") liegt auf GitHub: [BITS-hugo](https://github.com/BITS-Editor/BITS-hugo)

Hier wird erläutert, wie BITS mithilfe von [Hugo](https://gohugo.io), einem Open Source-Programm zu Erstellung statischer HTML-Seiten mittels der Markdown-Sprache, angepasst werden kann. Damit kann wie mit einem What-you-see-is-what-you-get-Editor gearbeitet werden, um BITS auf die lokalen Gegebenheiten anzupassen. Für die Bearbeitung der Inhaltsdaten, die im Unterordner /content liegen, sind dann nur ein beliebiger Text-Editor und ein Browser nötig. Dies Bearbeitung kann aber auch über die statischen HTML-Seiten aus dem Repository-Archiv und einen Text-Editor erfolgen.

## Bezug von Hugo und Abhängigkeiten

Zunächst muss Hugo in der extended Version heruntergeladen werden. Hugo steht u.a. für Windows, Linux, MacOS, BSD zur Verfügung. Hier wird die Installation der Windows-Variante vorgestellt.

[Download hugo from GitHub releases](https://github.com/gohugoio/hugo/releases)

Anschließend muss Hugo installiert werden, siehe die [Installationsanweisungen](https://gohugo.io/getting-started/installing/). 

Die EXE-Datei sollte, für einfache Verwendung, in einem Pfad gespeichert sein, der in der PATH-Variable des Betriebssystems enthalten ist. Alternativ kann sie auch in das Projektverzeichnis kopiert werden.

## BITS-hugo herunterladen

Nach der Installation von Hugo ist das BITS-hugo-Repository von GitHub herunter zu laden.

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

5. Anpassungen an den Markdown-Dateien, insbesondere im Unterordner /content, mit einem beliebigen Text-Editor vornehmen. 

    - Änderungen werden direkt von Hugo erkannt und im Browser sofort nach dem Speichern angezeigt.
    - Tipps und weitere Infos findet man in der Datei [LearnTheme-howto.md](https://github.com/BITS-Training/BITS-hugo/blob/main/LearnTheme-HowTo.md) 

## BITS-Release generieren

Mit folgenden Befehlen werden anschließend im Unterverzeichnis "public" die HTML-Dateien von Hugo für die Veröffentlichung für die Beschäftigten auf einem Web- oder Fileserver generiert:

1. für die Verwendung mit einem **Webserver** und voller Funktionalität:

	```bash
	hugo --cleanDestinationDir
	```

2. für die Verwendung ohne Webserver auf einem **Fileserver** als statische HTML-Dateien (Suche geht nicht!):

	```bash
	hugo --environment html --cleanDestinationDir
	```

## Weitere Infos

Hinweise zur Installation der Releases und den sinnvollen lokalen Anpassungen der Inhalte und des Layouts liegen hier:
https://github.com/BITS-Training/BITS-hugo/blob/main/static/README.md

Hugo arbeitet mit sog. Themes, die für das Layout zuständig sind. BITS-hugo verwendet das Learn-Theme:
https://themes.gohugo.io/themes/hugo-theme-relearn/

Welche Anpassungen über Parameter in BITS für das Learn-Theme hinterlegt sind, steht in dieser Datei:
https://github.com/BITS-Training/BITS-hugo/blob/main/LearnTheme-HowTo.md

Weitere Hinweise und Hilfe zu Hugo findet sich hier:
https://gohugo.io/documentation/