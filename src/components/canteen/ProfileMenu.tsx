import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProfileMenu({ onClose }: { onClose?: () => void }) {
  const { user, signout } = useAuth();

  if (!user) {
    return (
      <div className="absolute right-0 mt-2 w-64 rounded-md border bg-white p-4 shadow">
        <p className="text-sm">Not signed in.</p>
        <Link to="/login" className="mt-2 inline-block text-primary">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-md border bg-white p-4 shadow z-50">
      <div className="mb-3">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.role.toUpperCase()}</p>
      </div>

      {user.role === "admin" && (
        <div className="mb-3 border-t pt-3">
          <p className="text-sm font-medium mb-2">Dashboard summary</p>
          <ul className="text-sm space-y-1">
            <li>Active users: <strong>128</strong></li>
            <li>Orders today: <strong>42</strong></li>
            <li>Revenue: <strong>$1,230</strong></li>
          </ul>
          <Link to="/admin" className="mt-3 inline-block text-sm text-primary">Open full dashboard</Link>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => { signout(); onClose?.(); }}
          className="rounded border px-3 py-1 text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default ProfileMenu;
