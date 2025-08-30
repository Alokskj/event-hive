import { useState } from 'react';
import { useFlaggedReports, useReviewFlaggedReport } from '../hooks';
import { AdminFilters } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flag, Eye, CheckCircle, XCircle } from 'lucide-react';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
};

export function AdminFlaggedReports() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminFilters>({});
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'DISMISS'>('DISMISS');
  const [reviewNotes, setReviewNotes] = useState('');

  const { data: flaggedData, isLoading } = useFlaggedReports(page, 10, filters);
  const reviewMutation = useReviewFlaggedReport();

  const handleReview = async () => {
    if (!selectedFlag) return;

    try {
      await reviewMutation.mutateAsync({
        flagId: selectedFlag,
        action: reviewAction,
        notes: reviewNotes || undefined,
      });
      alert('Flag reviewed successfully');
      setReviewDialogOpen(false);
      setReviewNotes('');
      setSelectedFlag(null);
    } catch (error) {
      alert('Failed to review flag');
    }
  };

  const handleFilterChange = (key: keyof AdminFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1);
  };

  const openReviewDialog = (flagId: string, action: 'APPROVE' | 'DISMISS') => {
    setSelectedFlag(flagId);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flagged Reports</h1>
        <Badge variant="destructive" className="flex items-center space-x-1">
          <Flag className="h-3 w-3" />
          <span>{flaggedData?.meta.total || 0} flagged reports</span>
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flagged Reports Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Flagged By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flagged Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedData?.data.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.issue.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {flag.issue.description}
                        </div>
                        <Badge
                          variant="outline"
                          className="mt-1"
                          style={{ backgroundColor: flag.issue.category.color + '20' }}
                        >
                          {flag.issue.category.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.issue.reporter.name}</div>
                        <div className="text-sm text-gray-500">{flag.issue.reporter.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {flag.flaggedBy.length} user(s)
                        {flag.flaggedBy.slice(0, 2).map((user) => (
                          <div key={user.id} className="text-gray-500">
                            {user.name}
                          </div>
                        ))}
                        {flag.flaggedBy.length > 2 && (
                          <div className="text-gray-500">
                            +{flag.flaggedBy.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {flag.reason || 'No reason provided'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[flag.status]}>
                        {flag.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(flag.flaggedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {flag.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openReviewDialog(flag.id, 'APPROVE')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReviewDialog(flag.id, 'DISMISS')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {flaggedData && flaggedData.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, flaggedData.meta.total)} of {flaggedData.meta.total} flagged reports
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= flaggedData.meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'APPROVE' ? 'Approve Flag' : 'Dismiss Flag'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'APPROVE'
                ? 'This will remove the flagged issue and take appropriate action.'
                : 'This will dismiss the flag and keep the issue visible.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Review Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'APPROVE' ? 'destructive' : 'default'}
              onClick={handleReview}
            >
              {reviewAction === 'APPROVE' ? 'Approve & Remove' : 'Dismiss Flag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
