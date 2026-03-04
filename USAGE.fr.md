# Guide d'utilisation

[English](USAGE.md) | [日本語](USAGE.ja.md) | [Deutsch](USAGE.de.md) | Français | [简体中文](USAGE.zh_CN.md) | [Italiano](USAGE.it.md)

## Démarrage rapide

1. **Installer l'extension**
   - Installez l'extension dans Thunderbird (voir README.md pour les instructions d'installation)

2. **Configurer votre clé API et le point de terminaison**
   - Allez dans **Outils** → **Modules complémentaires et thèmes**
   - Trouvez **Gemini Mail Review** et cliquez sur **Préférences**
   - Entrez votre clé API Gemini
   - (Optionnel) Personnalisez l'URL du point de terminaison API pour utiliser un modèle Gemini différent
     - Par défaut : `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`
     - Vous pouvez changer ceci pour utiliser d'autres modèles comme `gemini-pro`, `gemini-1.5-pro`, etc.
   - (Optionnel) Ajoutez des modèles de prompt personnalisés pour personnaliser la façon dont Gemini analyse vos e-mails
     - Vous pouvez enregistrer jusqu'à 3 modèles de prompt personnalisés avec des noms
     - Chaque modèle peut avoir un nom descriptif et des instructions personnalisées
     - **Support multilingue** : Écrivez votre prompt personnalisé dans n'importe quelle langue, et Gemini répondra dans cette même langue
       - Prompt en anglais → Résultats d'analyse en anglais
       - Prompt en japonais (日本語) → Résultats d'analyse en japonais (日本語)
       - Prompt en espagnol (Español) → Résultats d'analyse en espagnol (Español)
       - Cela fonctionne pour toute langue prise en charge par Gemini
     - Exemple pour la vérification d'e-mails professionnels (anglais) : "Review this email for business communication. Check if the language is polite, appropriate for clients, and sufficiently formal. Flag any inappropriate, unnatural, or misleading expressions."
     - Exemple pour la vérification d'e-mails professionnels (japonais) : "以下のメール本文が、取引先・顧客など会社宛てのメールとして、敬語や言い回しが適切か、失礼・不自然・誤解を招く表現がないか、ビジネスメールとして十分にフォーマルかを確認してください。問題点があれば、理由とあわせて修正案を提示してください。"
   - Cliquez sur **Tester la connexion** pour vérifier votre configuration
   - Cliquez sur **Enregistrer les paramètres**

   ![Settings Page](doc/images/settings-page.png)
   *Page de paramètres montrant la configuration de la clé API, les prompts personnalisés et d'autres options*

3. **Rédiger un e-mail**
   - Créez un nouvel e-mail ou répondez à un e-mail existant
   - Écrivez votre e-mail comme d'habitude

4. **Vérifier avant d'envoyer**
   - Avant de cliquer sur Envoyer, cliquez sur l'icône **Gemini Mail Review** dans la barre d'outils de la fenêtre de rédaction
   
   ![Compose Window with Icon](doc/images/compose-window-icon.png)
   *L'icône Gemini Mail Review dans la barre d'outils de la fenêtre de rédaction de Thunderbird*
   
   - La fenêtre contextuelle s'ouvre avec la sélection de modèle :
     - Sélectionnez un modèle de prompt personnalisé dans le menu déroulant (si vous en avez configuré)
     - Examinez et modifiez le prompt personnalisé si nécessaire
     - Cliquez sur **Analyser l'e-mail** pour démarrer l'analyse
   
   ![Template Selection](doc/images/popup-template-selection.png)
   *Fenêtre contextuelle montrant la sélection de modèle et l'éditeur de prompt personnalisé*
   
   - Attendez l'analyse de l'IA (généralement 2 à 5 secondes)
   
   ![Analyzing](doc/images/popup-analyzing.png)
   *Analyse en cours*
   
   - Examinez les retours
   
   ![Analysis Results](doc/images/popup-results.png)
   *Retours et suggestions de l'IA affichés*

5. **Agir sur les retours**
   - **Modifier l'e-mail** : Fermez la fenêtre contextuelle et apportez des modifications en fonction des suggestions
   - **Envoyer quand même** : Fermez la fenêtre contextuelle et procédez à l'envoi (vous devez toujours cliquer sur le bouton Envoyer)

## Comprendre les résultats en cache

Lorsque vous analysez le même e-mail plusieurs fois, l'extension utilise une mise en cache intelligente pour économiser les appels API et fournir des retours instantanés.

### Réponse en cache
Lorsque vous examinez un e-mail que vous avez déjà analysé, vous verrez un indicateur de réponse en cache :

![Cached Result](doc/images/popup-cached-result.png)
*Résultat d'analyse en cache affiché instantanément avec l'indicateur "📦 Showing cached response"*

### Avertissement de contenu modifié
Si vous modifiez votre e-mail après l'avoir analysé, la prochaine vérification affichera l'analyse précédente avec un avertissement :

![Content Changed](doc/images/popup-content-changed.png)
*Analyse précédente affichée avec l'avertissement "⚠️ Email content has changed" et option pour demander une nouvelle analyse*

Cela vous permet de :
- Voir rapidement vos retours précédents
- Décider si vous avez besoin d'une nouvelle analyse pour vos modifications
- Cliquer sur "Request Again from Gemini" si vous souhaitez une nouvelle analyse du contenu mis à jour

## Exemples de cas d'utilisation

### Vérification des erreurs de grammaire
**Scénario** : Vous n'êtes pas sûr que votre e-mail contienne des fautes de frappe ou des erreurs de grammaire.

**Action** : Cliquez sur le bouton Gemini Mail Review. L'IA identifiera les erreurs d'orthographe et de grammaire et suggérera des corrections.

### Vérification du ton professionnel
**Scénario** : Vous envoyez un e-mail professionnel important et voulez vous assurer qu'il semble professionnel.

**Action** : Utilisez la fonction de vérification pour obtenir des retours sur le ton et le professionnalisme. L'IA vous dira si le ton est approprié ou si des ajustements sont nécessaires.

### Détection des pièces jointes manquantes
**Scénario** : Vous avez mentionné "voir ci-joint" dans votre e-mail mais avez oublié de joindre le fichier.

**Action** : L'IA peut détecter lorsque vous faites référence à des pièces jointes et vous alerter si aucune n'est jointe (remarque : cela nécessite que le contenu de l'e-mail mentionne des pièces jointes).

### Vérification de la clarté
**Scénario** : Vous avez écrit un e-mail complexe et voulez vous assurer qu'il est clair.

**Action** : La vérification identifiera les sections peu claires et suggérera des moyens d'améliorer la clarté et la concision.

### Vérification d'e-mails multilingues
**Scénario** : Vous écrivez des e-mails dans des langues autres que l'anglais et souhaitez une analyse dans votre langue maternelle.

**Action** : Créez un modèle de prompt personnalisé dans votre langue préférée. L'IA analysera votre e-mail et fournira des retours dans cette même langue. Par exemple :
- Écrivez votre prompt personnalisé en japonais → Obtenez des résultats d'analyse en japonais
- Écrivez votre prompt personnalisé en espagnol → Obtenez des résultats d'analyse en espagnol
- Écrivez votre prompt personnalisé en français → Obtenez des résultats d'analyse en français

**Exemples de prompts personnalisés par langue** :

**Japonais (日本語)** :
```
このメールを分析して、以下の点を確認してください：
- 文法とスペルミス
- 敬語の適切な使用
- ビジネスメールとしての適切さ
- 言い回しの自然さ
問題点があれば、理由と修正案を日本語で提示してください。
```

**Espagnol (Español)** :
```
Analiza este correo electrónico y verifica:
- Gramática y ortografía
- Tono profesional
- Claridad del mensaje
- Posibles problemas
Proporciona comentarios y sugerencias en español.
```

**Français (Français)** :
```
Analysez cet e-mail et vérifiez:
- La grammaire et l'orthographe
- Le ton professionnel
- La clarté du message
- Les problèmes potentiels
Fournissez des commentaires et des suggestions en français.
```

## Comprendre les résultats de la vérification

L'analyse de l'IA comprend généralement :

- **✓ Retours positifs** : Ce qui fonctionne bien dans votre e-mail
- **⚠️ Avertissements** : Des choses qui pourraient être préoccupantes mais ne sont pas nécessairement des erreurs
- **❌ Problèmes** : Des problèmes qui devraient être résolus avant l'envoi
- **💡 Suggestions** : Des recommandations spécifiques pour l'amélioration

## Conseils pour de meilleurs résultats

1. **Écrivez d'abord, vérifiez ensuite** : Terminez votre e-mail avant d'exécuter la vérification pour obtenir des retours plus complets
2. **Utilisez des sujets descriptifs** : Incluez une ligne d'objet pour une meilleure analyse contextuelle
3. **Vérifiez régulièrement** : Prenez l'habitude de vérifier les e-mails importants avant de les envoyer
4. **Ne comptez pas trop dessus** : Utilisez l'IA comme un assistant utile, pas comme un remplacement de votre jugement
5. **Conscience de la confidentialité** : N'oubliez pas que votre e-mail est envoyé à l'API de Google pour analyse

## Dépannage

### Aucun résultat d'analyse
- Vérifiez votre connexion Internet
- Vérifiez que votre clé API est correctement configurée
- Assurez-vous de ne pas avoir dépassé les limites de débit de l'API

### Réponse lente
- Les grands e-mails prennent plus de temps à analyser
- Les temps de réponse de l'API peuvent varier en fonction de la charge du serveur
- Envisagez de vérifier les sections séparément pour les très longs e-mails

### Suggestions inexactes
- L'IA est utile mais pas parfaite
- Utilisez votre jugement lors de l'évaluation des suggestions
- Le contexte compte - vous connaissez votre destinataire mieux que l'IA

### Problèmes de clé API
- Assurez-vous que votre clé API est valide et active
- Vérifiez que vous n'avez pas dépassé votre quota
- Générez une nouvelle clé si l'ancienne ne fonctionne pas

## Confidentialité et sécurité

- **Ce qui est envoyé** : Sujet, destinataires et corps de l'e-mail
- **Ce qui n'est pas envoyé** : Pièces jointes, votre clé API (sauf à Google)
- **Stockage des données** : Votre clé API est stockée localement dans Thunderbird
- **Transmission des données** : Envoyées en toute sécurité via HTTPS à l'API Gemini de Google
- **Conservation** : Consultez la politique de confidentialité de Google pour savoir comment ils gèrent les données de l'API

## Utilisation et limites de l'API

Le niveau gratuit de l'API Gemini de Google comprend :
- 60 requêtes par minute
- Suffisant pour une utilisation typique des e-mails

Si vous dépassez les limites :
- Vous verrez un message d'erreur
- Attendez une minute avant de réessayer
- Envisagez de mettre à niveau votre forfait API si nécessaire

## Meilleures pratiques

1. **Vérification avant le vol** : Vérifiez toujours avant d'envoyer des e-mails importants
2. **Vérifications multiples** : Si vous apportez des modifications importantes après une vérification, vérifiez à nouveau
3. **Apprenez des retours** : Faites attention aux problèmes courants que l'IA identifie dans votre écriture
4. **Combinez avec la relecture** : Utilisez la vérification de l'IA en plus de votre propre relecture
5. **Conscience du contexte** : Ajoutez du contexte dans votre e-mail si nécessaire pour une meilleure analyse

## Demandes de fonctionnalités et retours

Si vous avez des suggestions ou trouvez des problèmes, veuillez les signaler sur le dépôt GitHub du projet.
