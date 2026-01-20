# Sicherheitsrichtlinie

[English](../en/SECURITY.md) | [日本語](../ja/SECURITY.md) | Deutsch | [Français](../fr/SECURITY.md) | [简体中文](../zh_CN/SECURITY.md)

## Datenspeicherung und Datenschutz

Dieses Add-on speichert die folgenden Daten lokal in Thunderbird's browser.storage.local:

### Gespeicherte Daten

1. **API-Schlüssel** (`geminiApiKeyEncrypted`)
   - Ihr Google Gemini API-Schlüssel
   - **Verschlüsselt mit AES-GCM und einem profilspezifischen Schlüssel** (NEU in v1.1)
   - Profilspezifischer Schlüssel wird mit PBKDF2 mit 100.000 Iterationen abgeleitet
   - Verschlüsselungsschlüssel basiert auf der Browser-Laufzeit-ID und einem zufälligen Salt
   - Niemals an einen Server übertragen außer an Google's Gemini API
   - Legacy-unverschlüsselte Schlüssel werden beim nächsten Speichern automatisch migriert

2. **API-Endpunkt** (`geminiApiEndpoint`)
   - Die Gemini API-Endpunkt-URL
   - Im Klartext gespeichert (nicht sensibel)
   - Validiert, um HTTPS-Protokoll und nur Google-Domains sicherzustellen
   - Geschützt gegen SSRF-Angriffe

3. **Benutzerdefinierte Prompt-Vorlagen** (`customPromptTemplatesEncrypted`)
   - Bis zu 3 benutzerdefinierte Prompt-Vorlagen mit Namen und Inhalt
   - **Verschlüsselt mit AES-GCM und einem profilspezifischen Schlüssel** (NEU in v1.1)
   - Gleicher Verschlüsselungsschlüssel wie API-Schlüssel
   - Bereinigt, um Prompt-Injection-Angriffe zu verhindern
   - Begrenzt auf 100 Zeichen für Namen und 5000 Zeichen für Inhalt
   - Legacy-unverschlüsselte Vorlagen werden beim nächsten Speichern automatisch migriert

4. **E-Mail-Cache** (`geminiCache`)
   - Zwischengespeicherte Analyseergebnisse einschließlich:
     - E-Mail-Betreff (bereinigt)
     - E-Mail-Empfänger (bereinigt)
     - E-Mail-Textinhalt (bereinigt, max. 10.000 Zeichen)
     - AI-Analyseantwort
     - Zeitstempel
     - Verwendeter benutzerdefinierter Prompt
   - **Jeder Cache-Eintrag wird mit AES-GCM verschlüsselt, wobei die E-Mail-ID als Schlüssel dient** (NEU in v1.1)
   - E-Mail-ID ist ein SHA-256-Hash des E-Mail-Inhalts (Betreff + Empfänger + Text)
   - Verschlüsselung stellt sicher, dass zwischengespeicherte Daten an bestimmten E-Mail-Inhalt gebunden sind
   - Begrenzt auf 50 neueste Einträge
   - Läuft automatisch basierend auf Cache-Aufbewahrungseinstellung ab (Standard: 7 Tage)
   - Kann manuell über Einstellungen gelöscht werden

5. **Zuletzt überprüfte Hashes** (`lastCheckedHashes`)
   - SHA-256-Hashes kürzlich überprüfter E-Mails zur Änderungserkennung
   - Begrenzt auf 20 neueste Einträge
   - Speichert nur Hash-Werte, nicht den tatsächlichen Inhalt
   - Nicht verschlüsselt (bereits gehasht)

6. **Profil-Verschlüsselungs-Salt** (`profileEncryptionSalt`)
   - Zufälliges 16-Byte-Salt zur Schlüsselableitung
   - Einmal pro Profil generiert
   - Als base64-String gespeichert
   - Wird zur Ableitung des profilspezifischen Verschlüsselungsschlüssels verwendet

## Verschlüsselungsimplementierung

### Verschlüsselungsalgorithmus

- **Algorithmus**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Schlüsselgröße**: 256 Bit
- **IV-Größe**: 12 Bytes (96 Bit), für jede Verschlüsselung zufällig generiert
- **Authentifizierung**: Integriertes Authentifizierungs-Tag mit AES-GCM

### Schlüsselableitung

1. **Profilspezifischer Schlüssel** (für Einstellungen):
   - Abgeleitet mit PBKDF2 mit SHA-256
   - Iterationen: 100.000 (hohe Sicherheit für sensible API-Schlüssel)
   - Salt: Zufälliges 16-Byte-Salt, eindeutig pro Profil
   - Basismaterial: Browser-Laufzeit-ID (eindeutig pro Installation/Profil)

2. **E-Mail-spezifischer Schlüssel** (für Cache):
   - Abgeleitet mit PBKDF2 mit SHA-256
   - Iterationen: 10.000 (niedriger für Leistung, dennoch sicher)
   - Salt: Feste Zeichenfolge für Konsistenz
   - Basismaterial: E-Mail-ID (SHA-256-Hash des E-Mail-Inhalts)

### Rückwärtskompatibilität

- Erkennt und entschlüsselt automatisch Legacy-unverschlüsselte Daten
- Migriert beim nächsten Speichern in verschlüsseltes Format
- Kein Datenverlust während der Migration

## Sicherheitsmaßnahmen

### Vorteile der Verschlüsselung

1. **Verbesserter Datenschutz**
   - API-Schlüssel und benutzerdefinierte Prompts werden nicht mehr im Klartext gespeichert
   - Zwischengespeicherter E-Mail-Inhalt wird mit E-Mail-spezifischen Schlüsseln verschlüsselt
   - Schutz vor unbefugtem Zugriff auf das Profilverzeichnis

2. **Profilspezifische Verschlüsselung**
   - Jedes Thunderbird-Profil hat seinen eigenen Verschlüsselungsschlüssel
   - In einem Profil verschlüsselte Daten können nicht in einem anderen entschlüsselt werden
   - Bietet Isolation zwischen verschiedenen Installationen

3. **E-Mail-spezifische Cache-Verschlüsselung**
   - Jede zwischengespeicherte E-Mail wird mit einem aus ihrem Inhalt abgeleiteten Schlüssel verschlüsselt
   - Selbst wenn jemand auf den Cache zugreift, benötigt er den E-Mail-Inhalt zum Entschlüsseln
   - Bietet zusätzliche Sicherheitsebene für zwischengespeicherte Daten

### Eingabevalidierung und -bereinigung

1. **API-Endpunkt-Validierung**
   - Muss HTTPS-Protokoll verwenden
   - Kann nicht localhost oder private IP-Adressen sein
   - Muss eine Google-API-Domain sein (googleapis.com)

2. **Inhaltsbereinigung**
   - E-Mail-Inhalt wird vor dem Senden an die API bereinigt
   - Entfernt gängige Prompt-Injection-Muster
   - Begrenzt Inhaltslänge auf 10.000 Zeichen
   - Entfernt Markdown-Codeblöcke und Anweisungs-Tags
   - Entfernt AI-Jailbreak-Muster (z.B. "vorherige Anweisungen ignorieren")

3. **Benutzerdefinierte Prompt-Bereinigung**
   - Begrenzt auf 5.000 Zeichen
   - Entfernt Prompt-Injection-Muster
   - Vorlagennamen begrenzt auf 100 Zeichen

4. **XSS-Prävention**
   - Analyseergebnisse werden mit `textContent` angezeigt (nicht `innerHTML`)
   - Kein benutzergeneriertes HTML wird gerendert

### Cache-Sicherheit

1. **Verschlüsselung** (NEU in v1.1)
   - Jeder Cache-Eintrag wird mit AES-GCM verschlüsselt, wobei die E-Mail-ID als Schlüssel verwendet wird
   - E-Mail-ID wird aus E-Mail-Inhalt abgeleitet (SHA-256-Hash)
   - Bietet inhaltsspezifische Verschlüsselung für zwischengespeicherte Daten

2. **Automatisches Ablaufen**
   - Zwischengespeicherte Daten laufen automatisch nach der konfigurierten Aufbewahrungsdauer ab
   - Standard-Aufbewahrung: 7 Tage (konfigurierbar 1-365 Tage)
   - Abgelaufene Einträge werden automatisch bereinigt

3. **Manuelles Cache-Löschen**
   - Benutzer können alle zwischengespeicherten Daten manuell über Einstellungen löschen
   - Enthält Bestätigungsdialog, um versehentliches Löschen zu verhindern

4. **Größenlimits**
   - Cache begrenzt auf 50 neueste Einträge
   - Älteste Einträge werden automatisch entfernt, wenn Limit erreicht wird

## Datenschutzüberlegungen

### Datenübertragung

- E-Mail-Inhalt wird zur Analyse an Google's Gemini API übertragen
- Daten werden über HTTPS gesendet
- Unterliegt [Google's Datenschutzrichtlinie](https://policies.google.com/privacy)

### Datenspeicherung

- Alle Daten werden lokal im Thunderbird-Profilverzeichnis gespeichert
- Keine Daten werden an Dritte übertragen außer an Google's Gemini API
- **API-Schlüssel und benutzerdefinierte Prompts sind jetzt verschlüsselt** (NEU in v1.1)
- **Zwischengespeicherte E-Mail-Daten sind jetzt verschlüsselt** (NEU in v1.1)
- Verschlüsselungsschlüssel werden aus profil- und E-Mail-spezifischen Kennungen abgeleitet

### Empfehlungen für sensible E-Mails

Für E-Mails mit sensiblen oder vertraulichen Informationen:

1. **Cache regelmäßig löschen**
   - Verwenden Sie die Schaltfläche "Alle zwischengespeicherten Daten löschen" in den Einstellungen
   - Erwägen Sie, den Cache nach der Bearbeitung sensibler E-Mails zu löschen

2. **Cache-Aufbewahrung reduzieren**
   - Setzen Sie die Cache-Aufbewahrung auf 1 Tag für sensible Arbeit
   - Konfigurierbar in Einstellungen → Cache-Aufbewahrungstage

3. **Caching deaktivieren** (Manueller Ansatz)
   - Cache vor und nach jeder Verwendung löschen
   - Hinweis: Dies erfordert API-Aufrufe für jede E-Mail-Prüfung

4. **Datenschutzrichtlinie überprüfen**
   - Verstehen Sie, dass E-Mail-Inhalte an Google's AI-Dienst gesendet werden
   - Überprüfen Sie Google's Datenhandhabungspraktiken

5. **Erwägen Sie, das Add-on nicht zu verwenden**
   - Für hochvertrauliche E-Mails erwägen Sie, keine AI-Überprüfung zu verwenden
   - Verlassen Sie sich stattdessen auf manuelle Überprüfung

## Melden von Sicherheitslücken

Wenn Sie eine Sicherheitslücke in diesem Add-on entdecken, melden Sie sie bitte durch:

1. Öffnen eines GitHub-Issues mit dem Tag `security`
2. Bereitstellung detaillierter Informationen über die Sicherheitslücke
3. Keine öffentliche Offenlegung der Sicherheitslücke, bis sie behoben wurde

## Einschränkungen

### Browser-Speichersicherheit

- **Verschlüsselung ist jetzt implementiert** (NEU in v1.1)
  - API-Schlüssel und benutzerdefinierte Prompts sind mit AES-GCM verschlüsselt
  - Zwischengespeicherte E-Mail-Daten sind mit E-Mail-spezifischen Schlüsseln verschlüsselt
  - Verschlüsselungsschlüssel werden aus Profil- und E-Mail-Kennungen abgeleitet
- Allerdings werden Verschlüsselungsschlüssel aus Laufzeitkennungen abgeleitet
  - Jemand mit Zugriff auf Ihr Thunderbird-Profil kann möglicherweise weiterhin auf Daten zugreifen
  - Die Verschlüsselung bietet zusätzlichen Schutz, ist aber keine Ende-zu-Ende-Verschlüsselung
- Browser-Speicher ist weiterhin für andere Add-ons mit Speicherberechtigungen zugänglich

### Verschlüsselungseinschränkungen

- **Schlüsselableitung**: Verschlüsselungsschlüssel werden aus Browser-Laufzeit-ID und Salts abgeleitet
  - Nicht so stark wie benutzerdefinierte Passwörter
  - Bietet Schutz gegen gelegentlichen Zugriff auf das Profilverzeichnis
  - Schützt nicht vor entschlossenen Angreifern mit vollem Systemzugriff

- **Kein Master-Passwort**: Im Gegensatz zu einem Passwort-Manager gibt es kein Master-Passwort
  - Kompromiss zwischen Benutzerfreundlichkeit und Sicherheit
  - Benutzer müssen nicht jedes Mal ein Passwort eingeben
  - Aber Verschlüsselung ist automatisch und transparent

### Keine Ende-zu-Ende-Verschlüsselung

- E-Mail-Inhalt wird an Google's Server übertragen
- Inhalt ist nicht Ende-zu-Ende verschlüsselt (außer HTTPS im Transit)
- Google kann die Daten gemäß ihrer Datenschutzrichtlinie verarbeiten und analysieren

### Lokale Systemsicherheit

- Sicherheit hängt von der Sicherheit Ihres lokalen Systems ab
- Malware oder unbefugter Zugriff auf Ihren Computer könnte gespeicherte Daten offenlegen
- Halten Sie Ihr System mit aktuellem Antivirus und Sicherheitspatches sicher
- Verwenden Sie Festplattenverschlüsselung für zusätzlichen Schutz

## Best Practices

1. **API-Schlüsselverwaltung**
   - Behandeln Sie Ihren API-Schlüssel wie ein Passwort
   - Teilen Sie Ihren API-Schlüssel nicht
   - Rotieren Sie Ihren API-Schlüssel regelmäßig
   - Verwenden Sie API-Schlüsselbeschränkungen in der Google Cloud Console

2. **Systemsicherheit**
   - Halten Sie Thunderbird aktuell
   - Halten Sie Ihr Betriebssystem aktuell
   - Verwenden Sie starke Passwörter/Verschlüsselung für Ihr Benutzerkonto
   - Aktivieren Sie Festplattenverschlüsselung bei der Handhabung sensibler Daten

3. **Cache-Verwaltung**
   - Löschen Sie regelmäßig den Cache für sensible E-Mails
   - Passen Sie die Aufbewahrungsdauer basierend auf Ihren Sicherheitsbedürfnissen an
   - Überwachen Sie, welche Daten zwischengespeichert werden

4. **Datenschutzbewusstsein**
   - Verstehen Sie, dass AI-Dienste Ihre Daten verarbeiten
   - Überprüfen Sie Google's Datenschutzrichtlinie regelmäßig
   - Seien Sie sich bewusst, welche Inhalte Sie zur Analyse einreichen

## Aktualisierungen und Wartung

- Sicherheitsverbesserungen sind fortlaufend
- Prüfen Sie regelmäßig auf Aktualisierungen
- Überprüfen Sie Changelog auf sicherheitsrelevante Korrekturen
- Melden Sie alle Sicherheitsbedenken über GitHub-Issues
