# Learn-Theme - HowTo

## O. Einleitung

Dieses Dokument beschreibt, welche Anpassungsmöglichkeiten es gibt, wenn BITS über hugo und das Learn-Theme angepasst werden kann.

## 1. Variablen und Parameter (hinterlegt in config.toml)

### Textvariablen

 - Behörden und Einrichtungen
``{{< param Einrichtungen >}}``

 - Behörde oder Einrichtung
``{{< param Einrichtung >}}``

 - 6.0beta1 (Versionsnummer)
``{{< param Ver >}}``

## 2. Notizen

 - Anmerkung (orange) = das was in BITS v5 links steht
```
{{% notice note %}}
Nach diesem Training werden Sie wissen, wie Sie sich richtig am Computer, am Smartphone und im Internet verhalten. Nutzen Sie Ihr Wissen auch für den privaten Bereich, es drohen überall die gleichen Gefahren!
{{% /notice %}}
```
 - Tipp (grün) = das was in BITS v5 rechts steht
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
	``[Viren]({{< ref "/040 lektion viren" >}})``
	
 - zu Unterseiten
``[Viren]({{< ref "/040 lektion viren/05.Risiko-und-Schaeden.de.md" >}})``
``[Informationen]({{< ref "02.Dokumente-und-Informationen.de.md" >}})``

 - zu Ansprechperson
``[Ansprechperson]({{< ref "/200 ansprechpersonen/" >}})``
## 4. Quiz

### Fragen und Antworten sortieren

Als Voreinstellung sind die Fragen in ihrer Reihenfolge fest ("Shuffle Questions: True"), die vorgeschlagenen Antworten zufällig sortiert ("Shuffle Answers: False"). Dies kann über die jeweilige Lektions-Seite der Quizzes beliebig geändert werden.

### Multiple-Choice-Antworten

- Will man mehrere Antworten zulassen, dann sind die Antworten als ungeordnete Liste zu formatieren (die Formatierung als "Aufgabenliste" (über die eckigen Klammern mit Leerzeichen muss erhalten bleiben, daher ggf. in den Quellcode-Modus des Editors wechseln)

```
- [x] Kleine Programmteile, die sich unbemerkt an ein anderes Programm anhängen und so auf fremden Rechnern ausgeführt werden können.
- [ ] Mikroskopisch kleine elektronische Teile, die Computer ausspionieren oder andere zerstörerische Aktionen ausführen.
- [ ] Schädliche Programme, die jedoch in Ihrer Einrichtung keine Gefahr darstellen, weil sie durch Verschlüsselungssoftware und Virenscanner sofort unschädlich gemacht werden.
```

  - Will man nur eine Antwort zulassen, dann sind die Antworten als geordnete Liste zu formatieren:

```
1. [x] Ein netter Anruf einer Ihnen nicht bekannten Mitarbeiterin der IT-Abteilung, mit der Bitte, ihr Ihre Zugangsdaten zu geben.
2. [ ] Anfrage eines Kollegen / einer Kollegin zu einem empfangenen Kettenbrief per E-Mail.
3. [ ] Eine Information Ihrer Abteilungsleitung, Sie hätten einen Virus erhalten.
```

## 5. Aufklappen von Texten
```
{{%expand "Datei-Viren" %}}
Dies ist ein Beispiel
{{% /expand %}}
```