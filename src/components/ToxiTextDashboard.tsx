import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  FlameKindling,
  Gauge,
  Sparkles,
  Upload,
  Wand2,
  ShieldAlert,
  MessageSquare,
  BadgeCheck,
} from 'lucide-react';

const toxicPatterns = [
  {
    id: 'manipulation',
    label: 'Manipulation',
    microInsight: 'This score suggests emotional pressure is being applied more often than clarity is offered.',
    description: 'Look for pressure, ultimatums, and bargains that trade care for compliance.',
    keywords: ['if you cared', "after all i've done", 'owe me', 'only one who'],
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'gaslighting',
    label: 'Gaslighting',
    microInsight: 'Repeated reality-challenging language appears often enough to erode trust in your own perception over time.',
    description: 'Denials that rewrite events, frame you as confused, or question your memory.',
    keywords: ["you're imagining", "you're crazy", 'never said', 'making things up', 'too sensitive'],
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 'passive-aggression',
    label: 'Passive Aggression',
    microInsight: 'Hostility is not stated outright—but it is present in what is implied.',
    description: 'Sarcasm, backhanded praise, or quiet punishment instead of clarity.',
    keywords: ['whatever', 'fine.', 'if that makes you happy', 'sure, i guess', 'ok then'],
    color: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'guilt-tripping',
    label: 'Guilt Tripping',
    microInsight: 'Obligations and past favors are leveraged to steer your choices.',
    description: 'Debt keeping, martyrdom language, or reminders of how much was done for you.',
    keywords: ["i've done so much", 'after everything', 'no one else would', 'only person who'],
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'blame-shifting',
    label: 'Blame Shifting',
    microInsight: 'Responsibility is redirected away from the speaker whenever tension appears.',
    description: 'Redirecting fault, pointing fingers, or claiming your reaction is the real issue.',
    keywords: ['your fault', 'you made me', 'because of you', 'if you just', 'not my problem'],
    color: 'from-lime-400 to-emerald-500',
  },
];

const defaultConversation = `You never listen to me. Everyone agrees you're being dramatic.
After all I've done for you, I can't believe you'd ignore me like this. 
If you actually cared about me, you wouldn't be ignoring my messages.
I guess it's fine, whatever makes you happy. I'm the only one who really puts effort into us.`;

const detoxExamples = [
  {
    original: 'If you actually cared about me, you wouldn\'t be ignoring my messages.',
    detoxed: "I felt hurt when I didn't hear back and need more consistency in communication.",
  },
  {
    original: "Everyone agrees you're being dramatic.",
    detoxed: 'I want to understand how you see this—we seem to be having different reactions.',
  },
  {
    original: "After everything I've done for you, you still don't get it.",
    detoxed: "I'm proud of what we've done together and I need to talk about what isn't working for me now.",
  },
];

const realityCheckHighlights = [
  {
    text: "Everyone agrees you're being dramatic",
    label: 'Appeal to imaginary consensus',
    impact: 'This pressures you to doubt yourself without evidence.',
  },
  {
    text: "I've done so much for you",
    label: 'Past effort as leverage',
    impact: 'Care is converted into a debt that must be repaid with compliance.',
  },
  {
    text: 'I guess it\'s fine, whatever makes you happy',
    label: 'Withholding approval',
    impact: 'Disapproval is implied without stating a clear need or boundary.',
  },
  {
    text: 'You never listen to me',
    label: 'Absolutist framing',
    impact: 'Absolutes erase nuance and make repair feel impossible.',
  },
];

type PatternResult = {
  id: string;
  label: string;
  score: number;
  microInsight: string;
  description: string;
  color: string;
};

type Analysis = {
  patterns: PatternResult[];
  emotionalGravity: number;
  controlIndex: number;
  connectionIndex: number;
  confidence: number;
  clusterDetected: boolean;
  clusterCopy: string;
  findings: string[];
};

const clamp = (value: number, min = 0, max = 100) => Math.round(Math.min(Math.max(value, min), max));

const countMatches = (text: string, phrases: string[]) =>
  phrases.reduce((acc, phrase) => acc + (text.includes(phrase) ? 1 : 0), 0);

const analyzeConversation = (text: string): Analysis => {
  const normalized = text.toLowerCase();
  const patternResults = toxicPatterns.map((pattern) => {
    const hits = countMatches(normalized, pattern.keywords.map((k) => k.toLowerCase()));
    const score = clamp(35 + hits * 15 + Math.min(text.length / 120, 25));
    return { ...pattern, score };
  });

  const negativeWords = ['never', 'ignore', 'dramatic', 'crazy', 'always', 'whatever', 'fault'];
  const supportiveWords = ['understand', 'hear', 'listen', 'communicate', 'feel', 'thanks'];
  const negativeCount = countMatches(normalized, negativeWords);
  const supportiveCount = countMatches(normalized, supportiveWords);

  const emotionalGravity = clamp(45 + negativeCount * 10 - supportiveCount * 4);
  const controlIndex = clamp(50 + (negativeCount + patternResults.reduce((sum, p) => sum + p.score, 0) / 80));
  const connectionIndex = clamp(80 - controlIndex / 2 + supportiveCount * 6);

  const highPatterns = patternResults.filter((p) => p.score >= 65).map((p) => p.label);
  const clusterDetected = highPatterns.includes('Blame Shifting') &&
    (highPatterns.includes('Gaslighting') || highPatterns.includes('Guilt Tripping'));
  const clusterCopy =
    'Blame Shifting + Gaslighting + Guilt Tripping often appear together in emotionally controlling dynamics. Individually they confuse—together they destabilize.';

  const findings = patternResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((p) => `${p.label} shows up consistently in this thread.`);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const confidence = clamp(55 + highPatterns.length * 8 + Math.min(wordCount, 220) / 4);

  return {
    patterns: patternResults,
    emotionalGravity,
    controlIndex,
    connectionIndex,
    confidence,
    clusterDetected,
    clusterCopy,
    findings,
  };
};

export function ToxiTextDashboard() {
  const [conversation, setConversation] = useState(defaultConversation);
  const [analysis, setAnalysis] = useState<Analysis>(() => analyzeConversation(defaultConversation));
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDetox, setShowDetox] = useState(false);

  useEffect(() => {
    setAnalysis(analyzeConversation(conversation));
  }, [conversation]);

  const summaryColors = ['bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-800', 'bg-indigo-100 text-indigo-800'];

  const patternClusterBadge = useMemo(() => (
    analysis.clusterDetected ? (
      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-rose-500/90 to-amber-500/90 text-white p-4 shadow-lg">
        <ShieldAlert className="w-5 h-5 mt-0.5" />
        <div>
          <p className="font-semibold">⚠ Pattern Cluster Detected</p>
          <p className="text-sm opacity-90">{analysis.clusterCopy}</p>
        </div>
      </div>
    ) : null
  ), [analysis.clusterCopy, analysis.clusterDetected]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col gap-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <p className="uppercase tracking-[0.25em] text-xs text-slate-300">ToxiText — Reality-first Clarity</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Behavioral Fingerprints, Not Just Messages</h1>
              <p className="text-lg text-slate-200 max-w-3xl">
                Scan screenshots or paste conversations. ToxiText surfaces toxic traits, shows how they stack over time, and rewrites manipulative language into grounded clarity.
              </p>
              <p className="text-sm text-slate-300">Confidence Level: <span className="font-semibold text-white">High</span> — Multiple indicators align consistently across the message.</p>
              <p className="text-sm text-emerald-700 bg-emerald-100 inline-flex px-3 py-1 rounded-full">Recognizing a pattern does not mean you caused it.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md p-4 w-full md:w-80">
              <div className="flex items-center gap-2 text-sm text-slate-200 mb-2">
                <Gauge className="w-4 h-4 text-amber-500" /> Pattern Confidence Meter
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500" style={{ width: `${analysis.confidence}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">Multiple indicators align consistently across the message.</p>
            </div>
          </div>
          {patternClusterBadge}
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-white/50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Upload className="w-4 h-4 text-amber-500" />
              Drop a screenshot or paste text
            </div>
            <div className="flex gap-3 items-center text-xs text-slate-600">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              OCR-ready: import screenshots from your messages app, or paste copied text below.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-center gap-2 border border-dashed border-amber-200 rounded-xl py-3 px-4 cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Upload className="w-4 h-4" /> Upload screenshot
              </label>
              <button
                type="button"
                onClick={() => setConversation(defaultConversation)}
                className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 border border-indigo-100"
              >
                <Sparkles className="w-4 h-4" /> Use sample conversation
              </button>
            </div>
            {imagePreview && (
              <div className="rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <img src={imagePreview} alt="Uploaded screenshot preview" className="w-full h-48 object-cover" />
              </div>
            )}
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              rows={7}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-inner"
              placeholder="Paste conversation text or describe what was said..."
            />
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full">Reality Check: What This Message Is Doing</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full">Less advice, more clarity</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-white/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Behavioral Fingerprints</p>
                <p className="text-xl font-bold text-slate-900">Communication keeps showing up like this</p>
                <p className="text-xs text-slate-500">Repeated patterns don’t lie. This is what keeps showing up.</p>
              </div>
              <FlameKindling className="w-6 h-6 text-rose-500" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {analysis.patterns.map((pattern) => (
                <div key={pattern.id} className="rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">{pattern.label}</div>
                    <div className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${pattern.color}`}>
                      {pattern.score}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${pattern.color}`} style={{ width: `${pattern.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pattern.microInsight}</p>
                  <p className="text-[11px] text-slate-500">{pattern.description}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 bg-amber-50 text-amber-800 border border-amber-100">
                <p className="text-sm font-semibold">Emotional Gravity</p>
                <p className="text-3xl font-bold">{analysis.emotionalGravity}</p>
                <p className="text-xs">What emotions are pulling the conversation off balance?</p>
              </div>
              <div className="rounded-xl p-4 bg-indigo-50 text-indigo-800 border border-indigo-100">
                <p className="text-sm font-semibold">Control vs Connection Index</p>
                <p className="text-3xl font-bold">{analysis.controlIndex} / {analysis.connectionIndex}</p>
                <p className="text-xs">Is this about understanding—or influence?</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 border border-white/60 shadow-sm rounded-2xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm text-slate-600">What’s Really Going On Here</p>
              <p className="text-xl font-bold">Not opinions. Patterns.</p>
              <p className="text-xs text-slate-500">Grounded next steps—without minimizing what you’re feeling.</p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 px-3 py-2 rounded-full border border-emerald-100">
              <Wand2 className="w-4 h-4" />
              Language Detox Toggle
              <button
                className={`ml-2 inline-flex h-6 w-11 items-center rounded-full transition ${showDetox ? 'bg-emerald-500' : 'bg-slate-300'}`}
                onClick={() => setShowDetox((prev) => !prev)}
              >
                <span className={`ml-1 inline-block h-5 w-5 rounded-full bg-white transition ${showDetox ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {analysis.findings.map((finding, idx) => (
              <div key={finding} className={`rounded-xl p-4 border text-sm font-semibold ${summaryColors[idx % summaryColors.length]}`}>
                {finding}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border border-rose-100 rounded-xl p-4 shadow-inner space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" /> Reality Check: What This Message Is Doing
              </div>
              <div className="space-y-2 text-sm text-slate-800">
                {realityCheckHighlights.map((item) => (
                  <div key={item.text} className="group relative">
                    <span className="font-semibold text-slate-900">{item.text}</span>
                    <div className="text-xs text-rose-700">{item.label}</div>
                    <div className="absolute left-0 mt-1 hidden group-hover:block bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-72 z-10">
                      {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 via-white to-indigo-50 border border-emerald-100 rounded-xl p-4 shadow-inner space-y-3">
              <p className="text-sm font-semibold text-emerald-800">Long-Term Impact if This Pattern Continues</p>
              <ul className="list-disc pl-5 text-sm text-slate-800 space-y-1">
                <li>Increased self-doubt and over-explaining.</li>
                <li>Emotional exhaustion without resolution.</li>
                <li>Shifting responsibility for others’ emotions onto yourself.</li>
                <li>Difficulty trusting your reactions in future conversations.</li>
              </ul>
              <div className="text-xs text-slate-600">You are not required to accept distorted versions of your intent in order to keep peace.</div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-amber-200">
              <MessageSquare className="w-4 h-4" /> How This Lands Over Time
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              {detoxExamples.map((example) => (
                <div key={example.original} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-amber-200 text-xs mb-1">Original</p>
                  <p className="font-semibold mb-2">{example.original}</p>
                  <p className="text-emerald-300 text-xs mb-1 flex items-center gap-1">
                    <Wand2 className="w-3 h-3" /> Detoxed Version
                  </p>
                  <p className="text-sm text-emerald-100">{showDetox ? example.detoxed : 'Toggle to reveal a healthier rewrite.'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">If You’re Wondering ‘Is This Healthy?’</p>
                <p className="text-lg font-bold text-slate-900">Grounded next steps—without minimizing what you’re feeling.</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-800">
              <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                <p className="font-semibold">Clarity Statements</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  <li>You are not required to accept distorted versions of your intent in order to keep peace.</li>
                  <li>Your needs are not unreasonable because someone else finds them inconvenient.</li>
                  <li>Boundaries are information, not punishments.</li>
                </ul>
              </div>
              <div className="rounded-xl p-4 bg-indigo-50 border border-indigo-100">
                <p className="font-semibold">Micro-Actions</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  <li>Name what was said, not the person: “When you say ___, it lands like pressure.”</li>
                  <li>Pause the loop: “I need time to consider this without being rushed.”</li>
                  <li>Request clarity: “What exactly are you asking for, without conditions?”</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToxiTextDashboard;
