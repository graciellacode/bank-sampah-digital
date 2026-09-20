"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmLabel?: string;
}

/** Dialog konfirmasi generik (dipakai untuk semua aksi hapus di area Admin). */
export function ConfirmDialog({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    isLoading,
    confirmLabel = "Hapus",
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}