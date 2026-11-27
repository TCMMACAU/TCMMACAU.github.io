import { createFileRoute, Link } from "@tanstack/react-router";
import { useCopy, useLang } from "@/i18n/lang";
import {
  COMIC_THEME_ROOM,
  comicText,
  currentComic,
  formatComicDate,
  publishedComics,
  type ComicEntry,
  type ComicTheme,
} from "@/lib/comics";

export const Route = createFileRoute("/comics")({
  component: ComicsArchivePage,
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === "string" && search.id ? search.id : undefined,
  }),
  head: () => ({
    meta: [{ title: "過往四格 · 身心課堂" }],
  }),
});

const UI = {
  yue: {
    back: "← 返過往四格",
    kicker: "四格漫畫 · 阿力同豆豆",
    title: "過往四格",
    lede: "已經上線嘅四格，由新到舊排列。撳入去就可以睇完整幅。",
    empty: "暫時未有已上線嘅四格。",
    current: "本期",
    roomGo: (room: string) => `去${room} →`,
  },
  cmn: {
    back: "← 返回過往四格",
    kicker: "四格漫畫 · 阿力與豆豆",
    title: "過往四格",
    lede: "已經上線的四格，由新到舊排列。點進去就可以看完整幅。",
    empty: "暫時還沒有已上線的四格。",
    current: "本期",
    roomGo: (room: string) => `去${room} →`,
  },
  en: {
    back: "← Back to past comics",
    kicker: "Four-panel comics · Alex & Dodo",
    title: "Past comics",
    lede: "Published comics, newest first. Open one to read the full strip.",
    empty: "No published comics yet.",
    current: "This week",
    roomGo: (room: string) => `Go to ${room} →`,
  },
} as const;

function roomName(theme: ComicTheme, home: ReturnType<typeof useCopy>["home"]) {
  if (theme === "anshen") return home.anshenT;
  if (theme === "jieyu") return home.jieyuT;
  if (theme === "anmei") return home.anmeiT;
  return home.yaliT;
}

function ComicsArchivePage() {
  const { lang } = useLang();
  const copy = useCopy();
  const ui = UI[lang];
  const list = publishedComics();
  const current = list[0] ?? null;
  const { id } = Route.useSearch();
  const selected = id ? list.find((c) => c.id === id) : undefined;

  if (selected) {
    return (
      <ComicDetail
        comic={selected}
        isCurrent={!!current && selected.id === current.id}
        ui={ui}
        lang={lang}
        home={copy.home}
        siteBack={copy.ui.back}
      />
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-16 text-ink">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-xs tracking-[0.22em] text-accent no-underline">
          {copy.ui.back}
        </Link>
        <p className="mt-10 text-xs tracking-[0.28em] text-accent">{ui.kicker}</p>
        <h1 className="mt-3 font-serif text-5xl">{ui.title}</h1>
        <p className="mt-4 text-muted">{ui.lede}</p>
        {list.length === 0 ? (
          <p className="mt-10 text-muted">{ui.empty}</p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {list.map((c) => (
              <li key={c.id}>
                <Link
                  to="/comics"
                  search={{ id: c.id }}
                  className="relative block rounded-card border border-line bg-paper p-4 text-ink no-underline"
                >
                  {current && c.id === current.id ? (
                    <span className="absolute left-6 top-6 z-10 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs tracking-[0.08em] text-paper">
                      {ui.current}
                    </span>
                  ) : null}
                  <figure className="overflow-hidden rounded-card border border-line bg-paper">
                    <img
                      src={c.image}
                      alt={comicText(c.alt, lang)}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </figure>
                  <h2 className="mt-4 font-serif text-2xl">{comicText(c.title, lang)}</h2>
                  <p className="mt-1 text-sm text-muted">{formatComicDate(c.published)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function ComicDetail({
  comic,
  isCurrent,
  ui,
  lang,
  home,
  siteBack,
}: {
  comic: ComicEntry;
  isCurrent: boolean;
  ui: (typeof UI)[keyof typeof UI];
  lang: "yue" | "cmn" | "en";
  home: ReturnType<typeof useCopy>["home"];
  siteBack: string;
}) {
  const theme = roomName(comic.theme, home);
  return (
    <main className="min-h-screen bg-bg px-6 py-16 text-ink">
      <div className="mx-auto max-w-3xl">
        <p className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.22em]">
          <Link to="/comics" search={{ id: undefined }} className="text-accent no-underline">
            {ui.back}
          </Link>
          <Link to="/" className="text-accent no-underline">
            {siteBack}
          </Link>
        </p>
        {isCurrent ? (
          <p className="mt-10 inline-flex items-center rounded-full border border-line bg-paper px-4 py-1.5 text-xs tracking-[0.14em] text-accent">
            {ui.current}
          </p>
        ) : (
          <p className="mt-10 text-xs tracking-[0.28em] text-accent">{ui.kicker}</p>
        )}
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{comicText(comic.title, lang)}</h1>
        <p className="mt-3 text-sm text-muted">{formatComicDate(comic.published)}</p>
        <figure className="mt-6 overflow-hidden rounded-card border border-line bg-paper">
          <img
            src={comic.image}
            alt={comicText(comic.alt, lang)}
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>
        <p className="mt-5">
          <Link
            to={COMIC_THEME_ROOM[comic.theme]}
            className="text-sm text-accent no-underline"
          >
            {ui.roomGo(theme)}
          </Link>
        </p>
      </div>
    </main>
  );
}
