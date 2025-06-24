import { Component } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CommonModule } from '@angular/common';

interface GameControl {
  name: string;
  type?: any;
}

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, GridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public controls: GameControl[] = [
    {
      name: 'new game'
    }, 
    {
      name: 'difficulty'
    }, 
    {
      name: 'color palette'
    }, 
    {
      name: 'rules'
    }
  ];
isFirst: any;

}
