Stand: 01.10.2022

# BITS - Behörden-IT-Sicherheitstraining

## Einleitung
Diese Datei beschreibt, wie BITS über das Open-Source-Werkzeug "hugo" bearbeitet und auf lokale Anforderungen hin angepasst werden kann. hugo dient der automatisierten Erstellung von statischen HTML-Seiten auf Basis von Markdown-Textdateien.

Alternativ kann die HTML-Version von BITS heruntergeladen und direkt über einen Text-Editor in den statischen HTML-Seiten gearbeitet werden. Dies entspricht BITS, wie es bis Version 5.5 entwickelt wurde. Außerdem gibt es neben dieser HTML-Version ein weiteres Archiv mit dem gleichen Stand, das die Installation auf einem Web-Server ermöglicht - damit funktioniert die eingebaute Suche.  In diesen Download-Archiven (Repositorys) ist im Unterordner /static eine weitere Readme.md enthalten, die konkrete Hinweise zur Anpassung, aber auch zur Aktivierung des Gewinnspiels etc. beinhaltet.

Das BITS-Repository mit den beiden Download-Archiven ("Releases") liegt auf GitHub: [BITS-hugo](https://github.com/BITS-Editor/BITS-hugo)

Mit hugo kann faktisch wie mit einem What-you-see-is-what-you-get-Editor gearbeitet werden, um BITS auf die lokalen Gegebenheiten anzupassen. hugo verfügt über einen schlanken Webserver in Form einer einzelnen ausführbaren Datei. Für die Bearbeitung der Inhaltsdaten, die im Unterordner /content als Markdown-Textdateien liegen, sind dann nur ein beliebiger Text-Editor und ein Browser nötig. Dies Bearbeitung kann aber auch über die statischen HTML-Seiten aus dem Repository-Archiv und einen Text-Editor erfolgen.

Im [BITS-Portal](https://www.bits-portal.eu) befinden sich mehrere leicht verständliche Tutorial-Videos, die alle erforderlichen Schritte umfassend darstellen.

## Bezug von Git, hugo und Abhängigkeiten

Für die Versionspflege und zur lokalen Verwaltung der Daten sollte als erstes die Open-Source-Versionsverwaltung Git installiert werden. Danach muss hugo in der extended Version heruntergeladen werden. hugo steht u.a. für Windows, Linux, MacOS, BSD zur Verfügung. Hier wird die Installation der Windows-Variante vorgestellt.

Git ist für die gängigsten Betriebsysteme u.a. unter [https://git-scm.com/downloads](https://git-scm.com/downloads) verfügbar. 

hugo steht bei [GitHub](https://github.com/gohugoio/hugo/releases) zum Download bereit.

Anschließend muss hugo installiert werden, siehe die [Installationsanweisungen](https://gohugo.io/getting-started/installing/) auf der hugo-Homepage. 

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

3. hugo-Server starten

    ```bash
    hugo server
    ```

4. Browser öffnen und auf http://localhost:1313 navigieren

## Anpassungen

Anpassungen der Markdown-Dateien, insbesondere im Unterordner /content, können dann mit einem beliebigen Text-Editor vorgenommen werden.

- Änderungen werden bei laufendem hugo-Server direkt von hugo erkannt und im Browser sofort nach dem Speichern der Änderungen angezeigt, mit Ausnahme von Variablen (siehe nächster Punkt)
- Tipps und weitere Infos u.a. zu Variablen findet man in der Datei [RelearnTheme-howto.md](https://github.com/BITS-Training/BITS-hugo/blob/main/ReLearnTheme-HowTo.md) 

## BITS-Release generieren

Mit folgenden Befehlen werden anschließend im Unterverzeichnis "public" von hugo aus den Markdown-Textdateien die HTML-Seiten für die Veröffentlichung für die Beschäftigten auf einem lokalen Web- oder Fileserver generiert:

1. Für die Verwendung mit einem **Webserver** und voller Funktionalität:

	```bash
	hugo --cleanDestinationDir
	```

2. Für die Verwendung ohne Webserver auf einem **Fileserver** als statische HTML-Dateien (Suche geht nicht!):

	```bash
	hugo --environment html --cleanDestinationDir
	```

Die "create-release.bat" erzeugt aus einem Tag automatisch die beiden ZIP-Dateien für die github-Releases.

## Weitere Infos

Hinweise zur Installation der Releases und den sinnvollen lokalen Anpassungen der Inhalte und des Layouts liegen hier:
https://github.com/BITS-Training/BITS-hugo/blob/main/static/README.md

Hugo arbeitet mit sog. Themes, die für das Layout zuständig sind. BITS-hugo verwendet das Relearn-Theme:
https://themes.gohugo.io/themes/hugo-theme-relearn/

Welche Anpassungen über Parameter und Variablen in BITS für das ReLearn-Theme hinterlegt sind, steht in dieser Datei:
https://github.com/BITS-Training/BITS-hugo/blob/main/ReLearnTheme-HowTo.md

Weitere Hinweise und Hilfe zu Hugo findet sich hier:
https://gohugo.io/documentation/