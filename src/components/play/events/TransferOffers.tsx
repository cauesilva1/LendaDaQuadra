"use client";

import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

export function TransferOffers() {
  const { state, draftEligible, faEligible, euroEligible } = useGameState();
  const {
    acceptOffer,
    stayClub,
    declareNbaDraft,
    tr,
  } = useGameActions();
  const offers = state.career?.offers ?? [];
  const euroOffers = offers.filter((o) => o.path === "euro");
  const nbaOffers = offers.filter((o) => o.path === "nba_fa");
  const domestic = offers.filter((o) => o.path === "domestic" || !o.path);

  return (
    <div className="flex w-full flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-xl uppercase text-white">
            {tr("dash.transfers")}
          </h3>
          <p className="font-sans text-xs text-white/45">{tr("dash.pathHint")}</p>
        </div>
        <Button variant="outline" onClick={stayClub}>
          {tr("cta.stay")}
        </Button>
      </div>

      <div className="space-y-3">
        {/* Path A — NBA Draft */}
        {draftEligible && (
          <div className="rounded-xl border border-arena-accent/50 bg-arena-accent/10 p-4">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-arena-accent">
              {tr("path.nba.eyebrow")}
            </p>
            <h4 className="mt-1 font-display text-2xl uppercase text-white">
              {tr("cta.declareDraft")}
            </h4>
            <p className="mt-1 font-sans text-xs text-white/50">
              {tr("path.nba.body")}
            </p>
            <Button className="mt-3" onClick={declareNbaDraft}>
              {tr("cta.declareDraft")}
            </Button>
          </div>
        )}

        {/* Path B — EuroLeague */}
        {(euroEligible || euroOffers.length > 0) && (
          <div className="space-y-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/40">
              {tr("path.euro.eyebrow")}
            </p>
            {euroOffers.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-arena-panel p-4 font-sans text-sm text-white/45">
                {tr("path.euro.wait")}
              </p>
            ) : (
              euroOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  badge={tr("path.euro.badge")}
                  accent
                  title={offer.clubName}
                  meta={`${tr(`league.${offer.leagueId}`)} · ${tr("dash.offerYears", { n: offer.years })}`}
                  salary={formatMoney(offer.annualSalary, offer.currency)}
                  salaryLabel={tr("dash.salary")}
                  tierLabel={tr(`salary.${offer.salaryTier ?? "mid"}`)}
                  cta={tr("cta.acceptEuro")}
                  onAccept={() => acceptOffer(offer.id)}
                />
              ))
            )}
          </div>
        )}

        {/* NBA FA */}
        {nbaOffers.length > 0 && (
          <div className="space-y-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-brand-yellow">
              {tr("path.fa.eyebrow")}
            </p>
            {faEligible && (
              <p className="font-sans text-xs text-brand-yellow">
                {tr("dash.eligibleFa")}
              </p>
            )}
            {nbaOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                badge="NBA"
                accent
                title={offer.clubName}
                meta={`${tr(`league.${offer.leagueId}`)} · ${tr("dash.offerYears", { n: offer.years })}`}
                salary={formatMoney(offer.annualSalary, offer.currency)}
                salaryLabel={tr("dash.salary")}
                tierLabel={tr(`salary.${offer.salaryTier ?? "mid"}`)}
                cta={tr("cta.acceptOffer")}
                onAccept={() => acceptOffer(offer.id)}
              />
            ))}
          </div>
        )}

        {/* Domestic */}
        {domestic.length > 0 && (
          <div className="space-y-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/40">
              {tr("path.domestic.eyebrow")}
            </p>
            {domestic.map((offer) => (
              <OfferCard
                key={offer.id}
                title={offer.clubName}
                meta={`${tr(`league.${offer.leagueId}`)} · ${tr("dash.offerYears", { n: offer.years })}`}
                salary={formatMoney(offer.annualSalary, offer.currency)}
                salaryLabel={tr("dash.salary")}
                tierLabel={tr(`salary.${offer.salaryTier ?? "mid"}`)}
                cta={tr("cta.acceptOffer")}
                onAccept={() => acceptOffer(offer.id)}
              />
            ))}
          </div>
        )}

        {offers.length === 0 && !draftEligible && (
          <p className="rounded-xl border border-white/10 bg-arena-panel p-6 font-sans text-sm text-white/50">
            {tr("dash.noOffers")}
          </p>
        )}
      </div>
    </div>
  );
}

function OfferCard({
  badge,
  accent,
  title,
  meta,
  salary,
  salaryLabel,
  tierLabel,
  cta,
  onAccept,
}: {
  badge?: string;
  accent?: boolean;
  title: string;
  meta: string;
  salary: string;
  salaryLabel: string;
  tierLabel?: string;
  cta: string;
  onAccept: () => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-arena-panel p-4 ${
        accent
          ? "border-arena-accent/40 shadow-[0_0_16px_rgba(255,122,0,0.08)]"
          : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            {badge && (
              <span className="inline-block rounded bg-arena-accent px-2 py-0.5 font-sans text-[10px] font-medium uppercase text-black">
                {badge}
              </span>
            )}
            {tierLabel && (
              <span className="inline-block rounded border border-white/15 px-2 py-0.5 font-sans text-[10px] font-medium uppercase text-white/50">
                {tierLabel}
              </span>
            )}
          </div>
          <h4 className="font-display text-2xl uppercase text-white">{title}</h4>
          <p className="font-sans text-xs text-white/45">{meta}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-arena-accent">{salary}</p>
          <p className="font-sans text-[10px] uppercase text-white/40">
            {salaryLabel}
          </p>
        </div>
      </div>
      <Button className="mt-4" onClick={onAccept}>
        {cta}
      </Button>
    </div>
  );
}
