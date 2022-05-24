import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
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
    constructor(postsService:PostsService){
        this.postsService=postsService;
        this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});
    }
    private postsSub:Subscription;
    ngOnInit(): void {
        // this.posts=this.postsService.getPosts();
        this.postsService.getPosts();
        this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{this.posts=posts});//3 arguments : next()->when new data is emitted,error()->error,complete()->no new data to be emitted
    }
    onDelete(postId:string){
        this.postsService.deletePost(postId);
    }
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }
}