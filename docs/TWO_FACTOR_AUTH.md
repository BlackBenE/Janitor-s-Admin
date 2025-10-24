# Authentification à Deux Facteurs (2FA/TOTP)

## 📋 Vue d'ensemble

L'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire à votre compte en demandant un code de vérification en plus de votre mot de passe.

Cette implémentation utilise **Supabase Auth TOTP** (Time-based One-Time Password).

## 🎯 Fonctionnalités

### ✅ Implémenté

- ✅ Activation de la 2FA avec QR Code
- ✅ Vérification du code TOTP à 6 chiffres
- ✅ Désactivation de la 2FA
- ✅ Badge visuel sur le profil quand 2FA activée
- ✅ Interface utilisateur complète avec stepper
- ✅ Support des applications d'authentification (Google Authenticator, Authy, Microsoft Authenticator)
- ✅ Affichage du secret pour configuration manuelle

### 🔄 À venir

- ⏳ Codes de récupération (backup codes)
- ⏳ Vérification 2FA lors de la connexion
- ⏳ Historique des activités 2FA
- ⏳ Notification par email lors de l'activation/désactivation

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── core/
│   └── services/
│       └── two-factor.service.ts      # Service principal 2FA
└── features/
    └── profile/
        ├── hooks/
        │   └── useTwoFactor.ts         # Hook React pour 2FA
        ├── components/
        │   ├── ProfileCard.tsx         # Affiche le badge 2FA
        │   ├── SecuritySettingsCard.tsx # Bouton activer/désactiver
        │   └── TwoFactorBadge.tsx      # Badge visuel
        └── modals/
            └── TwoFactorModal.tsx      # Modal d'activation/désactivation
```

### Services

#### `TwoFactorService`

Service singleton qui interagit avec Supabase Auth MFA API.

**Méthodes principales:**

```typescript
// Vérifier le statut 2FA
static async checkTwoFactorStatus(): Promise<{
  enabled: boolean;
  factors: TwoFactorFactor[];
}>

// Démarrer l'inscription (génère QR code)
static async enrollTwoFactor(friendlyName?: string): Promise<TwoFactorEnrollment>

// Vérifier le code et activer
static async verifyTwoFactorCode(factorId: string, code: string): Promise<boolean>

// Désactiver la 2FA
static async disableTwoFactor(factorId: string): Promise<void>

// Créer un challenge (pour la connexion)
static async createChallenge(factorId: string): Promise<string>

// Vérifier un challenge
static async verifyChallenge(factorId: string, challengeId: string, code: string): Promise<boolean>
```

#### `useTwoFactor` Hook

Hook React pour gérer la 2FA dans les composants.

**Retour:**

```typescript
{
  // État
  isEnabled: boolean;           // 2FA activée ou non
  isLoading: boolean;           // Chargement du statut
  factors: TwoFactorFactor[];   // Liste des facteurs MFA

  // Enrollment
  enrollment: TwoFactorEnrollment | null;  // Données d'inscription (QR code, secret)
  isEnrolling: boolean;                    // En cours d'inscription

  // Actions
  checkStatus: () => Promise<void>;
  startEnrollment: () => Promise<void>;
  verifyAndEnable: (code: string) => Promise<boolean>;
  disable: (factorId: string) => Promise<void>;
}
```

## 🚀 Utilisation

### Pour l'utilisateur

1. **Activer la 2FA:**
   - Aller dans Profil > Sécurité
   - Cliquer sur "Activer la 2FA"
   - Suivre les étapes:
     1. Installer une app d'authentification
     2. Scanner le QR code
     3. Entrer le code à 6 chiffres

2. **Désactiver la 2FA:**
   - Aller dans Profil > Sécurité
   - Cliquer sur "Désactiver la 2FA"
   - Confirmer

### Pour les développeurs

#### Vérifier si l'utilisateur a la 2FA activée

```typescript
import { useTwoFactor } from '@/features/profile/hooks';

function MyComponent() {
  const { isEnabled, isLoading } = useTwoFactor();

  if (isLoading) return <Spinner />;

  return (
    <div>
      {isEnabled ? '🔒 2FA activée' : '⚠️ 2FA désactivée'}
    </div>
  );
}
```

#### Activer la 2FA programmatiquement

```typescript
import { TwoFactorService } from '@/core/services/two-factor.service';

async function enable2FA() {
  // 1. Générer le QR code
  const enrollment = await TwoFactorService.enrollTwoFactor();

  // 2. Afficher enrollment.totp.qr_code à l'utilisateur
  console.log('QR Code:', enrollment.totp.qr_code);
  console.log('Secret:', enrollment.totp.secret);

  // 3. Demander le code à l'utilisateur
  const code = prompt('Entrez le code:');

  // 4. Vérifier et activer
  const success = await TwoFactorService.verifyTwoFactorCode(enrollment.id, code);

  if (success) {
    console.log('✅ 2FA activée!');
  }
}
```

## 🔐 Sécurité

### Configuration Supabase

La 2FA doit être activée dans Supabase:

1. Dashboard Supabase > Authentication > Settings
2. Multi-Factor Authentication (MFA) > Enable TOTP

### Niveaux d'assurance (AAL)

- **AAL1** (Authenticator Assurance Level 1): Authentification simple (mot de passe)
- **AAL2** (Authenticator Assurance Level 2): Authentification forte (mot de passe + 2FA)

```typescript
const { currentLevel, nextLevel } = await TwoFactorService.getAssuranceLevel();
console.log('AAL actuel:', currentLevel); // 'aal1' ou 'aal2'
```

### Bonnes pratiques

1. ✅ **Toujours vérifier** le statut 2FA avant les actions sensibles
2. ✅ **Stocker** le factorId de manière sécurisée
3. ✅ **Implémenter** des codes de récupération (à venir)
4. ✅ **Logger** les activations/désactivations de 2FA
5. ✅ **Notifier** l'utilisateur par email lors des changements

## 🧪 Tests

### Tester l'activation

1. Créer un compte de test
2. Aller dans le profil
3. Activer la 2FA
4. Scanner le QR code avec Google Authenticator (ou autre)
5. Entrer le code généré
6. Vérifier que le badge "2FA Active" apparaît

### Tester la désactivation

1. Compte avec 2FA activée
2. Cliquer sur "Désactiver la 2FA"
3. Confirmer
4. Vérifier que le badge disparaît

## 📚 Ressources

- [Supabase MFA Documentation](https://supabase.com/docs/guides/auth/auth-mfa)
- [RFC 6238 - TOTP](https://tools.ietf.org/html/rfc6238)
- [Google Authenticator](https://support.google.com/accounts/answer/1066447)
- [Authy](https://authy.com/)

## 🐛 Dépannage

### Le QR code ne s'affiche pas

```typescript
// Vérifier les erreurs dans la console
const enrollment = await TwoFactorService.enrollTwoFactor();
console.log('Enrollment:', enrollment);
```

### Le code est refusé

- ✅ Vérifier que le temps du téléphone est synchronisé
- ✅ Le code change toutes les 30 secondes
- ✅ Vérifier que le bon compte est sélectionné dans l'app

### La 2FA ne se désactive pas

```typescript
// Vérifier les facteurs existants
const { factors } = await TwoFactorService.checkTwoFactorStatus();
console.log('Facteurs:', factors);

// Désactiver manuellement
await TwoFactorService.disableTwoFactor(factors[0].id);
```

## 🚧 TODO

- [ ] Ajouter les codes de récupération (backup codes)
- [ ] Implémenter la vérification 2FA lors de la connexion
- [ ] Ajouter un historique des activités 2FA
- [ ] Notification email lors des changements
- [ ] Support de plusieurs facteurs 2FA
- [ ] Interface de gestion des appareils de confiance
- [ ] Tests unitaires complets
- [ ] Documentation API complète

---

**Version:** 1.0.0  
**Dernière mise à jour:** 24 octobre 2025  
**Auteur:** Janitor's Admin Team
