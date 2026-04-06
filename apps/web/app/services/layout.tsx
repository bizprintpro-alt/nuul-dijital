import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
