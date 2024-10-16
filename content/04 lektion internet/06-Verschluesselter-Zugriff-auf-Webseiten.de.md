---
title: "Verschlüsselter Zugriff auf Webseiten"
date: 2021-03-09T10:13:49
draft: false
weight: 60
icon: globe-africa
---
Die meisten Webbrowser zeigen eine verschlüsselte Verbindung durch ein entsprechendes Symbol an, häufig durch ein kleines Vorhängeschloss in der Adresszeile.

Verschlüsselte Verbindungen im Internet werden über Digitale Signaturen abgesichert. Die Ausstellung und Überprüfung Digitaler Signaturen sind technisch komplizierte Prozesse. Sie werden jedoch von den Web-Browsern automatisch erledigt, Sie können dies aber auch kontrollieren (siehe unten).

Klicken Sie auf die folgenden Begriffe, wenn Sie weitere Informationen zu Digitalen Signaturen und den damit zusammenhängenden Gefahren wünschen:

{{% expand "Gefahren bei verschlüsseltem Zugriff" %}}
HTTPS stellt zwar die verschlüsselte Übertragung sicher, bei kritischen Transaktionen, wie z. B. dem Online-Banking, muss man zusätzlich sicherstellen, dass der Webserver, dem man seine Zugangsdaten verschlüsselt übersendet, auch wirklich der Webserver der gewünschten Bank ist. Ein beliebter Hacker-Trick ist  die sogenannte „Man-in-the-Middle-Attacke“. Dabei spielt der Hacker oder die Hackerin der surfenden Person vor, der verwendete Webserver sei der Server der Online-Bank. Nun baut man in gutem Glauben eine verschlüsselte Verbindung zu diesem Server auf und übermittelt die Zugangsdaten und Transaktionsnummern dem Hacker bzw. der Hackerin statt der Bank.
{{% /expand %}}

{{% expand "Digitale Signaturen" %}}
Jede HTTPS-Seite wird mit einer Digitalen Signatur versehen. Diese wirkt wie ein Echtheitssiegel. Sie stellt sicher, dass die Seite von einer zertifizierten Stelle erzeugt und nicht verändert wurde. Der Webbrowser überprüft automatisch, ob die Digitale Signatur gültig ist. Falls dies nicht der Fall ist, wird eine Warnmeldung angezeigt. Gründe können sein: die Webseite wurde bei der Übertragung verändert, die immer nur befristet gültige Digitale Signatur ist abgelaufen,  die Digitale Signatur wurde von einer nicht vertrauenswürdigen Stelle erstellt oder die angezeigte Seite stammt nicht vom Signaturinhaber bzw. von der Signaturinhaberin.
{{% /expand %}}

{{% notice note %}}

- HTTPS-Verbindungen werden unter anderem im Online-Banking verwendet, um sicher auf Konto-Informationen zuzugreifen.
- Im Web-Browser können jederzeit die Zertifikatsinformationen der Internetseite angezeigt werden. Dies geschieht meist durch Anklicken des Schloss-Symbols in der Adresszeile Ihres Browsers.
- Wird ein Zertifikatsfehler angezeigt, ist es abgelaufen oder ist das Zertifikat auf eine Ihnen unbekannte Stelle als Seiteninhaber ausgestellt, sollten Sie der Seite nicht vertrauen.
  {{% /notice %}}
