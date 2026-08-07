import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  {
    label: "Wontent API Docs",
    href: "http://localhost:3000/swagger",
  },
  {
    label: "Wontent SDK Package",
    href: "#",
  },
] as const;

export function GitHubRepositoriesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="icon" aria-label="Open Wontent Links" />}>
        <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Developer Resources</DropdownMenuLabel>
          {links.map((item) => (
            <DropdownMenuItem
              key={item.label}
              render={<a href={item.href} target="_blank" rel="noreferrer" />}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
