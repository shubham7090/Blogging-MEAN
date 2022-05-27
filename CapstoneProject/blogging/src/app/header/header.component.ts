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
    private authLitsnerSubs:Subscription;
    constructor(private authService:AuthService){
        this.authLitsnerSubs=new Subscription();
    }
    ngOnInit(): void {
        this.authLitsnerSubs=this.authService.getauthStatusLitsner().subscribe(isAuthenticated=>{
            this.userIsAuthenticated=isAuthenticated;
        });
    }
    ngOnDestroy(): void {
        this.authLitsnerSubs.unsubscribe();
    }
    onLogout(){
        this.authService.logout();
    }
}