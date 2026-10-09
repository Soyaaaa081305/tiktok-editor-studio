# DAILY 5-SLOT SCRIPT GENERATOR (SMARTFIT TAGLISH & NEWS DADDY BRIEFS)

Daily production prompt for generating 5 high-converting, science-based TikTok scripts for @noda.lifts. Every generated script directly populates the `noda-video-editor` project schema and pairs with the News Daddy 55/45 vertical split editor.

---

## 1. Daily 5-Slot Editorial Framework

Each calendar day requires 5 distinct, high-impact content slots:

| Slot | Content Type | Core Purpose | Hook Strategy | CTA / Conversion |
|---|---|---|---|---|
| **01** | `AFFILIATE` | High-volume supplement debunk or truth (e.g. Creatine Monohydrate, Pure Fish Oil) | Counterintuitive callout on wasted money or marketing lies | "Check out the yellow basket sa baba." |
| **02** | `EDUCATIONAL` | Form, biomechanics & hypertrophy cue (e.g. Incline Bench ROM, Lat Pulldowns) | "Mali ang turo sayo kung..." technique intervention | "Save this video for your next push/pull day." |
| **03** | `AFFILIATE` | Performance gear or secondary supplement (e.g. Lifting straps, Pre-workout) | Practical gym problem solving (grip failure, energy crash) | "Check the yellow basket below." |
| **04** | `MEME` | Relatable gym culture satire with a scientific recovery twist | Observational humor ("Bro, hindi rest period ang 7 mins sa phone...") | "Tag mo yung gym bro mong ganito!" |
| **05** | `AFFILIATE` | Recovery, micronutrient or sleep optimizer (e.g. Magnesium Glycinate, Electrolytes) | Daily routine optimization & sleep science | "Available sa yellow basket below." |

---

## 2. Voice & Writing Invariants (Smartfit Taglish)

1. **Cadence & Vocabulary:**
   - Speak in natural, urban Filipino **Taglish** matching Enver Florendo (Smartfit).
   - Use colloquial transitions: *"Sobrang dami kong nakikitang..."*, *"Pero tingnan mo yung science..."*, *"Wag kang magpauto sa..."*, *"Ang totoo niyan..."*.
   - Never use formal, textbook Tagalog ("Datapuwat", "Ipinapahiwatig").
2. **Word Count & Duration:**
   - Spoken target: **45 to 55 seconds** (approx. 110–135 words).
   - Rapid, high-momentum delivery with zero introductory fluff.
3. **Mandatory Outro Signature:**
   - Always conclude the spoken script with:
     > *"Like and follow for more science-based lifting advice. God bless!"*
4. **News Daddy Edit Brief:**
   - Every script must supply an exact specification for the **Top 55% B-roll / Proof zone** (study screenshot, form comparison, anatomical animation) and **Bottom 45% Presenter zone**.

---

## 3. Standard JSON Output Format

When generating daily scripts for `noda-video-editor`, output valid JSON adhering to this schema:

```json
{
  "project_id": "YYYY-MM-DD-{slot}-{type}",
  "date": "YYYY-MM-DD",
  "slot": "01",
  "content_type": "AFFILIATE",
  "title": "Short Punchy Title",
  "concept": "Core scientific or marketing distinction",
  "target_duration": 52,
  "product_name": "Product Name (or Technique Guide)",
  "product_information": "Key spec or dosage guidance",
  "hook": "Wag kang magpauto sa mamahaling creatine na 2,000 pesos!",
  "script": "Conversational Smartfit Taglish script text... Like and follow for more science-based lifting advice. God bless!",
  "cta": "Check out the yellow basket below.",
  "caption": "Punchy TikTok caption with hashtags #fitness #gymtok #sciencebased #nodaThatLifts",
  "editing_brief": "News Daddy 55/45 split. Top 55%: Meta-analysis chart and scoop B-roll. Bottom 45%: Noda chest-up talking head. Y=1380px gold karaoke subtitles.",
  "raw_assets": [],
  "status": "SCRIPT_READY"
}
```

---

## 4. Prompt Execution Trigger

To generate today's batch, provide:
`"Generate 5 daily slots for [DATE] following SCRIPT-GENERATOR.md"`
The engine will output all 5 slots ready for persistence in `noda-video-editor/content/projects/[DATE]/`.
