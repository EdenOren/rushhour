import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ModalConfig } from '../../service/modal.service';

@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.scss',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle],
})
export class ModalComponent {
    @Input({required: true }) config: ModalConfig = { title: '', content: '' };
    @Output() close = new EventEmitter<void>();
    
    public onClose() {
      this.close.emit();
    }
}