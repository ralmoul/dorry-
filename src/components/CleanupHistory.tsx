
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cleanupHistoryService, CleanupHistoryEntry } from '@/services/cleanupHistoryService';
import { useToast } from '@/components/ui/use-toast';

export const CleanupHistory = () => {
  const [history, setHistory] = useState<CleanupHistoryEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualCleanup, setIsManualCleanup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, statsData] = await Promise.all([
        cleanupHistoryService.getCleanupHistory(20),
        cleanupHistoryService.getCleanupStats()
      ]);
      
      setHistory(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des nettoyages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCleanup = async () => {
    setIsManualCleanup(true);
    try {
      const result = await cleanupHistoryService.triggerManualCleanup();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: result.message,
          variant: "default"
        });
        // Recharger les données après 2 secondes
        setTimeout(loadData, 2000);
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du nettoyage manuel",
        variant: "destructive"
      });
    } finally {
      setIsManualCleanup(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <CardTitle className="text-bright-turquoise">Historique des nettoyages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-bright-turquoise" />
            <p className="text-muted-foreground mt-2">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {stats && (
        <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
          <CardHeader>
            <CardTitle className="text-bright-turquoise">Statistiques de nettoyage</CardTitle>
            <CardDescription>Résumé des opérations de maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalExecutions}</div>
                <div className="text-sm text-muted-foreground">Exécutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Taux de succès</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{formatDuration(stats.averageExecutionTime)}</div>
                <div className="text-sm text-muted-foreground">Temps moyen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.lastExecution ? new Date(stats.lastExecution.execution_date).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Dernier nettoyage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <CardTitle className="text-bright-turquoise">Actions de nettoyage</CardTitle>
          <CardDescription>Déclencher un nettoyage manuel ou consulter l'historique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleManualCleanup}
              disabled={isManualCleanup}
              className="bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80"
            >
              {isManualCleanup ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {isManualCleanup ? 'Nettoyage en cours...' : 'Nettoyage manuel'}
            </Button>
            <Button 
              variant="outline" 
              onClick={loadData}
              className="border-bright-turquoise/20 text-bright-turquoise hover:bg-bright-turquoise/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <CardTitle className="text-bright-turquoise">Historique des nettoyages</CardTitle>
          <CardDescription>Les 20 dernières exécutions</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun nettoyage enregistré</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(entry.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {new Date(entry.execution_date).toLocaleString()}
                        </span>
                        {getStatusBadge(entry.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.triggered_by} • {formatDuration(entry.execution_duration_ms)}
                      </div>
                      {entry.error_message && (
                        <div className="text-sm text-red-400 mt-1">
                          {entry.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(entry.records_cleaned).map(([type, count]) => (
                        <div key={type}>
                          {type}: {count}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
