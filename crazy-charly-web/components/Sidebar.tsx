"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, Boxes, History, LayoutDashboard, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import { useSession, signOut } from "next-auth/react";

const menuItems = [
    { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
    { name: "Catalogue", href: "/admin/catalogue", icon: Package },
    { name: "Abonnés", href: "/admin/abonnes", icon: Users },
    { name: "Composition", href: "/admin/composition", icon: Boxes },
    { name: "Campagnes", href: "/admin/campagnes", icon: History },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-[#131445]/5 h-screen sticky top-0">
            <div className="p-8 pb-10 flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-display italic font-bold text-lg text-[#131445] tracking-tight leading-tight">
                        Toys Academy
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c40cf] opacity-60">
                        Admin Portal
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative ${isActive
                                ? "text-white"
                                : "text-[#131445]/60 hover:bg-[#4c40cf]/5 hover:text-[#4c40cf]"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-[#4c40cf] rounded-2xl shadow-lg shadow-[#4c40cf]/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={20} className={`relative z-10 ${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                            <span className="relative z-10 font-bold text-sm tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-text-primary/5 space-y-4">
                {session?.user && (
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full border-2 border-brand/20 overflow-hidden shrink-0">
                            {session.user.image ? (
                                <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand font-black text-xs">
                                    {session.user.name?.charAt(0) || "A"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate">{session.user.name}</p>
                            <p className="text-[9px] font-black uppercase text-text-primary/40 tracking-wider truncate">Administrateur</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-[#131445]/40 font-bold text-xs uppercase tracking-widest hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
