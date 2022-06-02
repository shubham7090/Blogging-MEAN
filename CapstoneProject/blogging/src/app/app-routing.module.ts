import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path:'',component:PostListComponent},
  {path:'create',component:PostCreateComponent},
  {path:'edit/:postId',component:PostCreateComponent},
  {path:'login',component:LoginComponent},
  {path:'feedback',component:FeedbackComponent},
  {path:'signup',component:SignupComponent},
  {path:':userId',component:PostListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponent=[FeedbackComponent,PostListComponent];