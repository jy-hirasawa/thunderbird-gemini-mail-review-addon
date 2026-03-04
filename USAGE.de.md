# Nutzungsanleitung

[English](USAGE.md) | [日本語](USAGE.ja.md) | Deutsch | [Français](USAGE.fr.md) | [简体中文](USAGE.zh_CN.md) | [Italiano](USAGE.it.md)

## Schnellstart

1. **Installieren Sie das Add-on**
   - Installieren Sie das Add-on in Thunderbird (siehe README.md für Installationsanweisungen)

2. **Konfigurieren Sie Ihren API-Schlüssel und Endpunkt**
   - Gehen Sie zu **Extras** → **Add-ons und Themes**
   - Suchen Sie **Gemini Mail Review** und klicken Sie auf **Einstellungen**
   - Geben Sie Ihren Gemini API-Schlüssel ein
   - (Optional) Passen Sie die API-Endpunkt-URL an, um ein anderes Gemini-Modell zu verwenden
     - Standard: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
     - Sie können dies ändern, um andere Modelle wie `gemini-pro`, `gemini-1.5-pro` usw. zu verwenden
   - (Optional) Fügen Sie benutzerdefinierte Prompt-Vorlagen hinzu, um anzupassen, wie Gemini Ihre E-Mails analysiert
     - Sie können bis zu 3 benutzerdefinierte Prompt-Vorlagen mit Namen speichern
     - Jede Vorlage kann einen beschreibenden Namen und benutzerdefinierte Anweisungen haben
     - **Mehrsprachige Unterstützung**: Schreiben Sie Ihren benutzerdefinierten Prompt in beliebiger Sprache, und Gemini wird in derselben Sprache antworten
       - Englischer Prompt → Englische Analyseergebnisse
       - Japanischer Prompt (日本語) → Japanische Analyseergebnisse (日本語)
       - Spanischer Prompt (Español) → Spanische Analyseergebnisse (Español)
       - Dies funktioniert für jede von Gemini unterstützte Sprache
     - Beispiel für Geschäfts-E-Mail-Prüfung (Englisch): "Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
     - Beispiel für Geschäfts-E-Mail-Prüfung (Japanisch): "以下のメール本文が、取引先・顧客など会社宛てのメールとして、敬語や言い回しが適切か、失礼・不自然・誤解を招く表現がないか、ビジネスメールとして十分にフォーマルかを確認してください。問題点があれば、理由とあわせて修正案を提示してください。"
   - Klicken Sie auf **Verbindung testen**, um Ihre Konfiguration zu überprüfen
   - Klicken Sie auf **Einstellungen speichern**

   ![Settings Page](doc/images/settings-page.png)
   *Einstellungsseite mit API-Schlüssel-Konfiguration, benutzerdefinierten Prompts und anderen Optionen*

3. **Verfassen Sie eine E-Mail**
   - Erstellen Sie eine neue E-Mail oder antworten Sie auf eine vorhandene
   - Schreiben Sie Ihre E-Mail wie gewohnt

4. **Überprüfen Sie vor dem Senden**
   - Bevor Sie auf Senden klicken, klicken Sie auf das **Gemini Mail Review**-Symbol in der Symbolleiste des Verfassen-Fensters
   
   ![Compose Window with Icon](doc/images/compose-window-icon.png)
   *Das Gemini Mail Review-Symbol in der Symbolleiste des Thunderbird-Verfassen-Fensters*
   
   - Das Popup öffnet sich mit Vorlagenauswahl:
     - Wählen Sie eine benutzerdefinierte Prompt-Vorlage aus dem Dropdown-Menü aus (falls Sie welche konfiguriert haben)
     - Überprüfen und bearbeiten Sie den benutzerdefinierten Prompt bei Bedarf
     - Klicken Sie auf **E-Mail analysieren**, um die Analyse zu starten
   
   ![Template Selection](doc/images/popup-template-selection.png)
   *Popup mit Vorlagenauswahl und benutzerdefiniertem Prompt-Editor*
   
   - Warten Sie auf die KI-Analyse (normalerweise 2-5 Sekunden)
   
   ![Analyzing](doc/images/popup-analyzing.png)
   *Analyse läuft*
   
   - Überprüfen Sie das Feedback
   
   ![Analysis Results](doc/images/popup-results.png)
   *KI-Feedback und Vorschläge werden angezeigt*

5. **Reagieren Sie auf das Feedback**
   - **E-Mail bearbeiten**: Schließen Sie das Popup und nehmen Sie Änderungen basierend auf den Vorschlägen vor
   - **Trotzdem senden**: Schließen Sie das Popup und fahren Sie mit dem Senden fort (Sie müssen noch auf die Senden-Schaltfläche klicken)

## Zwischengespeicherte Ergebnisse verstehen

Wenn Sie dieselbe E-Mail mehrmals analysieren, verwendet das Add-on intelligente Zwischenspeicherung, um API-Aufrufe zu sparen und sofortiges Feedback zu liefern.

### Zwischengespeicherte Antwort
Wenn Sie eine E-Mail überprüfen, die Sie bereits analysiert haben, sehen Sie einen Indikator für zwischengespeicherte Antworten:

![Cached Result](doc/images/popup-cached-result.png)
*Zwischengespeichertes Analyseergebnis wird sofort mit "📦 Showing cached response"-Indikator angezeigt*

### Warnung bei geändertem Inhalt
Wenn Sie Ihre E-Mail nach der Analyse bearbeiten, zeigt die nächste Überprüfung die vorherige Analyse mit einer Warnung an:

![Content Changed](doc/images/popup-content-changed.png)
*Vorherige Analyse mit "⚠️ Email content has changed"-Warnung und Option zur Anforderung einer neuen Analyse*

Dies ermöglicht Ihnen:
- Ihr vorheriges Feedback schnell zu sehen
- Zu entscheiden, ob Sie eine neue Analyse für Ihre Änderungen benötigen
- Auf "Request Again from Gemini" zu klicken, wenn Sie eine neue Analyse des aktualisierten Inhalts wünschen

## Beispiel-Anwendungsfälle

### Prüfung auf Grammatikfehler
**Szenario**: Sie sind sich nicht sicher, ob Ihre E-Mail Tippfehler oder Grammatikfehler enthält.

**Aktion**: Klicken Sie auf die Gemini Mail Review-Schaltfläche. Die KI identifiziert Rechtschreib- und Grammatikfehler und schlägt Korrekturen vor.

### Überprüfung des professionellen Tons
**Szenario**: Sie senden eine wichtige Geschäfts-E-Mail und möchten sicherstellen, dass sie professionell klingt.

**Aktion**: Verwenden Sie die Überprüfungsfunktion, um Feedback zu Ton und Professionalität zu erhalten. Die KI teilt Ihnen mit, ob der Ton angemessen ist oder Anpassungen erforderlich sind.

### Fehlende Anhänge erkennen
**Szenario**: Sie haben "siehe Anhang" in Ihrer E-Mail erwähnt, aber vergessen, die Datei anzuhängen.

**Aktion**: Die KI kann erkennen, wenn Sie Anhänge erwähnen, und Sie warnen, wenn keine angehängt sind (Hinweis: Dies erfordert, dass der E-Mail-Inhalt Anhänge erwähnt).

### Klarheitsprüfung
**Szenario**: Sie haben eine komplexe E-Mail geschrieben und möchten sicherstellen, dass sie klar ist.

**Aktion**: Die Überprüfung identifiziert unklare Abschnitte und schlägt Möglichkeiten zur Verbesserung von Klarheit und Prägnanz vor.

### Mehrsprachige E-Mail-Überprüfung
**Szenario**: Sie schreiben E-Mails in anderen Sprachen als Englisch und möchten eine Analyse in Ihrer Muttersprache.

**Aktion**: Erstellen Sie eine benutzerdefinierte Prompt-Vorlage in Ihrer bevorzugten Sprache. Die KI analysiert Ihre E-Mail und gibt Feedback in derselben Sprache. Zum Beispiel:
- Schreiben Sie Ihren benutzerdefinierten Prompt auf Japanisch → Erhalten Sie Analyseergebnisse auf Japanisch
- Schreiben Sie Ihren benutzerdefinierten Prompt auf Spanisch → Erhalten Sie Analyseergebnisse auf Spanisch
- Schreiben Sie Ihren benutzerdefinierten Prompt auf Französisch → Erhalten Sie Analyseergebnisse auf Französisch

**Beispiel für benutzerdefinierte Prompts nach Sprache**:

**Japanisch (日本語)**:
```
このメールを分析して、以下の点を確認してください：
- 文法とスペルミス
- 敬語の適切な使用
- ビジネスメールとしての適切さ
- 言い回しの自然さ
問題点があれば、理由と修正案を日本語で提示してください。
```

**Spanisch (Español)**:
```
Analiza este correo electrónico y verifica:
- Gramática y ortografía
- Tono profesional
- Claridad del mensaje
- Posibles problemas
Proporciona comentarios y sugerencias en español.
```

**Französisch (Français)**:
```
Analysez cet e-mail et vérifiez:
- La grammaire et l'orthographe
- Le ton professionnel
- La clarté du message
- Les problèmes potentiels
Fournissez des commentaires et des suggestions en français.
```

## Überprüfungsergebnisse verstehen

Die KI-Analyse umfasst typischerweise:

- **✓ Positives Feedback**: Was in Ihrer E-Mail gut funktioniert
- **⚠️ Warnungen**: Dinge, die besorgniserregend sein könnten, aber nicht unbedingt Fehler sind
- **❌ Probleme**: Probleme, die vor dem Senden behoben werden sollten
- **💡 Vorschläge**: Spezifische Empfehlungen zur Verbesserung

## Tipps für beste Ergebnisse

1. **Erst schreiben, dann überprüfen**: Vervollständigen Sie Ihre E-Mail, bevor Sie die Überprüfung für umfassenderes Feedback durchführen
2. **Beschreibende Betreffzeilen verwenden**: Fügen Sie eine Betreffzeile für bessere Kontextanalyse hinzu
3. **Regelmäßig überprüfen**: Machen Sie es sich zur Gewohnheit, wichtige E-Mails vor dem Senden zu überprüfen
4. **Nicht übermäßig verlassen**: Verwenden Sie die KI als hilfreichen Assistenten, nicht als Ersatz für Ihr Urteilsvermögen
5. **Datenschutzbewusstsein**: Denken Sie daran, dass Ihre E-Mail zur Analyse an die API von Google gesendet wird

## Fehlerbehebung

### Keine Analyseergebnisse
- Überprüfen Sie Ihre Internetverbindung
- Stellen Sie sicher, dass Ihr API-Schlüssel korrekt konfiguriert ist
- Stellen Sie sicher, dass Sie die API-Ratenlimits nicht überschritten haben

### Langsame Antwort
- Große E-Mails benötigen länger zur Analyse
- Die Antwortzeiten der API können je nach Serverlast variieren
- Erwägen Sie, Abschnitte separat für sehr lange E-Mails zu überprüfen

### Ungenaue Vorschläge
- Die KI ist hilfreich, aber nicht perfekt
- Verwenden Sie Ihr Urteilsvermögen bei der Bewertung von Vorschlägen
- Kontext ist wichtig - Sie kennen Ihren Empfänger besser als die KI

### API-Schlüssel-Probleme
- Stellen Sie sicher, dass Ihr API-Schlüssel gültig und aktiv ist
- Überprüfen Sie, ob Sie Ihr Kontingent nicht überschritten haben
- Generieren Sie einen neuen Schlüssel, wenn der alte nicht funktioniert

## Datenschutz und Sicherheit

- **Was gesendet wird**: Betreff, Empfänger und E-Mail-Text
- **Was nicht gesendet wird**: Anhänge, Ihr API-Schlüssel (außer an Google)
- **Datenspeicherung**: Ihr API-Schlüssel wird lokal in Thunderbird gespeichert
- **Datenübertragung**: Sicher über HTTPS an die Gemini API von Google gesendet
- **Aufbewahrung**: Lesen Sie die Datenschutzrichtlinien von Google, um zu erfahren, wie sie API-Daten handhaben

## API-Nutzung und Limits

Die kostenlose Stufe der Gemini API von Google umfasst:
- 60 Anfragen pro Minute
- Ausreichend für typische E-Mail-Nutzung

Wenn Sie Limits überschreiten:
- Sie sehen eine Fehlermeldung
- Warten Sie eine Minute, bevor Sie es erneut versuchen
- Erwägen Sie ein Upgrade Ihres API-Plans, falls erforderlich

## Best Practices

1. **Vorflug-Check**: Überprüfen Sie immer vor dem Senden wichtiger E-Mails
2. **Mehrfache Überprüfungen**: Wenn Sie nach einer Überprüfung erhebliche Änderungen vornehmen, überprüfen Sie erneut
3. **Aus Feedback lernen**: Achten Sie auf häufige Probleme, die die KI in Ihrem Schreiben identifiziert
4. **Mit Korrekturlesen kombinieren**: Verwenden Sie die KI-Überprüfung zusammen mit Ihrem eigenen Korrekturlesen
5. **Kontextbewusstsein**: Fügen Sie bei Bedarf Kontext in Ihrer E-Mail hinzu, um eine bessere Analyse zu erhalten

## Feature-Anfragen und Feedback

Wenn Sie Vorschläge haben oder Probleme finden, melden Sie diese bitte im GitHub-Repository des Projekts.
