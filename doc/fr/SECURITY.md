# Politique de sécurité

[English](../en/SECURITY.md) | [日本語](../ja/SECURITY.md) | [Deutsch](../de/SECURITY.md) | Français | [简体中文](../zh_CN/SECURITY.md)

## Stockage de données et confidentialité

Ce module complémentaire stocke les données suivantes localement dans browser.storage.local de Thunderbird :

### Données stockées

1. **Clé API** (`geminiApiKeyEncrypted`)
   - Votre clé API Google Gemini
   - **Chiffrée avec AES-GCM et une clé spécifique au profil** (NOUVEAU dans v1.1)
   - La clé spécifique au profil est dérivée à l'aide de PBKDF2 avec 100 000 itérations
   - La clé de chiffrement est basée sur l'ID d'exécution du navigateur et un sel aléatoire
   - Jamais transmise à aucun serveur sauf l'API Gemini de Google
   - Les clés non chiffrées héritées sont automatiquement migrées lors de la prochaine sauvegarde

2. **Point de terminaison API** (`geminiApiEndpoint`)
   - L'URL du point de terminaison de l'API Gemini
   - Stockée en texte brut (non sensible)
   - Validée pour garantir le protocole HTTPS et uniquement les domaines Google
   - Protégée contre les attaques SSRF

3. **Modèles de prompt personnalisés** (`customPromptTemplatesEncrypted`)
   - Jusqu'à 3 modèles de prompt personnalisés avec noms et contenu
   - **Chiffrés avec AES-GCM et une clé spécifique au profil** (NOUVEAU dans v1.1)
   - Même clé de chiffrement que la clé API
   - Nettoyés pour prévenir les attaques par injection de prompt
   - Limités à 100 caractères pour les noms et 5000 caractères pour le contenu
   - Les modèles non chiffrés hérités sont automatiquement migrés lors de la prochaine sauvegarde

4. **Cache d'e-mails** (`geminiCache`)
   - Résultats d'analyse mis en cache incluant :
     - Sujet de l'e-mail (nettoyé)
     - Destinataires de l'e-mail (nettoyés)
     - Contenu du corps de l'e-mail (nettoyé, max 10 000 caractères)
     - Réponse d'analyse de l'IA
     - Horodatage
     - Prompt personnalisé utilisé
   - **Chaque entrée de cache est chiffrée avec AES-GCM en utilisant l'ID de l'e-mail comme clé** (NOUVEAU dans v1.1)
   - L'ID de l'e-mail est un hachage SHA-256 du contenu de l'e-mail (sujet + destinataires + corps)
   - Le chiffrement garantit que les données mises en cache sont liées à un contenu d'e-mail spécifique
   - Limité à 50 entrées les plus récentes
   - Expire automatiquement en fonction du paramètre de rétention du cache (par défaut : 7 jours)
   - Peut être effacé manuellement via les paramètres

5. **Derniers hachages vérifiés** (`lastCheckedHashes`)
   - Hachages SHA-256 des e-mails récemment vérifiés pour la détection des changements
   - Limité à 20 entrées les plus récentes
   - Ne stocke que les valeurs de hachage, pas le contenu réel
   - Non chiffré (déjà haché)

6. **Sel de chiffrement du profil** (`profileEncryptionSalt`)
   - Sel aléatoire de 16 octets utilisé pour la dérivation de clé
   - Généré une fois par profil
   - Stocké sous forme de chaîne base64
   - Utilisé pour dériver la clé de chiffrement spécifique au profil

## Implémentation du chiffrement

### Algorithme de chiffrement

- **Algorithme** : AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Taille de clé** : 256 bits
- **Taille IV** : 12 octets (96 bits), générés aléatoirement pour chaque chiffrement
- **Authentification** : Balise d'authentification intégrée avec AES-GCM

### Dérivation de clé

1. **Clé spécifique au profil** (pour les paramètres) :
   - Dérivée à l'aide de PBKDF2 avec SHA-256
   - Itérations : 100 000 (haute sécurité pour les clés API sensibles)
   - Sel : Sel aléatoire de 16 octets, unique par profil
   - Matériau de base : ID d'exécution du navigateur (unique par installation/profil)

2. **Clé spécifique à l'e-mail** (pour le cache) :
   - Dérivée à l'aide de PBKDF2 avec SHA-256
   - Itérations : 10 000 (inférieur pour les performances, toujours sécurisé)
   - Sel : Chaîne fixe pour la cohérence
   - Matériau de base : ID de l'e-mail (hachage SHA-256 du contenu de l'e-mail)

### Rétrocompatibilité

- Détecte et déchiffre automatiquement les données non chiffrées héritées
- Migre vers le format chiffré lors de la prochaine sauvegarde
- Aucune perte de données pendant la migration

## Mesures de sécurité

### Avantages du chiffrement

1. **Protection améliorée des données**
   - Les clés API et les prompts personnalisés ne sont plus stockés en texte brut
   - Le contenu d'e-mail mis en cache est chiffré avec des clés spécifiques à l'e-mail
   - Protection contre l'accès non autorisé au répertoire de profil

2. **Chiffrement spécifique au profil**
   - Chaque profil Thunderbird a sa propre clé de chiffrement
   - Les données chiffrées dans un profil ne peuvent pas être déchiffrées dans un autre
   - Fournit une isolation entre différentes installations

3. **Chiffrement du cache spécifique à l'e-mail**
   - Chaque e-mail mis en cache est chiffré avec une clé dérivée de son contenu
   - Même si quelqu'un accède au cache, il a besoin du contenu de l'e-mail pour déchiffrer
   - Fournit une couche de sécurité supplémentaire pour les données mises en cache

### Validation et nettoyage des entrées

1. **Validation du point de terminaison API**
   - Doit utiliser le protocole HTTPS
   - Ne peut pas être localhost ou des adresses IP privées
   - Doit être un domaine API Google (googleapis.com)

2. **Nettoyage du contenu**
   - Le contenu de l'e-mail est nettoyé avant d'être envoyé à l'API
   - Supprime les motifs d'injection de prompt courants
   - Limite la longueur du contenu à 10 000 caractères
   - Supprime les blocs de code Markdown et les balises d'instruction
   - Supprime les motifs de jailbreak de l'IA (par exemple, "ignorer les instructions précédentes")

3. **Nettoyage des prompts personnalisés**
   - Limité à 5 000 caractères
   - Supprime les motifs d'injection de prompt
   - Noms de modèles limités à 100 caractères

4. **Prévention XSS**
   - Les résultats d'analyse sont affichés en utilisant `textContent` (pas `innerHTML`)
   - Aucun HTML généré par l'utilisateur n'est rendu

### Sécurité du cache

1. **Chiffrement** (NOUVEAU dans v1.1)
   - Chaque entrée de cache est chiffrée avec AES-GCM en utilisant l'ID de l'e-mail comme clé
   - L'ID de l'e-mail est dérivé du contenu de l'e-mail (hachage SHA-256)
   - Fournit un chiffrement spécifique au contenu pour les données mises en cache

2. **Expiration automatique**
   - Les données mises en cache expirent automatiquement après la période de rétention configurée
   - Rétention par défaut : 7 jours (configurable de 1 à 365 jours)
   - Les entrées expirées sont automatiquement nettoyées

3. **Effacement manuel du cache**
   - Les utilisateurs peuvent effacer manuellement toutes les données mises en cache via les paramètres
   - Inclut une boîte de dialogue de confirmation pour éviter la suppression accidentelle

4. **Limites de taille**
   - Cache limité à 50 entrées les plus récentes
   - Les entrées les plus anciennes sont automatiquement supprimées lorsque la limite est atteinte

## Considérations de confidentialité

### Transmission de données

- Le contenu de l'e-mail est transmis à l'API Gemini de Google pour l'analyse
- Les données sont envoyées via HTTPS
- Soumis à la [Politique de confidentialité de Google](https://policies.google.com/privacy)

### Stockage de données

- Toutes les données sont stockées localement dans le répertoire de profil de Thunderbird
- Aucune donnée n'est transmise à des tiers sauf l'API Gemini de Google
- **La clé API et les prompts personnalisés sont maintenant chiffrés** (NOUVEAU dans v1.1)
- **Les données d'e-mail mises en cache sont maintenant chiffrées** (NOUVEAU dans v1.1)
- Les clés de chiffrement sont dérivées d'identifiants spécifiques au profil et à l'e-mail

### Recommandations pour les e-mails sensibles

Pour les e-mails contenant des informations sensibles ou confidentielles :

1. **Effacer régulièrement le cache**
   - Utiliser le bouton "Effacer toutes les données mises en cache" dans les paramètres
   - Envisager d'effacer le cache après avoir traité des e-mails sensibles

2. **Réduire la rétention du cache**
   - Définir la rétention du cache sur 1 jour pour un travail sensible
   - Configurable dans Paramètres → Jours de rétention du cache

3. **Désactiver la mise en cache** (Approche manuelle)
   - Effacer le cache avant et après chaque utilisation
   - Remarque : Cela nécessitera des appels API pour chaque vérification d'e-mail

4. **Consulter la politique de confidentialité**
   - Comprendre que le contenu des e-mails est envoyé au service d'IA de Google
   - Consulter les pratiques de traitement des données de Google

5. **Envisager de ne pas utiliser le module complémentaire**
   - Pour les e-mails hautement confidentiels, envisager de ne pas utiliser la révision par IA
   - S'appuyer plutôt sur une révision manuelle

## Signalement des vulnérabilités de sécurité

Si vous découvrez une vulnérabilité de sécurité dans ce module complémentaire, veuillez la signaler en :

1. Ouvrant un problème GitHub avec la balise `security`
2. Fournissant des informations détaillées sur la vulnérabilité
3. Ne divulguant pas publiquement la vulnérabilité jusqu'à ce qu'elle ait été corrigée

## Limitations

### Sécurité du stockage du navigateur

- **Le chiffrement est maintenant implémenté** (NOUVEAU dans v1.1)
  - Les clés API et les prompts personnalisés sont chiffrés avec AES-GCM
  - Les données d'e-mail mises en cache sont chiffrées avec des clés spécifiques à l'e-mail
  - Les clés de chiffrement sont dérivées d'identifiants de profil et d'e-mail
- Cependant, les clés de chiffrement sont dérivées d'identifiants d'exécution
  - Quelqu'un ayant accès à votre profil Thunderbird peut potentiellement accéder aux données
  - Le chiffrement fournit une protection supplémentaire mais n'est pas un chiffrement de bout en bout
- Le stockage du navigateur est toujours accessible à d'autres modules complémentaires avec des autorisations de stockage

### Limitations du chiffrement

- **Dérivation de clé** : Les clés de chiffrement sont dérivées de l'ID d'exécution du navigateur et des sels
  - Pas aussi fort que les mots de passe fournis par l'utilisateur
  - Fournit une protection contre l'accès occasionnel au répertoire de profil
  - Ne protège pas contre les attaquants déterminés avec un accès système complet

- **Pas de mot de passe principal** : Contrairement à un gestionnaire de mots de passe, il n'y a pas de mot de passe principal
  - Compromis entre convivialité et sécurité
  - Les utilisateurs n'ont pas besoin d'entrer un mot de passe à chaque fois
  - Mais le chiffrement est automatique et transparent

### Pas de chiffrement de bout en bout

- Le contenu de l'e-mail est transmis aux serveurs de Google
- Le contenu n'est pas chiffré de bout en bout (au-delà de HTTPS en transit)
- Google peut traiter et analyser les données selon sa politique de confidentialité

### Sécurité du système local

- La sécurité dépend de la sécurité de votre système local
- Les logiciels malveillants ou l'accès non autorisé à votre ordinateur pourraient exposer les données stockées
- Gardez votre système sécurisé avec un antivirus à jour et des correctifs de sécurité
- Utilisez le chiffrement de disque pour une protection supplémentaire

## Meilleures pratiques

1. **Gestion de la clé API**
   - Traitez votre clé API comme un mot de passe
   - Ne partagez pas votre clé API
   - Faites pivoter votre clé API périodiquement
   - Utilisez les restrictions de clé API dans Google Cloud Console

2. **Sécurité du système**
   - Gardez Thunderbird à jour
   - Gardez votre système d'exploitation à jour
   - Utilisez des mots de passe/chiffrement forts pour votre compte utilisateur
   - Activez le chiffrement de disque si vous traitez des données sensibles

3. **Gestion du cache**
   - Effacez régulièrement le cache pour les e-mails sensibles
   - Ajustez la période de rétention en fonction de vos besoins de sécurité
   - Surveillez les données mises en cache

4. **Sensibilisation à la confidentialité**
   - Comprenez que les services d'IA traitent vos données
   - Consultez régulièrement la politique de confidentialité de Google
   - Soyez conscient du contenu que vous soumettez pour analyse

## Mises à jour et maintenance

- Les améliorations de sécurité sont en cours
- Vérifiez régulièrement les mises à jour
- Consultez le journal des modifications pour les correctifs liés à la sécurité
- Signalez toute préoccupation de sécurité via les problèmes GitHub
