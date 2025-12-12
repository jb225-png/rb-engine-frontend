import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../ui/Table';
import { Section } from '../ui/Section';
import { Locale, Curriculum, CURRICULUM_LABELS } from '../../config/locales';

interface HistoryItem {
  id: number;
  standard: string;
  productsCount: number;
  status: 'success' | 'generating' | 'error';
  createdAt: string;
  locale: Locale;
  curriculum: Curriculum;
}

interface HistorySectionProps {
  historyData: HistoryItem[];
}

export const HistorySection: React.FC<HistorySectionProps> = ({ historyData }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Completed';
      case 'generating': return 'Pending';
      case 'error': return 'Draft';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Recent Generations Card */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Generations</h3>
        
        {historyData.length > 0 ? (
          <div className="space-y-4">
            {historyData.map((item) => (
              <div key={item.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {item.standard}
                  </p>
                  <StatusBadge status={item.status}>
                    {getStatusLabel(item.status)}
                  </StatusBadge>
                </div>
                <p className="text-xs text-neutral-500 mb-1">
                  {item.productsCount} products • {CURRICULUM_LABELS[item.curriculum]}
                </p>
                <p className="text-xs text-neutral-400">
                  {item.createdAt}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent runs yet"
            description="Your generation history will appear here"
          />
        )}

        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button variant="outline" fullWidth className="text-sm">
            View All History
          </Button>
        </div>
      </Card>

      {/* Full History Table */}
      <Section
        title="Generation History"
        description="Complete history of all content generation requests"
      >
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Standard</TableHeader>
                <TableHeader>Products Count</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Created At</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.length > 0 ? (
                historyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.standard}</span>
                        <p className="text-xs text-neutral-500">{CURRICULUM_LABELS[item.curriculum]}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.productsCount}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status}>
                        {getStatusLabel(item.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {item.status === 'error' && (
                          <Button variant="outline" size="sm">
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState
                      title="No generation history yet"
                      description="Start by generating your first product bundle"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </div>
  );
};