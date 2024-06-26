import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { AlphabetSearchComponent } from './components/alphabet-search/alphabet-search.component';
import { CategorySearchComponent } from './components/category-search/category-search.component';
import { CreateEntryComponent } from './components/create-entry/create-entry.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { ItemComponent } from './components/item/item.component';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { PopularSearchComponent } from './components/popular-search/popular-search.component';
import { RecommendedSearchComponent } from './components/recommended-search/recommended-search.component';
import { SearchComponent } from './components/search/search.component';
import { ViewUserActivityComponent } from './components/view-user-activity/view-user-activity.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'info', component: InfoComponent },
  { path: 'search', component: SearchComponent },
  { path: 'login-landing', component: LoginLandingComponent },
  { path: 'recommended-search', component: RecommendedSearchComponent },
  { path: 'popular-search', component: PopularSearchComponent },
  { path: 'alphabet', component: AlphabetSearchComponent },
  { path: 'category', component: CategorySearchComponent },
  { path: 'create-entry', component: CreateEntryComponent },
  { path: 'user-activity', component: ViewUserActivityComponent},
  { path: 'admin-management', component: AdminManagementComponent},
  { path: ':id', component: ItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
