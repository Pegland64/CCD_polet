import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AccesRefusePage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 gap-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-500">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-text-primary">Accès refusé</h1>
            <p className="text-sm text-text-primary/50 max-w-xs">
                Votre compte n&apos;a pas les droits administrateur.
                Contactez un gestionnaire pour obtenir l&apos;accès.
            </p>
            <Link href="/" className="text-brand font-bold text-sm underline underline-offset-4">
                Retour à l&apos;accueil
            </Link>
        </main>
    );
}
