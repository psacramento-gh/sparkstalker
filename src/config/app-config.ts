import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "SparkStalker",
  version: packageJson.version,
  copyright: `© ${currentYear}, SparkStalker.`,
  meta: {
    title: "SparkStalker - tether.me username to Spark explorer",
    description:
      "SparkStalker is a client-side privacy audit proof of concept that resolves public tether.me metadata into a SparkScan address page.",
  },
};
