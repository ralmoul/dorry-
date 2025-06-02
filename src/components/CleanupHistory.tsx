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
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, statsData] = await Promise.all([cleanupHistoryService.getCleanupHistory(20), cleanupHistoryService.getCleanupStats()]);
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
    return <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <CardTitle className="text-bright-turquoise">Historique des nettoyages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-bright-turquoise" />
            <p className="text-muted-foreground mt-2">Chargement...</p>
          </div>
        </CardContent>
      </Card>;
  }
  return;
};