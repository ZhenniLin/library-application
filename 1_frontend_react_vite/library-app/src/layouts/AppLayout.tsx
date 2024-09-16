import Footer from "./NavbarAndFooter/Footer";
import Navbar from "./NavbarAndFooter/Navbar";

// interface AppLayoutProps {
//   children: ReactNode;
// }

export const AppLayout = ({ children }: any) => {
  return (
    <div className="min-w-screen flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* <Outlet /> */}
        {children}
      </main>
      <Footer />
    </div>
  );
};
