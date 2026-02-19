"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fffcf5] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 max-w-md w-full"
            >
                {/* Visual */}
                <div className="relative">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand"
                    >
                        <Ghost size={64} strokeWidth={1.5} />
                    </motion.div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-text-primary/5 rounded-[100%] blur-sm" />
                </div>

                <div className="space-y-3">
                    <h1 className="font-display italic font-bold text-7xl text-text-primary">404</h1>
                    <h2 className="text-2xl font-bold text-text-primary">Oups ! Page égarée.</h2>
                    <p className="text-text-primary/40 font-medium">
                        On dirait que ce jouet a été rangé dans le mauvais carton.
                        La page que vous cherchez n'existe pas ou a été déplacée.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full shadow-xl shadow-brand/20"
                        onClick={() => window.location.href = "/"}
                        icon={<Home size={18} />}
                    >
                        Retour à l'accueil
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="w-full"
                        onClick={() => window.history.back()}
                        icon={<ArrowLeft size={18} />}
                    >
                        Page précédente
                    </Button>
                </div>
            </motion.div>

            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
