
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuditManager } from '@/hooks/useAuditManager';
import { AlertCircle, CheckCircle, Play, TestTube } from 'lucide-react';

export const AuditPanel = () => {
  const { isAuditing, lastAuditReport, auditError, runMonthlyAudit, runUnitTests } = useAuditManager();
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRunAudit = async () => {
    try {
      await runMonthlyAudit();
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      await runUnitTests();
    } catch (error) {
      console.error('Erreur lors des tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'bg-green-500';
    if (score >= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Audit de Conformité RGPD
          </CardTitle>
          <CardDescription>
            Surveillance automatisée de la conformité et des logs de consentement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleRunAudit} 
              disabled={isAuditing}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isAuditing ? 'Audit en cours...' : 'Lancer l\'audit mensuel'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRunTests} 
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isRunningTests ? 'Tests en cours...' : 'Tests unitaires'}
            </Button>
          </div>

          {auditError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{auditError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {lastAuditReport && (
        <Card>
          <CardHeader>
            <CardTitle>Dernier Rapport d'Audit</CardTitle>
            <CardDescription>
              Généré le {new Date(lastAuditReport.audit_date).toLocaleDateString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score de conformité */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-semibold">Score de Conformité</h4>
                <p className="text-sm text-slate-600">Basé sur l'analyse des logs</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getComplianceColor(lastAuditReport.compliance_score)}`}></div>
                <span className="font-bold text-lg">{lastAuditReport.compliance_score}%</span>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{lastAuditReport.total_consents}</div>
                <div className="text-sm text-blue-800">Total consentements</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{lastAuditReport.consents_given}</div>
                <div className="text-sm text-green-800">Acceptés</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{lastAuditReport.consents_refused}</div>
                <div className="text-sm text-red-800">Refusés</div>
              </div>
            </div>

            {/* Problèmes identifiés */}
            {lastAuditReport.issues_found.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Problèmes Identifiés
                </h4>
                <div className="space-y-1">
                  {lastAuditReport.issues_found.map((issue, index) => (
                    <Badge key={index} variant="destructive" className="mr-2 mb-1">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Recommandations
              </h4>
              <div className="space-y-1">
                {lastAuditReport.recommendations.map((rec, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-1">
                    {rec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
