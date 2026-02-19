import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-32">
                {children}
            </main>
            <BottomTabBar />
        </div>
    );
}
