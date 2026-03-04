# Gemini Mail Review - Estensione per Thunderbird

Un'estensione per Thunderbird che utilizza l'IA Gemini di Google per revisionare le tue email prima di inviarle. Ricevi feedback intelligente su ortografia, grammatica, tono, chiarezza e potenziali problemi.

[English](README.md) | [日本語](README.ja.md) | [Deutsch](README.de.md) | [Français](README.fr.md) | [简体中文](README.zh_CN.md) | Italiano

## Funzionalità

- 🤖 **Revisione basata su IA**: Utilizza il modello Gemini Pro di Google per analizzare le tue email
- ✅ **Controlli completi**: Verifica ortografia, grammatica, tono, professionalità e chiarezza
- ⚠️ **Rilevamento problemi**: Identifica potenziali problemi come allegati mancanti o messaggi poco chiari
- 🎯 **Facile da usare**: Clicca semplicemente sull'icona dell'estensione nella finestra di composizione
- 🔒 **Sicuro**: Le chiavi API e i dati della cache sono protetti con crittografia AES-GCM e memorizzati localmente in Thunderbird
- 📦 **Cache intelligente**: Memorizza automaticamente le risposte per evitare chiamate API ridondanti per lo stesso contenuto email

## Installazione

### Dal sorgente

1. Scarica l'ultima versione da https://github.com/jy-hirasawa/thunderbird-gemini-mail-review-addon/releases/
2. Apri Thunderbird
3. Vai su **Strumenti** → **Componenti aggiuntivi e temi** (oppure premi `Ctrl+Shift+A`)
4. Clicca sull'icona dell'ingranaggio ⚙️ e seleziona **Installa componente aggiuntivo da file**
5. Naviga nella directory dell'estensione e seleziona il file `manifest.json`

### Requisiti

- Thunderbird 102.0 o successivo
- Una chiave API Google Gemini (disponibile gratuitamente)

## Configurazione

1. Ottieni una chiave API Gemini:
   - Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Accedi con il tuo account Google
   - Clicca su **Crea chiave API**
   - Copia la chiave generata

2. Configura l'estensione:
   - In Thunderbird, vai su **Strumenti** → **Componenti aggiuntivi e temi**
   - Trova **Gemini Mail Review** nella tua lista di estensioni
   - Clicca su **Opzioni** o **Preferenze**
   - Incolla la tua chiave API
   - (Facoltativo) Personalizza l'URL dell'endpoint API se vuoi utilizzare un modello Gemini diverso
     - Predefinito: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
   - (Facoltativo) Aggiungi modelli di prompt personalizzato per personalizzare come Gemini analizza le tue email
     - Puoi salvare fino a 3 modelli di prompt personalizzato con nomi
     - Ogni modello sarà disponibile per la selezione durante la revisione delle email
     - I prompt personalizzati vengono anteposti alla richiesta di analisi
     - **Supporto multilingue**: Scrivi prompt in qualsiasi lingua per ottenere risultati di analisi in quella lingua
     - Esempio (italiano): "Rivedi questa email per la comunicazione professionale. Controlla se il linguaggio è educato, appropriato per i clienti e sufficientemente formale. Segnala eventuali espressioni inappropriate, innaturali o fuorvianti."
     - Esempio (inglese): "Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
   - (Facoltativo) Configura i giorni di conservazione della cache (1-365 giorni)
     - Predefinito: 7 giorni
     - Determina per quanto tempo vengono conservati i risultati dell'analisi nella cache prima della scadenza
   - Clicca su **Salva impostazioni**
   - (Facoltativo) Clicca su **Verifica connessione** per verificare che la configurazione funzioni

## Utilizzo

1. Componi un'email come di consueto in Thunderbird
2. Prima di inviare, clicca sull'icona **Gemini Mail Review** nella barra degli strumenti della finestra di composizione
3. L'estensione si apre con un'interfaccia di selezione del modello:
   - **Seleziona modello di prompt personalizzato**: Scegli tra i modelli salvati (Modello 1, 2 o 3)
   - **Modifica prompt personalizzato**: Rivedi e modifica il prompt prima dell'analisi
   - Clicca su **Analizza email** per avviare la revisione
4. L'estensione analizzerà la tua email e mostrerà i risultati
   - Se hai già analizzato questa email (stesso oggetto, destinatari e corpo), verrà mostrata istantaneamente la risposta dalla cache
   - Apparirà un indicatore "📦 Visualizzazione risposta dalla cache" quando vengono mostrati i risultati dalla cache
5. Rivedi i feedback e i suggerimenti dell'IA
6. Scegli tra:
   - **Richiedi di nuovo a Gemini**: Ottieni una nuova analisi dall'API (mostrato solo per i risultati dalla cache o quando il contenuto è cambiato)
   - **Modifica email**: Chiudi il popup e apporta modifiche
   - **Invia comunque**: Procedi con l'invio (l'email non viene inviata automaticamente - devi ancora cliccare su Invia)

### Comportamento della cache

L'estensione memorizza intelligentemente le risposte di Gemini per:
- **Risparmiare chiamate API**: Evitare richieste non necessarie per email già analizzate
- **Feedback più veloce**: Mostrare risultati istantanei alla riapertura della stessa email
- **Rilevamento intelligente**: Rileva automaticamente quando il contenuto dell'email cambia e mostra prima l'analisi precedente

**Come funziona la cache:**
- Ogni email è identificata da un hash univoco del suo oggetto, destinatari e contenuto del corpo
- Ogni scheda di composizione tiene traccia dell'ultimo contenuto analizzato per rilevare le modifiche
- Se analizzi di nuovo la stessa email, viene mostrata istantaneamente la risposta dalla cache
- **Se modifichi l'email e la controlli di nuovo:**
  - Viene mostrata prima l'analisi precedente con un indicatore "⚠️ Il contenuto dell'email è cambiato"
  - Appare un pulsante "Richiedi di nuovo a Gemini" per ottenere una nuova analisi del contenuto aggiornato
  - Questo ti permette di vedere rapidamente il feedback precedente mentre decidi se hai bisogno di una nuova revisione
- La cache memorizza le ultime 50 analisi email (le voci più vecchie vengono rimosse automaticamente)
- Le risposte nella cache vengono conservate per un periodo configurabile (predefinito: 7 giorni) e scadono automaticamente dopo
- Puoi personalizzare il periodo di conservazione della cache nelle impostazioni (1-365 giorni)
- La cache è memorizzata localmente nel tuo profilo Thunderbird usando browser.storage.local

## Cosa viene analizzato

L'estensione invia le seguenti informazioni a Gemini per l'analisi:
- Oggetto dell'email
- Destinatario/i
- Corpo dell'email (testo normale)

L'IA controlla:
- Errori di ortografia e grammatica
- Tono e professionalità
- Chiarezza e concisione
- Informazioni mancanti
- Potenziali problemi o preoccupazioni

## Informativa sulla privacy

Questa estensione invia il contenuto delle tue email all'API Gemini di Google per l'analisi. Le tue email vengono elaborate secondo l'[Informativa sulla privacy di Google](https://policies.google.com/privacy).

**Funzionalità di sicurezza**:
- Le chiavi API e i prompt personalizzati sono memorizzati localmente con crittografia AES-GCM
- I dati email nella cache sono crittografati con chiavi specifiche per email
- La crittografia specifica per profilo isola i dati tra diversi profili Thunderbird
- Le chiavi di crittografia sono derivate dall'ID del profilo e dall'ID dell'email
- Consulta [SECURITY.md](doc/it/SECURITY.md) per i dettagli

**Importante**: Non utilizzare questa estensione per email altamente sensibili o riservate a meno che tu non sia a tuo agio con la loro elaborazione da parte del servizio IA di Google.

## Sviluppo

### Struttura del progetto

```
.
├── manifest.json       # Manifest dell'estensione
├── background.js       # Script in background
├── popup.html         # Interfaccia popup principale
├── popup.css          # Stili del popup
├── popup.js           # Logica del popup e integrazione API
├── options.html       # Pagina delle impostazioni
├── options.css        # Stili della pagina delle impostazioni
├── options.js         # Logica della pagina delle impostazioni
└── icons/             # Icone dell'estensione
```

### Build

Questa è una pura WebExtension senza passaggi di build richiesti. Carica semplicemente l'estensione come descritto nella sezione Installazione.

### Test

1. Installa l'estensione (vedi la sezione Installazione per le istruzioni)
2. Configura la tua chiave API nelle impostazioni
3. Componi un'email di test
4. Clicca sull'icona dell'estensione per testare la funzionalità di revisione

## Risoluzione dei problemi

### "Configura la tua chiave API Gemini"
- Vai alle impostazioni dell'estensione e inserisci la tua chiave API
- Assicurati che la chiave sia salvata (dovresti vedere un messaggio di successo)

### "Richiesta API non riuscita" o errori di connessione
- Verifica che la tua chiave API sia corretta
- Controlla la tua connessione Internet
- Assicurati di non aver superato i limiti di frequenza dell'API (il piano gratuito ha dei limiti)
- Prova a testare la connessione nella pagina delle impostazioni

### Il popup non appare
- Assicurati di essere in una finestra di composizione (non nella finestra principale di Thunderbird)
- Prova a chiudere e riaprire la finestra di composizione
- Controlla la console degli errori di Thunderbird per eventuali errori

## Licenza

Licenza MIT - vedi il file LICENSE per i dettagli

## Contributi

I contributi sono benvenuti! Sentiti libero di segnalare problemi o inviare pull request.

## Disclaimer

Questa estensione non è ufficialmente affiliata a Google o Mozilla. Utilizzare a proprio rischio.
