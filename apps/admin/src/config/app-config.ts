import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Wontent Content Hub",
  version: packageJson.version,
  copyright: `© ${currentYear}, Wontent Inc.`,
  meta: {
    title: "Wontent Content Hub - Write Once. Optimize with AI. Publish Everywhere.",
    description:
      "Wontent Content Hub is a modern Headless Content Hub for creating, optimizing with AI (SEO & GEO), and publishing content to multiple CMSs and social channels.",
  },
};
