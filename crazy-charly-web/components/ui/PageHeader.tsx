import { ReactNode } from "react";
import { Badge } from "./Badge";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string | number;
    actions?: ReactNode;
    children?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions, children }: PageHeaderProps) {
    return (
        <div className="sticky top-16 z-30 bg-bg-primary/80 backdrop-blur-xl pt-6 pb-6 px-5 border-b border-text-primary/5 w-full space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-display italic font-bold text-3xl text-text-primary">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-brand text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                            {subtitle}
                        </p>
                    )}
                    {badge !== undefined && (
                        <div className="mt-2">
                            <Badge variant="brand" size="xs">{badge}</Badge>
                        </div>
                    )}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            {children && <div className="pt-2">{children}</div>}
        </div>
    );
}
