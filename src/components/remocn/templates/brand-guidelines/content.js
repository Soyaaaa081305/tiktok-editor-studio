import { brandGuidelinesMedia } from "./assets";

export const brandGuidelinesTheme = {
  ink: "#242321",
  accent: "#A64B38",
  stone: "#D6CFC4",
  paper: "#F5F1E9",
};

export const brandGuidelinesContent = {
  brandName: "Form Study",
  openingTagline: "Made with purpose.",
  guidelinesLabel: "Brand guidelines",
  collageTitle: "Objects for everyday living.",
  collectionLabel: "Material studies / No. 01",
  footer: "A fictional identity. Made to be yours.",
};

export const brandGuidelinesPhrases = [
  "Material matters.",
  "Keep it simple.",
  "Find your form.",
  "Quiet by design.",
  "Make space.",
  "Feel the texture.",
  "Shape the everyday.",
  "Made with purpose.",
];
export const brandGuidelinesClosingWords = ["Make", "Ideas", "Real."];

function withDefaults(defaults, overrides) {
  return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [
    key,
    overrides?.[key]?.trim() || value,
  ]));
}

export function resolveBrandGuidelinesProps(props) {
  const content = withDefaults(brandGuidelinesContent, props.content);
  const theme = withDefaults(brandGuidelinesTheme, props.theme);
  if (props.brandName?.trim()) content.brandName = props.brandName.trim();
  if (props.accentColor?.trim()) theme.accent = props.accentColor.trim();
  return {
    content,
    theme,
    phrases: brandGuidelinesPhrases.map(
      (text, i) => props.phrases?.[i]?.trim() || text,
    ),
    closingWords: brandGuidelinesClosingWords.map(
      (text, i) => props.closingWords?.[i]?.trim() || text,
    ),
    photos: withDefaults(brandGuidelinesMedia, props.photos),
    logoSrc: props.logoSrc?.trim() || undefined,
    reducedMotion: props.reducedMotion ?? false,
  };
}
