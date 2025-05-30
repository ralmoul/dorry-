
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getAuditHistory, AuditReport } from '@/services/auditService';
import { AlertCircle, CheckCircle, RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AuditHistoryPanel = () => {
  const [auditHistory, setAuditHistory] = useState<AuditReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadAuditHistory();
  }, [currentPage]);

  const loadAuditHistory = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const history = await getAuditHistory(ITEMS_PER_PAGE, offset);
      setAuditHistory(history);
      
      // Pour simplifier, on estime le nombre total de pages
      // Dans une vraie application, il faudrait une requête COUNT séparée
      if (history.length === ITEMS_PER_PAGE) {
        setTotalPages(Math.max(currentPage + 1, totalPages));
      } else {
        setTotalPages(currentPage);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des audits",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceBadge = (score: number) => {
    if (score >= 95) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 85) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const endDate = new Date(end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${startDate} - ${endDate}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-sharp">
            <Calendar className="h-5 w-5 text-bright-turquoise" />
            Historique des Audits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-bright-turquoise mb-4" />
            <p className="text-muted-foreground">Chargement de l'historique...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-lg border-bright-turquoise/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-sharp">
                <Calendar className="h-5 w-5 text-bright-turquoise" />
                Historique des Audits RGPD
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Historique complet des audits de conformité mensuels
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={loadAuditHistory}
              className="bg-bright-turquoise/10 border-bright-turquoise/30 text-bright-turquoise hover:bg-bright-turquoise/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {auditHistory.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun audit enregistré</p>
              <p className="text-sm text-muted-foreground mt-2">
                Lancez votre premier audit mensuel pour voir l'historique
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date d'audit</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-center">Consentements</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Problèmes</TableHead>
                    <TableHead className="text-center">Recommandations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditHistory.map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell className="font-medium">
                        {formatDate(audit.audit_date)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatPeriod(audit.audit_period_start, audit.audit_period_end)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">{audit.total_consents}</div>
                          <div className="flex gap-1 justify-center">
                            <Badge className="text-xs bg-green-500/20 text-green-400">
                              +{audit.consents_given}
                            </Badge>
                            <Badge className="text-xs bg-red-500/20 text-red-400">
                              -{audit.consents_refused}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getComplianceBadge(audit.compliance_score)}`}>
                          {audit.compliance_score}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {audit.issues_found.length > 0 ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span className="text-orange-400">{audit.issues_found.length}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-400">0</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-400">{audit.recommendations.length}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
