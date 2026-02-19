"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-[#fffcf5]/70 backdrop-blur-2xl border-b border-[#131445]/5 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="font-display italic font-bold text-lg text-[#131445] tracking-tight">
                    Toys Academy
                </span>
            </div>

            <div className="flex items-center gap-3">
                {session?.user && (
                    <div className="w-9 h-9 rounded-full border border-brand/20 overflow-hidden shrink-0">
                        {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand font-black text-[10px]">
                                {session.user.name?.charAt(0) || "A"}
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center transition-colors hover:bg-red-100"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
