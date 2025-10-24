# 🚀 Test Rapide 2FA - 2 Minutes

## ✅ Configuration Supabase OK

Tu as déjà activé TOTP sur Supabase ✓

## 📱 Ce dont tu as besoin

- Google Authenticator (ou Authy, Microsoft Authenticator)
- Ton téléphone

## 🧪 Test Complet (2 minutes)

### 1. Activer la 2FA (1 minute)

```bash
# Si l'app tourne déjà, rafraîchis juste la page
# Sinon: npm run dev
```

1. Va sur **Profil** (icône utilisateur)
2. Scroll jusqu'à **"Paramètres de sécurité"**
3. Clique **"Activer la 2FA"** (bouton bleu)
4. Modal s'ouvre → Clique **"Next"**
5. **QR Code apparaît** ✅
6. Ouvre **Google Authenticator** sur ton téléphone
7. Scanne le QR code
8. Entre le **code à 6 chiffres** de l'app
9. Clique **"Complete"**
10. ✅ **Badge "2FA Active" apparaît !**

### 2. Vérifier (30 secondes)

- Badge **"2FA Active"** visible sur ta carte profil (coin haut gauche)
- Dans Sécurité : Chip vert **"2FA Activée"**
- Bouton change en **"Désactiver la 2FA"** (rouge)

### 3. Test Désactivation (30 secondes)

1. Clique **"Désactiver la 2FA"**
2. Confirme
3. Badge disparaît ✅

## ✅ Ça marche si...

- Tu vois le QR code (image)
- Le code de l'app est accepté
- Le badge apparaît et persiste après F5

## ❌ Si erreur...

### "Code invalide"

→ Vérifie que l'heure du téléphone est synchronisée
→ Le code change toutes les 30 secondes

### Pas de QR code

→ Check console: erreur Supabase?
→ Vérifie que TOTP est activé dans Dashboard

### Badge ne persiste pas

→ F5 pour recharger
→ Check console pour erreurs

## 🎉 C'est tout !

Tu as maintenant la 2FA fonctionnelle.

**Next step (optionnel):**

- Implémenter les codes de récupération
- Demander le code lors de la connexion

---

**Temps total:** 2 minutes ⏱️  
**Difficulté:** Facile 🟢
