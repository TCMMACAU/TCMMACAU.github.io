// Homepage comic rotation guards. Run: node --test scripts/comics.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = fileURLToPath(new URL("..", import.meta.url));
const jiti = createJiti(import.meta.url, { alias: { "@": `${root}src` }, jsx: true });
const {
  COMICS,
  COMIC_THEME_ORDER,
  currentComic,
  nextComicTheme,
  publishedComics,
} = await jiti.import(`${root}src/lib/comics.ts`);
const read = (p) => readFileSync(`${root}${p}`, "utf8");

test("catalog only has finalized live-or-dated entries, never 夜唔趕人", () => {
  assert.ok(COMICS.length >= 1);
  const ids = COMICS.map((c) => c.id);
  assert.equal(ids.includes("night-no-rush"), false);
  assert.equal(ids.includes("ye-m-gan-yan"), false);
  const blob = JSON.stringify(COMICS);
  assert.equal(blob.includes("夜唔趕人"), false);
  for (const c of COMICS) {
    for (const lang of ["yue", "cmn", "en"]) {
      assert.ok(c.title[lang]);
      assert.ok(c.alt[lang]);
    }
  }
});

test("currentComic on 2026-11-27 is the live 安寐 comic", () => {
  const cur = currentComic(COMICS, "2026-11-27");
  assert.equal(cur.theme, "anmei");
  assert.equal(cur.id, "breath-for-sleep");
  assert.match(cur.image, /breath-for-sleep/);
});

test("publishedComics hides entries dated after the given day", () => {
  const before = publishedComics(COMICS, "2026-11-20").map((c) => c.id);
  assert.equal(before.includes("breath-for-sleep"), false);
  assert.equal(before[0], "fangxia-let-go");
  const onDay = publishedComics(COMICS, "2026-11-21").map((c) => c.id);
  assert.equal(onDay[0], "breath-for-sleep");
  assert.deepEqual(onDay, [
    "breath-for-sleep",
    "fangxia-let-go",
    "cloud-no-rush",
    "office-kids-loosen-up",
  ]);
});

test("theme rotation is 安神 → 解鬱 → 安寐 → 舒壓", () => {
  assert.deepEqual([...COMIC_THEME_ORDER], ["anshen", "jieyu", "anmei", "yali"]);
  assert.equal(nextComicTheme("yali"), "anshen");
  assert.equal(nextComicTheme("anshen"), "jieyu");
});

test("currentComic picks the newest published entry", () => {
  const fake = [
    {
      id: "a",
      theme: "anshen",
      image: "/a.jpg",
      published: "2026-10-01",
      title: { yue: "a", cmn: "a", en: "a" },
      alt: { yue: "a", cmn: "a", en: "a" },
    },
    {
      id: "b",
      theme: "jieyu",
      image: "/b.jpg",
      published: "2026-10-18",
      title: { yue: "b", cmn: "b", en: "b" },
      alt: { yue: "b", cmn: "b", en: "b" },
    },
  ];
  assert.equal(currentComic(fake).id, "b");
});

test("yali room no longer embeds the comic section", () => {
  const src = read("src/routes/yali.tsx");
  assert.equal(src.includes('id="comic"'), false);
  assert.equal(src.includes("office-kids-loosen-up"), false);
  assert.equal(/["']comic["']/.test(src), false);
});

test("homepage mounts HomeComic and links to the archive", () => {
  assert.match(read("src/routes/index.tsx"), /HomeComic/);
  const home = read("src/components/home-comic.tsx");
  assert.match(home, /逢周六更新|Updates every Saturday/);
  assert.match(home, /睇過往四格/);
  assert.match(home, /to="\/comics"/);
});

test("archive route lists published comics and does not mention 夜唔趕人", () => {
  const src = read("src/routes/comics.tsx");
  assert.match(src, /createFileRoute\("\/comics"\)/);
  assert.match(src, /publishedComics/);
  assert.equal(src.includes("夜唔趕人"), false);
  assert.equal(src.includes("night-no-rush"), false);
});
