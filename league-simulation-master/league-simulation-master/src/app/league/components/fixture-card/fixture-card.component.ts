import { Component, Input } from '@angular/core';
import { MatchFixture } from '../../../../domain/club/matchFixture';

@Component({
  selector: 'app-fixture-card',
  templateUrl: './fixture-card.component.html',
  styleUrl: './fixture-card.component.scss',
})
export class FixtureCardComponent {
  @Input() fixture: MatchFixture[] = [];
  @Input() legend: string = '';
}
