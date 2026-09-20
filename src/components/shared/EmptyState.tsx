import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
    message: string;
    icon?: LucideIcon;
}

export function EmptyState({ message, icon: Icon = Inbox }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <Icon className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">{message}</p>
        </div>
    );
}