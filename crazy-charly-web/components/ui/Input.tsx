import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
}

export function Input({ label, icon, className = "", ...props }: InputProps) {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/20">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full h-12 bg-text-primary/5 rounded-xl border-none focus:ring-2 focus:ring-brand/10 text-sm font-bold placeholder:text-text-primary/20 transition-all ${icon ? 'pl-11 pr-4' : 'px-4'} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
}
