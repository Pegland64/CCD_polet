import { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "white";
    size?: "sm" | "md" | "lg" | "xl";
    icon?: ReactNode;
    as?: ElementType;
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    as: Component = "button",
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-brand text-white shadow-lg shadow-brand/20",
        secondary: "bg-brand/10 text-brand",
        danger: "bg-danger text-white",
        ghost: "bg-text-primary/5 text-text-primary/40",
        white: "bg-white text-text-primary shadow-sm"
    };

    const sizes = {
        sm: "h-9 px-4 text-[10px]",
        md: "h-11 px-6 text-xs",
        lg: "h-14 px-8 text-sm",
        xl: "h-16 px-10 text-lg"
    };

    return (
        <Component
            className={`rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active-scale disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props as any}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </Component>
    );
}
