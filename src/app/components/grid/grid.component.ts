import { Component } from '@angular/core';
import {GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridType} from 'angular-gridster2';

const gridRows: number = 6;
const gridCols: number = 6;

const defaultEmptyGrid: Partial<GridsterItem> = {
    cols: 1,
    rows: 1
}

@Component({
    standalone: true,
    imports: [GridsterComponent, GridsterItemComponent],
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent {
    public options: GridsterConfig;
    public dashboard: Array<GridsterItem>;

    constructor() {
        this.options = {
            gridType: GridType.Fit,
            minCols: gridCols,
            maxCols: gridCols,
            minRows: gridRows,
            maxRows: gridRows,
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true
            },
            itemChangeCallback: this.itemChange,
            itemResizeCallback: this.itemResize,
        };
        this.dashboard = this.getDefaultGrid();;
    }

    private getDefaultGrid(): Array<GridsterItem> {
        let dashboard: Array<GridsterItem> = [];
        for (let y = 0; y < gridRows; y++) {
            for (let x = 0; x < gridCols; x++) {
                dashboard.push({
                    ...defaultEmptyGrid,
                    y,
                    x
                } as GridsterItem);
            }
        }
        return dashboard;
    }

    itemChange = (item: GridsterItem, itemComponent: GridsterItemComponentInterface): void => {
        console.info('itemChanged', item, itemComponent);
    }

    itemResize = (item: GridsterItem, itemComponent: GridsterItemComponentInterface): void => {
        console.info('itemResized', item, itemComponent);
    }

    changedOptions() {
        if (this.options && this.options.api && this.options.api.optionsChanged) {
            this.options.api.optionsChanged();
        }
    }

    removeItem(item: GridsterItem) {
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }
}
