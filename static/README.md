# BITS Behörden-IT-Sicherheitstraining

Stand: 28.10.2021

Ansprechpartner: Dr. Lutz Gollan, Landesbetrieb Verkehr, Hamburg
E-Mail: [g@backbeat.eu](mailto:g@backbeat.eu)

## 1. Überblick

Unter dem Titel „BITS Behörden-IT-Sicherheitstraining“ hat im Jahr 2006 eine Arbeitsgruppe des Arbeitskreises Informationstechnologie des Städte- und Gemeindebundes Nordrhein-Westfalen das für Unternehmen konzipierte Computersicherheitstraining „open beware!“ an die Anforderungen von Behörden und anderen Einrichtungen angepasst. Mittlerweile liegt die aktualisierte Version 6 vor. Seit Oktober 2010 wird BITS von der Kommunal Agentur NRW GmbH (https://www.kommunalagenturnrw.de) mit Unterstützung von Dr. Lutz Gollan, Landesbetrieb Verkehr, Hamburg, herausgegeben.

Der Quellcode für Hugo ist unter https://github.com/BITS-Training/BITS-hugo kostenfrei verfügbar. Die URL für die Online-Version lautet https://www.bits-training.de. BITS steht unter Creative Commons-Lizenz BY-SA 4.0 und kann beliebig angepasst werden (siehe unten 7.).

## 2. Ziel

Durch das Training sollen die Mitarbeiterinnen und Mitarbeiter von Behörden und anderen Einrichtungen, die regelmäßig an IT-Arbeitsplätzen und insbesondere mit dem Internet beschäftigt sind, durch gezielte Information und Selbstlerneinheiten für die Sicherheitsaspekte der Computer- und Internetnutzung sensibilisiert werden.

Das Training ist kostenlos, anpassbar und vollständig browserbasiert nutzbar.

## 3. Installation und Anpassung

BITS wird in zwei Versionen veröffentlicht: Eine Version für die Verwendung mit einem Webserver (Dateiname \*webroot\*) und eine Version für die Verwendung direkt aus dem Dateisystem (z.B. Fileserver, Dateifreigabe, USB-Stick oder SharePoint Verzeichnis) (Dateiname \*fileshare\*). Die Versionen sind auf der [Releases-Seite](https://github.com/BITS-Training/BITS-hugo/releases) des GitHub-Repositorys abgelegt. Die Fileserver-Version unterstützt nicht die integrierte Suche.

Vor der Veröffentlichung sollten einige Dateien auf die eigenen Bedürfnisse angepasst und mit passenden Daten befüllt werden (siehe unten "Anpassung").

### Installation
Die Release-ZIP entpacken und die benötigten Anpassungen vornehmen ,anschließend alle Dateien in das Verzeichnis des Webservers oder in den Ordner für die Veröffentlichung kopieren.

Als Startseite kann direkt auf den Root-Ordner / (Webserver-Version) bzw. auf die Seite index.html (Fileserver-Version) verlinkt werden.

### Anpassung
* Vor der Freigabe für die Beschäftigten sollte die Seite „Ansprechpersonen“ für die entsprechende Behörde oder Einrichtung angepasst werden. Dies ist die Datei "\200-ansprechpersonen\index.html" (Webserver) oder "\200-ansprechpersonen.html" (Dateisystem)
* Anderslautende Dienstvereinbarungen oder -anweisungen könnten zu Änderungsbedarfen in den Lektionen "E-Mail" und "Vertrauliche Daten" führen.
* Individuelle Verweise auf weitere Informationsquellen können in der Datei "\weitere-informationen\index.html" (Webserver) oder "\weitere-informationen.html" (Dateisystem) verlinkt werden.
* Das BITS-Logo kann durch ein eigenes ersetzt werden: Einfach die Datei "\images\logolinks.jpg" überschreiben. Das Bild sollte 220px breit und 140px hoch sein.
* Über Hugo können Sie bestimmter Parameter oder Platzhalter mit eigenen Werten gleichzeitig auf allen Seiten überschreiben. Folgende Parameter sind \config\_default\config.toml hinterlegt:
  * Einrichtung = "Behörde oder Einrichtung"
  * Einrichtungen = "Behörden und Einrichtungen"
  * BITS = "BITS"
  * Ver = "6.0.1"

## 4. Bedienung und technische Anforderungen

Die Bedienung von „BITS Behörden-IT-Sicherheitstraining“ erfolgt durch den Aufruf der URL im Browser (Webserver) oder der „index.html“-Datei (Dateisystem). Anschließend können die weitestgehend barrierefreien Seiten durch die Maus oder durch die Pfeiltasten der Tastatur genutzt werden.

BITS unterstützt grundsätzlich jeden aktuellen Browser. JavaScript muss aktiviert sein, andernfalls kommt es bei der Navigation und bei den Wissenstests zu Problemen. Eine Soundkarte bzw. Lautsprecher sind zur Nutzung nicht erforderlich. Es ist auch eine Nutzung über mobile Endgeräte möglich. BITS wurde mit den Browsern Edge, Vivaldi, Firefox und Chrome getestet. Der MS Internet Explorer wird nicht unterstützt.

## 5. Gewinnspiel

Es besteht die Möglichkeit, dass bei den Wissenschecks am Ende der Lektionen bei Anklicken der richtigen Antwort Buchstaben eingeblendet werden. Wenn die entsprechenden Buchstaben durch den Nutzer innerhalb eines Gewinnspiels der Behörde eingesendet werden, kann so ein Anreiz zur Nutzung von BITS geschaffen werden.

Dazu muss in den Ordnern der Lektionen die jeweilige Datei "Quiz" mit einem Text-Editor geöffnet werden. Dort ist dann bei der jeweiligen Zeile "Richtige Antwort" der gewünschte Lösungsbuchstaben (ggf. auch ein Sonderzeichen wie Unterstrich oder Komma) zu hinterlegen, also z.B. "Richtige Antwort. Notieren Sie sich den Lösungsbuchstaben **B**".

Bei der Auswahl der Lösungsbuchstaben sollte man sich zuvor einen Lösungssatz überlegen, der aus 34 Lösungsbuchstaben besteht - dies ist die Anzahl der Fragen aller Quizzes.

## 6. BITS-Portal

Für Administratoren steht kostenfrei das BITS-Portal https://www.bits-portal.eu zur Verfügung. Dort werden Beta-Versionen bereitgehalten, neue Funktionen und Inhalte vorgestellt und diskutiert. Außerdem steht dort ein Newsletter zum Abonnieren bereit.


## 7. Rechtliches

„BITS Behörden-IT-Sicherheitstraining“ basiert auf open beware!, das von der BDG GmbH & Co. KG, jetzt NTT Security GmbH, herausgegeben wurde.

Die Urheber sind Herr Dr. Lutz Gollan und Herr Hartmut Honermann, PureSec GmbH.

Die technische Realisierung erfolgt durch Herrn Werner Eising und durch Herrn Andreas Hösl von der Chr. Mayr GmbH + Co. KG.

Das verwendete [hugo-Framework](https://gohugo.io/) steht unter der [Apache-Lizenz, v2.0](https://www.apache.org/licenses/LICENSE-2.0), das [Relearn-Theme](https://themes.gohugo.io/hugo-theme-relearn/) und das [Quiz](https://bonartm.github.io/hugo-quiz/) inkl. [quizdown-js](https://github.com/bonartm/quizdown-js) unter der [MIT-Lizenz](https://opensource.org/licenses/MIT). Die Icons stammen von https://fontawesome.com und sind Open Source. Das Bild auf der 404-Fehlerseite ist open source: Photo by [Donald Giannatti](https://unsplash.com/@wizwow?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/deadend?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).

BITS ist kostenlos und steht unter der Creative Commons (CC) Lizenz BY-SA (https://creativecommons.org/licenses/by-sa/4.0/deed.de).


Sie dürfen:

- Teilen:
  das Material in jedwedem Format oder Medium vervielfältigen und weiterverbreiten
- Bearbeiten:
  das Material remixen, verändern und darauf aufbauen und zwar für beliebige Zwecke, sogar kommerziell.


Der Lizenzgeber kann diese Freiheiten nicht widerrufen solange Sie sich an die Lizenzbedingungen halten:

- Namensnennung
  Sie müssen angemessene Urheber- und Rechteangaben machen, einen Link zur Lizenz (diese Seite) beifügen und angeben, ob Änderungen vorgenommen wurden. Diese Angaben dürfen in jeder angemessenen Art und Weise gemacht werden, allerdings nicht so, dass der Eindruck entsteht, der Lizenzgeber unterstütze gerade Sie oder Ihre Nutzung besonders.
- Weitergabe unter gleichen Bedingungen
  Wenn Sie das Material remixen, verändern oder anderweitig direkt darauf aufbauen, dürfen Sie Ihre Beiträge nur unter derselben Lizenz wie das Original verbreiten.
- Keine weiteren Einschränkungen
  Sie dürfen keine zusätzlichen Klauseln oder technische Verfahren einsetzen, die anderen rechtlich irgendetwas untersagen, was die Lizenz erlaubt.

Beim Kapitel "Cloud" hat Frau Heike Brzezina wertvolle Hinweise gegeben.

# 8. Feedback

## via E-Mail

Änderungs- oder Ergänzungswünsche nimmt Dr. Lutz Gollan ([g@backbeat.eu](mailto:g@backbeat.eu)) gerne entgegen. 

## via GitHub

Der "Quellcode" von [BITS](https://github.com/BITS-Training/BITS-hugo) ist auf GitHub öffentlich verfügbar. Mit [Hugo](https://gohugo.io) kann man daraus die statischen Seiten bauen.

Anregungen, Wünsche und Bugs können einfach mit Hilfe von [Issues](https://github.com/BITS-Training/BITS-hugo/issues) mitgeteilt und besprochen werden. Und wer sich richtig mit Git und GitHub auskennt, kann auch das gesamte Repository forken und Anpassungen selbst vornehmen. Über einen Pull-Request würden wir uns dann sehr freuen.
