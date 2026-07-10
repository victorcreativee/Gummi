export type GummiAuthUser = {
    id?: string;
    userId?: string;
    fullName: string;
    email: string;
    role: string;
    token: string;
};

const AUTH_TOKEN_KEY = "gummi_token";
const AUTH_USER_KEY = "gummi_user";

function canUseBrowserStorage(): boolean {
    return typeof window !== "undefined";
}

export function saveAuthSession(user: GummiAuthUser): void {
    if (!canUseBrowserStorage()) {
        return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthToken(): string | null {
    if (!canUseBrowserStorage()) {
        return null;
    }

    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser(): GummiAuthUser | null {
    if (!canUseBrowserStorage()) {
        return null;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !storedUser) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(storedUser) as Partial<GummiAuthUser>;

        if (
            !parsedUser.fullName ||
            !parsedUser.email ||
            !parsedUser.role
        ) {
            clearAuthSession();
            return null;
        }

        return {
            id: parsedUser.id,
            userId: parsedUser.userId,
            fullName: parsedUser.fullName,
            email: parsedUser.email,
            role: parsedUser.role,
            token,
        };
    } catch {
        clearAuthSession();
        return null;
    }
}

export function getCurrentUserId(): string | null {
    const user = getCurrentUser();

    return user?.id ?? user?.userId ?? null;
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function clearAuthSession(): void {
    if (!canUseBrowserStorage()) {
        return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}