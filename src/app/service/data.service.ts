import { Difficulty, GameControlAction, GameControlType } from "../models/app.enums";
import { GameControl } from "../models/app.model";
import { ModalConfig } from "./modal.service";

export function getMainControls(): GameControl[] {
    return [
    {
      name: 'New Game',
      id: GameControlAction.NewGame,
      type: GameControlType.Button
    }, 
    {
      name: 'Difficulty',
      id: GameControlAction.Difficulty,
      type: GameControlType.Dropdown,
      options: [{
        name: 'Easy',
        id: Difficulty.Easy
      }, 
      {
        name: 'Medium',
        id: Difficulty.Medium
      }, 
      {
        name: 'Hard',
        id: Difficulty.Hard
      }]
    }, 
    {
      name: 'How to Play?',
      id: GameControlAction.Rules,
      type: GameControlType.Button
    }
  ];
}

export function getGameRulesModalConfig(): ModalConfig {
  return {
    title: 'How to Play?',
    content: `<h2>Rush Hour: Gridlock Escape!</h2>
      <p><b>Goal:</b> Get your <span style="color: green; font-weight: bold;">green car</span> off the board via the right exit.</p>
      <hr>
      <h3>Setup</h3>
      <ul>
          <li><b>Board:</b> 6x6 grid.</li>
          <li><b>Pieces:</b> Cars (2 squares), Trucks (3 squares), and your special <span style="color: green; font-weight: bold;">Green Car</span> (2 squares).</li>
          <li>Each challenge has a unique starting layout.</li>
      </ul>
      <hr>
      <h3>How to Move</h3>
      <ul>
          <li><b>Straight Only:</b> Vehicles slide forward/backward (horizontal) or up/down (vertical). No turns.</li>
          <li><b>Clear Path:</b> Move pieces only if squares are empty.</li>
          <li><b>No Overlap:</b> Pieces can't land on others. All stay on the board until your green car exits.</li>
          <li><b>One Move:</b> Move one vehicle per turn.</li>
      </ul>
      <hr>
      <h3>Winning</h3>
      <p>You win when your <span style="color: green; font-weight: bold;">green car</span> slides completely off the board through the exit!</p>`
};
}