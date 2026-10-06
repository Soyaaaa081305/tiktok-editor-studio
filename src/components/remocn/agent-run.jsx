"use client";;
import { useMemo } from "react";
import { Easing, random, useCurrentFrame, useVideoConfig } from "remotion";

export const defaultAgentRun = {
  title: "Checkout conversion drop",
  prompt: "Why did checkout conversion drop last week?",
  plan: [
    "Compare the checkout funnel with week before",
    "Break the drop down by browser and step",
    "Check what shipped and the error logs say",
  ],
  steps: [
    {
      icon: "chart",
      name: "Query analytics",
      detail: "checkout funnel, last 7 days vs prior",
      duration: 1.4,
    },
    {
      icon: "database",
      name: "Run SQL",
      detail: "conversion by browser and step",
      duration: 2.3,
    },
    {
      icon: "search",
      name: "Search logs",
      detail: "Apple Pay errors on Safari",
      duration: 1.1,
    },
    {
      icon: "book",
      name: "Read 12 sources",
      duration: 3.2,
      sources: [
        "Checkout funnel",
        "Browser report",
        "Release 4.12",
        "PR #2186",
        "webkit.org",
        "developer.mozilla.org",
        "Payments runbook",
        "Error log",
        "Incident notes",
        "Apple Pay guide",
        "Support tickets",
        "Status page",
      ],
    },
  ],
  answer: [
    "## Apple Pay broke on Safari in release 4.12",
    "",
    "Checkout conversion fell from 3.4% to 2.7% last week, a 21% drop [1]. All of it comes the payment step on Safari, 41% checkouts [2].",
    "",
    "- Safari conversion halved, from 3.5% to 1.8%",
    "- Chrome and Firefox held steady at 3.3%",
    '- 4.12 moved the card form into an iframe without `allow="payment"` [3]',
    "",
    "```tsx",
    "<iframe",
    "src={cardFormUrl}",
    'allow="payment"',
    "/>",
    "```",
    "",
    "**Fix:** add the attribute and ship 4.12.1 today.",
  ].join(""),
};

export const agentRunDefaults = {
  run: defaultAgentRun,
  theme: "light",
  accentColor: "#2563eb",
  compression: 3,
  seed: 1,
  speed: 1,
};

const PANEL_IN = 14;
const PANEL_RISE = 14;
const BUBBLE_AT = 4;
const BUBBLE_IN = 10;
const BUBBLE_RISE = 8;
const RUN_START = 16;
const STATUS_IN = 6;
const THINK_LEAD = 14;
const THINK_TAIL = 8;
const SWAP = 8;
const SWAP_RISE = 4;
const TOOL_GAP = 5;
const TOOL_MIN = 12;
const TOOL_MAX = 120;
const ANSWER_GAP = 8;
const ROW_IN = 8;
const ROW_FADE = 6;
const LABEL_DELAY = 2;
const LABEL_FADE = 6;
const SPIN = 12;
const ARC = 0.28;
const RESOLVE = 8;
const CHECK_FROM = 3;
const CHECK_TO = 10;
const CHIP_LEAD = 4;
const CHIP_SPAN = 0.7;
const FADE = 5;
const MORPH = 8;
const POP = 8;
const CODE_OPEN = 8;
const LINE_GROW = 5;
const SCROLL = 24;
const SCROLL_LEAD = 16;
const SETTLE = 16;
const HOLD = 45;
const SHIMMER_PERIOD = 30;
const SHIMMER_BAND = 3;
const SHIMMER_BASE = 0.45;
const DOT_BACK = 1.7;
const CITE_BACK = 2;
const CHIP_BACK = 1.7;
const MIN_COMPRESSION = 0.25;
const MAX_COMPRESSION = 20;

const SIZE_WEIGHTS = [8, 16, 22, 22, 17, 15];
const GAP_WEIGHTS = [42, 33, 16, 9];
const PAUSE_CHANCE = 0.06;
const PAUSE_MIN = 4;
const PAUSE_SPREAD = 4;
const BLOCK_MIN = 2;
const BLOCK_SPREAD = 3;

const REF_HEIGHT = 720;
const PANEL_W = 800;
const MARGIN_X = 40;
const MARGIN_Y = 40;
const MIN_PANEL_H = 360;
const MAX_PANEL_H = 960;
const HEADER_H = 48;
const PAD_X = 32;
const PAD_TOP = 24;
const SAFE = 40;
const COLUMN = PANEL_W - 2 * PAD_X;
const MEASURE = 680;
const BODY_SIZE = 16;
const BODY_LINE = 26;
const BUBBLE_SIZE = 16;
const BUBBLE_LINE = 24;
const BUBBLE_PAD_Y = 10;
const BUBBLE_PAD_X = 16;
const BUBBLE_WIDTH = 520;
const BUBBLE_GAP = 22;
const STATUS_H = 22;
const STATUS_GAP = 10;
const PLAN_SIZE = 15;
const PLAN_LINE = 24;
const PLAN_GAP = 4;
const PLAN_INDENT = 36;
const PLAN_WIDTH = 640;
const PLAN_AFTER = 20;
const ROW_H = 40;
const CHIPS_H = 34;
const TOOLS_AFTER = 24;
const ITEM_INDENT = 22;
const ITEM_GAP = 4;
const BLOCK_GAP = 12;
const HEADING_GAP = 8;
const CODE_GAP = 14;
const CODE_SIZE = 14;
const CODE_LINE = 22;
const CODE_HEAD = 34;
const CODE_PAD = 10;
const CHIP_SIZE = 12.5;
const CHIP_GAP = 6;
const CHIP_MAX = 6;
const CHIP_ROOM = COLUMN - 2 - 40 - 14;
const CIRCLE = 2 * Math.PI * 10;
const CHECK_LENGTH = 6 * Math.SQRT2;

const HEADINGS = {
  1: { size: 22, line: 32 },
  2: { size: 20, line: 30 },
};

const SANS =
  'Inter, "Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO =
  '"JetBrains Mono", "Geist ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation monospace';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);

const finite = (value, fallback) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));
const progress = (value) =>
  Number.isNaN(value) ? 0 : clamp(value, 0, 1);
const round = (value) => Math.round(value * 1000) / 1000;
const expo = (value) => EXPO(progress(value));
const easeOut = (value) => 1 - (1 - progress(value)) ** 3;
const smoothstep = (value) => {
  const t = progress(value);
  return t * t * (3 - 2 * t);
};
const backOut = (value, overshoot) => {
  const t = progress(value) - 1;
  return 1 + (overshoot + 1) * t ** 3 + overshoot * t ** 2;
};
const rateOf = (speed) =>
  Math.max(0, finite(speed, agentRunDefaults.speed));
const seedOf = (seed) =>
  finite(seed, agentRunDefaults.seed);
const compressionOf = (compression) =>
  clamp(
    finite(compression, agentRunDefaults.compression),
    MIN_COMPRESSION,
    MAX_COMPRESSION,
  );

export function formatAgentRunSeconds(seconds) {
  const value = Math.max(0, finite(seconds, 0));
  if (value < 60) return `${value.toFixed(1)}s`;
  const minutes = Math.floor(value / 60);
  const rest = Math.floor(value - minutes * 60);
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

const isLetter = (code) =>
  (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code >= 192;
const isDigit = (code) => code >= 48 && code <= 57;

export function tokenizeAgentRun(text) {
  const ends = [];
  let index = 0;
  while (index < text.length) {
    if (text[index] === "") {
      index += 1;
      ends.push(index);
      continue;
    }
    while (
      index < text.length &&
      (text[index] === "" || text[index] === "")
    ) {
      index += 1;
    }
    if (index < text.length && text[index] !== "") {
      const code = text.charCodeAt(index);
      if (isLetter(code)) {
        while (index < text.length && isLetter(text.charCodeAt(index))) {
          index += 1;
        }
      } else if (isDigit(code)) {
        const stop = Math.min(text.length, index + 3);
        while (index < stop && isDigit(text.charCodeAt(index))) {
          index += 1;
        }
      } else {
        index += 1;
      }
    }
    ends.push(index);
  }
  return ends;
}

function pick(weights, value) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = value * total;
  for (const [index, weight] of weights.entries()) {
    if (cursor < weight) return index;
    cursor -= weight;
  }
  return weights.length - 1;
}

export function getAgentRunChunks(text, seed = agentRunDefaults.seed, stream = "answer") {
  const ends = tokenizeAgentRun(text);
  const startOf = (token) => (token > 0 ? ends[token - 1] : 0);
  const isNewline = (token) =>
    token < ends.length && text[startOf(token)] === "";
  const key = `agent-run-${seedOf(seed)}-${stream}`;
  const chunks = [];
  let token = 0;
  let at = 0;
  let block = false;
  while (token < ends.length) {
    const index = chunks.length;
    const size = pick(SIZE_WEIGHTS, random(`${key}-size-${index}`)) + 1;
    let stop = Math.min(ends.length, token + size);
    let cut = false;
    for (let cursor = token; cursor < stop; cursor++) {
      if (isNewline(cursor) && isNewline(cursor + 1)) {
        stop = cursor + 2;
        cut = true;
        break;
      }
    }
    if (!cut && isNewline(stop - 1) && isNewline(stop)) {
      stop += 1;
      cut = true;
    }
    while (cut && isNewline(stop)) stop += 1;
    if (index > 0) {
      at += pick(GAP_WEIGHTS, random(`${key}-gap-${index}`)) + 1;
      if (random(`${key}-pause-${index}`) < PAUSE_CHANCE) {
        const hold = random(`${key}-hold-${index}`) * PAUSE_SPREAD;
        at += PAUSE_MIN + Math.floor(hold);
      }
      if (block) {
        const extra = random(`${key}-block-${index}`) * BLOCK_SPREAD;
        at += BLOCK_MIN + Math.floor(extra);
      }
    }
    chunks.push({
      index,
      at,
      start: startOf(token),
      end: ends[stop - 1],
      tokens: stop - token,
      block,
    });
    block = cut;
    token = stop;
  }
  return chunks;
}

function lastArrival(chunks) {
  return chunks.length > 0 ? chunks[chunks.length - 1].at : 0;
}

function chunkIndexAt(chunks, offset) {
  let low = 0;
  let high = chunks.length - 1;
  let found = chunks.length;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (chunks[middle].end > offset) {
      found = middle;
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }
  return found;
}

export function getAgentRunArrival(
  chunks,
  offset,
) {
  const index = chunkIndexAt(chunks, offset);
  return index < chunks.length ? chunks[index].at : Number.POSITIVE_INFINITY;
}

export function getAgentRunReveal(
  chunks,
  local,
) {
  let low = 0;
  let high = chunks.length - 1;
  let revealed = 0;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (chunks[middle].at <= local) {
      revealed = chunks[middle].end;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return revealed;
}

function parseInline(source, base) {
  const out = [];
  let text = "";
  let textStart = 0;
  const flush = (at) => {
    if (text.length > 0) {
      out.push({ kind: "text", text, raw: base + textStart, end: base + at });
    }
    text = "";
  };
  let index = 0;
  while (index < source.length) {
    if (source.startsWith("**", index)) {
      const close = source.indexOf("**", index + 2);
      if (close > index + 2) {
        flush(index);
        out.push({
          kind: "bold",
          text: source.slice(index + 2, close),
          raw: base + index + 2,
          end: base + close + 2,
        });
        index = close + 2;
        textStart = index;
        continue;
      }
    }
    if (source[index] === "`") {
      const close = source.indexOf("`", index + 1);
      if (close > index + 1) {
        flush(index);
        out.push({
          kind: "code",
          text: source.slice(index + 1, close),
          raw: base + index + 1,
          end: base + close + 1,
        });
        index = close + 1;
        textStart = index;
        continue;
      }
    }
    if (source[index] === "[") {
      const match = /^\[(\d{1,3})\]/.exec(source.slice(index));
      if (match) {
        flush(index);
        out.push({
          kind: "cite",
          text: match[1],
          raw: base + index,
          end: base + index + match[0].length,
        });
        index += match[0].length;
        textStart = index;
        continue;
      }
    }
    if (text.length === 0) textStart = index;
    text += source[index];
    index += 1;
  }
  flush(index);
  return out;
}

const HEADING_LINE = /^(#{1,3})[ \t]+(.*)$/;
const ITEM_LINE = /^[-*][ \t]+(.*)$/;

function isStructural(line) {
  return (
    line.startsWith("```") || HEADING_LINE.test(line) || ITEM_LINE.test(line)
  );
}

export function parseAgentRunMarkdown(markdown) {
  const lines = [];
  let offset = 0;
  for (const text of markdown.split("")) {
    lines.push({ text, raw: offset });
    offset += text.length + 1;
  }
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.text.trim() === "") {
      index += 1;
      continue;
    }
    if (line.text.startsWith("```")) {
      const rest = line.text.slice(3);
      const body = [];
      let cursor = index + 1;
      while (cursor < lines.length && !lines[cursor].text.startsWith("```")) {
        body.push(lines[cursor]);
        cursor += 1;
      }
      const closed = cursor < lines.length;
      const last = closed ? lines[cursor] : (body[body.length - 1] ?? line);
      blocks.push({
        kind: "code",
        raw: line.raw,
        open: line.raw + 3,
        end: last.raw + last.text.length,
        lang: rest.trim(),
        langRaw: line.raw + 3 + (rest.length - rest.trimStart().length),
        lines: body,
      });
      index = closed ? cursor + 1 : cursor;
      continue;
    }
    const heading = HEADING_LINE.exec(line.text);
    if (heading) {
      const body = line.raw + line.text.length - heading[2].length;
      blocks.push({
        kind: "heading",
        level: heading[1].length === 1 ? 1 : 2,
        raw: line.raw,
        body,
        end: line.raw + line.text.length,
        inline: parseInline(heading[2], body),
      });
      index += 1;
      continue;
    }
    const item = ITEM_LINE.exec(line.text);
    if (item) {
      const body = line.raw + line.text.length - item[1].length;
      blocks.push({
        kind: "item",
        raw: line.raw,
        body,
        end: line.raw + line.text.length,
        inline: parseInline(item[1], body),
      });
      index += 1;
      continue;
    }
    let cursor = index;
    while (
      cursor < lines.length &&
      lines[cursor].text.trim() !== "" &&
      (cursor === index || !isStructural(lines[cursor].text))
    ) {
      cursor += 1;
    }
    const last = lines[cursor - 1];
    const end = last.raw + last.text.length;
    const source = markdown.slice(line.raw, end).replace(/\n/g, "");
    blocks.push({
      kind: "paragraph",
      raw: line.raw,
      end,
      inline: parseInline(source, line.raw),
    });
    index = cursor;
  }
  return blocks;
}

const NARROW = ".,:;'!|iljI`";
const THIN = "ftr()[]{}/\\-";
const SYMBOL = "<>=+~#$&→";
const WIDE = "mw…";
const WIDEST = "MW@%—";

function charWidth(char) {
  if (NARROW.includes(char)) return 0.3;
  if (THIN.includes(char)) return 0.44;
  if (WIDEST.includes(char)) return 1;
  if (WIDE.includes(char)) return 0.9;
  if (SYMBOL.includes(char)) return 0.68;
  if (char >= "0" && char <= "9") return 0.66;
  if (char >= "A" && char <= "Z") return 0.74;
  return 0.62;
}

export function estimateAgentRunWidth(
  text,
  size,
  mono = false,
) {
  let em = 0;
  for (const char of text) em += mono ? 0.6 : charWidth(char);
  return em * size;
}

function pieceWidth(piece, size) {
  if (piece.kind === "cite") {
    return 20 + 7 * Math.max(0, piece.text.length - 1);
  }
  if (piece.kind === "code") {
    return estimateAgentRunWidth(piece.text, size * 0.875, true) + 10;
  }
  return estimateAgentRunWidth(piece.text, size);
}

function atomsOf(inline, size) {
  const atoms = [];
  let word = [];
  let wordWidth = 0;
  const add = (piece) => {
    word.push(piece);
    wordWidth += pieceWidth(piece, size);
  };
  const close = () => {
    if (word.length > 0) {
      atoms.push({ pieces: word, width: wordWidth, space: false });
    }
    word = [];
    wordWidth = 0;
  };
  for (const segment of inline) {
    if (segment.kind === "cite" || segment.kind === "code") {
      add({ ...segment });
      continue;
    }
    let index = 0;
    while (index < segment.text.length) {
      const space = segment.text[index] === "";
      let stop = index;
      while (
        stop < segment.text.length &&
        (segment.text[stop] === "") === space
      ) {
        stop += 1;
      }
      const piece = {
        kind: segment.kind,
        text: segment.text.slice(index, stop),
        raw: segment.raw + index,
        end: segment.raw + stop,
      };
      if (space) {
        close();
        atoms.push({
          pieces: [piece],
          width: pieceWidth(piece, size),
          space: true,
        });
      } else {
        add(piece);
      }
      index = stop;
    }
  }
  close();
  return atoms;
}

function mergePieces(pieces) {
  const merged = [];
  for (const piece of pieces) {
    const last = merged.at(-1);
    const text = piece.kind === "text" || piece.kind === "bold";
    if (text && last?.kind === piece.kind && last.end === piece.raw) {
      merged[merged.length - 1] = {
        ...last,
        text: last.text + piece.text,
        end: piece.end,
      };
    } else {
      merged.push({ ...piece });
    }
  }
  return merged;
}

export function wrapAgentRunInline(inline, size, maxWidth) {
  const lines = [];
  let line = [];
  let width = 0;
  let pending;
  for (const atom of atomsOf(inline, size)) {
    if (atom.space) {
      if (line.length > 0) pending = atom;
      continue;
    }
    const gap = pending ? pending.width : 0;
    if (line.length > 0 && width + gap + atom.width > maxWidth) {
      lines.push(line);
      line = [...atom.pieces];
      width = atom.width;
    } else {
      if (pending && line.length > 0) {
        line.push(...pending.pieces);
        width += gap;
      }
      line.push(...atom.pieces);
      width += atom.width;
    }
    pending = undefined;
  }
  if (line.length > 0) lines.push(line);
  return lines.map(mergePieces);
}

function plainInline(text, raw) {
  return text.length > 0
    ? [{ kind: "text", text, raw, end: raw + text.length }]
    : [];
}

function textLines(pieces, lineHeight, raw) {
  if (pieces.length === 0) {
    return [{ y: 0, height: lineHeight, raw, pieces: [] }];
  }
  return pieces.map((line, index) => ({
    y: index * lineHeight,
    height: lineHeight,
    raw: line[0]?.raw ?? raw,
    pieces: line,
  }));
}

const PUNCT = "<>{}()[]/=;,.:+-*&|!?";

export function getAgentRunCodePieces(line) {
  const pieces = [];
  const push = (kind, from, to) => {
    if (to <= from) return;
    const last = pieces.at(-1);
    if (last?.kind === kind && last.end === line.raw + from) {
      pieces[pieces.length - 1] = {
        ...last,
        text: last.text + line.text.slice(from, to),
        end: line.raw + to,
      };
      return;
    }
    pieces.push({
      kind,
      text: line.text.slice(from, to),
      raw: line.raw + from,
      end: line.raw + to,
    });
  };
  let index = 0;
  while (index < line.text.length) {
    const char = line.text[index];
    if (line.text.startsWith("//", index)) {
      push("comment", index, line.text.length);
      break;
    }
    if (char === '"' || char === "'" || char === "`") {
      const close = line.text.indexOf(char, index + 1);
      const stop = close === -1 ? line.text.length : close + 1;
      push("string", index, stop);
      index = stop;
      continue;
    }
    if (PUNCT.includes(char)) {
      push("punct", index, index + 1);
      index += 1;
      continue;
    }
    push("text", index, index + 1);
    index += 1;
  }
  return pieces;
}

export function getAgentRunFrame(width, height) {
  const frameWidth = Math.max(1, finite(width, 1280));
  const frameHeight = Math.max(1, finite(height, 720));
  const scale = Math.min(
    frameHeight / REF_HEIGHT,
    frameWidth / (PANEL_W + 2 * MARGIN_X),
  );
  const panelHeight = clamp(
    frameHeight / scale - 2 * MARGIN_Y,
    MIN_PANEL_H,
    MAX_PANEL_H,
  );
  return {
    width: frameWidth,
    height: frameHeight,
    unit: round(scale),
    panelWidth: PANEL_W,
    panelHeight: round(panelHeight),
    viewport: round(panelHeight - HEADER_H - 2),
  };
}

function planTextOf(run) {
  return (run.plan ?? []).join("");
}

export function getAgentRunTimeline(
  run = defaultAgentRun,
  options = {},
) {
  const seed = seedOf(options.seed);
  const compression = compressionOf(options.compression);
  const perFrame = compression / 30;
  const planText = planTextOf(run);
  const planChunks =
    planText.length > 0 ? getAgentRunChunks(planText, seed, "plan") : [];
  const planStart = RUN_START + THINK_LEAD;
  const planEnd = planStart + lastArrival(planChunks);
  const thinkEnd = planEnd + THINK_TAIL;
  const segments = [];
  let real = 0;
  const push = (
    kind,
    from,
    to,
    seconds,
  ) => {
    segments.push({ kind, from, to, realFrom: real, real: seconds });
    real += seconds;
  };
  push("think", RUN_START, thinkEnd, (thinkEnd - RUN_START) * perFrame);
  const thinkSeconds = real;
  const tools = [];
  let cursor = thinkEnd;
  for (const [index, step] of (run.steps ?? []).entries()) {
    push("gap", cursor, cursor + TOOL_GAP, TOOL_GAP * perFrame);
    cursor += TOOL_GAP;
    const duration = Math.max(0, finite(step.duration, 0));
    const span = clamp(Math.round(duration / perFrame), TOOL_MIN, TOOL_MAX);
    const realStart = real;
    push("tool", cursor, cursor + span, duration);
    tools.push({
      index,
      start: cursor,
      end: cursor + span,
      span,
      duration,
      realStart,
    });
    cursor += span;
  }
  push("gap", cursor, cursor + ANSWER_GAP, ANSWER_GAP * perFrame);
  const answerStart = cursor + ANSWER_GAP;
  const answerChunks = getAgentRunChunks(run.answer, seed, "answer");
  const answerEnd = answerStart + lastArrival(answerChunks);
  push("answer", answerStart, answerEnd, (answerEnd - answerStart) * perFrame);
  return {
    compression,
    runStart: RUN_START,
    planStart,
    planEnd,
    thinkEnd,
    thinkSeconds,
    tools,
    answerStart,
    answerEnd,
    runEnd: answerEnd,
    settled: answerEnd + SETTLE,
    realTotal: real,
    segments,
    planChunks,
    answerChunks,
  };
}

export const agentRunLength = getAgentRunTimeline().settled;

export function getAgentRunDuration(
  run = defaultAgentRun,
  options = {},
) {
  const rate = rateOf(options.speed);
  if (rate === 0) return HOLD;
  const { settled } = getAgentRunTimeline(run, options);
  return Math.ceil(round(settled / rate)) + HOLD;
}

export function getAgentRunTime(
  frame,
  playback = {},
) {
  const fps = Math.max(1, finite(playback.fps, 30));
  return Math.max(0, finite(frame, 0)) * (30 / fps) * rateOf(playback.speed);
}

export function getAgentRunElapsed(time, timeline) {
  if (!(time > timeline.runStart)) return 0;
  for (const segment of timeline.segments) {
    if (segment.to > segment.from && time < segment.to) {
      const share = (time - segment.from) / (segment.to - segment.from);
      return segment.realFrom + share * segment.real;
    }
  }
  return timeline.realTotal;
}

const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i;

function chipWidth(label) {
  return 7 + 12 + 5 + estimateAgentRunWidth(label, CHIP_SIZE) + 9 + 2;
}

function moreWidth(count) {
  return 9 + estimateAgentRunWidth(`+${count}`, CHIP_SIZE) + 9 + 2;
}

export function fitAgentRunChips(sources) {
  const chips = [];
  let used = 0;
  for (const [index, label] of sources.entries()) {
    if (chips.length >= CHIP_MAX) break;
    const width = chipWidth(label) + (chips.length > 0 ? CHIP_GAP : 0);
    const rest = sources.length - index - 1;
    const reserve = rest > 0 ? CHIP_GAP + moreWidth(rest) : 0;
    if (used + width + reserve > CHIP_ROOM) break;
    chips.push({ label, icon: DOMAIN.test(label) ? "globe" : "file" });
    used += width;
  }
  return { chips, more: sources.length - chips.length };
}

const lineText = (line) =>
  line.map((piece) => piece.text).join("");

function blockGap(
  previous,
  next,
) {
  if (previous === undefined) return 0;
  if (previous === "item" && next === "item") return ITEM_GAP;
  if (previous === "code" || next === "code") return CODE_GAP;
  if (previous === "heading") return HEADING_GAP;
  return BLOCK_GAP;
}

export function getAgentRunLayout(run = defaultAgentRun) {
  let y = PAD_TOP;
  const prompt = plainInline(run.prompt, 0);
  const wrappedPrompt = wrapAgentRunInline(prompt, BUBBLE_SIZE, BUBBLE_WIDTH);
  const promptLines = wrappedPrompt.map(lineText);
  const bubble = {
    y,
    height: Math.max(1, promptLines.length) * BUBBLE_LINE + 2 * BUBBLE_PAD_Y,
    lines: promptLines,
  };
  y += bubble.height + BUBBLE_GAP;
  const status = { y, height: STATUS_H };
  y += STATUS_H;
  let plan = null;
  const planLines = run.plan ?? [];
  if (planLines.length > 0) {
    y += STATUS_GAP;
    const items = [];
    let cursor = 0;
    let raw = 0;
    for (const [index, text] of planLines.entries()) {
      if (index > 0) cursor += PLAN_GAP;
      const inline = plainInline(text, raw);
      const wrapped = wrapAgentRunInline(inline, PLAN_SIZE, PLAN_WIDTH);
      const lines = textLines(wrapped, PLAN_LINE, raw);
      items.push({ index, y: cursor, raw, lines });
      cursor += lines.length * PLAN_LINE;
      raw += text.length + 1;
    }
    plan = { y, height: cursor, items };
    y += cursor;
  }
  let tools = null;
  const steps = run.steps ?? [];
  if (steps.length > 0) {
    y += PLAN_AFTER;
    const rows = [];
    let cursor = 0;
    for (const [index, step] of steps.entries()) {
      const sources = step.sources ?? [];
      const fit = fitAgentRunChips(sources);
      const height =
        ROW_H + (index > 0 ? 1 : 0) + (sources.length > 0 ? CHIPS_H : 0);
      rows.push({
        index,
        y: cursor,
        height,
        divider: index > 0,
        icon: step.icon ?? (sources.length > 0 ? "book" : "terminal"),
        name: step.name,
        detail: step.detail ?? "",
        duration: formatAgentRunSeconds(finite(step.duration, 0)),
        chips: fit.chips,
        more: fit.more,
      });
      cursor += height;
    }
    tools = { y, height: cursor + 2, rows };
    y += cursor + 2;
  }
  const parsed = parseAgentRunMarkdown(run.answer);
  const blocks = [];
  if (parsed.length > 0) y += tools ? TOOLS_AFTER : PLAN_AFTER;
  let previous;
  for (const [index, block] of parsed.entries()) {
    y += blockGap(previous, block.kind);
    previous = block.kind;
    if (block.kind === "heading") {
      const spec = HEADINGS[block.level];
      const wrapped = wrapAgentRunInline(block.inline, spec.size, MEASURE);
      const lines = textLines(wrapped, spec.line, block.body);
      const mark = run.answer.slice(block.raw, block.body);
      blocks.push({
        kind: "heading",
        index,
        y,
        height: lines.length * spec.line,
        level: block.level,
        raw: block.raw,
        end: block.end,
        mark,
        markWidth: round(estimateAgentRunWidth(mark, BODY_SIZE)),
        lines,
      });
      y += lines.length * spec.line;
      continue;
    }
    if (block.kind === "code") {
      const lines = block.lines.map((line, row) => ({
        y: row * CODE_LINE,
        height: CODE_LINE,
        raw: line.raw,
        pieces: getAgentRunCodePieces(line),
      }));
      const height = CODE_HEAD + 2 * CODE_PAD + lines.length * CODE_LINE;
      blocks.push({
        kind: "code",
        index,
        y,
        height,
        raw: block.raw,
        open: block.open,
        lang: block.lang,
        langRaw: block.langRaw,
        lines,
      });
      y += height;
      continue;
    }
    const width = block.kind === "item" ? MEASURE - ITEM_INDENT : MEASURE;
    const body = block.kind === "item" ? block.body : block.raw;
    const wrapped = wrapAgentRunInline(block.inline, BODY_SIZE, width);
    const lines = textLines(wrapped, BODY_LINE, body);
    blocks.push({
      kind: block.kind,
      index,
      y,
      height: lines.length * BODY_LINE,
      raw: block.raw,
      lines,
    });
    y += lines.length * BODY_LINE;
  }
  return { bubble, status, plan, tools, blocks, height: y };
}

export function getAgentRunGrowth(
  layout,
  timeline,
) {
  const events = [
    { at: BUBBLE_AT, bottom: layout.bubble.y + layout.bubble.height },
    { at: RUN_START, bottom: layout.status.y + layout.status.height },
  ];
  const { plan, tools } = layout;
  if (plan) {
    for (const item of plan.items) {
      for (const line of item.lines) {
        const at = getAgentRunArrival(timeline.planChunks, line.raw);
        events.push({
          at: timeline.planStart + at,
          bottom: plan.y + item.y + line.y + line.height,
        });
      }
    }
  }
  if (tools) {
    for (const row of tools.rows) {
      const span = timeline.tools[row.index];
      events.push({ at: span.start, bottom: tools.y + row.y + row.height + 2 });
    }
  }
  const arrival = (offset) =>
    timeline.answerStart + getAgentRunArrival(timeline.answerChunks, offset);
  for (const block of layout.blocks) {
    if (block.kind === "code") {
      events.push({
        at: arrival(block.open - 1),
        bottom: block.y + CODE_HEAD + 2 * CODE_PAD,
      });
      for (const line of block.lines) {
        events.push({
          at: arrival(line.raw),
          bottom: block.y + CODE_HEAD + 2 * CODE_PAD + line.y + line.height,
        });
      }
      continue;
    }
    for (const [row, line] of block.lines.entries()) {
      const start = row === 0 ? block.raw : line.raw;
      events.push({
        at: arrival(start),
        bottom: block.y + line.y + line.height,
      });
    }
  }
  return events
    .filter((event) => Number.isFinite(event.at))
    .sort((a, b) => a.at - b.at);
}

export function getAgentRunScrollSteps(layout, timeline, viewport) {
  const steps = [];
  let target = 0;
  for (const event of getAgentRunGrowth(layout, timeline)) {
    const next = Math.max(target, event.bottom + SAFE - viewport);
    if (next > target) {
      steps.push({ at: event.at, delta: round(next - target) });
    }
    target = next;
  }
  return steps;
}

export function getAgentRunScroll(
  time,
  steps,
) {
  let total = 0;
  for (const step of steps) {
    const since = time - step.at + SCROLL_LEAD;
    if (since <= 0) break;
    total += step.delta * smoothstep(since / SCROLL);
  }
  return total;
}

export function getAgentRunModel(
  run = defaultAgentRun,
  options = {},
) {
  const stage = getAgentRunFrame(options.width, options.height);
  const timeline = getAgentRunTimeline(run, options);
  const layout = getAgentRunLayout(run);
  const scroll = getAgentRunScrollSteps(layout, timeline, stage.viewport);
  return { run, stage, timeline, layout, scroll };
}

export function getAgentRunSpinner(time, start, end) {
  const spinning = clamp(time - start, 0, Math.max(0, end - start));
  const since = time - end;
  const settle = progress(since / RESOLVE);
  const coast = SPIN * RESOLVE * (settle - (settle * settle) / 2);
  return {
    angle: round(spinning * SPIN + coast - 90),
    arc: round(ARC + (1 - ARC) * expo(since / RESOLVE)),
    done: round(smoothstep(since / RESOLVE)),
    check: round(easeOut((since - CHECK_FROM) / (CHECK_TO - CHECK_FROM))),
    resolved: since >= 0,
  };
}

export function getAgentRunShimmer(time, length) {
  const cycle = (time - RUN_START) / SHIMMER_PERIOD;
  const phase = cycle - Math.floor(cycle);
  const center = -SHIMMER_BAND + phase * (length + 2 * SHIMMER_BAND);
  return Array.from({ length }, (_, index) => {
    const distance = Math.abs(index + 0.5 - center) / SHIMMER_BAND;
    const band = distance < 1 ? (1 - distance * distance) ** 2 : 0;
    return round(SHIMMER_BASE + (1 - SHIMMER_BASE) * band);
  });
}

const fadeOf = (since) => round(easeOut((since + 1) / FADE));

function spansOf(pieces, chunks, local, revealed) {
  const spans = [];
  for (const piece of pieces) {
    if (piece.kind === "cite") {
      if (revealed < piece.end) continue;
      const since = local - getAgentRunArrival(chunks, piece.end - 1);
      spans.push({
        kind: "cite",
        fragments: [{ text: piece.text, opacity: 1 }],
        opacity: round(easeOut((since + 1) / 4)),
        scale: round(0.6 + 0.4 * backOut((since + 1) / POP, CITE_BACK)),
      });
      continue;
    }
    const visible = clamp(revealed - piece.raw, 0, piece.text.length);
    if (visible === 0) continue;
    const fragments = [];
    let offset = 0;
    while (offset < visible) {
      const index = chunkIndexAt(chunks, piece.raw + offset);
      const chunk = chunks[index];
      const stop = chunk ? Math.min(visible, chunk.end - piece.raw) : visible;
      const opacity = chunk ? fadeOf(local - chunk.at) : 1;
      const text = piece.text.slice(offset, stop);
      const last = fragments.at(-1);
      if (last?.opacity === 1 && opacity === 1) {
        fragments[fragments.length - 1] = { text: last.text + text, opacity };
      } else {
        fragments.push({ text, opacity });
      }
      offset = Math.max(stop, offset + 1);
    }
    spans.push({ kind: piece.kind, fragments, opacity: 1, scale: 1 });
  }
  return spans;
}

function blockState(block, text, chunks, local, revealed) {
  const key = `block-${block.index}`;
  const lineStates = (from) => {
    const lines = [];
    for (const [row, line] of block.lines.entries()) {
      if (revealed <= (row === 0 ? from : line.raw)) break;
      lines.push({
        key: `${key}-line-${row}`,
        y: line.y,
        height: line.height,
        spans: spansOf(line.pieces, chunks, local, revealed),
      });
    }
    return lines;
  };
  if (block.kind === "code") {
    if (revealed < block.open) return null;
    const since = local - getAgentRunArrival(chunks, block.open - 1);
    let height = expo((since + 1) / CODE_OPEN) * (CODE_HEAD + 2 * CODE_PAD);
    const lines = [];
    for (const [row, line] of block.lines.entries()) {
      if (revealed <= line.raw) break;
      const grown = local - getAgentRunArrival(chunks, line.raw);
      height += expo((grown + 1) / LINE_GROW) * CODE_LINE;
      lines.push({
        key: `${key}-line-${row}`,
        y: line.y,
        height: line.height,
        spans: spansOf(line.pieces, chunks, local, revealed),
      });
    }
    const langShown = clamp(revealed - block.langRaw, 0, block.lang.length);
    return {
      kind: "code",
      key,
      y: block.y,
      height: round(height),
      opacity: round(easeOut((since + 1) / 4)),
      lang: block.lang.slice(0, langShown),
      lines,
    };
  }
  if (revealed <= block.raw) return null;
  if (block.kind === "heading") {
    const complete =
      revealed > block.end ||
      (block.end >= text.length && revealed >= block.end);
    const completeAt = getAgentRunArrival(
      chunks,
      Math.min(block.end, text.length - 1),
    );
    const morph = complete ? round(expo((local - completeAt) / MORPH)) : 0;
    const markShown = clamp(revealed - block.raw, 0, block.mark.length);
    return {
      kind: "heading",
      key,
      y: block.y,
      level: block.level,
      styled: complete,
      morph,
      mark: block.mark.slice(0, markShown),
      markWidth: block.markWidth,
      lines: lineStates(block.raw),
    };
  }
  if (block.kind === "item") {
    const since = local - getAgentRunArrival(chunks, block.raw);
    return {
      kind: "item",
      key,
      y: block.y,
      dot: round(backOut((since + 1) / POP, DOT_BACK)),
      dotOpacity: round(easeOut((since + 1) / 3)),
      lines: lineStates(block.raw),
    };
  }
  return { kind: "paragraph", key, y: block.y, lines: lineStates(block.raw) };
}

function planState(
  plan,
  chunks,
  local,
) {
  const revealed = getAgentRunReveal(chunks, local);
  const items = [];
  let rule = 0;
  for (const item of plan.items) {
    if (revealed <= item.raw) break;
    const lines = [];
    for (const [row, line] of item.lines.entries()) {
      if (revealed <= (row === 0 ? item.raw : line.raw)) break;
      const since = local - getAgentRunArrival(chunks, line.raw);
      const grown = line.height * expo((since + 1) / LINE_GROW);
      rule = Math.max(rule, item.y + line.y + grown);
      lines.push({
        key: `plan-${item.index}-line-${row}`,
        y: line.y,
        height: line.height,
        spans: spansOf(line.pieces, chunks, local, revealed),
      });
    }
    const numbered = local - getAgentRunArrival(chunks, item.raw);
    items.push({
      key: `plan-${item.index}`,
      index: item.index,
      y: item.y,
      numberOpacity: fadeOf(numbered),
      lines,
    });
  }
  return { y: plan.y, rule: round(rule), items };
}

function chipPops(count, since, span) {
  const spread = Math.max(0, CHIP_SPAN * span - CHIP_LEAD);
  const step = count > 1 ? spread / (count - 1) : 0;
  return Array.from({ length: count }, (_, index) => {
    const age = since - CHIP_LEAD - index * step;
    return {
      visible: age >= 0,
      opacity: round(easeOut((age + 1) / 4)),
      scale: round(0.8 + 0.2 * backOut((age + 1) / POP, CHIP_BACK)),
    };
  });
}

function toolsState(
  tools,
  timeline,
  time,
) {
  let height = 2;
  const rows = tools.rows
    .filter((row) => time >= timeline.tools[row.index].start)
    .map((row) => {
      const span = timeline.tools[row.index];
      const since = time - span.start;
      const open = expo(since / ROW_IN);
      height += row.height * open;
      const pops = chipPops(
        row.chips.length + (row.more > 0 ? 1 : 0),
        since,
        span.span,
      );
      const more = pops[row.chips.length];
      return {
        key: `tool-${row.index}`,
        index: row.index,
        y: row.y,
        height: round(row.height * open),
        divider: row.divider,
        icon: row.icon,
        name: row.name,
        detail: row.detail,
        duration: row.duration,
        content: round(easeOut((since - 1) / ROW_FADE)),
        spinner: getAgentRunSpinner(time, span.start, span.end),
        label: round(easeOut((time - span.end - LABEL_DELAY) / LABEL_FADE)),
        chips: row.chips.map((chip, index) => ({ ...chip, ...pops[index] })),
        more: row.more > 0 && more ? { count: row.more, ...more } : null,
        sources: row.chips.length + row.more > 0,
      };
    });
  return { y: tools.y, height: round(height), rows };
}

export function getAgentRunState(
  frame,
  model = getAgentRunModel(),
  playback = {},
) {
  const time = getAgentRunTime(frame, playback);
  const { run, stage, timeline, layout } = model;
  const elapsed = getAgentRunElapsed(time, timeline);
  const planLocal = time - timeline.planStart;
  const answerLocal = time - timeline.answerStart;
  const answerRevealed = getAgentRunReveal(timeline.answerChunks, answerLocal);
  const running = time - RUN_START;
  const swap =
    time >= timeline.thinkEnd ? expo((time - timeline.thinkEnd) / SWAP) : 0;
  const thinking = "Thinking";
  const blocks = [];
  for (const block of layout.blocks) {
    const next = blockState(
      block,
      run.answer,
      timeline.answerChunks,
      answerLocal,
      answerRevealed,
    );
    if (next) blocks.push(next);
  }
  return {
    time,
    elapsed,
    scroll: round(getAgentRunScroll(time, model.scroll)),
    panel: {
      width: stage.panelWidth,
      height: stage.panelHeight,
      viewport: stage.viewport,
      unit: stage.unit,
      opacity: round(easeOut((time + 1) / PANEL_IN)),
      lift: round(PANEL_RISE * (1 - expo(time / PANEL_IN))),
    },
    header: {
      title: run.title ?? "",
      label: formatAgentRunSeconds(elapsed),
      opacity: round(easeOut((running + 1) / STATUS_IN)),
      spinner: getAgentRunSpinner(time, RUN_START, timeline.runEnd),
      done: time >= timeline.runEnd,
    },
    bubble: {
      y: layout.bubble.y,
      height: layout.bubble.height,
      lines: layout.bubble.lines,
      opacity: round(easeOut((time - BUBBLE_AT + 1) / BUBBLE_IN)),
      lift: round(BUBBLE_RISE * (1 - expo((time - BUBBLE_AT) / BUBBLE_IN))),
    },
    status: {
      y: layout.status.y,
      visible: running >= 0,
      opacity: round(easeOut((running + 1) / STATUS_IN)),
      thinking,
      shimmer: getAgentRunShimmer(time, thinking.length),
      thought: `Thought for ${Math.max(1, Math.round(timeline.thinkSeconds))}s`,
      swap: round(swap),
      lift: round(SWAP_RISE * (1 - swap)),
    },
    plan: layout.plan
      ? planState(layout.plan, timeline.planChunks, planLocal)
      : null,
    tools: layout.tools ? toolsState(layout.tools, timeline, time) : null,
    blocks,
    revealed: {
      plan: getAgentRunReveal(timeline.planChunks, planLocal),
      answer: answerRevealed,
    },
  };
}

export const AGENT_RUN_THEMES = {
  light: {
    panel: "#ffffff",
    border: "#e4e4e0",
    divider: "#ededea",
    fg: "#1c1c1a",
    muted: "#63635e",
    subtle: "#9a9a94",
    surface: "#f3f3f1",
    surfaceBorder: "#e7e7e3",
    code: "#f8f8f6",
    track: "#e3e3df",
    shadow: "0 1px 2px rgba(28, 28, 26, 0.06)",
  },
  dark: {
    panel: "#161616",
    border: "#2b2b2a",
    divider: "#232322",
    fg: "#ececea",
    muted: "#a2a29d",
    subtle: "#6d6d68",
    surface: "#212120",
    surfaceBorder: "#2e2e2d",
    code: "#1c1c1b",
    track: "#343433",
    shadow: "0 1px 2px rgba(0, 0, 0.5)",
  },
};

export function getAgentRunPalette(theme = agentRunDefaults.theme, accentColor = agentRunDefaults.accentColor) {
  const dark = theme === "dark";
  const tint = dark ? 22 : 12;
  return {
    ...AGENT_RUN_THEMES[dark ? "dark" : "light"],
    accent: accentColor,
    accentTint: `color-mix(in srgb, ${accentColor} ${tint}%, transparent)`,
    accentText: dark
      ? `color-mix(in srgb, ${accentColor} 62%, #ffffff)`
      : accentColor,
  };
}

const ICONS = {
  chart: [
    { tag: "path", d: "M3 3v16a2 2 0 2h16" },
    { tag: "path", d: "M18 17V9" },
    { tag: "path", d: "M13 17V5" },
    { tag: "path", d: "M8 17v-3" },
  ],
  database: [
    { tag: "ellipse", cx: 12, cy: 5, rx: 9, ry: 3 },
    { tag: "path", d: "M3 5V19A9 3 0 21 19V5" },
    { tag: "path", d: "M3 12A9 3 0 21 12" },
  ],
  search: [
    { tag: "path", d: "m21 21-4.34-4.34" },
    { tag: "circle", cx: 11, cy: 11, r: 8 },
  ],
  book: [
    { tag: "path", d: "M12 7v14" },
    {
      tag: "path",
      d: "M3 18a1 1 0 1-1-1V4a1 1-1h5a4 4 4-4h5a1 1v13a1 1-1 1h-6a3 3 0-3 0-3-3z",
    },
  ],
  globe: [
    { tag: "circle", cx: 12, cy: 12, r: 10 },
    { tag: "path", d: "M12 2a14.5 14.5 0 20 0-20" },
    { tag: "path", d: "M2 12h20" },
  ],
  terminal: [
    { tag: "path", d: "M12 19h8" },
    { tag: "path", d: "m4 17 6-6-6-6" },
  ],
  file: [
    {
      tag: "path",
      d: "M6 22a2 2 0 1-2-2V4a2 1 2-2h8a2.4 2.4 1.704.706l3.588 3.588A2.4 20 8v12a2 1-2 2z",
    },
    { tag: "path", d: "M14 2v5a1 1 0 1h5" },
    { tag: "path", d: "M10 9H8" },
    { tag: "path", d: "M16 13H8" },
    { tag: "path", d: "M16 17H8" },
  ],
  copy: [
    { tag: "rect", x: 8, y: 8, width: 14, height: 14, rx: 2 },
    {
      tag: "path",
      d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9",
    },
  ],
};

function Icon({
  name,
  size,
  color
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
    >
      {ICONS[name].map((node, index) => {
        if (node.tag === "path") return <path key={index} d={node.d} />;
        if (node.tag === "circle") {
          return <circle key={index} cx={node.cx} cy={node.cy} r={node.r} />;
        }
        if (node.tag === "ellipse") {
          return (
            <ellipse
              key={index}
              cx={node.cx}
              cy={node.cy}
              rx={node.rx}
              ry={node.ry}
            />
          );
        }
        return (
          <rect
            key={index}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={node.rx}
          />
        );
      })}
    </svg>
  );
}

function Spinner({
  state,
  size,
  palette
}) {
  const active = 1 - state.done;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 24"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle cx={12} cy={12} r={10} stroke={palette.track} opacity={active} />
      <circle
        cx={12}
        cy={12}
        r={10}
        stroke={palette.accent}
        opacity={active}
        strokeDasharray={`${round(state.arc * CIRCLE)} ${round(CIRCLE)}`}
        transform={`rotate(${state.angle} 12 12)`}
      />
      <circle
        cx={12}
        cy={12}
        r={10}
        stroke={palette.muted}
        opacity={state.done}
      />
      <path
        d="m9 12 2 4-4"
        stroke={palette.muted}
        strokeDasharray={round(CHECK_LENGTH)}
        strokeDashoffset={round(CHECK_LENGTH * (1 - state.check))}
        opacity={state.check > 0 ? 1 : 0}
      />
    </svg>
  );
}

function spanStyle(span, palette) {
  if (span.kind === "bold") return { fontWeight: 600 };
  if (span.kind === "code") {
    return {
      fontFamily: MONO,
      fontSize: "0.875em",
      padding: "1px 5px",
      borderRadius: 5,
      background: palette.surface,
      border: `1px solid ${palette.surfaceBorder}`,
    };
  }
  if (span.kind === "cite") {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      marginLeft: 2,
      borderRadius: 9,
      boxSizing: "border-box",
      background: palette.accentTint,
      color: palette.accentText,
      fontSize: 11.5,
      fontWeight: 600,
      lineHeight: "18px",
      fontVariantNumeric: "tabular-nums",
      verticalAlign: "middle",
      opacity: span.opacity,
      transform: `scale(${span.scale})`,
    };
  }
  if (span.kind === "punct" || span.kind === "comment") {
    return { color: palette.subtle };
  }
  if (span.kind === "string") return { color: palette.muted };
  return {};
}

function renderSpans(spans, palette) {
  return spans.map((span, index) => (
    <span key={index} style={spanStyle(span, palette)}>
      {span.fragments.map((fragment, part) => (
        <span
          key={part}
          style={
            fragment.opacity < 1 ? { opacity: fragment.opacity } : undefined
          }
        >
          {fragment.text}
        </span>
      ))}
    </span>
  ));
}

function AnswerBlock({
  block,
  palette
}) {
  if (block.kind === "code") {
    return (
      <div
        style={{
          position: "absolute",
          top: block.y,
          left: 0,
          width: COLUMN,
          height: block.height,
          opacity: block.opacity,
          overflow: "hidden",
          boxSizing: "border-box",
          border: `1px solid ${palette.surfaceBorder}`,
          borderRadius: 10,
          background: palette.code,
        }}
      >
        <div
          style={{
            height: CODE_HEAD,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 16px",
            borderBottom: `1px solid ${palette.divider}`,
            fontFamily: MONO,
            fontSize: 12.5,
            color: palette.muted,
          }}
        >
          <span>{block.lang}</span>
          <Icon name="copy" size={14} color={palette.subtle} />
        </div>
        {block.lines.map((line) => (
          <div
            key={line.key}
            style={{
              position: "absolute",
              top: CODE_HEAD + CODE_PAD - 1 + line.y,
              left: 16,
              height: line.height,
              lineHeight: `${line.height}px`,
              fontFamily: MONO,
              fontSize: CODE_SIZE,
              whiteSpace: "pre",
              color: palette.fg,
            }}
          >
            {renderSpans(line.spans, palette)}
          </div>
        ))}
      </div>
    );
  }
  if (block.kind === "heading") {
    const spec = HEADINGS[block.level];
    const from = BODY_SIZE / spec.size;
    const scale = block.styled ? from + (1 - from) * block.morph : 1;
    return (
      <div>
        {block.lines.map((line, index) => (
          <div
            key={line.key}
            style={{
              position: "absolute",
              top: block.y + line.y,
              left: 0,
              height: line.height,
              display: "flex",
              alignItems: "center",
              whiteSpace: "pre",
            }}
          >
            {index === 0 && block.mark.length > 0 && block.morph < 1 ? (
              <span
                style={{
                  maxWidth: block.markWidth * (1 - block.morph),
                  overflow: "hidden",
                  flexShrink: 0,
                  opacity: 1 - block.morph,
                  fontSize: BODY_SIZE,
                  color: palette.subtle,
                }}
              >
                {block.mark}
              </span>
            ) : null}
            <span
              style={{
                fontSize: block.styled ? spec.size : BODY_SIZE,
                fontWeight: Math.round(400 + 200 * block.morph),
                lineHeight: 1.25,
                transform: `scale(${round(scale)})`,
                transformOrigin: "0 50%",
              }}
            >
              {renderSpans(line.spans, palette)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  const indent = block.kind === "item" ? ITEM_INDENT : 0;
  return (
    <div>
      {block.kind === "item" ? (
        <div
          style={{
            position: "absolute",
            top: block.y + BODY_LINE / 2 - 3,
            left: 5,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: palette.fg,
            opacity: block.dotOpacity,
            transform: `scale(${block.dot})`,
          }}
        />
      ) : null}
      {block.lines.map((line) => (
        <div
          key={line.key}
          style={{
            position: "absolute",
            top: block.y + line.y,
            left: indent,
            height: line.height,
            lineHeight: `${line.height}px`,
            whiteSpace: "pre",
          }}
        >
          {renderSpans(line.spans, palette)}
        </div>
      ))}
    </div>
  );
}

function Header({
  header,
  palette
}) {
  return (
    <div
      style={{
        height: HEADER_H,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: `0 ${PAD_X}px`,
        borderBottom: `1px solid ${palette.divider}`,
      }}
    >
      <span
        style={{
          minWidth: 0,
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {header.title}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          flexShrink: 0,
          opacity: header.opacity,
        }}
      >
        <Spinner state={header.spinner} size={14} palette={palette} />
        <span
          style={{
            minWidth: 38,
            fontSize: 13,
            color: palette.muted,
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
          }}
        >
          {header.label}
        </span>
      </div>
    </div>
  );
}

function Bubble({
  bubble,
  palette
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: bubble.y,
        right: 0,
        padding: `${BUBBLE_PAD_Y}px ${BUBBLE_PAD_X}px`,
        borderRadius: 18,
        background: palette.surface,
        fontSize: BUBBLE_SIZE,
        lineHeight: `${BUBBLE_LINE}px`,
        whiteSpace: "pre",
        opacity: bubble.opacity,
        transform: `translateY(${bubble.lift}px)`,
      }}
    >
      {bubble.lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}

function Status({
  status,
  palette
}) {
  if (!status.visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: status.y,
        left: 0,
        width: COLUMN,
        height: STATUS_H,
        fontSize: 15,
        fontWeight: 500,
        lineHeight: `${STATUS_H}px`,
        whiteSpace: "pre",
        opacity: status.opacity,
      }}
    >
      {status.swap < 1 ? (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 1 - status.swap,
          }}
        >
          {status.shimmer.map((level, index) => (
            <span key={index} style={{ opacity: level }}>
              {status.thinking[index]}
            </span>
          ))}
        </span>
      ) : null}
      {status.swap > 0 ? (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: palette.muted,
            opacity: status.swap,
            transform: `translateY(${status.lift}px)`,
          }}
        >
          {status.thought}
        </span>
      ) : null}
    </div>
  );
}

function Plan({
  plan,
  palette
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: plan.y,
        left: 0,
        width: COLUMN,
        fontSize: PLAN_SIZE,
        color: palette.muted,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 2,
          height: plan.rule,
          borderRadius: 1,
          background: palette.track,
        }}
      />
      {plan.items.map((item) => (
        <div key={item.key}>
          <span
            style={{
              position: "absolute",
              top: item.y,
              left: 14,
              lineHeight: `${PLAN_LINE}px`,
              color: palette.subtle,
              fontVariantNumeric: "tabular-nums",
              opacity: item.numberOpacity,
            }}
          >
            {`${item.index + 1}.`}
          </span>
          {item.lines.map((line) => (
            <div
              key={line.key}
              style={{
                position: "absolute",
                top: item.y + line.y,
                left: PLAN_INDENT,
                height: line.height,
                lineHeight: `${line.height}px`,
                whiteSpace: "pre",
              }}
            >
              {renderSpans(line.spans, palette)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function chipStyle(palette, pop, padding) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    height: 24,
    boxSizing: "border-box",
    padding,
    borderRadius: 7,
    border: `1px solid ${palette.surfaceBorder}`,
    background: palette.surface,
    fontSize: CHIP_SIZE,
    color: palette.muted,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    opacity: pop.opacity,
    transform: `scale(${pop.scale})`,
  };
}

function ToolRow({
  row,
  palette
}) {
  const chips = row.chips.filter((chip) => chip.visible);
  return (
    <div
      style={{
        position: "absolute",
        top: row.y,
        left: 0,
        right: 0,
        height: row.height,
        overflow: "hidden",
        boxSizing: "border-box",
        borderTop: row.divider ? `1px solid ${palette.divider}` : undefined,
      }}
    >
      <div
        style={{
          height: ROW_H,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
          opacity: row.content,
        }}
      >
        <Icon name={row.icon} size={16} color={palette.muted} />
        <span
          style={{
            flexShrink: 0,
            fontSize: 15,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {row.name}
        </span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: palette.muted,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.detail}
        </span>
        <span
          style={{
            fontSize: 13,
            color: palette.muted,
            fontVariantNumeric: "tabular-nums",
            opacity: row.label,
          }}
        >
          {row.duration}
        </span>
        <Spinner state={row.spinner} size={16} palette={palette} />
      </div>
      {row.sources ? (
        <div
          style={{
            display: "flex",
            gap: CHIP_GAP,
            height: CHIPS_H,
            padding: "0 14px 40px",
            opacity: row.content,
          }}
        >
          {chips.map((chip, index) => (
            <span
              key={`${index}-${chip.label}`}
              style={chipStyle(palette, chip, "0 9px 7px")}
            >
              <Icon name={chip.icon} size={12} color={palette.subtle} />
              {chip.label}
            </span>
          ))}
          {row.more?.visible ? (
            <span style={chipStyle(palette, row.more, "0 9px")}>
              {`+${row.more.count}`}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Tools({
  tools,
  palette
}) {
  if (tools.rows.length === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: tools.y,
        left: 0,
        width: COLUMN,
        height: tools.height,
        boxSizing: "border-box",
        overflow: "hidden",
        border: `1px solid ${palette.surfaceBorder}`,
        borderRadius: 12,
      }}
    >
      {tools.rows.map((row) => (
        <ToolRow key={row.key} row={row} palette={palette} />
      ))}
    </div>
  );
}

export function AgentRun({
  run = agentRunDefaults.run,
  theme = agentRunDefaults.theme,
  accentColor = agentRunDefaults.accentColor,
  compression = agentRunDefaults.compression,
  seed = agentRunDefaults.seed,
  speed = agentRunDefaults.speed,
  className
}) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const model = useMemo(
    () => getAgentRunModel(run, { seed, compression, width, height }),
    [run, seed, compression, width, height],
  );
  const state = getAgentRunState(frame, model, { fps, speed });
  const palette = getAgentRunPalette(theme, accentColor);
  const { panel } = state;

  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: panel.width,
          height: panel.height,
          translate: "-50%",
          scale: `${panel.unit}`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            opacity: panel.opacity,
            transform: `translateY(${panel.lift}px)`,
            background: palette.panel,
            border: `1px solid ${palette.border}`,
            borderRadius: 18,
            boxShadow: palette.shadow,
            color: palette.fg,
            fontFamily: SANS,
            fontSize: BODY_SIZE,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <Header header={state.header} palette={palette} />
          <div
            style={{
              position: "relative",
              height: panel.viewport,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: PAD_X,
                width: COLUMN,
                transform: `translateY(${-state.scroll}px)`,
              }}
            >
              <Bubble bubble={state.bubble} palette={palette} />
              <Status status={state.status} palette={palette} />
              {state.plan ? <Plan plan={state.plan} palette={palette} /> : null}
              {state.tools ? (
                <Tools tools={state.tools} palette={palette} />
              ) : null}
              {state.blocks.map((block) => (
                <AnswerBlock key={block.key} block={block} palette={palette} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
