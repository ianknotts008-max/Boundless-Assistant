export enum Tab {
  Home = "HOME",
  Data = "DATA",
  About = "ABOUT",
}

export interface TextPart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: TextPart[];
  // For UI rendering, not for API
  uiImagePreview?: string;
  // For special message types in UI
  type?: 'message' | 'image-generation' | 'research-report';
  // For research report
  sources?: any[];
  // for generated image
  generatedImageUrl?: string;
}


export type FileStatus = 'Uploaded' | 'Processing' | 'Processed' | 'Training' | 'Completed' | 'Error';

export interface UploadedFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
}