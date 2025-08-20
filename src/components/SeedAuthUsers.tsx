import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SeedResult = {
  email: string;
  status: "created" | "exists" | "error";
  message?: string;
};

const testUsers = [
  { email: "cmd@test.com", password: "password123", firstName: "Chief Medical", lastName: "Director", role: "CMD", department: "Administration" },
  { email: "superadmin@test.com", password: "password123", firstName: "Super", lastName: "Admin", role: "SUPER_ADMIN", department: "Information Technology" },
  { email: "admin@test.com", password: "password123", firstName: "System", lastName: "Admin", role: "ADMIN", department: "Information Technology" },
  { email: "hod.radiology@test.com", password: "password123", firstName: "Dr. Sarah", lastName: "Johnson", role: "HOD", department: "Radiology" },
  { email: "hod.dental@test.com", password: "password123", firstName: "Dr. Michael", lastName: "Chen", role: "HOD", department: "Dental" },
  { email: "hod.emergency@test.com", password: "password123", firstName: "Dr. Marcus", lastName: "Williams", role: "HOD", department: "Accident & Emergency" },
  { email: "staff.radiology@test.com", password: "password123", firstName: "Lisa", lastName: "Garcia", role: "STAFF", department: "Radiology" },
  { email: "staff.dental@test.com", password: "password123", firstName: "Kevin", lastName: "Zhao", role: "STAFF", department: "Dental" },
  { email: "staff.emergency@test.com", password: "password123", firstName: "Amanda", lastName: "Foster", role: "STAFF", department: "Accident & Emergency" },
];

const SeedAuthUsers: React.FC = () => {
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<SeedResult[]>([]);

  const handleSeed = async () => {
    if (seeding) return;
    setSeeding(true);
    setResults([]);

    for (const u of testUsers) {
      const { error } = await supabase.auth.signUp({
        email: u.email,
        password: u.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: u.firstName,
            last_name: u.lastName,
            role: u.role,
            department: u.department,
          },
        },
      });

      if (error) {
        const exists = /already registered/i.test(error.message);
        setResults((prev) => [
          ...prev,
          { email: u.email, status: exists ? "exists" : "error", message: error.message },
        ]);
      } else {
        setResults((prev) => [...prev, { email: u.email, status: "created" }]);
      }

      // Ensure we don't keep a seeded session active (in case email confirmations are disabled)
      await supabase.auth.signOut();
    }

    setSeeding(false);
    toast({
      title: "Seeding complete",
      description: "Test users have been created (or already existed).",
    });
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleSeed}
        disabled={seeding}
        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        variant="secondary"
        size="sm"
      >
        {seeding ? "Seeding users..." : "Seed test users"}
      </Button>
      {results.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto border rounded-md p-2">
          {results.map((r) => (
            <div key={r.email} className="flex justify-between gap-2">
              <span className="truncate">{r.email}</span>
              <span
                className={
                  r.status === "created"
                    ? "text-green-600"
                    : r.status === "exists"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Password for all: <strong>password123</strong>
      </p>
    </div>
  );
};

export default SeedAuthUsers;
