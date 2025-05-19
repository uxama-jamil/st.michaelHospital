import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";

interface Breadcrumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  subtitle?: string | ReactNode;
  setSubtitle: (subtitle?: string | ReactNode) => void;
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  actions: ReactNode[];
  setActions: (actions: ReactNode[]) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeader = () => {
  const ctx = useContext(HeaderContext);
  // if (!ctx) throw new Error("useHeader must be used within a HeaderProvider");
  return ctx;
};

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState<string | ReactNode>();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [actions, setActions] = useState<ReactNode[]>([]);

  const value = useMemo(
    () => ({
      title,
      setTitle,
      subtitle,
      setSubtitle,
      breadcrumbs,
      setBreadcrumbs,
      actions,
      setActions,
    }),
    [title, subtitle, breadcrumbs, actions]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
};
