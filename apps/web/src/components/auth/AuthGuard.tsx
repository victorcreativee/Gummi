"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

            router.replace(loginUrl);
            return;
        }

        setIsAllowed(true);
        setIsCheckingSession(false);
    }, [pathname, router]);

    if (isCheckingSession || !isAllowed) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
                <div className="text-center">
                    <div
                        className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCE7F2] border-t-[#0890E0]"
                        aria-hidden="true"
                    />

                    <p className="mt-4 text-sm font-bold text-[#102848]/60">
                        Checking your session…
                    </p>
                </div>
            </main>
        );
    }

    return <>{children}</>;
}