import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode | ReactNode[];
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="fixed right-0 top-0 bottom-0 left-[300px] p-12">
        {children}
      </div>
    </>
  );
};

export default Layout;
