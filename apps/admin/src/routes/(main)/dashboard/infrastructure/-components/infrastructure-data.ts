import type { SimpleIcon } from "simple-icons";
import { siNextdotjs, siNodedotjs, siReact, siAstro, siWordpress, siPostgresql } from "simple-icons";

export interface InfrastructureEnvironment {
  domain: string;
  platform: {
    name: string;
    icon: SimpleIcon;
  };
  environment: "Expired" | "Production" | "Staging";
  status: "Online" | "Unhealthy";
  latency: string;
  uptime: string;
  server: string;
  countryCode: string;
  plan: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export interface InfrastructureGroup {
  name: string;
  organization: string;
  rows: InfrastructureEnvironment[];
}

export const infrastructureGroups: InfrastructureGroup[] = [
  {
    name: "Core CMS Backend & Storage",
    organization: "Wontent Engine",
    rows: [
      {
        domain: "localhost:3000 (Elysia API / Bun)",
        platform: {
          name: "Node.js",
          icon: siNodedotjs,
        },
        environment: "Production",
        status: "Online",
        latency: "12ms",
        uptime: "14d 02h",
        server: "Localhost / Docker Container",
        countryCode: "US",
        plan: "Bun v1.3 Runtime",
        resources: { cpu: 15, ram: 28, disk: 18 },
      },
      {
        domain: "localhost:5432 (PostgreSQL Drizzle ORM)",
        platform: {
          name: "PostgreSQL",
          icon: siPostgresql,
        },
        environment: "Production",
        status: "Online",
        latency: "5ms",
        uptime: "14d 02h",
        server: "PostgreSQL 16 Alpine",
        countryCode: "US",
        plan: "Docker Managed Volume",
        resources: { cpu: 8, ram: 35, disk: 42 },
      },
    ],
  },
  {
    name: "Connected Destination Adapters",
    organization: "Wontent Publishers",
    rows: [
      {
        domain: "wordpress.mycompany.com/wp-json/wp/v2",
        platform: {
          name: "WordPress",
          icon: siWordpress,
        },
        environment: "Production",
        status: "Online",
        latency: "120ms",
        uptime: "30d 12h",
        server: "WordPress REST API v2",
        countryCode: "US",
        plan: "WordPress 6.5 Enterprise",
        resources: { cpu: 25, ram: 40, disk: 50 },
      },
      {
        domain: "wontent-blog.astro.build",
        platform: {
          name: "Astro",
          icon: siAstro,
        },
        environment: "Production",
        status: "Online",
        latency: "18ms",
        uptime: "99d 23h",
        server: "Vercel / Edge Network",
        countryCode: "US",
        plan: "Astro 5 SSG / Webhooks",
        resources: { cpu: 5, ram: 12, disk: 10 },
      },
      {
        domain: "portal.next.wontent.io",
        platform: {
          name: "Next.js",
          icon: siNextdotjs,
        },
        environment: "Staging",
        status: "Online",
        latency: "45ms",
        uptime: "7d 10h",
        server: "AWS ECS Container",
        countryCode: "US",
        plan: "Next.js 15 ISR",
        resources: { cpu: 30, ram: 45, disk: 30 },
      },
    ],
  },
];
