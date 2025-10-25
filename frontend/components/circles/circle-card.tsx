import Link from "next/link";
import { Users, Clock, DollarSign, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleState } from "@/types/circle";
import { formatCurrency } from "@/lib/utils";

interface CircleCardProps {
  id: number;
  name: string;
  contributionAmount: bigint;
  frequency: string;
  members: number;
  maxMembers: number;
  state: CircleState;
  progress: number;
  address: string;
}

/**
 * Circle Card Component
 * Displays circle information in a card format
 */
export function CircleCard({
  id,
  name,
  contributionAmount,
  frequency,
  members,
  maxMembers,
  state,
  progress,
  address,
}: CircleCardProps) {
  const getStateBadge = (state: CircleState) => {
    switch (state) {
      case CircleState.Pending:
        return <Badge variant="pending">Pending</Badge>;
      case CircleState.Active:
        return <Badge variant="active">Active</Badge>;
      case CircleState.Completed:
        return <Badge variant="completed">Completed</Badge>;
      case CircleState.Cancelled:
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:border-primary transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{name}</CardTitle>
            <CardDescription className="mt-1">Circle #{id}</CardDescription>
          </div>
          {getStateBadge(state)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {state === CircleState.Active && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Contribution</div>
              <div className="font-semibold">
                {formatCurrency(Number(contributionAmount) / 1e18, "USD")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
              <Clock className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Frequency</div>
              <div className="font-semibold">{frequency}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Members</div>
              <div className="font-semibold">
                {members}/{maxMembers}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Pool</div>
              <div className="font-semibold">
                {formatCurrency((Number(contributionAmount) / 1e18) * maxMembers, "USD")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/circles/${address}`} className="block">
          <Button variant="outline" fullWidth className="mt-2">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
