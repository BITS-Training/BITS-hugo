# Relearn-Theme - HowTo

Stand 01.07.2024

## O. Einleitung

Dieses Dokument beschreibt, welche Anpassungsmöglichkeiten es gibt, wenn BITS über hugo und das Relearn-Theme angepasst werden.

## 1. Variablen und Parameter (hinterlegt in config/_default/config.toml)

In der Datei config/_default/config.toml verschiedene Variablen hinterlegt. Änderungen führen beim Erzeugen der HTML-Seiten über hugo zum Austausch des entsprechenden Wertes auf allen betroffenen Seiten. 

### Metadaten

Die Variablen für die Metadaten in den HTML-Dateien werden hier zentral definiert.

#### Abschnitt [params] für Standardsprache

- description
- author.name

#### Abschnitt [Languages.xy] sprachabhängig

- title = "BITS | Behörden-IT-Sicherheitstraining"

### Textvariablen

Textvariablen werden im geamten Inhalt verwendet und können bei Bedarf hier zentral verändert werden. In den Inhaltsseiten lautet die entsprechende Syntax der Variablen: {{< param VARIABLE >}}.

#### Abschnitt [Languages.xy.params] sprachabhängig

- BITS = "BITS"
- BITS_Titel = "Behörden-IT-Sicherheitstraining"
- Ver = "6.5"
- Release = "aus Sommer 2024"
- BITS_Password_Length = "zehn"
- Einrichtung = "Behörde oder Einrichtung"
- Einrichtungen = "Behörden und Einrichtungen"

## 2. Notizen
Die Notizen sind die farbigen Kästen mit Hinweisen.
 - Anmerkung (orange) = das was in BITS v5 links stand
```
{{% notice note %}}
Nach diesem Training werden Sie wissen, wie Sie sich richtig am Computer, am Smartphone und im Internet verhalten. Nutzen Sie Ihr Wissen auch für den privaten Bereich, es drohen überall die gleichen Gefahren!
{{% /notice %}}
```
 - Tipp (grün) = das was in BITS v5 rechts stand
```
{{% notice tip %}}
Schutzziele der Informationssicherheit:
	* Vertraulichkeit
	* Integrität
	* Verfügbarkeit
{{% /notice %}}
```

## 3. Interne Links

- zu Lektionen
   - ``[Viren](/02-lektion-viren)``

- zu Unterseiten
   - ``[Viren](/02-lektion-viren/05-Risiko-und-Schaeden)``
   - ``[Informationen](02-Dokumente-und-Informationen)``

- zu Anchor in Unterseiten
  - ``[Social Engineering](/03-lektion-passwoerter/02-Gefahren.de.md#social-engineering)``

- zu Ansprechperson
   - ``[Ansprechperson](/ansprechpersonen/)``

## 4. Quiz

### Fragen und Antworten sortieren

Als Voreinstellung sind die Fragen in ihrer Reihenfolge fest ("Shuffle Questions: True"), die vorgeschlagenen Antworten zufällig sortiert ("Shuffle Answers: False"). Dies kann über die jeweilige Lektions-Seite der Quizzes beliebig geändert werden.

### Multiple-Choice-Antworten

- Will man **mehrere Antworten** zulassen, dann sind die Antworten als **ungeordnete** Liste zu formatieren (die Formatierung als "Aufgabenliste" über die eckigen Klammern mit Leerzeichen muss erhalten bleiben, daher ggf. in den Quellcode-Modus des Editors wechseln)

```
- [x] Kleine Programmteile, die sich unbemerkt an ein anderes Programm anhängen und so auf fremden Rechnern ausgeführt werden können.
- [ ] Mikroskopisch kleine elektronische Teile, die Computer ausspionieren oder andere zerstörerische Aktionen ausführen.
- [ ] Schädliche Programme, die jedoch in Ihrer Einrichtung keine Gefahr darstellen, weil sie durch Verschlüsselungssoftware und Virenscanner sofort unschädlich gemacht werden.
```

  - Will man nur **eine Antwort** zulassen, dann sind die Antworten als **geordnete** Liste zu formatieren:

```
1. [x] Ein netter Anruf einer Ihnen nicht bekannten Mitarbeiterin der IT-Abteilung, mit der Bitte, ihr Ihre Zugangsdaten zu geben.
2. [ ] Anfrage eines Kollegen / einer Kollegin zu einem empfangenen Kettenbrief per E-Mail.
3. [ ] Eine Information Ihrer Abteilungsleitung, Sie hätten einen Virus erhalten.
```

## 5. Aufklappen von Texten

Um Textblöcke ein- und auszuklappen ist folgende Auszeichnung erforderlich:

{{%expand "Datei-Viren" %}}
Dies ist ein Beispiel
{{% /expand %}}
```

