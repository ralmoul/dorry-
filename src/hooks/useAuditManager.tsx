
import { useState, useCallback } from 'react';
import { performMonthlyAudit, runConsentUnitTests, AuditReport } from '@/services/auditService';

export const useAuditManager = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAuditReport, setLastAuditReport] = useState<AuditReport | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const runMonthlyAudit = useCallback(async () => {
    console.log('🔍 [AUDIT_MANAGER] Démarrage de l\'audit mensuel...');
    setIsAuditing(true);
    setAuditError(null);

    try {
      const report = await performMonthlyAudit();
      setLastAuditReport(report);
      console.log('✅ [AUDIT_MANAGER] Audit terminé avec succès et sauvegardé');
      return report;
    } catch (error) {
      console.error('❌ [AUDIT_MANAGER] Erreur lors de l\'audit:', error);
      setAuditError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    } finally {
      setIsAuditing(false);
    }
  }, []);

  const runUnitTests = useCallback(async () => {
    console.log('🧪 [AUDIT_MANAGER] Exécution des tests unitaires...');
    
    try {
      const success = await runConsentUnitTests();
      if (!success) {
        setAuditError('Certains tests unitaires ont échoué');
      }
      return success;
    } catch (error) {
      console.error('❌ [AUDIT_MANAGER] Erreur lors des tests:', error);
      setAuditError(error instanceof Error ? error.message : 'Erreur lors des tests');
      return false;
    }
  }, []);

  return {
    isAuditing,
    lastAuditReport,
    auditError,
    runMonthlyAudit,
    runUnitTests
  };
};
