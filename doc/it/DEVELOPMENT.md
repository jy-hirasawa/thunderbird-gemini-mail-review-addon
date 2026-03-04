# Note di sviluppo

[English](../en/DEVELOPMENT.md) | [日本語](../ja/DEVELOPMENT.md) | [Deutsch](../de/DEVELOPMENT.md) | [Français](../fr/DEVELOPMENT.md) | [简体中文](../zh_CN/DEVELOPMENT.md) | Italiano

## Panoramica del progetto
Questo è un componente aggiuntivo per Thunderbird che integra l'IA Gemini di Google per revisionare le email prima dell'invio.

## Architettura

### Flusso di interazione dei componenti
1. L'utente compone un'email in Thunderbird
2. L'utente clicca sul pulsante "Gemini Mail Review" nella barra degli strumenti di composizione
3. `popup.js` si apre e avvia immediatamente l'analisi:
   - Recupera la chiave API e l'endpoint dall'archivio locale
   - Recupera i dettagli della composizione (oggetto, destinatari, corpo)
   - Sanifica il contenuto per prevenire l'iniezione di prompt
   - Chiama l'API Gemini con il prompt di analisi tramite l'endpoint configurato
   - Mostra i risultati nell'interfaccia utente del popup
4. L'utente rivede il feedback e decide se modificare o inviare

### Struttura dei file
```
├── manifest.json          # Manifest dell'estensione
├── background.js          # Script in background (minimale)
├── popup.html/css/js      # Interfaccia principale di revisione
├── options.html/css/js    # Pagina delle impostazioni
├── icons/                 # Icone dell'estensione
├── package.json           # Metadati del progetto
├── README.md              # Documentazione utente
├── USAGE.md               # Guida all'utilizzo
└── DEVELOPMENT.md         # Questo file
```

## Considerazioni sulla sicurezza

### Misure di sicurezza implementate

1. **Protezione della chiave API**
   - Memorizzata in browser.storage.local (non accessibile ad altre estensioni)
   - Inviata tramite intestazione HTTP, non parametro URL
   - Mai registrata o trasmessa tranne all'API Google
   - Validazione del formato prima dell'uso

2. **Sanificazione del contenuto**
   - Lunghezza massima del contenuto: 10.000 caratteri
   - Rimozione dei pattern di iniezione potenziali:
     - Tag di istruzione: `[INST]`, `[/INST]`
     - Tag di sistema: `<<SYS>>`, `<</SYS>>`
     - Intestazioni Markdown all'inizio della riga
     - Delimitatori di blocchi di codice
     - Linee orizzontali
   - Previene gli attacchi di iniezione di prompt

3. **Sicurezza dei tipi**
   - Gestisce vari formati di destinatari (array/stringa)
   - Programmazione difensiva ovunque
   - Gestione completa degli errori

### Risultati dell'analisi di sicurezza
- CodeQL: 0 alert
- Nessuna vulnerabilità XSS
- Nessuna vulnerabilità di iniezione
- Nessuna esposizione di credenziali

## Integrazione API

### Endpoint API Gemini configurabile

Il componente aggiuntivo supporta endpoint API configurabili, consentendo agli utenti di selezionare diversi modelli Gemini:

**Endpoint predefinito:**
```
https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
```

**Modelli alternativi:**
- `gemini-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
- `gemini-1.5-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`
- `gemini-2.0-flash`: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`

Gli utenti possono configurare l'endpoint nella pagina delle opzioni. Se non viene impostato un endpoint personalizzato, viene utilizzato automaticamente quello predefinito (gemini-2.5-flash).

### Modelli di prompt personalizzato

Il componente aggiuntivo supporta fino a 3 modelli di prompt personalizzato che gli utenti possono configurare:

**Funzionalità:**
- Ogni modello ha un nome e un contenuto
- I nomi dei modelli vengono mostrati nell'interfaccia utente del popup per una selezione facile
- Gli utenti possono selezionare e modificare i modelli prima di analizzare le email
- I modelli sono memorizzati in browser.storage.local
- I prompt vengono anteposti alla richiesta di analisi

**Formato di archiviazione:**
```javascript
{
  customPromptTemplates: {
    template1: { name: 'Business Email', content: 'Review this email...' },
    template2: { name: 'Casual Email', content: 'Check if...' },
    template3: { name: '', content: '' }
  }
}
```

**Flusso dell'interfaccia utente:**
1. L'utente apre il popup → Appare il selettore di modelli
2. L'utente seleziona un modello dalla lista a discesa (mostra i nomi dei modelli)
3. Il contenuto del modello si carica nell'area di testo modificabile
4. L'utente può modificare il prompt prima dell'analisi
5. Il prompt modificato viene utilizzato per questa revisione specifica
6. Il modello originale nelle impostazioni rimane invariato

### Formato della richiesta
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

### Formato della risposta
```javascript
{
  candidates: [{
    content: {
      parts: [{ text: "Analysis result..." }]
    }
  }]
}
```

## Strategia di test

### Lista di controllo per i test manuali
- [ ] Installare il componente aggiuntivo in Thunderbird
- [ ] Configurare la chiave API nelle impostazioni
- [ ] Testare la verifica della connessione
- [ ] Comporre un'email e avviare la revisione
- [ ] Verificare che l'analisi venga mostrata correttamente
- [ ] Testare la gestione degli errori (chiave API non valida)
- [ ] Testare con vari formati di email
- [ ] Testare con email lunghe (>10k caratteri)
- [ ] Verificare che i pulsanti funzionino (Modifica email, Invia comunque)

### Casi limite gestiti
- Oggetto/corpo/destinatari vuoti
- Email molto lunghe (troncate a 10k caratteri)
- Destinatari in formati diversi (array vs stringa)
- Chiave API non valida
- Errori di rete
- Limitazione della frequenza dell'API
- Risposte API malformate

## Miglioramenti futuri (fuori ambito)

1. **Analisi degli allegati**: Rilevare gli allegati mancanti in base al contenuto dell'email
2. **Modelli IA multipli**: Supportare altri provider IA (OpenAI, Claude, ecc.)
3. **Revisione in batch**: Revisionare più bozze di email contemporaneamente
4. **Cronologia**: Tenere traccia della cronologia delle revisioni e dei problemi comuni
5. **Applicazione dei suggerimenti**: Applicare automaticamente i suggerimenti dell'IA con un clic
6. **Modalità offline**: Memorizzare nella cache le verifiche comuni per l'uso offline
7. **Supporto linguistico**: Analisi di email multilingue
8. **Più slot per modelli**: Supportare più di 3 modelli di prompt personalizzato

## Limitazioni note

1. **Dipendenza dall'API**: Richiede una connessione Internet attiva e una chiave API valida
2. **Nessuna analisi degli allegati**: Non può verificare la presenza effettiva di allegati
3. **Limiti di frequenza**: Soggetto ai limiti di frequenza dell'API Google (60 req/min sul piano gratuito)
4. **Solo testo normale**: Analizza il corpo in testo normale, non la formattazione HTML
5. **Non in tempo reale**: L'analisi avviene su richiesta, non durante la digitazione
6. **Orientato all'inglese**: L'IA funziona meglio con le email in inglese

## Ambiente di sviluppo

### Requisiti
- Thunderbird 102.0 o successivo
- Node.js (per la verifica della sintassi)
- Python 3 (per la generazione delle icone, Pillow)
- Connessione Internet per i test API

### Comandi di sviluppo
```bash
# Validare la sintassi JavaScript
node --check *.js

# Validare JSON
python3 -m json.tool manifest.json

# Impacchettare l'estensione (richiede web-ext)
npm run package

# Eseguire in Thunderbird (richiede web-ext)
npm run start
```

### Caricamento per lo sviluppo
1. Apri Thunderbird
2. Vai su Strumenti → Componenti aggiuntivi e temi
3. Clicca sull'icona dell'ingranaggio → Debug componenti aggiuntivi
4. Clicca su "Carica componente aggiuntivo temporaneo"
5. Seleziona manifest.json in questa directory

## Note di manutenzione

### Aggiornamenti di versione
- Aggiorna la versione in `manifest.json` e `package.json` insieme
- Aggiorna il README se le funzionalità cambiano
- Esegui le scansioni di sicurezza prima dei rilasci

### Modifiche all'API
Se Google modifica l'API Gemini:
- Aggiorna l'endpoint in `popup.js` e `options.js`
- Aggiorna il formato richiesta/risposta se necessario
- Aggiorna la gestione degli errori per i nuovi codici di errore
- Testa accuratamente prima del rilascio

### Compatibilità del browser
- Thunderbird 102+: Completamente supportato
- Versioni precedenti: Potrebbero mancare funzionalità dell'API di composizione
- Testa su più versioni di Thunderbird prima del rilascio

## Linee guida per i contributi

1. Mantieni le modifiche al codice minime
2. Segui lo stile del codice esistente
3. Aggiungi commenti solo per la logica complessa
4. Esegui la validazione della sintassi prima di fare il commit
5. Esegui l'analisi di sicurezza CodeQL
6. Aggiorna la documentazione se il comportamento cambia
7. Testa manualmente in Thunderbird

## Licenza
Licenza MIT - Vedi il file LICENSE
