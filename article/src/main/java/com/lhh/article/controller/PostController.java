package com.lhh.article.controller;

import com.lhh.article.dto.request.CreatePostRequest;
import com.lhh.article.dto.request.UpdatePostRequest;
import com.lhh.article.dto.response.PageResponse;
import com.lhh.article.dto.response.PostResponse;
import com.lhh.article.dto.response.PostStatsResponse;
import com.lhh.article.dto.response.PostTitleResponse;
import com.lhh.article.service.PostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @GetMapping
    public PageResponse<PostResponse> getPosts(@RequestParam Map<String, String> params) {
        var posts = postService.getPosts(params);
        return PageResponse.<PostResponse>builder()
                .content(posts.getContent())
                .page(posts.getNumber())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Integer id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/title")
    public PageResponse<PostTitleResponse> getPostByTitle(@RequestParam Map<String, String> params) {
        var posts = postService.getPostTitles(params);
        return PageResponse.<PostTitleResponse>builder()
                .content(posts.getContent())
                .page(posts.getNumber())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .build();
    }

    @PreAuthorize("hasRole('USER')")
    @PatchMapping()
    public ResponseEntity<PostResponse> updatePost(@RequestBody UpdatePostRequest request) {
        PostResponse post = postService.updatePost(request);
        return ResponseEntity.ok(post);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @ModelAttribute CreatePostRequest request) {
        PostResponse post = postService.createPost(request);
        return ResponseEntity.ok(post);
    }
}
