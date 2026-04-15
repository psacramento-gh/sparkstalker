import { Eye } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-background p-4">
      <Card className="flex w-full max-w-lg min-h-[calc(100dvh-2rem)] flex-col gap-0 shadow-sm">
        <CardHeader className="border-border border-b">
          <CardTitle className="text-lg tracking-tight">
            <span className="inline-flex items-center gap-2">
              <Eye className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              SparkStalker
            </span>
          </CardTitle>
          <CardAction>
            <ThemeToggle />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col pt-4">
          <main className="flex flex-1 flex-col gap-6">{children}</main>
        </CardContent>
      </Card>
    </div>
  );
}
