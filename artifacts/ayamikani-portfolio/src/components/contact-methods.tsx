"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  AtSign,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import type { SocialLink } from "@/lib/supabase/types";

type Props = {
  email: string;
  location: string;
  timezone: string;
  socialLinks: SocialLink[];
};

function platformIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "linkedin":
      return <Linkedin size={18} aria-hidden="true" />;
    case "instagram":
      return <Instagram size={18} aria-hidden="true" />;
    case "facebook":
      return <Facebook size={18} aria-hidden="true" />;
    case "x":
    case "twitter":
      return <span className="contact-x-mark" aria-hidden="true">X</span>;
    default:
      return <AtSign size={18} aria-hidden="true" />;
  }
}

function localTime(timezone: string, now: Date) {
  try {
    const time = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
    const offset =
      new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? timezone;
    return `${time} (${offset})`;
  } catch {
    return timezone;
  }
}

export default function ContactMethods({
  email,
  location,
  timezone,
  socialLinks,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="contact-methods" aria-label="Ways to contact Ayamikani">
      {location && (
        <div className="contact-method">
          <MapPin size={18} aria-hidden="true" />
          <div>
            <span>Based in</span>
            <strong>{location}</strong>
          </div>
        </div>
      )}
      {timezone && (
        <div className="contact-method">
          <Clock3 size={18} aria-hidden="true" />
          <div>
            <span>Local time</span>
            <strong>{now ? localTime(timezone, now) : timezone}</strong>
          </div>
        </div>
      )}
      {email && (
        <a className="contact-method" href={`mailto:${email}`}>
          <Mail size={18} aria-hidden="true" />
          <div>
            <span>Email</span>
            <strong>{email}</strong>
          </div>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
      {socialLinks.map((link) => (
        <a
          className="contact-method"
          href={link.url}
          key={link.id}
          target="_blank"
          rel="noreferrer"
        >
          {platformIcon(link.icon_name || link.label)}
          <div>
            <span>{link.label}</span>
            <strong>{link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</strong>
          </div>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}
