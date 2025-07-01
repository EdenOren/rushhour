import { DragDirection } from "../../models/app.enums";
import { Vehicle } from "../../models/app.model";

export function getDraggingDirection(vehicle: Vehicle): DragDirection {
    if (vehicle.cols > vehicle.rows) {
        return DragDirection.Horizontal;
    } else {
        return DragDirection.Vertical;
    }
}