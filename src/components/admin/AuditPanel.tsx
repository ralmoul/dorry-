
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditManager } from '@/hooks/useAuditManager';
import { AuditHistoryPanel } from './AuditHistoryPanel';
import { AlertCircle, CheckCircle, Play, TestTube, History } from 'lucide-react';

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
    <Tabs defaultValue="current" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-lg">
        <TabsTrigger value="current" className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Audit Actuel
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique
        </TabsTrigger>
      </TabsList>

      <TabsContent value="current" className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-sharp">
              <AlertCircle className="h-5 w-5 text-bright-turquoise" />
              Audit de Conformité RGPD
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Surveillance automatisée de la conformité et des logs de consentement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleRunAudit} 
                disabled={isAuditing}
                className="flex items-center gap-2 bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold"
              >
                <Play className="h-4 w-4" />
                {isAuditing ? 'Audit en cours...' : 'Lancer l\'audit mensuel'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRunTests} 
                disabled={isRunningTests}
                className="flex items-center gap-2 bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
              >
                <TestTube className="h-4 w-4" />
                {isRunningTests ? 'Tests en cours...' : 'Tests unitaires'}
              </Button>
            </div>

            {auditError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm font-medium">{auditError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {lastAuditReport && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardHeader>
              <CardTitle className="text-xl font-sharp">Dernier Rapport d'Audit</CardTitle>
              <CardDescription className="text-muted-foreground">
                Généré le {new Date(lastAuditReport.audit_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score de conformité */}
              <div className="flex items-center justify-between p-4 bg-slate-900/20 rounded-lg border border-bright-turquoise/20">
                <div>
                  <h4 className="font-semibold text-lg font-sharp">Score de Conformité</h4>
                  <p className="text-sm text-muted-foreground">Basé sur l'analyse des logs</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getComplianceColor(lastAuditReport.compliance_score)}`}></div>
                  <span className="font-bold text-2xl font-sharp">{lastAuditReport.compliance_score}%</span>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 font-sharp">{lastAuditReport.total_consents}</div>
                  <div className="text-sm text-blue-300 mt-1">Total consentements</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 font-sharp">{lastAuditReport.consents_given}</div>
                  <div className="text-sm text-green-300 mt-1">Acceptés</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="text-3xl font-bold text-red-400 font-sharp">{lastAuditReport.consents_refused}</div>
                  <div className="text-sm text-red-300 mt-1">Refusés</div>
                </div>
              </div>

              {/* Problèmes identifiés */}
              {lastAuditReport.issues_found.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2 font-sharp">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Problèmes Identifiés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lastAuditReport.issues_found.map((issue, index) => (
                      <Badge key={index} className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommandations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2 font-sharp">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recommandations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lastAuditReport.recommendations.map((rec, index) => (
                    <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="history">
        <AuditHistoryPanel />
      </TabsContent>
    </Tabs>
  );
};
