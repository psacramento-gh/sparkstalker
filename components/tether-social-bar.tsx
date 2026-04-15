import { Headset } from "lucide-react";
import { cn } from "@/lib/utils";

const linkBase =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.375a4.125 4.125 0 1 1 0 8.25 4.125 4.125 0 0 1 0-8.25zm0 1.5a2.625 2.625 0 1 0 0 5.25 2.625 2.625 0 0 0 0-5.25zm5.25-2.625a.937.937 0 1 1-1.875 0 .937.937 0 0 1 1.875 0z"
      />
    </svg>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function IconReddit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.233.555-.83.872-1.823.872-2.871 0-1.09-.377-2.09-1-2.887zm-6.666 11.16c-1.369 0-2.5-.887-2.5-1.979s1.131-1.979 2.5-1.979 2.5.887 2.5 1.979-1.131 1.979-2.5 1.979zm6.666-9.073c-1.346 0-2.5-.67-2.5-1.448s1.154-1.448 2.5-1.448 2.5.67 2.5 1.448-1.154 1.448-2.5 1.448z"
      />
    </svg>
  );
}

const items = [
  { href: "https://x.com/tether/", label: "Tether on X", Icon: IconX },
  { href: "https://www.instagram.com/_tether_/", label: "Tether on Instagram", Icon: IconInstagram },
  { href: "https://t.me/tether", label: "Tether on Telegram", Icon: IconTelegram },
  { href: "https://www.linkedin.com/company/tether", label: "Tether on LinkedIn", Icon: IconLinkedIn },
  { href: "https://www.facebook.com/tether.to", label: "Tether on Facebook", Icon: IconFacebook },
  { href: "https://www.reddit.com/r/Tether/", label: "Tether on Reddit", Icon: IconReddit },
  { href: "https://cs.tether.to/BR", label: "Tether customer support (Brazil)", Icon: Headset },
] as const;

export function TetherSocialBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border border-t px-4 py-4 text-center",
        className,
      )}
    >
      <h2 className="mb-3 text-sm font-medium leading-snug text-foreground">
        Reach out to Tether and make your voice be heard
      </h2>
      <nav aria-label="Tether social media and support">
        <ul className="flex flex-nowrap items-center justify-center gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(({ href, label, Icon }) => (
            <li key={href} className="shrink-0">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBase}
                aria-label={label}
              >
                <Icon className="size-5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
