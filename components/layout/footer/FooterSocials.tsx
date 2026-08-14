import Link from "next/link";

import {
  ExternalLink,
  Globe,
  MessageCircle,
  Music2,
} from "lucide-react";

interface SocialLinks {
  facebook?: string;
  facebookGroup?: string;
  discord?: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  website?: string;
}

interface FooterSocialsProps {
  socials: SocialLinks;
}

export default function FooterSocials({
  socials,
}: Readonly<FooterSocialsProps>) {
  const socialItems = [
    {
      label: "Facebook",
      href: socials.facebook,
      icon: ExternalLink,
    },
    {
      label: "Facebook Group",
      href: socials.facebookGroup,
      icon: ExternalLink,
    },
    {
      label: "YouTube",
      href: socials.youtube,
      icon: ExternalLink,
    },
    {
      label: "TikTok",
      href: socials.tiktok,
      icon: Music2,
    },
    {
      label: "Discord",
      href: socials.discord,
      icon: MessageCircle,
    },
    {
      label: "Website",
      href: socials.website,
      icon: Globe,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="flex items-center gap-3">
      {socialItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition-all duration-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </div>
  );
}