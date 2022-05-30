import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
    selector:'signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css'],
})
export class SignupComponent{
    constructor(public authService:AuthService){}
    onSignup(form:NgForm){
        if(form.invalid){return;}
        this.authService.createUser(form.value.name,form.value.number,form.value.email,form.value.password);
    }
}