# Configuration de la 2FA (TOTP) sur Supabase

## 🎯 Objectif

Activer l'authentification à deux facteurs (2FA) avec TOTP sur Supabase pour le projet Janitor's Admin.

## ✅ Prérequis

- Accès au Dashboard Supabase
- Projet Supabase configuré
- Supabase CLI installé (optionnel)

## 📋 Étapes de configuration

### 1. Via Dashboard Supabase (Recommandé)

1. **Accéder aux paramètres d'authentification:**

   ```
   Dashboard > Authentication > Settings
   ```

2. **Activer TOTP:**
   - Aller dans la section "Multi-Factor Authentication (MFA)"
   - Activer l'option "Enable TOTP" (Time-based One-Time Password)
   - Sauvegarder les modifications

3. **Configuration avancée (optionnel):**
   - **Max Enrolled Factors**: Nombre maximum de facteurs MFA par utilisateur (défaut: 10)
   - **TOTP Time Step**: Durée de validité d'un code (défaut: 30 secondes)
   - **TOTP Window**: Nombre de fenêtres temporelles acceptées (défaut: 1)

### 2. Via Supabase CLI (Avancé)

```bash
# 1. Se connecter à Supabase
supabase login

# 2. Lier le projet
supabase link --project-ref <votre-project-ref>

# 3. Mettre à jour la configuration
supabase projects api-keys --project-ref <votre-project-ref>
```

**Modifier le fichier `supabase/config.toml`:**

```toml
[auth]
# Enable TOTP
enable_signup = true
enable_anonymous_sign_ins = false

[auth.mfa]
# Enable Multi-Factor Authentication
enabled = true
# Maximum enrolled factors per user
max_enrolled_factors = 10
```

**Appliquer les changements:**

```bash
supabase db push
```

## 🔐 Configuration de sécurité recommandée

### Politique de sécurité des facteurs MFA

```sql
-- Créer une table pour stocker les informations additionnelles 2FA (optionnel)
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled_at timestamp with time zone,
  disabled_at timestamp with time zone,
  backup_codes text[], -- Pour les codes de récupération
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS (Row Level Security)
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs ne peuvent voir que leurs propres paramètres
CREATE POLICY "Users can view own MFA settings"
  ON public.user_mfa_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs ne peuvent modifier que leurs propres paramètres
CREATE POLICY "Users can update own MFA settings"
  ON public.user_mfa_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent insérer leurs propres paramètres
CREATE POLICY "Users can insert own MFA settings"
  ON public.user_mfa_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Audit des activités 2FA

```sql
-- Table d'audit pour les activités 2FA
CREATE TABLE IF NOT EXISTS public.mfa_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'enrolled', 'verified', 'unenrolled', 'failed_verification'
  factor_id text,
  ip_address inet,
  user_agent text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour les requêtes rapides
CREATE INDEX idx_mfa_audit_user_id ON public.mfa_audit_log(user_id);
CREATE INDEX idx_mfa_audit_created_at ON public.mfa_audit_log(created_at DESC);

-- RLS
ALTER TABLE public.mfa_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leur propre historique
CREATE POLICY "Users can view own MFA audit log"
  ON public.mfa_audit_log
  FOR SELECT
  USING (auth.uid() = user_id);
```

## 🧪 Vérification de la configuration

### Test via SQL

```sql
-- Vérifier si MFA est activé pour un utilisateur
SELECT
  u.id,
  u.email,
  u.created_at,
  COUNT(f.id) as mfa_factors_count
FROM auth.users u
LEFT JOIN auth.mfa_factors f ON f.user_id = u.id AND f.status = 'verified'
GROUP BY u.id, u.email, u.created_at;
```

### Test via API Supabase

```typescript
import { supabase } from '@/core/config/supabase';

// Tester l'enrollment
async function testMFAConfiguration() {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Test Factor',
    });

    if (error) {
      console.error('❌ MFA non configuré:', error.message);
      return false;
    }

    console.log('✅ MFA configuré correctement!');
    console.log('QR Code généré:', data.totp.qr_code);
    return true;
  } catch (err) {
    console.error('❌ Erreur:', err);
    return false;
  }
}
```

## 📊 Monitoring

### Métriques à surveiller

1. **Taux d'adoption de la 2FA:**

   ```sql
   SELECT
     COUNT(DISTINCT CASE WHEN f.status = 'verified' THEN u.id END) * 100.0 / COUNT(DISTINCT u.id) as adoption_rate
   FROM auth.users u
   LEFT JOIN auth.mfa_factors f ON f.user_id = u.id;
   ```

2. **Échecs de vérification:**
   ```sql
   SELECT
     DATE_TRUNC('day', created_at) as date,
     COUNT(*) as failed_attempts
   FROM public.mfa_audit_log
   WHERE action = 'failed_verification'
   GROUP BY date
   ORDER BY date DESC;
   ```

## 🚨 Troubleshooting

### Problème: "MFA not enabled for this project"

**Solution:**

1. Vérifier que TOTP est activé dans Dashboard > Authentication > Settings
2. Attendre quelques minutes pour la propagation des changements
3. Vider le cache du navigateur

### Problème: "Factor not found"

**Solution:**

```sql
-- Vérifier les facteurs existants
SELECT * FROM auth.mfa_factors WHERE user_id = '<user-uuid>';

-- Nettoyer les facteurs non vérifiés
DELETE FROM auth.mfa_factors
WHERE user_id = '<user-uuid>' AND status = 'unverified';
```

### Problème: "Challenge expired"

**Solution:**

- Les challenges expirent après 60 secondes par défaut
- Régénérer un nouveau challenge si nécessaire

## 🔄 Migration des utilisateurs existants

Si vous avez des utilisateurs existants et voulez les encourager à activer la 2FA:

```typescript
// Créer une notification pour tous les utilisateurs
async function notifyUsersAbout2FA() {
  const { data: users } = await supabase.from('users').select('id, email').is('mfa_enabled', false);

  for (const user of users) {
    // Envoyer un email ou une notification in-app
    console.log(`Notifier ${user.email} à propos de la 2FA`);
  }
}
```

## 📚 Ressources

- [Supabase MFA Documentation](https://supabase.com/docs/guides/auth/auth-mfa)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)

---

**Date:** 24 octobre 2025  
**Version:** 1.0.0  
**Status:** ✅ Prêt pour production
