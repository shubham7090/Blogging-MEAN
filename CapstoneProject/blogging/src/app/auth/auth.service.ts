import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class AuthService{
    private isAuthenticated=false;
    private token:string;
    private authStatusLitsner=new Subject<boolean>();
    userId:string;
    constructor(private http:HttpClient,private router:Router){
        this.token="";
        this.userId="";
    }
    getToken(){
        return this.token;
    }
    getauthStatusLitsner(){
        return this.authStatusLitsner.asObservable();
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    createUser(name:string,number:string,email:string,password:string){
        const authData:AuthData={
            email:email,
            password:password,
            name:name,
            number:number
        };
        this.http.post("http://localhost:3000/api/user/signup",authData).subscribe(res=>{
            console.log(res);
            this.router.navigate(['/']);
        })
    }

    login(email:string,password:string){
        const authData:AuthData={
            email:email,
            password:password,
            name:'',
            number:''
        };
        this.http.post<{token:string,userId:string}>("http://localhost:3000/api/user/login",authData).subscribe(res=>{
            this.token=res.token;
            if(this.token){
                this.isAuthenticated=true;
                this.authStatusLitsner.next(true);
                this.userId=res.userId;
                this.saveAuthData(this.token);
                this.router.navigate(['/']);
            }
        })
    }
    autoAuthUser(){
        const token=localStorage.getItem("token");
        if(!token){
            return;
        }
    }
    logout(){
        this.token="null";
        this.isAuthenticated=false;
        this.authStatusLitsner.next(false);
        this.clearAuthData();
        this.userId="";
        this.router.navigate(['/']);
    }
    private saveAuthData(token:string){
        localStorage.setItem("token",token);
    }
    private clearAuthData(){
        localStorage.removeItem("token");
    }
}