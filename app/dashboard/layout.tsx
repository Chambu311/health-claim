import { Toaster } from "sonner";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Toaster position="top-right" richColors />
            {children}
        </div>
    );
}
