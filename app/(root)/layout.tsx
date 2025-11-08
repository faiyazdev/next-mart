import Navbar from "../components/Navbar/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">
        <Navbar />
      </div>
      <main className="">{children}</main>
    </>
  );
}
