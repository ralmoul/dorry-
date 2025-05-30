
import { supabase } from '@/integrations/supabase/client';

export interface CleanupHistoryEntry {
  id: string;
  execution_date: string;
  status: 'success' | 'failed' | 'partial';
  records_cleaned: Record<string, number>;
  error_message?: string;
  execution_duration_ms: number;
  triggered_by: string;
}

export const cleanupHistoryService = {
  // Récupérer l'historique des nettoyages
  async getCleanupHistory(limit: number = 50): Promise<CleanupHistoryEntry[]> {
    try {
      // Utiliser la fonction RPC pour accéder à cleanup_history
      const { data, error } = await supabase.rpc('get_cleanup_history', { 
        limit_count: limit 
      });

      if (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        return [];
      }

      // Transformer les données pour correspondre à l'interface CleanupHistoryEntry
      const transformedData: CleanupHistoryEntry[] = (data || []).map(entry => ({
        id: entry.id,
        execution_date: entry.execution_date,
        status: entry.status as 'success' | 'failed' | 'partial',
        records_cleaned: entry.records_cleaned as Record<string, number>,
        error_message: entry.error_message || undefined,
        execution_duration_ms: entry.execution_duration_ms,
        triggered_by: entry.triggered_by
      }));

      return transformedData;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  },

  // Déclencher un nettoyage manuel
  async triggerManualCleanup(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('security-cleanup', {
        body: {
          source: 'manual',
          triggered_by: 'admin_panel'
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Erreur lors du nettoyage manuel'
        };
      }
      
      if (data?.success) {
        return {
          success: true,
          message: 'Nettoyage manuel exécuté avec succès'
        };
      } else {
        return {
          success: false,
          message: data?.error || 'Erreur lors du nettoyage manuel'
        };
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage manuel:', error);
      return {
        success: false,
        message: 'Erreur de connexion lors du nettoyage'
      };
    }
  },

  // Obtenir les statistiques de nettoyage
  async getCleanupStats(): Promise<{
    totalExecutions: number;
    successRate: number;
    lastExecution?: CleanupHistoryEntry;
    averageExecutionTime: number;
  }> {
    try {
      const history = await this.getCleanupHistory(100);
      
      if (history.length === 0) {
        return {
          totalExecutions: 0,
          successRate: 0,
          averageExecutionTime: 0
        };
      }

      const successCount = history.filter(entry => entry.status === 'success').length;
      const successRate = (successCount / history.length) * 100;
      const averageExecutionTime = history.reduce((sum, entry) => sum + entry.execution_duration_ms, 0) / history.length;

      return {
        totalExecutions: history.length,
        successRate: Math.round(successRate * 100) / 100,
        lastExecution: history[0],
        averageExecutionTime: Math.round(averageExecutionTime)
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        totalExecutions: 0,
        successRate: 0,
        averageExecutionTime: 0
      };
    }
  }
};
