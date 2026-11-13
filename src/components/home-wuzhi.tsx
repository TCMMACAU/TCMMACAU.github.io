import { useCopy } from "@/i18n/lang";

/** Homepage 五志 map: after the 身心 explanation, before the four rooms. */
export function HomeWuzhi() {
  const { home } = useCopy();
  return (
    <section id="wuzhi" className="px-6 pb-16 md:px-12" style={{ lineBreak: "strict" }}>
      <p className="text-xs tracking-[0.22em] text-accent">{home.wuzhiK}</p>
      <h2 className="mt-2 font-serif text-3xl md:text-4xl">{home.wuzhiT}</h2>
      <p className="mt-4 text-ink">{home.wuzhiP1}</p>
      <p className="mt-3 text-ink">{home.wuzhiP2}</p>
      <p className="mt-3 text-muted">{home.wuzhiNote}</p>
      <ul className="mt-8 grid gap-4">
        {home.wuzhiItems.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-card border border-line bg-paper p-4 sm:gap-5 sm:p-5"
          >
            <img
              src={item.img}
              alt={item.alt}
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-28 w-28 shrink-0 rounded-card object-cover sm:h-36 sm:w-36"
            />
            <div className="min-w-0">
              <h3 className="font-serif text-2xl text-accent">{item.title}</h3>
              <p className="mt-2 text-sm text-ink">{item.lead}</p>
              <p className="mt-2 text-sm text-muted">{item.seen}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-ink">{home.wuzhiClose}</p>
    </section>
  );
}
