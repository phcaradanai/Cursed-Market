import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { GameView, MarketNode, OfferMode, Phase } from "../game/types.js";
import type { ClientMessage, RoomView } from "../shared/protocol.js";
import { useConnection } from "./connection.js";
import { familyName, modeName, RelicDisplay } from "./Relic.js";

type Submit = ReturnType<typeof useConnection>["submit"];
const phaseName: Record<Phase, string> = { ROUTE_CHOICE: "เลือกเส้นทาง", BOON_CHOICE: "เลือกของเสริม", SELLER_PREP: "ผู้ขายเลือกสินค้า", BUYER_INSPECTION: "ตรวจสินค้า", SEALED_BID: "ประมูลแบบปิด", REVEAL: "เปิดผลประมูล", RESULTS: "ผลแมตช์" };
const nameFor = (room: RoomView, id: string | null) => id === null ? "ไม่มีผู้ซื้อ" : [...room.matchSeats, ...room.seats].find(s => s.id === id)?.name ?? id;
const phaseTitle = (game: GameView) => game.config.fastMarket && game.phase === "SEALED_BID" ? "ตรวจ · ประมูล · เดิมพัน" : phaseName[game.phase];

export function App() {
  const { connection, room, error, busy, send, submit, clearError } = useConnection();
  const online = connection === "online";
  const [phaseAnnouncement, setPhaseAnnouncement] = useState("");
  const phase = room?.game?.phase;
  const auctionNumber = room?.game?.auction.number;
  const matchId = room?.matchId;
  const seller = room?.game?.auction.sellerId === room?.yourSeatId;
  const fastMarket = room?.game?.config.fastMarket;
  useEffect(() => {
    setPhaseAnnouncement(!phase ? "" : phase === "RESULTS" ? "แมตช์จบแล้ว ดูคะแนนรวม" : phase === "ROUTE_CHOICE" || phase === "BOON_CHOICE" ? phaseName[phase] : `รอบ ${auctionNumber}: ${phase === "SEALED_BID" && fastMarket ? "ตรวจ ประมูล และเดิมพัน" : phaseName[phase]} · คุณเป็น${seller ? "ผู้ขาย" : "ผู้ซื้อ"}`);
  }, [matchId, auctionNumber, phase, seller, fastMarket]);
  return <div className="app">
    <header className="masthead"><h1>Cursed Market</h1><span className="connection" role="status">{online ? "เชื่อมต่อแล้ว" : connection === "replaced" ? "seat เปิดในอีกหน้าต่าง" : connection === "reconnecting" ? "กำลังเชื่อมต่อใหม่…" : "กำลังเชื่อมต่อ…"}</span></header>
    <p className="sr-only" role="status" aria-atomic="true">{phaseAnnouncement}</p>
    {!online && room && <div className="notice">{connection === "replaced" ? "seat นี้ถูกเปิดในอีกการเชื่อมต่อ โหลดหน้าใหม่เพื่อกลับมาเล่นที่นี่" : "เก็บ seat และการตัดสินใจเดิมไว้ กำลังเชื่อมต่อกลับให้อัตโนมัติ"}{connection === "replaced" && <button onClick={() => location.reload()}>กลับมาเล่นที่นี่</button>}</div>}
    {error && <div className="error" role="alert"><span>{error}</span><button className="text-button" onClick={clearError}>ปิดข้อความ</button></div>}
    <main>{!room ? <Entry online={online} send={send} /> : !room.game ? <Lobby room={room} online={online} send={send} /> : <Market room={room} online={online} busy={busy} submit={submit} send={send} />}</main>
    <footer>ตลาดวัตถุต้องสาป · {room?.game ? room.game.config.rogueRun ? "ทดลอง v0.3 · Roguelike Run" : !room.game.config.curseWagers ? "Prototype v0.1" : "ทดลอง v0.2 · เดิมพันคำสาป" : "ทดลอง v0.3 · Roguelike Run"}</footer>
  </div>;
}

function Entry({ online, send }: { online: boolean; send: (message: ClientMessage) => boolean }) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const enter = (event: FormEvent, type: "create" | "join") => {
    event.preventDefault();
    send(type === "create" ? { type, name: name.trim() } : { type, roomCode: roomCode.trim().toUpperCase(), name: name.trim() });
  };
  return <section className="entry"><h2>ตลาดวัตถุต้องสาป</h2><p className="lead">ของแท้อาจมีคำสาป คำรับประกันอาจบอกความจริงแค่ครึ่งเดียว</p>
    <p>เล่นกับเพื่อน 2–4 คน เลือกเส้นทางผ่าน 3 ตลาดที่สุ่มกติกา ประมูลของ เดิมพันคำสาป และสร้างสายเล่นเฉพาะ run นี้</p>
    <label className="name-input">ชื่อที่ใช้ในตลาด<input name="name" maxLength={24} autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อของคุณ" /></label>
    <div className="entry-forms"><form onSubmit={e => enter(e, "create")}><h3>เปิดตลาดของคุณ</h3><p>สร้างห้อง แล้วส่งรหัสให้เพื่อนเข้ามาเล่น</p><button className="primary" disabled={!online || !name.trim()}>สร้างห้อง</button></form>
      <form onSubmit={e => enter(e, "join")}><h3>เข้าตลาดของเพื่อน</h3><label>รหัสห้อง 6 ตัวอักษร<input name="roomCode" maxLength={6} autoCapitalize="characters" autoComplete="off" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ""))} placeholder="ABC234" /></label><button disabled={!online || !name.trim() || roomCode.length !== 6}>เข้าห้อง</button></form></div>
    <Rules rogue />
  </section>;
}

function Lobby({ room, online, send }: { room: RoomView; online: boolean; send: (message: ClientMessage) => boolean }) {
  const rogue = room.rulesVersion === "0.3";
  const me = room.seats.find(s => s.id === room.yourSeatId)!;
  const host = room.hostId === room.yourSeatId;
  const canStart = online && room.seats.length >= 2 && room.seats.every(s => s.ready && s.connected);
  const codeInput = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(room.code);
      setCopyStatus("คัดลอกแล้ว");
    } catch {
      codeInput.current?.focus();
      codeInput.current?.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { /* Keep selected text available for manual copying. */ }
      setCopyStatus(copied ? "คัดลอกแล้ว" : "คัดลอกอัตโนมัติไม่ได้ รหัสถูกเลือกไว้แล้ว กด Command+C / Ctrl+C หรือแตะค้างเพื่อคัดลอก");
    }
  };
  return <section className="lobby"><div className="room-heading"><h2>รอเพื่อนเข้าตลาด</h2><div><span>รหัสห้อง</span><input ref={codeInput} className="room-code" aria-label="รหัสห้อง" readOnly value={room.code} onFocus={event => event.target.select()} /><button className="text-button" onClick={() => void copy()}>คัดลอกรหัส</button>{copyStatus && <p className="copy-status muted" role="status">{copyStatus}</p>}</div></div>
    <div className="lobby-grid"><section><h3>ผู้เล่น {room.seats.length}/4</h3><ul className="lobby-seats">{room.seats.map(seat => <li key={seat.id}><strong>{seat.name}{seat.id === room.yourSeatId && " (คุณ)"}</strong><span>{seat.id === room.hostId && "เจ้าของห้อง · "}{!seat.connected ? "ขาดการเชื่อมต่อ" : seat.ready ? "พร้อมเล่น" : "ยังไม่พร้อม"}</span>{host && !seat.connected && <button className="text-button" onClick={() => send({ type: "remove-seat", seatId: seat.id })}>นำ seat ออก</button>}</li>)}</ul>
      <div className="actions"><button className={me.ready ? "" : "primary"} disabled={!online} onClick={() => send({ type: "ready", ready: !me.ready })}>{me.ready ? "ยกเลิกพร้อมเล่น" : "พร้อมเล่น"}</button>{host && <button className="primary" disabled={!canStart} onClick={() => send({ type: "start" })}>เริ่มแมตช์</button>}</div>
      <p className="muted">{host ? "เริ่มได้เมื่อมีอย่างน้อย 2 คน และทุกคนพร้อม" : `รอ ${nameFor(room, room.hostId)} เริ่มแมตช์เมื่อทุกคนพร้อม`}</p>
    </section><section className="lobby-rules"><h3>ก่อนเปิดตลาด</h3>{rogue ? <><p>เริ่มด้วย 15 เหรียญ และสิทธิ์ตรวจ 2 ครั้ง ผ่าน 3 ตลาด ทุกคนเป็นผู้ขายตลาดละ 1 ครั้ง</p><p>โหวตหนึ่งใน 3 เส้นทาง กติกา โอกาสสร้างคำสาป และมูลค่าของต่างกัน ระหว่างตลาดเลือกของเสริม 1 จาก 3 ตัวเลือกของคุณ</p><p>เดิมพัน 1–3 เหรียญว่ามีคำสาปหรือไม่ แม้ผ่านประมูลก็เดิมพันได้ ของเสริมบางชิ้นเพิ่มวงเงินเป็น 5 เหรียญ ทายถูกแบ่งกองกลาง ทายผิดเสียทุน</p></> : <><p>เซิร์ฟเวอร์นี้ใช้กติกาก่อน Roguelike Run เริ่ม 15 เหรียญ ตรวจ 2 ครั้ง</p><p>ผู้ขายเลือกหนึ่งชิ้นและคำรับประกัน ผู้ซื้อตรวจและยื่นราคา</p></>}
      <label>รูปแบบ playtest<select value={room.playtestMode} disabled={!host || !online} onChange={e => send({ type: "playtest-mode", mode: e.target.value as "voice" | "no-voice" })}><option value="no-voice">ไม่ใช้ voice</option><option value="voice">คุยผ่าน voice ภายนอก</option></select></label><p className="muted">บันทึกรูปแบบนี้ในผลแมตช์ เพื่อเทียบการเล่นภายหลัง</p><Rules rogue={rogue} /></section></div>
    <button className="text-button leave" disabled={!online} onClick={() => send({ type: "leave" })}>ออกจากห้อง</button>
  </section>;
}

function Countdown({ room }: { room: RoomView }) {
  const [now, setNow] = useState(Date.now());
  const offset = useMemo(() => room.serverTime - Date.now(), [room.serverTime]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const seconds = Math.max(0, Math.ceil(((room.deadline ?? 0) - now - offset) / 1000));
  const defaults: Partial<Record<Phase, string>> = { ROUTE_CHOICE: "หมดเวลา: ผู้ที่ยังไม่โหวตจะงดออกเสียง ถ้างดทุกคนเลือกตลาดคำสาปต่ำสุด", BOON_CHOICE: "หมดเวลา: ผู้ที่ยังไม่เลือกจะไม่รับของเสริม", SELLER_PREP: "หมดเวลา: ขายชิ้นแรกแบบไม่รับประกัน", BUYER_INSPECTION: "หมดเวลา: ไม่ตรวจและเก็บสิทธิ์ไว้", SEALED_BID: "หมดเวลา: ผู้ที่ยังไม่ยื่นราคาจะผ่าน", REVEAL: "หมดเวลา: ไปขั้นถัดไป" };
  return room.deadline === null ? null : <div className="timer"><strong>เหลือ {seconds} วินาที</strong><span>{room.game!.config.curseWagers && room.game!.phase === "SEALED_BID" ? "หมดเวลา: ผู้ที่ยังไม่ล็อกจะผ่านทั้งประมูลและเดิมพัน" : defaults[room.game!.phase]}</span></div>;
}

function Market({ room, online, busy, submit, send }: { room: RoomView; online: boolean; busy: boolean; submit: Submit; send: (message: ClientMessage) => boolean }) {
  const game = room.game!;
  const seller = game.auction.sellerId === room.yourSeatId;
  const disabled = !online || busy;
  if (game.phase === "RESULTS") return <Results room={room} online={online} send={send} />;
  if (game.phase === "ROUTE_CHOICE" || game.phase === "BOON_CHOICE") return <RunChoice key={`${game.phase}:${game.run!.stage}`} room={room} disabled={disabled} submit={submit} />;
  return <section className="market"><div className="market-heading"><div><h2>{phaseTitle(game)}</h2><p>รอบ {game.auction.number}/{game.totalAuctions} · ผู้ขาย {nameFor(room, game.auction.sellerId)}</p></div><Countdown room={room} /></div>
    {game.run && <RunProgress game={game} />}
    <nav className="round-steps" aria-label="ขั้นตอนประมูล">{(["SELLER_PREP", "BUYER_INSPECTION", "SEALED_BID", "REVEAL"] as const).filter(phase => !game.config.fastMarket || phase !== "BUYER_INSPECTION").map(phase => <span key={phase} aria-current={game.phase === phase ? "step" : undefined}>{phase === "SEALED_BID" && game.config.fastMarket ? "ตรวจ / ประมูล / เดิมพัน" : phaseName[phase]}</span>)}</nav>
    <div className="market-grid"><section className="work-area" aria-label="การตัดสินใจของคุณ"><p className="demand">ตลาดต้องการ <strong>{familyName[game.auction.demand]}</strong> · ผู้ซื้อได้ +{game.run?.market?.demandBonus ?? game.config.demandBonus} คะแนนเมื่อเป็นของแท้</p>
      {game.run?.market && <MarketTerms node={game.run.market} />}
      {game.players.find(p => p.id === room.yourSeatId)?.boons?.length ? <details className="my-build" open><summary>ของเสริมของคุณใน run นี้</summary>{game.players.find(p => p.id === room.yourSeatId)!.boons!.map(b => <p key={b.id}><strong>{b.name}{b.family && ` · ${familyName[b.family]}`}</strong>: {b.description}</p>)}</details> : null}
      {game.config.curseWagers && game.phase !== "REVEAL" && <div className="jackpot-line"><h3>กองกลางรอบนี้ <strong>{game.jackpot} เหรียญ</strong></h3><p>ตลาดเติม {game.run?.market?.ante ?? 2} เหรียญทุกรอบ รวมเงินเดิมพันเมื่อเปิดผล ทายผิดกันหมดก็ทบต่อ</p></div>}
      {game.phase === "SELLER_PREP" ? seller ? <SellerPanel game={game} disabled={disabled} submit={submit} /> : <div className="waiting"><h3>รอผู้ขายเลือกสินค้า</h3><p>ผู้ขายเห็นความจริงของสองชิ้น แล้วเลือกหนึ่งชิ้นออกประมูล</p></div> : game.phase === "REVEAL" ? <Reveal room={room} online={online} send={send} /> : <>
        <div className="public-lot"><RelicDisplay relic={game.auction.offer!.relic} /><div><h3>{modeName[game.auction.offer!.mode]}</h3><Guarantee mode={game.auction.offer!.mode} /><p>มัดจำ {game.auction.escrow} เหรียญ</p></div></div>
        {seller ? <div className="waiting"><h3>รอผู้ซื้อ{game.phase === "BUYER_INSPECTION" ? "เลือกตรวจสินค้า" : "ล็อกราคา"}</h3><p>ผู้ขายประมูลสินค้าของตนเองไม่ได้</p><p>{game.phase === "BUYER_INSPECTION" ? game.auction.inspectionReady.length : game.auction.bidReady.length}/{game.players.length - 1} คนตัดสินใจแล้ว</p></div> : <BuyerPanel game={game} disabled={disabled} submit={submit} />}
      </>}
    </section><aside className="participants"><h3>ในตลาด</h3><ul>{game.players.map(player => <li key={player.id}><strong>{nameFor(room, player.id)}{player.id === room.yourSeatId && " (คุณ)"}</strong><span>{player.id === game.auction.sellerId ? "ผู้ขาย" : "ผู้ซื้อ"}{room.seats.find(s => s.id === player.id)?.connected === false && " · ขาดการเชื่อมต่อ"}</span><div><b>{player.coins}</b> เหรียญ · ตรวจได้ <b>{player.inspectionTokens}</b> ครั้ง</div>{player.boons?.map(b => <span key={b.id}>{b.name}{b.family && ` · ${familyName[b.family]}`}</span>)}{game.auction.bidReady.includes(player.id) && <span>ล็อกการตัดสินใจแล้ว</span>}</li>)}</ul><Rules experimental={Boolean(game.config.curseWagers)} rogue={Boolean(game.run)} /></aside></div>
    <History room={room} />
  </section>;
}

function RunProgress({ game }: { game: GameView }) {
  const run = game.run!;
  return <div className="run-progress"><p><strong>ตลาด {run.stage}/{run.totalStages}</strong>{run.market && ` · ${run.market.name}`}</p><ol aria-label="เส้นทางของ run">{Array.from({ length: run.totalStages }, (_, i) => <li key={i} aria-current={i + 1 === run.stage ? "step" : undefined}>{i + 1}. {run.path[i]?.name ?? "ยังไม่เลือก"}</li>)}</ol></div>;
}

function MarketTerms({ node }: { node: MarketNode }) {
  return <div className="market-terms"><p>มูลค่าแต้ม: แท้ +{node.genuineValue} · ปลอม +{node.fakeValue} · คำสาป −{node.cursePenalty}</p><p>โอกาสตอนสร้างแต่ละชิ้น: แท้ {Math.round(node.genuineProbability * 100)}% · คำสาป {Math.round(node.cursedProbability * 100)}%</p><p className="muted">ผู้ขายเลือกจาก 2 ชิ้น ตัวเลขนี้จึงไม่ใช่โอกาสของชิ้นที่ออกขาย ของเสริมผู้ซื้ออาจเปลี่ยนแต้ม</p></div>;
}

function RunChoice({ room, disabled, submit }: { room: RoomView; disabled: boolean; submit: Submit }) {
  const game = room.game!;
  const run = game.run!;
  const routing = game.phase === "ROUTE_CHOICE";
  const [choice, setChoice] = useState("");
  useEffect(() => setChoice(""), [game.phase, run.stage]);
  const locked = routing ? Boolean(game.private.routeVote) : Boolean(game.private.boonPick);
  const options = routing ? run.routeChoices : game.private.boonOptions ?? [];
  const ready = routing ? run.voteReady : run.boonReady;
  const actor = game.players.find(p => p.id === room.yourSeatId)!;
  const commit = (skip = false) => routing ? submit({ type: "vote-route", nodeId: skip ? null : choice })
    : submit({ type: "choose-boon", boonId: skip ? null : (game.private.boonOptions!.find(b => b.id === choice)!.id) });
  const lockedName = routing ? options.find(o => o.id === game.private.routeVote?.nodeId)?.name ?? "งดออกเสียง"
    : options.find(o => o.id === game.private.boonPick?.boonId)?.name ?? "ไม่รับของเสริม";
  return <section className="run-choice"><div className="market-heading"><div><h2>{phaseName[game.phase]}</h2><p>{routing ? "เลือกตลาดถัดไปของกลุ่ม" : `จบตลาด ${run.stage} · สร้างสายเล่นก่อนเดินทางต่อ`}</p></div><Countdown room={room} /></div><RunProgress game={game} />
    <p>{routing ? "โหวตลับพร้อมกัน เสียงมากสุดเลือกเส้นทาง ถ้าเสมอสุ่มระหว่างตัวเลือกที่เสมอ เลือกแล้วแก้ไม่ได้" : "เลือกของเสริม 1 ชิ้นจากข้อเสนอเฉพาะคุณ ส่งผลจนจบ run เท่านั้น แต้มของที่ซื้อไปแล้วคงเดิม"}</p>
    {!routing && <p>เงิน {actor.coins} เหรียญ · ตรวจเหลือ {actor.inspectionTokens} ครั้ง · ของเสริมที่มี: {actor.boons?.map(b => b.name).join(", ") || "ยังไม่มี"}</p>}
    {locked ? <div className="waiting"><h3>ล็อกแล้ว: {lockedName}</h3><p>{ready.length}/{game.players.length} คนเลือกแล้ว รอคนอื่นหรือหมดเวลา</p></div> : <form onSubmit={e => { e.preventDefault(); commit(); }}>
      <fieldset className="run-options"><legend>{routing ? "เส้นทางที่เปิดอยู่" : "ของเสริมของคุณ"}</legend>{options.map(option => <label key={option.id}><input type="radio" name="run-choice" value={option.id} checked={choice === option.id} disabled={disabled} onChange={() => setChoice(option.id)} /><div><strong>{option.name}{"family" in option && option.family && ` · ${familyName[option.family]}`}</strong><p>{option.description}</p>{"ante" in option && <><MarketTerms node={option} /><p>ตลาดเติมกองกลาง {option.ante} เหรียญต่อประมูล · ของแท้ประเภท{familyName[option.demand]}ได้ +{option.demandBonus} แต้ม</p></>}</div></label>)}</fieldset>
      <div className="actions"><button className="primary" disabled={disabled || !choice}>{routing ? "ล็อกโหวตเส้นทาง" : "รับของเสริม"}</button><button type="button" disabled={disabled} onClick={() => commit(true)}>{routing ? "งดออกเสียง" : "ไม่รับของเสริม"}</button></div><p className="muted">{ready.length}/{game.players.length} คนเลือกแล้ว ไม่มีค่าใช้จ่ายสำหรับการเลือกนี้</p>
    </form>}<History room={room} /><Rules rogue />
  </section>;
}

function Guarantee({ mode }: { mode: OfferMode }) {
  return <p className="guarantee">{mode === "genuine" ? "รับประกันเฉพาะความแท้ ไม่รับประกันเรื่องคำสาป" : mode === "uncursed" ? "รับประกันเฉพาะว่าไร้คำสาป ไม่รับประกันความแท้" : "ไม่มีคำรับประกัน ความแท้และคำสาปยังไม่ทราบ"}</p>;
}

function SellerPanel({ game, disabled, submit }: { game: GameView; disabled: boolean; submit: Submit }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<OfferMode>("as-is");
  const candidates = game.private.candidates!;
  const coins = game.players.find(p => p.id === game.private.playerId)!.coins;
  return <form onSubmit={e => { e.preventDefault(); submit({ type: "offer", relicId: candidates[index]!.id, mode }); }}><h3>เลือกหนึ่งชิ้นออกประมูล</h3><p>ข้อมูลด้านล่างเห็นเฉพาะคุณ อีกชิ้นจะถูกทิ้ง{game.config.curseWagers && " ผู้ซื้อจะใช้คำรับประกันของคุณตัดสินใจเดิมพันคำสาปด้วย"}</p>
    <fieldset className="seller-options"><legend>สินค้าในมือ</legend>{candidates.map((relic, i) => <label className="relic-option" key={relic.id}><input type="radio" name="relic" value={relic.id} checked={index === i} onChange={() => setIndex(i)} disabled={disabled} /><span>ชิ้นที่ {i + 1}</span><RelicDisplay relic={relic} showTruth /></label>)}</fieldset>
    <label>คำรับประกัน<select value={mode} onChange={e => setMode(e.target.value as OfferMode)} disabled={disabled}><option value="as-is">ไม่รับประกัน · ไม่วางมัดจำ</option><option value="genuine" disabled={coins < game.config.escrowCoins}>รับประกันว่าแท้ · มัดจำ {game.config.escrowCoins} เหรียญ</option><option value="uncursed" disabled={coins < game.config.escrowCoins}>รับประกันว่าไร้คำสาป · มัดจำ {game.config.escrowCoins} เหรียญ</option></select></label><Guarantee mode={mode} /><p className="muted">ถ้าคำรับประกันผิดและขายได้ มัดจำเป็นของผู้ซื้อ และคุณเสีย {game.config.falseCertificatePenalty} คะแนน</p><button className="primary" disabled={disabled}>เปิดประมูล</button>
  </form>;
}

function BuyerPanel({ game, disabled, submit }: { game: GameView; disabled: boolean; submit: Submit }) {
  const [amount, setAmount] = useState("0");
  const [prediction, setPrediction] = useState("none");
  const [stakeText, setStakeText] = useState("1");
  const actor = game.players.find(p => p.id === game.private.playerId)!;
  const maxStake = actor.boons?.some(b => b.id === "high-roller") ? 5 : 3;
  const finding = game.private.inspection;
  const lockedInspection = finding !== null;
  const bid = Number(amount);
  const stake = game.config.curseWagers && prediction !== "none" ? Number(stakeText) : 0;
  const validStake = prediction === "none" || stakeText.trim() !== "" && Number.isSafeInteger(stake) && stake >= 1 && stake <= maxStake;
  const valid = amount.trim() !== "" && Number.isSafeInteger(bid) && bid >= 0 && validStake && bid + stake <= actor.coins;
  const wager = stake > 0 ? { cursed: prediction === "cursed", stake } : undefined;
  const inspectButtons = <div className="actions"><button disabled={disabled || actor.inspectionTokens === 0} onClick={() => submit({ type: "inspect", attribute: "genuine" })}>ตรวจความแท้ · 1 สิทธิ์</button><button disabled={disabled || actor.inspectionTokens === 0} onClick={() => submit({ type: "inspect", attribute: "cursed" })}>ตรวจคำสาป · 1 สิทธิ์</button>{!game.config.fastMarket && <button className="text-button" disabled={disabled} onClick={() => submit({ type: "pass-inspection" })}>ไม่ตรวจ เก็บสิทธิ์ไว้</button>}</div>;
  return <section className="buyer-decisions"><h3>{game.phase === "BUYER_INSPECTION" ? "จะตรวจอะไร หรือเก็บสิทธิ์ไว้?" : "ซื้อของ หรือเสี่ยงกับคำสาป?"}</h3>
    {finding?.attribute && <p className="private-finding" role="status">ผลตรวจเฉพาะคุณ: {finding.attribute === "genuine" ? finding.value ? "ของแท้" : "ของปลอม" : finding.value ? "มีคำสาป" : "ไร้คำสาป"} · อีกคุณสมบัติยังไม่ทราบ</p>}
    {game.phase === "BUYER_INSPECTION" ? lockedInspection ? <p role="status">ล็อกการตรวจแล้ว รอผู้ซื้อคนอื่น</p> : <><p>เหลือ {actor.inspectionTokens} ครั้งตลอดแมตช์ ตรวจได้เพียงหนึ่งคุณสมบัติในรอบนี้</p>{inspectButtons}</> : game.private.bid ? <p className="private-finding" role="status">ล็อกแล้ว: {game.private.bid.amount === 0 ? "ผ่านประมูล" : `ราคา ${game.private.bid.amount} เหรียญ`}{game.config.curseWagers && (game.private.bid.wager ? ` · ทาย${game.private.bid.wager.cursed ? "มีคำสาป" : "ไร้คำสาป"} ${game.private.bid.wager.stake} เหรียญ` : " · ไม่เดิมพัน")} เปลี่ยนไม่ได้ รอเปิดผล</p> : <>
      {game.config.fastMarket && !lockedInspection && <div className="inspection-choice"><p>ตรวจได้ {actor.inspectionTokens} ครั้งตลอดแมตช์ เลือกหนึ่งคุณสมบัติ หรือยื่นราคาได้เลย</p>{inspectButtons}</div>}
      <form className="bid-form" onSubmit={e => { e.preventDefault(); if (valid) submit({ type: "bid", amount: bid, ...(wager ? { wager } : {}) }); }}>
        {game.config.curseWagers && <fieldset className="wager-options" disabled={disabled}><legend>เดิมพันคำสาป · ไม่ต้องชนะประมูลก็เล่นได้</legend>{([["none", "ไม่เดิมพัน"], ["clear", "ทายไร้คำสาป"], ["cursed", "ทายมีคำสาป"]] as const).map(([value, label]) => <label key={value}><input type="radio" name="prediction" value={value} checked={prediction === value} disabled={disabled || (value !== "none" && actor.coins === 0)} onChange={() => setPrediction(value)} />{label}</label>)}<p id="wager-help" className="muted">ทายถูกแบ่งกองกลางตามเงินเดิมพัน รวมทุนที่ลงไว้ ทายผิดเสียเงินเดิมพัน ถ้าไม่มีใครถูก กองกลางทบ</p></fieldset>}
        <div className="bid-amounts"><label>ราคาประมูล 0–{Math.max(0, actor.coins - (Number.isFinite(stake) ? stake : 0))} เหรียญ<input name="bid" type="number" inputMode="numeric" min="0" max={Math.max(0, actor.coins - (Number.isFinite(stake) ? stake : 0))} step="1" value={amount} onChange={e => setAmount(e.target.value)} disabled={disabled} aria-describedby="bid-help" /></label>{game.config.curseWagers && prediction !== "none" && <label>เงินเดิมพัน 1–{Math.min(maxStake, actor.coins)} เหรียญ<input name="stake" type="number" inputMode="numeric" min="1" max={Math.min(maxStake, actor.coins)} step="1" value={stakeText} onChange={e => setStakeText(e.target.value)} disabled={disabled} aria-describedby="wager-help bid-help" /></label>}</div>
        <p id="bid-help" className="muted">0 คือไม่ซื้อ ราคาและเดิมพันรวมกันต้องไม่เกิน {actor.coins} เหรียญ ล็อกแล้วแก้ไม่ได้</p>
        <div className="actions"><button className="primary" disabled={disabled || !valid}>{game.config.curseWagers ? "ล็อกประมูลและเดิมพัน" : "ล็อกราคา"}</button><button type="button" disabled={disabled} onClick={() => submit({ type: "bid", amount: 0 })}>{game.config.curseWagers ? "ผ่านทั้งประมูลและเดิมพัน" : "ผ่านการประมูล"}</button></div>
      </form></>}
  </section>;
}

function Reveal({ room, online, send }: { room: RoomView; online: boolean; send: (message: ClientMessage) => boolean }) {
  const game = room.game!;
  const result = game.history.at(-1)!;
  const acknowledged = room.revealReady.includes(room.yourSeatId);
  return <div className="reveal">{result.wagers && <div className="wager-reveal"><h3 className={result.relic.cursed ? "danger-text" : ""}>{result.relic.cursed ? "มีคำสาป!" : "ไร้คำสาป!"}</h3><p>{result.potAfter ? result.auctionNumber === game.totalAuctions ? `ไม่มีใครรับกองกลาง ${result.potAfter} เหรียญ จบแมตช์คืนให้ตลาด` : `กองกลาง ${result.potAfter} เหรียญยังไม่มีเจ้าของ ทบไปรอบหน้า` : `แบ่งกองกลาง ${(result.potBefore ?? 0) + result.wagers.reduce((sum, w) => sum + w.stake, 0)} เหรียญให้ผู้ทายถูก`}</p><ul className="bid-results">{result.wagers.map(w => <li key={w.playerId}><span>{nameFor(room, w.playerId)} · ทาย{w.cursed ? "มีคำสาป" : "ไร้คำสาป"} · {w.correct ? "ถูก" : "ผิด"}<small>ลง {w.stake} · รับ {w.payout} เหรียญรวมทุน</small></span><strong className={w.correct ? "" : "danger-text"}>{w.payout - w.stake >= 0 ? "+" : ""}{w.payout - w.stake} เหรียญ</strong></li>)}</ul></div>}<div className="public-lot"><RelicDisplay relic={result.relic} showTruth /><div><h3>{result.winnerId ? `${nameFor(room, result.winnerId)} ซื้อ ${result.price} เหรียญ` : "ไม่มีผู้ซื้อ สินค้าถูกทิ้ง"}</h3><p>{modeName[result.mode]}</p><p className={result.certificate === "false" ? "danger-text" : ""}>{result.certificate === "false" ? `คำรับประกันผิด: ผู้ซื้อได้มัดจำ ${result.compensation} เหรียญ ผู้ขายเสีย ${result.trustPenalty} คะแนน` : result.certificate === "true" ? `คำรับประกันจริง: คืนมัดจำ ${result.escrowReturned} เหรียญให้ผู้ขาย` : result.certificate === "unsold" ? `ขายไม่ออก: คืนมัดจำ ${result.escrowReturned} เหรียญ ไม่มีโทษคำรับประกัน` : "ไม่รับประกัน ไม่มีมัดจำหรือโทษคำรับประกัน"}</p>{result.winnerId && <p>มูลค่าวัตถุ {result.relicScore >= 0 ? "+" : ""}{result.relicScore} · Demand +{result.demandBonus} คะแนน</p>}{result.tiedPlayerIds.length > 1 && <p className="muted">ราคาสูงสุดเสมอ {result.tiedPlayerIds.length} คน เซิร์ฟเวอร์สุ่มผู้ชนะ</p>}</div></div>
    <h3>ราคาที่ล็อกไว้</h3><ul className="bid-results">{result.bids.map(b => <li key={b.playerId}><span>{nameFor(room, b.playerId)}{b.playerId === result.winnerId && " · ผู้ซื้อ"}</span><strong>{b.amount === 0 ? "ผ่าน" : `${b.amount} เหรียญ`}</strong></li>)}</ul>
    <div className="actions"><button className="primary" disabled={!online || acknowledged} onClick={() => send({ type: "reveal-ready", matchId: room.matchId!, auctionNumber: result.auctionNumber })}>{acknowledged ? "รอผู้อื่น" : result.auctionNumber === game.totalAuctions ? "ดูคะแนนรวม" : "พร้อมรอบถัดไป"}</button><span>{room.revealReady.length}/{game.players.length} คนพร้อม</span></div>
  </div>;
}

function Results({ room, online, send }: { room: RoomView; online: boolean; send: (message: ClientMessage) => boolean }) {
  const results = room.game!.results!;
  return <section className="results"><h2>ผู้ชนะ: {results.winnerIds.map(id => nameFor(room, id)).join(" และ ")}</h2><p>คะแนน = เงินเหลือ + มูลค่าวัตถุ + Demand − โทษคำรับประกัน</p><div className="score-scroll"><table><caption>คะแนนรวมของแมตช์</caption><thead><tr><th scope="col">ผู้เล่น</th><th scope="col">เงิน</th><th scope="col">วัตถุ</th><th scope="col">Demand</th><th scope="col">โทษ</th><th scope="col">รวม</th></tr></thead><tbody>{results.scores.map(score => <tr key={score.playerId}><th scope="row">{nameFor(room, score.playerId)}</th><td>{score.coins}</td><td>{score.relicPoints}</td><td>{score.demandPoints}</td><td>−{score.trustPenalty}</td><td><strong>{score.total}</strong></td></tr>)}</tbody></table></div><p className="muted">คะแนนเสมอตัดสินด้วยเงินที่เหลือ หากยังเสมอจะชนะร่วม</p>
    <div className="actions">{room.hostId === room.yourSeatId ? <button className="primary" disabled={!online} onClick={() => send({ type: "rematch" })}>เล่นอีกแมตช์</button> : <p>รอเจ้าของห้องเปิดแมตช์ใหม่</p>}<button disabled={!online} onClick={() => send({ type: "audit", matchId: room.matchId! })}>ดาวน์โหลดผลแมตช์ (.json)</button><button className="text-button" disabled={!online} onClick={() => send({ type: "leave" })}>ออกจากห้อง</button></div>
    {room.game!.config.curseWagers && <p>กำไรหรือขาดทุนเดิมพันรวมอยู่ในเงินเหลือแล้ว</p>}{room.game!.run && <><RunProgress game={room.game!} /><h3>สายเล่นเมื่อจบ run</h3><ul>{room.game!.players.map(p => <li key={p.id}>{nameFor(room, p.id)}: {p.boons?.map(b => `${b.name}${b.family ? ` (${familyName[b.family]})` : ""}`).join(", ") || "ไม่มีของเสริม"}</li>)}</ul><p>เริ่ม run ใหม่จะสุ่มเส้นทางและข้อเสนอใหม่ รีเซ็ตเงิน สิทธิ์ตรวจ และของเสริมทั้งหมด บันทึกผลก่อนเริ่มใหม่</p></>}<History room={room} open /><Rules experimental={Boolean(room.game!.config.curseWagers)} rogue={Boolean(room.game!.run)} />
  </section>;
}

function History({ room, open = false }: { room: RoomView; open?: boolean }) {
  const history = room.game!.history;
  if (history.length === 0) return null;
  return <details className="history" open={open}><summary>ประวัติประมูล · {history.length} รอบ</summary><ol>{history.map(result => <li key={result.auctionNumber}><strong>รอบ {result.auctionNumber} · {familyName[result.relic.family]}</strong><span>{result.relic.genuine ? "ของแท้" : "ของปลอม"} · {result.relic.cursed ? "มีคำสาป" : "ไร้คำสาป"} · {result.winnerId ? `${nameFor(room, result.winnerId)} ซื้อ ${result.price} เหรียญ` : "ขายไม่ออก"}</span><span>{modeName[result.mode]}{result.certificate === "false" ? " · รับประกันผิด" : result.certificate === "true" ? " · รับประกันจริง" : ""}</span></li>)}</ol></details>;
}

function Rules({ experimental = true, rogue = false }: { experimental?: boolean; rogue?: boolean }) {
  return <details className="rules"><summary>กติกาสั้น ๆ</summary><p>ความแท้กับคำสาปเป็นคนละเรื่อง ตรวจหนึ่งคุณสมบัติไม่ได้บอกอีกเรื่อง รับประกันว่าแท้จึงไม่ได้แปลว่าปลอดภัย</p><p>{rogue ? "มูลค่าและโบนัส Demand ใช้ตัวเลขของตลาดปัจจุบัน ของเสริมมีผลต่อของที่ซื้อหลังได้รับเท่านั้น" : "ของแท้ +9 ของปลอม +1 ถ้ามีคำสาปหัก 6 คะแนน ของแท้ตรง Demand ได้อีก +3 คะแนน"} เงินเหลือมีค่าเหรียญละ 1 คะแนน</p><p>รับประกันผิด: มัดจำ 2 เหรียญให้ผู้ซื้อ และผู้ขายเสีย 2 คะแนน ขายไม่ออกคืนมัดจำ ไม่มีโทษ</p>{experimental && <p>ผู้ซื้อเดิมพันคำสาป 1–3 เหรียญได้แม้ราคา 0 {rogue && "ของเสริมนักเดิมพันเพิ่มวงเงินเป็น 5 เหรียญ "}ผู้ขายเดิมพันไม่ได้ ตลาดเติมกองกลาง{rogue ? "ตามเส้นทาง" : " 2 เหรียญ"}ทุกรอบ ทายถูกแบ่งตามสัดส่วนเงินเดิมพัน ทายผิดเสียทุน ไม่มีใครถูกกองกลางทบ จบแมตช์กองกลางที่ไม่มีเจ้าของคืนให้ตลาด</p>}<p>{rogue ? "3 ตลาด ทุกคนขายตลาดละ 1 ครั้ง: 2 คน 6 รอบ · 3 คน 9 รอบ · 4 คน 12 รอบ ระหว่างตลาดเลือกของเสริมได้คนละ 1 ชิ้น เริ่มใหม่รีเซ็ตสายเล่น" : "2 คนเล่น 8 รอบ · 3 คน 9 รอบ · 4 คน 12 รอบ"} ไม่มีใครถูกคัดออก</p></details>;
}
