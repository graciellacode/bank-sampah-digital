import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    subtitle?: string;
    trend?: string;
}

export function StatCard({ label, value, icon: Icon, subtitle, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 truncate">{label}</span>
                <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                    <Icon className="w-5 h-5 text-[#16A34A]" />
                </div>
            </div>

            <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {value}
                </p>

                {(trend || subtitle) ? (
                    <div className="flex items-center gap-1.5 mt-2.5">
                        {trend && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 border border-emerald-100/80 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </span>
                        )}
                        {subtitle && (
                            <span className="text-[11px] font-medium text-slate-400 truncate">{subtitle}</span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 border border-emerald-100/80 px-2 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            Aktif
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">vs bulan lalu</span>
                    </div>
                )}
            </div>
        </div>
    );
}