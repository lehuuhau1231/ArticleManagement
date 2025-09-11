package com.lhh.article.service;

import com.cloudinary.Cloudinary;
import com.lhh.article.dto.request.CreatePostRequest;
import com.lhh.article.dto.request.UpdatePostRequest;
import com.lhh.article.dto.response.PostResponse;
import com.lhh.article.dto.response.PostTitleResponse;
import com.lhh.article.entity.Post;
import com.lhh.article.exception.AppException;
import com.lhh.article.exception.ErrorCode;
import com.lhh.article.repository.PostRepository;
import com.lhh.article.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    UserRepository userRepository;
    Cloudinary cloudinaryClient;
    static int PAGE_SIZE = 5;

    public Page<PostResponse> getPosts(Map<String , String> params) {
        int page = parsePageNumber(params.get("page"));
        String kw = params.get("kw");

        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        return postRepository.findAll(kw, pageable);
    }

    public PostResponse getPostById(Integer id) {
        PostResponse post =  postRepository.getPostById(id);
        if(post == null) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        return post;
    }

    public Page<PostTitleResponse> getPostTitles(Map<String , String> params) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        int page = parsePageNumber(params.get("page"));
        String title = params.get("title");

        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        return postRepository.getPostsByUserEmail(email, title, pageable);
    }

    public PostResponse updatePost(UpdatePostRequest request) {
        Post post = getPostByIdOfAuthor(request.getId());

        if(request.getTitle() != null && !request.getTitle().equals("")) {
            post.setTitle(request.getTitle());
        }

        if(request.getContent() != null && !request.getContent().equals("")) {
            post.setContent(request.getContent());
        }

        post.setUpdatedAt(LocalDateTime.now());

        postRepository.save(post);
        return postRepository.getPostById(post.getId());
    }

    public PostResponse createPost(CreatePostRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email);

        MultipartFile image = request.getImage();
        String imageUrl = null;
        if (image != null) {
            try {
                Map uploadResult = cloudinaryClient.uploader().upload(request.getImage().getBytes(),
                        com.cloudinary.utils.ObjectUtils.asMap("resource_type", "auto"));
                imageUrl = uploadResult.get("secure_url").toString();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image file", e);
            }
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .image(imageUrl)
                .content(request.getContent())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);
        return postRepository.getPostById(post.getId());
    }

    public void deletePost(Integer id) {
        Post post = getPostByIdOfAuthor(id);
        postRepository.delete(post);
    }

    private int parsePageNumber(String pageStr) {
        int page = 0;
        try {
            page = Integer.parseInt(pageStr) - 1;
            if (page < 0) {
                page = 0;
            }
        } catch (NumberFormatException e) {
            page = 0;
        }
        return page;
    }

    private Post getPostByIdOfAuthor(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        if(!post.getUser().getEmail().equals(email)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return post;
    }
}
