# Entwicklungshinweise

[English](../en/DEVELOPMENT.md) | [日本語](../ja/DEVELOPMENT.md) | Deutsch | [Français](../fr/DEVELOPMENT.md) | [简体中文](../zh_CN/DEVELOPMENT.md)

## Projektübersicht
Dies ist ein Thunderbird Add-on, das Google's Gemini AI integriert, um E-Mails vor dem Versenden zu überprüfen.

## Architektur

### Ablauf der Komponenteninteraktion
1. Benutzer verfasst E-Mail in Thunderbird
2. Benutzer klickt auf den "Gemini Mail Review"-Button in der Verfassen-Symbolleiste
3. `popup.js` öffnet sich und startet sofort die Analyse:
   - Ruft API-Schlüssel und Endpunkt aus dem lokalen Speicher ab
   - Holt Verfassen-Details (Betreff, Empfänger, Text)
   - Bereinigt Inhalte zur Verhinderung von Prompt-Injection
   - Ruft Gemini API mit Analyse-Prompt über konfigurierten Endpunkt auf
   - Zeigt Ergebnisse in Popup-UI an
4. Benutzer prüft Feedback und entscheidet, ob bearbeitet oder gesendet wird

### Dateistruktur
```
├── manifest.json          # Extension-Manifest
├── background.js          # Hintergrundskript (minimal)
├── popup.html/css/js      # Hauptprüfungsoberfläche
├── options.html/css/js    # Einstellungsseite
├── icons/                 # Extension-Icons
├── package.json           # Projekt-Metadaten
├── README.md              # Benutzerdokumentation
├── USAGE.md               # Nutzungsanleitung
└── DEVELOPMENT.md         # Diese Datei
```

## Sicherheitsüberlegungen

### Implementierte Sicherheitsmaßnahmen

1. **API-Schlüsselschutz**
   - Gespeichert in browser.storage.local (nicht zugänglich für andere Erweiterungen)
   - Gesendet über HTTP-Header, nicht URL-Parameter
   - Niemals protokolliert oder übertragen außer an Google API
   - Formatvalidierung vor Verwendung

2. **Inhaltsbereinigung**
   - Maximale Inhaltslänge: 10.000 Zeichen
   - Entfernung potenzieller Injection-Muster:
     - Anweisungs-Tags: `[INST]`, `[/INST]`
     - System-Tags: `<<SYS>>`, `<</SYS>>`
     - Markdown-Header am Zeilenanfang
     - Code-Block-Begrenzer
     - Horizontale Linien
   - Verhindert Prompt-Injection-Angriffe

3. **Typsicherheit**
   - Behandelt verschiedene Empfängerformate (Array/String)
   - Defensive Programmierung durchgehend
   - Umfassende Fehlerbehandlung

### Ergebnisse des Sicherheitsscans
- CodeQL: 0 Warnungen
- Keine XSS-Schwachstellen
- Keine Injection-Schwachstellen
- Keine Offenlegung von Anmeldeinformationen

## API-Integration

### Konfigurierbarer Gemini API-Endpunkt

Das Add-on unterstützt konfigurierbare API-Endpunkte, sodass Benutzer verschiedene Gemini-Modelle auswählen können:

**Standard-Endpunkt:**
```
https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
```

**Alternative Modelle:**
- `gemini-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
- `gemini-1.5-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`
- `gemini-2.0-flash`: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`

Benutzer können den Endpunkt auf der Optionsseite konfigurieren. Wenn kein benutzerdefinierter Endpunkt festgelegt ist, wird automatisch der Standard (gemini-2.5-flash) verwendet.

### Benutzerdefinierte Prompt-Vorlagen

Das Add-on unterstützt bis zu 3 benutzerdefinierte Prompt-Vorlagen, die Benutzer konfigurieren können:

**Funktionen:**
- Jede Vorlage hat einen Namen und Inhalt
- Vorlagennamen werden in der Popup-UI zur einfachen Auswahl angezeigt
- Benutzer können Vorlagen vor der E-Mail-Analyse auswählen und bearbeiten
- Vorlagen werden in browser.storage.local gespeichert
- Prompts werden der Analyseanfrage vorangestellt

**Speicherformat:**
```javascript
{
  customPromptTemplates: {
    template1: { name: 'Business Email', content: 'Review this email...' },
    template2: { name: 'Casual Email', content: 'Check if...' },
    template3: { name: '', content: '' }
  }
}
```

**UI-Ablauf:**
1. Benutzer öffnet Popup → Vorlagenauswahl erscheint
2. Benutzer wählt Vorlage aus Dropdown (zeigt Vorlagennamen an)
3. Vorlageninhalt lädt in bearbeitbares Textfeld
4. Benutzer kann Prompt vor Analyse ändern
5. Geänderter Prompt wird für diese spezifische Überprüfung verwendet
6. Original-Vorlage in den Einstellungen bleibt unverändert

### Anforderungsformat
```javascript
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }]
  })
}
```

### Antwortformat
```javascript
{
  candidates: [{
    content: {
      parts: [{ text: "Analysis result..." }]
    }
  }]
}
```

## Teststrategie

### Checkliste für manuelle Tests
- [ ] Add-on in Thunderbird installieren
- [ ] API-Schlüssel in Einstellungen konfigurieren
- [ ] Verbindungsüberprüfung testen
- [ ] E-Mail verfassen und Prüfung auslösen
- [ ] Überprüfen, ob Analyse korrekt angezeigt wird
- [ ] Fehlerbehandlung testen (ungültiger API-Schlüssel)
- [ ] Mit verschiedenen E-Mail-Formaten testen
- [ ] Mit langen E-Mails testen (>10k Zeichen)
- [ ] Überprüfen, ob Schaltflächen funktionieren (E-Mail bearbeiten, Trotzdem senden)

### Behandelte Sonderfälle
- Leerer Betreff/Text/Empfänger
- Sehr lange E-Mails (gekürzt bei 10k Zeichen)
- Empfänger in verschiedenen Formaten (Array vs. String)
- Ungültiger API-Schlüssel
- Netzwerkfehler
- API-Ratenbegrenzung
- Fehlerhafte API-Antworten

## Zukünftige Verbesserungen (außerhalb des Umfangs)

1. **Anhang-Analyse**: Fehlende Anhänge basierend auf E-Mail-Inhalt erkennen
2. **Mehrere AI-Modelle**: Andere AI-Anbieter unterstützen (OpenAI, Claude, etc.)
3. **Stapelüberprüfung**: Mehrere Entwurfs-E-Mails gleichzeitig überprüfen
4. **Verlauf**: Prüfungsverlauf und häufige Probleme verfolgen
5. **Vorschläge anwenden**: AI-Vorschläge mit einem Klick automatisch anwenden
6. **Offline-Modus**: Häufige Prüfungen für Offline-Nutzung zwischenspeichern
7. **Sprachunterstützung**: Mehrsprachige E-Mail-Analyse
8. **Mehr Vorlagenslots**: Mehr als 3 benutzerdefinierte Prompt-Vorlagen unterstützen

## Bekannte Einschränkungen

1. **API-Abhängigkeit**: Erfordert aktive Internetverbindung und gültigen API-Schlüssel
2. **Keine Anhang-Analyse**: Kann tatsächliche Anhang-Präsenz nicht überprüfen
3. **Ratenlimits**: Unterliegt Google's API-Ratenlimits (60 Anf./Min. im kostenlosen Tarif)
4. **Nur Klartext**: Analysiert Klartext-Text, nicht HTML-Formatierung
5. **Nicht in Echtzeit**: Analyse erfolgt auf Anfrage, nicht während des Tippens
6. **Englisch-fokussiert**: AI funktioniert am besten mit englischen E-Mails

## Entwicklungsumgebung

### Anforderungen
- Thunderbird 102.0 oder später
- Node.js (für Syntaxprüfung)
- Python 3 (für Icon-Generierung, Pillow)
- Internetverbindung für API-Tests

### Entwicklungsbefehle
```bash
# JavaScript-Syntax validieren
node --check *.js

# JSON validieren
python3 -m json.tool manifest.json

# Extension verpacken (erfordert web-ext)
npm run package

# In Thunderbird ausführen (erfordert web-ext)
npm run start
```

### Laden für Entwicklung
1. Thunderbird öffnen
2. Gehe zu Extras → Add-ons und Themes
3. Klicke auf Zahnrad-Symbol → Add-ons debuggen
4. Klicke auf "Temporäres Add-on laden"
5. Wähle manifest.json aus diesem Verzeichnis

## Wartungshinweise

### Versionsaktualisierungen
- Version in `manifest.json` und `package.json` zusammen aktualisieren
- README aktualisieren, wenn sich Funktionen ändern
- Sicherheitsscans vor Releases durchführen

### API-Änderungen
Wenn Google die Gemini API ändert:
- Endpunkt in `popup.js` und `options.js` aktualisieren
- Anfrage-/Antwortformat nach Bedarf aktualisieren
- Fehlerbehandlung für neue Fehlercodes aktualisieren
- Gründlich testen vor Release

### Browser-Kompatibilität
- Thunderbird 102+: Vollständig unterstützt
- Ältere Versionen: Könnten Compose-API-Funktionen fehlen
- Vor Release auf mehreren Thunderbird-Versionen testen

## Beitragsrichtlinien

1. Minimale Codeänderungen beibehalten
2. Bestehenden Code-Stil befolgen
3. Kommentare nur für komplexe Logik hinzufügen
4. Syntaxvalidierung vor Commit ausführen
5. CodeQL-Sicherheitsscan durchführen
6. Dokumentation aktualisieren, wenn sich Verhalten ändert
7. Manuell in Thunderbird testen

## Lizenz
MIT-Lizenz - Siehe LICENSE-Datei
