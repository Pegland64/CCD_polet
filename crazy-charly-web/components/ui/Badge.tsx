import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "brand" | "success" | "warning" | "danger" | "neutral";
    size?: "xs" | "sm";
}

export function Badge({ children, variant = "brand", size = "xs" }: BadgeProps) {
    const variants = {
        brand: "bg-brand/10 text-brand",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger",
        neutral: "bg-text-primary/5 text-text-primary/40"
    };

    const sizes = {
        xs: "px-2 py-0.5 text-[8px]",
        sm: "px-2.5 py-1 text-[10px]"
    };

    return (
        <span className={`rounded-full font-black uppercase tracking-wider whitespace-nowrap ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
}
