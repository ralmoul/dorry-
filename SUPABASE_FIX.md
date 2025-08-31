# SOLUTION PROBLÈME AUTHENTIFICATION

## PROBLÈME
Les utilisateurs ne peuvent pas se connecter même avec le bon mot de passe.

## CAUSE PROBABLE
Supabase exige la confirmation d'email par défaut.

## SOLUTION IMMÉDIATE
Allez dans votre dashboard Supabase :

1. **Authentication > Settings**
2. **Décochez "Enable email confirmations"**
3. **Sauvegardez**

## OU ALORS
Dans Authentication > Users, pour chaque utilisateur :
- Cliquez sur l'utilisateur
- Cochez "Email Confirmed" manuellement

## ALTERNATIVE CODE
J'ai déjà modifié le code pour gérer ce cas, mais la solution la plus rapide est de désactiver la confirmation email dans Supabase.
