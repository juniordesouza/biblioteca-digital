import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuComponent]
})
export class SobreComponent {}
