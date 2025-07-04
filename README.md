# 💡 Idea Planner

Une application mobile moderne pour capturer, organiser et développer vos idées créatives avec un système de notation et de recherche avancé.

## ✨ Fonctionnalités

- **💭 Gestion d'idées** : Créez, modifiez et supprimez vos idées facilement
- **⭐ Système de notation** : Notez vos idées de 0 à 10 pour prioriser
- **🔍 Recherche intelligente** : Recherchez dans les titres et descriptions avec interface moderne
- **📱 Interface native** : Design moderne avec Material Design 3
- **🌐 Multilingue** : Support français et anglais
- **💾 Stockage local** : Vos données restent sur votre appareil
- **📤 Partage** : Partagez vos idées avec d'autres applications
- **🎨 Interface moderne** : Animation fluide et design ergonomique

## 🚀 Technologies

- **React Native** avec Expo SDK 53
- **TypeScript** pour la sécurité des types
- **React Navigation** pour la navigation
- **React Native Paper** pour les composants Material Design
- **AsyncStorage** pour le stockage local
- **i18next** pour l'internationalisation

## 📱 Installation

### Prérequis

- Node.js 18+
- Expo CLI ou EAS CLI
- Un émulateur Android/iOS ou un appareil physique

### Démarrage rapide

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/idea-planner.git
cd idea-planner

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npx expo start

# 4. Scanner le QR code avec Expo Go (mobile) ou appuyer sur 'i' pour iOS / 'a' pour Android
```

### Build de production

```bash
# Build pour toutes les plateformes
eas build --platform all

# Build pour une plateforme spécifique
eas build --platform ios
eas build --platform android
```

## 🎯 Utilisation

### Ajouter une idée

1. Appuyez sur le bouton **"+ Ajouter mon idée"**
2. Remplissez le titre (obligatoire)
3. Ajoutez une description (optionnel)
4. Attribuez une note de 0 à 10 (optionnel)
5. Sauvegardez votre idée

### Rechercher des idées

1. Cliquez sur l'icône de loupe 🔍
2. Un champ de recherche apparaît avec animation
3. Tapez votre recherche (titre ou description)
4. Les résultats s'affichent en temps réel

### Organiser vos idées

- **Tri par date** : Plus récent ou plus ancien
- **Tri par note** : Mieux notées ou moins bien notées
- **Filtrage** : Effacez tous les filtres d'un clic

### Partager une idée

1. Ouvrez une idée
2. Appuyez sur l'icône de partage
3. Choisissez l'application de destination

## 🛠️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── AddIdeaForm.tsx
│   ├── EditIdeaForm.tsx
│   ├── IdeaCard.tsx
│   ├── IdeaFilters.tsx
│   ├── IdeaList.tsx
│   └── RatingSelector.tsx
├── hooks/               # Hooks personnalisés
│   ├── useAddIdea.ts
│   ├── useDeepLinking.ts
│   ├── useIdeas.ts
│   └── useUpdateIdea.ts
├── i18n/               # Internationalisation
│   ├── index.ts
│   └── locales/
│       ├── en.ts
│       └── fr.ts
├── navigation/         # Configuration de navigation
│   └── AppNavigator.tsx
├── screens/           # Écrans de l'application
│   ├── AddIdeaScreen.tsx
│   ├── IdeaDetailScreen.tsx
│   ├── IdeasScreen.tsx
│   └── SettingsScreen.tsx
├── services/          # Services et utilitaires
│   └── localStorage.ts
└── types/            # Définitions TypeScript
    └── index.ts
```

## 🎨 Design et UX

### Principes de design

- **Simplicité** : Interface claire et intuitive
- **Performance** : Animations fluides et réactivité
- **Accessibilité** : Respect des standards d'accessibilité
- **Cohérence** : Design cohérent avec Material Design 3

### Couleurs et thème

- **Couleur primaire** : Bleu (#0066ff)
- **Background** : Blanc (#ffffff)
- **Cartes** : Blanc avec ombre légère
- **Notes** : Code couleur (Rouge: 0-3, Orange: 4-7, Vert: 8-10)

## 🔧 Développement

### Scripts disponibles

```bash
npm start          # Démarre Expo
npm run android    # Lance sur Android
npm run ios        # Lance sur iOS
npm run web        # Lance sur le web
```

### Architecture des données

```typescript
interface Idea {
  id: string;
  title: string;
  description?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}
```

### Hooks principaux

- `useIdeas()` : Gestion de la liste des idées avec pagination
- `useAddIdea()` : Ajout d'une nouvelle idée
- `useUpdateIdea()` : Modification d'une idée existante

## 📝 Historique des versions

### v1.0.1 (Actuelle)
- ✨ Ajout de la recherche textuelle dans titres et descriptions
- 🎨 Interface de recherche moderne avec icône cliquable
- ✨ Animation fluide d'apparition du champ de recherche
- 🐛 Amélioration du texte de partage avec "nouvelle idée"
- 🔄 Mise à jour du bouton "Ajouter" vers "Ajouter mon idée"

### v1.0.0
- 🎉 Version initiale
- 💭 Gestion complète des idées (CRUD)
- ⭐ Système de notation 0-10
- 🔄 Tri et filtrage des idées
- 📤 Fonctionnalité de partage
- 🌐 Support multilingue (FR/EN)
- 📱 Interface Material Design

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ par Charlyboibgdelastreet43ducoin

---

**📱 Téléchargez l'app et commencez à capturer vos idées dès aujourd'hui !**