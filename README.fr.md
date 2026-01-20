# Gemini Mail Review - Extension Thunderbird

Une extension Thunderbird qui utilise l'IA Gemini de Google pour vérifier vos e-mails avant de les envoyer. Obtenez des commentaires intelligents sur l'orthographe, la grammaire, le ton, la clarté et les problèmes potentiels.

[English](README.md) | [日本語](README.ja.md) | [Deutsch](README.de.md) | Français | [简体中文](README.zh_CN.md)

## Fonctionnalités

- 🤖 **Révision alimentée par l'IA**: Utilise le modèle Gemini Pro de Google pour analyser vos e-mails
- ✅ **Vérifications complètes**: Vérifie l'orthographe, la grammaire, le ton, le professionnalisme et la clarté
- ⚠️ **Détection de problèmes**: Identifie les problèmes potentiels comme les pièces jointes manquantes ou les messages peu clairs
- 🎯 **Facile à utiliser**: Cliquez simplement sur l'icône de l'extension dans la fenêtre de rédaction
- 🔒 **Sécurisé**: Les clés API et les données de cache sont protégées par chiffrement AES-GCM et stockées localement dans Thunderbird
- 📦 **Mise en cache intelligente**: Met automatiquement en cache les réponses pour éviter les appels API redondants pour le même contenu d'e-mail

## Installation

### Depuis la source

1. Téléchargez la dernière version depuis https://github.com/jy-hirasawa/thunderbird-gemini-mail-review-addon/releases/
2. Ouvrez Thunderbird
3. Allez dans **Outils** → **Modules complémentaires et thèmes** (ou appuyez sur `Ctrl+Maj+A`)
4. Cliquez sur l'icône d'engrenage ⚙️ et sélectionnez **Installer un module depuis un fichier**
5. Naviguez vers le répertoire de l'extension et sélectionnez le fichier `manifest.json`

### Exigences

- Thunderbird 102.0 ou ultérieur
- Une clé API Google Gemini (version gratuite disponible)

## Configuration

1. Obtenez une clé API Gemini:
   - Visitez [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Connectez-vous avec votre compte Google
   - Cliquez sur **Créer une clé API**
   - Copiez la clé générée

2. Configurez l'extension:
   - Dans Thunderbird, allez dans **Outils** → **Modules complémentaires et thèmes**
   - Trouvez **Gemini Mail Review** dans votre liste d'extensions
   - Cliquez sur **Options** ou **Préférences**
   - Collez votre clé API
   - (Optionnel) Personnalisez l'URL du point de terminaison de l'API si vous souhaitez utiliser un modèle Gemini différent
     - Par défaut: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
   - (Optionnel) Ajoutez des modèles d'invite personnalisée pour personnaliser la façon dont Gemini analyse vos e-mails
     - Vous pouvez enregistrer jusqu'à 3 modèles d'invite personnalisée avec des noms
     - Chaque modèle sera disponible à la sélection lors de la vérification des e-mails
     - Les invites personnalisées sont ajoutées avant la demande d'analyse
     - **Support multilingue**: Écrivez des invites dans n'importe quelle langue pour obtenir des résultats d'analyse dans cette langue
     - Exemple (anglais): "Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
     - Exemple (japonais): "以下のメール本文が、取引先・顧客など会社宛てのメールとして、敬語や言い回しが適切か、失礼・不自然・誤解を招く表現がないか、ビジネスメールとして十分にフォーマルかを確認してください。問題点があれば、理由とあわせて修正案を提示してください。"
   - (Optionnel) Configurez les jours de rétention du cache (1-365 jours)
     - Par défaut: 7 jours
     - Détermine combien de temps les résultats d'analyse mis en cache sont conservés avant d'expirer
   - Cliquez sur **Enregistrer les paramètres**
   - (Optionnel) Cliquez sur **Tester la connexion** pour vérifier que votre configuration fonctionne

## Utilisation

1. Rédigez un e-mail comme d'habitude dans Thunderbird
2. Avant d'envoyer, cliquez sur l'icône **Gemini Mail Review** dans la barre d'outils de la fenêtre de rédaction
3. L'extension s'ouvre avec une interface de sélection de modèle:
   - **Sélectionner un modèle d'invite personnalisée**: Choisissez parmi vos modèles enregistrés (Modèle 1, 2 ou 3)
   - **Modifier l'invite personnalisée**: Vérifiez et modifiez l'invite avant l'analyse
   - Cliquez sur **Analyser l'e-mail** pour commencer la vérification
4. L'extension analysera votre e-mail et affichera les résultats
   - Si vous avez déjà analysé cet e-mail exact (même sujet, destinataires et corps), la réponse mise en cache sera affichée instantanément
   - Un indicateur "📦 Affichage de la réponse mise en cache" apparaîtra lors de l'affichage des résultats mis en cache
5. Examinez les commentaires et suggestions de l'IA
6. Choisissez soit:
   - **Demander à nouveau à Gemini**: Obtenez une nouvelle analyse de l'API (affiché uniquement pour les résultats mis en cache ou lorsque le contenu a changé)
   - **Modifier l'e-mail**: Fermez la fenêtre contextuelle et apportez des modifications
   - **Envoyer quand même**: Procédez à l'envoi (l'e-mail n'est pas envoyé automatiquement - vous devez toujours cliquer sur Envoyer)

### Comportement de la mise en cache

L'extension met intelligemment en cache les réponses de Gemini pour:
- **Économiser les appels API**: Éviter les demandes inutiles pour les e-mails déjà analysés
- **Retour plus rapide**: Afficher des résultats instantanés lors de la réouverture du même e-mail
- **Détection intelligente**: Détecte automatiquement lorsque le contenu de l'e-mail change et affiche d'abord l'analyse précédente

**Comment fonctionne la mise en cache:**
- Chaque e-mail est identifié par un hachage unique de son sujet, ses destinataires et son contenu
- Chaque onglet de rédaction suit le dernier contenu analysé pour détecter les changements
- Si vous analysez à nouveau le même e-mail, la réponse mise en cache est affichée instantanément
- **Si vous modifiez l'e-mail et le vérifiez à nouveau:**
  - L'analyse précédente est affichée en premier avec un indicateur "⚠️ Le contenu de l'e-mail a changé"
  - Un bouton "Demander à nouveau à Gemini" apparaît pour obtenir une nouvelle analyse du contenu mis à jour
  - Cela vous permet de voir rapidement les commentaires précédents tout en décidant si vous avez besoin d'une nouvelle vérification
- Le cache stocke les 50 dernières analyses d'e-mails (les entrées les plus anciennes sont automatiquement supprimées)
- Les réponses mises en cache sont conservées pendant une période configurable (par défaut: 7 jours) et expirent automatiquement après
- Vous pouvez personnaliser la période de rétention du cache dans les paramètres (1-365 jours)
- Le cache est stocké localement dans votre profil Thunderbird en utilisant browser.storage.local

## Ce qui est analysé

L'extension envoie les informations suivantes à Gemini pour analyse:
- Ligne d'objet de l'e-mail
- Destinataire(s)
- Corps de l'e-mail (texte brut)

L'IA vérifie:
- Les erreurs d'orthographe et de grammaire
- Le ton et le professionnalisme
- La clarté et la concision
- Les informations manquantes
- Les problèmes ou préoccupations potentiels

## Avis de confidentialité

Cette extension envoie le contenu de votre e-mail à l'API Gemini de Google pour analyse. Vos e-mails sont traités conformément à la [Politique de confidentialité de Google](https://policies.google.com/privacy).

**Fonctionnalités de sécurité**:
- Les clés API et les invites personnalisées sont stockées localement avec chiffrement AES-GCM
- Les données d'e-mail mises en cache sont chiffrées avec des clés spécifiques à l'e-mail
- Le chiffrement spécifique au profil isole les données entre différents profils Thunderbird
- Les clés de chiffrement sont dérivées de l'ID de profil et de l'ID d'e-mail
- Voir [SECURITY.md](doc/fr/SECURITY.md) pour plus de détails

**Important**: N'utilisez pas cette extension pour des e-mails hautement sensibles ou confidentiels, sauf si vous êtes à l'aise avec leur traitement par le service d'IA de Google.

## Développement

### Structure du projet

```
.
├── manifest.json       # Manifeste de l'extension
├── background.js       # Script d'arrière-plan
├── popup.html         # Interface contextuelle principale
├── popup.css          # Styles de la fenêtre contextuelle
├── popup.js           # Logique de la fenêtre contextuelle et intégration API
├── options.html       # Page de paramètres
├── options.css        # Styles de la page de paramètres
├── options.js         # Logique de la page de paramètres
└── icons/             # Icônes de l'extension
```

### Construction

Il s'agit d'une pure WebExtension sans étape de construction requise. Chargez simplement l'extension comme décrit dans la section Installation.

### Tests

1. Installez l'extension (voir la section Installation pour les instructions)
2. Configurez votre clé API dans les paramètres
3. Rédigez un e-mail de test
4. Cliquez sur l'icône de l'extension pour tester la fonctionnalité de vérification

## Dépannage

### "Veuillez configurer votre clé API Gemini"
- Allez dans les paramètres de l'extension et entrez votre clé API
- Assurez-vous que la clé est enregistrée (vous devriez voir un message de succès)

### "Échec de la demande API" ou erreurs de connexion
- Vérifiez que votre clé API est correcte
- Vérifiez votre connexion Internet
- Assurez-vous de ne pas avoir dépassé les limites de taux de l'API (la version gratuite a des limites)
- Essayez de tester la connexion sur la page des paramètres

### La fenêtre contextuelle n'apparaît pas
- Assurez-vous d'être dans une fenêtre de rédaction (pas la fenêtre principale de Thunderbird)
- Essayez de fermer et de rouvrir la fenêtre de rédaction
- Vérifiez la console d'erreurs de Thunderbird pour toute erreur

## Licence

Licence MIT - voir le fichier LICENSE pour plus de détails

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des problèmes ou des demandes de tirage.

## Avertissement

Cette extension n'est pas officiellement affiliée à Google ou Mozilla. À utiliser à vos propres risques.
