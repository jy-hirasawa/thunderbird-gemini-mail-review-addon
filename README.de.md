# Gemini Mail Review - Thunderbird Add-on

Ein Thunderbird-Add-on, das Google's Gemini AI verwendet, um Ihre E-Mails vor dem Senden zu überprüfen. Erhalten Sie intelligentes Feedback zu Rechtschreibung, Grammatik, Tonfall, Klarheit und potenziellen Problemen.

[English](README.md) | [日本語](README.ja.md) | Deutsch | [Français](README.fr.md) | [简体中文](README.zh_CN.md)

## Funktionen

- 🤖 **KI-gestützte Überprüfung**: Verwendet Google's Gemini Pro Modell zur Analyse Ihrer E-Mails
- ✅ **Umfassende Prüfungen**: Überprüft Rechtschreibung, Grammatik, Tonfall, Professionalität und Klarheit
- ⚠️ **Problemerkennung**: Identifiziert potenzielle Probleme wie fehlende Anhänge oder unklare Nachrichten
- 🎯 **Einfach zu bedienen**: Klicken Sie einfach auf das Add-on-Symbol im Verfassen-Fenster
- 🔒 **Sicher**: API-Schlüssel und Cache-Daten sind mit AES-GCM-Verschlüsselung geschützt und lokal in Thunderbird gespeichert
- 📦 **Intelligentes Caching**: Speichert automatisch Antworten zwischen, um redundante API-Aufrufe für denselben E-Mail-Inhalt zu vermeiden

## Installation

### Aus der Quelle

1. Laden Sie die neueste Version von https://github.com/jy-hirasawa/thunderbird-gemini-mail-review-addon/releases/ herunter
2. Öffnen Sie Thunderbird
3. Gehen Sie zu **Extras** → **Add-ons und Themes** (oder drücken Sie `Strg+Umschalt+A`)
4. Klicken Sie auf das Zahnradsymbol ⚙️ und wählen Sie **Add-on aus Datei installieren**
5. Navigieren Sie zum Add-on-Verzeichnis und wählen Sie die Datei `manifest.json`

### Anforderungen

- Thunderbird 102.0 oder höher
- Ein Google Gemini API-Schlüssel (kostenlose Version verfügbar)

## Einrichtung

1. Holen Sie sich einen Gemini API-Schlüssel:
   - Besuchen Sie [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Melden Sie sich mit Ihrem Google-Konto an
   - Klicken Sie auf **API-Schlüssel erstellen**
   - Kopieren Sie den generierten Schlüssel

2. Konfigurieren Sie das Add-on:
   - Gehen Sie in Thunderbird zu **Extras** → **Add-ons und Themes**
   - Finden Sie **Gemini Mail Review** in Ihrer Add-on-Liste
   - Klicken Sie auf **Einstellungen** oder **Optionen**
   - Fügen Sie Ihren API-Schlüssel ein
   - (Optional) Passen Sie die API-Endpunkt-URL an, wenn Sie ein anderes Gemini-Modell verwenden möchten
     - Standard: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
   - (Optional) Fügen Sie benutzerdefinierte Eingabeaufforderungsvorlagen hinzu, um anzupassen, wie Gemini Ihre E-Mails analysiert
     - Sie können bis zu 3 benutzerdefinierte Eingabeaufforderungsvorlagen mit Namen speichern
     - Jede Vorlage ist bei der Überprüfung von E-Mails zur Auswahl verfügbar
     - Benutzerdefinierte Eingabeaufforderungen werden der Analyseanfrage vorangestellt
     - **Mehrsprachige Unterstützung**: Schreiben Sie Eingabeaufforderungen in jeder Sprache für Analyseergebnisse in dieser Sprache
     - Beispiel (Englisch): "Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
     - Beispiel (Japanisch): "以下のメール本文が、取引先・顧客など会社宛てのメールとして、敬語や言い回しが適切か、失礼・不自然・誤解を招く表現がないか、ビジネスメールとして十分にフォーマルかを確認してください。問題点があれば、理由とあわせて修正案を提示してください。"
   - (Optional) Konfigurieren Sie die Cache-Aufbewahrungstage (1-365 Tage)
     - Standard: 7 Tage
     - Bestimmt, wie lange zwischengespeicherte Analyseergebnisse aufbewahrt werden, bevor sie ablaufen
   - Klicken Sie auf **Einstellungen speichern**
   - (Optional) Klicken Sie auf **Verbindung testen**, um zu überprüfen, ob Ihre Konfiguration funktioniert

## Verwendung

1. Verfassen Sie wie gewohnt eine E-Mail in Thunderbird
2. Klicken Sie vor dem Senden auf das **Gemini Mail Review**-Symbol in der Symbolleiste des Verfassen-Fensters
3. Das Add-on öffnet sich mit einer Vorlagenauswahlschnittstelle:
   - **Benutzerdefinierte Eingabeaufforderungsvorlage auswählen**: Wählen Sie aus Ihren gespeicherten Vorlagen (Vorlage 1, 2 oder 3)
   - **Benutzerdefinierte Eingabeaufforderung bearbeiten**: Überprüfen und ändern Sie die Eingabeaufforderung vor der Analyse
   - Klicken Sie auf **E-Mail analysieren**, um die Überprüfung zu starten
4. Das Add-on analysiert Ihre E-Mail und zeigt die Ergebnisse an
   - Wenn Sie diese exakte E-Mail bereits analysiert haben (gleicher Betreff, Empfänger und Inhalt), wird die zwischengespeicherte Antwort sofort angezeigt
   - Ein Indikator "📦 Zwischengespeicherte Antwort wird angezeigt" erscheint bei der Anzeige zwischengespeicherter Ergebnisse
5. Überprüfen Sie das KI-Feedback und die Vorschläge
6. Wählen Sie entweder:
   - **Erneut von Gemini anfordern**: Holen Sie eine neue Analyse von der API (wird nur für zwischengespeicherte Ergebnisse oder bei geändertem Inhalt angezeigt)
   - **E-Mail bearbeiten**: Schließen Sie das Popup und nehmen Sie Änderungen vor
   - **Trotzdem senden**: Fahren Sie mit dem Senden fort (die E-Mail wird nicht automatisch gesendet - Sie müssen noch auf Senden klicken)

### Caching-Verhalten

Das Add-on speichert Gemini-Antworten intelligent zwischen, um:
- **API-Aufrufe zu sparen**: Unnötige Anfragen für bereits analysierte E-Mails vermeiden
- **Schnelleres Feedback**: Sofortige Ergebnisse beim erneuten Öffnen derselben E-Mail anzeigen
- **Intelligente Erkennung**: Erkennt automatisch, wenn sich der E-Mail-Inhalt ändert, und zeigt zuerst die vorherige Analyse an

**Wie Caching funktioniert:**
- Jede E-Mail wird durch einen eindeutigen Hash aus Betreff, Empfängern und Inhalt identifiziert
- Jede Verfassen-Registerkarte verfolgt den zuletzt analysierten Inhalt, um Änderungen zu erkennen
- Wenn Sie dieselbe E-Mail erneut analysieren, wird die zwischengespeicherte Antwort sofort angezeigt
- **Wenn Sie die E-Mail bearbeiten und erneut überprüfen:**
  - Die vorherige Analyse wird zuerst mit einem Indikator "⚠️ E-Mail-Inhalt hat sich geändert" angezeigt
  - Eine Schaltfläche "Erneut von Gemini anfordern" erscheint, um eine neue Analyse für den aktualisierten Inhalt zu erhalten
  - Dies ermöglicht es Ihnen, schnell das vorherige Feedback zu sehen, während Sie entscheiden, ob Sie eine neue Überprüfung benötigen
- Der Cache speichert die letzten 50 E-Mail-Analysen (älteste Einträge werden automatisch entfernt)
- Zwischengespeicherte Antworten werden für einen konfigurierbaren Zeitraum (Standard: 7 Tage) aufbewahrt und laufen danach automatisch ab
- Sie können den Cache-Aufbewahrungszeitraum in den Einstellungen anpassen (1-365 Tage)
- Der Cache wird lokal in Ihrem Thunderbird-Profil mit browser.storage.local gespeichert

## Was wird analysiert

Das Add-on sendet die folgenden Informationen zur Analyse an Gemini:
- E-Mail-Betreffzeile
- Empfänger
- E-Mail-Text (Klartext)

Die KI überprüft auf:
- Rechtschreib- und Grammatikfehler
- Tonfall und Professionalität
- Klarheit und Prägnanz
- Fehlende Informationen
- Potenzielle Probleme oder Bedenken

## Datenschutzhinweis

Dieses Add-on sendet Ihren E-Mail-Inhalt zur Analyse an Google's Gemini API. Ihre E-Mails werden gemäß [Google's Datenschutzerklärung](https://policies.google.com/privacy) verarbeitet.

**Sicherheitsfunktionen**:
- API-Schlüssel und benutzerdefinierte Eingabeaufforderungen werden lokal mit AES-GCM-Verschlüsselung gespeichert
- Zwischengespeicherte E-Mail-Daten werden mit E-Mail-spezifischen Schlüsseln verschlüsselt
- Profilspezifische Verschlüsselung isoliert Daten zwischen verschiedenen Thunderbird-Profilen
- Verschlüsselungsschlüssel werden aus Profil-ID und E-Mail-ID abgeleitet
- Details finden Sie unter [SECURITY.md](doc/de/SECURITY.md)

**Wichtig**: Verwenden Sie dieses Add-on nicht für hochsensible oder vertrauliche E-Mails, es sei denn, Sie sind damit einverstanden, dass sie von Google's KI-Dienst verarbeitet werden.

## Entwicklung

### Projektstruktur

```
.
├── manifest.json       # Add-on-Manifest
├── background.js       # Hintergrundskript
├── popup.html         # Haupt-Popup-Oberfläche
├── popup.css          # Popup-Stile
├── popup.js           # Popup-Logik und API-Integration
├── options.html       # Einstellungsseite
├── options.css        # Einstellungsseitenstile
├── options.js         # Einstellungsseitenlogik
└── icons/             # Add-on-Symbole
```

### Erstellen

Dies ist eine reine WebExtension ohne erforderlichen Build-Schritt. Laden Sie einfach die Erweiterung wie im Installationsabschnitt beschrieben.

### Testen

1. Installieren Sie das Add-on (siehe Installationsabschnitt für Anweisungen)
2. Konfigurieren Sie Ihren API-Schlüssel in den Einstellungen
3. Verfassen Sie eine Test-E-Mail
4. Klicken Sie auf das Add-on-Symbol, um die Überprüfungsfunktion zu testen

## Fehlerbehebung

### "Bitte konfigurieren Sie Ihren Gemini API-Schlüssel"
- Gehen Sie zu den Add-on-Einstellungen und geben Sie Ihren API-Schlüssel ein
- Stellen Sie sicher, dass der Schlüssel gespeichert ist (Sie sollten eine Erfolgsmeldung sehen)

### "API-Anfrage fehlgeschlagen" oder Verbindungsfehler
- Überprüfen Sie, ob Ihr API-Schlüssel korrekt ist
- Prüfen Sie Ihre Internetverbindung
- Stellen Sie sicher, dass Sie die API-Ratenlimits nicht überschritten haben (kostenlose Version hat Limits)
- Versuchen Sie, die Verbindung auf der Einstellungsseite zu testen

### Das Popup erscheint nicht
- Stellen Sie sicher, dass Sie sich in einem Verfassen-Fenster befinden (nicht im Haupt-Thunderbird-Fenster)
- Versuchen Sie, das Verfassen-Fenster zu schließen und erneut zu öffnen
- Überprüfen Sie die Thunderbird-Fehlerkonsole auf Fehler

## Lizenz

MIT-Lizenz - siehe LICENSE-Datei für Details

## Mitwirken

Beiträge sind willkommen! Bitte zögern Sie nicht, Probleme oder Pull-Requests einzureichen.

## Haftungsausschluss

Dieses Add-on ist nicht offiziell mit Google oder Mozilla verbunden. Nutzung auf eigene Gefahr.
