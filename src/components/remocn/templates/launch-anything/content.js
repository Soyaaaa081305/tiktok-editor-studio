import { launchMedia } from "./assets";

export const launchContent = {
  opening: "Good",
  subject: "ideas",
  ready: "deserve a stage",
  next: "Let’s make",
  action: "them real",
  proof: "Your work.\nA clearer view.",
  industry: "Built around you",
  promise: "Made to be yours.",
  launch: "Begin",
  shoppers: "Small things. Well made.",
  builder: "Turn a brief into workspace",
  builderPrompt: "Create a workspace for our next product release",
  trading: "Review once.\nMove forward.",
  loyalty: "A place for every idea",
  loyaltyPayoff: "Room for the next one",
  integration: "Bring your work together",
  integrations: ["Files", "Messages", "Calendar"],
  shopName: "Object Study",
  shopHeadline: "Everyday, considered.",
  shopDetail: "Useful objects. Quiet details.",
  shopAction: "Explore the objects",
  connections: "Connect your tools.\nKeep work moving.",
};

export function resolveLaunchProps(props) {
  const integrations = props.content?.integrations?.filter((name) =>
    name.trim(),
  );
  return {
    brandUrl: props.brandUrl ?? "yourproduct.example",
    accent: props.accentColor ?? "#245744",
    content: {
      ...launchContent,
      ...props.content,
      ...(props.opening === undefined ? {} : { opening: props.opening }),
      ...(props.subject === undefined ? {} : { subject: props.subject }),
      integrations: integrations?.length
        ? integrations
        : launchContent.integrations,
    },
    media: { ...launchMedia, ...props.media },
    screenImages: props.screenImages ?? {},
    logos: props.logos?.filter((src) => src.trim()) ?? [],
    logoSrc: props.logoSrc,
  };
}
