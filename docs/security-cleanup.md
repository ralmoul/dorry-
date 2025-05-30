
# 🧹 Documentation - Nettoyage Sécurisé Automatique

## Vue d'ensemble

Le système de nettoyage sécurisé automatique de Dorry.app maintient la base de données propre et conforme aux exigences ANSSI/NIS2 en supprimant automatiquement les données expirées.

## 🔄 Fonctionnement Automatique

### Planification
- **Fréquence** : Quotidienne à 3h du matin (UTC)
- **Méthode** : Cron job Supabase (`pg_cron`)
- **Déclencheur** : Edge Function `security-cleanup`

### Données nettoyées
1. **Codes OTP expirés** (> 24h)
2. **Sessions utilisateur expirées**
3. **Logs de sécurité anciens** (> 1 an)
4. **Tentatives de connexion anciennes** (> 24h, reset du compteur)

## 🚨 Système d'Alertes

### Succès
- Log dans `cleanup_history`
- Rapport envoyé par email (optionnel)
- Métriques de performance enregistrées

### Échecs
- **Alerte critique immédiate** (email/Slack)
- Log détaillé de l'erreur dans `cleanup_history`
- Arrêt du processus en cas d'erreur bloquante

## 📊 Monitoring

### Interface utilisateur
- **Page Paramètres** → Section "Historique des nettoyages"
- Statistiques en temps réel
- Historique des 20 dernières exécutions
- Bouton de nettoyage manuel

### Base de données
```sql
-- Consulter l'historique
SELECT * FROM public.cleanup_history 
ORDER BY execution_date DESC 
LIMIT 10;

-- Statistiques de performance
SELECT 
  status,
  COUNT(*) as executions,
  AVG(execution_duration_ms) as avg_duration_ms
FROM public.cleanup_history 
GROUP BY status;
```

## 🛠️ Opérations Manuelles

### Déclencher un nettoyage manuel
1. **Via l'interface** : Paramètres → "Nettoyage manuel"
2. **Via cURL** :
```bash
curl -X POST https://yviwqfevitaftvcgniqp.supabase.co/functions/v1/security-cleanup \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"source": "manual"}'
```

### Désactiver le cron (temporairement)
```sql
-- Lister les crons actifs
SELECT * FROM cron.job;

-- Désactiver le nettoyage quotidien
SELECT cron.unschedule('daily-security-cleanup');

-- Réactiver le nettoyage quotidien
SELECT cron.schedule(
  'daily-security-cleanup',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url:='https://yviwqfevitaftvcgniqp.supabase.co/functions/v1/security-cleanup',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aXdxZmV2aXRhZnR2Y2duaXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTE2ODUsImV4cCI6MjA2Mzc4NzY4NX0.AMkURgNc9CE9qH166zrYHMuNiAtY6grZUFF_Slh2y6E"}'::jsonb,
    body:='{"automated": true, "source": "cron_job"}'::jsonb
  );
  $$
);
```

## 🔧 Configuration Avancée

### Modifier la fréquence de nettoyage
```sql
-- Nettoyage toutes les 6 heures
SELECT cron.schedule(
  'frequent-security-cleanup',
  '0 */6 * * *',
  '...'
);

-- Nettoyage hebdomadaire (dimanche 2h)
SELECT cron.schedule(
  'weekly-security-cleanup',
  '0 2 * * 0',
  '...'
);
```

### Personnaliser les seuils de rétention
Modifier la fonction Edge `security-cleanup/index.ts` :
```typescript
// Codes OTP : 48h au lieu de 24h
.lt('expires_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())

// Logs de sécurité : 6 mois au lieu de 1 an
.lt('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
```

## 🔒 Sécurité & Conformité

### Traçabilité
- **Tous les nettoyages sont loggés** avec horodatage, durée, résultats
- **Audit trail complet** pour conformité réglementaire
- **Intégrité des données** préservée (pas de suppression accidentelle)

### Permissions
- **Service Role Key** utilisée pour les opérations de nettoyage
- **RLS activée** sur `cleanup_history` (admins seulement)
- **Fonction SECURITY DEFINER** pour logging sécurisé

## 📈 Métriques & KPIs

### Indicateurs de performance
- **Taux de succès** : > 99%
- **Temps d'exécution moyen** : < 2 secondes
- **Volume de données nettoyées** : Variable selon l'activité

### Alertes à surveiller
- ⚠️ Échec de nettoyage > 2 fois consécutives
- ⚠️ Temps d'exécution > 30 secondes
- ⚠️ Volume de données anormalement élevé/faible

## 🆘 Dépannage

### Problèmes courants
1. **Cron job non exécuté** → Vérifier `pg_cron` activée
2. **Edge Function timeout** → Augmenter les seuils de données
3. **Permissions insuffisantes** → Vérifier Service Role Key
4. **Alertes non envoyées** → Configurer service email

### Logs de diagnostic
```sql
-- Dernières erreurs
SELECT * FROM public.cleanup_history 
WHERE status = 'failed' 
ORDER BY execution_date DESC;

-- Performance dégradée
SELECT * FROM public.cleanup_history 
WHERE execution_duration_ms > 10000 
ORDER BY execution_date DESC;
```

---

**Contacts** : Pour toute question ou incident critique, contacter l'équipe DevSecOps.

**Dernière mise à jour** : $(date +%Y-%m-%d)
