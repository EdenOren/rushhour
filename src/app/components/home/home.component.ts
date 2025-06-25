import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CommonModule } from '@angular/common';
import { ColorPalette, Difficulty, GameControlAction, GameControlType } from '../../models/app.enums';
import { ModalConfig, ModalService } from '../../service/modal.service';
import { getGameRulesModalConfig, getMainControls } from '../../service/data.service';
import { GameControl } from '../../models/app.model';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, GridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public readonly gameControlType: typeof GameControlType = GameControlType;
  public readonly controls: GameControl[] = getMainControls();
  public difficulty: Difficulty = Difficulty.Easy;
  public colorPalette: ColorPalette = ColorPalette.Default;

  constructor(
    private modalService: ModalService
  ) {
    this.controls = getMainControls();
  }

  private openRulesModal() {
    const config: ModalConfig = getGameRulesModalConfig();
    this.modalService.open(config);
  }

  public onControlClick(control: GameControl): void {
    if (control.type === GameControlType.Button) {
      switch (control.id) {
        case GameControlAction.Rules:
          this.openRulesModal();
          break;
      }
    }
  }
}

