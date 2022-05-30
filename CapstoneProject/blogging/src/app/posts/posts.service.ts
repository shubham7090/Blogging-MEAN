import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from "./post.model";
@Injectable({providedIn:'root'})
export class PostsService{
    private posts:Post[]=[];
    private postsUpdated=new Subject<Post[]>();
    
    constructor(private http:HttpClient,private router:Router){}
    getPosts(){
        this.http.get<{message:string,posts:any[]}>('http://localhost:3000/api/posts').pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return {
                    title:post.title,
                    content:post.content,
                    id:post._id,
                    imagePath:post.imagePath,
                    creator:post.creator
                }
            })
        }))
        .subscribe((transformedPosts)=>{
            this.posts=transformedPosts;
            this.postsUpdated.next([...this.posts]);
        });

        // return [...this.posts];
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    getPost(id:string){
        // return{...this.posts.find(p=>p.id===id)};
        return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>("http://localhost:3000/api/posts/"+id);
    }
    addPost(title:string,content:string,image:File){
        // const post:Post={id:"null",title:title,content:content};
        const postData=new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image);
        this.http.post<{message:string,postId:string,imagePath:string}>('http://localhost:3000/api/posts',postData).subscribe((responseData)=>{
            console.log(responseData.message);
            const postId=responseData.postId;
            const post:Post={
                id:postId,
                title:title,
                content:content,
                imagePath:responseData.imagePath,
                creator:"",
            }
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }
    updatePost(id:string,title:string,content:string,image: File|string){
        let postData;
        if(typeof(image)==='object'){
            postData=new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append("image",image);
            this.http.put("http://localhost:3000/api/posts/"+id,postData).subscribe(res=>console.log(res));
        }else{
            const post:Post={id:id,title:title,content:content,imagePath:image,creator:""};
            this.http.put("http://localhost:3000/api/posts/"+id,post).subscribe(res=>console.log(res));
        }
        console.log(`id : ${id} title : ${title} content: ${content}`);
        
        
        
        this.router.navigate(["/"]);
    }
    deletePost(postId:string){
        this.http.delete('http://localhost:3000/api/posts/'+postId).subscribe(()=>{
            console.log("Deleted!"); 
            const updatedPosts= this.posts.filter(post=>post.id!==postId);
            this.posts=updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}