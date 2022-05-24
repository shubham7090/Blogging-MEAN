import { Component,EventEmitter,OnInit,Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
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
    post:any;//Type is Post
    private mode='create';
    private postId:string;
    // @Output() postCreated=new EventEmitter<Post>();
    constructor(public postsService:PostsService,public route:ActivatedRoute){
        this.postId="null";
        // this.post={id:"null",title:"null",content:"null"};
    }//shortcut to create an element postsService
    onAddPost(form:NgForm){
        if(form.invalid){
            return;
        }
        // const post:Post={title: form.value.title,content:form.value.content};
        // this.postCreated.emit(post);
        if(this.mode==='create'){
            this.postsService.addPost(form.value.title,form.value.content);
        }else {
            this.postsService.updatePost(this.postId,form.value.title,form.value.content);
        }
        form.resetForm();
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode='edit';
                this.postId=paramMap.get('postId')||"";
                // this.post=this.postsService.getPost(this.postId);
                this.postsService.getPost(this.postId).subscribe(postData=>{
                    this.post={id:postData._id,title:postData.title,content:postData.content}
                })
            }else{
                this.mode='create';
                this.postId="null";
            }
        });
    }
}