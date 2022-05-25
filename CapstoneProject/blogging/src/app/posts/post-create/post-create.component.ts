import { Component,EventEmitter,OnInit,Output } from "@angular/core";
import { FormControl, FormGroup,Validators, NgForm } from "@angular/forms";
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
    form:FormGroup;
    imagePreview:string;
    private mode='create';
    private postId:string;
    // @Output() postCreated=new EventEmitter<Post>();
    constructor(public postsService:PostsService,public route:ActivatedRoute){
        this.postId="null";
        this.form=new FormGroup({});
        this.imagePreview="";
        // this.post={id:"null",title:"null",content:"null"};
    }//shortcut to create an element postsService
    onImagePicked(event:Event){
        const file=(event.target as HTMLInputElement).files![0];
        this.form.patchValue({image:file});
        this.form.get('image')?.updateValueAndValidity();
        console.log(file);
        console.log(this.form);
        const reader= new FileReader();
        reader.onload=()=>{
            this.imagePreview=reader.result as string;
        };
        reader.readAsDataURL(file);
    }
    // onAddPost(form:NgForm){
    onAddPost(){
        if(this.form.invalid){
            return;
        }
        // const post:Post={title: form.value.title,content:form.value.content};
        // this.postCreated.emit(post);
        if(this.mode==='create'){
            this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
        }else {
            this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
        }
        // this.form.resetForm();
        this.form.reset();
    }
    ngOnInit(): void {
        this.form=new FormGroup({
            'title':new FormControl(null,{validators:[Validators.required]}),
            'content':new FormControl(null,{validators:[Validators.required]}),
            image: new FormControl(null),
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode='edit';
                this.postId=paramMap.get('postId')||"";
                // this.post=this.postsService.getPost(this.postId);
                this.postsService.getPost(this.postId).subscribe(postData=>{
                    this.post={id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath};
                    this.form.setValue({'title':this.post.title,'content':this.post.content,'image':this.post.imagePath});
                })
            }else{
                this.mode='create';
                this.postId="null";
            }
        });
    }


}