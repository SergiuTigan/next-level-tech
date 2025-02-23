import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team.component';

const teamRouting: Routes = [
  {path: '', component: TeamComponent}
];

@NgModule({
  imports: [RouterModule.forChild(teamRouting)],
  exports: [RouterModule]
})
export class TeamRoutingModule {
}
