import AdminNav from "../components/Navbar/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">
        <AdminNav />
      </div>
      <main className="">{children}</main>
    </>
  );
}
