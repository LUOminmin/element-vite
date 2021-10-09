export interface AnalysisBaseService {
  type: string;

  active(...rest: any[]): void;

  deactive(): void;
}
