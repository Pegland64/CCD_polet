"use client";

import CompositionView from "@/components/CompositionView";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CompositionPage() {
    return (
        <div className="font-sans min-h-screen bg-bg-primary">
            <PageHeader
                title="Composition"
                subtitle="Optimisation des box"
            />

            <div className="px-5 pt-8">
                <CompositionView />
            </div>
        </div>
    );
}
