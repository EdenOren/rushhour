import { Component, EventEmitter, Input, Output, twoWayBinding } from '@angular/core';
import {GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridType} from 'angular-gridster2';
import { DEFAULT_EXIT_ROW, GRID_COLS, GRID_ROWS } from '../../service/data.service';
import { Vehicle } from '../../models/app.model';
import { DragDirection, UserError as UserError, VehicleType } from '../../models/app.enums';

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
            this.carPositions = this.getCarsPlaceholderArray(config);
            this.grid = this.getGameGrid(config);
        } else {
            this.grid = [];
        }
        this.updatePrevGrid();
    };
    @Input() exitRow: number = DEFAULT_EXIT_ROW;
    @Output() onGridComplete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onGridError: EventEmitter<void> = new EventEmitter<void>();
    @Output() onUserError: EventEmitter<UserError> = new EventEmitter<UserError>();

    private prevGrid: Array<GridsterItem> = [];
    private carPositions: (number | null)[][] | null = null;
    private isValidDrag: boolean = true;


    public options: GridsterConfig;
    public grid: Array<GridsterItem> = [];

    constructor() {
        this.options = {
            gridType: GridType.Fit,
            enableBoundaryControl: true,
            swap: false,
            pushItems: false,
            minCols: GRID_COLS,
            maxCols: GRID_COLS,
            minRows: GRID_ROWS,
            maxRows: GRID_ROWS,
            draggable: {
                enabled: true,
                stop: this.itemDragEnd

            },
            resizable: {
                enabled: false
            },
            itemChangeCallback: this.itemChange
        };
    }

    private getCarsPlaceholderArray(config: Vehicle[]): (number | null)[][] | null {
        let gridError: boolean = false;
        const rows: Array<number> = new Array(GRID_COLS).fill(null);
        const grid = rows.map((row: number) => new Array(GRID_ROWS).fill(null));
        config.forEach(vehicle => {
            grid[vehicle.y][vehicle.x] = vehicle.id;
            if (vehicle.rows > 1) {
                for (let i = 1; i < vehicle.rows; i++) {
                    if (vehicle.y + i > GRID_COLS - 1) {
                        gridError = true;
                        this.onGridError.emit();
                    }
                    grid[vehicle.y + i][vehicle.x] = vehicle.id;
                }
            }
            if (vehicle.cols > 1) {
                for (let i = 1; i < vehicle.cols; i++) {
                    if (vehicle.x + i > GRID_ROWS - 1) {
                        gridError = true;
                        this.onGridError.emit();
                    }
                    grid[vehicle.y][vehicle.x + i] = vehicle.id;
                }
            }
        });
        return gridError ? null : grid;
    }

    private getGameGrid(config: Vehicle[]): Array<GridsterItem> {
        if (!this.carPositions) {
            return [];
        }
        let addedVechicles: number[] = [];
        let grid: Array<GridsterItem> = [];
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS;) {
                if (this.carPositions[row][col] != null) {
                    const carId: number = this.carPositions[row][col] as number;
                    if (addedVechicles.includes(carId)) {
                        col++;
                        continue;
                    }
                    const carConfig: Vehicle = config.find(vehicle => vehicle.id === this.carPositions?.[row][col]) as Vehicle;
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

    private checkOverlap(currentPosition: number | null, currentId: number): void {
        if (currentPosition === null || !this.isValidDrag) {
            return;
        }
        if (currentPosition !== currentId) {
            this.isValidDrag = false;
        }
    }

    private updateCarPositions(direction: DragDirection, prevItem: GridsterItem, currItem: GridsterItem, itemId: number): void {
        const updatedCarPositions: (number | null)[][] | null = this.carPositions?.map(row => [...row]) as (number | null)[][] | null;
        switch (direction) {
            case DragDirection.Horizontal:
                const startCol: number = Math.min(prevItem?.x as number, currItem?.x as number);
                const endCol: number = Math.max(prevItem?.x as number, currItem?.x as number) + currItem.cols;
                for (let col = startCol; col < endCol; col++) {
                    const isColAfter: boolean = col >= currItem.x + currItem.cols;
                    const isColBefore: boolean = col < currItem.x;
                    if (updatedCarPositions) {
                        this.checkOverlap(updatedCarPositions[currItem.y][col], itemId);
                        if (!this.isValidDrag) {
                            this.onUserError.emit(UserError.NoOverlapAllowed);
                            return;
                        }
                        updatedCarPositions[currItem.y][col] = isColAfter || isColBefore ? null : itemId;
                    }
                }
                break;
            case DragDirection.Vertical:
                const startRow: number = Math.min(prevItem?.y as number, currItem?.y as number);
                const endRow: number = Math.max(prevItem?.y as number, currItem?.y as number) + currItem.rows;
                for (let row = startRow; row < endRow; row++) {
                    const isRowAfter: boolean = row >= currItem.y + currItem.rows;
                    const isRowBefore: boolean = row < currItem.y;
                    if (updatedCarPositions) {
                        this.checkOverlap(updatedCarPositions[row][currItem.x], itemId);
                        if (!this.isValidDrag) {
                            this.onUserError.emit(UserError.NoOverlapAllowed);
                            return;
                        }
                        updatedCarPositions[row][currItem.x] = isRowAfter || isRowBefore ? null : itemId;
                    }
                }
                break;
        }
        this.carPositions = updatedCarPositions;
    }

    private revertGrid(id: number, prevX: number, prevY: number): void {
        this.grid = this.prevGrid.map(item => {
            if (item['id'] === id) {
                item.x = prevX;
                item.y = prevY;
            }
            return { ...item };
        });
    }

    private updatePrevGrid(): void {
        this.prevGrid = this.grid.map(item => ({ ...item }));
    }

    private isValidDragDirection(direction: DragDirection, prevItem: GridsterItem, currItem: GridsterItem): boolean {
        switch (direction) {
            case DragDirection.Horizontal:
                const isHorizontal: boolean = currItem?.y === prevItem?.y;
                return isHorizontal;
            case DragDirection.Vertical:
                const isVetrical: boolean = currItem?.x === prevItem?.x;
                return isVetrical;

        }
        return true;
    }

    private itemChange = (item: GridsterItem, itemComponent: GridsterItemComponentInterface): void => {
        const { type, x, y, cols } = item;
        if (!this.isValidDrag) {
            const { id } = item;
            const { x, y } = this.prevGrid.find(prevItem => prevItem['id'] === id) as GridsterItem;
            this.revertGrid(id, x, y);
            this.isValidDrag = true;
        } else {
            if (type === VehicleType.GreenCar && y === this.exitRow && x === GRID_COLS - cols) {
                this.onGridComplete.emit();
            }
            this.updatePrevGrid();
        }
    }

    // private itemDragStart = (item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void => {
    // }

    private itemDragEnd = (item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void => {
        const { id, dragging } = item;
        const itemPrevData: GridsterItem = this.prevGrid.find(prevItem => prevItem['id'] === id) as GridsterItem;
        const itemCurrData: GridsterItem = itemComponent.$item;
        if (itemCurrData.x === itemPrevData.x && itemCurrData.y === itemPrevData.y) {
            return;
        }
        if (this.isValidDragDirection(dragging, itemPrevData, itemCurrData)) {
            this.updateCarPositions(dragging, itemPrevData, itemCurrData, id);
        } else {
            const error: UserError = dragging === DragDirection.Horizontal 
            ? UserError.CanOnlyMoveHorizontaly 
            : UserError.CanOnlyMoveVertically;
            this.onUserError.emit(error);
            this.isValidDrag = false;
        }
    }
}
