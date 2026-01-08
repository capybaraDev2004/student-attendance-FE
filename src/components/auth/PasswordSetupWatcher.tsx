"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PASSWORD_PAGE = "/set-password";

export default function PasswordSetupWatcher() {
  const { data, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const mustSetPassword = data?.user?.mustSetPassword;

    if (mustSetPassword && pathname !== PASSWORD_PAGE) {
      router.replace(PASSWORD_PAGE);
      return;
    }

    if (!mustSetPassword && pathname === PASSWORD_PAGE) {
      router.replace("/dashboard");
    }
  }, [data?.user?.mustSetPassword, pathname, router, status]);

  return null;
}

