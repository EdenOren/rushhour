import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CommonModule } from '@angular/common';
import { Difficulty, GameControlAction, GameControlType, UserError, VehicleType } from '../../models/app.enums';
import { ModalConfig, ModalService } from '../../service/modal.service';
import { DEFAULT_EXIT_ROW, getGameRulesModalConfig, getMainControls, GRID_SIZE } from '../../service/data.service';
import { GameControl, GameControlOption, NewGameResponse, Vehicle } from '../../models/app.model';
import { ApiService } from '../../service/api.service';
import { catchError } from 'rxjs';
import { LocalStorageItems as LocalStorageItem, StorageService } from '../../service/storage.service';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { getDraggingDirection } from '../../shared/helper/helper.helper';
import { ToastService } from '../../service/toaster.service';
import { ParticlesComponent } from "../../shared/particles/particles.component";
import { CarColor } from '../vehicle/vehicle.component';

const particlesTimeOut: number = 2500;

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, GridComponent, LoaderComponent, ParticlesComponent],
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
  public exitRow: number = DEFAULT_EXIT_ROW;
  public vehiclesConfig: WritableSignal<Vehicle[]> = signal<Vehicle[]>([]);
  public isLoadingNewGame: WritableSignal<boolean> = signal<boolean>(false);
  public gameWon: WritableSignal<boolean> = signal<boolean>(false);


  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.controls = getMainControls();
    this.setGameParamsFromCache();
  }

  private setGameParamsFromCache(): void {
    const cachedGame: NewGameResponse | null = this.storageService.getItem<NewGameResponse>(LocalStorageItem.GameCache);
    if (cachedGame) {
      this.setGameParams(cachedGame);
      this.isLoadingNewGame.set(false);
    }
  }

  private openRulesModal() {
    const config: ModalConfig = getGameRulesModalConfig();
    this.modalService.open(config);
  }

  private setGameParams(response: NewGameResponse): void {
    const vehicleConfig: Vehicle[] = response.vehicles.map(
      (vehicle: Vehicle) => ({
        ...vehicle,
        dragging: getDraggingDirection(vehicle),
        color: this.getCarColor(vehicle)
      })
    );

    this.exitRow = response.exitRow;
    this.vehiclesConfig.set(vehicleConfig);
  }
  
  private getCarColor(car: Vehicle): string {
    const colors: CarColor[] = (Object.values(CarColor) as CarColor[]).filter(key => key !== CarColor.Green);
    if (car.type === VehicleType.GreenCar) {
        return CarColor.Green;
    } else {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
  }

  private createNewGame(): void {
    this.isLoadingNewGame.set(true);
    this.apiService.getNewGame({
      size: GRID_SIZE,
      difficulty: this.difficulty
    })
    .pipe(catchError((error) => {
      this.isLoadingNewGame.set(false);
      this.gameWon.set(false);
      throw error;
    }))
    .subscribe((response: NewGameResponse) => {
      this.setGameParams(response);
      this.isLoadingNewGame.set(false);
      this.gameWon.set(false);
      this.storageService.setItem(LocalStorageItem.GameCache, response);
    });
  }

  public reloadGrid(): void {
    if (this.isLoadingNewGame()) {
      return;
    }
    this.createNewGame();
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
      if (this.difficulty === option.id) {
        return;
      }
      this.difficulty = option.id as Difficulty;
      this.createNewGame();
    }
  }

  public onGridComplete(): void {
    this.gameWon.set(true);
    setTimeout(() => {
      this.gameWon.set(false);
    }, particlesTimeOut)
    
    this.toastService.success('You won!');
    this.storageService.removeItem(LocalStorageItem.GameCache);
    this.createNewGame();
  }

  public onGridUserError(event: UserError): void {
    let errorMessage: string = '';
    switch (event) {
      case UserError.NoOverlapAllowed:
        errorMessage = 'No overlap allowed';
        break;
      case UserError.CanOnlyMoveHorizontaly:
        errorMessage = 'Only moves left and right';
        break;
      case UserError.CanOnlyMoveVertically:
        errorMessage = 'Only moves up and down';
        break;
    }
    if (errorMessage) {
      this.toastService.error(errorMessage);
    }
  }

}

