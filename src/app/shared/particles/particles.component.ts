import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { loadSlim } from "@tsparticles/slim";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { Container, ParticlesOptions } from "@tsparticles/engine";
import { particlesDefaulOptions } from "../../service/data.service";

@Component({
  selector: 'particles',
  standalone: true,
  imports: [NgxParticlesModule],
  templateUrl: './particles.component.html',
  styleUrl: './particles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticlesComponent implements OnInit {
  public readonly id: string = 'tsparticles';
  public readonly particlesOptions: ParticlesOptions = particlesDefaulOptions as ParticlesOptions;


  constructor(private particlesService: NgParticlesService) {}

  ngOnInit(): void {
      this.particlesService.init(async (engine) => {
      console.log(engine);
      await loadSlim(engine);
    });
  }

  public particlesLoaded(container: Container): void {
    console.log(container);
  }

  
}