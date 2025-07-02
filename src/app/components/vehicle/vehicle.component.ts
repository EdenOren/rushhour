import { Component, Input } from '@angular/core';
import { DragDirection } from '../../models/app.enums';

export enum CarColor {
    Green = 'green',
    Red = 'red',
    Blue = 'blue',
    Purple = 'purple',
    Yellow = 'yellow',
    Orange = 'orange',
    Pink = 'pink',

}
@Component({
  selector: 'vehicle',
  templateUrl: 'vehicle.component.html',
  styleUrl: 'vehicle.component.scss',
  standalone: true
})
export class VehicleComponent {
    @Input() direction: DragDirection = DragDirection.Horizontal;
    @Input() color: CarColor = CarColor.Red;

    public readonly dragDirection: typeof DragDirection = DragDirection;


}