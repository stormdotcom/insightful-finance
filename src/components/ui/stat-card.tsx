import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconClassName }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-3 sm:p-5 hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground",
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
          iconClassName || "bg-primary/10 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
