import { SurroundService } from './surround.service';
import { VisibilityService } from './visibility.service';
import { SkylineService } from './skyline.service';
import { StoreService } from './store.service';
import { message } from 'antd';
import { DataType } from 'src/store/types';
import { SunShineAnalysisService } from './sunshine-analysis.service';
import { ViewerService } from './viewer.service';
import { AreaBuildingService } from './area-buildings.service';
import { HighlightAnalysisService } from './highlight-analysis.service';
import { RouterAnalysisService } from './router-analysis.service';

export class AnalysisService extends StoreService {
  tools: Record<string, any> = {};
  lastTool?: string;

  constructor(viewerService: ViewerService) {
    super();
    const { viewer } = viewerService;
    this.tools['Around'] = new SurroundService(viewerService);
    this.tools['ViewCampus'] = new VisibilityService(viewer);
    this.tools['ViewRoom'] = new SkylineService(viewerService);
    this.tools['Sunlight'] = new SunShineAnalysisService(viewerService);
    this.tools['Highlight'] = new HighlightAnalysisService(viewerService);
    this.tools['Statistics'] = new AreaBuildingService(viewerService);
    this.tools['Router'] = new RouterAnalysisService();
  }

  active(tool: string): void {
    this.deactive();
    if (tool === 'View') {
      if (this.getState('room')) {
        this.lastTool = 'ViewRoom';
      } else if (this.getState('campus')) {
        this.lastTool = 'ViewCampus';
      }
    } else if (['SplitScreen', 'RollerShutters'].includes(tool)) {
      this.lastTool = 'Router';
    } else if (['HouseSell', 'School'].includes(tool)) {
      this.lastTool = 'Highlight';
    } else {
      this.lastTool = tool;
    }
    if (!this.lastTool) return;
    if (
      !(this.lastTool in this.tools) &&
      !['Measure', 'Video'].includes(this.lastTool)
    ) {
      message.warn('功能正在开发中~~~');
      this.store.dispatch({
        type: DataType.ANALYSISTOOL,
        value: ''
      });
      return;
    }
    const success = this.tools[this.lastTool]?.active(tool);
    if (success === false) {
      this.store.dispatch({
        type: DataType.ANALYSISTOOL,
        value: ''
      });
    }
  }

  change(val: { func: string; multi?: boolean; params?: any }): void {
    if (!this.lastTool) return;
    if (val.multi === true) {
      this.tools[this.lastTool]?.[val.func]?.(...val.params);
    } else {
      this.tools[this.lastTool]?.[val.func]?.(val.params);
    }
  }

  deactive(): void {
    if (!this.lastTool) return;
    this.tools[this.lastTool]?.deactive();
    if (this.lastTool === 'Measure') {
      this.store.dispatch({
        type: DataType.MAPTOOL,
        value: 'clear'
      });
    }
    this.lastTool = undefined;
  }
}
