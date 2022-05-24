import { Component,EventEmitter,OnInit,Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {Post} from '../post.model';
import { PostsService } from "../posts.service";
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{
    enteredContent='';
    enteredTitle='';
    // @Output() postCreated=new EventEmitter<Post>();
    constructor(public postsService:PostsService,public route:ActivatedRoute){}//shortcut to create an element postsService
    onAddPost(form:NgForm){
        if(form.invalid){
            return;
        }
        // const post:Post={title: form.value.title,content:form.value.content};
        // this.postCreated.emit(post);
        this.postsService.addPost(form.value.title,form.value.content);
        form.resetForm();
    }
    ngOnInit(): void {
        
    }
}