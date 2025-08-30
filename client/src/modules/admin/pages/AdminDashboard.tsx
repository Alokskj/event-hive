import { useAdminStats } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Flag,
  TrendingUp,
  Users,
} from 'lucide-react';

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">Unable to load dashboard statistics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      trend: `+${stats.recentActivity.newUsers} this week`,
      trendColor: 'text-green-600',
    },
    {
      title: 'Total Issues',
      value: stats.totalIssues,
      icon: AlertTriangle,
      trend: `+${stats.recentActivity.newIssues} this week`,
      trendColor: 'text-blue-600',
    },
    {
      title: 'Resolved Issues',
      value: stats.totalResolved,
      icon: CheckCircle,
      trend: `+${stats.recentActivity.resolvedIssues} this week`,
      trendColor: 'text-green-600',
    },
    {
      title: 'Pending Issues',
      value: stats.totalPending,
      icon: Clock,
      trend: `${stats.totalPending} pending`,
      trendColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {stats.totalFlagged > 0 && (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <Flag className="h-3 w-3" />
            <span>{stats.totalFlagged} flagged reports</span>
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className={`text-xs ${stat.trendColor} flex items-center space-x-1`}>
                <TrendingUp className="h-3 w-3" />
                <span>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.categoryStats.map((category) => (
                <div key={category.categoryId} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.categoryName}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(category.count / stats.totalIssues) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Review Flagged Reports</div>
              <div className="text-sm text-gray-600">
                {stats.totalFlagged} reports need review
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Manage Categories</div>
              <div className="text-sm text-gray-600">
                {stats.categoryStats.length} active categories
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">User Management</div>
              <div className="text-sm text-gray-600">
                {stats.totalUsers} registered users
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
