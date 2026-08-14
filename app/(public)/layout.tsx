import Navbar from "@/components/layout/navbar/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({
  children,
}: Readonly<PublicLayoutProps>) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
