import PatientOverviewPage from "@/components/patientOverviewPage";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full relative">
      <PatientOverviewPage >
        {children}
        </PatientOverviewPage>
    </div>
  );
}
