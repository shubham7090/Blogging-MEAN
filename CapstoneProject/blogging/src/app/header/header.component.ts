import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
    userIsAuthenticated=false;
    userName:string;
    userId:string;
    private authLitsnerSubs:Subscription;
    constructor(private authService:AuthService){
        this.authLitsnerSubs=new Subscription();
        this.userName="";
        this.userId="";
    }
    ngOnInit(): void {
        this.userIsAuthenticated=this.authService.getIsAuth();
        this.authLitsnerSubs=this.authService.getauthStatusLitsner().subscribe(isAuthenticated=>{
            this.userIsAuthenticated=isAuthenticated;
        });
        if(this.userIsAuthenticated){
            this.userName=localStorage.getItem("userName")!;
            this.userId=localStorage.getItem("userId")!;

        }
    }
    ngOnDestroy(): void {
        this.authLitsnerSubs.unsubscribe();
    }
    onLogout(){
        this.authService.logout();
    }
}