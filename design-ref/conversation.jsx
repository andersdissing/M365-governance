// Conversation — Megan, Anders and Lars in one chat; the product asks the people who shared.
const MOTION = {
  enter: (T, s, e) => Easing.easeOutCubic(clamp((T - s) / (e - s), 0, 1)),
  draw: (T, s, e) => Easing.easeInOutCubic(clamp((T - s) / (e - s), 0, 1)),
  pop: (T, s, e) => Easing.easeOutBack(clamp((T - s) / (e - s), 0, 1)),
};
const Q = {
  ink: 'var(--color-text)', paper: 'var(--color-bg)', muted: 'var(--color-neutral-700)', div: 'var(--color-divider)',
  n100: 'var(--color-neutral-100)', n300: 'var(--color-neutral-300)', n600: 'var(--color-neutral-600)',
  a100: 'var(--color-accent-100)', a200: 'var(--color-accent-200)', a300: 'var(--color-accent-300)', a400: 'var(--color-accent-400)',
  a600: 'var(--color-accent-600)', a700: 'var(--color-accent-700)', a800: 'var(--color-accent-800)', a900: 'var(--color-accent-900)',
  head: 'var(--font-heading)', body: 'var(--font-body)',
};
const PEOPLE = {
  megan: { name: 'Megan Bowen', role: 'Project lead', bg: Q.a300, fg: Q.a800 },
  anders: { name: 'Anders Dissing', role: 'Colleague', bg: Q.n300, fg: Q.n600 },
  lars: { name: 'Lars Bisgaard', role: 'Partner · Fabrikam', bg: Q.a100, fg: Q.a700, guest: true },
};

function Person({ who, size = 56, ring }) {
  const p = PEOPLE[who];
  return (
    <span style={{ position: 'relative', width: size, height: size, flex: 'none', borderRadius: '50%', overflow: 'hidden', background: p.bg,
      outline: ring ? '2px solid ' + Q.a600 : 'none', outlineOffset: 3, border: p.guest ? '1.5px dashed ' + Q.a700 : 'none' }}>
      <span style={{ position: 'absolute', left: '32%', top: '18%', width: '36%', height: '36%', borderRadius: '50%', background: p.fg }}></span>
      <span style={{ position: 'absolute', left: '14%', top: '60%', width: '72%', height: '60%', borderRadius: '50%', background: p.fg }}></span>
    </span>
  );
}
function Bot({ size = 44 }) {
  return <span style={{ width: size, height: size, flex: 'none', background: Q.a600, color: Q.paper, display: 'grid', placeItems: 'center', fontFamily: Q.head, fontWeight: 600, fontSize: size * 0.45 }}>G</span>;
}
function Corners() {
  return <React.Fragment><i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></React.Fragment>;
}
function Btn({ children, filled, pressed }) {
  return <span style={{ whiteSpace: 'nowrap', flex: 'none', padding: '10px 18px', fontFamily: Q.head, fontWeight: 600, fontSize: 19, background: filled ? Q.a600 : Q.paper, color: filled ? Q.paper : Q.ink,
    border: '1px solid ' + (filled ? Q.a600 : Q.div), transform: 'scale(' + (1 - (pressed || 0) * 0.06) + ')' }}>{children}</span>;
}

function ConversationPiece() {
  const { T, CUES } = useComposition();
  const I = CUES.Intro, M = CUES.March, G = CUES.Gap, A = CUES.Ask, O = CUES.Offboard, E = CUES.End;

  const clickMegan = A + 6.8, adminTold = O + 0.4, removed = O + 2.6;
  const msgs = [
    { k: 'div', at: M + 0.2, h: 44, text: 'March' },
    { k: 'p', who: 'megan', at: M + 1.0, h: 104, text: 'Lars, I’ve shared the onboarding pack with you.' },
    { k: 'p', who: 'lars', at: M + 3.0, h: 104, text: 'Got it — thanks, Megan!' },
    { k: 'p', who: 'megan', at: M + 5.0, h: 104, text: 'Shout if anything is missing.' },
    { k: 'p', who: 'lars', at: M + 7.0, h: 104, text: 'Perfect. See you on the 9th.' },
    { k: 'sys', at: G + 0.4, h: 44, text: '28 May · Fabrikam onboarding closed' },
    { k: 'div', at: G + 2.6, h: 44, text: 'November' },
    { k: 'bot', to: 'megan', at: A + 0.4, h: 230, q: 'Do you still need Lars Bisgaard to have access?', d: 'He can reach 1 place you shared: Partner onboarding pack.', click: clickMegan, choice: 'no' },
    { k: 'p', who: 'megan', at: A + 2.6, h: 104, text: 'Hi Lars — are you still using the onboarding pack?' },
    { k: 'p', who: 'lars', at: A + 4.8, h: 134, text: 'No, all done on our side since May. Thanks, Megan!' },
    { k: 'sys', at: clickMegan + 0.6, h: 44, text: 'Recorded · Megan Bowen · no longer needed' },
  ];
  const typing = msgs.filter(m => m.k === 'p').find(m => T >= m.at - 1.1 && T < m.at);

  // chat scroll: content grows as messages enter; keep the newest at the bottom
  const VIEW = 650;
  let grown = 0;
  const placed = msgs.map(m => { const p = MOTION.enter(T, m.at, m.at + 0.45); const y = grown; grown += m.h * p; return { ...m, p, y }; });
  const scroll = Math.max(0, grown - VIEW);

  const last = [...msgs].reverse().find(m => m.k === 'p' && T >= m.at);
  const speaking = typing ? typing.who : last && T - last.at < 2.2 ? last.who : null;

  // product panel state
  const invited = T >= M + 1.0, accepted = T >= M + 3.2;
  const meganOut = T >= clickMegan + 0.3, told = T >= adminTold + 0.3, gone = T >= removed + 0.2;
  const nextAsk = gone ? '—' : T >= G + 0.8 ? '2026-11-03' : '—';
  const larsFade = 1 - 0.7 * MOTION.enter(T, removed, removed + 0.8);
  const pPanel = MOTION.enter(T, M + 1.2, M + 1.8);
  const flash = (t) => Math.max(0, 1 - Math.abs(T - t - 0.4) / 0.6);

  const pCast = [0, 1].map(i => MOTION.enter(T, I + 0.5 + i * 0.35, I + 1.1 + i * 0.35));
  const pIntroTitle = MOTION.enter(T, I + 0.2, I + 0.9);
  const pChat = MOTION.enter(T, I + 2.6, I + 3.4);
  const pEnd = MOTION.enter(T, E + 0.4, E + 1.3);
  const pEnd2 = MOTION.enter(T, E + 1.8, E + 2.6);
  const drift = 1 + 0.02 * MOTION.draw(T, I, E);

  return (
    <div data-screen-label={'Conversation ' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: Q.paper, overflow: 'hidden', fontFamily: Q.body, color: Q.ink }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(' + drift + ')', transformOrigin: '50% 50%',
        backgroundImage: 'repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-text) 5%, transparent) 0 1px, transparent 1px 100px), repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-text) 3.5%, transparent) 0 1px, transparent 1px 100px)' }}>

        {/* cast */}
        <div style={{ position: 'absolute', left: 64, top: 64, width: 360, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 16, letterSpacing: '0.14em', color: Q.a700, opacity: pIntroTitle }}>THE PEOPLE</span>
          {['megan', 'lars'].map((w, i) => (
            <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: pCast[i] * (speaking && speaking !== w ? 0.45 : 1) * (w === 'lars' ? larsFade : 1), transform: 'translateX(' + (1 - pCast[i]) * -20 + 'px)' }}>
              <Person who={w} size={64} ring={speaking === w} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <strong style={{ fontSize: 22 }}>{PEOPLE[w].name}</strong>
                <span style={{ fontSize: 16, color: Q.muted }}>{PEOPLE[w].role}{PEOPLE[w].guest ? (gone ? ' · offboarded' : ' · guest') : ''}</span>
              </span>
            </div>
          ))}
        </div>

        {/* narrator */}
        <div style={{ position: 'absolute', left: 64, top: 470, width: 360 }}>
          <Captions
            items={[
              { at: I + 0.4, text: 'Two people. One shared folder.' },
              { at: M + 0.4, text: 'March. A project starts.' },
              { at: G + 0.3, text: 'The project ends. The access stays. Nobody asks.' },
              { at: A + 0.3, text: 'November. The person who shared is asked.' },
              { at: O + 0.3, text: 'Nobody else is answerable for him. IT is told.' },
              { at: removed + 0.3, text: 'Lars is offboarded — on record.', until: E + 0.4 },
            ]}
            style={{ position: 'static', left: 'auto', right: 'auto', bottom: 'auto', textAlign: 'left', color: Q.ink, textShadow: 'none', font: '600 44px var(--font-heading)', lineHeight: 1.06 }}
          />
        </div>

        {/* chat */}
        <div className="blueprint" style={{ position: 'absolute', left: 470, top: 60, width: 680, height: 780, background: '#fff', boxShadow: 'var(--shadow-md)', opacity: pChat, transform: 'translateY(' + (1 - pChat) * 24 + 'px)' }}>
          <Corners />
          <div style={{ height: 64, borderBottom: '1px solid ' + Q.div, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px' }}>
            <span style={{ display: 'flex' }}>{['megan', 'lars'].map((w, i) => <span key={w} style={{ marginLeft: i ? -10 : 0, display: 'flex', opacity: w === 'lars' ? 1 - MOTION.enter(T, removed, removed + 0.8) : 1 }}><Person who={w} size={32} /></span>)}</span>
            <strong style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 22 }}>Fabrikam onboarding</strong>
            <span style={{ marginLeft: 'auto', fontSize: 15, color: Q.muted }}>{gone ? '1 person' : '2 people · 1 guest'}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 64, height: VIEW, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, transform: 'translateY(' + (-scroll) + 'px)' }}>
              {placed.map((m, i) => {
                const st = { position: 'absolute', left: 0, right: 0, top: m.y, height: m.h, opacity: m.p, transform: 'translateY(' + (1 - m.p) * 14 + 'px)', padding: '0 24px' };
                if (m.k === 'div') return (
                  <div key={i} style={{ ...st, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ flex: 1, height: 1, background: Q.div }}></span>
                    <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 16, letterSpacing: '0.14em', color: Q.a700 }}>{m.text.toUpperCase()}</span>
                    <span style={{ flex: 1, height: 1, background: Q.div }}></span>
                  </div>);
                if (m.k === 'sys') return (
                  <div key={i} style={{ ...st, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 15, color: Q.muted, padding: '5px 12px', background: Q.n100 }}>{m.text}</span>
                  </div>);
                if (m.k === 'p') {
                  const me = m.who === 'megan';
                  return (
                    <div key={i} style={{ ...st, display: 'flex', flexDirection: me ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 12, paddingTop: 8 }}>
                      <Person who={m.who} size={44} />
                      <div style={{ maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 4, alignItems: me ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: 14, color: Q.muted }}>{PEOPLE[m.who].name}{PEOPLE[m.who].guest ? ' (Guest)' : ''}</span>
                        <span style={{ fontSize: 20, lineHeight: 1.4, padding: '10px 16px', background: me ? Q.a100 : Q.n100, color: Q.ink }}>{m.text}</span>
                      </div>
                    </div>);
                }
                const clicked = T >= m.click;
                const press = MOTION.enter(T, m.click - 0.15, m.click) * (1 - MOTION.enter(T, m.click, m.click + 0.2));
                return (
                  <div key={i} style={{ ...st, display: 'flex', alignItems: 'flex-start', gap: 12, paddingTop: 8 }}>
                    <Bot />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: 14, color: Q.muted }}>Guest access → <strong style={{ color: Q.ink }}>{PEOPLE[m.to].name}</strong> · only {PEOPLE[m.to].name.split(' ')[0]} sees this</span>
                      <div style={{ border: '1.5px solid ' + Q.a700, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, background: Q.paper }}>
                        <strong style={{ fontSize: 20, lineHeight: 1.35, fontWeight: 500 }}>{m.q}</strong>
                        <span style={{ fontSize: 16, color: Q.muted }}>{m.d}</span>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <Btn filled={!clicked || m.choice === 'yes'} pressed={m.choice === 'yes' ? press : 0}>Still needed</Btn>
                          <Btn filled={clicked && m.choice === 'no'} pressed={m.choice === 'no' ? press : 0}>No longer needed</Btn>
                        </div>
                      </div>
                    </div>
                  </div>);
              })}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 24, right: 24, bottom: 0, height: 66, borderTop: '1px solid ' + Q.div, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: Q.muted }}>
            {typing && <React.Fragment><Person who={typing.who} size={26} /><span>{PEOPLE[typing.who].name.split(' ')[0]} is typing</span><span style={{ letterSpacing: 2 }}>{'...'.slice(0, 1 + Math.floor((T * 3) % 3))}</span></React.Fragment>}
          </div>
        </div>

        {/* product view */}
        <div className="blueprint" style={{ position: 'absolute', left: 1190, top: 60, width: 350, padding: '22px 24px', background: Q.paper, opacity: pPanel, transform: 'translateY(' + (1 - pPanel) * 20 + 'px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Corners />
          <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 15, letterSpacing: '0.14em', color: Q.a700 }}>GUEST ACCESS · THE RECORD</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Person who="lars" size={44} />
            <span style={{ display: 'flex', flexDirection: 'column' }}><strong style={{ fontSize: 20 }}>Lars Bisgaard</strong><span style={{ fontSize: 14, color: Q.muted }}>lars.bisgaard@fabrikam.dk</span></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 12, borderTop: '1px solid ' + Q.div }}>
            <span style={{ fontSize: 14, color: Q.muted }}>Status</span>
            <span style={{ alignSelf: 'flex-start', fontSize: 16, padding: '3px 10px', background: gone ? Q.a900 : accepted ? Q.a600 : Q.n100, color: accepted ? Q.paper : Q.ink, outline: '2px solid ' + Q.a400, outlineOffset: 2 * flash(M + 3.2), outlineColor: 'color-mix(in srgb, var(--color-accent-400) ' + Math.round(flash(M + 3.2) * 100) + '%, transparent)' }}>{gone ? 'Access removed' : accepted ? 'Accepted' : invited ? 'Pending' : '—'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid ' + Q.div }}>
            <span style={{ fontSize: 14, color: Q.muted }}>Who is answerable</span>
            {invited && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Person who="megan" size={30} /><span style={{ fontSize: 17, flex: 1 }}>Megan Bowen</span>
                <span style={{ fontSize: 13, padding: '2px 8px', background: meganOut ? Q.a900 : Q.a100, color: meganOut ? Q.paper : Q.a800 }}>{meganOut ? 'No longer has access' : 'Main contact'}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 12, borderTop: '1px solid ' + Q.div }}>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 14, color: Q.muted }}>Can reach</span><strong style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 30 }}>{gone ? 0 : invited ? 1 : 0}</strong></span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 14, color: Q.muted }}>Next ask</span><strong style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 30 }}>{nextAsk}</strong></span>
          </div>
        </div>
      </div>

      {/* end card */}
      <div style={{ position: 'absolute', inset: 0, background: Q.a900, color: Q.paper, opacity: pEnd, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, padding: '0 140px' }}>
        <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 18, letterSpacing: '0.14em', color: Q.a300 }}>MICROSOFT 365 GOVERNANCE · GUEST ACCESS</span>
        <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 84, lineHeight: 1, letterSpacing: '-0.02em', maxWidth: 1200, transform: 'translateY(' + (1 - pEnd) * 16 + 'px)' }}>The person who shared is the one who knows when access should end.</span>
        <span style={{ fontFamily: Q.head, fontWeight: 600, fontSize: 48, lineHeight: 1.05, color: Q.a300, opacity: pEnd2, transform: 'translateY(' + (1 - pEnd2) * 12 + 'px)' }}>Now somebody asks them.</span>
      </div>
    </div>
  );
}

function Conversation() {
  return (
    <CompositionStage width={1600} height={900} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="var(--color-bg)">
      <ConversationPiece />
    </CompositionStage>
  );
}
window.Conversation = Conversation;

function AutoPlayWhenVisible() {
  const tl = useTimeline();
  const ref = React.useRef(null);
  const state = React.useRef('idle');
  React.useEffect(() => {
    const check = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vis = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3;
      if (vis && state.current === 'idle') { state.current = 'on'; tl.setTime(0); tl.setPlaying(true); }
      else if (!vis && state.current === 'on' && tl.playing) { state.current = 'paused'; tl.setPlaying(false); }
      else if (vis && state.current === 'paused') { state.current = 'on'; tl.setPlaying(true); }
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const id = setTimeout(check, 300);
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); clearTimeout(id); };
  }, [tl.playing]);
  return <span ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}></span>;
}
function ConversationAuto() {
  return (
    <CompositionStage width={1600} height={900} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} autoplay="false" bg="var(--color-bg)">
      <AutoPlayWhenVisible />
      <ConversationPiece />
    </CompositionStage>
  );
}
window.ConversationAuto = ConversationAuto;
