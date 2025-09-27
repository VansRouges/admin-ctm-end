import { TransactionStats } from "@/app/actions/transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TransactionStatsCardsProps {
  stats: TransactionStats;
}

export function TransactionStatsCards({ stats }: TransactionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Pending Deposits</CardDescription>
          <CardTitle className="text-3xl font-bold text-orange-500">
            {stats.pendingDeposits}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Pending Withdrawals</CardDescription>
          <CardTitle className="text-3xl font-bold text-orange-500">
            {stats.pendingWithdrawals}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Total Approved Today</CardDescription>
          <CardTitle className="text-3xl font-bold text-green-500">
            {stats.approvedToday}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Total Rejected Today</CardDescription>
          <CardTitle className="text-3xl font-bold text-red-500">
            {stats.rejectedToday}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}