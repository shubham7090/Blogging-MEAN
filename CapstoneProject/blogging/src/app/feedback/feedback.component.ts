import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Collection } from "mongoose";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Feedback } from "./feedback.model";
import { FeedbackService } from "./feedback.service";

@Component({
    selector:'app-feedback',
    templateUrl:'./feedback.component.html',
    styleUrls:['./feedback.component.css']
})
export class FeedbackComponent implements OnInit,OnDestroy{
    isUser=true;
    userIsAuthenticated=false;
    authLitsnerSubs:Subscription;
    postsSub:Subscription;
    @Input() feedbacks: any={};
    constructor(private feedbackService:FeedbackService,private authService:AuthService,){
        this.authLitsnerSubs=new Subscription();
        this.postsSub=new Subscription();
    }

    ngOnInit(): void {
        this.userIsAuthenticated=this.authService.getIsAuth();
        console.log(this.userIsAuthenticated);
        this.authLitsnerSubs=this.authService.getauthStatusLitsner().subscribe(isAuthenticated=>{
            this.userIsAuthenticated=isAuthenticated;
        });
        if(this.userIsAuthenticated){
            if(localStorage.getItem("userEmail")?.split("@")[1].split(".")[0]==="admin"){
                this.isUser=false;
            }else{
                this.isUser=true;
            }
        }
        this.feedbackService.getFeedbacks()!.subscribe(data=>{
            console.log(data.feedbacks);
            this.feedbacks=data.feedbacks;
            
            console.log("Code is here"+this.feedbacks);
        });
        
        // this.postsSub=this.feedbackService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});

    }
    ngOnDestroy(): void {
        this.authLitsnerSubs.unsubscribe();
    }
    onFeedbackSubmit(form:NgForm){
        if(form.invalid){return;}
        console.log("form submit button clicked");

        this.feedbackService.createFeedback(form.value.rating,form.value.content);
    }

}