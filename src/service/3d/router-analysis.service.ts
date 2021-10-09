import { AnalysisBaseService } from './analysis-base.service';
import { StoreService } from './store.service';
import { hasHistory } from 'src/App';
import { message } from 'antd';

export class RouterAnalysisService
  extends StoreService
  implements AnalysisBaseService
{
  type = 'RouterAnalysis';
  private goto = false;

  constructor() {
    super();
  }

  active(tool: string): boolean {
    const campus = String(this.getState('campus'));
    if (!campus) {
      message.warn('请先选择小区');
      return false;
    }
    if (tool === 'SplitScreen') {
      const building = String(this.getState('building'));
      const floor = String(this.getState('floor'));
      if (!building || !floor) {
        message.warn('请先选择具体楼层');
        return false;
      }
      hasHistory.push(`/linkage23D/${campus}-${building}/${floor}`);
      this.goto = true;
      return true;
    } else if (tool === 'RollerShutters') {
      hasHistory.push('/rollblind');
      this.goto = true;
      return true;
    }
    return false;
  }

  deactive(): void {
    if (!this.goto) return;
    hasHistory.goBack();
    this.goto = false;
  }
}
