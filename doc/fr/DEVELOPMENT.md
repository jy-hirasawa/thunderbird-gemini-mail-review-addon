# Notes de développement

[English](../en/DEVELOPMENT.md) | [日本語](../ja/DEVELOPMENT.md) | [Deutsch](../de/DEVELOPMENT.md) | Français | [简体中文](../zh_CN/DEVELOPMENT.md)

## Aperçu du projet
Il s'agit d'un module complémentaire Thunderbird qui intègre l'IA Gemini de Google pour examiner les e-mails avant l'envoi.

## Architecture

### Flux d'interaction des composants
1. L'utilisateur rédige un e-mail dans Thunderbird
2. L'utilisateur clique sur le bouton "Gemini Mail Review" dans la barre d'outils de composition
3. `popup.js` s'ouvre et démarre immédiatement l'analyse :
   - Récupère la clé API et le point de terminaison depuis le stockage local
   - Récupère les détails de composition (sujet, destinataires, corps)
   - Nettoie le contenu pour prévenir l'injection de prompt
   - Appelle l'API Gemini avec le prompt d'analyse via le point de terminaison configuré
   - Affiche les résultats dans l'interface utilisateur popup
4. L'utilisateur examine les commentaires et décide de modifier ou d'envoyer

### Structure des fichiers
```
├── manifest.json          # Manifeste de l'extension
├── background.js          # Script d'arrière-plan (minimal)
├── popup.html/css/js      # Interface principale de révision
├── options.html/css/js    # Page de paramètres
├── icons/                 # Icônes de l'extension
├── package.json           # Métadonnées du projet
├── README.md              # Documentation utilisateur
├── USAGE.md               # Guide d'utilisation
└── DEVELOPMENT.md         # Ce fichier
```

## Considérations de sécurité

### Mesures de sécurité implémentées

1. **Protection de la clé API**
   - Stockée dans browser.storage.local (non accessible aux autres extensions)
   - Envoyée via l'en-tête HTTP, pas le paramètre URL
   - Jamais enregistrée ou transmise sauf à l'API Google
   - Validation du format avant utilisation

2. **Nettoyage du contenu**
   - Longueur de contenu maximale : 10 000 caractères
   - Suppression des motifs d'injection potentiels :
     - Balises d'instruction : `[INST]`, `[/INST]`
     - Balises système : `<<SYS>>`, `<</SYS>>`
     - En-têtes Markdown en début de ligne
     - Délimiteurs de blocs de code
     - Lignes horizontales
   - Prévient les attaques par injection de prompt

3. **Sécurité des types**
   - Gère divers formats de destinataires (tableau/chaîne)
   - Programmation défensive tout au long
   - Gestion complète des erreurs

### Résultats de l'analyse de sécurité
- CodeQL : 0 alerte
- Aucune vulnérabilité XSS
- Aucune vulnérabilité d'injection
- Aucune exposition d'identifiants

## Intégration API

### Point de terminaison API Gemini configurable

Le module complémentaire prend en charge les points de terminaison API configurables, permettant aux utilisateurs de sélectionner différents modèles Gemini :

**Point de terminaison par défaut :**
```
https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
```

**Modèles alternatifs :**
- `gemini-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
- `gemini-1.5-pro`: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`
- `gemini-2.0-flash`: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`

Les utilisateurs peuvent configurer le point de terminaison dans la page d'options. Si aucun point de terminaison personnalisé n'est défini, le point par défaut (gemini-2.5-flash) est utilisé automatiquement.

### Modèles de prompt personnalisés

Le module complémentaire prend en charge jusqu'à 3 modèles de prompt personnalisés que les utilisateurs peuvent configurer :

**Fonctionnalités :**
- Chaque modèle a un nom et un contenu
- Les noms de modèles sont affichés dans l'interface utilisateur popup pour une sélection facile
- Les utilisateurs peuvent sélectionner et modifier les modèles avant d'analyser les e-mails
- Les modèles sont stockés dans browser.storage.local
- Les prompts sont ajoutés au début de la demande d'analyse

**Format de stockage :**
```javascript
{
  customPromptTemplates: {
    template1: { name: 'Business Email', content: 'Review this email...' },
    template2: { name: 'Casual Email', content: 'Check if...' },
    template3: { name: '', content: '' }
  }
}
```

**Flux de l'interface utilisateur :**
1. L'utilisateur ouvre le popup → Le sélecteur de modèles apparaît
2. L'utilisateur sélectionne un modèle dans la liste déroulante (affiche les noms de modèles)
3. Le contenu du modèle se charge dans la zone de texte modifiable
4. L'utilisateur peut modifier le prompt avant l'analyse
5. Le prompt modifié est utilisé pour cette révision spécifique
6. Le modèle original dans les paramètres reste inchangé

### Format de la requête
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

### Format de la réponse
```javascript
{
  candidates: [{
    content: {
      parts: [{ text: "Analysis result..." }]
    }
  }]
}
```

## Stratégie de test

### Liste de vérification des tests manuels
- [ ] Installer le module complémentaire dans Thunderbird
- [ ] Configurer la clé API dans les paramètres
- [ ] Tester la vérification de la connexion
- [ ] Composer un e-mail et déclencher la révision
- [ ] Vérifier que l'analyse s'affiche correctement
- [ ] Tester la gestion des erreurs (clé API non valide)
- [ ] Tester avec divers formats d'e-mail
- [ ] Tester avec de longs e-mails (>10k caractères)
- [ ] Vérifier que les boutons fonctionnent (Modifier l'e-mail, Envoyer quand même)

### Cas limites gérés
- Sujet/corps/destinataires vides
- E-mails très longs (tronqués à 10k caractères)
- Destinataires dans différents formats (tableau vs chaîne)
- Clé API non valide
- Erreurs réseau
- Limitation du taux de l'API
- Réponses API mal formées

## Améliorations futures (hors du périmètre)

1. **Analyse des pièces jointes** : Détecter les pièces jointes manquantes en fonction du contenu de l'e-mail
2. **Plusieurs modèles d'IA** : Prendre en charge d'autres fournisseurs d'IA (OpenAI, Claude, etc.)
3. **Révision par lots** : Réviser plusieurs brouillons d'e-mails à la fois
4. **Historique** : Suivre l'historique des révisions et les problèmes courants
5. **Application des suggestions** : Appliquer automatiquement les suggestions de l'IA en un clic
6. **Mode hors ligne** : Mettre en cache les vérifications courantes pour une utilisation hors ligne
7. **Support linguistique** : Analyse d'e-mails multilingues
8. **Plus d'emplacements de modèles** : Prendre en charge plus de 3 modèles de prompt personnalisés

## Limitations connues

1. **Dépendance API** : Nécessite une connexion Internet active et une clé API valide
2. **Pas d'analyse des pièces jointes** : Ne peut pas vérifier la présence réelle de pièces jointes
3. **Limites de taux** : Soumis aux limites de taux de l'API Google (60 req/min sur le niveau gratuit)
4. **Texte brut uniquement** : Analyse le corps en texte brut, pas le formatage HTML
5. **Pas en temps réel** : L'analyse se produit à la demande, pas pendant que vous tapez
6. **Axé sur l'anglais** : L'IA fonctionne mieux avec les e-mails en anglais

## Environnement de développement

### Exigences
- Thunderbird 102.0 ou ultérieur
- Node.js (pour la vérification de la syntaxe)
- Python 3 (pour la génération d'icônes, Pillow)
- Connexion Internet pour les tests API

### Commandes de développement
```bash
# Valider la syntaxe JavaScript
node --check *.js

# Valider JSON
python3 -m json.tool manifest.json

# Empaqueter l'extension (nécessite web-ext)
npm run package

# Exécuter dans Thunderbird (nécessite web-ext)
npm run start
```

### Chargement pour le développement
1. Ouvrir Thunderbird
2. Aller à Outils → Modules complémentaires et thèmes
3. Cliquer sur l'icône d'engrenage → Déboguer les modules complémentaires
4. Cliquer sur "Charger un module complémentaire temporaire"
5. Sélectionner manifest.json dans ce répertoire

## Notes de maintenance

### Mises à jour de version
- Mettre à jour la version dans `manifest.json` et `package.json` ensemble
- Mettre à jour README si les fonctionnalités changent
- Exécuter les analyses de sécurité avant les versions

### Modifications de l'API
Si Google modifie l'API Gemini :
- Mettre à jour le point de terminaison dans `popup.js` et `options.js`
- Mettre à jour le format de requête/réponse si nécessaire
- Mettre à jour la gestion des erreurs pour les nouveaux codes d'erreur
- Tester minutieusement avant la version

### Compatibilité du navigateur
- Thunderbird 102+ : Entièrement pris en charge
- Versions plus anciennes : Peuvent manquer de fonctionnalités de l'API de composition
- Tester sur plusieurs versions de Thunderbird avant la version

## Directives de contribution

1. Maintenir des modifications de code minimales
2. Suivre le style de code existant
3. Ajouter des commentaires uniquement pour la logique complexe
4. Exécuter la validation de syntaxe avant de committer
5. Exécuter l'analyse de sécurité CodeQL
6. Mettre à jour la documentation si le comportement change
7. Tester manuellement dans Thunderbird

## Licence
Licence MIT - Voir le fichier LICENSE
