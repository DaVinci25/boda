import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { DetailsComponent } from './components/details/details.component';
//import { StoryComponent } from './components/story/story.component';
import { GiftsComponent } from './components/gifts/gifts.component';
import { FaqComponent } from './components/faq/faq.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rsvp', component: RsvpComponent },
  { path: 'detalles', component: DetailsComponent },
 // { path: 'historia', component: StoryComponent },
  { path: 'regalos', component: GiftsComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: '' }
];
