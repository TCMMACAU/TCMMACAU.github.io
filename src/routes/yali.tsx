import { createFileRoute, Link } from "@tanstack/react-router";
import { CardGrid, ClinicLayout, RoomBookingStrip, Section } from "@/components/clinic-layout";
import {
  BodySignals,
  ColourHunt,
  FriendFlip,
  HandoverChecklist,
  MicroDraw,
  PressurePark,
  ShoulderDrop,
  SlowTrace,
  StandReset,
  TensionMap,
} from "@/components/yali-tools";
import { RoomMusicSection } from "@/components/room-music";
import { FollowLessons } from "@/components/follow-lessons";
import { BreathFirst, PlayBlock } from "@/components/play-block";
import { PointMap } from "@/components/point-map";
import { useCopy, useLang } from "@/i18n/lang";
import { MUSIC_UI } from "@/lib/room-music";
import type { ReactNode } from "react";

export const Route = createFileRoute("/yali")({ component: YaliPage });

/**
 * 舒壓 · layout-visible-a draft:
 * four chapter sticky nav · room TOC · play tools featured/more · peek folds · room booking strip.
 * Do not merge to main until clinician review.
 */
const ORDER = ["breath", "follow", "learn", "care"] as const;

function RoomToc() {
  const c = useCopy().yali;
  return (
    <section id="room-toc" className="border-t border-line py-10">
      <p className="mb-2 text-xs tracking-[0.22em] text-accent">{c.tocK}</p>
      <h2 className="mb-2 font-serif text-2xl">{c.tocT}</h2>
      <p className="text-sm text-muted">{c.tocLead}</p>
      <ul className="mt-4 space-y-2 rounded-card border border-line bg-paper px-5 py-4 text-sm text-muted">
        {c.toc.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="text-ink no-underline hover:text-accent">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlayToolMore({
  title,
  lead,
  openLabel,
  children,
}: {
  title: string;
  lead: string;
  openLabel: string;
  children: ReactNode;
}) {
  return (
    <details className="play-shelf-more rounded-card border border-line bg-paper px-4 py-3">
      <summary className="cursor-pointer list-none">
        <p className="font-serif text-lg text-ink">{title}</p>
        <p className="mt-1 text-sm text-muted">
          {lead}{" "}
          <span className="play-open tracking-[0.04em]">{openLabel}</span>
        </p>
      </summary>
      <div className="mt-4 border-t border-line pt-4">{children}</div>
    </details>
  );
}

function PlayToolsShelf() {
  const c = useCopy().yali;
  return (
    <>
      <div className="mt-6 grid gap-10">
        <StandReset />
        <FriendFlip />
        <SlowTrace />
      </div>
      <p className="mt-8 text-xs tracking-[0.18em] text-accent">{c.playMoreK}</p>
      <div className="mt-3 grid gap-3">
        <PlayToolMore title={c.micro.title} lead={c.micro.lead} openLabel={c.playOpen}>
          <MicroDraw />
        </PlayToolMore>
        <PlayToolMore title={c.handover.title} lead={c.handover.lead} openLabel={c.playOpen}>
          <HandoverChecklist />
        </PlayToolMore>
        <PlayToolMore title={c.bodymap.title} lead={c.bodymap.lead} openLabel={c.playOpen}>
          <TensionMap />
        </PlayToolMore>
        <PlayToolMore title={c.hunt.title} lead={c.hunt.lead} openLabel={c.playOpen}>
          <ColourHunt />
        </PlayToolMore>
      </div>
    </>
  );
}

function YaliPage() {
  const copy = useCopy();
  const { lang } = useLang();
  const c = copy.yali;
  const mui = MUSIC_UI[lang];
  return (
    <ClinicLayout
      theme="yali"
      title={c.title}
      kicker={c.kicker}
      lede={c.lede}
      pathHint={c.pathHint}
      chapterNav
      bgSrc="/bg-yali.jpg?v=1"
      nav={c.nav}
      order={ORDER}
      footerName={c.footerName}
      footerNote={c.footerNote}
    >
      <BreathFirst room="yali" />
      <RoomToc />
      <FollowLessons room="yali" />

      <Section id="feel" fav="yali#feel" kicker={c.feelK} title={c.feelT}>
        <p className="text-muted">{c.feelLead}</p>
        <BodySignals />
      </Section>

      <Section id="shoulder" fav="yali#shoulder" kicker={c.shoulderK} title={c.shoulderT}>
        <p className="text-muted">{c.shoulderLead}</p>
        <p className="mt-2 text-sm text-muted">{c.shoulderPrep}</p>
        <ShoulderDrop />
      </Section>

      <Section id="park" fav="yali#park" kicker={c.parkK} title={c.parkT}>
        <p>{c.parkLead}</p>
        <PressurePark />
        <p className="mt-4 text-sm text-muted">{c.parkNote}</p>
      </Section>

      <Section id="playtools" kicker={c.play2K} title={c.play2T}>
        <p className="text-muted">{c.play2Lead}</p>
        <PlayToolsShelf />
      </Section>

      <section id="learn" className="border-t border-line py-12">
        <p className="mb-2 text-xs tracking-[0.22em] text-accent">{c.learnK}</p>
        <h2 className="font-serif text-3xl">{c.learnT}</h2>
        <p className="mt-3 text-muted">{c.learnLead}</p>
        <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
          <li>
            <a href="#daily" className="text-ink no-underline">
              {c.dailyT}
            </a>
          </li>
          <li>
            <a href="#acu" className="text-ink no-underline">
              {c.acuT}
            </a>
          </li>
          <li>
            <a href="#view" className="text-ink no-underline">
              {c.viewT}
            </a>
          </li>
          <li>
            <a href="#music" className="text-ink no-underline">
              {mui.sectionT}
            </a>
          </li>
          <li>
            <a href="#play" className="text-ink no-underline">
              {copy.play.title}
            </a>
          </li>
        </ul>
      </section>

      <Section
        id="daily"
        kicker={c.dailyK}
        title={c.dailyT}
        collapsible
        peek={<p>{c.dailyPeek}</p>}
        safety={<p>{c.dailyLead}</p>}
      >
        <CardGrid items={c.daily} />
      </Section>

      <Section id="acu" kicker={c.acuK} title={c.acuT}>
        <p className="text-muted">{c.acuLead}</p>
        <PointMap room="yali" />
        <p className="mt-5 text-sm text-muted">{c.acuNote}</p>
      </Section>

      <PlayBlock room="yali" />

      <Section id="music" kicker={mui.sectionK} title={mui.sectionT}>
        <p className="text-muted">{mui.lead}</p>
        <RoomMusicSection />
      </Section>

      <Section id="view" kicker={c.viewK} title={c.viewT} collapsible peek={<p>{c.viewPeek}</p>}>
        <p>{c.viewP1}</p>
        <p className="mt-3 text-muted">{c.viewP2}</p>
      </Section>

      {/* Safety: always visible, never folded */}
      <Section id="care" kicker={c.careK} title={c.careT}>
        <p>{c.careLead}</p>
        <div className="mt-6 rounded-card border-2 border-accent bg-paper p-5">
          <h3 className="font-serif text-xl">{c.careNowT}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {c.careNow.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-card border border-line bg-paper p-5">
          <h3 className="font-serif text-xl">{c.careSoonT}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {c.careSoon.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <p className="mt-5 text-ink">{c.careCrisis}</p>
        <p className="mt-3 text-sm text-muted">{c.careMeds}</p>
        <Link
          to="/"
          hash="booking"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm text-paper no-underline"
        >
          {c.careBook}
        </Link>
        <RoomBookingStrip title={c.roomBookT} lead={c.roomBookLead} cta={c.roomBookCta} />
      </Section>
    </ClinicLayout>
  );
}
