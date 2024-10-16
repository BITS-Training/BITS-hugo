---
title: "Schutz vor technischen Webinhalten"
date: 2021-03-09T10:13:31
draft: false
weight: 50
icon: globe-africa
---
- In den meisten {{< param Einrichtungen >}} ist eine sichere Konfiguration des Browsers fest vorgegeben! Versuchen Sie nicht, diese zu ändern.
- Laden und starten Sie keine Programme von Webseiten, sofern Sie nicht dienstlich dazu angehalten werden.

Damit Zugangsdaten und Seiteninhalte bei der Übertragung im offenen Internet nicht von Dritten mitgelesen werden können, wird für die Übertragung das technische Protokoll „TLS“ (Transport Layer Security) verwendet. Entsprechende Angebote erkennen Sie u. a. an der der Adresse vorangestellten Abkürzung „https“.

Zu allen Seiten, deren Adresse mit **https://** beginnt, baut der Browser automatisch eine verschlüsselte Verbindung auf. So wird sichergestellt, dass bei der Übermittlung grundsätzlich keine Daten mitgelesen oder verändert werden können. Hierfür muss das Zertifikat der Internetseite (siehe unten stehender Tipp) der herausgebenden Stelle der Seite zugeordnet sein.

{{% notice tip %}}
Ein Zertifikat ist eine „elektronische Bescheinigung“, mit der die Zuordnung  einer Internetseite zu ihrer herausgebenden Stelle dokumentiert wird. Damit verbunden ist die Absicherung der Seitenaufrufe über eine Transportverschlüsselung (über HTTPS, siehe die Erläuterungen zum [Technischen Aufbau des Internets](/04-lektion-internet/01-Was-ist-das-Internet)).
Das Zertifikat einer Internetseite können Sie aufrufen, in dem Sie in der Adresszeile Ihres Browsers auf das Schloss-Symbol klicken.

{{% /notice %}}
