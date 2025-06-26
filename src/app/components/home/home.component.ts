import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CommonModule } from '@angular/common';
import { Difficulty, GameControlAction, GameControlType } from '../../models/app.enums';
import { ModalConfig, ModalService } from '../../service/modal.service';
import { getGameRulesModalConfig, getMainControls } from '../../service/data.service';
import { GameControl, GameControlOption } from '../../models/app.model';

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
  public readonly gameControlAction: typeof GameControlAction = GameControlAction;
  public readonly controls: GameControl[] = getMainControls();
  public readonly MAP_DIFFICULTY_TO_DESCRIPTION: Record<Difficulty, string> = {
    [Difficulty.Easy]: 'Easy',
    [Difficulty.Medium]: 'Medium',
    [Difficulty.Hard]: 'Hard'
  };
  public difficulty: Difficulty = Difficulty.Easy;
  public allowDropdown: boolean = true;

  constructor(
    private modalService: ModalService
  ) {
    this.controls = getMainControls();
  }

  private openRulesModal() {
    const config: ModalConfig = getGameRulesModalConfig();
    this.modalService.open(config);
  }

  private createNewGame(): void {
    //TODO: restart game
  }


  public onControlClick(control: GameControl): void {
    if (control.type === GameControlType.Button) {
      switch (control.id) {
        case GameControlAction.NewGame:
          this.createNewGame();
          break;
        case GameControlAction.Rules:
          this.openRulesModal();
          break;
      }
    }
  }

  public onMouseOver(): void {
    this.allowDropdown = true;
  }

  public onControlOptionClick(control: GameControl, option: GameControlOption): void {
    this.allowDropdown = false;
    if (control.id === GameControlAction.Difficulty) {
      this.difficulty = option.id as Difficulty;
      this.createNewGame();
    }
  }
}

