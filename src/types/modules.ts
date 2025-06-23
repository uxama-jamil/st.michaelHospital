import type { ModuleContentType } from "@/constants/module";

export interface Keyword {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface CreatedBy {
  id: string;
  userName: string;
  email: string;
}

export interface Module {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  projectId: string | null;
  description: string;
  thumbnail: string;
  keywords: string[]; // simplified from array of objects
  createdBy: string; // just the username extracted
  status: string;
  contentCount: number;
}

export interface RawModule {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  projectId: string | null;
  description: string;
  thumbnail: string;
  keywords: Keyword[];
  createdBy?: CreatedBy;
  status: string;
  contentCount: number;
}

export interface ModulesApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: RawModule[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export interface ModuleForm {
  title: string;
  keywordIds: string[];
  description: string;
  thumbnail: string;
}

export interface ModuleContextState {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  keywords: Keyword[];
  createdBy: CreatedBy;
  status: string;
  contentCount: number;
}

export interface AddModule {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  keywordIds: string[];
}

export interface ModuleContent {
  id: string;
  title: string;
  contentType: ModuleContentType;
  description?: string;
  thumbnailUrl?: string;
  createdAt: string;
}
export interface ModuleContentApiResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: ModuleContent[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}
export interface CardContentProps {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  description?: string;
  sessionNo?: number;
  url?: string;
  length?: number | null;
  thumbnail?: string;
  contentType: ModuleContentType;
  onEdit?: () => void;
  onDelete?: () => void;
  duration?: string; // add this
}


export interface GenericUploadProps {
  label?: string;
  type: ModuleContentType;
  onChange: (fileUrl: string) => void;
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  value?: string;
  error?: string;
  [key: string]: any;
}
