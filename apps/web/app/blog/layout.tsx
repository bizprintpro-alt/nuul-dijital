import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
