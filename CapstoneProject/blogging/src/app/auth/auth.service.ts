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
    private tokenTimer:any;
    userId:string;
    constructor(private http:HttpClient,private router:Router){
        this.token="";
        this.userId="";
        this.tokenTimer=null;
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
        this.http.post<{token:string,expiresIn:number,userId:string,userName:string,email:string}>("http://localhost:3000/api/user/login",authData).subscribe(res=>{
            this.token=res.token;
            if(this.token){
                const expiresInDuration=res.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated=true;
                this.authStatusLitsner.next(true);
                this.userId=res.userId;
                const now=new Date();
                const expiratioDate=new Date(now.getTime()+expiresInDuration*1000);
                this.saveAuthData(this.token,expiratioDate,res.userName,res.email);
                this.router.navigate(['/']);
            }
        })
    }
    autoAuthUser(){
        const authInfo=this.getAuthData();
        if(!authInfo){
            return;
        }
        const now=new Date();
        const expiresIn=authInfo!.expiratioDate.getTime()-now.getTime();
        if(expiresIn>0){
            this.token=authInfo!.token;
            this.isAuthenticated=true;
            this.setAuthTimer(expiresIn/1000)
            this.authStatusLitsner.next(true);
        }
    }
    logout(){
        this.token="null";
        this.isAuthenticated=false;
        this.authStatusLitsner.next(false);
        this.clearAuthData();
        this.userId="";
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }
    private setAuthTimer(duration:number){
        this.tokenTimer=setTimeout(()=>{
            this.logout();
        },duration*1000);
    }
    private saveAuthData(token:string,expiresIn:Date,userName:string,userEmail:string){
        localStorage.setItem("token",token);
        localStorage.setItem("userName",userName);
        localStorage.setItem("userEmail",userEmail);
        localStorage.setItem("expiresIn",expiresIn.toISOString());
        
    }
    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
    }
    private getAuthData(){
        const token=localStorage.getItem("token");
        const expiratioDate=localStorage.getItem("expiresIn");
        if(!token||!expiratioDate){
            return;
        }
        return {
            token:token,
            expiratioDate:new Date(expiratioDate)
        }
    }
}