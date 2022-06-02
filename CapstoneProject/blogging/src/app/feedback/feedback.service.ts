import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Feedback } from "./feedback.model";
import {map} from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class FeedbackService{
    private feedbacks:Feedback[]=[];
    constructor(private http:HttpClient,private router:Router){}
    createFeedback(rating:number,content:string){
        const feedbackData:Feedback={
            rating:rating,
            content:content,
            author:""
        }
        this.http.post("http://localhost:3000/api/feedback",feedbackData).subscribe(res=>{
            console.log(res);
            this.router.navigate(['/']);
        });
    }
    getFeedbacks(){
        return this.http.get<{feedbacks:any[]}>('http://localhost:3000/api/feedbacks')
        // .then((feedbacksData)=>{
        //     return feedbacksData.feedbacks;
        // });
    }
}