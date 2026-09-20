interface FormFieldProps {
    label: string;
    error?: string;
    optional?: boolean;
    children: React.ReactNode;
}

/** Bungkus label + input + pesan error dalam satu pola yang konsisten, dipakai di semua form project ini. */
export function FormField({ label, error, optional, children }: FormFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {optional && <span className="text-gray-400 font-normal"> (opsional)</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

/** Class Tailwind standar untuk input text/password/textarea di seluruh project. */
export const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";