import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from '../router';
import { SEVERITY_LABEL } from '../context';
import { Icon, Skeleton } from '../ui';

function FilingCard({ f }) {
  const worst = f.flags.filter((x) => x.severity === 'high' || x.severity === 'medium');
  const pct = f.counts.facts ? Math.round((100 * f.counts.verified) / f.counts.facts) : 0;
  return (
    <Link to={`/ipo/${encodeURIComponent(f.id)}`} className="card filing-card">
      <span className="kicker">{f.meta.doc_type} · {f.meta.pages} pages</span>
      <h3 className="h3">{f.company}</h3>
      <p className="headline">{f.headline || 'Nothing tripped the checks.'}</p>
      <div className="row" style={{ gap: 6 }}>
        {worst.slice(0, 3).map((x) => <span key={x.id} className={`sev ${x.severity}`}>{x.label}</span>)}
        {worst.length === 0 && <span className="sev ok">{SEVERITY_LABEL.ok}</span>}
      </div>
      <div className="foot-line">
        <span className="row muted" style={{ gap: 8, fontSize: 12.5 }}>
          <span className="meter" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
          {f.counts.verified}/{f.counts.facts} quotes verified
        </span>
        <span className="go">Read <Icon name="arrow" size={13} /></span>
      </div>
    </Link>
  );
}

// Running totals across every filing read so far.
function Ledger({ filings }) {
  if (!filings?.length) return null;
  const sum = (fn) => filings.reduce((n, f) => n + (fn(f) || 0), 0);
  const pages = sum((f) => f.meta.pages);
  const facts = sum((f) => f.counts.facts);
  const verified = sum((f) => f.counts.verified);
  const flagged = filings.filter((f) => f.flags.some((x) => x.severity === 'high' || x.severity === 'medium')).length;
  return (
    <div className="ledger rise d2" aria-label="Totals so far">
      <div><b>{filings.length}</b><span>filings read cover to cover</span></div>
      <div><b>{pages.toLocaleString('en-IN')}</b><span>pages, every one of them</span></div>
      <div className="g"><b>{facts ? ((100 * verified) / facts).toFixed(1) : 0}<small>%</small></b><span>of {facts} quotes found word for word</span></div>
      <div className="r"><b>{flagged}</b><span>with something worth a closer look</span></div>
    </div>
  );
}

const RANK = { high: 0, medium: 1, info: 2, ok: 3 };

// The hero shows a real result instead of a slogan-only page: the filing with the strongest flags.
function Featured({ filings }) {
  if (!filings?.length) return null;
  const score = (f) => Math.min(...f.flags.map((x) => RANK[x.severity]), 9);
  const f = [...filings].sort((a, b) => score(a) - score(b))[0];
  const flags = f.flags.filter((x) => x.severity !== 'ok').slice(0, 3);
  return (
    <Link to={`/ipo/${encodeURIComponent(f.id)}`} className="card featured rise d1" aria-label={`Read ${f.company}`}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="kicker">Strongest read · {f.meta.doc_type}, {f.meta.pages} pages</span>
        <span className="mono" style={{ color: 'var(--blue)' }}>Open →</span>
      </div>
      <h2 className="h2" style={{ fontSize: 28 }}>{f.company}</h2>
      {f.headline && <p className="featured-line">{f.headline}</p>}
      <div className="featured-flags">
        {flags.map((x) => (
          <div key={x.id} className={`mini-flag ${x.severity}`}>
            <span className="kicker">{x.label}</span>
            <strong>{x.value}</strong>
          </div>
        ))}
      </div>
      <div className="foot-line">
        <span>{f.counts.verified} of {f.counts.facts} quotes checked word for word against the PDF</span>
        <span className="meter" aria-hidden="true"><i style={{ width: `${f.counts.facts ? (100 * f.counts.verified) / f.counts.facts : 0}%` }} /></span>
      </div>
    </Link>
  );
}

export default function Home({ health }) {
  const [filings, setFilings] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    document.title = 'Footnote · What IPOs bury in the fine print';
    api('/api/filings').then(setFilings).catch((e) => setError(e.message));
  }, []);

  return (
    <main className="wrap page">
      <section className="hero">
        <div className="stack rise" style={{ gap: 22 }}>
          <span className="eyebrow">Indian IPO filings, read cover to cover</span>
          <h1 className="h1">What IPOs bury<br />in the <span>fine print.</span></h1>
          <p className="lede" style={{ maxWidth: '34ch' }}>
            Footnote maps who is connected to a company going public and <em>where the money goes</em>, with the page to prove every line.
          </p>
          <div className="row" style={{ gap: 12 }}>
            <a className="btn" href="#filings">See the filings <Icon name="arrow" /></a>
            {health?.uploads && <Link className="btn ghost" to="/add"><Icon name="upload" />Add a filing</Link>}
            <Link className="btn ghost" to="/method">How it checks</Link>
          </div>
        </div>
        <Featured filings={filings} />
      </section>

      <Ledger filings={filings} />

      <section className="how" aria-label="How Footnote works">
        {[
          ['Reads the whole filing', 'Finds the sections that matter from the filing\'s own contents: promoters, management, group companies, related-party transactions, cases and use of proceeds.'],
          ['Maps the connections', 'People are matched by DIN, companies by CIN, and bankers by SEBI registration, so the same name links across every IPO it touches.'],
          ['Proves every line', 'Each fact keeps a quote checked word for word against the PDF. Click any page number to open the filing with the line highlighted.'],
        ].map(([t, d], i) => (
          <div key={t}>
            <span className="n">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </section>

      <section id="filings" className="stack" aria-labelledby="filings-h" style={{ scrollMarginTop: 90 }}>
        <div className="sec-head">
          <h2 id="filings-h" className="h2">Filings</h2>
          {filings && <span className="note">{filings.length} read so far · sorted as added</span>}
        </div>
        {error && <div className="notice">Could not reach the server: {error}</div>}
        {!filings && !error && <div className="grid-cards">{[0, 1, 2].map((i) => <Skeleton key={i} h={190} />)}</div>}
        {filings?.length === 0 && (
          <div className="card card-body stack" style={{ alignItems: 'flex-start' }}>
            <h3 className="h3">No filings yet</h3>
            <p style={{ margin: 0 }} className="muted">Add a DRHP, RHP or prospectus PDF and Footnote will read it in a couple of minutes.</p>
            {health?.uploads && <Link className="btn" to="/add"><Icon name="upload" />Add the first filing</Link>}
          </div>
        )}
        {filings?.length > 0 && <div className="grid-cards">{filings.map((f) => <FilingCard key={f.id} f={f} />)}</div>}
      </section>
    </main>
  );
}
