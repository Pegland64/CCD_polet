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
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-32">
                {children}
            </main>
            <BottomTabBar />
        </div>
    );
}
