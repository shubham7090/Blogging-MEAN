import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import {Post} from '../post.model';
import { PostsService } from "../posts.service";
@Component({
    selector:'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls:['./post-list.component.css'],
})
export class PostListComponent implements OnInit,OnDestroy{
    // posts=[
    //     {title:'First Post',content:'This is the first post\'s content'},
    //     {title:'Second Post',content:'This is the second post\'s content'},
    //     {title:'Third Post',content:'This is the third post\'s content'},
    // ];
    @Input() posts:Post[]=[]
    postsService:PostsService;
    userIsAuthenticated=false;
    userId:string;
    private authStatusSub:Subscription;
    constructor(postsService:PostsService,private authService:AuthService,private route:ActivatedRoute){
        this.postsService=postsService;
        this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});
        this.authStatusSub=new Subscription();
        this.userId="";
    }
    private postsSub:Subscription;
    ngOnInit(): void {
        // this.posts=this.postsService.getPosts();
        
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('userId')){
                const userId1=paramMap.get('userId')||"";
                this.postsService.getPostsUserId(userId1);
                this.userId=this.authService.userId;
                console.log(this.userId);
                
                this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});//3 arguments : next()->when new data is emitted,error()->error,complete()->no new data to be emitted
                this.userIsAuthenticated=this.authService.getIsAuth();
                this.authStatusSub=this.authService.getauthStatusLitsner().subscribe(isAuthenticated=>{
                    this.userIsAuthenticated=isAuthenticated;
                    this.userId=this.authService.userId;
                });
            }else{
                this.postsService.getPosts();
                this.userId=this.authService.userId;
                this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});//3 arguments : next()->when new data is emitted,error()->error,complete()->no new data to be emitted
                this.userIsAuthenticated=this.authService.getIsAuth();
                this.authStatusSub=this.authService.getauthStatusLitsner().subscribe(isAuthenticated=>{
                    this.userIsAuthenticated=isAuthenticated;
                    this.userId=this.authService.userId;
                });
            }
        });
    }
    onDelete(postId:string){
        this.postsService.deletePost(postId);
    }
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}