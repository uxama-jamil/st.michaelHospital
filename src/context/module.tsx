import type { Module, RawModule } from '@/types/modules';
import { createContext, useContext, useMemo, useState } from 'react';

interface ModuleContextType {
  module: Partial<Module | RawModule>;
  setModule: (module: Partial<Module | RawModule>) => void;
}

const ModuleContext = createContext<ModuleContextType>({} as ModuleContextType);

function ModuleProvider({ children }) {
  const [module, setModule] = useState<Partial<Module | RawModule>>({
    id: '',
    title: '',
    description: '',
    thumbnail: '',
    keywords: [],
    createdBy: {
      id: '',
      userName: '',
      email: '',
    },
    status: '',
    contentCount: 0,
  } as Module | RawModule);

  const value = useMemo(
    () => ({
      module,
      setModule,
    }),
    [module], // Added logOut as a dependency
  );

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export default ModuleProvider;
export const useModule = () => useContext(ModuleContext);
