"use client";

import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  DEFAULT_USER_ROLE,
  normalizeUserRole,
  fetchUserProfile,
  type UserRole,
} from "@/lib/user-profile";

export function useUserRole(user: User | null, authReady: boolean) {
  const [role, setRole] = useState<UserRole>(DEFAULT_USER_ROLE);
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    if (!authReady) {
      setRoleReady(false);
      return;
    }
    if (!user) {
      setRole(DEFAULT_USER_ROLE);
      setRoleReady(true);
      return;
    }

    let cancelled = false;
    setRoleReady(false);

    fetchUserProfile(user.uid)
      .then((doc) => {
        if (cancelled) return;
        setRole(doc ? normalizeUserRole(doc.role) : DEFAULT_USER_ROLE);
        setRoleReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setRole(DEFAULT_USER_ROLE);
        setRoleReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authReady]);

  return { role, roleReady };
}
