export enum TestStatus {
  NORMAL = 'Normal',
  LOW = 'Low',
  HIGH = 'High',
  CRITICAL_LOW = 'Critical Low',
  CRITICAL_HIGH = 'Critical High',
  UNKNOWN = 'Unknown'
}

export interface ExtractedMetric {
  testName: string;
  value: number;
  unit: string;
  rangeMin?: number;
  rangeMax?: number;
  status: TestStatus;
  category: string; // e.g., "Lipid Panel", "CBC"
}

export interface ReasoningInsight {
  title: string;
  description: string;
  relatedMetrics: string[];
  severity: 'info' | 'warning' | 'alert';
}

export interface AnalysisResult {
  metrics: ExtractedMetric[];
  summary: string;
  insights: ReasoningInsight[];
  doctorQuestions: string[];
}

export interface FileUploadState {
  file: File | null;
  previewUrl: string | null;
}
