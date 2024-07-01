import type { Metadata } from "next";
import { Container } from "./_component/container";
export const metadata: Metadata = {
  title: "Coven Classics - Practical Magick",
  description: "",
};
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex h-full">
        <Container>
          {children}
        </Container>
      </div>
    </>
  );
}
