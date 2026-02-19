"use client";

import Image from "next/image";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-[#fffcf5]/70 backdrop-blur-2xl border-b border-[#131445]/5 px-5 flex items-center justify-center">
            <div className="flex items-center gap-2">
                {/* Placeholder logo representing the Toys Academy brand */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4c40cf] to-[#6d63ff] flex items-center justify-center shadow-md shadow-[#4c40cf]/20">
                    <span className="text-white font-display italic font-bold text-lg">T</span>
                </div>
                <span className="font-display italic font-bold text-lg text-[#131445] tracking-tight">
                    Toys Academy
                </span>
            </div>
        </header>
    );
}
