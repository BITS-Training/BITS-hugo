Stand: 08.12.2023

# BITS - Behörden-IT-Sicherheitstraining

## Einleitung
Diese Datei beschreibt, wie BITS über das Open-Source-Werkzeug "hugo" bearbeitet und auf lokale Anforderungen hin angepasst werden kann. hugo dient der automatisierten Erstellung von statischen HTML-Seiten auf Basis von Markdown-Textdateien.

Alternativ kann die HTML-Version von BITS heruntergeladen und direkt über einen Text-Editor in den statischen HTML-Seiten gearbeitet werden, um Anpassungen vorzunehmen. Dies entspricht BITS, wie es bis Version 5.5 entwickelt wurde. Außerdem gibt es neben der HTML-Version für die Installstion auf einem File-Server ein weiteres Archiv mit dem gleichen Stand, das die Installation auf einem Web-Server ermöglicht - nur mit diesem funktioniert die eingebaute Suche in BITS.  In diesen Download-Archiven (Repositorys) ist im Unterordner /static eine weitere Readme.md enthalten, die konkrete Hinweise zur Anpassung, aber auch zur Aktivierung des Gewinnspiels etc. beinhaltet.

Das BITS-Repository mit den beiden Download-Archiven ("Releases") liegt auf GitHub: [BITS-hugo](https://github.com/BITS-Editor/BITS-hugo)

Mit hugo kann faktisch wie mit einem What-you-see-is-what-you-get-Editor gearbeitet werden, um BITS auf die lokalen Gegebenheiten anzupassen. hugo verfügt über einen schlanken Webserver in Form einer einzelnen ausführbaren Datei. Für die Bearbeitung der Inhaltsdaten, die im Unterordner /content des Repositorys als Markdown-Textdateien liegen, sind dann nur ein beliebiger Text-Editor und ein Browser nötig.

Im [BITS-Portal](https://www.bits-portal.eu) befinden sich mehrere leicht verständliche Tutorial-Videos, die alle erforderlichen Schritte umfassend darstellen.

## Bezug von Git, hugo und Abhängigkeiten

Für die Versionspflege und zur lokalen Verwaltung der Daten sollte als erstes die Open-Source-Versionsverwaltung Git installiert werden. Danach muss hugo in der extended Version heruntergeladen werden. hugo steht u.a. für Windows, Linux, MacOS, BSD zur Verfügung. Hier wird die Installation der Windows-Variante vorgestellt.

Git ist für die gängigsten Betriebsysteme u.a. unter [https://git-scm.com/downloads](https://git-scm.com/downloads) verfügbar und wird lokal installiert.

hugo steht bei [GitHub](https://github.com/gohugoio/hugo/releases) zum Download bereit und muss für die Nutzung mit BITS mindestens den Versionsstand v0.120.4 haben; siehe auch die  [Installationsanweisungen](https://gohugo.io/getting-started/installing/) auf der hugo-Homepage. 

Die EXE-Datei von hugo sollte, für einfache Verwendung, in einem Pfad gespeichert sein, der in der PATH-Variable des Betriebssystems enthalten ist. Alternativ kann sie auch in das lokale Repository-Verzeichnis nach dem nächsten Schritt kopiert werden.

## BITS-hugo herunterladen

Nach der Installation von hugo ist das BITS-hugo-Repository von GitHub herunter zu laden bzw. zu klonen. Dies erfordert eine lokale Git-Installation (siehe oben).


1. Lokales Klonen des Repositorys (rekursiv!) über die shell
   
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

4. Browser öffnen und auf http://localhost:1313 navigieren. Dort zeigt der hugo-Webserver dann die Markdown-Dateien von BITS als HTML an.

## Anpassungen

Anpassungen der Markdown-Dateien, insbesondere im Unterordner /content, können dann mit einem beliebigen Text-Editor vorgenommen werden.

- Änderungen werden bei laufendem hugo-Server direkt von hugo erkannt und im Browser sofort nach dem Speichern der Änderungen der jeweiligen Markdown-Datei angezeigt, mit Ausnahme von Variablen (siehe nächster Punkt)
- Tipps und weitere Infos u.a. zu Variablen findet man in der Datei [RelearnTheme-howto.md](https://github.com/BITS-Training/BITS-hugo/blob/main/ReLearnTheme-HowTo.md) 

## BITS-Release generieren

Mit folgenden Befehlen werden mit hugo aus den Markdown-Textdateien die statischen HTML-Seiten, für die Veröffentlichung auf einem lokalen Web- oder Fileserver generiert:

1. Für die Verwendung mit einem **Webserver** und voller Funktionalität:

	```bash
	hugo --cleanDestinationDir
	```

2. Für die Verwendung ohne Webserver auf einem **Fileserver** als statische HTML-Dateien (Suche geht nicht!):

	```bash
	hugo --environment html --cleanDestinationDir
	```
Die erzeugten HTML-Dateien liegen im Ordner "public".

Die im Repository enthaltene "create-release.bat" erzeugt aus einem Tag automatisch die beiden ZIP-Dateien für die GitHub-Releases.

## Weitere Infos

Hinweise zur Installation der Releases und den sinnvollen lokalen Anpassungen der Inhalte und des Layouts liegen hier:
https://github.com/BITS-Training/BITS-hugo/blob/main/static/README.md

hugo arbeitet mit sog. Themes, die für das Layout zuständig sind. BITS-hugo verwendet das Relearn-Theme:
https://themes.gohugo.io/themes/hugo-theme-relearn/

Welche Anpassungen über Parameter und Variablen in BITS für das Relearn-Theme hinterlegt sind, steht in dieser Datei:
https://github.com/BITS-Training/BITS-hugo/blob/main/ReLearnTheme-HowTo.md

Weitere Hinweise und Hilfe zu hugo findet man hier:
https://gohugo.io/documentation/
