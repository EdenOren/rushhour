import { Component, EventEmitter, Input, Output, TRANSLATIONS } from '@angular/core';
import {GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridType} from 'angular-gridster2';
import { DEFAULT_EXIT_ROW, GRID_COLS, GRID_ROWS } from '../../service/data.service';
import { Vehicle } from '../../models/app.model';
import { LoaderComponent } from "../../ui/loader/loader.component";
import { VehicleType } from '../../models/app.enums';

@Component({
    standalone: true,
    imports: [GridsterComponent, GridsterItemComponent],
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent {
    @Input() set config(config: Vehicle[]) {
        if (config && !!config.length) {
            this.grid = this.getGameGrid(config);
        } else {
            this.grid = [];
        }
    };
    @Input() exitRow: number = DEFAULT_EXIT_ROW;
    @Output() completeGrid: EventEmitter<void> = new EventEmitter<void>();
    @Output() reloadGrid: EventEmitter<void> = new EventEmitter<void>();

    public options: GridsterConfig;
    public grid: Array<GridsterItem> = [];

    constructor() {
        this.options = {
            gridType: GridType.Fit,
            enableBoundaryControl: true,
            swap: true,
            pushItems: false,
            minCols: GRID_COLS,
            maxCols: GRID_COLS,
            minRows: GRID_ROWS,
            maxRows: GRID_ROWS,
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: false
            }
        };
    }

    private getCarsPlaceholderArray(config: Vehicle[]): (number | null)[][] | null {
        let gridError: boolean = false;
        const rows: Array<number> = new Array(GRID_COLS).fill(null);
        const grid = rows.map((row: number) => new Array(GRID_ROWS).fill(null));
        config.forEach(vehicle => {
            grid[vehicle.x][vehicle.y] = vehicle.id;
            if (vehicle.rows > 1) {
                for (let i = 1; i < vehicle.rows; i++) {
                    if (vehicle.x + i > GRID_COLS - 1) {
                        gridError = true;
                        this.reloadGrid.emit();
                    }
                    grid[vehicle.x + i][vehicle.y] = vehicle.id;
                }
            }
            if (vehicle.cols > 1) {
                for (let i = 1; i < vehicle.cols; i++) {
                    if (vehicle.y + i > GRID_ROWS - 1) {
                        gridError = true;
                        this.reloadGrid.emit();
                    }
                    grid[vehicle.x][vehicle.y + i] = vehicle.id;
                }
            }
        });
        return gridError ? null : grid;
    }

    private getGameGrid(config: Vehicle[]): Array<GridsterItem> {
        const carsPlaceholder: (number | null)[][] | null = this.getCarsPlaceholderArray(config);
        if (!carsPlaceholder) {
            return [];
        }
        let addedVechicles: number[] = [];
        let grid: Array<GridsterItem> = [];
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS;) {
                if (carsPlaceholder[row][col] != null) {
                    const carId: number = carsPlaceholder[row][col] as number;
                    if (addedVechicles.includes(carId)) {
                        col++;
                        continue;
                    }
                    const carConfig: Vehicle = config.find(vehicle => vehicle.id === carsPlaceholder[row][col]) as Vehicle;
                    const { cols } = carConfig;
                    grid.push({ ...carConfig, dragEnabled: true } as GridsterItem);
                    addedVechicles.push(carConfig.id);
                    col += cols;
                } else {
                    col++;
                }
            }
        }
        return grid;
    }

    itemChange = (event: { item: GridsterItem, itemComponent: GridsterItemComponentInterface }): void => {
        const { type, x, y } = event.item;
        if (type === VehicleType.GreenCar && x === this.exitRow && y === GRID_COLS - 1) {
            this.completeGrid.emit();
        }
    }

    itemDragStart = (event: any): void => {
        console.log(event);
    }

    itemDragEnd = (event: any): void => {
        console.log(event);
    }
}
