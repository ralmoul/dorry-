
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
    <Tabs defaultValue="current" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-lg h-auto p-1">
        <TabsTrigger value="current" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 h-8 sm:h-auto">
          <Play className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Audit Actuel</span>
          <span className="xs:hidden">Actuel</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 h-8 sm:h-auto">
          <History className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Historique</span>
          <span className="xs:hidden">Histo</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="current" className="space-y-4 sm:space-y-6">
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl font-sharp">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-bright-turquoise flex-shrink-0" />
              <span className="truncate">Audit de Conformité RGPD</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Surveillance automatisée de la conformité et des logs de consentement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={handleRunAudit} 
                disabled={isAuditing}
                className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="truncate">{isAuditing ? 'Audit en cours...' : 'Lancer l\'audit mensuel'}</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRunTests} 
                disabled={isRunningTests}
                className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <TestTube className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="truncate">{isRunningTests ? 'Tests en cours...' : 'Tests unitaires'}</span>
              </Button>
            </div>

            {auditError && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-xs sm:text-sm font-medium break-words">{auditError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {lastAuditReport && (
          <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-xl font-sharp">Dernier Rapport d'Audit</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Généré le {new Date(lastAuditReport.audit_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
              {/* Score de conformité optimisé mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-900/20 rounded-lg border border-bright-turquoise/20 gap-3 sm:gap-0">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-sm sm:text-lg font-sharp">Score de Conformité</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Basé sur l'analyse des logs</p>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-3">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getComplianceColor(lastAuditReport.compliance_score)}`}></div>
                  <span className="font-bold text-xl sm:text-2xl font-sharp">{lastAuditReport.compliance_score}%</span>
                </div>
              </div>

              {/* Statistiques optimisées mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="text-xl sm:text-3xl font-bold text-blue-400 font-sharp">{lastAuditReport.total_consents}</div>
                  <div className="text-xs sm:text-sm text-blue-300 mt-1">Total consentements</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="text-xl sm:text-3xl font-bold text-green-400 font-sharp">{lastAuditReport.consents_given}</div>
                  <div className="text-xs sm:text-sm text-green-300 mt-1">Acceptés</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-red-500/10 rounded-lg border border-red-500/30 col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-3xl font-bold text-red-400 font-sharp">{lastAuditReport.consents_refused}</div>
                  <div className="text-xs sm:text-sm text-red-300 mt-1">Refusés</div>
                </div>
              </div>

              {/* Problèmes identifiés optimisés mobile */}
              {lastAuditReport.issues_found.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm sm:text-lg flex items-center gap-2 font-sharp">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    Problèmes Identifiés
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {lastAuditReport.issues_found.map((issue, index) => (
                      <Badge key={index} className="bg-red-500/20 text-red-400 border-red-500/30 px-2 sm:px-3 py-1 text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommandations optimisées mobile */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm sm:text-lg flex items-center gap-2 font-sharp">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  Recommandations
                </h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {lastAuditReport.recommendations.map((rec, index) => (
                    <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30 px-2 sm:px-3 py-1 text-xs">
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
