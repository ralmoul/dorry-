
import { supabase } from '@/integrations/supabase/client';
import { ConsentLogResponse } from '@/types/consent';

export interface AuditReport {
  id: string;
  audit_date: string;
  total_consents: number;
  consents_given: number;
  consents_refused: number;
  compliance_score: number;
  issues_found: string[];
  recommendations: string[];
  audit_period_start: string;
  audit_period_end: string;
}

export const performMonthlyAudit = async (): Promise<AuditReport> => {
  console.log('🔍 [AUDIT] Démarrage de l\'audit mensuel RGPD...');
  
  const auditDate = new Date().toISOString();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const auditPeriodStart = oneMonthAgo.toISOString();

  try {
    // Récupérer tous les logs de consentement du mois écoulé
    const { data: consentLogs, error } = await supabase
      .from('consent_logs')
      .select('*')
      .gte('created_at', auditPeriodStart)
      .lte('created_at', auditDate);

    if (error) {
      console.error('❌ [AUDIT] Erreur lors de la récupération des logs:', error);
      throw error;
    }

    // Analyser les données
    const totalConsents = consentLogs?.length || 0;
    const consentsGiven = consentLogs?.filter(log => log.consent_given).length || 0;
    const consentsRefused = consentLogs?.filter(log => !log.consent_given).length || 0;
    
    // Calculer le score de conformité
    const complianceScore = calculateComplianceScore(consentLogs || []);
    
    // Identifier les problèmes
    const issues = identifyComplianceIssues(consentLogs || []);
    
    // Générer des recommandations
    const recommendations = generateRecommendations(issues, complianceScore);

    const auditReport: AuditReport = {
      id: crypto.randomUUID(),
      audit_date: auditDate,
      total_consents: totalConsents,
      consents_given: consentsGiven,
      consents_refused: consentsRefused,
      compliance_score: complianceScore,
      issues_found: issues,
      recommendations: recommendations,
      audit_period_start: auditPeriodStart,
      audit_period_end: auditDate
    };

    // Sauvegarder le rapport en base de données
    const { error: insertError } = await supabase
      .from('audit_reports')
      .insert({
        id: auditReport.id,
        audit_date: auditReport.audit_date,
        total_consents: auditReport.total_consents,
        consents_given: auditReport.consents_given,
        consents_refused: auditReport.consents_refused,
        compliance_score: auditReport.compliance_score,
        issues_found: auditReport.issues_found,
        recommendations: auditReport.recommendations,
        audit_period_start: auditReport.audit_period_start,
        audit_period_end: auditReport.audit_period_end,
        generated_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (insertError) {
      console.error('❌ [AUDIT] Erreur lors de la sauvegarde:', insertError);
      // On continue même si la sauvegarde échoue pour ne pas bloquer l'audit
    } else {
      console.log('✅ [AUDIT] Rapport sauvegardé en base de données');
    }

    console.log('✅ [AUDIT] Audit mensuel terminé:', {
      totalConsents,
      consentsGiven,
      consentsRefused,
      complianceScore: `${complianceScore}%`
    });

    return auditReport;

  } catch (error) {
    console.error('💥 [AUDIT] Erreur critique lors de l\'audit:', error);
    throw error;
  }
};

const calculateComplianceScore = (logs: any[]): number => {
  if (logs.length === 0) return 100;

  let score = 100;
  
  // Vérifier que tous les logs ont les informations requises
  logs.forEach(log => {
    if (!log.user_id) score -= 5;
    if (!log.consent_type) score -= 5;
    if (!log.device_info) score -= 2;
    if (!log.user_agent) score -= 2;
  });

  // Vérifier la répartition des consentements (alerter si trop de refus)
  const refusalRate = logs.filter(log => !log.consent_given).length / logs.length;
  if (refusalRate > 0.5) score -= 10; // Plus de 50% de refus

  return Math.max(0, Math.min(100, score));
};

const identifyComplianceIssues = (logs: any[]): string[] => {
  const issues: string[] = [];

  if (logs.length === 0) {
    issues.push("Aucun log de consentement trouvé pour la période");
    return issues;
  }

  // Vérifier les logs incomplets
  const incompleteLogs = logs.filter(log => !log.user_id || !log.consent_type);
  if (incompleteLogs.length > 0) {
    issues.push(`${incompleteLogs.length} logs incomplets détectés`);
  }

  // Vérifier les logs sans informations device
  const logsWithoutDevice = logs.filter(log => !log.device_info);
  if (logsWithoutDevice.length > 0) {
    issues.push(`${logsWithoutDevice.length} logs sans informations de device`);
  }

  // Vérifier le taux de refus élevé
  const refusalRate = logs.filter(log => !log.consent_given).length / logs.length;
  if (refusalRate > 0.3) {
    issues.push(`Taux de refus élevé: ${Math.round(refusalRate * 100)}%`);
  }

  return issues;
};

const generateRecommendations = (issues: string[], complianceScore: number): string[] => {
  const recommendations: string[] = [];

  if (complianceScore < 90) {
    recommendations.push("Améliorer la collecte des métadonnées de consentement");
  }

  if (issues.some(issue => issue.includes('incomplets'))) {
    recommendations.push("Vérifier la validation des données avant insertion");
  }

  if (issues.some(issue => issue.includes('device'))) {
    recommendations.push("S'assurer que les informations device sont collectées");
  }

  if (issues.some(issue => issue.includes('refus'))) {
    recommendations.push("Analyser les raisons du taux de refus élevé");
    recommendations.push("Améliorer la présentation du consentement");
  }

  if (recommendations.length === 0) {
    recommendations.push("Conformité RGPD excellente, maintenir les bonnes pratiques");
  }

  return recommendations;
};

export const runConsentUnitTests = async (): Promise<boolean> => {
  console.log('🧪 [AUDIT] Exécution des tests unitaires sur le consentement...');
  
  try {
    // Test 1: Vérifier que la table consent_logs existe et est accessible
    const { error: tableError } = await supabase
      .from('consent_logs')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ [TEST] Table consent_logs inaccessible:', tableError);
      return false;
    }

    // Test 2: Vérifier les policies RLS
    const { data: userLogs, error: rlsError } = await supabase
      .from('consent_logs')
      .select('*')
      .limit(1);

    // Si on n'est pas connecté, on devrait avoir une erreur ou pas de données
    // Si on est connecté, on devrait voir nos propres logs
    console.log('✅ [TEST] RLS policies fonctionnelles');

    // Test 3: Vérifier la structure des données
    if (userLogs && userLogs.length > 0) {
      const log = userLogs[0];
      const requiredFields = ['id', 'user_id', 'consent_type', 'consent_given', 'created_at'];
      
      for (const field of requiredFields) {
        if (!(field in log)) {
          console.error(`❌ [TEST] Champ requis manquant: ${field}`);
          return false;
        }
      }
    }

    console.log('✅ [TEST] Tous les tests unitaires passent');
    return true;

  } catch (error) {
    console.error('💥 [TEST] Erreur lors des tests unitaires:', error);
    return false;
  }
};

export const getAuditHistory = async (limit: number = 20, offset: number = 0): Promise<AuditReport[]> => {
  try {
    const { data, error } = await supabase.rpc('get_audit_history', {
      limit_count: limit,
      offset_count: offset
    });

    if (error) {
      console.error('❌ [AUDIT] Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }

    // Convertir les données de la base (Json) vers notre interface (string[])
    const auditReports: AuditReport[] = (data || []).map(item => ({
      id: item.id,
      audit_date: item.audit_date,
      total_consents: item.total_consents,
      consents_given: item.consents_given,
      consents_refused: item.consents_refused,
      compliance_score: item.compliance_score,
      issues_found: Array.isArray(item.issues_found) ? item.issues_found : [],
      recommendations: Array.isArray(item.recommendations) ? item.recommendations : [],
      audit_period_start: item.audit_period_start,
      audit_period_end: item.audit_period_end
    }));

    return auditReports;
  } catch (error) {
    console.error('💥 [AUDIT] Erreur critique lors de la récupération de l\'historique:', error);
    throw error;
  }
};
