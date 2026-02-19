"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, Boxes, History, LayoutDashboard } from "lucide-react";

const tabs = [
    { href: "/admin", icon: LayoutDashboard },
    { href: "/admin/catalogue", icon: Package },
    { href: "/admin/abonnes", icon: Users },
    { href: "/admin/composition", icon: Boxes },
    { href: "/admin/campagnes", icon: History },
];

export default function BottomTabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-6 right-6 z-50 rounded-2xl bg-[#131445]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] h-16 flex items-center justify-around px-2">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className="relative flex items-center justify-center w-12 h-12 transition-all"
                    >
                        <Icon
                            size={24}
                            className={`transition-colors duration-300 ${isActive ? "text-[#4c40cf]" : "text-white"
                                }`}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#4c40cf]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
