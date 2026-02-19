import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // => jamais de problème de JWT périmé
    const session = await auth();

    if (!session) {
        redirect("/connexion");
    }

    if (session.user?.role !== "admin") {
        redirect("/acces-refuse");
    }

    return (
        <div className="flex min-h-screen bg-bg-primary">
            {/* --- DESKTOP SIDEBAR --- */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
                {/* --- MOBILE ONLY HEADER --- */}
                <div className="md:hidden sticky top-0 z-[60]">
                    <Header />
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 pb-32 md:pb-10 md:pt-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>

                {/* --- MOBILE ONLY TAB BAR --- */}
                <div className="md:hidden">
                    <BottomTabBar />
                </div>
            </div>
        </div>
    );
}
