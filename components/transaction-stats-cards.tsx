import { TransactionStats } from "@/app/actions/transactions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TransactionStatsCardsProps {
  stats: TransactionStats;
}

export function TransactionStatsCards({ stats }: TransactionStatsCardsProps) {
  const { pendingDeposits, pendingWithdrawals, approvedToday, rejectedToday } = stats;
  
  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-app-gold-100">
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Pending Deposits</CardDescription>
          <CardTitle className="text-3xl font-bold text-orange-500">
            {pendingDeposits}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="border-app-gold-100">
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Pending Withdrawals</CardDescription>
          <CardTitle className="text-3xl font-bold text-orange-500">
            {pendingWithdrawals}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="border-app-gold-100">
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Total Approved Today</CardDescription>
          <CardTitle className="text-3xl font-bold text-green-500">
            {approvedToday}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="border-app-gold-100">
        <CardHeader className="pb-2">
          <CardDescription className="text-white">Total Rejected Today</CardDescription>
          <CardTitle className="text-3xl font-bold text-red-500">
            {rejectedToday}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}