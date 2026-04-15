import { Eye } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const footerLinkClass =
  "font-medium text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground";

export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-background p-4">
      <Card className="flex w-full max-w-lg min-h-[calc(100dvh-2rem)] flex-col gap-0 shadow-sm">
        <CardHeader className="items-center border-border border-b">
          <CardTitle className="flex min-h-8 items-center gap-2 text-lg leading-none tracking-tight">
            <Eye className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            SparkStalker
          </CardTitle>
          <CardAction className="self-center">
            <ThemeToggle />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col pt-4">
          <main className="flex flex-1 flex-col gap-6">{children}</main>
        </CardContent>
        <div className="border-border border-t px-4 pt-3 pb-1">
          <Alert
            className="gap-2 border-amber-500/35 bg-amber-500/[0.06] px-4 py-3 text-foreground dark:bg-amber-500/10"
            role="note"
          >
            <AlertTitle className="text-foreground">Before You Use Tether Wallet</AlertTitle>
            <AlertDescription className="text-pretty text-foreground/85">
              <ul className="list-outside list-disc space-y-2 pl-5 marker:text-amber-600 dark:marker:text-amber-500">
                <li>Lightning users expect privacy.</li>
                <li>
                  Tether Wallet uses Spark to route Lightning payments, which leave public traces.
                </li>
                <li>This tool shows that exposure.</li>
                <li>Tell Tether this limitation should not be hidden from users.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        <CardFooter
          role="contentinfo"
          className="flex flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-1"
        >
          <p className="leading-relaxed">
            Built by{" "}
            <a
              href="https://www.psacramento.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClass}
            >
              pSacramento
            </a>
          </p>
          <span className="hidden text-muted-foreground/60 sm:inline" aria-hidden>
            ·
          </span>
          <a
            href="https://x.com/psacramento_x"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            X profile
          </a>
          <span className="hidden text-muted-foreground/60 sm:inline" aria-hidden>
            ·
          </span>
          <a
            href="https://github.com/psacramento-gh/sparkstalker"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            GitHub
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
