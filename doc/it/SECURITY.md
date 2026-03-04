# Politica di sicurezza

[English](../en/SECURITY.md) | [日本語](../ja/SECURITY.md) | [Deutsch](../de/SECURITY.md) | [Français](../fr/SECURITY.md) | [简体中文](../zh_CN/SECURITY.md) | Italiano

## Archiviazione dei dati e privacy

Questo componente aggiuntivo memorizza i seguenti dati localmente in browser.storage.local di Thunderbird:

### Dati memorizzati

1. **Chiave API** (`geminiApiKeyEncrypted`)
   - La tua chiave API Google Gemini
   - **Crittografata con AES-GCM e una chiave specifica per profilo** (NOVITÀ nella v1.1)
   - La chiave specifica per profilo è derivata utilizzando PBKDF2 con 100.000 iterazioni
   - La chiave di crittografia è basata sull'ID di esecuzione del browser e un salt casuale
   - Mai trasmessa a nessun server tranne l'API Gemini di Google
   - Le chiavi non crittografate legacy vengono automaticamente migrate al prossimo salvataggio

2. **Endpoint API** (`geminiApiEndpoint`)
   - L'URL dell'endpoint dell'API Gemini
   - Memorizzato in testo normale (non sensibile)
   - Validato per garantire il protocollo HTTPS e solo i domini Google
   - Protetto contro attacchi SSRF

3. **Modelli di prompt personalizzato** (`customPromptTemplatesEncrypted`)
   - Fino a 3 modelli di prompt personalizzato con nomi e contenuto
   - **Crittografati con AES-GCM e una chiave specifica per profilo** (NOVITÀ nella v1.1)
   - Stessa chiave di crittografia della chiave API
   - Sanificati per prevenire attacchi di iniezione di prompt
   - Limitati a 100 caratteri per i nomi e 5.000 caratteri per il contenuto
   - I modelli non crittografati legacy vengono automaticamente migrati al prossimo salvataggio

4. **Cache email** (`geminiCache`)
   - Risultati dell'analisi nella cache inclusi:
     - Oggetto dell'email (sanificato)
     - Destinatari dell'email (sanificati)
     - Contenuto del corpo dell'email (sanificato, max 10.000 caratteri)
     - Risposta dell'analisi dell'IA
     - Timestamp
     - Prompt personalizzato utilizzato
   - **Ogni voce della cache è crittografata con AES-GCM utilizzando l'ID dell'email come chiave** (NOVITÀ nella v1.1)
   - L'ID dell'email è un hash SHA-256 del contenuto dell'email (oggetto + destinatari + corpo)
   - La crittografia garantisce che i dati nella cache siano legati a un contenuto email specifico
   - Limitato alle ultime 50 voci
   - Scade automaticamente in base all'impostazione di conservazione della cache (predefinito: 7 giorni)
   - Può essere cancellato manualmente tramite le impostazioni

5. **Ultimi hash verificati** (`lastCheckedHashes`)
   - Hash SHA-256 delle email verificate di recente per il rilevamento delle modifiche
   - Limitato alle ultime 20 voci
   - Memorizza solo i valori hash, non il contenuto effettivo
   - Non crittografato (già hash)

6. **Salt di crittografia del profilo** (`profileEncryptionSalt`)
   - Salt casuale di 16 byte utilizzato per la derivazione della chiave
   - Generato una volta per profilo
   - Memorizzato come stringa base64
   - Utilizzato per derivare la chiave di crittografia specifica per profilo

## Implementazione della crittografia

### Algoritmo di crittografia

- **Algoritmo**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Dimensione chiave**: 256 bit
- **Dimensione IV**: 12 byte (96 bit), generati casualmente per ogni crittografia
- **Autenticazione**: Tag di autenticazione integrato con AES-GCM

### Derivazione della chiave

1. **Chiave specifica per profilo** (per le impostazioni):
   - Derivata usando PBKDF2 con SHA-256
   - Iterazioni: 100.000 (alta sicurezza per chiavi API sensibili)
   - Salt: Salt casuale di 16 byte, unico per profilo
   - Materiale base: ID di esecuzione del browser (unico per installazione/profilo)

2. **Chiave specifica per email** (per la cache):
   - Derivata usando PBKDF2 con SHA-256
   - Iterazioni: 10.000 (inferiore per le prestazioni, ancora sicuro)
   - Salt: Stringa fissa per la coerenza
   - Materiale base: ID dell'email (hash SHA-256 del contenuto dell'email)

### Retrocompatibilità

- Rileva e decrittografa automaticamente i dati legacy non crittografati
- Migra al formato crittografato al prossimo salvataggio
- Nessuna perdita di dati durante la migrazione

## Misure di sicurezza

### Vantaggi della crittografia

1. **Protezione dei dati migliorata**
   - Le chiavi API e i prompt personalizzati non sono più memorizzati in testo normale
   - Il contenuto email nella cache è crittografato con chiavi specifiche per email
   - Protezione contro l'accesso non autorizzato alla directory del profilo

2. **Crittografia specifica per profilo**
   - Ogni profilo Thunderbird ha la propria chiave di crittografia
   - I dati crittografati in un profilo non possono essere decrittografati in un altro
   - Fornisce isolamento tra diverse installazioni

3. **Crittografia della cache specifica per email**
   - Ogni email nella cache è crittografata con una chiave derivata dal suo contenuto
   - Anche se qualcuno accede alla cache, ha bisogno del contenuto dell'email per decrittografare
   - Fornisce un ulteriore livello di sicurezza per i dati nella cache

### Validazione e sanificazione degli input

1. **Validazione dell'endpoint API**
   - Deve utilizzare il protocollo HTTPS
   - Non può essere localhost o indirizzi IP privati
   - Deve essere un dominio API Google (googleapis.com)

2. **Sanificazione del contenuto**
   - Il contenuto dell'email viene sanificato prima di essere inviato all'API
   - Rimuove i pattern di iniezione di prompt comuni
   - Limita la lunghezza del contenuto a 10.000 caratteri
   - Rimuove i blocchi di codice Markdown e i tag di istruzione
   - Rimuove i pattern di jailbreak dell'IA (es. "ignora le istruzioni precedenti")

3. **Sanificazione dei prompt personalizzati**
   - Limitati a 5.000 caratteri
   - Rimuove i pattern di iniezione di prompt
   - Nomi dei modelli limitati a 100 caratteri

4. **Prevenzione XSS**
   - I risultati dell'analisi vengono mostrati usando `textContent` (non `innerHTML`)
   - Nessun HTML generato dall'utente viene renderizzato

### Sicurezza della cache

1. **Crittografia** (NOVITÀ nella v1.1)
   - Ogni voce della cache è crittografata con AES-GCM usando l'ID dell'email come chiave
   - L'ID dell'email è derivato dal contenuto dell'email (hash SHA-256)
   - Fornisce crittografia specifica per il contenuto per i dati nella cache

2. **Scadenza automatica**
   - I dati nella cache scadono automaticamente dopo il periodo di conservazione configurato
   - Conservazione predefinita: 7 giorni (configurabile da 1 a 365 giorni)
   - Le voci scadute vengono automaticamente eliminate

3. **Cancellazione manuale della cache**
   - Gli utenti possono cancellare manualmente tutti i dati nella cache tramite le impostazioni
   - Include una finestra di dialogo di conferma per evitare l'eliminazione accidentale

4. **Limiti di dimensione**
   - Cache limitata alle ultime 50 voci
   - Le voci più vecchie vengono automaticamente rimosse quando viene raggiunto il limite

## Considerazioni sulla privacy

### Trasmissione dei dati

- Il contenuto dell'email viene trasmesso all'API Gemini di Google per l'analisi
- I dati vengono inviati tramite HTTPS
- Soggetto all'[Informativa sulla privacy di Google](https://policies.google.com/privacy)

### Archiviazione dei dati

- Tutti i dati sono memorizzati localmente nella directory del profilo di Thunderbird
- Nessun dato viene trasmesso a terze parti tranne l'API Gemini di Google
- **La chiave API e i prompt personalizzati sono ora crittografati** (NOVITÀ nella v1.1)
- **I dati email nella cache sono ora crittografati** (NOVITÀ nella v1.1)
- Le chiavi di crittografia sono derivate da identificatori specifici per profilo ed email

### Raccomandazioni per le email sensibili

Per le email contenenti informazioni sensibili o riservate:

1. **Cancellare regolarmente la cache**
   - Usa il pulsante "Cancella tutti i dati dalla cache" nelle impostazioni
   - Considera di cancellare la cache dopo aver elaborato email sensibili

2. **Ridurre la conservazione della cache**
   - Imposta la conservazione della cache a 1 giorno per lavoro sensibile
   - Configurabile in Impostazioni → Giorni di conservazione della cache

3. **Disabilitare la cache** (Approccio manuale)
   - Cancella la cache prima e dopo ogni utilizzo
   - Nota: Ciò richiederà chiamate API per ogni verifica email

4. **Consultare l'informativa sulla privacy**
   - Comprendi che il contenuto delle email viene inviato al servizio IA di Google
   - Consulta le pratiche di gestione dei dati di Google

5. **Considerare di non utilizzare il componente aggiuntivo**
   - Per email altamente riservate, considera di non utilizzare la revisione IA
   - Affidati invece alla revisione manuale

## Segnalazione di vulnerabilità di sicurezza

Se scopri una vulnerabilità di sicurezza in questo componente aggiuntivo, segnalala:

1. Aprendo un problema GitHub con il tag `security`
2. Fornendo informazioni dettagliate sulla vulnerabilità
3. Non divulgando pubblicamente la vulnerabilità fino a quando non è stata risolta

## Limitazioni

### Sicurezza dell'archiviazione del browser

- **La crittografia è ora implementata** (NOVITÀ nella v1.1)
  - Le chiavi API e i prompt personalizzati sono crittografati con AES-GCM
  - I dati email nella cache sono crittografati con chiavi specifiche per email
  - Le chiavi di crittografia sono derivate da identificatori di profilo ed email
- Tuttavia, le chiavi di crittografia sono derivate da identificatori di esecuzione
  - Qualcuno con accesso al tuo profilo Thunderbird potrebbe potenzialmente accedere ai dati
  - La crittografia fornisce protezione aggiuntiva ma non è crittografia end-to-end
- L'archiviazione del browser è ancora accessibile ad altri componenti aggiuntivi con autorizzazioni di archiviazione

### Limitazioni della crittografia

- **Derivazione della chiave**: Le chiavi di crittografia sono derivate dall'ID di esecuzione del browser e dai salt
  - Non altrettanto forte delle password fornite dall'utente
  - Fornisce protezione contro l'accesso casuale alla directory del profilo
  - Non protegge contro aggressori determinati con accesso completo al sistema

- **Nessuna password principale**: A differenza di un gestore di password, non c'è una password principale
  - Compromesso tra usabilità e sicurezza
  - Gli utenti non devono inserire una password ogni volta
  - Ma la crittografia è automatica e trasparente

### Nessuna crittografia end-to-end

- Il contenuto dell'email viene trasmesso ai server di Google
- Il contenuto non è crittografato end-to-end (oltre a HTTPS in transito)
- Google può elaborare e analizzare i dati in base alla sua informativa sulla privacy

### Sicurezza del sistema locale

- La sicurezza dipende dalla sicurezza del tuo sistema locale
- Malware o accesso non autorizzato al tuo computer potrebbe esporre i dati memorizzati
- Mantieni il tuo sistema sicuro con un antivirus aggiornato e patch di sicurezza
- Usa la crittografia del disco per una protezione aggiuntiva

## Best practice

1. **Gestione della chiave API**
   - Tratta la tua chiave API come una password
   - Non condividere la tua chiave API
   - Ruota la tua chiave API periodicamente
   - Usa le restrizioni della chiave API nella Google Cloud Console

2. **Sicurezza del sistema**
   - Mantieni Thunderbird aggiornato
   - Mantieni il tuo sistema operativo aggiornato
   - Usa password/crittografia forti per il tuo account utente
   - Abilita la crittografia del disco se elabori dati sensibili

3. **Gestione della cache**
   - Cancella regolarmente la cache per le email sensibili
   - Regola il periodo di conservazione in base alle tue esigenze di sicurezza
   - Monitora i dati nella cache

4. **Consapevolezza della privacy**
   - Comprendi che i servizi IA elaborano i tuoi dati
   - Consulta regolarmente l'informativa sulla privacy di Google
   - Sii consapevole del contenuto che invii per l'analisi

## Aggiornamenti e manutenzione

- I miglioramenti alla sicurezza sono in corso
- Controlla regolarmente gli aggiornamenti
- Consulta il changelog per le correzioni relative alla sicurezza
- Segnala eventuali preoccupazioni sulla sicurezza tramite i problemi GitHub
